'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { LoanInputControls } from '@/components/calculator/LoanInputControls';
import { TenureComparison } from '@/components/calculator/TenureComparison';
import { LoanComparison } from '@/components/calculator/LoanComparison';
import { Scale } from 'lucide-react';

export default function ComparePage() {
  const {
    inputs,
    updateInput,
    setFullState,
    tenureComparison,
    loanComparison,
  } = useLoanCalculator();

  const [compareMode, setCompareMode] = useState<'tenure' | 'amount'>('tenure');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors text-slate-900 dark:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-indigo-600" />
            <span>Dedicated Comparison Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Loan Comparison
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Compare EMI, interest and total cost across different loan amounts or tenures.
          </p>
        </div>

        {/* Inputs */}
        <LoanInputControls
          inputs={inputs}
          onUpdateInput={updateInput}
          onSetFullState={setFullState}
        />

        {/* Mode Toggle Bar */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setCompareMode('tenure')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                compareMode === 'tenure'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Compare Tenures (3Y / 5Y / 7Y)
            </button>
            <button
              onClick={() => setCompareMode('amount')}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all ${
                compareMode === 'amount'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Compare Loan Amounts (₹10L–₹30L)
            </button>
          </div>
        </div>

        {/* Selected Comparison Component */}
        {compareMode === 'tenure' ? (
          <TenureComparison
            tenureComparison={tenureComparison}
            onSelectTenure={(years) =>
              setFullState({
                tenureValue: years,
                tenureType: 'years',
              })
            }
          />
        ) : (
          <LoanComparison
            loanComparison={loanComparison}
            onSelectAmount={(amount) => updateInput('loanAmount', amount)}
          />
        )}

      </main>

      <Footer />
    </div>
  );
}
