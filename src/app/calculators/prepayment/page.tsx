'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  TrendingDown,
  CheckCircle2,
  Calendar,
  Receipt,
} from 'lucide-react';

export default function PrepaymentCalculatorPage() {
  const { inputs, updateInput, setFullState } = useLoanCalculator();
  const { loanAmount, interestRate, rateType, tenureValue, tenureType } = inputs;

  // Upfront Extra Charges (Processing fee + other charges)
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(2.5);
  const [otherCharges, setOtherCharges] = useState<number>(0);

  // Prepayment States
  const [prepayType, setPrepayType] = useState<'lumpSum' | 'monthlyExtra'>('lumpSum');
  const [prepayAmount, setPrepayAmount] = useState<number>(50000);
  const [prepayMonth, setPrepayMonth] = useState<number>(12);
  const [targetOutcome, setTargetOutcome] = useState<'reduceTenure' | 'reduceEMI'>('reduceTenure');

  // Safe initial default values
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

  const totalTenureMonths = tenureType === 'years' ? (tenureValue || 1) * 12 : (tenureValue || 1);
  const monthlyRate = ((rateType === 'monthly' ? (interestRate || 0) * 12 : (interestRate || 0)) / 12) / 100;

  // Complete Amortization & Exact Prepayment Calculation using financedPrincipal
  const prepaymentMath = useMemo(() => {
    const P = financedPrincipal;
    const r = monthlyRate;
    const n = totalTenureMonths;

    if (P <= 0 || r <= 0 || n <= 0) {
      return {
        baseEmi: 0,
        baseTotalInterest: 0,
        interestSaved: 0,
        monthsSaved: 0,
        newTenureMonths: n,
        newEMI: 0,
        newTotalInterest: 0,
      };
    }

    const factor = Math.pow(1 + r, n);
    const baseEmi = Math.round((P * r * factor) / (factor - 1));
    const baseTotalInterest = Math.max(0, baseEmi * n - P);

    let newTotalInterest = 0;
    let newMonthsCount = 0;
    let revisedEMI = baseEmi;
    let postBalance = P;

    if (prepayType === 'lumpSum') {
      const activePrepayMonth = Math.min(prepayMonth || 1, n);

      // Normal amortisation up to prepayment point
      for (let m = 1; m <= activePrepayMonth && postBalance > 0; m++) {
        const intAmt = Math.round(postBalance * r);
        newTotalInterest += intAmt;
        const princPaid = Math.min(postBalance, baseEmi - intAmt);
        postBalance = Math.max(0, postBalance - princPaid);
        newMonthsCount++;
      }

      // Deduct lump sum
      postBalance = Math.max(0, postBalance - (prepayAmount || 0));

      if (postBalance > 0) {
        if (targetOutcome === 'reduceTenure') {
          while (postBalance > 0 && newMonthsCount < n * 2) {
            const intAmt = Math.round(postBalance * r);
            newTotalInterest += intAmt;
            const princPaid = Math.min(postBalance, baseEmi - intAmt);
            postBalance = Math.max(0, postBalance - princPaid);
            newMonthsCount++;
          }
        } else {
          const remainingMonths = Math.max(1, n - activePrepayMonth);
          const remFactor = Math.pow(1 + r, remainingMonths);
          revisedEMI = Math.round((postBalance * r * remFactor) / (remFactor - 1));

          for (let m = 1; m <= remainingMonths && postBalance > 0; m++) {
            const intAmt = Math.round(postBalance * r);
            newTotalInterest += intAmt;
            const princPaid = Math.min(postBalance, revisedEMI - intAmt);
            postBalance = Math.max(0, postBalance - princPaid);
            newMonthsCount++;
          }
        }
      }
    } else {
      const totalMonthlyPay = baseEmi + (prepayAmount || 0);

      while (postBalance > 0 && newMonthsCount < n * 2) {
        const intAmt = Math.round(postBalance * r);
        newTotalInterest += intAmt;
        const princPaid = Math.min(postBalance, totalMonthlyPay - intAmt);
        postBalance = Math.max(0, postBalance - princPaid);
        newMonthsCount++;
      }
    }

    const interestSaved = Math.max(0, Math.round(baseTotalInterest - newTotalInterest));
    const monthsSaved = Math.max(0, n - newMonthsCount);

    return {
      baseEmi,
      baseTotalInterest,
      interestSaved,
      monthsSaved,
      newTenureMonths: newMonthsCount,
      newEMI: revisedEMI,
      newTotalInterest: Math.round(newTotalInterest),
    };
  }, [financedPrincipal, monthlyRate, totalTenureMonths, prepayType, prepayAmount, prepayMonth, targetOutcome]);

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
            Prepayment Calculator
          </span>

          <span className="w-10" />
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-3">
        
        {/* HERO CARD: TOTAL SAVINGS & FINANCED BASE */}
        <div className="rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 p-4 text-center shadow-lg border border-white/15">
          <div className="flex items-center justify-center gap-1.5 text-emerald-100 text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Total Interest Saved</span>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-1">
            {formatINR(prepaymentMath.interestSaved)}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/20 text-left text-xs">
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-emerald-200 block truncate">Total Financed</span>
              <span className="font-bold text-white text-xs block truncate">{formatINRCompact(financedPrincipal)}</span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-emerald-200 block truncate">
                {prepayType === 'lumpSum' && targetOutcome === 'reduceEMI' ? 'New EMI' : 'Time Saved'}
              </span>
              <span className="font-bold text-white text-xs block truncate">
                {prepayType === 'lumpSum' && targetOutcome === 'reduceEMI'
                  ? `${formatINR(prepaymentMath.newEMI)}/mo`
                  : `${prepaymentMath.monthsSaved} Mos Sooner`}
              </span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-emerald-200 block truncate">Extra Charges</span>
              <span className="font-bold text-rose-300 text-xs block truncate">+{formatINRCompact(totalUpfrontCharges)}</span>
            </div>
          </div>
        </div>

        {/* 3. PREPAYMENT MODE SELECTOR */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setPrepayType('lumpSum')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              prepayType === 'lumpSum'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>One-Time Lump Sum</span>
          </button>

          <button
            type="button"
            onClick={() => setPrepayType('monthlyExtra')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              prepayType === 'monthlyExtra'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingDown className="w-3.5 h-3.5" />
            <span>Extra Monthly EMI</span>
          </button>
        </div>

        {/* 4. PREPAYMENT AMOUNT & PREFERENCES */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          
          {/* Prepayment Amount */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <span>{prepayType === 'lumpSum' ? 'Lump Sum Prepayment' : 'Extra Monthly Contribution'}</span>
              <span className="text-emerald-400 font-bold">{formatINRCompact(prepayAmount || 0)}</span>
            </div>

            <div className="flex items-center bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-emerald-500">
              <span className="text-base font-bold text-slate-500 mr-2">₹</span>
              <input
                type="number"
                inputMode="numeric"
                value={prepayAmount === 0 ? '' : prepayAmount}
                onChange={(e) => setPrepayAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                className="w-full bg-transparent font-bold text-lg text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="50000"
              />
            </div>

            {/* Quick Chips */}
            <div className="flex gap-1.5 pt-0.5">
              {(prepayType === 'lumpSum' ? [25000, 50000, 100000, 200000] : [1000, 2000, 5000, 10000]).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setPrepayAmount(val)}
                  className={`flex-1 py-1 text-[10px] font-bold rounded-lg border transition-all ${
                    prepayAmount === val
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {formatINRCompact(val)}
                </button>
              ))}
            </div>
          </div>

          {/* Prepayment Month (Only for Lump sum) */}
          {prepayType === 'lumpSum' && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                  Prepayment Month
                </span>
                <span className="text-slate-400 text-[11px]">After {prepayMonth} Months (Year {(prepayMonth / 12).toFixed(1)})</span>
              </div>

              <div className="flex items-center bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 focus-within:border-emerald-500">
                <input
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={totalTenureMonths}
                  value={prepayMonth === 0 ? '' : prepayMonth}
                  onChange={(e) => setPrepayMonth(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full bg-transparent font-bold text-base text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="12"
                />
                <span className="text-xs text-slate-500 ml-1.5">th Month</span>
              </div>
            </div>
          )}

          {/* Goal selection: Reduce Tenure vs Reduce EMI */}
          {prepayType === 'lumpSum' && (
            <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
              <span className="text-xs font-semibold text-slate-300 block">Prepayment Goal</span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTargetOutcome('reduceTenure')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    targetOutcome === 'reduceTenure'
                      ? 'bg-emerald-600/15 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>Reduce Tenure</span>
                    {targetOutcome === 'reduceTenure' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Close loan earlier</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTargetOutcome('reduceEMI')}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    targetOutcome === 'reduceEMI'
                      ? 'bg-emerald-600/15 border-emerald-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between font-bold text-xs">
                    <span>Reduce EMI</span>
                    {targetOutcome === 'reduceEMI' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5">Lower monthly bill</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* 5. BASE LOAN & EXTRA CHARGES CONTROLS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
            Base Loan & Fee Parameters
          </span>

          {/* Amount & Rate */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Base Loan (₹)</span>
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
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400">
                <span>Rate (%)</span>
                <span className="text-blue-400 text-[10px]">p.a.</span>
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
                <span className="text-xs text-slate-500 ml-1">%</span>
              </div>
            </div>
          </div>

          {/* Upfront Extra Charges (Processing Fee + Other Charges) */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Receipt className="w-3 h-3 text-rose-400" />
                Extra Charges (Capitalized)
              </span>
              <span className="text-rose-400 font-bold">+{formatINR(totalUpfrontCharges)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Fee Rate</span>
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
                  <span>Other Fee</span>
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

          {/* Tenure Duration */}
          <div className="space-y-1 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400">
              <span>Duration (Years)</span>
              <span className="text-blue-400 text-[10px]">{totalTenureMonths} EMIs</span>
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
              <span className="text-xs text-slate-500 ml-1">Yrs</span>
            </div>
          </div>

        </div>

        {/* 6. TAKEAWAY NOTE */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-2 text-xs text-slate-300">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] text-slate-400">
            Prepayment calculation mein extra charges loan principal mein jud kar capitalized base banate hain, jisse prepayment karne par exact real interest savings accurately calculate hoti hai.
          </p>
        </div>

      </main>
    </div>
  );
}