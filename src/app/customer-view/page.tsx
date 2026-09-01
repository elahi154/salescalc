'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { LoanInputControls } from '@/components/calculator/LoanInputControls';
import { PaymentDistribution } from '@/components/charts/PaymentDistribution';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { Presentation, Sparkles, ArrowLeft, Printer, ShieldCheck } from 'lucide-react';

export default function CustomerViewPage() {
  const { inputs, updateInput, setFullState, calculationResult } = useLoanCalculator();
  const [showControls, setShowControls] = useState<boolean>(false);

  const {
    loanAmount,
    emi,
    totalInterest,
    totalCharges,
    totalCost,
    monthlyRate,
    annualRate,
    tenureMonths,
  } = calculationResult;

  const { tenureValue, tenureType } = inputs;
  const monthlyRateFormatted = (monthlyRate * 100).toFixed(2);
  const annualRateFormatted = (annualRate * 100).toFixed(2);
  const tenureStr = tenureType === 'years' ? `${tenureValue} Years` : `${tenureValue} Months`;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white transition-colors">
      
      {/* Top Presentation Bar */}
      <div className="w-full bg-slate-900 border-b border-slate-800 py-4 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30">
        <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowControls(!showControls)}
            className="px-3.5 py-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 transition-colors border border-slate-700"
          >
            {showControls ? 'Hide Inputs' : 'Adjust Loan Inputs'}
          </button>
          
          <button
            onClick={() => window.print()}
            className="px-3.5 py-1.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow"
          >
            <Printer className="w-3.5 h-3.5 inline mr-1" /> Print Quote
          </button>
        </div>
      </div>

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 my-auto">
        
        {/* Optional Collapsible Input Adjuster */}
        {showControls && (
          <div className="animate-fade-in text-slate-900 dark:text-white">
            <LoanInputControls
              inputs={inputs}
              onUpdateInput={updateInput}
              onSetFullState={setFullState}
              simpleMode={true}
            />
          </div>
        )}

        {/* Customer Presentation Card */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-800 space-y-8">
          
          {/* Badge */}
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-950 text-blue-300 font-extrabold text-xs uppercase tracking-widest border border-blue-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Customer Loan Quote
            </span>
            <p className="text-xs text-slate-400">
              Calculated instantly for customer presentation
            </p>
          </div>

          {/* Loan Principal & HUGE EMI */}
          <div className="text-center space-y-3 bg-gradient-to-b from-blue-950/60 to-indigo-950/40 p-6 sm:p-8 rounded-3xl border border-blue-900/60">
            <div className="space-y-0.5">
              <span className="text-xs uppercase font-extrabold tracking-widest text-slate-400">
                Requested Loan Principal
              </span>
              <div className="text-3xl sm:text-5xl font-black text-white">
                {formatINR(loanAmount)}
              </div>
            </div>

            <div className="py-4 border-t border-b border-slate-800 space-y-1">
              <span className="text-xs uppercase font-black tracking-wider text-blue-400">
                MONTHLY EMI
              </span>
              <div className="text-4xl sm:text-6xl font-black tracking-tight text-blue-400">
                {formatINR(emi)}
              </div>
              <div className="text-xs font-bold text-slate-300 pt-1">
                <span>{monthlyRateFormatted}% / month</span>
                <span className="mx-2 text-slate-500">•</span>
                <span>≈ {annualRateFormatted}% p.a.</span>
                <span className="mx-2 text-slate-500">•</span>
                <span>{tenureStr}</span>
              </div>
            </div>
          </div>

          {/* Payment Summary Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Payment Summary
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-800">
                <span className="text-xs font-medium text-slate-400 block">Total Interest</span>
                <span className="text-xl font-extrabold text-rose-400">{formatINRCompact(totalInterest)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-800">
                <span className="text-xs font-medium text-slate-400 block">Upfront Fees & Taxes</span>
                <span className="text-xl font-extrabold text-amber-400">{formatINR(totalCharges)}</span>
              </div>

              <div className="p-4 rounded-2xl bg-blue-950 border border-blue-800">
                <span className="text-xs font-medium text-blue-200 block">Total Out-of-Pocket Cost</span>
                <span className="text-xl font-extrabold text-white">{formatINRCompact(totalCost)}</span>
              </div>
            </div>
          </div>

          {/* Donut Chart */}
          <PaymentDistribution calculation={calculationResult} />

          {/* Footer Note */}
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 text-center flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Calculated client-side in real-time. Official quote subject to lender terms.</span>
          </div>

        </div>

      </main>

    </div>
  );
}
