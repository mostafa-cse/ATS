using System.Collections.Generic;
using System.Threading.Tasks;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Domain.Enums;

namespace AestheticTechStore.Application.Interfaces.Repositories;

public interface IProductRepository
{
    Task<IEnumerable<Product>> GetProductsAsync(Category? category, string? brand);
    Task<Product?> GetByIdAsync(Guid id);
    Task<IEnumerable<Product>> GetByIdsAsync(IEnumerable<Guid> ids);
}
