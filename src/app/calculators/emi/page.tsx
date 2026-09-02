'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { CustomerViewModal } from '@/components/calculator/CustomerViewModal';
import { ReportDownloadModal } from '@/components/calculator/ReportDownloadModal';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  ArrowLeft,
  Presentation,
  Download,
  IndianRupee,
  Receipt,
  Percent,
  Calendar,
  Sparkles,
} from 'lucide-react';

export default function EMICalculatorPage() {
  const {
    inputs,
    updateInput,
    setFullState,
    monthlySchedule,
    tenureComparison,
  } = useLoanCalculator();

  const { loanAmount, interestRate, rateType, tenureValue, tenureType } = inputs;

  const [isCustomerViewOpen, setIsCustomerViewOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);

  // Upfront Charges states
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(2.5);
  const [otherCharges, setOtherCharges] = useState<number>(0);

  // Safe initialization
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

  // Math: Charges + Capitalized Principal
  const processingFeeAmount = Math.round(((loanAmount || 0) * (processingFeePercent || 0)) / 100);
  const totalUpfrontCharges = processingFeeAmount + (otherCharges || 0);
  const financedPrincipal = (loanAmount || 0) + totalUpfrontCharges;

  // Real-time EMI math
  const liveCalculation = useMemo(() => {
    const P = financedPrincipal;
    const annualRate = rateType === 'monthly' ? (interestRate || 0) * 12 : (interestRate || 0);
    const monthlyRate = annualRate / 12 / 100;
    const totalMonths = tenureType === 'years' ? (tenureValue || 1) * 12 : (tenureValue || 1);

    if (P <= 0 || monthlyRate <= 0 || totalMonths <= 0) {
      return {
        loanAmount: P,
        principal: P,
        financedPrincipal: P,
        emi: 0,
        totalInterest: 0,
        totalPayable: P,
        totalCharges: totalUpfrontCharges,
        tenureMonths: totalMonths,
      };
    }

    const emiValue = Math.round(
      (P * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1)
    );

    const totalPayableValue = emiValue * totalMonths;
    const totalInterestValue = Math.max(0, totalPayableValue - P);

    return {
      loanAmount: P,
      principal: P,
      financedPrincipal: P,
      emi: emiValue,
      totalInterest: totalInterestValue,
      totalPayable: totalPayableValue,
      totalCharges: totalUpfrontCharges,
      tenureMonths: totalMonths,
    };
  }, [financedPrincipal, totalUpfrontCharges, interestRate, rateType, tenureValue, tenureType]);

  const { emi, totalInterest, totalPayable } = liveCalculation;

  // Exact 3-way Split Percentage for the Mini Gauge/Donut Chart
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

  return (
    <div className="min-h-screen bg-[#070A12] text-white font-sans selection:bg-blue-600 selection:text-white pb-24">
      
      {/* 1. TOP HEADER */}
      <header className="px-4 py-2.5 border-b border-slate-800/80 bg-[#070A12]/95 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Home</span>
          </Link>

          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            EMI Calculator
          </span>

          <button
            onClick={() => setIsReportOpen(true)}
            className="px-2.5 py-1 rounded-lg bg-slate-800 text-blue-400 hover:bg-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>PDF</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-3">
        
        {/* HERO RESULT CARD */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-center shadow-lg border border-white/15">
          <div className="flex items-center justify-center gap-1.5 text-blue-100 text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Monthly EMI</span>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-1">
            {formatINR(emi)}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/15 text-left text-xs">
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block truncate">Total Financed</span>
              <span className="font-bold text-white block truncate">{formatINRCompact(financedPrincipal)}</span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block truncate">Total Interest</span>
              <span className="font-bold text-amber-300 block truncate">+{formatINRCompact(totalInterest)}</span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block truncate">Extra Charges</span>
              <span className="font-bold text-rose-300 block truncate">+{formatINRCompact(totalUpfrontCharges)}</span>
            </div>
          </div>
        </div>

        {/* 3. INPUT CONTROLS (SPINNER ARROWS REMOVED) */}
        <div className="space-y-2.5">
          
          {/* Card 1: Loan Amount */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-blue-400" />
                Loan Amount
              </span>
              <span className="text-blue-400">{formatINRCompact(loanAmount)}</span>
            </div>

            <div className="flex items-center bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-blue-500">
              <span className="text-base font-bold text-slate-500 mr-2">₹</span>
              <input
                type="number"
                inputMode="numeric"
                value={loanAmount === 0 ? '' : loanAmount}
                onChange={(e) => updateInput('loanAmount', e.target.value === '' ? 0 : Number(e.target.value))}
                className="w-full bg-transparent font-black text-xl text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="500000"
              />
            </div>

            <div className="flex gap-1.5 pt-0.5">
              {[50000, 100000, 200000, 500000, 1000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => updateInput('loanAmount', val)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                    loanAmount === val
                      ? 'bg-blue-600 border-blue-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {formatINRCompact(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Card 2: Upfront Charges */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-rose-400" />
                Upfront Extra Charges
              </span>
              <span className="text-rose-400">+{formatINR(totalUpfrontCharges)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Processing Fee</span>
                  <span className="text-amber-400 font-bold">{formatINR(processingFeeAmount)}</span>
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
                  <span className="text-xs font-bold text-slate-500 ml-1">%</span>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Other Charge</span>
                  <span className="text-slate-400 font-bold">{otherCharges === 0 ? '₹0' : formatINR(otherCharges)}</span>
                </div>
                <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-blue-500">
                  <span className="text-xs font-bold text-slate-500 mr-1">₹</span>
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

          {/* Card 3: Interest Rate */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-blue-400" />
                Interest Rate
              </span>

              <div className="inline-flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
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

            <div className="flex items-center bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-blue-500">
              <input
                type="number"
                step="0.05"
                inputMode="decimal"
                value={interestRate === 0 ? '' : interestRate}
                onChange={(e) => updateInput('interestRate', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                className="w-full bg-transparent font-black text-xl text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="14"
              />
              <span className="text-xs font-bold text-slate-500 ml-1.5 shrink-0">
                {rateType === 'annual' ? '% p.a.' : '% / mo'}
              </span>
            </div>
          </div>

          {/* Card 4: Loan Duration */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Loan Duration
              </span>

              <div className="inline-flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
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

            <div className="flex items-center bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-blue-500">
              <input
                type="number"
                inputMode="numeric"
                min={1}
                value={tenureValue === 0 ? '' : tenureValue}
                onChange={(e) => updateInput('tenureValue', e.target.value === '' ? 1 : Number(e.target.value))}
                className="w-full bg-transparent font-black text-xl text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="5"
              />
              <span className="text-xs font-bold text-blue-400 ml-2 shrink-0">
                {tenureType === 'years' ? `${tenureValue * 12} Total EMIs` : `${tenureValue} Total EMIs`}
              </span>
            </div>
          </div>

        </div>

        {/* 4. BOTTOM DEDICATED PIE / DONUT BREAKDOWN CHART */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 uppercase tracking-wider text-[11px]">
              Loan Cost Breakdown
            </span>
            <span className="text-slate-400 font-semibold text-[10px]">
              Total: {formatINRCompact(totalPayable)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* Donut Visual */}
            <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                {/* Background Ring */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#1e293b"
                  strokeWidth="11"
                />

                {/* 1. Base Loan Slice (Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="11"
                  strokeDasharray={`${(loanShare / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-loanOffset}
                />

                {/* 2. Extra Charges Slice (Rose) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#f43f5e"
                  strokeWidth="11"
                  strokeDasharray={`${(chargesShare / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-chargesOffset}
                />

                {/* 3. Interest Slice (Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="11"
                  strokeDasharray={`${(interestShare / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-interestOffset}
                />
              </svg>

              {/* Center Donut Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-medium">Principal</span>
                <span className="text-xs font-black text-white">{loanShare}%</span>
              </div>
            </div>

            {/* Legend Stats */}
            <div className="flex-1 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0" />
                  <span>Base Loan</span>
                </span>
                <span className="font-bold text-white">{formatINR(loanAmount)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <span>Charges</span>
                </span>
                <span className="font-bold text-rose-400">+{formatINR(totalUpfrontCharges)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Interest</span>
                </span>
                <span className="font-bold text-amber-400">+{formatINR(totalInterest)}</span>
              </div>
            </div>
          </div>

          {/* Quick 100% Horizontal Proportion Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800 mt-1">
            <div style={{ width: `${loanShare}%` }} className="h-full bg-blue-500" />
            <div style={{ width: `${chargesShare}%` }} className="h-full bg-rose-500" />
            <div style={{ width: `${interestShare}%` }} className="h-full bg-amber-500" />
          </div>
        </div>

      </main>

      {/* 5. FLOATING BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#070A12] border-t border-slate-800 py-2.5 px-4 shadow-xl">
        <div className="max-w-md mx-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCustomerViewOpen(true)}
            className="flex-1 py-2.5 px-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95"
          >
            <Presentation className="w-4 h-4 text-amber-300" />
            <span>Present to Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all active:scale-95"
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
        calculation={liveCalculation}
        monthlySchedule={monthlySchedule}
        tenureComparison={tenureComparison}
      />

      <ReportDownloadModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        inputs={inputs}
        calculation={liveCalculation}
        monthlySchedule={monthlySchedule}
      />

    </div>
  );
}