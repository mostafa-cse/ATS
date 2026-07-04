using System.Security.Claims;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AestheticTechStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires user to be logged in (any role)
public class UserController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<AppUser> _userManager;

    public UserController(ApplicationDbContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null) return NotFound("User not found");

        var roles = await _userManager.GetRolesAsync(user);

        return Ok(new
        {
            Id = user.Id,
            Name = user.FullName,
            Email = user.Email,
            MegaCoinBalance = user.MegaCoinBalance,
            Role = roles.FirstOrDefault() ?? "User"
        });
    }

    [HttpGet("orders")]
    public async Task<IActionResult> GetMyOrders()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var orders = await _context.Orders
            .Where(o => o.UserId == userId)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                Id = o.Id.ToString().Substring(0, 8).ToUpper(),
                Date = o.CreatedAt.ToString("yyyy-MM-dd"),
                TotalAmount = o.TotalAmount,
                Status = o.Status.ToString(),
                ItemsCount = o.Products.Count
            })
            .ToListAsync();

        return Ok(orders);
    }

    [HttpGet("megacoins")]
    public async Task<IActionResult> GetMyMegaCoins()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var transactions = await _context.MegaCoinTransactions
            .Where(t => t.AppUserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new
            {
                Id = t.Id.ToString().Substring(0, 8).ToUpper(),
                Date = t.CreatedAt.ToString("yyyy-MM-dd"),
                Description = t.Description,
                Amount = t.Amount,
                Type = t.Type.ToString() // E.g., Earned, Spent
            })
            .ToListAsync();

        return Ok(transactions);
    }
}
