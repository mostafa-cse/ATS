using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AestheticTechStore.Application.Interfaces;
using AestheticTechStore.Application.Interfaces.Repositories;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Domain.Enums;
using MediatR;

namespace AestheticTechStore.Application.Features.Orders.Commands;

public record PlaceOrderCommand(
    string UserId,
    List<Guid> ProductIds,
    PaymentMethod PaymentMethod,
    bool IsInsideDhaka,
    decimal AdvancePaid
) : IRequest<PlaceOrderResult>;

public class PlaceOrderResult
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public Guid? OrderId { get; set; }
}

public class PlaceOrderCommandHandler : IRequestHandler<PlaceOrderCommand, PlaceOrderResult>
{
    private readonly IOrderRepository _orderRepository;
    private readonly IProductRepository _productRepository;
    private readonly IUserRepository _userRepository;
    private readonly IEnumerable<IPaymentStrategy> _paymentStrategies;
    private readonly IEnumerable<IShippingStrategy> _shippingStrategies;

    public PlaceOrderCommandHandler(
        IOrderRepository orderRepository,
        IProductRepository productRepository,
        IUserRepository userRepository,
        IEnumerable<IPaymentStrategy> paymentStrategies,
        IEnumerable<IShippingStrategy> shippingStrategies)
    {
        _orderRepository = orderRepository;
        _productRepository = productRepository;
        _userRepository = userRepository;
        _paymentStrategies = paymentStrategies;
        _shippingStrategies = shippingStrategies;
    }

    public async Task<PlaceOrderResult> Handle(PlaceOrderCommand request, CancellationToken cancellationToken)
    {
        var products = await _productRepository.GetByIdsAsync(request.ProductIds);
        var productList = products.ToList();

        if (!productList.Any())
        {
            return new PlaceOrderResult { Success = false, Message = "No products found for the given IDs." };
        }

        // 1. Calculate Shipping Fee using Strategy
        var shippingStrategy = _shippingStrategies.FirstOrDefault(s => s.IsInsideDhaka == request.IsInsideDhaka);
        decimal shippingFee = shippingStrategy?.CalculateShippingFee(productList) ?? 0m;

        // 2. Calculate Total
        decimal subTotal = productList.Sum(p => p.DiscountPrice ?? p.RegularPrice);
        decimal totalAmount = subTotal + shippingFee;

        // 3. Create Order Entity using the Factory Pattern
        var order = AestheticTechStore.Domain.Factories.OrderFactory.CreateOrder(
            request.UserId,
            totalAmount,
            request.PaymentMethod,
            request.AdvancePaid,
            productList
        );

        // 4. Validate Payment using Strategy
        var paymentStrategy = _paymentStrategies.FirstOrDefault(s => s.Method == request.PaymentMethod);
        if (paymentStrategy != null)
        {
            var paymentResult = await paymentStrategy.ProcessPaymentAsync(order);
            if (!paymentResult.IsSuccess)
            {
                return new PlaceOrderResult { Success = false, Message = paymentResult.Message };
            }
        }

        // 5. Save Order
        var createdOrder = await _orderRepository.CreateOrderAsync(order);

        // 6. Award MegaCoins (1 coin per ৳100 spent)
        var user = await _userRepository.GetByIdAsync(request.UserId);
        if (user != null)
        {
            decimal coinsEarned = Math.Floor(totalAmount / 100);
            
            user.MegaCoinBalance += coinsEarned;
            await _userRepository.UpdateAsync(user);

            await _userRepository.AddMegaCoinTransactionAsync(new MegaCoinTransaction
            {
                Id = Guid.NewGuid(),
                AppUserId = user.Id,
                Amount = coinsEarned,
                Type = TransactionType.Earned,
                CreatedAt = DateTime.UtcNow,
                Description = $"Earned from Order {createdOrder.Id}"
            });
        }

        return new PlaceOrderResult 
        { 
            Success = true, 
            Message = "Order placed successfully.", 
            OrderId = createdOrder.Id 
        };
    }
}
