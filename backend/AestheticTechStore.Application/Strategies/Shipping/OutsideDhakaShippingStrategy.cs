using System.Collections.Generic;
using System.Linq;
using AestheticTechStore.Application.Interfaces;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Domain.Enums;

namespace AestheticTechStore.Application.Strategies.Shipping;

public class OutsideDhakaShippingStrategy : IShippingStrategy
{
    public bool IsInsideDhaka => false;

    public decimal CalculateShippingFee(List<Product> products)
    {
        // Outside Dhaka: higher base rate + volumetric weight logic for heavy items
        decimal baseRate = 120m;
        
        // Check if there are any heavy/large items
        var heavyCategories = new HashSet<string> { "Case", "Monitor", "PowerSupply" };
        
        bool hasHeavyItems = products.Any(p => heavyCategories.Contains(p.Category.Name));
        
        int heavyItemCount = products.Count(p => heavyCategories.Contains(p.Category.Name));
        
        // Add 50 for each heavy item
        return baseRate + (heavyItemCount * 50m);
    }
}
