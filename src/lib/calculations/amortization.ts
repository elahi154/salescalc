import { CalculationResult, AmortizationRow, PeriodBreakdownRow, AnnualBreakdownRow } from '@/types/calculator';

/**
 * Generate full monthly amortization schedule
 */
export function generateAmortizationSchedule(calc: CalculationResult): AmortizationRow[] {
  const { loanAmount: P, monthlyRate: r, tenureMonths: N, exactEmi } = calc;
  
  if (P <= 0 || N <= 0) return [];

  const schedule: AmortizationRow[] = [];
  let balance = P;

  for (let m = 1; m <= N; m++) {
    const interestPortion = balance * r;
    let principalPortion = exactEmi - interestPortion;

    // Handle last month adjustment
    if (m === N || balance < principalPortion) {
      principalPortion = balance;
    }

    balance = Math.max(0, balance - principalPortion);
    const periodEmi = principalPortion + interestPortion;

    schedule.push({
      period: m,
      label: `Month ${m}`,
      emi: Math.round(periodEmi),
      principal: Math.round(principalPortion),
      interest: Math.round(interestPortion),
      balance: Math.round(balance),
    });
  }

  return schedule;
}

/**
 * Daily Estimated Breakdown
 */
export function generateDailyBreakdown(calc: CalculationResult): PeriodBreakdownRow[] {
  const { loanAmount: P, monthlyRate: r, emi } = calc;
  if (P <= 0) return [];

  // Estimated 30 days per month
  const dailyEmi = emi / 30.4167;
  const dailyInterest = (P * r) / 30.4167;
  const dailyPrincipal = Math.max(0, dailyEmi - dailyInterest);

  const rows: PeriodBreakdownRow[] = [];
  let balance = P;

  for (let d = 1; d <= 30; d++) {
    balance = Math.max(0, balance - dailyPrincipal);
    rows.push({
      period: d,
      label: `Day ${d}`,
      emi: Math.round(dailyEmi),
      principal: Math.round(dailyPrincipal),
      interest: Math.round(dailyInterest),
      balance: Math.round(balance),
    });
  }

  return rows;
}

/**
 * Weekly Estimated Breakdown
 */
export function generateWeeklyBreakdown(calc: CalculationResult): PeriodBreakdownRow[] {
  const { loanAmount: P, monthlyRate: r, emi, tenureMonths } = calc;
  if (P <= 0) return [];

  const totalWeeks = Math.min(52, Math.round(tenureMonths * 4.3333));
  const weeklyEmi = (emi * 12) / 52;
  const weeklyInterest = (P * r * 12) / 52;
  const weeklyPrincipal = Math.max(0, weeklyEmi - weeklyInterest);

  const rows: PeriodBreakdownRow[] = [];
  let balance = P;

  for (let w = 1; w <= totalWeeks; w++) {
    balance = Math.max(0, balance - weeklyPrincipal);
    rows.push({
      period: w,
      label: `Week ${w}`,
      emi: Math.round(weeklyEmi),
      principal: Math.round(weeklyPrincipal),
      interest: Math.round(weeklyInterest),
      balance: Math.round(balance),
    });
  }

  return rows;
}

/**
 * Annual Breakdown Summary
 */
export function generateAnnualBreakdown(schedule: AmortizationRow[]): AnnualBreakdownRow[] {
  if (!schedule.length) return [];

  const annualRows: AnnualBreakdownRow[] = [];
  let currentYear = 1;
  let yearPrincipal = 0;
  let yearInterest = 0;
  let yearTotal = 0;
  let finalBalance = 0;

  schedule.forEach((row, index) => {
    yearPrincipal += row.principal;
    yearInterest += row.interest;
    yearTotal += row.emi;
    finalBalance = row.balance;

    const isYearEnd = (index + 1) % 12 === 0 || index === schedule.length - 1;

    if (isYearEnd) {
      annualRows.push({
        year: currentYear,
        label: `Year ${currentYear}`,
        principalPaid: Math.round(yearPrincipal),
        interestPaid: Math.round(yearInterest),
        totalPaid: Math.round(yearTotal),
        remainingBalance: Math.round(finalBalance),
      });
      currentYear++;
      yearPrincipal = 0;
      yearInterest = 0;
      yearTotal = 0;
    }
  });

  return annualRows;
}
