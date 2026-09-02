'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  ArrowLeft,
  Printer,
  Sparkles,
  ShieldCheck,
  Receipt,
  IndianRupee,
  Percent,
  Calendar,
} from 'lucide-react';

export default function CustomerViewPage() {
  const { inputs, updateInput } = useLoanCalculator();
  const [activeSlice, setActiveSlice] = useState<'all' | 'loan' | 'charges' | 'interest'>('all');

  // Direct editable charges state for Customer View
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(2.5);
  const [otherCharges, setOtherCharges] = useState<number>(0);

  const { loanAmount, interestRate, tenureValue, tenureType } = inputs;

  // Real-time Capitalized Math controlled right from this page
  const processingFeeAmount = Math.round(((loanAmount || 0) * (processingFeePercent || 0)) / 100);
  const totalUpfrontCharges = processingFeeAmount + (otherCharges || 0);
  const financedPrincipal = (loanAmount || 0) + totalUpfrontCharges;

  const totalMonths = tenureType === 'years' ? (tenureValue || 1) * 12 : (tenureValue || 1);
  // Pure annual rate calculation
  const annualRatePercent = interestRate || 0;
  const monthlyRateDecimal = annualRatePercent / 12 / 100;

  // Exact live EMI & interest calculation
  const factor = Math.pow(1 + monthlyRateDecimal, totalMonths);
  const exactEmi = (financedPrincipal * monthlyRateDecimal * factor) / (factor - 1);
  const emi = Math.round(exactEmi);
  const totalPayable = emi * totalMonths;
  const totalInterest = Math.max(0, totalPayable - financedPrincipal);

  // Exact 3-Way Proportions from Real Controlled Values
  const totalOutflow = financedPrincipal + totalInterest;
  const loanShare = totalOutflow > 0 ? Number(((loanAmount / totalOutflow) * 100).toFixed(1)) : 0;
  const chargesShare = totalOutflow > 0 ? Number(((totalUpfrontCharges / totalOutflow) * 100).toFixed(1)) : 0;
  const interestShare = totalOutflow > 0 ? Number((100 - loanShare - chargesShare).toFixed(1)) : 0;

  // Donut SVG Parameters
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const loanOffset = 0;
  const chargesOffset = (loanShare / 100) * circumference;
  const interestOffset = ((loanShare + chargesShare) / 100) * circumference;

  const toggleSlice = (slice: 'loan' | 'charges' | 'interest') => {
    setActiveSlice((prev) => (prev === slice ? 'all' : slice));
  };

  const centerDisplay = {
    all: { label: 'Total', value: formatINRCompact(totalOutflow), sub: '100% Outflow' },
    loan: { label: 'Base Loan', value: `${loanShare}%`, sub: formatINRCompact(loanAmount) },
    charges: { label: 'Charges', value: `${chargesShare}%`, sub: formatINRCompact(totalUpfrontCharges) },
    interest: { label: 'Interest', value: `${interestShare}%`, sub: formatINRCompact(totalInterest) },
  }[activeSlice];

  return (
    <div className="min-h-screen bg-[#070A12] text-white font-sans selection:bg-blue-600 selection:text-white pb-14">
      
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
            Customer Loan Quote
          </span>

          <button
            type="button"
            onClick={() => window.print()}
            className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1 shadow transition-colors"
          >
            <Printer className="w-3 h-3" />
            <span>Print</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-3">
        
        {/* HERO RESULT CARD */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-center shadow-xl border border-white/15">
          <div className="flex items-center justify-center gap-1.5 text-blue-100 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Monthly Payment Plan</span>
          </div>

          <div className="text-4xl sm:text-5xl font-black text-white tracking-tight my-1">
            {formatINR(emi)}
            <span className="text-xs font-normal text-blue-200 ml-1">/ month</span>
          </div>

          <p className="text-xs font-semibold text-blue-200 mt-1">
            {tenureType === 'years' ? `${tenureValue} Years` : `${tenureValue} Months`} ({totalMonths} EMIs) @ {annualRatePercent}% p.a.
          </p>

          <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-white/20 text-left text-xs">
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block truncate">Base ({loanShare}%)</span>
              <span className="font-bold text-white text-xs block truncate">{formatINRCompact(loanAmount)}</span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block truncate">Interest ({interestShare}%)</span>
              <span className="font-bold text-amber-300 text-xs block truncate">+{formatINRCompact(totalInterest)}</span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block truncate">Charges ({chargesShare}%)</span>
              <span className="font-bold text-rose-300 text-xs block truncate">+{formatINRCompact(totalUpfrontCharges)}</span>
            </div>
          </div>
        </div>

        {/* DIRECT INLINE INPUTS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          
          {/* Row 1: Loan Principal & Annual Interest Rate */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <IndianRupee className="w-3.5 h-3.5 text-blue-400" />
                  Loan (₹)
                </span>
                <span className="text-blue-400 font-bold text-[11px]">{formatINRCompact(loanAmount || 0)}</span>
              </div>
              <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-blue-500">
                <span className="text-xs text-slate-500 mr-1">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={loanAmount === 0 ? '' : loanAmount}
                  onChange={(e) => updateInput('loanAmount', e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full bg-transparent font-bold text-sm text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="500000"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-semibold flex items-center gap-1">
                  <Percent className="w-3.5 h-3.5 text-blue-400" />
                  Annual Interest
                </span>
                <span className="text-blue-400 text-[10px] font-bold">% p.a.</span>
              </div>
              <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-blue-500">
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={interestRate === 0 ? '' : interestRate}
                  onChange={(e) => updateInput('interestRate', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                  className="w-full bg-transparent font-bold text-sm text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="14"
                />
                <span className="text-xs text-slate-500 ml-1">% p.a.</span>
              </div>
            </div>
          </div>

          {/* Row 2: Extra Charges Controls */}
          <div className="pt-2 border-t border-slate-800/80 space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-rose-400" />
                Processing & Extra Charges
              </span>
              <span className="text-rose-400 font-bold">+{formatINR(totalUpfrontCharges)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Processing Fee</span>
                  <span className="text-amber-400 font-semibold">{formatINR(processingFeeAmount)}</span>
                </div>
                <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-blue-500">
                  <input
                    type="number"
                    step="0.1"
                    inputMode="decimal"
                    value={processingFeePercent === 0 ? '' : processingFeePercent}
                    onChange={(e) => setProcessingFeePercent(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    className="w-full bg-transparent font-bold text-sm text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="2.5"
                  />
                  <span className="text-xs text-slate-500 ml-1">%</span>
                </div>
              </div>

              <div className="space-y-0.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Other Charges</span>
                  <span className="text-slate-300 font-semibold">{otherCharges === 0 ? '₹0' : formatINR(otherCharges)}</span>
                </div>
                <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-blue-500">
                  <span className="text-xs text-slate-500 mr-1">₹</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={otherCharges === 0 ? '' : otherCharges}
                    onChange={(e) => setOtherCharges(e.target.value === '' ? 0 : Number(e.target.value))}
                    className="w-full bg-transparent font-bold text-sm text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Tenure Duration */}
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Tenure Duration
              </span>
              <span className="text-blue-400 text-[10px] font-bold">{totalMonths} Total EMIs</span>
            </div>
            <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-blue-500">
              <input
                type="number"
                inputMode="numeric"
                value={tenureValue === 0 ? '' : tenureValue}
                onChange={(e) => updateInput('tenureValue', e.target.value === '' ? 0 : Number(e.target.value))}
                className="w-full bg-transparent font-bold text-sm text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="5"
              />
              <span className="text-xs text-slate-500 ml-1">
                {tenureType === 'years' ? 'Years' : 'Months'}
              </span>
            </div>
          </div>

        </div>

        {/* CLICKABLE 1:1 DONUT CHART & PERCENTAGE CARDS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 uppercase tracking-wider text-[11px]">
              Payment Breakdown Split
            </span>
            <span className="text-slate-400 text-[10px]">
              Total: {formatINRCompact(totalOutflow)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="relative w-28 h-28 shrink-0 flex items-center justify-center select-none">
              <svg className="w-full h-full -rotate-90 overflow-visible" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="11"
                />

                {/* Base Loan */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth={activeSlice === 'loan' ? 14 : 11}
                  strokeDasharray={`${(loanShare / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-loanOffset}
                  onClick={() => toggleSlice('loan')}
                  className={`cursor-pointer transition-all duration-200 hover:brightness-110 ${
                    activeSlice !== 'all' && activeSlice !== 'loan' ? 'opacity-30' : 'opacity-100'
                  }`}
                />

                {/* Charges */}
                {totalUpfrontCharges > 0 && (
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="#f43f5e"
                    strokeWidth={activeSlice === 'charges' ? 14 : 11}
                    strokeDasharray={`${(chargesShare / 100) * circumference} ${circumference}`}
                    strokeDashoffset={-chargesOffset}
                    onClick={() => toggleSlice('charges')}
                    className={`cursor-pointer transition-all duration-200 hover:brightness-110 ${
                      activeSlice !== 'all' && activeSlice !== 'charges' ? 'opacity-30' : 'opacity-100'
                    }`}
                  />
                )}

                {/* Interest */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth={activeSlice === 'interest' ? 14 : 11}
                  strokeDasharray={`${(interestShare / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-interestOffset}
                  onClick={() => toggleSlice('interest')}
                  className={`cursor-pointer transition-all duration-200 hover:brightness-110 ${
                    activeSlice !== 'all' && activeSlice !== 'interest' ? 'opacity-30' : 'opacity-100'
                  }`}
                />
              </svg>

              <div 
                onClick={() => setActiveSlice('all')}
                className="absolute inset-0 flex flex-col items-center justify-center text-center cursor-pointer"
              >
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{centerDisplay.label}</span>
                <span className="text-sm font-black text-white">{centerDisplay.value}</span>
                <span className="text-[8px] text-slate-400 font-medium">{centerDisplay.sub}</span>
              </div>
            </div>

            {/* Clickable Chips with Real Percentages */}
            <div className="flex-1 space-y-1.5 text-xs">
              <div 
                onClick={() => toggleSlice('loan')}
                className={`p-1.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                  activeSlice === 'loan' 
                    ? 'bg-blue-600/20 border-blue-500 shadow-sm' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-slate-300 truncate">Loan</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-white block text-[11px]">{formatINRCompact(loanAmount)}</span>
                  <span className="text-[9px] font-black text-blue-400 block">{loanShare}%</span>
                </div>
              </div>

              <div 
                onClick={() => toggleSlice('interest')}
                className={`p-1.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                  activeSlice === 'interest' 
                    ? 'bg-amber-600/20 border-amber-500 shadow-sm' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-300 truncate">Interest</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-amber-400 block text-[11px]">+{formatINRCompact(totalInterest)}</span>
                  <span className="text-[9px] font-black text-amber-400 block">{interestShare}%</span>
                </div>
              </div>

              <div 
                onClick={() => toggleSlice('charges')}
                className={`p-1.5 px-2 rounded-xl transition-all cursor-pointer flex items-center justify-between border ${
                  activeSlice === 'charges' 
                    ? 'bg-rose-600/20 border-rose-500 shadow-sm' 
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 truncate">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <span className="text-slate-300 truncate">Charges</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-bold text-rose-400 block text-[11px]">+{formatINRCompact(totalUpfrontCharges)}</span>
                  <span className="text-[9px] font-black text-rose-400 block">{chargesShare}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bar with Labels */}
          <div className="space-y-1 mt-2">
            <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800">
              <div 
                style={{ width: `${loanShare}%` }} 
                onClick={() => toggleSlice('loan')}
                className={`h-full bg-blue-500 cursor-pointer transition-opacity ${
                  activeSlice !== 'all' && activeSlice !== 'loan' ? 'opacity-30' : 'opacity-100'
                }`} 
              />
              <div 
                style={{ width: `${interestShare}%` }} 
                onClick={() => toggleSlice('interest')}
                className={`h-full bg-amber-500 cursor-pointer transition-opacity ${
                  activeSlice !== 'all' && activeSlice !== 'interest' ? 'opacity-30' : 'opacity-100'
                }`} 
              />
              <div 
                style={{ width: `${chargesShare}%` }} 
                onClick={() => toggleSlice('charges')}
                className={`h-full bg-rose-500 cursor-pointer transition-opacity ${
                  activeSlice !== 'all' && activeSlice !== 'charges' ? 'opacity-30' : 'opacity-100'
                }`} 
              />
            </div>

            <div className="flex justify-between text-[10px] font-semibold text-slate-400 px-0.5">
              <span className="text-blue-400">Principal: {loanShare}%</span>
              <span className="text-amber-400">Interest: {interestShare}%</span>
              <span className="text-rose-400">Charges: {chargesShare}%</span>
            </div>
          </div>
        </div>

        {/* TRUST FOOTER */}
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>Interactive quote: Adjust inputs directly to recalculate instantly.</span>
        </div>

      </main>
    </div>
  );
}