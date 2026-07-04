using AestheticTechStore.Application.Features.Products.Queries;
using AestheticTechStore.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AestheticTechStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetProducts([FromQuery] Category? category, [FromQuery] string? brand)
    {
        var query = new GetProductsQuery(category, brand);
        var products = await _mediator.Send(query);
        return Ok(products);
    }
}
