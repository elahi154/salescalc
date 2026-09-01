'use client';

import React from 'react';
import { CalculationResult, LoanInputState } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { Presentation, ChevronUp } from 'lucide-react';

interface MobileStickyEMIBarProps {
  calculation: CalculationResult;
  inputs: LoanInputState;
  onOpenCustomerView: () => void;
  onScrollToTop: () => void;
}

export const MobileStickyEMIBar: React.FC<MobileStickyEMIBarProps> = ({
  calculation,
  inputs,
  onOpenCustomerView,
  onScrollToTop,
}) => {
  const { emi, loanAmount, monthlyRate } = calculation;
  const { tenureValue, tenureType, rateType, interestRate } = inputs;

  const rateStr = rateType === 'monthly' ? `${interestRate}%/mo` : `${interestRate}% p.a.`;
  const tenureStr = tenureType === 'years' ? `${tenureValue}Y` : `${tenureValue}M`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800 text-white p-3.5 shadow-2xl transition-all animate-slide-up">
      <div className="max-w-md mx-auto flex items-center justify-between gap-3">
        
        {/* EMI summary block */}
        <div onClick={onScrollToTop} className="cursor-pointer space-y-0.5">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-400 flex items-center gap-1">
            Monthly EMI <ChevronUp className="w-3 h-3" />
          </span>
          <div className="text-xl font-black text-white tracking-tight">
            {formatINR(emi)}
          </div>
          <p className="text-[10px] text-slate-400 font-semibold truncate">
            {formatINRCompact(loanAmount)} • {rateStr} • {tenureStr}
          </p>
        </div>

        {/* Action Button */}
        <button
          onClick={onOpenCustomerView}
          className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
        >
          <Presentation className="w-4 h-4" />
          <span>Present</span>
        </button>

      </div>
    </div>
  );
};
