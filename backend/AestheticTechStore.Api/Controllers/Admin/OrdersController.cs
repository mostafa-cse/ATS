using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AestheticTechStore.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class OrdersController : ControllerBase
{
    // Mock orders list – replace with DB later
    private static readonly List<object> MockOrders = new()
    {
        new {
            id = Guid.NewGuid(),
            orderNumber = "ORD-1001",
            customerName = "John Doe",
            total = 249.99m,
            status = "Processing",
            createdAt = DateTime.UtcNow.AddDays(-2)
        },
        new {
            id = Guid.NewGuid(),
            orderNumber = "ORD-1002",
            customerName = "Jane Smith",
            total = 89.50m,
            status = "Shipped",
            createdAt = DateTime.UtcNow.AddDays(-5)
        }
    };

    // GET: api/admin/orders
    [HttpGet]
    public IActionResult GetAll()
    {
        return Ok(MockOrders);
    }

    // GET: api/admin/orders/{id}
    [HttpGet("{id:guid}")]
    public IActionResult Get(Guid id)
    {
        var order = MockOrders.FirstOrDefault(o => (Guid)o.GetType().GetProperty("id")!.GetValue(o)! == id);
        if (order == null) return NotFound();
        return Ok(order);
    }
}
