using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Infrastructure.Data;

namespace AestheticTechStore.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class ProductsController(ApplicationDbContext context) : ControllerBase
{
    // GET: api/admin/products
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Product>>> GetAll()
    {
        return await context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Images)
            .ToListAsync();
    }

    // GET: api/admin/products/{id}
    [HttpGet("{id}")]
    public async Task<ActionResult<Product>> Get(Guid id)
    {
        var product = await context.Products
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Images)
            .FirstOrDefaultAsync(p => p.Id == id);
        if (product == null) return NotFound();
        return product;
    }

    // POST: api/admin/products
    [HttpPost]
    public async Task<ActionResult<Product>> Create([FromBody] CreateProductDto dto)
    {
        var product = new Product
        {
            Id = Guid.NewGuid(),
            SKU = dto.SKU,
            Name = dto.Name,
            ModelNumber = dto.ModelNumber,
            CategoryId = dto.CategoryId,
            BrandId = dto.BrandId,
            ShortDescription = dto.ShortDescription,
            FullDescription = dto.FullDescription,
            RegularPrice = dto.RegularPrice,
            DiscountPrice = dto.DiscountPrice,
            StockQuantity = dto.StockQuantity,
            StockStatus = dto.StockStatus,
            WarrantyInfo = dto.WarrantyInfo,
            GuarantyInfo = dto.GuarantyInfo,
            ReturnPolicy = dto.ReturnPolicy,
            ProductTags = dto.ProductTags,
            SeoTitle = dto.SeoTitle,
            SeoMetaDescription = dto.SeoMetaDescription,
            WeightInKg = dto.WeightInKg,
            Dimensions = dto.Dimensions,
            IsCouponEligible = dto.IsCouponEligible,
            MegaCoinReward = dto.MegaCoinReward,
            ProductStatus = dto.ProductStatus,
            IsFeatured = dto.IsFeatured,
            IsNewArrival = dto.IsNewArrival,
            IsBestSeller = dto.IsBestSeller,
            TechnicalSpecs = dto.TechnicalSpecs,
            SocketType = dto.SocketType,
            FormFactor = dto.FormFactor,
            RamType = dto.RamType,
            RequiredWattage = dto.RequiredWattage,
        };
        context.Products.Add(product);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = product.Id }, product);
    }

    // PUT: api/admin/products/{id}
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] UpdateProductDto dto)
    {
        if (id != dto.Id) return BadRequest();
        var product = await context.Products.FindAsync(id);
        if (product == null) return NotFound();
        // Update mutable fields
        product.SKU = dto.SKU;
        product.Name = dto.Name;
        product.ModelNumber = dto.ModelNumber;
        product.CategoryId = dto.CategoryId;
        product.BrandId = dto.BrandId;
        product.ShortDescription = dto.ShortDescription;
        product.FullDescription = dto.FullDescription;
        product.RegularPrice = dto.RegularPrice;
        product.DiscountPrice = dto.DiscountPrice;
        product.StockQuantity = dto.StockQuantity;
        product.StockStatus = dto.StockStatus;
        product.WarrantyInfo = dto.WarrantyInfo;
        product.GuarantyInfo = dto.GuarantyInfo;
        product.ReturnPolicy = dto.ReturnPolicy;
        product.ProductTags = dto.ProductTags;
        product.SeoTitle = dto.SeoTitle;
        product.SeoMetaDescription = dto.SeoMetaDescription;
        product.WeightInKg = dto.WeightInKg;
        product.Dimensions = dto.Dimensions;
        product.IsCouponEligible = dto.IsCouponEligible;
        product.MegaCoinReward = dto.MegaCoinReward;
        product.ProductStatus = dto.ProductStatus;
        product.IsFeatured = dto.IsFeatured;
        product.IsNewArrival = dto.IsNewArrival;
        product.IsBestSeller = dto.IsBestSeller;
        product.TechnicalSpecs = dto.TechnicalSpecs;
        product.SocketType = dto.SocketType;
        product.FormFactor = dto.FormFactor;
        product.RamType = dto.RamType;
        product.RequiredWattage = dto.RequiredWattage;
        product.UpdatedAt = DateTime.UtcNow;
        await context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/admin/products/{id}
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var product = await context.Products.FindAsync(id);
        if (product == null) return NotFound();
        context.Products.Remove(product);
        await context.SaveChangesAsync();
        return NoContent();
    }
}

public class CreateProductDto
{
    public string SKU { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ModelNumber { get; set; } = string.Empty;
    public Guid CategoryId { get; set; }
    public Guid BrandId { get; set; }
    public string ShortDescription { get; set; } = string.Empty;
    public string FullDescription { get; set; } = string.Empty;
    public decimal RegularPrice { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int StockQuantity { get; set; }
    public string StockStatus { get; set; } = "InStock";
    public string WarrantyInfo { get; set; } = string.Empty;
    public string? GuarantyInfo { get; set; }
    public string ReturnPolicy { get; set; } = "7 Days Replacement";
    public string ProductTags { get; set; } = string.Empty;
    public string SeoTitle { get; set; } = string.Empty;
    public string SeoMetaDescription { get; set; } = string.Empty;
    public decimal? WeightInKg { get; set; }
    public string? Dimensions { get; set; }
    public bool IsCouponEligible { get; set; } = true;
    public int MegaCoinReward { get; set; } = 0;
    public string ProductStatus { get; set; } = "Published";
    public bool IsFeatured { get; set; }
    public bool IsNewArrival { get; set; }
    public bool IsBestSeller { get; set; }
    public string TechnicalSpecs { get; set; } = "{}";
    public string? SocketType { get; set; }
    public string? FormFactor { get; set; }
    public string? RamType { get; set; }
    public int? RequiredWattage { get; set; }
}

public class UpdateProductDto : CreateProductDto
{
    public Guid Id { get; set; }
}
