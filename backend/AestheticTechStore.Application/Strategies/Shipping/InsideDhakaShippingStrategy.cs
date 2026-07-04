using System.Collections.Generic;
using AestheticTechStore.Application.Interfaces;
using AestheticTechStore.Domain.Entities;

namespace AestheticTechStore.Application.Strategies.Shipping;

public class InsideDhakaShippingStrategy : IShippingStrategy
{
    public bool IsInsideDhaka => true;

    public decimal CalculateShippingFee(List<Product> products)
    {
        // Inside Dhaka: flat rate
        return 60m;
    }
}
