using System.Threading.Tasks;
using AestheticTechStore.Domain.Entities;

namespace AestheticTechStore.Application.Interfaces.Repositories;

public interface IOrderRepository
{
    Task<Order> CreateOrderAsync(Order order);
}
