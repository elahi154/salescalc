'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  IndianRupee,
  Receipt,
  Percent,
  Calendar,
  Sparkles,
  Layers,
  Table as TableIcon,
  Zap,
} from 'lucide-react';

export default function LoanBreakdownPage() {
  const {
    inputs,
    updateInput,
    setFullState,
  } = useLoanCalculator();

  const { loanAmount, interestRate, rateType, tenureValue, tenureType } = inputs;

  // Upfront Extra Charges states
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(2.5);
  const [otherCharges, setOtherCharges] = useState<number>(0);
  const [scheduleFreq, setScheduleFreq] = useState<'monthly' | 'yearly'>('monthly');

  // Safe default initialization (5 Lakhs, 14% p.a., 5 Years)
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      setFullState({
        loanAmount: 500000,
        interestRate: 14,
        rateType: 'annual',
        tenureValue: 5,
        tenureType: 'years',
      });
    }
  }, [setFullState]);

  // Charges calculations & capitalization
  const processingFeeAmount = Math.round(((loanAmount || 0) * (processingFeePercent || 0)) / 100);
  const totalUpfrontCharges = processingFeeAmount + (otherCharges || 0);
  const financedPrincipal = (loanAmount || 0) + totalUpfrontCharges;

  // Complete Amortization Schedule Calculation including Capitalized Charges
  const scheduleData = useMemo(() => {
    const P = financedPrincipal;
    const annualRate = rateType === 'monthly' ? (interestRate || 0) * 12 : (interestRate || 0);
    const r = annualRate / 12 / 100;
    const totalMonths = tenureType === 'years' ? (tenureValue || 0) * 12 : (tenureValue || 0);

    if (P <= 0 || r <= 0 || totalMonths <= 0) {
      return {
        emi: 0,
        totalInterest: 0,
        totalPayable: P,
        monthlyRows: [],
        yearlyRows: [],
      };
    }

    const factor = Math.pow(1 + r, totalMonths);
    const emiValue = Math.round((P * r * factor) / (factor - 1));
    const totalPayableValue = emiValue * totalMonths;
    const totalInterestValue = Math.max(0, totalPayableValue - P);

    // Generate monthly schedule table data
    let balance = P;
    const monthlyRows: Array<{
      period: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }> = [];

    for (let m = 1; m <= totalMonths; m++) {
      const interestForMonth = Math.round(balance * r);
      const principalForMonth = Math.min(balance, emiValue - interestForMonth);
      balance = Math.max(0, balance - principalForMonth);

      monthlyRows.push({
        period: m,
        payment: emiValue,
        principal: principalForMonth,
        interest: interestForMonth,
        balance,
      });
    }

    // Group into yearly rows
    const yearlyRows: Array<{
      year: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }> = [];

    const totalYears = Math.ceil(totalMonths / 12);
    for (let y = 1; y <= totalYears; y++) {
      const startIdx = (y - 1) * 12;
      const endIdx = Math.min(y * 12, totalMonths);
      const yearSlice = monthlyRows.slice(startIdx, endIdx);

      const yrPayment = yearSlice.reduce((acc, row) => acc + row.payment, 0);
      const yrPrincipal = yearSlice.reduce((acc, row) => acc + row.principal, 0);
      const yrInterest = yearSlice.reduce((acc, row) => acc + row.interest, 0);
      const yrEndingBalance = yearSlice[yearSlice.length - 1]?.balance || 0;

      yearlyRows.push({
        year: y,
        payment: yrPayment,
        principal: yrPrincipal,
        interest: yrInterest,
        balance: yrEndingBalance,
      });
    }

    return {
      emi: emiValue,
      totalInterest: totalInterestValue,
      totalPayable: totalPayableValue,
      monthlyRows,
      yearlyRows,
    };
  }, [financedPrincipal, interestRate, rateType, tenureValue, tenureType]);

  const { emi, totalInterest, totalPayable, monthlyRows, yearlyRows } = scheduleData;

  // Exact 3-way distribution share for donut chart
  const totalOutflow = financedPrincipal + totalInterest;
  const loanShare = totalOutflow > 0 ? Number(((loanAmount / totalOutflow) * 100).toFixed(1)) : 0;
  const chargesShare = totalOutflow > 0 ? Number(((totalUpfrontCharges / totalOutflow) * 100).toFixed(1)) : 0;
  const interestShare = totalOutflow > 0 ? Number((100 - loanShare - chargesShare).toFixed(1)) : 0;

  // Donut SVG parameters
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const loanOffset = 0;
  const chargesOffset = (loanShare / 100) * circumference;
  const interestOffset = ((loanShare + chargesShare) / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col bg-[#070A12] text-white selection:bg-blue-600 selection:text-white pb-14">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-3 space-y-3">
        
        {/* 1. HERO SUMMARY CARD */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-center shadow-lg border border-white/15">
          <div className="flex items-center justify-center gap-1.5 text-blue-100 text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Monthly EMI Installment</span>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-1">
            {formatINR(emi)}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/15 text-left text-xs">
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block truncate">Financed Principal</span>
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

        {/* 2. DIRECT EDITABLE INPUTS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          
          {/* A. Loan Amount */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-blue-400" />
                Loan Principal
              </label>
              <span className="text-blue-400 font-bold">{formatINRCompact(loanAmount || 0)}</span>
            </div>

            <div className="flex items-center bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-blue-500">
              <span className="text-base font-bold text-slate-500 mr-2">₹</span>
              <input
                type="number"
                inputMode="numeric"
                value={loanAmount === 0 ? '' : loanAmount}
                onChange={(e) => updateInput('loanAmount', e.target.value === '' ? 0 : Number(e.target.value))}
                className="w-full bg-transparent font-bold text-lg text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="500000"
              />
            </div>

            {/* Quick Presets */}
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

          {/* B. Extra Charges Included */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1">
                <Receipt className="w-3.5 h-3.5 text-rose-400" />
                Extra Charges (Included in Loan)
              </span>
              <span className="text-rose-400 font-bold">+{formatINR(totalUpfrontCharges)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {/* Processing Fee % */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Fee Rate</span>
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

              {/* Other Upfront Charges */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                  <span>Other Fee</span>
                  <span className="text-slate-400 font-bold">{otherCharges === 0 ? '₹0' : formatINR(otherCharges)}</span>
                </div>
                <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-blue-500">
                  <span className="text-xs font-bold text-slate-500 mr-1.5">₹</span>
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

          {/* C. Interest Rate */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-blue-400" />
                Interest Rate
              </label>

              <div className="inline-flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() =>
                    setFullState({
                      rateType: 'annual',
                      interestRate: rateType === 'monthly' ? Number((interestRate * 12).toFixed(2)) : interestRate,
                    })
                  }
                  className={`px-2 py-0.5 font-bold rounded ${
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
                  className={`px-2 py-0.5 font-bold rounded ${
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
                className="w-full bg-transparent font-bold text-lg text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="14"
              />
              <span className="text-xs font-bold text-slate-500 ml-2 shrink-0">
                {rateType === 'annual' ? '% per year' : '% per month'}
              </span>
            </div>
          </div>

          {/* D. Tenure Duration */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-blue-400" />
                Loan Duration
              </label>

              <div className="inline-flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
                <button
                  type="button"
                  onClick={() =>
                    setFullState({
                      tenureType: 'years',
                      tenureValue: tenureType === 'months' ? Math.max(1, Math.round(tenureValue / 12)) : tenureValue,
                    })
                  }
                  className={`px-2 py-0.5 font-bold rounded ${
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
                  className={`px-2 py-0.5 font-bold rounded ${
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
                value={tenureValue === 0 ? '' : tenureValue}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  updateInput('tenureValue', val);
                }}
                className="w-full bg-transparent font-bold text-lg text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="5"
              />
              <span className="text-xs font-bold text-blue-400 ml-2 shrink-0">
                {tenureType === 'years' ? `${(tenureValue || 0) * 12} Total EMIs` : `${tenureValue || 0} Total EMIs`}
              </span>
            </div>
          </div>

        </div>

        {/* 3. VISUAL LOAN DONUT BREAKDOWN */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-blue-400" />
              <span>Loan Outflow Breakdown</span>
            </span>
            <span className="text-slate-400 font-semibold text-[10px]">
              Total: {formatINRCompact(totalPayable)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* SVG Donut */}
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

                {/* Base Loan Slice (Blue) */}
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

                {/* Extra Charges Slice (Rose) */}
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

                {/* Interest Slice (Amber) */}
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
                <span className="font-bold text-white">{formatINR(loanAmount || 0)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                  <span>Charges Added</span>
                </span>
                <span className="font-bold text-rose-400">+{formatINR(totalUpfrontCharges)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span>Total Interest</span>
                </span>
                <span className="font-bold text-amber-400">+{formatINR(totalInterest)}</span>
              </div>
            </div>
          </div>

          <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800 mt-1">
            <div style={{ width: `${loanShare}%` }} className="h-full bg-blue-500" />
            <div style={{ width: `${chargesShare}%` }} className="h-full bg-rose-500" />
            <div style={{ width: `${interestShare}%` }} className="h-full bg-amber-500" />
          </div>
        </div>

        {/* 4. CLEAN AMORTIZATION TABLE (ONE-SCREEN SCROLL CONTAINER) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
              <TableIcon className="w-3.5 h-3.5 text-blue-400" />
              <span>Amortization Schedule</span>
            </div>

            {/* Monthly vs Yearly Frequency Toggle */}
            <div className="inline-flex p-0.5 bg-slate-950 rounded-lg border border-slate-800 text-[10px]">
              <button
                type="button"
                onClick={() => setScheduleFreq('monthly')}
                className={`px-2 py-0.5 font-bold rounded ${
                  scheduleFreq === 'monthly' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setScheduleFreq('yearly')}
                className={`px-2 py-0.5 font-bold rounded ${
                  scheduleFreq === 'yearly' ? 'bg-blue-600 text-white' : 'text-slate-400'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          {/* Schedule Table Container */}
          <div className="rounded-xl border border-slate-800/80 overflow-hidden bg-slate-950/60">
            <div className="grid grid-cols-5 text-[9px] font-bold text-slate-400 uppercase tracking-wider bg-slate-950 py-2 px-2.5 border-b border-slate-800">
              <span>{scheduleFreq === 'monthly' ? 'Month' : 'Year'}</span>
              <span className="text-right">EMI</span>
              <span className="text-right">Principal</span>
              <span className="text-right">Interest</span>
              <span className="text-right">Balance</span>
            </div>

            <div className="max-h-56 overflow-y-auto divide-y divide-slate-800/60 text-xs">
              {(scheduleFreq === 'monthly' ? monthlyRows : yearlyRows).map((row: any, idx: number) => (
                <div
                  key={idx}
                  className="grid grid-cols-5 py-2 px-2.5 hover:bg-slate-800/30 text-[11px] items-center transition-colors"
                >
                  <span className="font-bold text-white text-[10px]">
                    {scheduleFreq === 'monthly' ? `M${row.period}` : `Yr ${row.year}`}
                  </span>
                  <span className="text-right font-bold text-blue-400">
                    {formatINR(row.payment)}
                  </span>
                  <span className="text-right text-slate-200">
                    {formatINR(row.principal)}
                  </span>
                  <span className="text-right text-amber-400">
                    {formatINR(row.interest)}
                  </span>
                  <span className="text-right text-slate-400">
                    {formatINR(row.balance)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}