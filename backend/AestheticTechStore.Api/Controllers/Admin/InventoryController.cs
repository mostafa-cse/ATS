using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;

namespace AestheticTechStore.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class InventoryController : ControllerBase
{
    // In a real app, inject a DbContext/service. Here we return mock data.

    // GET: api/admin/inventory
    [HttpGet]
    public IActionResult GetAll()
    {
        var products = new List<object>
        {
            new {
                id = Guid.NewGuid(),
                sku = "SKU001",
                name = "Sample Product",
                price = 199.99m,
                stock = 35,
                isActive = true
            },
            new {
                id = Guid.NewGuid(),
                sku = "SKU002",
                name = "Another Product",
                price = 49.50m,
                stock = 0,
                isActive = false
            }
        };
        return Ok(products);
    }

    // GET: api/admin/inventory/{id}
    [HttpGet("{id:guid}")]
    public IActionResult Get(Guid id)
    {
        // Return a placeholder; replace with DB lookup later.
        var product = new {
            id,
            sku = "SKU001",
            name = "Sample Product",
            price = 199.99m,
            stock = 35,
            isActive = true
        };
        return Ok(product);
    }

    // POST: api/admin/inventory
    [HttpPost]
    public IActionResult Create([FromBody] dynamic payload)
    {
        // In production validate payload and persist.
        return Created("", payload);
    }

    // PUT: api/admin/inventory/{id}
    [HttpPut("{id:guid}")]
    public IActionResult Update(Guid id, [FromBody] dynamic payload)
    {
        // Mock update.
        return Ok(payload);
    }

    // DELETE: api/admin/inventory/{id}
    [HttpDelete("{id:guid}")]
    public IActionResult Delete(Guid id)
    {
        // Mock delete.
        return NoContent();
    }
}
