using System;
using System.Collections.Generic;

namespace AestheticTechStore.Domain.Entities;

public class Product
{
    public Guid Id { get; set; }
    public string SKU { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ModelNumber { get; set; } = string.Empty;
    
    // Relationships
    public Guid CategoryId { get; set; }
    public ProductCategory Category { get; set; } = null!;
    
    public Guid BrandId { get; set; }
    public Brand Brand { get; set; } = null!;
    
    // Media
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public string? VideoUrl { get; set; }
    
    // Descriptions
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    
    // Pricing
    public decimal RegularPrice { get; set; }
    public decimal? DiscountPrice { get; set; }
    
    // Inventory
    public int StockQuantity { get; set; }
    public string StockStatus { get; set; } = "InStock"; // InStock, OutOfStock, PreOrder
    
    // Policies
    public string WarrantyInfo { get; set; } = string.Empty; // e.g. "3 Years Official"
    public string? GuarantyInfo { get; set; }
    public string ReturnPolicy { get; set; } = "7 Days Replacement"; 
    
    // Discovery & SEO
    public string ProductTags { get; set; } = string.Empty; // Comma separated
    public string SeoTitle { get; set; } = string.Empty;
    public string SeoMetaDescription { get; set; } = string.Empty;
    
    // Shipping
    public decimal? WeightInKg { get; set; }
    public string? Dimensions { get; set; } // L x W x H
    
    // Promotions
    public bool IsCouponEligible { get; set; } = true;
    public int MegaCoinReward { get; set; } = 0; // Coins earned on purchase
    
    // Display Flags
    public string ProductStatus { get; set; } = "Published"; // Published, Draft, Archived
    public bool IsFeatured { get; set; }
    public bool IsNewArrival { get; set; }
    public bool IsBestSeller { get; set; }
    
    // Timestamps
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    
    // Specifications & PC Builder
    // Using JSONB in PostgreSQL to store dynamic Key-Value specs
    public string TechnicalSpecs { get; set; } = "{}"; 
    
    // Dedicated PC Builder filter fields
    public string? SocketType { get; set; } // For CPU/Mobo matching
    public string? FormFactor { get; set; } // ATX, Micro-ATX etc
    public string? RamType { get; set; } // DDR4, DDR5
    public int? RequiredWattage { get; set; } // For PSU calculation
}
