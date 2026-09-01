'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { PaymentDistribution } from '@/components/charts/PaymentDistribution';
import { CustomerViewModal } from '@/components/calculator/CustomerViewModal';
import { ReportDownloadModal } from '@/components/calculator/ReportDownloadModal';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  Calculator,
  ArrowLeft,
  Presentation,
  Download,
  IndianRupee,
  Percent,
  Calendar,
  Plus,
  Minus,
  PieChart as PieIcon,
  Sparkles,
} from 'lucide-react';

export default function EMICalculatorPage() {
  const {
    inputs,
    updateInput,
    setFullState,
    calculationResult,
    monthlySchedule,
    tenureComparison,
  } = useLoanCalculator();

  const { loanAmount, interestRate, rateType, tenureValue, tenureType } = inputs;
  const { emi, totalInterest, totalPayable } = calculationResult;

  // View Screen Toggle: Sirf 2 Screen ('calculator' vs 'breakdown')
  const [activeScreen, setActiveScreen] = useState<'calculator' | 'breakdown'>('calculator');
  const [isCustomerViewOpen, setIsCustomerViewOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Set default values safely
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

  // Quick Amount Presets
  const presets = [
    { label: '₹50k', val: 50000 },
    { label: '₹1L', val: 100000 },
    { label: '₹5L', val: 500000 },
    { label: '₹10L', val: 1000000 },
    { label: '₹25L', val: 2500000 },
  ];

  // Rupee share
  const total = loanAmount + totalInterest;
  const principalShare = total > 0 ? Math.round((loanAmount / total) * 100) : 100;
  const interestShare = 100 - principalShare;

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

  return (
    <div className="min-h-screen bg-[#090D16] text-white font-sans selection:bg-blue-600 selection:text-white pb-32">
      
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-80 h-48 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

      {/* HEADER */}
      <header className="px-4 py-3.5 border-b border-slate-800/80 bg-[#090D16]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <span className="text-xs font-bold text-slate-200 tracking-wide">
            EMI Loan Calculator
          </span>

          <button
            onClick={() => setIsReportOpen(true)}
            className="p-1.5 px-3 rounded-lg bg-slate-800/90 text-blue-400 hover:bg-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-700"
            aria-label="Download PDF Report"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-lg mx-auto px-4 pt-4 space-y-4">
        
        {/* HERO CARD: MONTHLY EMI */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-5 shadow-xl shadow-blue-500/15 border border-white/15 text-center relative overflow-hidden">
          <div className="flex items-center justify-center gap-1.5 text-blue-100 text-[11px] font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Your Monthly Payment</span>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            {formatINR(emi)}
            <span className="text-xs font-medium text-blue-200 block sm:inline sm:ml-1"> / month</span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/15 grid grid-cols-2 gap-2 text-left">
            <div className="bg-black/20 rounded-xl p-2 px-3 border border-white/5">
              <span className="text-[10px] text-blue-200 font-medium block">Total Loan Amount</span>
              <span className="text-xs font-bold text-white">{formatINRCompact(loanAmount)}</span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 px-3 border border-white/5">
              <span className="text-[10px] text-blue-200 font-medium block">Total Extra Interest</span>
              <span className="text-xs font-bold text-amber-300">+{formatINRCompact(totalInterest)}</span>
            </div>
          </div>
        </div>

        {/* SCREEN TOGGLE TABS (Sirf 2 Screens) */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setActiveScreen('calculator')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeScreen === 'calculator'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculator</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('breakdown')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeScreen === 'breakdown'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <PieIcon className="w-3.5 h-3.5" />
            <span>Pie Chart</span>
          </button>
        </div>

        {/* SCREEN 1: THE CALCULATOR */}
        {activeScreen === 'calculator' && (
          <div className="space-y-4">
            
            {/* 1. LOAN AMOUNT (TYPEABLE) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-blue-400" />
                    <span>Loan Amount</span>
                  </h2>
                  <span className="text-[11px] text-slate-500">Tap number to type custom amount</span>
                </div>
                <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                  {formatINRCompact(loanAmount)}
                </span>
              </div>

              {/* Editable Input Box */}
              <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 focus-within:border-blue-500 transition-colors">
                <button
                  type="button"
                  onClick={() => stepAmount(-50000)}
                  aria-label="Decrease Amount"
                  className="w-10 h-10 rounded-lg bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex items-center justify-center flex-1 px-2">
                  <span className="text-xl sm:text-2xl font-bold text-slate-400 mr-1">₹</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={100000000}
                    value={loanAmount || ''}
                    onChange={(e) => {
                      const val = e.target.value === '' ? 0 : Number(e.target.value);
                      updateInput('loanAmount', val);
                    }}
                    className="w-full bg-transparent text-center font-black text-xl sm:text-2xl text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => stepAmount(50000)}
                  aria-label="Increase Amount"
                  className="w-10 h-10 rounded-lg bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4" />
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
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />

              {/* Quick Presets */}
              <div className="flex items-center justify-between gap-1 pt-1">
                {presets.map((p) => (
                  <button
                    key={p.val}
                    type="button"
                    onClick={() => updateInput('loanAmount', p.val)}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                      loanAmount === p.val
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-slate-800/70 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. INTEREST RATE (TYPEABLE) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
                    <Percent className="w-3.5 h-3.5 text-blue-400" />
                    <span>Interest Rate</span>
                  </h2>
                  <span className="text-[11px] text-slate-500">Tap number to edit rate</span>
                </div>

                {/* Rate Type Selector */}
                <div className="inline-flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() =>
                      setFullState({
                        rateType: 'annual',
                        interestRate: rateType === 'monthly' ? Number((interestRate * 12).toFixed(2)) : interestRate,
                      })
                    }
                    className={`px-2 py-0.5 font-bold rounded-md ${
                      rateType === 'annual' ? 'bg-blue-600 text-white' : 'text-slate-400'
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
                    className={`px-2 py-0.5 font-bold rounded-md ${
                      rateType === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              {/* Editable Input Box */}
              <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 focus-within:border-blue-500 transition-colors">
                <button
                  type="button"
                  onClick={() => stepRate(-0.25)}
                  aria-label="Decrease Rate"
                  className="w-10 h-10 rounded-lg bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center justify-center flex-1 px-2">
                  <div className="flex items-center justify-center">
                    <input
                      type="number"
                      step="0.05"
                      inputMode="decimal"
                      min={0.1}
                      max={50}
                      value={interestRate || ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 0 : Number(e.target.value);
                        updateInput('interestRate', val);
                      }}
                      className="w-24 bg-transparent text-center font-black text-xl sm:text-2xl text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="0"
                    />
                    <span className="text-xl sm:text-2xl font-black text-white ml-0.5">%</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {rateType === 'annual' ? 'Per Annum (p.a.)' : 'Per Month'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => stepRate(0.25)}
                  aria-label="Increase Rate"
                  className="w-10 h-10 rounded-lg bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={rateType === 'monthly' ? 0.1 : 1.0}
                max={rateType === 'monthly' ? 3.0 : 36.0}
                step={rateType === 'monthly' ? 0.05 : 0.25}
                value={Math.min(interestRate, rateType === 'monthly' ? 3.0 : 36.0)}
                onChange={(e) => updateInput('interestRate', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* 3. TENURE (TYPEABLE) */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-400" />
                    <span>Loan Duration</span>
                  </h2>
                  <span className="text-[11px] text-slate-500">Tap number to edit duration</span>
                </div>

                {/* Tenure Selector */}
                <div className="inline-flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[11px]">
                  <button
                    type="button"
                    onClick={() =>
                      setFullState({
                        tenureType: 'years',
                        tenureValue: tenureType === 'months' ? Math.max(1, Math.round(tenureValue / 12)) : tenureValue,
                      })
                    }
                    className={`px-2 py-0.5 font-bold rounded-md ${
                      tenureType === 'years' ? 'bg-blue-600 text-white' : 'text-slate-400'
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
                    className={`px-2 py-0.5 font-bold rounded-md ${
                      tenureType === 'months' ? 'bg-blue-600 text-white' : 'text-slate-400'
                    }`}
                  >
                    Months
                  </button>
                </div>
              </div>

              {/* Editable Input Box */}
              <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 focus-within:border-blue-500 transition-colors">
                <button
                  type="button"
                  onClick={() => stepTenure(-1)}
                  aria-label="Decrease Tenure"
                  className="w-10 h-10 rounded-lg bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="flex flex-col items-center justify-center flex-1 px-2">
                  <div className="flex items-center justify-center">
                    <input
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={480}
                      value={tenureValue || ''}
                      onChange={(e) => {
                        const val = e.target.value === '' ? 1 : Number(e.target.value);
                        updateInput('tenureValue', val);
                      }}
                      className="w-20 bg-transparent text-center font-black text-xl sm:text-2xl text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="1"
                    />
                    <span className="text-sm font-semibold text-slate-400 ml-1">
                      {tenureType === 'years' ? (tenureValue === 1 ? 'Year' : 'Years') : 'Months'}
                    </span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-semibold">
                    {tenureType === 'years' ? `${tenureValue * 12} total EMIs` : `${tenureValue} total EMIs`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => stepTenure(1)}
                  aria-label="Increase Tenure"
                  className="w-10 h-10 rounded-lg bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={tenureType === 'years' ? 1 : 3}
                max={tenureType === 'years' ? 30 : 360}
                step={1}
                value={Math.min(tenureValue, tenureType === 'years' ? 30 : 360)}
                onChange={(e) => updateInput('tenureValue', Number(e.target.value))}
                className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
            </div>

            {/* Quick Switch Button to Breakdown */}
            <button
              type="button"
              onClick={() => setActiveScreen('breakdown')}
              className="w-full py-3 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-blue-400 text-xs font-bold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center gap-1.5">
                <PieIcon className="w-4 h-4 text-blue-400" />
                <span>See Pie Chart & Payment Split</span>
              </span>
              <span className="text-slate-400 font-medium">View &rarr;</span>
            </button>

          </div>
        )}

        {/* SCREEN 2: PIE CHART & BREAKDOWN */}
        {activeScreen === 'breakdown' && (
          <div className="space-y-4">
            
            {/* PIE CHART CARD */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl">
              <div className="text-center mb-2">
                <h3 className="text-sm font-bold text-white">Payment Distribution</h3>
                <p className="text-[11px] text-slate-400">Comparing your borrowed loan vs interest</p>
              </div>

              <div className="py-2">
                <PaymentDistribution calculation={calculationResult} />
              </div>
            </div>

            {/* 100-RUPEE SHARE BAR */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">Every ₹100 you pay goes to:</span>
              </div>
              
              <div className="w-full h-3.5 bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${principalShare}%` }} className="h-full bg-blue-500" />
                <div style={{ width: `${interestShare}%` }} className="h-full bg-amber-500" />
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] block">Loan Principal ({principalShare}%)</span>
                    <span className="font-bold text-white">{formatINR(loanAmount)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <div>
                    <span className="text-slate-400 text-[10px] block">Total Interest ({interestShare}%)</span>
                    <span className="font-bold text-amber-400">{formatINR(totalInterest)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* TOTAL PAYABLE SUMMARY CARD */}
            <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-4 flex items-center justify-between bg-gradient-to-r from-blue-950/40 to-slate-900">
              <div>
                <span className="text-[10px] uppercase font-bold text-blue-300 block">Total Amount to Repay</span>
                <span className="text-xl font-black text-white">{formatINR(totalPayable)}</span>
              </div>
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg border border-blue-500/20">
                {formatINRCompact(totalPayable)}
              </span>
            </div>

          </div>
        )}

      </main>

      {/* FLOATING ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#090D16]/95 backdrop-blur-lg border-t border-slate-800/90 py-3 px-4 shadow-2xl">
        <div className="max-w-lg mx-auto flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsCustomerViewOpen(true)}
            className="flex-1 py-3 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
          >
            <Presentation className="w-4 h-4 text-amber-300" />
            <span>Present to Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="py-3 px-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Quote</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CustomerViewModal
        isOpen={isCustomerViewOpen}
        onClose={() => setIsCustomerViewOpen(false)}
        inputs={inputs}
        calculation={calculationResult}
        monthlySchedule={monthlySchedule}
        tenureComparison={tenureComparison}
      />

      <ReportDownloadModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        inputs={inputs}
        calculation={calculationResult}
        monthlySchedule={monthlySchedule}
      />

    </div>
  );
}