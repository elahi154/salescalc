'use client';

import React from 'react';
import { LoanAmountComparisonItem } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { Scale, Check } from 'lucide-react';

interface LoanComparisonProps {
  loanComparison: LoanAmountComparisonItem[];
  onSelectAmount: (amount: number) => void;
}

export const LoanComparison: React.FC<LoanComparisonProps> = ({
  loanComparison,
  onSelectAmount,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-5">
      
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Scale className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
          <span>Compare Loan Amounts</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          See how changing your borrowing amount impacts EMI and overall interest
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-200/80 dark:border-slate-800">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
            <tr>
              <th className="py-3 px-4">Loan Amount</th>
              <th className="py-3 px-4 text-right">Monthly EMI</th>
              <th className="py-3 px-4 text-right">Total Interest</th>
              <th className="py-3 px-4 text-right">Total Payable</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium text-slate-800 dark:text-slate-200">
            {loanComparison.map((item) => (
              <tr
                key={item.amount}
                className={`transition-colors ${
                  item.isSelected
                    ? 'bg-blue-50/70 dark:bg-blue-950/40 font-bold'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                }`}
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {formatINR(item.amount)}
                    </span>
                    <span className="text-[11px] text-slate-500 font-normal">
                      ({item.formattedAmount})
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4 text-right font-extrabold text-blue-600 dark:text-blue-400">
                  {formatINR(item.emi)}
                </td>
                <td className="py-3 px-4 text-right text-rose-500 dark:text-rose-400 font-semibold">
                  {formatINRCompact(item.totalInterest)}
                </td>
                <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">
                  {formatINRCompact(item.totalPayable)}
                </td>
                <td className="py-3 px-4 text-center">
                  {item.isSelected ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full">
                      <Check className="w-3 h-3" /> Selected
                    </span>
                  ) : (
                    <button
                      onClick={() => onSelectAmount(item.amount)}
                      className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                    >
                      Select
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
