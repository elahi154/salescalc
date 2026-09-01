export type RateType = 'monthly' | 'annual';
export type TenureType = 'years' | 'months';
export type BreakdownTab = 'day' | 'week' | 'month' | 'year';

export interface LoanInputState {
  loanAmount: number; // e.g. 2000000
  interestRate: number; // e.g. 1.00 if monthly or 12.00 if annual
  rateType: RateType; // 'monthly' | 'annual'
  tenureValue: number; // e.g. 5
  tenureType: TenureType; // 'years' | 'months'
  processingFeePercent: number; // e.g. 2.0
  gstPercent: number; // e.g. 18.0
  otherCharges: number; // e.g. 0
}

export interface CalculationResult {
  loanAmount: number;
  monthlyRate: number; // fraction e.g. 0.01
  annualRate: number; // fraction e.g. 0.12
  tenureMonths: number;
  emi: number; // rounded EMI
  exactEmi: number; // unrounded EMI
  totalInterest: number;
  totalPayable: number; // Loan + Interest
  processingFee: number;
  gstAmount: number;
  otherCharges: number;
  totalCharges: number;
  totalCost: number; // Principal + Interest + Charges
}

export interface AmortizationRow {
  period: number; // month number
  label: string; // "Month 1"
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface PeriodBreakdownRow {
  period: number;
  label: string;
  emi: number;
  principal: number;
  interest: number;
  balance: number;
}

export interface AnnualBreakdownRow {
  year: number;
  label: string;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  remainingBalance: number;
}

export interface TenureComparisonItem {
  years: number;
  months: number;
  emi: number;
  totalInterest: number;
  totalPayable: number;
  isSelected: boolean;
}

export interface LoanAmountComparisonItem {
  amount: number;
  formattedAmount: string;
  emi: number;
  totalInterest: number;
  totalPayable: number;
  isSelected: boolean;
}

export interface PrepaymentInput {
  outstandingLoan: number;
  currentEMI: number;
  remainingMonths: number;
  monthlyRate: number;
  prepaymentAmount: number;
}

export interface PrepaymentResult {
  originalTotalInterest: number;
  originalRemainingMonths: number;
  // Option 1: Reduce Tenure (Keep EMI same)
  newRemainingMonthsTenureReduced: number;
  monthsSaved: number;
  interestSavedTenureReduced: number;
  newTotalInterestTenureReduced: number;
  // Option 2: Reduce EMI (Keep Tenure same)
  newEmi: number;
  emiSaved: number;
  interestSavedEmiReduced: number;
  newTotalInterestEmiReduced: number;
}

export interface SavedCalculation {
  id: string;
  timestamp: number;
  loanAmount: number;
  interestRate: number;
  rateType: RateType;
  tenureValue: number;
  tenureType: TenureType;
  emi: number;
  totalPayable: number;
}
