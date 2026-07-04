using AestheticTechStore.Application.Interfaces.Services;

namespace AestheticTechStore.Application.Services;

public class EMICalculatorService : IEMICalculatorService
{
    // Mocking standard local bank interest rate for credit card EMIs in BD
    private const decimal AnnualInterestRate = 0.09m; // 9% Flat

    public List<EMIBreakdown> CalculateEMI(decimal principalAmount)
    {
        var breakdowns = new List<EMIBreakdown>();
        int[] tenures = { 3, 6, 12, 36 };

        foreach (var months in tenures)
        {
            // Flat rate calculation: 
            // Total Interest = Principal * (Rate/12) * Months
            decimal totalInterest = principalAmount * (AnnualInterestRate / 12) * months;
            decimal totalPayable = principalAmount + totalInterest;
            decimal monthly = totalPayable / months;

            breakdowns.Add(new EMIBreakdown
            {
                Months = months,
                MonthlyInstallment = Math.Round(monthly, 2),
                TotalPayable = Math.Round(totalPayable, 2),
                TotalInterest = Math.Round(totalInterest, 2)
            });
        }

        return breakdowns;
    }
}
