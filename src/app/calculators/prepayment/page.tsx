'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { PrepaymentCalculator } from '@/components/calculator/PrepaymentCalculator';
import { Wallet } from 'lucide-react';

export default function PrepaymentCalculatorPage() {
  const { inputs, calculationResult } = useLoanCalculator();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors text-slate-900 dark:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dedicated Prepayment Calculator</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Prepayment Calculator
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Estimate how much interest you could save with a prepayment.
          </p>
        </div>

        <PrepaymentCalculator
          calculation={calculationResult}
          inputs={inputs}
        />

      </main>

      <Footer />
    </div>
  );
}
