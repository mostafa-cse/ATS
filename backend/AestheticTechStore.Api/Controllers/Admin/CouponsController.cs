using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Infrastructure.Data;

namespace AestheticTechStore.Api.Controllers.Admin;

[ApiController]
[Route("api/admin/[controller]")]
[Authorize(Policy = "AdminOnly")]
public class CouponsController(ApplicationDbContext context) : ControllerBase
{
    // GET: api/admin/coupons
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Coupon>>> GetAll()
    {
        return await context.Coupons.ToListAsync();
    }

    // GET: api/admin/coupons/{id}
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Coupon>> Get(Guid id)
    {
        var coupon = await context.Coupons.FindAsync(id);
        if (coupon == null) return NotFound();
        return coupon;
    }

    // POST: api/admin/coupons
    [HttpPost]
    public async Task<ActionResult<Coupon>> Create(Coupon coupon)
    {
        if (await context.Coupons.AnyAsync(c => c.Code == coupon.Code))
            return BadRequest(new { message = "Coupon code already exists" });
        context.Coupons.Add(coupon);
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(Get), new { id = coupon.Id }, coupon);
    }

    // PUT: api/admin/coupons/{id}
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, Coupon updated)
    {
        if (id != updated.Id) return BadRequest();
        var coupon = await context.Coupons.FindAsync(id);
        if (coupon == null) return NotFound();
        // copy fields
        coupon.Code = updated.Code;
        coupon.Description = updated.Description;
        coupon.IsPercentage = updated.IsPercentage;
        coupon.DiscountValue = updated.DiscountValue;
        coupon.MaxUses = updated.MaxUses;
        coupon.MaxUsesPerUser = updated.MaxUsesPerUser;
        coupon.StartsAt = updated.StartsAt;
        coupon.ExpiresAt = updated.ExpiresAt;
        coupon.MinimumOrderAmount = updated.MinimumOrderAmount;
        coupon.AppliesToAllProducts = updated.AppliesToAllProducts;
        coupon.ProductIds = updated.ProductIds;
        coupon.CategoryIds = updated.CategoryIds;
        coupon.IsActive = updated.IsActive;
        await context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/admin/coupons/{id}
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var coupon = await context.Coupons.FindAsync(id);
        if (coupon == null) return NotFound();
        context.Coupons.Remove(coupon);
        await context.SaveChangesAsync();
        return NoContent();
    }
}
