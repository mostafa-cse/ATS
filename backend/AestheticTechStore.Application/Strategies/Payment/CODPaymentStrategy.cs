using System.Threading.Tasks;
using AestheticTechStore.Application.Interfaces;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Domain.Enums;

namespace AestheticTechStore.Application.Strategies.Payment;

public class CODPaymentStrategy : IPaymentStrategy
{
    public PaymentMethod Method => PaymentMethod.CashOnDelivery;

    public Task<PaymentResult> ProcessPaymentAsync(Order order)
    {
        var result = new PaymentResult { IsSuccess = true, Message = "COD Approved." };

        // MFS Partial Advance Enforcement: 10% advance via MFS if > 10,000
        if (order.TotalAmount > 10000)
        {
            var requiredAdvance = order.TotalAmount * 0.10m;
            if (order.AdvancePaid < requiredAdvance)
            {
                result.IsSuccess = false;
                result.RequiredAdvance = requiredAdvance;
                result.Message = $"Order exceeds ৳10,000. A 10% advance payment of ৳{requiredAdvance} via MFS is strictly required.";
            }
        }

        return Task.FromResult(result);
    }
}
