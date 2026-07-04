using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

using System.Linq;

namespace AestheticTechStore.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]

public class AnalyticsController : ControllerBase
{
    // GET: api/admin/analytics/summary
    [HttpGet("summary")]
    public IActionResult GetSummary()
    {
        // Placeholder data; replace with real DB queries.
        var summary = new
        {
            totalOrders = 1245,
            totalRevenue = 578920.50m,
            newCustomers = 312,
            averageOrderValue = 465.30m
        };
        return Ok(summary);
    }

    // GET: api/admin/analytics/orders-by-day
    [HttpGet("orders-by-day")]
    public IActionResult GetOrdersByDay()
    {
        var today = DateTime.UtcNow.Date;
        var random = new Random();
        var data = Enumerable.Range(0, 30)
            .Select(i => new
            {
                date = today.AddDays(-i).ToString("yyyy-MM-dd"),
                orders = random.Next(50, 200)
            })
            .OrderBy(d => d.date)
            .ToList();
        return Ok(data);
    }
}
