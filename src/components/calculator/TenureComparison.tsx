'use client';

import React from 'react';
import { TenureComparisonItem } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { Clock, CheckCircle2, Lightbulb } from 'lucide-react';

interface TenureComparisonProps {
  tenureComparison: TenureComparisonItem[];
  onSelectTenure: (years: number) => void;
}

export const TenureComparison: React.FC<TenureComparisonProps> = ({
  tenureComparison,
  onSelectTenure,
}) => {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-5">
      
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <span>What happens if I change the tenure?</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Compare monthly EMI vs total interest liability across tenure options
        </p>
      </div>

      {/* Comparison Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {tenureComparison.map((item) => (
          <div
            key={item.years}
            onClick={() => onSelectTenure(item.years)}
            className={`relative cursor-pointer p-5 rounded-2xl border transition-all duration-200 ${
              item.isSelected
                ? 'bg-blue-50/70 dark:bg-blue-950/40 border-blue-600 dark:border-blue-500 shadow-md ring-2 ring-blue-500/20'
                : 'bg-slate-50/50 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
            }`}
          >
            {item.isSelected && (
              <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] font-bold text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/60 px-2 py-0.5 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Selected
              </span>
            )}

            <div className="space-y-3">
              <span className="text-base font-extrabold text-slate-900 dark:text-white block">
                {item.years} Years
              </span>

              <div>
                <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                  Monthly EMI
                </span>
                <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400">
                  {formatINR(item.emi)}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200/60 dark:border-slate-700/60 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500 block">Total Interest</span>
                  <span className="font-extrabold text-rose-500 dark:text-rose-400">
                    {formatINRCompact(item.totalInterest)}
                  </span>
                </div>

                <div>
                  <span className="text-slate-500 block">Total Payable</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    {formatINRCompact(item.totalPayable)}
                  </span>
                </div>
              </div>

            </div>
          </div>
        ))}
      </div>

      {/* Clear Insight Box */}
      <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/50 flex items-start gap-3 text-xs text-amber-900 dark:text-amber-200">
        <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold block text-sm">Key Takeaway</span>
          <span>Longer tenure → Lower EMI, but higher total interest.</span>
        </div>
      </div>

    </div>
  );
};
