'use client';

import React from 'react';
import { CalculationResult } from '@/types/calculator';
import { formatINR } from '@/lib/calculations/formatting';
import { Wallet, Landmark, TrendingUp, PiggyBank } from 'lucide-react';

interface LoanSummaryProps {
  calculation: CalculationResult;
}

export const LoanSummary: React.FC<LoanSummaryProps> = ({ calculation }) => {
  const { loanAmount, emi, totalInterest, totalPayable } = calculation;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
      
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <span>Loan Summary</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Core financial metrics at a glance
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Card 1: Principal */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <Landmark className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Loan Amount</span>
          </div>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
            {formatINR(loanAmount)}
          </p>
        </div>

        {/* Card 2: EMI */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <Wallet className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            <span>Monthly EMI</span>
          </div>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
            {formatINR(emi)}
          </p>
        </div>

        {/* Card 3: Total Interest */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
            <span>Total Interest</span>
          </div>
          <p className="text-base sm:text-lg font-extrabold text-rose-600 dark:text-rose-400 truncate">
            {formatINR(totalInterest)}
          </p>
        </div>

        {/* Card 4: Total Payable */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-xs font-semibold">
            <PiggyBank className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Total Payable</span>
          </div>
          <p className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white truncate">
            {formatINR(totalPayable)}
          </p>
        </div>

      </div>
    </div>
  );
};
