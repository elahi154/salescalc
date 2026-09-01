'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { PaymentDistribution } from '@/components/charts/PaymentDistribution';
import { ChargesCard } from '@/components/calculator/ChargesCard';
import { CustomerViewModal } from '@/components/calculator/CustomerViewModal';
import { ReportDownloadModal } from '@/components/calculator/ReportDownloadModal';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  Calculator,
  ArrowLeft,
  Presentation,
  Download,
  Sparkles,
  IndianRupee,
  Percent,
  Calendar,
  Plus,
  Minus,
  ShieldCheck,
  ChevronRight,
  PieChart as PieIcon,
  Receipt,
  CheckCircle2,
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
  const { emi, totalInterest, totalPayable, totalCost, totalCharges } = calculationResult;

  const [isCustomerViewOpen, setIsCustomerViewOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chart' | 'summary' | 'charges'>('chart');

  // Amount preset chips
  const presets = [
    { label: '₹5L', val: 500000 },
    { label: '₹10L', val: 1000000 },
    { label: '₹20L', val: 2000000 },
    { label: '₹50L', val: 5000000 },
    { label: '₹1Cr', val: 10000000 },
  ];

  // Rupee share
  const total = loanAmount + totalInterest;
  const principalShare = total > 0 ? Math.round((loanAmount / total) * 100) : 100;
  const interestShare = 100 - principalShare;

  // Steppers
  const stepAmount = (delta: number) => {
    const next = Math.min(10000000, Math.max(50000, loanAmount + delta));
    updateInput('loanAmount', next);
  };

  const stepRate = (delta: number) => {
    const max = rateType === 'monthly' ? 3.0 : 36.0;
    const min = rateType === 'monthly' ? 0.1 : 1.0;
    const next = Number(Math.min(max, Math.max(min, interestRate + delta)).toFixed(2));
    updateInput('interestRate', next);
  };

  const stepTenure = (delta: number) => {
    const max = tenureType === 'years' ? 30 : 360;
    const min = tenureType === 'years' ? 1 : 3;
    const next = Math.min(max, Math.max(min, tenureValue + delta));
    updateInput('tenureValue', next);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white font-sans overflow-x-hidden selection:bg-blue-500 selection:text-white pb-24">
      
      {/* Background Ambient Glow Lights */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[300px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* TOP BAR */}
      <header className="px-4 py-4 border-b border-slate-800/80 bg-[#0B0F17]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-extrabold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>EMI Calculator</span>
            </span>
          </div>

          <button
            onClick={() => setIsReportOpen(true)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span className="hidden sm:inline">PDF</span>
          </button>
        </div>
      </header>

      {/* MAIN BODY */}
      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6 relative z-10">
        
        {/* HERO APPLE CARD - GLOWING EMI RESULT */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-6 sm:p-8 shadow-2xl shadow-blue-500/20 border border-white/20">
          
          <div className="relative z-10 space-y-5">
            
            <div className="flex items-center justify-between text-blue-100 text-xs font-extrabold uppercase tracking-wider">
              <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Live EMI Result
              </span>
              <span className="text-[11px] font-semibold text-blue-200/80">Real-Time Math</span>
            </div>

            {/* HUGE EMI NUMBER */}
            <div className="space-y-1">
              <span className="text-xs uppercase font-extrabold tracking-widest text-blue-200 block">
                MONTHLY EMI PAYMENT
              </span>
              <div className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-md">
                {formatINR(emi)} <span className="text-sm font-bold text-blue-200">/ month</span>
              </div>
            </div>

            {/* Subtitle Pills */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-xs">
              <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-blue-200 block font-semibold">Principal</span>
                <span className="font-extrabold text-white text-xs sm:text-sm">{formatINRCompact(loanAmount)}</span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-blue-200 block font-semibold">Interest Rate</span>
                <span className="font-extrabold text-white text-xs sm:text-sm">
                  {rateType === 'monthly' ? `${interestRate}%/mo` : `${interestRate}% p.a.`}
                </span>
              </div>

              <div className="bg-white/10 backdrop-blur-md p-2.5 rounded-2xl border border-white/10">
                <span className="text-[10px] text-blue-200 block font-semibold">Tenure</span>
                <span className="font-extrabold text-white text-xs sm:text-sm">
                  {tenureValue} {tenureType === 'years' ? 'Years' : 'Mo'}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* INPUT CONTROLS PANEL */}
        <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-xl space-y-6">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-400" />
              <span>Adjust Loan Details</span>
            </h2>
            <span className="text-xs text-slate-400 font-medium">Tap + / - buttons to change</span>
          </div>

          {/* 1. LOAN AMOUNT */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-blue-400" /> Loan Principal
              </span>
              <span className="text-xs font-extrabold text-blue-400">({formatINRCompact(loanAmount)})</span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800">
              <button
                onClick={() => stepAmount(-100000)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold flex items-center justify-center text-lg transition-all shadow shrink-0"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="text-center flex-1">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {formatINR(loanAmount)}
                </div>
              </div>

              <button
                onClick={() => stepAmount(100000)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold flex items-center justify-center text-lg transition-all shadow shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <input
              type="range"
              min={50000}
              max={10000000}
              step={50000}
              value={loanAmount}
              onChange={(e) => updateInput('loanAmount', Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />

            {/* Presets */}
            <div className="flex flex-wrap gap-2 pt-1">
              {presets.map((p) => (
                <button
                  key={p.val}
                  onClick={() => updateInput('loanAmount', p.val)}
                  className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all ${
                    loanAmount === p.val
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* 2. INTEREST RATE */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Percent className="w-4 h-4 text-blue-400" /> Interest Rate
              </span>

              {/* Monthly vs Annual Toggle */}
              <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() =>
                    setFullState({
                      rateType: 'monthly',
                      interestRate: rateType === 'annual' ? Number((interestRate / 12).toFixed(2)) : interestRate,
                    })
                  }
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                    rateType === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() =>
                    setFullState({
                      rateType: 'annual',
                      interestRate: rateType === 'monthly' ? Number((interestRate * 12).toFixed(2)) : interestRate,
                    })
                  }
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                    rateType === 'annual' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800">
              <button
                onClick={() => stepRate(-0.1)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold flex items-center justify-center text-lg transition-all shadow shrink-0"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="text-center flex-1">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {interestRate.toFixed(2)}% <span className="text-sm font-semibold text-slate-400">/ {rateType === 'monthly' ? 'month' : 'p.a.'}</span>
                </div>
                <span className="text-xs font-bold text-blue-400">
                  {rateType === 'monthly' ? `≈ ${(interestRate * 12).toFixed(2)}% p.a.` : `≈ ${(interestRate / 12).toFixed(2)}% / month`}
                </span>
              </div>

              <button
                onClick={() => stepRate(0.1)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold flex items-center justify-center text-lg transition-all shadow shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <input
              type="range"
              min={rateType === 'monthly' ? 0.1 : 1.0}
              max={rateType === 'monthly' ? 3.0 : 36.0}
              step={rateType === 'monthly' ? 0.05 : 0.25}
              value={interestRate}
              onChange={(e) => updateInput('interestRate', Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

          {/* 3. TENURE */}
          <div className="space-y-3 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-blue-400" /> Tenure
              </span>

              {/* Years vs Months Toggle */}
              <div className="inline-flex p-1 bg-slate-950 rounded-xl border border-slate-800">
                <button
                  onClick={() =>
                    setFullState({
                      tenureType: 'years',
                      tenureValue: tenureType === 'months' ? Math.max(1, Math.round(tenureValue / 12)) : tenureValue,
                    })
                  }
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                    tenureType === 'years' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Years
                </button>
                <button
                  onClick={() =>
                    setFullState({
                      tenureType: 'months',
                      tenureValue: tenureType === 'years' ? tenureValue * 12 : tenureValue,
                    })
                  }
                  className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                    tenureType === 'months' ? 'bg-blue-600 text-white' : 'text-slate-400'
                  }`}
                >
                  Months
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-800">
              <button
                onClick={() => stepTenure(-1)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold flex items-center justify-center text-lg transition-all shadow shrink-0"
              >
                <Minus className="w-5 h-5" />
              </button>

              <div className="text-center flex-1">
                <div className="text-2xl sm:text-3xl font-black text-white">
                  {tenureValue} <span className="text-sm font-semibold text-slate-400">{tenureType === 'years' ? 'Years' : 'Months'}</span>
                </div>
                {tenureType === 'years' && (
                  <span className="text-xs font-bold text-blue-400">({tenureValue * 12} Installments)</span>
                )}
              </div>

              <button
                onClick={() => stepTenure(1)}
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-slate-700 active:scale-95 text-white font-bold flex items-center justify-center text-lg transition-all shadow shrink-0"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <input
              type="range"
              min={tenureType === 'years' ? 1 : 3}
              max={tenureType === 'years' ? 30 : 360}
              step={1}
              value={tenureValue}
              onChange={(e) => updateInput('tenureValue', Number(e.target.value))}
              className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
          </div>

        </div>

        {/* DETAILS CARDS (Donut Chart, Rupee Split, Summary) */}
        <div className="space-y-4">
          
          {/* Details Tab Bar */}
          <div className="flex items-center justify-center">
            <div className="inline-flex p-1 bg-slate-900 rounded-2xl border border-slate-800">
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'chart' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span>Pie Chart</span>
              </button>

              <button
                onClick={() => setActiveTab('summary')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'summary' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Summary</span>
              </button>

              <button
                onClick={() => setActiveTab('charges')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
                  activeTab === 'charges' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400'
                }`}
              >
                <Receipt className="w-3.5 h-3.5" />
                <span>Charges</span>
              </button>
            </div>
          </div>

          {/* TAB 1: DONUT CHART & RUPEE SHARE */}
          {activeTab === 'chart' && (
            <div className="space-y-4 animate-fade-in">
              <div className="bg-slate-900/90 rounded-3xl p-4 sm:p-6 border border-slate-800 shadow-xl">
                <PaymentDistribution calculation={calculationResult} />
              </div>

              <div className="bg-slate-900/90 rounded-3xl p-5 border border-slate-800 shadow-xl space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                  Where does your money go? (Rupee Split)
                </span>
                
                <div className="w-full h-4 bg-slate-800 rounded-full overflow-hidden flex">
                  <div style={{ width: `${principalShare}%` }} className="h-full bg-blue-500" />
                  <div style={{ width: `${interestShare}%` }} className="h-full bg-rose-500" />
                </div>

                <div className="flex items-center justify-between text-xs font-bold pt-1">
                  <span className="text-blue-400">
                    ₹{principalShare} Principal ({formatINRCompact(loanAmount)})
                  </span>
                  <span className="text-rose-400">
                    ₹{interestShare} Interest ({formatINRCompact(totalInterest)})
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LOAN SUMMARY MATRIX */}
          {activeTab === 'summary' && (
            <div className="bg-slate-900/90 rounded-3xl p-5 sm:p-6 border border-slate-800 shadow-xl space-y-4 animate-fade-in">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400 block">
                Total Payment Matrix
              </span>

              <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Loan Principal</span>
                  <span className="font-extrabold text-white text-base mt-0.5 block">{formatINR(loanAmount)}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-800/80 border border-slate-800">
                  <span className="text-slate-400 text-[10px] block">Total Interest</span>
                  <span className="font-extrabold text-rose-400 text-base mt-0.5 block">{formatINR(totalInterest)}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-950/80 border border-blue-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-blue-300 block">Total Out-of-Pocket</span>
                  <span className="text-xl font-black text-white">{formatINR(totalPayable)}</span>
                </div>
                <span className="text-xs font-extrabold text-blue-300">({formatINRCompact(totalPayable)})</span>
              </div>
            </div>
          )}

          {/* TAB 3: CHARGES */}
          {activeTab === 'charges' && (
            <div className="animate-fade-in text-slate-900 dark:text-white">
              <ChargesCard inputs={inputs} calculation={calculationResult} onUpdateInput={updateInput} />
            </div>
          )}

        </div>

      </main>

      {/* FLOATING ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 py-3 px-4 shadow-2xl">
        <div className="max-w-md mx-auto flex items-center gap-3">
          
          <button
            onClick={() => setIsCustomerViewOpen(true)}
            className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 active:scale-95 transition-all"
          >
            <Presentation className="w-4 h-4 text-amber-300" />
            <span>Present to Customer</span>
          </button>

          <button
            onClick={() => setIsReportOpen(true)}
            className="py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-extrabold text-xs flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4 text-blue-400" />
            <span>Quote PDF</span>
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
