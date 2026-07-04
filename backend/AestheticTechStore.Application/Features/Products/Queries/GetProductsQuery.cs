using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using AestheticTechStore.Application.Interfaces.Repositories;
using AestheticTechStore.Domain.Entities;
using AestheticTechStore.Domain.Enums;
using MediatR;

namespace AestheticTechStore.Application.Features.Products.Queries;

public record GetProductsQuery(Category? Category, string? Brand) : IRequest<IEnumerable<Product>>;

public class GetProductsQueryHandler : IRequestHandler<GetProductsQuery, IEnumerable<Product>>
{
    private readonly IProductRepository _repository;

    public GetProductsQueryHandler(IProductRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Product>> Handle(GetProductsQuery request, CancellationToken cancellationToken)
    {
        return await _repository.GetProductsAsync(request.Category, request.Brand);
    }
}
