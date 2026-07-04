using System.Threading.Tasks;
using AestheticTechStore.Application.Interfaces.Repositories;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Infrastructure.Data;

namespace AestheticTechStore.Infrastructure.Repositories;

public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<AppUser?> GetByIdAsync(string id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task UpdateAsync(AppUser user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task AddMegaCoinTransactionAsync(MegaCoinTransaction transaction)
    {
        _context.MegaCoinTransactions.Add(transaction);
        await _context.SaveChangesAsync();
    }
}
