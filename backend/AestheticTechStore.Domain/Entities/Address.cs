using System;

namespace AestheticTechStore.Domain.Entities;

public class Address
{
    public Guid Id { get; set; }
    
    public string UserId { get; set; } = string.Empty;
    public AppUser? User { get; set; }
    
    public string Street { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public bool IsInsideDhaka { get; set; }
}
