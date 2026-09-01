'use client';

import React, { useState, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  RefreshCw,
  IndianRupee,
  Percent,
  Plus,
  Minus,
  Sparkles,
  Info,
  Wallet,
} from 'lucide-react';

export default function ODFlexiCalculatorPage() {
  // Input states (Defaults: ₹10L Limit, ₹4L Utilized, 12% p.a. Yearly by default)
  const [sanctionedLimit, setSanctionedLimit] = useState<number>(1000000);
  const [utilizedAmount, setUtilizedAmount] = useState<number>(400000);
  const [interestRate, setInterestRate] = useState<number>(12.0); // 12% p.a. default
  const [rateType, setRateType] = useState<'monthly' | 'annual'>('annual'); // Yearly selected by default

  // Exact OD / Flexi Math
  const calculation = useMemo(() => {
    const limit = sanctionedLimit || 0;
    const utilized = Math.min(limit, utilizedAmount || 0);
    const unutilized = Math.max(0, limit - utilized);

    const monthlyRateDecimal = rateType === 'monthly'
      ? (interestRate || 0) / 100
      : ((interestRate || 0) / 12) / 100;

    const annualRatePercent = rateType === 'monthly'
      ? (interestRate || 0) * 12
      : (interestRate || 0);

    const monthlyInterest = Math.round(utilized * monthlyRateDecimal);
    const dailyInterest = Math.round(monthlyInterest / 30);
    const annualInterest = Math.round(monthlyInterest * 12);
    const utilizationPercent = limit > 0 ? Math.round((utilized / limit) * 100) : 0;
    const unutilizedPercent = 100 - utilizationPercent;

    return {
      limit,
      utilized,
      unutilized,
      monthlyInterest,
      dailyInterest,
      annualInterest,
      annualRatePercent,
      utilizationPercent,
      unutilizedPercent,
    };
  }, [sanctionedLimit, utilizedAmount, interestRate, rateType]);

  // Steppers
  const stepLimit = (delta: number) => {
    const next = Math.max(10000, sanctionedLimit + delta);
    setSanctionedLimit(next);
    if (utilizedAmount > next) {
      setUtilizedAmount(next);
    }
  };

  const stepUtilized = (delta: number) => {
    const next = Math.max(0, Math.min(sanctionedLimit, utilizedAmount + delta));
    setUtilizedAmount(next);
  };

  const stepRate = (delta: number) => {
    const step = rateType === 'monthly' ? 0.05 : 0.25;
    const max = rateType === 'monthly' ? 5.0 : 40.0;
    const next = Math.max(0.05, Math.min(max, Number((interestRate + delta * (step / 0.1)).toFixed(2))));
    setInterestRate(next);
  };

  const limitPresets = [
    { label: '₹2L', val: 200000 },
    { label: '₹5L', val: 500000 },
    { label: '₹10L', val: 1000000 },
    { label: '₹25L', val: 2500000 },
    { label: '₹50L', val: 5000000 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors text-slate-900 dark:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-200 dark:border-cyan-800">
            <RefreshCw className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Overdraft & Flexi Interest Suite</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            OD / Flexi Loan Calculator
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Calculate interest strictly on your utilized credit line with ₹0 charge on unutilized funds.
          </p>
        </div>

        {/* 1. HERO OD INTEREST RESULT CARD */}
        <div className="rounded-3xl bg-gradient-to-br from-cyan-600 via-teal-700 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-cyan-500/30 space-y-6">
          <div className="flex items-center justify-between text-cyan-100 text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Your Estimated OD Interest Bill</span>
            </span>
            <span className="text-[11px] bg-black/20 px-2.5 py-1 rounded-full border border-white/10">
              Daily Amortized Math
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-cyan-200 block">
                Monthly Interest Due
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-0.5">
                {formatINR(calculation.monthlyInterest)}
                <span className="text-xs font-normal text-cyan-200 block sm:inline sm:ml-1.5">/ month</span>
              </div>
              <p className="text-xs text-cyan-200/90 mt-1.5 font-medium">
                ≈ {formatINR(calculation.dailyInterest)} / day (Annual: {formatINRCompact(calculation.annualInterest)})
              </p>
            </div>

            {/* Visual Limit Utilization Bar */}
            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-cyan-200 font-medium">Credit Utilization</span>
                <span className="font-extrabold text-white">{calculation.utilizationPercent}% Utilized</span>
              </div>

              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden flex">
                <div
                  style={{ width: `${calculation.utilizationPercent}%` }}
                  className="h-full bg-amber-400 transition-all duration-300"
                />
                <div
                  style={{ width: `${calculation.unutilizedPercent}%` }}
                  className="h-full bg-emerald-400 transition-all duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div>
                  <span className="text-[10px] text-amber-300 block font-bold">● Utilized (Interest Active)</span>
                  <span className="font-extrabold text-white">{formatINRCompact(calculation.utilized)}</span>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-300 block font-bold">● Available (₹0 Interest)</span>
                  <span className="font-extrabold text-white">{formatINRCompact(calculation.unutilized)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. DIRECT EDITABLE INPUT CONTROLS */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-500" />
              <span>Adjust Overdraft Parameters</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Tap numbers to edit or use + / -</span>
          </div>

          {/* 1. SANCTIONED LIMIT */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Total Sanctioned Limit
              </span>
              <span className="text-cyan-600 dark:text-cyan-400 font-extrabold">({formatINRCompact(sanctionedLimit || 0)})</span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-cyan-500 transition-colors">
              <button
                type="button"
                onClick={() => stepLimit(-50000)}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white font-bold flex items-center justify-center transition-all shrink-0"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="flex items-center justify-center flex-1">
                <span className="text-2xl sm:text-3xl font-bold text-slate-400 mr-1">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={10000}
                  max={100000000}
                  value={sanctionedLimit === 0 ? '' : sanctionedLimit}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Number(e.target.value);
                    setSanctionedLimit(val);
                    if (utilizedAmount > val) setUtilizedAmount(val);
                  }}
                  className="w-full bg-transparent text-center font-black text-2xl sm:text-3xl text-slate-900 dark:text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
              </div>

              <button
                type="button"
                onClick={() => stepLimit(50000)}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white font-bold flex items-center justify-center transition-all shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <input
              type="range"
              min={100000}
              max={10000000}
              step={50000}
              value={Math.min(sanctionedLimit, 10000000)}
              onChange={(e) => {
                const val = Number(e.target.value);
                setSanctionedLimit(val);
                if (utilizedAmount > val) setUtilizedAmount(val);
              }}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-600"
            />

            <div className="flex flex-wrap gap-2 pt-1">
              {limitPresets.map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => {
                    setSanctionedLimit(p.val);
                    if (utilizedAmount > p.val) setUtilizedAmount(p.val);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    sanctionedLimit === p.val
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. UTILIZED AMOUNT */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Wallet className="w-4 h-4 text-amber-500" /> Actually Utilized Amount
              </span>
              <span className="text-amber-500 font-extrabold">({calculation.utilizationPercent}% of Limit)</span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-amber-500 transition-colors">
              <button
                type="button"
                onClick={() => stepUtilized(-25000)}
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
                  max={sanctionedLimit}
                  value={utilizedAmount === 0 ? '' : utilizedAmount}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : Number(e.target.value);
                    setUtilizedAmount(Math.min(sanctionedLimit, val));
                  }}
                  className="w-full bg-transparent text-center font-black text-2xl sm:text-3xl text-amber-500 outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
              </div>

              <button
                type="button"
                onClick={() => stepUtilized(25000)}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white font-bold flex items-center justify-center transition-all shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <input
              type="range"
              min={0}
              max={sanctionedLimit}
              step={10000}
              value={utilizedAmount}
              onChange={(e) => setUtilizedAmount(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />

            {/* Quick Utilization % Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {[25, 50, 75, 100].map((pct) => {
                const targetVal = Math.round((sanctionedLimit * pct) / 100);
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setUtilizedAmount(targetVal)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      utilizedAmount === targetVal
                        ? 'bg-amber-500 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Use {pct}% ({formatINRCompact(targetVal)})
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. INTEREST RATE */}
          <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-cyan-600 dark:text-cyan-400" /> Interest Rate
              </span>

              {/* Monthly vs Annual Selector (Yearly Selected by Default) */}
              <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setRateType('annual');
                    if (rateType === 'monthly') setInterestRate(Number((interestRate * 12).toFixed(2)));
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    rateType === 'annual' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Yearly (% p.a.)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRateType('monthly');
                    if (rateType === 'annual') setInterestRate(Number((interestRate / 12).toFixed(2)));
                  }}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    rateType === 'monthly' ? 'bg-cyan-600 text-white shadow-sm' : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Monthly (% / mo)
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-cyan-500 transition-colors">
              <button
                type="button"
                onClick={() => stepRate(-0.1)}
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
                    min={0.05}
                    max={40}
                    value={interestRate === 0 ? '' : interestRate}
                    onChange={(e) => setInterestRate(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    className="w-24 bg-transparent text-center font-black text-2xl sm:text-3xl text-slate-900 dark:text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="12.0"
                  />
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white ml-0.5">%</span>
                </div>
                <span className="text-[10px] text-slate-500 font-medium">
                  {rateType === 'annual' ? `≈ ${(interestRate / 12).toFixed(2)}% per month` : `≈ ${calculation.annualRatePercent.toFixed(2)}% per annum`}
                </span>
              </div>

              <button
                type="button"
                onClick={() => stepRate(0.1)}
                className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 active:scale-95 text-slate-900 dark:text-white font-bold flex items-center justify-center transition-all shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* 3. OD SUMMARY GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 block">
              Sanctioned Limit
            </span>
            <div className="text-2xl font-black text-slate-900 dark:text-white">
              {formatINR(calculation.limit)}
            </div>
            <span className="text-[11px] text-slate-400 block">Total approved bank facility</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-amber-500 block">
              Utilized Balance
            </span>
            <div className="text-2xl font-black text-amber-500">
              {formatINR(calculation.utilized)}
            </div>
            <span className="text-[11px] text-slate-400 block">Interest charged only on this</span>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-1">
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 block">
              Available Limit
            </span>
            <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              {formatINR(calculation.unutilized)}
            </div>
            <span className="text-[11px] text-emerald-600/80 font-medium block">₹0 interest on this reserve</span>
          </div>
        </div>

        {/* 4. EXPLANATORY OD LOGIC BANNER */}
        <div className="p-4 rounded-2xl bg-cyan-50 dark:bg-cyan-950/40 border border-cyan-200 dark:border-cyan-800/60 text-xs text-cyan-900 dark:text-cyan-200 flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
          <div className="space-y-1 leading-relaxed">
            <span className="font-bold block">How OD / Flexi Math works:</span>
            <span>
              Unlike standard term loans where EMI is charged on the whole amount, an Overdraft facility calculates interest on a daily rest basis exclusively for the money withdrawn ({formatINR(calculation.utilized)}). Any repaid amount immediately stops accruing interest.
            </span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}