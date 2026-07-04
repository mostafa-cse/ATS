using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AestheticTechStore.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class UsersController : ControllerBase
{
    // Mock users – replace with real DB later
    private static readonly List<object> MockUsers = new()
    {
        new {
            id = Guid.NewGuid(),
            email = "john.doe@example.com",
            fullName = "John Doe",
            role = "Customer",
            isActive = true,
            createdAt = DateTime.UtcNow.AddMonths(-3)
        },
        new {
            id = Guid.NewGuid(),
            email = "admin@example.com",
            fullName = "Admin User",
            role = "Admin",
            isActive = true,
            createdAt = DateTime.UtcNow.AddMonths(-6)
        },
        new {
            id = Guid.NewGuid(),
            email = "jane.smith@example.com",
            fullName = "Jane Smith",
            role = "Customer",
            isActive = false,
            createdAt = DateTime.UtcNow.AddMonths(-1)
        }
    };

    // GET: api/admin/users
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(MockUsers);
    }

    // GET: api/admin/users/{id}
    [HttpGet("{id:guid}")]
    public IActionResult Get(Guid id)
    {
        var user = MockUsers.FirstOrDefault(u => (Guid)u.GetType().GetProperty("id")!.GetValue(u)! == id);
        if (user == null) return NotFound();
        return Ok(user);
    }
}
