using System;
using System.Collections.Generic;

namespace AestheticTechStore.Domain.Entities;

public class Brand
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? LogoUrl { get; set; }
    public string? WebsiteUrl { get; set; }
    public bool IsFeatured { get; set; }
    
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
