using AestheticTechStore.Domain.Entities;

namespace AestheticTechStore.Application.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUser user, IList<string> roles);
}
