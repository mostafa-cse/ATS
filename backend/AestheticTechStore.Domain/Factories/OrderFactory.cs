using System;
using System.Collections.Generic;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Domain.Enums;

namespace AestheticTechStore.Domain.Factories;

/// <summary>
/// Demonstrating the Factory Pattern for complex Order object instantiation.
/// </summary>
public static class OrderFactory
{
    public static Order CreateOrder(string userId, decimal totalAmount, PaymentMethod paymentMethod, decimal advancePaid, List<Product> products)
    {
        return new Order
        {
            Id = Guid.NewGuid(),
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            TotalAmount = totalAmount,
            Status = OrderStatus.Pending,
            PaymentMethod = paymentMethod,
            AdvancePaid = advancePaid,
            Products = products
        };
    }
}
