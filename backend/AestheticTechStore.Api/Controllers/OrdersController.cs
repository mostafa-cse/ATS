using System.Security.Claims;
using AestheticTechStore.Application.Features.Orders.Commands;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AestheticTechStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // Requires user to be logged in
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> PlaceOrder([FromBody] PlaceOrderDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrEmpty(userId)) return Unauthorized();

        var command = new PlaceOrderCommand(
            userId, 
            dto.ProductIds, 
            dto.PaymentMethod, 
            dto.IsInsideDhaka, 
            dto.AdvancePaid
        );

        var result = await _mediator.Send(command);

        if (!result.Success)
        {
            return BadRequest(new { result.Message });
        }

        return Ok(result);
    }
}

public class PlaceOrderDto
{
    public required List<Guid> ProductIds { get; set; }
    public AestheticTechStore.Domain.Enums.PaymentMethod PaymentMethod { get; set; }
    public bool IsInsideDhaka { get; set; }
    public decimal AdvancePaid { get; set; }
}
