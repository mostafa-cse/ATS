using System;
using System.Collections.Generic;

namespace AestheticTechStore.Domain.Entities;

public class ProductCategory
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ImageUrl { get; set; }
    public string? IconUrl { get; set; }
    public bool IsActive { get; set; } = true;

    // Self-referencing for hierarchical categories (Main > Sub > Child)
    public Guid? ParentCategoryId { get; set; }
    public ProductCategory? ParentCategory { get; set; }
    public ICollection<ProductCategory> SubCategories { get; set; } = new List<ProductCategory>();
    
    public ICollection<Product> Products { get; set; } = new List<Product>();
}
