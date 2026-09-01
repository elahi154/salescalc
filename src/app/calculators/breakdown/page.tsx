'use client';

import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { LoanInputControls } from '@/components/calculator/LoanInputControls';
import { LoanSummary } from '@/components/calculator/LoanSummary';
import { PaymentBreakdown } from '@/components/calculator/PaymentBreakdown';
import { Calendar } from 'lucide-react';

export default function LoanBreakdownPage() {
  const {
    inputs,
    updateInput,
    setFullState,
    calculationResult,
    monthlySchedule,
    dailySchedule,
    weeklySchedule,
    annualSchedule,
  } = useLoanCalculator();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors text-slate-900 dark:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Dedicated Loan Breakdown</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Loan Breakdown Schedule
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            View your payment breakdown by day, week, month and year.
          </p>
        </div>

        {/* Inputs */}
        <LoanInputControls
          inputs={inputs}
          onUpdateInput={updateInput}
          onSetFullState={setFullState}
        />

        {/* Top Summary */}
        <LoanSummary calculation={calculationResult} />

        {/* Payment Breakdown (MONTH default selected) */}
        <PaymentBreakdown
          monthlySchedule={monthlySchedule}
          dailySchedule={dailySchedule}
          weeklySchedule={weeklySchedule}
          annualSchedule={annualSchedule}
        />

      </main>

      <Footer />
    </div>
  );
}
