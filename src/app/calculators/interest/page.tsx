'use client';

import React, { useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { LoanInputControls } from '@/components/calculator/LoanInputControls';
import { calculateInterestSensitivity } from '@/lib/calculations/interest';
import { formatINR } from '@/lib/calculations/formatting';
import { Percent, TrendingUp, Sparkles, Table } from 'lucide-react';

export default function InterestCalculatorPage() {
  const { inputs, updateInput, setFullState, calculationResult } = useLoanCalculator();

  const sensitivityRows = useMemo(() => {
    return calculateInterestSensitivity(
      inputs.loanAmount,
      inputs.interestRate,
      inputs.rateType,
      inputs.tenureValue,
      inputs.tenureType
    );
  }, [inputs]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors text-slate-900 dark:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-bold uppercase tracking-wider">
            <Percent className="w-3.5 h-3.5 text-purple-600" />
            <span>Dedicated Interest Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Interest Rate Calculator
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Understand monthly and annual interest rates and their impact on EMI.
          </p>
        </div>

        {/* Inputs */}
        <LoanInputControls
          inputs={inputs}
          onUpdateInput={updateInput}
          onSetFullState={setFullState}
        />

        {/* Rate Impact Sensitivity Table */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span>Interest Rate Fluctuation Impact (Sensitivity Analysis)</span>
              </h3>
              <p className="text-xs text-slate-500">
                See how a ±0.25% or ±0.50% change in rate alters your monthly EMI
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Rate ({inputs.rateType === 'monthly' ? 'Monthly' : 'Annual'})</th>
                  <th className="py-3 px-4 text-right">Monthly EMI</th>
                  <th className="py-3 px-4 text-right">EMI Difference</th>
                  <th className="py-3 px-4 text-right">Total Interest</th>
                  <th className="py-3 px-4 text-right">Total Payable</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                {sensitivityRows.map((row, idx) => {
                  const isBase = Math.abs(row.ratePercent - inputs.interestRate) < 0.01;
                  return (
                    <tr
                      key={idx}
                      className={isBase ? 'bg-purple-50 dark:bg-purple-950/40 font-bold' : 'hover:bg-slate-50'}
                    >
                      <td className="py-3 px-4">
                        <span className="font-extrabold">{row.ratePercent}%</span>
                        {isBase && <span className="ml-2 px-2 py-0.5 text-[10px] bg-purple-600 text-white rounded-full">Current Rate</span>}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-blue-600 dark:text-blue-400">
                        {formatINR(row.emi)}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold">
                        {row.differenceFromBaseEMI === 0
                          ? 'Base'
                          : row.differenceFromBaseEMI > 0
                          ? `+${formatINR(row.differenceFromBaseEMI)}`
                          : formatINR(row.differenceFromBaseEMI)}
                      </td>
                      <td className="py-3 px-4 text-right text-rose-500">{formatINR(row.totalInterest)}</td>
                      <td className="py-3 px-4 text-right font-semibold">{formatINR(row.totalPayable)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
