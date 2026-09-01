import { PrepaymentInput, PrepaymentResult } from '@/types/calculator';

/**
 * Calculate Prepayment Savings:
 * 1. Reduce Tenure option (Keep EMI same)
 * 2. Reduce EMI option (Keep Tenure same)
 */
export function calculatePrepayment(input: PrepaymentInput): PrepaymentResult {
  const {
    outstandingLoan: P,
    currentEMI: EMI,
    remainingMonths: N,
    monthlyRate: r,
    prepaymentAmount: A,
  } = input;

  if (P <= 0 || EMI <= 0 || N <= 0 || A <= 0) {
    return {
      originalTotalInterest: 0,
      originalRemainingMonths: N,
      newRemainingMonthsTenureReduced: N,
      monthsSaved: 0,
      interestSavedTenureReduced: 0,
      newTotalInterestTenureReduced: 0,
      newEmi: EMI,
      emiSaved: 0,
      interestSavedEmiReduced: 0,
      newTotalInterestEmiReduced: 0,
    };
  }

  // Original remaining total interest
  const originalTotalPayable = EMI * N;
  const originalTotalInterest = Math.max(0, originalTotalPayable - P);

  // New principal after prepayment
  const newPrincipal = Math.max(0, P - A);

  if (newPrincipal <= 0) {
    // Paid off completely
    return {
      originalTotalInterest,
      originalRemainingMonths: N,
      newRemainingMonthsTenureReduced: 0,
      monthsSaved: N,
      interestSavedTenureReduced: originalTotalInterest,
      newTotalInterestTenureReduced: 0,
      newEmi: 0,
      emiSaved: EMI,
      interestSavedEmiReduced: originalTotalInterest,
      newTotalInterestEmiReduced: 0,
    };
  }

  // Option 1: Reduce Tenure (Keep EMI same)
  // Calculate new remaining months: log(1 - (newP * r / EMI)) / -log(1 + r)
  let newTenureMonths = N;
  let newInterestTenureReduced = 0;

  if (r > 0) {
    const num = Math.log(1 - (newPrincipal * r) / EMI);
    const den = Math.log(1 + r);
    if (!isNaN(num) && !isNaN(den) && den !== 0) {
      newTenureMonths = Math.ceil(-num / den);
    }
  } else {
    newTenureMonths = Math.ceil(newPrincipal / EMI);
  }

  newTenureMonths = Math.max(1, Math.min(N, newTenureMonths));
  const monthsSaved = Math.max(0, N - newTenureMonths);
  const newPayableTenureReduced = EMI * newTenureMonths;
  newInterestTenureReduced = Math.max(0, newPayableTenureReduced - newPrincipal);
  const interestSavedTenureReduced = Math.max(0, originalTotalInterest - newInterestTenureReduced);

  // Option 2: Reduce EMI (Keep Tenure same N)
  let newEmi = EMI;
  if (r > 0) {
    const pow = Math.pow(1 + r, N);
    newEmi = Math.round((newPrincipal * r * pow) / (pow - 1));
  } else {
    newEmi = Math.round(newPrincipal / N);
  }

  const emiSaved = Math.max(0, EMI - newEmi);
  const newPayableEmiReduced = newEmi * N;
  const newInterestEmiReduced = Math.max(0, newPayableEmiReduced - newPrincipal);
  const interestSavedEmiReduced = Math.max(0, originalTotalInterest - newInterestEmiReduced);

  return {
    originalTotalInterest: Math.round(originalTotalInterest),
    originalRemainingMonths: N,
    newRemainingMonthsTenureReduced: newTenureMonths,
    monthsSaved,
    interestSavedTenureReduced: Math.round(interestSavedTenureReduced),
    newTotalInterestTenureReduced: Math.round(newInterestTenureReduced),
    newEmi,
    emiSaved,
    interestSavedEmiReduced: Math.round(interestSavedEmiReduced),
    newTotalInterestEmiReduced: Math.round(newInterestEmiReduced),
  };
}
