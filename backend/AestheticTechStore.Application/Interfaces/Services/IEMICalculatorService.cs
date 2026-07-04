namespace AestheticTechStore.Application.Interfaces.Services;

public class EMIBreakdown
{
    public int Months { get; set; }
    public decimal MonthlyInstallment { get; set; }
    public decimal TotalPayable { get; set; }
    public decimal TotalInterest { get; set; }
}

public interface IEMICalculatorService
{
    List<EMIBreakdown> CalculateEMI(decimal principalAmount);
}
