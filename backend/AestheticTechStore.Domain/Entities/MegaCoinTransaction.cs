using AestheticTechStore.Domain.Enums;

namespace AestheticTechStore.Domain.Entities;

public class MegaCoinTransaction
{
    public Guid Id { get; set; }
    public string AppUserId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public TransactionType Type { get; set; }
    public DateTime CreatedAt { get; set; }
    public string Description { get; set; } = string.Empty;

    public AppUser AppUser { get; set; } = null!;
}
