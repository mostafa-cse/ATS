using System.Threading.Tasks;
using AestheticTechStore.Domain.Entities;

namespace AestheticTechStore.Application.Interfaces.Repositories;

public interface IUserRepository
{
    Task<AppUser?> GetByIdAsync(string id);
    Task UpdateAsync(AppUser user);
    Task AddMegaCoinTransactionAsync(MegaCoinTransaction transaction);
}
