using System.Security.Claims;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Domain.Enums;
using AestheticTechStore.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AestheticTechStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin,Rider")] // Allow Admin and Rider
public class RiderController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<AppUser> _userManager;

    public RiderController(ApplicationDbContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var riderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(riderId)) return Unauthorized();

        var user = await _userManager.FindByIdAsync(riderId);
        if (user == null) return NotFound("User not found");

        return Ok(new
        {
            Id = user.Id,
            Name = user.FirstName + " " + user.LastName,
            ShortId = "RDR-" + user.Id.Substring(0, 4).ToUpper()
        });
    }

    [HttpGet("deliveries/active")]
    public async Task<IActionResult> GetActiveDeliveries()
    {
        var riderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(riderId)) return Unauthorized();

        var deliveries = await _context.Orders
            .Include(o => o.User)
            .Where(o => o.RiderId == riderId && o.Status == OrderStatus.Dispatched)
            .OrderBy(o => o.CreatedAt)
            .Select(o => new
            {
                Id = o.Id.ToString().Substring(0, 8).ToUpper(),
                FullId = o.Id,
                CustomerName = o.User != null ? o.User.FirstName + " " + o.User.LastName : "Unknown Customer",
                CustomerPhone = "01700000000", // Placeholder until Address model has phone
                Address = "Customer Address (Pending DB Mapping)", // Placeholder
                AmountToCollect = o.PaymentMethod == PaymentMethod.CashOnDelivery ? (o.TotalAmount + o.ShippingFee - o.AdvancePaid) : 0,
                Date = o.CreatedAt.ToString("yyyy-MM-dd HH:mm")
            })
            .ToListAsync();

        return Ok(deliveries);
    }

    [HttpGet("deliveries/history")]
    public async Task<IActionResult> GetDeliveryHistory()
    {
        var riderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(riderId)) return Unauthorized();

        var deliveries = await _context.Orders
            .Include(o => o.User)
            .Where(o => o.RiderId == riderId && (o.Status == OrderStatus.Delivered || o.Status == OrderStatus.Cancelled))
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                Id = o.Id.ToString().Substring(0, 8).ToUpper(),
                CustomerName = o.User != null ? o.User.FirstName + " " + o.User.LastName : "Unknown Customer",
                Status = o.Status.ToString(),
                Date = o.CreatedAt.ToString("yyyy-MM-dd")
            })
            .ToListAsync();

        return Ok(deliveries);
    }

    [HttpPut("deliveries/{id}/complete")]
    public async Task<IActionResult> CompleteDelivery(Guid id)
    {
        var riderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(riderId)) return Unauthorized();

        var order = await _context.Orders.FirstOrDefaultAsync(o => o.Id == id && o.RiderId == riderId);
        if (order == null) return NotFound("Order not found or not assigned to you.");
        
        if (order.Status != OrderStatus.Dispatched)
            return BadRequest("Order is not currently dispatched.");

        order.Status = OrderStatus.Delivered;
        await _context.SaveChangesAsync();

        return Ok(new { message = "Delivery marked as completed." });
    }

    [HttpGet("ledger")]
    public async Task<IActionResult> GetLedger()
    {
        var riderId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(riderId)) return Unauthorized();

        var completedDeliveries = await _context.Orders
            .Where(o => o.RiderId == riderId && o.Status == OrderStatus.Delivered)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new
            {
                Id = o.Id.ToString().Substring(0, 8).ToUpper(),
                Date = o.CreatedAt.ToString("yyyy-MM-dd"),
                Description = "Delivery Fee for Order #" + o.Id.ToString().Substring(0, 8).ToUpper(),
                Amount = 50 // Default 50 Taka per delivery
            })
            .ToListAsync();

        var totalEarnings = completedDeliveries.Sum(d => d.Amount);

        return Ok(new
        {
            TotalEarnings = totalEarnings,
            Transactions = completedDeliveries
        });
    }
}
