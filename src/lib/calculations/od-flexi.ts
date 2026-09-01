export interface ODFlexiInput {
  sanctionedLimit: number; // e.g. ₹10,00,000
  utilizedAmount: number; // e.g. ₹4,00,000
  interestRate: number; // e.g. 1.00 (% per month)
  rateType: 'monthly' | 'annual';
}

export interface ODFlexiResult {
  sanctionedLimit: number;
  utilizedAmount: number;
  unutilizedAmount: number;
  monthlyRatePercent: number;
  annualRatePercent: number;
  dailyInterest: number;
  monthlyInterest: number;
  annualInterest: number;
  utilizationPercent: number;
}

export function calculateODFlexi(input: ODFlexiInput): ODFlexiResult {
  const limit = Math.max(0, isNaN(input.sanctionedLimit) ? 0 : input.sanctionedLimit);
  const utilized = Math.max(0, Math.min(limit, isNaN(input.utilizedAmount) ? 0 : input.utilizedAmount));
  const rateInput = Math.max(0, isNaN(input.interestRate) ? 0 : input.interestRate);

  let monthlyRatePercent = 0;
  let annualRatePercent = 0;

  if (input.rateType === 'monthly') {
    monthlyRatePercent = rateInput;
    annualRatePercent = rateInput * 12;
  } else {
    annualRatePercent = rateInput;
    monthlyRatePercent = rateInput / 12;
  }

  const monthlyRateFrac = monthlyRatePercent / 100;
  const monthlyInterest = Math.round(utilized * monthlyRateFrac);
  const dailyInterest = Math.round(monthlyInterest / 30.4167);
  const annualInterest = Math.round(monthlyInterest * 12);

  const unutilizedAmount = Math.max(0, limit - utilized);
  const utilizationPercent = limit > 0 ? Number(((utilized / limit) * 100).toFixed(1)) : 0;

  return {
    sanctionedLimit: limit,
    utilizedAmount: utilized,
    unutilizedAmount,
    monthlyRatePercent,
    annualRatePercent,
    dailyInterest,
    monthlyInterest,
    annualInterest,
    utilizationPercent,
  };
}
