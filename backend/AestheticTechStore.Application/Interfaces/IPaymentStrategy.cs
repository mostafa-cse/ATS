using System.Threading.Tasks;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Domain.Enums;

namespace AestheticTechStore.Application.Interfaces;

public interface IPaymentStrategy
{
    PaymentMethod Method { get; }
    Task<PaymentResult> ProcessPaymentAsync(Order order);
}

public class PaymentResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; } = string.Empty;
    public decimal RequiredAdvance { get; set; }
}
