'use client';

import React from 'react';
import { CalculationResult } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { ShieldAlert, ArrowRight } from 'lucide-react';

interface TotalCostSectionProps {
  calculation: CalculationResult;
}

export const TotalCostSection: React.FC<TotalCostSectionProps> = ({ calculation }) => {
  const { loanAmount, totalInterest, totalCharges, totalCost } = calculation;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 space-y-6">
      
      <div>
        <h3 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
          <span>What will you actually pay?</span>
        </h3>
        <p className="text-xs sm:text-sm text-slate-400">
          Complete breakdown of principal, interest, and upfront processing fees
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-b border-slate-800 py-6">
        
        {/* Principal */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            1. Loan Principal
          </span>
          <div className="text-xl sm:text-2xl font-bold text-white">
            {formatINR(loanAmount)}
          </div>
          <p className="text-[11px] text-slate-400">Original borrowed amount</p>
        </div>

        {/* Total Interest */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
            2. Total Interest
          </span>
          <div className="text-xl sm:text-2xl font-bold text-rose-400">
            + {formatINR(totalInterest)}
          </div>
          <p className="text-[11px] text-slate-400">Interest over tenure</p>
        </div>

        {/* Additional Charges */}
        <div className="space-y-1">
          <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
            3. Additional Charges
          </span>
          <div className="text-xl sm:text-2xl font-bold text-amber-400">
            + {formatINR(totalCharges)}
          </div>
          <p className="text-[11px] text-slate-400">Fees + GST + Others</p>
        </div>

      </div>

      {/* Prominent Total Cost Result */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-widest text-indigo-300">
            True Out-of-Pocket Cost
          </span>
          <div className="text-3xl sm:text-5xl font-black text-white tracking-tight mt-1">
            {formatINR(totalCost)}
          </div>
          <p className="text-xs text-indigo-200 mt-0.5">
            Equivalent to approx <span className="font-semibold">{formatINRCompact(totalCost)}</span> total cash outflow
          </p>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <span className="px-4 py-2.5 rounded-xl bg-blue-600/80 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-lg shadow-blue-600/30">
            <span>Everything Included</span>
            <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>

    </div>
  );
};
