using AestheticTechStore.Application.Interfaces.Services;
using Microsoft.AspNetCore.Mvc;

namespace AestheticTechStore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EMIController : ControllerBase
{
    private readonly IEMICalculatorService _emiService;

    public EMIController(IEMICalculatorService emiService)
    {
        _emiService = emiService;
    }

    [HttpGet("calculate/{amount}")]
    public IActionResult Calculate(decimal amount)
    {
        if (amount <= 10000)
        {
            return BadRequest(new { message = "EMI is only available for amounts greater than ৳10,000." });
        }

        var breakdown = _emiService.CalculateEMI(amount);
        return Ok(breakdown);
    }
}
