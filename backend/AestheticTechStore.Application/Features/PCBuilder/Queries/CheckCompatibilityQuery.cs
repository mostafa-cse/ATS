using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Domain.Enums;

namespace AestheticTechStore.Application.Features.PCBuilder.Queries;

public record CheckCompatibilityQuery(List<Product> SelectedComponents) : IRequest<CompatibilityResult>;

public class CompatibilityResult
{
    public bool IsCompatible { get; set; }
    public List<string> Warnings { get; set; } = new();
    public int TotalEstimatedWattage { get; set; }
}

public class CheckCompatibilityQueryHandler : IRequestHandler<CheckCompatibilityQuery, CompatibilityResult>
{
    public Task<CompatibilityResult> Handle(CheckCompatibilityQuery request, CancellationToken cancellationToken)
    {
        var result = new CompatibilityResult { IsCompatible = true };
        var components = request.SelectedComponents;
        
        // 1. Tally Total Power Supply Requirements
        result.TotalEstimatedWattage = components.Sum(c => c.RequiredWattage ?? 0);
        
        var categories = components.Select(c => c.Category.Name);
        var hasDuplicates = categories.GroupBy(x => x).Any(g => g.Count() > 1);
        if (hasDuplicates)
        {
            result.IsCompatible = false;
            result.Warnings.Add("Cannot have multiple components of the same category.");
            return Task.FromResult(result);
        }

        // Power Supply Check (Basic Example)
        var psu = components.FirstOrDefault(c => c.Category.Name == "PowerSupply");
        if (psu != null)
        {
            // Assuming RequiredWattage on a PSU actually denotes its capacity.
            if (psu.RequiredWattage.HasValue && psu.RequiredWattage.Value < result.TotalEstimatedWattage)
            {
                result.IsCompatible = false;
                result.Warnings.Add($"Selected Power Supply capacity ({psu.RequiredWattage}W) is lower than the estimated total wattage ({result.TotalEstimatedWattage}W).");
            }
        }
        else
        {
            result.Warnings.Add("No Power Supply selected.");
        }

        // CPU and Motherboard Socket Check
        var cpu = components.FirstOrDefault(c => c.Category.Name == "CPU");
        var mobo = components.FirstOrDefault(c => c.Category.Name == "Motherboard");

        if (cpu != null && mobo != null)
        {
            // DSA: O(1) lookup map (HashSet) for compatible sockets to avoid nested O(n^2) loops 
            // if we were matching multiple motherboards with multiple CPUs.
            var moboSupportedSockets = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            if (!string.IsNullOrEmpty(mobo.SocketType))
            {
                moboSupportedSockets.Add(mobo.SocketType);
            }

            if (!string.IsNullOrEmpty(cpu.SocketType) && !moboSupportedSockets.Contains(cpu.SocketType))
            {
                result.IsCompatible = false;
                result.Warnings.Add($"CPU Socket ({cpu.SocketType}) is not compatible with Motherboard Socket ({mobo.SocketType}).");
            }
        }

        return Task.FromResult(result);
    }
}
