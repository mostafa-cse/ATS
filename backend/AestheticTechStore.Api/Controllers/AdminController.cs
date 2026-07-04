using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AestheticTechStore.Domain.Enums;

namespace AestheticTechStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class AdminController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<AppUser> _userManager;

    public AdminController(ApplicationDbContext context, UserManager<AppUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    [HttpGet("dashboard-stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var totalOrders = await _context.Orders.CountAsync();
        var revenue = await _context.Orders.SumAsync(o => o.TotalAmount);
        var pending = await _context.Orders.CountAsync(o => o.Status == OrderStatus.Pending);

        return Ok(new
        {
            TotalOrders = totalOrders,
            Revenue = revenue,
            PendingVerifications = pending
        });
    }

    // --- ORDERS API ---

    [HttpGet("orders")]
    public async Task<IActionResult> GetOrders()
    {
        var orders = await _context.Orders
            .Include(o => o.User)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new {
                id = o.Id,
                orderNumber = o.Id.ToString().Substring(0, 8).ToUpper(),
                customerName = o.User != null ? o.User.FullName : "Unknown",
                phone = o.User != null ? o.User.PhoneNumber : "N/A",
                totalAmount = o.TotalAmount,
                advancePaid = o.AdvancePaid,
                status = o.Status.ToString(),
                date = o.CreatedAt.ToString("yyyy-MM-dd")
            })
            .ToListAsync();
            
        return Ok(orders);
    }

    [HttpPut("orders/{id}/status")]
    public async Task<IActionResult> UpdateOrderStatus(Guid id, [FromBody] UpdateStatusDto dto)
    {
        var order = await _context.Orders.FindAsync(id);
        if (order == null) return NotFound();

        if (Enum.TryParse<OrderStatus>(dto.Status, true, out var newStatus))
        {
            order.Status = newStatus;
            await _context.SaveChangesAsync();
            return Ok(new { Message = "Status updated" });
        }
        
        return BadRequest("Invalid status");
    }

    // --- LOGISTICS API ---

    [HttpGet("riders")]
    public async Task<IActionResult> GetRiders()
    {
        var riders = await _userManager.GetUsersInRoleAsync("Rider");
        var result = riders.Select(r => new {
            id = r.Id,
            name = r.FullName,
            phone = r.PhoneNumber,
            activeDeliveries = _context.Orders.Count(o => o.RiderId == r.Id && (o.Status == OrderStatus.Dispatched))
        });
        return Ok(result);
    }

    [HttpGet("shipments")]
    public async Task<IActionResult> GetShipments()
    {
        var shipments = await _context.Orders
            .Include(o => o.User)
            .Where(o => o.Status == OrderStatus.Verified || o.Status == OrderStatus.Dispatched || o.Status == OrderStatus.Delivered)
            .OrderByDescending(o => o.CreatedAt)
            .Select(o => new {
                id = o.Id.ToString().Substring(0, 8).ToUpper(),
                originalId = o.Id,
                customer = o.User != null ? o.User.FullName : "Unknown",
                address = "Address not stored in order entity directly yet",
                amount = o.TotalAmount,
                assignedTo = o.RiderId,
                status = o.Status.ToString()
            })
            .ToListAsync();
            
        return Ok(shipments);
    }

    [HttpPost("assign-logistics")]
    public async Task<IActionResult> AssignLogistics([FromBody] AssignRiderDto dto)
    {
        var order = await _context.Orders.FindAsync(dto.OrderId);
        if (order == null) return NotFound();

        order.RiderId = dto.RiderId;
        order.Status = OrderStatus.Dispatched;
        await _context.SaveChangesAsync();

        return Ok(new { Message = "Rider successfully assigned." });
    }

    // --- USERS API ---

    [HttpGet("users")]
    public async Task<IActionResult> GetUsers()
    {
        var users = await _context.Users.ToListAsync();
        var userList = new List<object>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            userList.Add(new {
                id = user.Id,
                name = user.FullName,
                email = user.Email,
                role = roles.FirstOrDefault() ?? "User",
                joined = "2023-10-01" // Simplification
            });
        }
        return Ok(userList);
    }

    [HttpPost("invite-user")]
    public async Task<IActionResult> InviteUser([FromBody] InviteUserDto dto)
    {
        var user = new AppUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.Name.Split(' ').FirstOrDefault() ?? dto.Name,
            LastName = dto.Name.Split(' ').Skip(1).FirstOrDefault() ?? string.Empty,
            PhoneNumber = "01000000000" // Default dummy phone
        };

        var result = await _userManager.CreateAsync(user, "TempPass123!");
        if (result.Succeeded)
        {
            if (dto.Role == "Admin" || dto.Role == "Rider" || dto.Role == "User")
            {
                await _userManager.AddToRoleAsync(user, dto.Role);
            }
            return Ok(new { Message = "User created successfully" });
        }
        
        return BadRequest(result.Errors);
    }
}

public class UpdateStatusDto { public string Status { get; set; } = string.Empty; }
public class AssignRiderDto { public Guid OrderId { get; set; } public string RiderId { get; set; } = string.Empty; }
public class InviteUserDto { public string Name { get; set; } = string.Empty; public string Email { get; set; } = string.Empty; public string Role { get; set; } = string.Empty; }
