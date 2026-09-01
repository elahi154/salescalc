'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { ChargesCard } from '@/components/calculator/ChargesCard';
import { formatINR } from '@/lib/calculations/formatting';
import { Percent, Receipt, Info, IndianRupee } from 'lucide-react';

export default function ProcessingChargesPage() {
  const { inputs, updateInput, calculationResult } = useLoanCalculator();
  const { loanAmount, processingFee, gstAmount, otherCharges, totalCharges } = calculationResult;

  const netDisbursement = Math.max(0, loanAmount - totalCharges);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors text-slate-900 dark:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Percent className="w-3.5 h-3.5 text-amber-500" />
            <span>Dedicated Charges Calculator</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Processing Charges Calculator
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Calculate processing fee, GST and other applicable upfront charges.
          </p>
        </div>

        {/* Loan Amount Input */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-blue-600" />
            Loan Principal Amount
          </label>
          
          <div className="flex items-center justify-between gap-4">
            <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400">
              {formatINR(loanAmount)}
            </div>
            <input
              type="text"
              value={formatINR(loanAmount, false)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, '');
                updateInput('loanAmount', parseInt(raw, 10) || 0);
              }}
              className="w-40 px-3 py-1.5 text-right font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base"
            />
          </div>
        </div>

        {/* Charges Inputs Card */}
        <ChargesCard
          inputs={inputs}
          calculation={calculationResult}
          onUpdateInput={updateInput}
        />

        {/* Summary Disbursement Impact Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 space-y-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Receipt className="w-5 h-5 text-amber-400" />
            <span>Disbursement Cash Impact</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-800 pt-6">
            <div>
              <span className="text-xs font-semibold text-slate-400 block">Sanctioned Loan</span>
              <span className="text-xl font-bold text-white">{formatINR(loanAmount)}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-amber-400 block">Total Upfront Charges</span>
              <span className="text-xl font-bold text-amber-400">- {formatINR(totalCharges)}</span>
            </div>

            <div>
              <span className="text-xs font-semibold text-emerald-400 block">Net Loan Disbursed</span>
              <span className="text-xl font-black text-emerald-400">{formatINR(netDisbursement)}</span>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
