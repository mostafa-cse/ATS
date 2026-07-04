using System.Threading.Tasks;
using AestheticTechStore.Application.Interfaces.Repositories;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Infrastructure.Data;

namespace AestheticTechStore.Infrastructure.Repositories;

public class OrderRepository : IOrderRepository
{
    private readonly ApplicationDbContext _context;

    public OrderRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<Order> CreateOrderAsync(Order order)
    {
        _context.Orders.Add(order);
        await _context.SaveChangesAsync();
        return order;
    }
}
