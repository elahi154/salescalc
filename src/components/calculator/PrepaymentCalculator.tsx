'use client';

import React, { useState, useMemo } from 'react';
import { CalculationResult, LoanInputState } from '@/types/calculator';
import { calculatePrepayment } from '@/lib/calculations/prepayment';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { PiggyBank, Sparkles, AlertCircle } from 'lucide-react';

interface PrepaymentCalculatorProps {
  calculation: CalculationResult;
  inputs: LoanInputState;
}

export const PrepaymentCalculator: React.FC<PrepaymentCalculatorProps> = ({
  calculation,
  inputs,
}) => {
  const { loanAmount, emi, tenureMonths, monthlyRate } = calculation;

  // Local Prepayment Input State
  const [outstanding, setOutstanding] = useState<number>(loanAmount);
  const [prepayAmount, setPrepayAmount] = useState<number>(200000); // default ₹2,00,000 prepayment
  const [remainingMonths, setRemainingMonths] = useState<number>(tenureMonths);

  // Synchronize when main inputs change
  React.useEffect(() => {
    setOutstanding(loanAmount);
    setRemainingMonths(tenureMonths);
    setPrepayAmount(Math.round(loanAmount * 0.1)); // 10% default
  }, [loanAmount, tenureMonths]);

  const prepaymentResult = useMemo(() => {
    return calculatePrepayment({
      outstandingLoan: outstanding,
      currentEMI: emi,
      remainingMonths,
      monthlyRate,
      prepaymentAmount: prepayAmount,
    });
  }, [outstanding, emi, remainingMonths, monthlyRate, prepayAmount]);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
      
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span>Prepayment & Early Repayment Calculator</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calculate exact interest savings by making a part-prepayment
          </p>
        </div>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
        
        {/* Outstanding Principal */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Outstanding Principal (₹)
          </label>
          <input
            type="number"
            value={outstanding}
            onChange={(e) => setOutstanding(Number(e.target.value) || 0)}
            className="w-full px-3 py-1.5 font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
          />
        </div>

        {/* Lump Sum Prepayment Amount */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Prepayment Amount (₹)
          </label>
          <input
            type="number"
            value={prepayAmount}
            onChange={(e) => setPrepayAmount(Number(e.target.value) || 0)}
            className="w-full px-3 py-1.5 font-bold text-emerald-600 dark:text-emerald-400 bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm"
          />
        </div>

        {/* Remaining Months */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Remaining Months
          </label>
          <input
            type="number"
            value={remainingMonths}
            onChange={(e) => setRemainingMonths(Number(e.target.value) || 1)}
            className="w-full px-3 py-1.5 font-bold bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-sm"
          />
        </div>

      </div>

      {/* Comparison Results Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Option 1: Reduce Tenure (Keep EMI Same) */}
        <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/80 dark:border-emerald-900/50 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-900 dark:text-emerald-300 uppercase tracking-wider">
              Option A: Reduce Tenure
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-600 text-white rounded-full">
              Recommended
            </span>
          </div>

          <div>
            <span className="text-xs text-emerald-700 dark:text-emerald-400 block font-medium">
              Estimated Interest Saved
            </span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-300">
              {formatINR(prepaymentResult.interestSavedTenureReduced)}
            </span>
          </div>

          <div className="pt-2 border-t border-emerald-200/60 dark:border-emerald-900/60 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-emerald-800/80 dark:text-emerald-400 block">Tenure Reduced By</span>
              <span className="font-extrabold text-emerald-950 dark:text-emerald-200">
                {prepaymentResult.monthsSaved} Months
              </span>
            </div>

            <div>
              <span className="text-emerald-800/80 dark:text-emerald-400 block">New Remaining Tenure</span>
              <span className="font-extrabold text-emerald-950 dark:text-emerald-200">
                {prepaymentResult.newRemainingMonthsTenureReduced} Months
              </span>
            </div>
          </div>
        </div>

        {/* Option 2: Reduce EMI (Keep Tenure Same) */}
        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
            Option B: Reduce Monthly EMI
          </span>

          <div>
            <span className="text-xs text-slate-500 block font-medium">
              Estimated Interest Saved
            </span>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {formatINR(prepaymentResult.interestSavedEmiReduced)}
            </span>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-slate-500 block">New Monthly EMI</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                {formatINR(prepaymentResult.newEmi)}
              </span>
            </div>

            <div>
              <span className="text-slate-500 block">Monthly EMI Saved</span>
              <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                {formatINR(prepaymentResult.emiSaved)}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Prepayment Financial Disclaimer */}
      <div className="p-3.5 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 text-[11px] text-slate-600 dark:text-slate-400 flex items-start gap-2">
        <AlertCircle className="w-4 h-4 shrink-0 text-slate-500 mt-0.5" />
        <span>
          <strong>Prepayment Disclaimer:</strong> Actual interest savings can differ based on lender-specific foreclosure rules, lock-in periods, applicable prepayment charges/taxes, and timing of payment within the EMI billing cycle.
        </span>
      </div>

    </div>
  );
};
