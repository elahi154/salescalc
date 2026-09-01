import { calculateLoan } from './emi';

export interface InterestSensitivityRow {
  ratePercent: number;
  rateType: 'monthly' | 'annual';
  emi: number;
  totalInterest: number;
  totalPayable: number;
  differenceFromBaseEMI: number;
}

export function calculateInterestSensitivity(
  loanAmount: number,
  baseRatePercent: number,
  rateType: 'monthly' | 'annual',
  tenureValue: number,
  tenureType: 'years' | 'months'
): InterestSensitivityRow[] {
  const baseCalc = calculateLoan({
    loanAmount,
    interestRate: baseRatePercent,
    rateType,
    tenureValue,
    tenureType,
    processingFeePercent: 0,
    gstPercent: 0,
    otherCharges: 0,
  });

  const offsets = [-0.5, -0.25, 0, 0.25, 0.5];

  return offsets.map((offset) => {
    const testRate = Math.max(0.05, baseRatePercent + offset);
    const calc = calculateLoan({
      loanAmount,
      interestRate: testRate,
      rateType,
      tenureValue,
      tenureType,
      processingFeePercent: 0,
      gstPercent: 0,
      otherCharges: 0,
    });

    return {
      ratePercent: Number(testRate.toFixed(2)),
      rateType,
      emi: calc.emi,
      totalInterest: calc.totalInterest,
      totalPayable: calc.totalPayable,
      differenceFromBaseEMI: calc.emi - baseCalc.emi,
    };
  });
}
