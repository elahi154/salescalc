import { CalculationResult } from '@/types/calculator';
import { formatINR, formatINRCompact, formatPercent } from './formatting';

export interface SmartInsightItem {
  id: string;
  icon: string; // lucide icon name reference
  type: 'info' | 'tip' | 'warning';
  title: string;
  description: string;
}

/**
 * Generate intelligent client-side insights based on actual numbers
 */
export function generateSmartInsights(calc: CalculationResult): SmartInsightItem[] {
  const insights: SmartInsightItem[] = [];

  const {
    loanAmount,
    totalInterest,
    totalPayable,
    totalCharges,
    tenureMonths,
    emi,
    monthlyRate,
  } = calc;

  if (loanAmount <= 0) return [];

  // Insight 1: Interest Ratio
  const interestPercentOfTotal = totalPayable > 0 ? (totalInterest / totalPayable) * 100 : 0;
  insights.push({
    id: 'interest-ratio',
    icon: 'PieChart',
    type: interestPercentOfTotal > 30 ? 'warning' : 'info',
    title: 'Interest Breakdown',
    description: `Your estimated interest (${formatINRCompact(totalInterest)}) accounts for approximately ${interestPercentOfTotal.toFixed(1)}% of your total loan repayment (${formatINRCompact(totalPayable)}).`,
  });

  // Insight 2: Tenure Impact
  const tenureYears = (tenureMonths / 12).toFixed(1);
  insights.push({
    id: 'tenure-impact',
    icon: 'Clock',
    type: 'tip',
    title: 'Tenure Optimization',
    description: `Selecting a ${tenureYears}-year tenure yields a comfortable monthly EMI of ${formatINR(emi)}. Increasing tenure lowers monthly burden, but increases total interest paid over time.`,
  });

  // Insight 3: Total Charges
  if (totalCharges > 0) {
    const chargesPercent = ((totalCharges / loanAmount) * 100).toFixed(2);
    insights.push({
      id: 'charges-summary',
      icon: 'Receipt',
      type: 'info',
      title: 'Estimated Upfront Charges',
      description: `Your user-entered processing fee, GST, and additional charges equal ${formatINR(totalCharges)} (~${chargesPercent}% of loan principal).`,
    });
  }

  // Insight 4: Prepayment Potential Tip
  const hypotheticalPrepayment = Math.round(loanAmount * 0.1); // 10% prepayment
  insights.push({
    id: 'prepayment-tip',
    icon: 'TrendingUp',
    type: 'tip',
    title: 'Prepayment Savings Tip',
    description: `Making a single prepayment of 10% (${formatINRCompact(hypotheticalPrepayment)}) can reduce your tenure substantially and save significant interest over ${tenureMonths} months.`,
  });

  return insights;
}
