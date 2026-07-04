using System;
using AestheticTechStore.Domain.Enums;

namespace AestheticTechStore.Domain.Entities;

public class Order
{
    public Guid Id { get; set; }
    
    public string UserId { get; set; } = string.Empty;
    public AppUser? User { get; set; }
    
    public decimal TotalAmount { get; set; }
    public decimal AdvancePaid { get; set; }
    
    public PaymentMethod PaymentMethod { get; set; }
    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    
    public decimal ShippingFee { get; set; }
    
    public string? RiderId { get; set; }
    public AppUser? Rider { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public List<Product> Products { get; set; } = new();
}
