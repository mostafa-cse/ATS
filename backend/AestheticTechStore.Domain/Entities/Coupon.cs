// backend/AestheticTechStore.Domain/Entities/Coupon.cs
using System;
using System.Collections.Generic;

namespace AestheticTechStore.Domain.Entities;

public class Coupon
{
    public Guid Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsPercentage { get; set; }
    public decimal DiscountValue { get; set; }
    public int MaxUses { get; set; }
    public int MaxUsesPerUser { get; set; }
    public DateTime StartsAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
    public decimal MinimumOrderAmount { get; set; }
    public bool AppliesToAllProducts { get; set; }
    public List<Guid> ProductIds { get; set; } = new();
    public List<Guid> CategoryIds { get; set; } = new();
    public bool IsActive { get; set; } = true;
}
