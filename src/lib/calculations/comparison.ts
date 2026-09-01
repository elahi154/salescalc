import { LoanInputState, TenureComparisonItem, LoanAmountComparisonItem } from '@/types/calculator';
import { calculateLoan } from './emi';
import { formatINRCompact } from './formatting';

/**
 * Compare standard tenures (3 Years, 5 Years, 7 Years)
 */
export function getTenureComparison(input: LoanInputState): TenureComparisonItem[] {
  const currentTenureYears = input.tenureType === 'years' ? input.tenureValue : input.tenureValue / 12;
  const tenureOptions = [3, 5, 7];

  // If current tenure is not in [3, 5, 7], include current tenure as well or highlight nearest
  const optionsToCompare = Array.from(new Set([...tenureOptions, Math.round(currentTenureYears)])).sort((a, b) => a - b);

  return optionsToCompare.map((years) => {
    const calc = calculateLoan({
      ...input,
      tenureValue: years,
      tenureType: 'years',
    });

    return {
      years,
      months: years * 12,
      emi: calc.emi,
      totalInterest: calc.totalInterest,
      totalPayable: calc.totalPayable,
      isSelected: Math.abs(currentTenureYears - years) < 0.1,
    };
  });
}

/**
 * Compare standard loan amounts (10L, 15L, 20L, 25L, 30L)
 */
export function getLoanAmountComparison(input: LoanInputState): LoanAmountComparisonItem[] {
  const currentAmount = input.loanAmount;
  const standardAmounts = [1000000, 1500000, 2000000, 2500000, 3000000];

  const amountsToCompare = Array.from(new Set([...standardAmounts, currentAmount])).sort((a, b) => a - b);

  return amountsToCompare.map((amount) => {
    const calc = calculateLoan({
      ...input,
      loanAmount: amount,
    });

    return {
      amount,
      formattedAmount: formatINRCompact(amount),
      emi: calc.emi,
      totalInterest: calc.totalInterest,
      totalPayable: calc.totalPayable,
      isSelected: Math.abs(currentAmount - amount) < 1,
    };
  });
}
