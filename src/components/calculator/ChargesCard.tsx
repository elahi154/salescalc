'use client';

import React from 'react';
import { LoanInputState, CalculationResult } from '@/types/calculator';
import { formatINR } from '@/lib/calculations/formatting';
import { Receipt, Info } from 'lucide-react';

interface ChargesCardProps {
  inputs: LoanInputState;
  calculation: CalculationResult;
  onUpdateInput: <K extends keyof LoanInputState>(key: K, value: LoanInputState[K]) => void;
}

export const ChargesCard: React.FC<ChargesCardProps> = ({
  inputs,
  calculation,
  onUpdateInput,
}) => {
  const { processingFeePercent, gstPercent, otherCharges } = inputs;
  const { processingFee, gstAmount, totalCharges } = calculation;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-5">
      
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-500" />
            <span>Additional Charges</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Customize processing fees & upfront tax costs
          </p>
        </div>

        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200/70 dark:border-amber-800/70">
          <Info className="w-3.5 h-3.5" />
          Estimated / User-entered charges
        </span>
      </div>

      {/* Editable Inputs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Processing Fee % */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Processing Fee (%)
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={processingFeePercent}
              onChange={(e) => onUpdateInput('processingFeePercent', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <span className="absolute right-3 text-xs font-bold text-slate-400">%</span>
          </div>
          <p className="text-[11px] text-slate-500">
            Amount: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatINR(processingFee)}</span>
          </p>
        </div>

        {/* GST % */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            GST (%) on Fee
          </label>
          <div className="relative flex items-center">
            <input
              type="number"
              step="1"
              min="0"
              max="28"
              value={gstPercent}
              onChange={(e) => onUpdateInput('gstPercent', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
            <span className="absolute right-3 text-xs font-bold text-slate-400">%</span>
          </div>
          <p className="text-[11px] text-slate-500">
            GST: <span className="font-semibold text-slate-700 dark:text-slate-300">{formatINR(gstAmount)}</span>
          </p>
        </div>

        {/* Other Charges */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Other Charges (₹)
          </label>
          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
            <input
              type="number"
              min="0"
              step="500"
              value={otherCharges}
              onChange={(e) => onUpdateInput('otherCharges', parseFloat(e.target.value) || 0)}
              className="w-full pl-7 pr-3 py-2 text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>
          <p className="text-[11px] text-slate-500">
            Fixed documentation/legal
          </p>
        </div>

      </div>

      {/* Charges Summary Banner */}
      <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/50 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold text-amber-900 dark:text-amber-200 uppercase tracking-wider block">
            Total Upfront Charges
          </span>
          <span className="text-xs text-amber-700 dark:text-amber-400">
            Processing Fee ({formatINR(processingFee)}) + GST ({formatINR(gstAmount)}) + Other ({formatINR(otherCharges)})
          </span>
        </div>
        <span className="text-xl sm:text-2xl font-black text-amber-900 dark:text-amber-100">
          {formatINR(totalCharges)}
        </span>
      </div>

    </div>
  );
};
