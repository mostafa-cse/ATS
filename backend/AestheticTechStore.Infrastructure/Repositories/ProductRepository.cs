using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AestheticTechStore.Application.Interfaces.Repositories;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Domain.Enums;
using AestheticTechStore.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace AestheticTechStore.Infrastructure.Repositories;

public class ProductRepository : IProductRepository
{
    private readonly ApplicationDbContext _context;

    public ProductRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Product?> GetByIdAsync(Guid id)
    {
        return await _context.Products.FindAsync(id);
    }

    public async Task<IEnumerable<Product>> GetByIdsAsync(IEnumerable<Guid> ids)
    {
        return await _context.Products.Where(p => ids.Contains(p.Id)).ToListAsync();
    }

    public async Task<IEnumerable<Product>> GetProductsAsync(Category? category, string? brand)
    {
        var query = _context.Products.AsQueryable();

        if (category.HasValue)
        {
            query = query.Where(p => p.Category.Name == category.Value.ToString());
        }

        if (!string.IsNullOrEmpty(brand))
        {
            query = query.Where(p => p.Brand.Name.ToLower() == brand.ToLower());
        }

        return await query
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .Include(p => p.Images)
            .ToListAsync();
    }
}
