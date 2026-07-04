using System.Collections.Generic;
using AestheticTechStore.Domain.Entities;

namespace AestheticTechStore.Application.Interfaces;

public interface IShippingStrategy
{
    bool IsInsideDhaka { get; }
    decimal CalculateShippingFee(List<Product> products);
}
