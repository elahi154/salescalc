'use client';

import React from 'react';
import { CalculationResult, LoanInputState } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { Sparkles, ShieldCheck } from 'lucide-react';

interface EMICardProps {
  calculation: CalculationResult;
  inputs: LoanInputState;
}

export const EMICard: React.FC<EMICardProps> = ({ calculation, inputs }) => {
  const { emi, loanAmount, monthlyRate, annualRate, tenureMonths } = calculation;
  const { rateType, tenureValue, tenureType } = inputs;

  const monthlyRateFormatted = (monthlyRate * 100).toFixed(2);
  const annualRateFormatted = (annualRate * 100).toFixed(2);
  const tenureDisplay = tenureType === 'years' ? `${tenureValue} Years` : `${tenureValue} Months`;

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-blue-500/20 border border-blue-500/30">
      
      {/* Decorative background ambient glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-16 -bottom-16 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 space-y-6">
        
        {/* Top Header Label */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold text-blue-100 border border-white/15">
            <Sparkles className="w-3.5 h-3.5 text-blue-300" />
            <span>Instant EMI Calculation</span>
          </div>
          <span className="text-[11px] font-medium text-blue-200/80 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Live Client-Side Math
          </span>
        </div>

        {/* Visually Dominant Monthly EMI Number */}
        <div className="space-y-1">
          <p className="text-xs sm:text-sm uppercase tracking-wider font-semibold text-blue-200">
            Monthly EMI
          </p>
          <div className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-md">
            {formatINR(emi)}
          </div>
          <p className="text-xs text-blue-200/80 font-medium">
            Per month for {tenureMonths} months
          </p>
        </div>

        {/* Subtitle Parameter Pills */}
        <div className="pt-4 border-t border-white/15 grid grid-cols-3 gap-2 sm:gap-4 text-center sm:text-left">
          
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/10">
            <p className="text-[10px] sm:text-xs font-medium text-blue-200">Loan Amount</p>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
              {formatINRCompact(loanAmount)}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/10">
            <p className="text-[10px] sm:text-xs font-medium text-blue-200">Interest Rate</p>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
              {rateType === 'monthly' ? `${monthlyRateFormatted}% / mo` : `${annualRateFormatted}% p.a.`}
            </p>
            <p className="text-[9px] text-blue-200/80 hidden sm:block">
              ≈ {rateType === 'monthly' ? `${annualRateFormatted}% p.a.` : `${monthlyRateFormatted}% / mo`}
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-2.5 sm:p-3 border border-white/10">
            <p className="text-[10px] sm:text-xs font-medium text-blue-200">Tenure</p>
            <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">
              {tenureDisplay}
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
