'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { TenureComparison } from '@/components/calculator/TenureComparison';
import { LoanComparison } from '@/components/calculator/LoanComparison';
import { formatINRCompact } from '@/lib/calculations/formatting';
import {
  Scale,
  IndianRupee,
  Percent,
  Plus,
  Minus,
  Clock,
  Sparkles,
  Calendar,
  Layers,
} from 'lucide-react';

export default function ComparePage() {
  const {
    inputs,
    updateInput,
    setFullState,
    tenureComparison,
    loanComparison,
  } = useLoanCalculator();

  const { loanAmount, interestRate, rateType, tenureValue, tenureType } = inputs;
  const [compareMode, setCompareMode] = useState<'tenure' | 'amount'>('tenure');

  // Set default initial values: ₹5,00,000 (5 Lakhs) & 14% p.a. Yearly
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setFullState({
        loanAmount: 500000,
        interestRate: 14,
        rateType: 'annual',
      });
    }
  }, [setFullState]);

  // Steppers
  const stepAmount = (delta: number) => {
    const next = Math.min(100000000, Math.max(0, loanAmount + delta));
    updateInput('loanAmount', next);
  };

  const stepRate = (delta: number) => {
    const max = rateType === 'monthly' ? 5.0 : 50.0;
    const min = 0.1;
    const next = Number(Math.min(max, Math.max(min, interestRate + delta)).toFixed(2));
    updateInput('interestRate', next);
  };

  const stepTenure = (delta: number) => {
    const max = tenureType === 'years' ? 40 : 480;
    const min = 1;
    const next = Math.min(max, Math.max(min, tenureValue + delta));
    updateInput('tenureValue', next);
  };

  // Quick Presets
  const presets = [
    { label: '₹50k', val: 50000 },
    { label: '₹1L', val: 100000 },
    { label: '₹5L', val: 500000 },
    { label: '₹10L', val: 1000000 },
    { label: '₹25L', val: 2500000 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors text-slate-900 dark:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Dedicated Comparison Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Loan Comparison
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Compare EMI, interest and total cost across different loan amounts or tenures.
          </p>
        </div>

        {/* DIRECT EDITABLE INPUT CONTROLS CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>Base Loan Parameters</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Tap number to edit or use + / -</span>
          </div>

          {/* 1. LOAN AMOUNT */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Loan Principal
              </span>
              <span className="text-blue-600 dark:text-blue-400 font-extrabold">({formatINRCompact(loanAmount || 0)})</span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 transition-colors">
              <button
                type="button"
                onClick={() => stepAmount(-50000)}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white font-bold flex items-center justify-center transition-all shrink-0"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center flex-1">
                <span className="text-2xl sm:text-3xl font-bold text-slate-400 mr-1">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={100000000}
                  value={loanAmount === 0 ? '' : loanAmount}
                  onChange={(e) => updateInput('loanAmount', e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full bg-transparent text-center font-black text-2xl sm:text-3xl text-slate-900 dark:text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
              </div>

              <button
                type="button"
                onClick={() => stepAmount(50000)}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white font-bold flex items-center justify-center transition-all shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={10000}
              max={10000000}
              step={10000}
              value={Math.min(loanAmount, 10000000)}
              onChange={(e) => updateInput('loanAmount', Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presets.map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => updateInput('loanAmount', p.val)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    loanAmount === p.val
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. INTEREST RATE */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Interest Rate
              </span>

              {/* Yearly vs Monthly Toggle */}
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    setFullState({
                      rateType: 'annual',
                      interestRate: rateType === 'monthly' ? Number((interestRate * 12).toFixed(2)) : interestRate,
                    })
                  }
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    rateType === 'annual' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Yearly
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFullState({
                      rateType: 'monthly',
                      interestRate: rateType === 'annual' ? Number((interestRate / 12).toFixed(2)) : interestRate,
                    })
                  }
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    rateType === 'monthly' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 transition-colors">
              <button
                type="button"
                onClick={() => stepRate(-0.25)}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white font-bold flex items-center justify-center transition-all shrink-0"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center justify-center flex-1">
                <div className="flex items-center justify-center">
                  <input
                    type="number"
                    step="0.05"
                    inputMode="decimal"
                    min={0.1}
                    max={50}
                    value={interestRate === 0 ? '' : interestRate}
                    onChange={(e) => updateInput('interestRate', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    className="w-24 bg-transparent text-center font-black text-2xl sm:text-3xl text-slate-900 dark:text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white ml-0.5">%</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {rateType === 'annual' ? 'Per Annum (p.a.)' : 'Per Month'}
                </span>
              </div>

              <button
                type="button"
                onClick={() => stepRate(0.25)}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white font-bold flex items-center justify-center transition-all shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <input
              type="range"
              min={rateType === 'monthly' ? 0.1 : 1.0}
              max={rateType === 'monthly' ? 3.0 : 36.0}
              step={rateType === 'monthly' ? 0.05 : 0.25}
              value={Math.min(interestRate, rateType === 'monthly' ? 3.0 : 36.0)}
              onChange={(e) => updateInput('interestRate', Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          {/* 3. TENURE */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Base Tenure Duration
              </span>

              {/* Years vs Months Toggle */}
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() =>
                    setFullState({
                      tenureType: 'years',
                      tenureValue: tenureType === 'months' ? Math.max(1, Math.round(tenureValue / 12)) : tenureValue,
                    })
                  }
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    tenureType === 'years' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Years
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFullState({
                      tenureType: 'months',
                      tenureValue: tenureType === 'years' ? tenureValue * 12 : tenureValue,
                    })
                  }
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    tenureType === 'months' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Months
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-blue-500 transition-colors">
              <button
                type="button"
                onClick={() => stepTenure(-1)}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white font-bold flex items-center justify-center transition-all shrink-0"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex flex-col items-center justify-center flex-1">
                <div className="flex items-center justify-center">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={480}
                    value={tenureValue === 0 ? '' : tenureValue}
                    onChange={(e) => updateInput('tenureValue', e.target.value === '' ? 1 : Number(e.target.value))}
                    className="w-20 bg-transparent text-center font-black text-2xl sm:text-3xl text-slate-900 dark:text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="1"
                  />
                  <span className="text-sm font-semibold text-slate-500 ml-1">
                    {tenureType === 'years' ? (tenureValue === 1 ? 'Year' : 'Years') : 'Months'}
                  </span>
                </div>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                  {tenureType === 'years' ? `${tenureValue * 12} total EMIs` : `${tenureValue} total EMIs`}
                </span>
              </div>

              <button
                type="button"
                onClick={() => stepTenure(1)}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white font-bold flex items-center justify-center transition-all shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <input
              type="range"
              min={tenureType === 'years' ? 1 : 3}
              max={tenureType === 'years' ? 30 : 360}
              step={1}
              value={Math.min(tenureValue, tenureType === 'years' ? 30 : 360)}
              onChange={(e) => updateInput('tenureValue', Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

        </div>

        {/* MODE TOGGLE BAR */}
        <div className="flex items-center justify-center">
          <div className="inline-flex p-1.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <button
              onClick={() => setCompareMode('tenure')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
                compareMode === 'tenure'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Compare Tenures (Years)</span>
            </button>
            <button
              onClick={() => setCompareMode('amount')}
              className={`px-4 sm:px-6 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center gap-1.5 ${
                compareMode === 'amount'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Compare Loan Amounts</span>
            </button>
          </div>
        </div>

        {/* SELECTED COMPARISON SUITE */}
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