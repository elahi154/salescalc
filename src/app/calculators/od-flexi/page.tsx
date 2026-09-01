'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { calculateODFlexi, ODFlexiInput } from '@/lib/calculations/od-flexi';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { RefreshCw, Landmark, Percent, Wallet, Info } from 'lucide-react';

export default function ODFlexiCalculatorPage() {
  const [inputs, setInputs] = useState<ODFlexiInput>({
    sanctionedLimit: 1000000, // ₹10,00,000
    utilizedAmount: 400000, // ₹4,00,000
    interestRate: 1.0, // 1% / month
    rateType: 'monthly',
  });

  const result = useMemo(() => calculateODFlexi(inputs), [inputs]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors text-slate-900 dark:text-white">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5 text-cyan-600" />
            <span>Dedicated Overdraft Calculator</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            OD / Flexi Loan Calculator
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Calculate utilized amount, estimated interest and available limit.
          </p>
        </div>

        {/* Inputs Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
          
          {/* Sanctioned Limit */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Sanctioned OD Limit (₹)
              </label>
              <span className="text-sm font-extrabold text-blue-600 dark:text-blue-400">
                {formatINR(inputs.sanctionedLimit)}
              </span>
            </div>
            <input
              type="range"
              min={100000}
              max={5000000}
              step={50000}
              value={inputs.sanctionedLimit}
              onChange={(e) => setInputs({ ...inputs, sanctionedLimit: Number(e.target.value) })}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* Utilized Amount */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Utilized Amount (₹)
              </label>
              <span className="text-sm font-extrabold text-amber-500">
                {formatINR(inputs.utilizedAmount)} ({result.utilizationPercent}% of Limit)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={inputs.sanctionedLimit}
              step={25000}
              value={inputs.utilizedAmount}
              onChange={(e) => setInputs({ ...inputs, utilizedAmount: Number(e.target.value) })}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
          </div>

          {/* Interest Rate Input */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Interest Rate ({inputs.rateType === 'monthly' ? 'Monthly' : 'Annual'})
              </label>
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                ≈ {result.annualRatePercent.toFixed(2)}% p.a.
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="number"
                step="0.05"
                value={inputs.interestRate}
                onChange={(e) => setInputs({ ...inputs, interestRate: parseFloat(e.target.value) || 0 })}
                className="w-32 px-3 py-2 text-right font-bold bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-base"
              />
              <span className="text-xs font-semibold text-slate-500">% per month</span>
            </div>
          </div>

        </div>

        {/* Results Details Card */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-indigo-900/50 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-cyan-300 uppercase tracking-wider block">
                Monthly OD Interest Bill
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-1">
                {formatINR(result.monthlyInterest)} <span className="text-xs font-normal text-slate-400">/ month</span>
              </div>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              ~{formatINR(result.dailyInterest)} / day
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-xs text-slate-300 block font-medium">Sanctioned OD Limit</span>
              <span className="text-lg font-bold text-white mt-1 block">{formatINR(result.sanctionedLimit)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-xs text-amber-300 block font-medium">Utilized Amount</span>
              <span className="text-lg font-bold text-amber-300 mt-1 block">{formatINR(result.utilizedAmount)}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10">
              <span className="text-xs text-emerald-300 block font-medium">Available Limit</span>
              <span className="text-lg font-bold text-emerald-300 mt-1 block">{formatINR(result.unutilizedAmount)}</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/60 border border-cyan-800/60 text-xs text-cyan-200 flex items-start gap-2">
            <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <span>
              In OD / Flexi facilities, interest is calculated strictly on the daily utilized balance, not on the total sanctioned limit. You pay ₹0 interest on unutilized funds.
            </span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
