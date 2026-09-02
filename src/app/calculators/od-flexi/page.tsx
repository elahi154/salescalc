'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  ArrowLeft,
  Sparkles,
  IndianRupee,
  Percent,
  Wallet,
  CheckCircle2,
  PieChart as PieIcon,
  Receipt,
  AlertCircle,
} from 'lucide-react';

export default function ODFlexiCalculatorPage() {
  // Input states (Default: ₹10L Limit, ₹0 Utilized, 12% p.a. Yearly)
  const [sanctionedLimit, setSanctionedLimit] = useState<number>(1000000);
  const [utilizedAmount, setUtilizedAmount] = useState<number>(0); // Initially ₹0 used
  const [interestRate, setInterestRate] = useState<number>(12.0);
  const [rateType, setRateType] = useState<'monthly' | 'annual'>('annual');

  // Independent Facility Charges (Lagte hi lagte hain chahe usage 0 ho)
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(1.5);
  const [annualMaintenanceFee, setAnnualMaintenanceFee] = useState<number>(1000);

  // Exact OD / Flexi Math
  const calculation = useMemo(() => {
    const limit = sanctionedLimit || 0;
    const utilized = Math.min(limit, utilizedAmount || 0);
    const unutilized = Math.max(0, limit - utilized);

    // Fixed facility charges calculated on total approved line
    const upfrontProcessingFee = Math.round((limit * (processingFeePercent || 0)) / 100);
    const totalSetupCharges = upfrontProcessingFee + (annualMaintenanceFee || 0);

    // Interest rate conversion
    const monthlyRateDecimal = rateType === 'monthly'
      ? (interestRate || 0) / 100
      : ((interestRate || 0) / 12) / 100;

    // Monthly interest (Strictly ₹0 agar utilized = 0)
    const monthlyInterest = Math.round(utilized * monthlyRateDecimal);
    const dailyInterest = Math.round(monthlyInterest / 30);
    const annualInterest = Math.round(monthlyInterest * 12);

    const utilizationPercent = limit > 0 ? Number(((utilized / limit) * 100).toFixed(1)) : 0;
    const unutilizedPercent = limit > 0 ? Number((100 - utilizationPercent).toFixed(1)) : 100;

    return {
      limit,
      utilized,
      unutilized,
      upfrontProcessingFee,
      totalSetupCharges,
      monthlyInterest,
      dailyInterest,
      annualInterest,
      utilizationPercent,
      unutilizedPercent,
    };
  }, [sanctionedLimit, utilizedAmount, interestRate, rateType, processingFeePercent, annualMaintenanceFee]);

  // Donut SVG parameters
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const utilizedOffset = 0;
  const unutilizedOffset = (calculation.utilizationPercent / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#070A12] text-white font-sans selection:bg-blue-600 selection:text-white pb-20">
      
      {/* 1. TOP HEADER */}
      <header className="px-4 py-3 border-b border-slate-800 bg-[#070A12]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>

          <span className="text-sm font-bold text-slate-200">
            OD / Flexi Calculator
          </span>

          <span className="w-10" />
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-3">
        
        {/* HERO CARD: LIVE INTEREST & FIXED CHARGES STATUS */}
        <div className="rounded-2xl bg-gradient-to-br from-cyan-600 to-teal-700 p-4 text-center shadow-lg border border-white/15">
          <div className="flex items-center justify-center gap-1.5 text-cyan-100 text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {calculation.utilized === 0 ? 'Reserve Ready (No Interest)' : 'Monthly Interest Bill'}
            </span>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-1">
            {formatINR(calculation.monthlyInterest)}
            <span className="text-xs font-normal text-cyan-200 ml-1">/ mo</span>
          </div>

          {calculation.utilized === 0 ? (
            <p className="text-[11px] text-cyan-100 font-medium mt-0.5">
              ₹0 interest charged because ₹0 is currently withdrawn
            </p>
          ) : (
            <p className="text-[11px] text-cyan-100 font-medium mt-0.5">
              ≈ {formatINR(calculation.dailyInterest)} / day on {formatINRCompact(calculation.utilized)} used
            </p>
          )}

          {/* Sub-Pills showing Fixed Charges vs Usage */}
          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/20 text-left text-xs">
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-cyan-200 block truncate">Used Limit</span>
              <span className="font-bold text-white text-xs block truncate">
                {formatINRCompact(calculation.utilized)}
              </span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-cyan-200 block truncate">Interest Due</span>
              <span className="font-bold text-amber-300 text-xs block truncate">
                {calculation.monthlyInterest === 0 ? '₹0 / mo' : formatINR(calculation.monthlyInterest)}
              </span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-cyan-200 block truncate">Setup / AMC</span>
              <span className="font-bold text-rose-300 text-xs block truncate">
                +{formatINRCompact(calculation.totalSetupCharges)}
              </span>
            </div>
          </div>
        </div>

        {/* 3. DIRECT EDITABLE INPUT CONTROLS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          
          {/* A. Sanctioned Limit */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-cyan-400" />
                Sanctioned Overdraft Limit
              </label>
              <span className="text-cyan-400 font-bold">{formatINRCompact(sanctionedLimit || 0)}</span>
            </div>

            <div className="flex items-center bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-cyan-500">
              <span className="text-base font-bold text-slate-500 mr-2">₹</span>
              <input
                type="number"
                inputMode="numeric"
                value={sanctionedLimit === 0 ? '' : sanctionedLimit}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  setSanctionedLimit(val);
                  if (utilizedAmount > val) setUtilizedAmount(val);
                }}
                className="w-full bg-transparent font-bold text-lg text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="1000000"
              />
            </div>

            {/* Quick Limit Presets */}
            <div className="flex gap-1.5 pt-0.5">
              {[200000, 500000, 1000000, 2500000, 5000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => {
                    setSanctionedLimit(val);
                    if (utilizedAmount > val) setUtilizedAmount(val);
                  }}
                  className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                    sanctionedLimit === val
                      ? 'bg-cyan-600 border-cyan-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {formatINRCompact(val)}
                </button>
              ))}
            </div>
          </div>

          {/* B. FIXED FACILITY CHARGES (Payable regardless of usage) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Receipt className="w-3.5 h-3.5 text-rose-400" />
                  Facility Charges (Fixed Outflow)
                </span>
                <span className="text-[10px] text-slate-500 block">
                  Lagta hi lagta hai, chahe ₹1 bhi use na karein
                </span>
              </div>
              <span className="text-rose-400 font-bold">+{formatINR(calculation.totalSetupCharges)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Processing Fee</span>
                  <span className="text-amber-400 font-semibold">{formatINR(calculation.upfrontProcessingFee)}</span>
                </div>
                <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-cyan-500">
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    value={processingFeePercent === 0 ? '' : processingFeePercent}
                    onChange={(e) => setProcessingFeePercent(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    className="w-full bg-transparent font-bold text-sm text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="1.5"
                  />
                  <span className="text-xs text-slate-500 ml-1">%</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Annual AMC/Doc</span>
                  <span className="text-slate-300 font-semibold">{annualMaintenanceFee === 0 ? '₹0' : formatINR(annualMaintenanceFee)}</span>
                </div>
                <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-cyan-500">
                  <span className="text-xs text-slate-500 mr-1">₹</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={annualMaintenanceFee === 0 ? '' : annualMaintenanceFee}
                    onChange={(e) => setAnnualMaintenanceFee(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-transparent font-bold text-sm text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="1000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* C. Actually Utilized Amount (Starts at ₹0) */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Wallet className="w-3.5 h-3.5 text-amber-400" />
                Actually Utilized Amount
              </label>
              <span className="text-amber-400 font-bold">{formatINRCompact(calculation.utilized)}</span>
            </div>

            <div className="flex items-center bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-amber-500">
              <span className="text-base font-bold text-slate-500 mr-2">₹</span>
              <input
                type="number"
                inputMode="numeric"
                value={utilizedAmount === 0 ? '' : utilizedAmount}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  setUtilizedAmount(Math.min(sanctionedLimit, val));
                }}
                className="w-full bg-transparent font-bold text-lg text-amber-400 outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0 (Withdraw nothing = ₹0 interest)"
              />
            </div>

            {/* Quick Utilization % Chips */}
            <div className="flex gap-1.5 pt-0.5">
              {[0, 25, 50, 75, 100].map((pct) => {
                const targetVal = Math.round(((sanctionedLimit || 0) * pct) / 100);
                return (
                  <button
                    key={pct}
                    type="button"
                    onClick={() => setUtilizedAmount(targetVal)}
                    className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                      utilizedAmount === targetVal
                        ? 'bg-amber-500 border-amber-400 text-white'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {pct === 0 ? '₹0 (None)' : `${pct}%`}
                  </button>
                );
              })}
            </div>
          </div>

          {/* D. Interest Rate */}
          <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-cyan-400" />
                Interest Rate (Applies only when used)
              </label>

              <div className="inline-flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() => {
                    setRateType('annual');
                    if (rateType === 'monthly') setInterestRate(Number(((interestRate || 0) * 12).toFixed(2)));
                  }}
                  className={`px-2 py-0.5 font-bold rounded ${
                    rateType === 'annual' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Yearly
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setRateType('monthly');
                    if (rateType === 'annual') setInterestRate(Number(((interestRate || 0) / 12).toFixed(2)));
                  }}
                  className={`px-2 py-0.5 font-bold rounded ${
                    rateType === 'monthly' ? 'bg-cyan-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Monthly
                </button>
              </div>
            </div>

            <div className="flex items-center bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-cyan-500">
              <input
                type="number"
                step="0.05"
                inputMode="decimal"
                value={interestRate === 0 ? '' : interestRate}
                onChange={(e) => setInterestRate(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                className="w-full bg-transparent font-bold text-lg text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="12"
              />
              <span className="text-xs font-bold text-slate-500 ml-2 shrink-0">
                {rateType === 'annual' ? '% per year' : '% per month'}
              </span>
            </div>
          </div>

        </div>

        {/* 4. VISUAL OD UTILIZATION & CHARGES DONUT GRAPH CARD */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <PieIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Credit Line Allocation</span>
            </span>
            <span className="text-slate-400 text-[10px]">
              Limit: {formatINRCompact(calculation.limit)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* SVG Donut Visual */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="11"
                />

                {/* Utilized Slice (Amber) */}
                {calculation.utilized > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="11"
                    strokeDasharray={`${(calculation.utilizationPercent / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-utilizedOffset}
                  />
                )}

                {/* Available Slice (Emerald - 100% when utilized is 0) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="11"
                  strokeDasharray={`${(calculation.unutilizedPercent / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-unutilizedOffset}
                />
              </svg>

              {/* Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-medium">Used</span>
                <span className="text-xs font-black text-white">
                  {calculation.utilizationPercent}%
                </span>
              </div>
            </div>

            {/* Legend Stats */}
            <div className="flex-1 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                  <span>Utilized ({calculation.utilizationPercent}%)</span>
                </span>
                <span className="font-bold text-amber-400">{formatINR(calculation.utilized)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>Available (₹0 Int)</span>
                </span>
                <span className="font-bold text-emerald-400">{formatINR(calculation.unutilized)}</span>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-slate-800">
                <span className="flex items-center gap-1.5 text-slate-400 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span>Fixed Charges</span>
                </span>
                <span className="font-bold text-rose-400 text-[11px]">+{formatINR(calculation.totalSetupCharges)}</span>
              </div>
            </div>
          </div>

          {/* Quick Proportion Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800 mt-1">
            <div style={{ width: `${calculation.utilizationPercent}%` }} className="h-full bg-amber-400" />
            <div style={{ width: `${calculation.unutilizedPercent}%` }} className="h-full bg-emerald-500" />
          </div>
        </div>

        {/* 5. SMART TAKEAWAY NOTE */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-2 text-xs text-slate-300">
          {calculation.utilized === 0 ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px] text-slate-400">
                Aapka pura limit <strong className="text-white">{formatINR(calculation.limit)}</strong> reserve me hai. Jab tak aap ek rupya bhi withdraw nahi karte, tab tak <strong className="text-emerald-400">₹0 monthly interest</strong> lagega. Sirf bank setup/AMC fee (<strong className="text-rose-400">{formatINR(calculation.totalSetupCharges)}</strong>) alag se one-time/annual lagti hai.
              </p>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px] text-slate-400">
                Aapne <strong className="text-white">{formatINR(calculation.utilized)}</strong> nikala hai, isliye sirf isi amount par daily calculation se <strong className="text-amber-400">{formatINR(calculation.monthlyInterest)}/month</strong> interest lag raha hai. Bacha hua <strong className="text-emerald-400">{formatINR(calculation.unutilized)}</strong> free hai.
              </p>
            </>
          )}
        </div>

      </main>
    </div>
  );
}