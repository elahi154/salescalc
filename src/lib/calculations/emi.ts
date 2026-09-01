import { LoanInputState, CalculationResult } from '@/types/calculator';

/**
 * Calculate EMI, Charges, and Summary stats safely
 */
export function calculateLoan(input: LoanInputState): CalculationResult {
  const {
    loanAmount,
    interestRate,
    rateType,
    tenureValue,
    tenureType,
    processingFeePercent,
    gstPercent,
    otherCharges,
  } = input;

  // Sanitize inputs
  const P = Math.max(0, isNaN(loanAmount) ? 0 : loanAmount);
  
  // Convert tenure to months
  let N = tenureType === 'years' ? tenureValue * 12 : tenureValue;
  N = Math.max(1, Math.round(isNaN(N) ? 1 : N));

  // Determine monthly & annual decimal rate
  let r_monthly_percent = 0;
  let r_annual_percent = 0;

  if (rateType === 'monthly') {
    r_monthly_percent = Math.max(0, isNaN(interestRate) ? 0 : interestRate);
    r_annual_percent = r_monthly_percent * 12;
  } else {
    r_annual_percent = Math.max(0, isNaN(interestRate) ? 0 : interestRate);
    r_monthly_percent = r_annual_percent / 12;
  }

  const r = r_monthly_percent / 100; // Monthly fraction
  const annualRateFrac = r_annual_percent / 100;

  // Calculate EMI
  let exactEmi = 0;
  if (P > 0 && N > 0) {
    if (r === 0) {
      exactEmi = P / N;
    } else {
      const pow = Math.pow(1 + r, N);
      exactEmi = (P * r * pow) / (pow - 1);
    }
  }

  const emi = Math.round(exactEmi);

  // Total Interest & Payable
  const totalPayable = Math.round(exactEmi * N);
  const totalInterest = Math.max(0, totalPayable - P);

  // Additional Charges
  const pfPercent = Math.max(0, isNaN(processingFeePercent) ? 0 : processingFeePercent);
  const gstP = Math.max(0, isNaN(gstPercent) ? 0 : gstPercent);
  const others = Math.max(0, isNaN(otherCharges) ? 0 : otherCharges);

  const processingFee = Math.round(P * (pfPercent / 100));
  const gstAmount = Math.round(processingFee * (gstP / 100));
  const totalCharges = Math.round(processingFee + gstAmount + others);

  const totalCost = totalPayable + totalCharges;

  return {
    loanAmount: P,
    monthlyRate: r,
    annualRate: annualRateFrac,
    tenureMonths: N,
    emi,
    exactEmi,
    totalInterest,
    totalPayable,
    processingFee,
    gstAmount,
    otherCharges: others,
    totalCharges,
    totalCost,
  };
}
