using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace AestheticTechStore.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class DataImportController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<DataImportController> _logger;

    public DataImportController(ApplicationDbContext context, ILogger<DataImportController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpPost("run")]
    public async Task<IActionResult> RunImport()
    {
        try
        {
            var filePath = "/Users/mostafakamal/Project/Asthetic Tech Store/Product Data/products/unique_products.json";
            if (!System.IO.File.Exists(filePath))
            {
                return NotFound($"File not found at {filePath}");
            }

            var jsonContent = await System.IO.File.ReadAllTextAsync(filePath);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                NumberHandling = JsonNumberHandling.AllowReadingFromString
            };

            var productsData = JsonSerializer.Deserialize<List<ProductJson>>(jsonContent, options);
            if (productsData == null || !productsData.Any())
            {
                return BadRequest("No products found in JSON.");
            }

            // Extract unique brands
            var uniqueBrands = productsData
                .Where(p => !string.IsNullOrWhiteSpace(p.brand))
                .Select(p => p.brand.Trim())
                .Distinct()
                .ToList();

            // Extract unique categories
            var uniqueCategories = productsData
                .Where(p => !string.IsNullOrWhiteSpace(p.category))
                .Select(p => p.category.Trim())
                .Distinct()
                .ToList();

            // Insert Brands
            var existingBrands = await _context.Brands.ToDictionaryAsync(b => b.Name.ToLower());
            var newBrands = new List<Brand>();
            foreach (var b in uniqueBrands)
            {
                if (!existingBrands.ContainsKey(b.ToLower()))
                {
                    var brandEntity = new Brand { Id = Guid.NewGuid(), Name = b };
                    newBrands.Add(brandEntity);
                    existingBrands[b.ToLower()] = brandEntity;
                }
            }
            if (newBrands.Any())
            {
                _context.Brands.AddRange(newBrands);
                await _context.SaveChangesAsync();
            }
            
            // Insert default empty brand for products with no brand
            if (!existingBrands.ContainsKey("unknown"))
            {
                var unknownBrand = new Brand { Id = Guid.NewGuid(), Name = "Unknown" };
                _context.Brands.Add(unknownBrand);
                await _context.SaveChangesAsync();
                existingBrands["unknown"] = unknownBrand;
            }

            // Insert Categories
            var existingCategories = await _context.Categories.ToDictionaryAsync(c => c.Name.ToLower());
            var newCategories = new List<ProductCategory>();
            foreach (var c in uniqueCategories)
            {
                if (!existingCategories.ContainsKey(c.ToLower()))
                {
                    var catEntity = new ProductCategory { Id = Guid.NewGuid(), Name = c, IsActive = true };
                    newCategories.Add(catEntity);
                    existingCategories[c.ToLower()] = catEntity;
                }
            }
            if (newCategories.Any())
            {
                _context.Categories.AddRange(newCategories);
                await _context.SaveChangesAsync();
            }

            // Insert default empty category for products with no category
            if (!existingCategories.ContainsKey("uncategorized"))
            {
                var unknownCat = new ProductCategory { Id = Guid.NewGuid(), Name = "Uncategorized", IsActive = true };
                _context.Categories.Add(unknownCat);
                await _context.SaveChangesAsync();
                existingCategories["uncategorized"] = unknownCat;
            }

            // Now insert products
            var existingSkusList = await _context.Products.Select(p => p.SKU).ToListAsync();
            var existingSkus = existingSkusList.ToHashSet();
            var newProducts = new List<Product>();
            
            int batchSize = 1000;
            int insertedCount = 0;

            foreach (var p in productsData)
            {
                var sku = p.id ?? Guid.NewGuid().ToString();
                if (existingSkus.Contains(sku))
                {
                    continue; // Skip existing
                }

                var brandKey = string.IsNullOrWhiteSpace(p.brand) ? "unknown" : p.brand.Trim().ToLower();
                var catKey = string.IsNullOrWhiteSpace(p.category) ? "uncategorized" : p.category.Trim().ToLower();

                var product = new Product
                {
                    Id = Guid.NewGuid(),
                    SKU = sku,
                    Name = p.name ?? "Unnamed Product",
                    ModelNumber = p.model ?? string.Empty,
                    BrandId = existingBrands.GetValueOrDefault(brandKey)?.Id ?? existingBrands["unknown"].Id,
                    CategoryId = existingCategories.GetValueOrDefault(catKey)?.Id ?? existingCategories["uncategorized"].Id,
                    ShortDescription = string.Empty,
                    FullDescription = string.Empty,
                    RegularPrice = p.price_bdt ?? 0m,
                    DiscountPrice = p.regular_price,
                    StockQuantity = p.in_stock ? 100 : 0,
                    StockStatus = p.in_stock ? "InStock" : "OutOfStock",
                    WarrantyInfo = string.Empty,
                    ReturnPolicy = "7 Days Replacement",
                    ProductTags = string.Empty,
                    SeoTitle = p.name ?? "Unnamed Product",
                    SeoMetaDescription = string.Empty,
                    IsCouponEligible = true,
                    ProductStatus = "Published",
                    CreatedAt = DateTime.UtcNow,
                    TechnicalSpecs = JsonSerializer.Serialize(p.specifications ?? new Dictionary<string, object>()),
                    Images = new List<ProductImage>()
                };

                if (!string.IsNullOrWhiteSpace(p.image_url))
                {
                    product.Images.Add(new ProductImage
                    {
                        Id = Guid.NewGuid(),
                        ProductId = product.Id,
                        ImageUrl = p.image_url,
                        IsPrimary = true
                    });
                }

                newProducts.Add(product);
                existingSkus.Add(sku);

                if (newProducts.Count >= batchSize)
                {
                    _context.Products.AddRange(newProducts);
                    await _context.SaveChangesAsync();
                    insertedCount += newProducts.Count;
                    newProducts.Clear();
                }
            }

            if (newProducts.Any())
            {
                _context.Products.AddRange(newProducts);
                await _context.SaveChangesAsync();
                insertedCount += newProducts.Count;
            }

            return Ok(new { Message = $"Import completed successfully. Inserted {insertedCount} new products." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error importing data");
            return StatusCode(500, new { Error = ex.Message, StackTrace = ex.StackTrace });
        }
    }

    [HttpPost("standardize-categories")]
    public async Task<IActionResult> StandardizeCategories()
    {
        try
        {
            var categoryMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "processor", "CPU" },
                { "component_processor", "CPU" },
                { "graphics_card", "GPU" },
                { "component_graphics_card", "GPU" },
                { "motherboard", "Motherboard" },
                { "component_motherboard", "Motherboard" },
                { "desktop_ram", "RAM" },
                { "internal_hdd", "Storage" },
                { "internal_ssd", "Storage" },
                { "external_hdd", "Storage" },
                { "external_ssd", "Storage" },
                { "component_hdd", "Storage" },
                { "power_supply", "PowerSupply" },
                { "component_power_supply", "PowerSupply" },
                { "casing", "Case" },
                { "component_casing", "Case" },
                { "cpu_cooler", "Cooler" },
                { "component_cooler", "Cooler" },
                { "casing_fan", "Cooler" },
                { "monitor", "Monitor" },
                { "networking_router", "Networking" },
                { "networking_switch", "Networking" },
                { "networking_access_point", "Networking" },
                { "accessories", "Accessories" },
                { "keyboard", "Accessories" },
                { "mouse", "Accessories" },
                { "mouse_pad", "Accessories" },
                { "earphone", "Accessories" },
                { "earbuds", "Accessories" },
                { "neckband", "Accessories" },
                { "keyboard_mouse_combo", "Accessories" },
                { "pen_drive", "Accessories" },
                { "memory_card", "Accessories" }
            };

            var existingCategories = await _context.Categories.ToListAsync();
            var products = await _context.Products.ToListAsync();
            
            var categoryIdUpdates = new Dictionary<Guid, Guid>();
            var newStandardCategories = new Dictionary<string, ProductCategory>(StringComparer.OrdinalIgnoreCase);
            
            foreach (var category in existingCategories)
            {
                string standardName;
                if (categoryMap.TryGetValue(category.Name, out var mapped))
                {
                    standardName = mapped;
                }
                else if (!string.IsNullOrWhiteSpace(category.Name))
                {
                    var textInfo = new System.Globalization.CultureInfo("en-US", false).TextInfo;
                    standardName = textInfo.ToTitleCase(category.Name.ToLower().Replace("_", " "));
                }
                else
                {
                    standardName = "Uncategorized";
                }
                
                if (!newStandardCategories.ContainsKey(standardName))
                {
                    var existingStandard = existingCategories.FirstOrDefault(c => c.Name.Equals(standardName, StringComparison.OrdinalIgnoreCase));
                    if (existingStandard != null)
                    {
                        existingStandard.Name = standardName; // Update name case
                        newStandardCategories[standardName] = existingStandard;
                    }
                    else
                    {
                        var newCat = new ProductCategory { Id = Guid.NewGuid(), Name = standardName, IsActive = true };
                        _context.Categories.Add(newCat);
                        newStandardCategories[standardName] = newCat;
                    }
                }
                
                categoryIdUpdates[category.Id] = newStandardCategories[standardName].Id;
            }

            await _context.SaveChangesAsync();
            
            int updateCount = 0;
            foreach (var product in products)
            {
                if (categoryIdUpdates.TryGetValue(product.CategoryId, out var newCategoryId))
                {
                    if (product.CategoryId != newCategoryId)
                    {
                        product.CategoryId = newCategoryId;
                        updateCount++;
                    }
                }
            }
            
            await _context.SaveChangesAsync();

            var usedCategoryIds = await _context.Products.Select(p => p.CategoryId).Distinct().ToListAsync();
            var unusedCategories = await _context.Categories.Where(c => !usedCategoryIds.Contains(c.Id)).ToListAsync();
            
            if (unusedCategories.Any())
            {
                _context.Categories.RemoveRange(unusedCategories);
                await _context.SaveChangesAsync();
            }

            return Ok(new { Message = $"Standardization complete. Updated {updateCount} products. Cleaned up {unusedCategories.Count} unused categories." });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error standardizing categories");
            return StatusCode(500, new { Error = ex.Message, StackTrace = ex.StackTrace });
        }
    }

    public class ProductJson
    {
        public string? id { get; set; }
        public string? name { get; set; }
        public string? brand { get; set; }
        public string? model { get; set; }
        public string? category { get; set; }
        public string? source { get; set; }
        public string? url { get; set; }
        public string? slug { get; set; }
        public string? product_code { get; set; }
        public decimal? price_bdt { get; set; }
        public string? price_text { get; set; }
        public decimal? regular_price { get; set; }
        public string? image_url { get; set; }
        public Dictionary<string, object>? specifications { get; set; }
        public bool in_stock { get; set; }
    }
}
