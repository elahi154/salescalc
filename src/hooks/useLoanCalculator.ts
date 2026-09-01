import { useState, useMemo } from 'react';
import { LoanInputState, CalculationResult } from '@/types/calculator';
import { calculateLoan } from '@/lib/calculations/emi';
import {
  generateAmortizationSchedule,
  generateDailyBreakdown,
  generateWeeklyBreakdown,
  generateAnnualBreakdown,
} from '@/lib/calculations/amortization';
import { getTenureComparison, getLoanAmountComparison } from '@/lib/calculations/comparison';
import { generateSmartInsights } from '@/lib/calculations/insights';

const INITIAL_INPUT_STATE: LoanInputState = {
  loanAmount: 2000000, // ₹20,00,000 default
  interestRate: 1.0, // 1.00% / month default
  rateType: 'monthly', // MONTHLY selected by default as required
  tenureValue: 5, // 5 Years default
  tenureType: 'years',
  processingFeePercent: 2.0, // 2% default
  gstPercent: 18.0, // 18% default
  otherCharges: 0,
};

export function useLoanCalculator() {
  const [inputs, setInputs] = useState<LoanInputState>(INITIAL_INPUT_STATE);

  const updateInput = <K extends keyof LoanInputState>(key: K, value: LoanInputState[K]) => {
    setInputs((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetInputs = () => {
    setInputs(INITIAL_INPUT_STATE);
  };

  const setFullState = (newState: Partial<LoanInputState>) => {
    setInputs((prev) => ({
      ...prev,
      ...newState,
    }));
  };

  // Perform live calculations
  const calculationResult: CalculationResult = useMemo(() => {
    return calculateLoan(inputs);
  }, [inputs]);

  // Generate dynamic schedules
  const monthlySchedule = useMemo(() => {
    return generateAmortizationSchedule(calculationResult);
  }, [calculationResult]);

  const dailySchedule = useMemo(() => {
    return generateDailyBreakdown(calculationResult);
  }, [calculationResult]);

  const weeklySchedule = useMemo(() => {
    return generateWeeklyBreakdown(calculationResult);
  }, [calculationResult]);

  const annualSchedule = useMemo(() => {
    return generateAnnualBreakdown(monthlySchedule);
  }, [monthlySchedule]);

  // Comparisons
  const tenureComparison = useMemo(() => {
    return getTenureComparison(inputs);
  }, [inputs]);

  const loanComparison = useMemo(() => {
    return getLoanAmountComparison(inputs);
  }, [inputs]);

  // Insights
  const smartInsights = useMemo(() => {
    return generateSmartInsights(calculationResult);
  }, [calculationResult]);

  return {
    inputs,
    updateInput,
    resetInputs,
    setFullState,
    calculationResult,
    monthlySchedule,
    dailySchedule,
    weeklySchedule,
    annualSchedule,
    tenureComparison,
    loanComparison,
    smartInsights,
  };
}
