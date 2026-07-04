using AestheticTechStore.Application.Features.PCBuilder.Queries;
using AestheticTechStore.Application.Interfaces.Repositories;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace AestheticTechStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PCBuilderController : ControllerBase
{
    private readonly IMediator _mediator;
    private readonly IProductRepository _productRepository;

    public PCBuilderController(IMediator mediator, IProductRepository productRepository)
    {
        _mediator = mediator;
        _productRepository = productRepository;
    }

    [HttpPost("check-compatibility")]
    public async Task<IActionResult> CheckCompatibility([FromBody] List<Guid> componentIds)
    {
        if (componentIds == null || !componentIds.Any())
        {
            return BadRequest("No components provided.");
        }

        var products = await _productRepository.GetByIdsAsync(componentIds);
        
        var query = new CheckCompatibilityQuery(products.ToList());
        var result = await _mediator.Send(query);

        return Ok(result);
    }
}
