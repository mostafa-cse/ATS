using System;
using System.Collections.Generic;
using AestheticTechStore.Domain.Enums;
using Microsoft.AspNetCore.Identity;

namespace AestheticTechStore.Domain.Entities;

public class AppUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}".Trim();
    
    public Role Role { get; set; } = Role.User;
    
    public decimal MegaCoinBalance { get; set; } = 0;
    
    // Navigation properties
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<MegaCoinTransaction> MegaCoinTransactions { get; set; } = new List<MegaCoinTransaction>();
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
}
