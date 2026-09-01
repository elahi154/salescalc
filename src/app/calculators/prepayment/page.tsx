'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  Wallet,
  IndianRupee,
  Percent,
  Clock,
  Sparkles,
  Plus,
  Minus,
  TrendingDown,
  CalendarCheck,
  Zap,
  PiggyBank,
  CheckCircle2,
} from 'lucide-react';

export default function PrepaymentCalculatorPage() {
  const { inputs, updateInput, setFullState, calculationResult } = useLoanCalculator();
  const { loanAmount, interestRate, rateType, tenureValue, tenureType } = inputs;
  const { emi, totalInterest, totalPayable } = calculationResult;

  // Set default initial values: ₹5,00,000, 14% p.a., 5 Years
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

  // Prepayment States
  const [prepayType, setPrepayType] = useState<'lumpSum' | 'monthlyExtra'>('lumpSum');
  const [prepayAmount, setPrepayAmount] = useState<number>(50000);
  const [prepayMonth, setPrepayMonth] = useState<number>(12); // Happens at month 12
  const [targetOutcome, setTargetOutcome] = useState<'reduceTenure' | 'reduceEMI'>('reduceTenure');

  const totalTenureMonths = tenureType === 'years' ? tenureValue * 12 : tenureValue;
  const monthlyRate = (rateType === 'monthly' ? interestRate : interestRate / 12) / 100;

  // Precise Amortization & Prepayment Math
  const prepaymentMath = useMemo(() => {
    const P = loanAmount || 0;
    const r = monthlyRate;
    const n = totalTenureMonths;

    if (P <= 0 || r <= 0 || n <= 0) {
      return {
        interestSaved: 0,
        monthsSaved: 0,
        newTenureMonths: n,
        newEMI: emi,
        newTotalInterest: totalInterest,
      };
    }

    let balance = P;
    let originalTotalInterest = 0;
    let balanceAtPrepayMonth = P;

    // 1. Calculate standard amortization up to prepay month
    for (let m = 1; m <= n; m++) {
      const interestForMonth = balance * r;
      originalTotalInterest += interestForMonth;
      const principalPaid = emi - interestForMonth;
      balance = Math.max(0, balance - principalPaid);

      if (m === prepayMonth) {
        balanceAtPrepayMonth = balance;
      }
    }

    // 2. Apply Prepayment
    let newTotalInterest = 0;
    let newMonthsCount = 0;
    let revisedEMI = emi;
    let postBalance = P;

    if (prepayType === 'lumpSum') {
      // Run normal until prepayMonth
      for (let m = 1; m <= prepayMonth && postBalance > 0; m++) {
        const intAmt = postBalance * r;
        newTotalInterest += intAmt;
        const princPaid = Math.min(postBalance, emi - intAmt);
        postBalance = Math.max(0, postBalance - princPaid);
        newMonthsCount++;
      }

      // Apply Lump-sum deduction
      postBalance = Math.max(0, postBalance - prepayAmount);

      if (postBalance > 0) {
        if (targetOutcome === 'reduceTenure') {
          // Keep same EMI, pay off remaining balance faster
          while (postBalance > 0 && newMonthsCount < n * 2) {
            const intAmt = postBalance * r;
            newTotalInterest += intAmt;
            const princPaid = Math.min(postBalance, emi - intAmt);
            postBalance = Math.max(0, postBalance - princPaid);
            newMonthsCount++;
          }
        } else {
          // Reduce EMI, keep remaining tenure
          const remainingMonths = Math.max(1, n - prepayMonth);
          revisedEMI = Math.round(
            (postBalance * r * Math.pow(1 + r, remainingMonths)) / (Math.pow(1 + r, remainingMonths) - 1)
          );
          for (let m = 1; m <= remainingMonths && postBalance > 0; m++) {
            const intAmt = postBalance * r;
            newTotalInterest += intAmt;
            const princPaid = Math.min(postBalance, revisedEMI - intAmt);
            postBalance = Math.max(0, postBalance - princPaid);
            newMonthsCount++;
          }
        }
      }
    } else {
      // Monthly Extra Payment
      const extraMonthly = prepayAmount;
      const totalMonthlyPay = emi + extraMonthly;

      while (postBalance > 0 && newMonthsCount < n * 2) {
        const intAmt = postBalance * r;
        newTotalInterest += intAmt;
        const princPaid = Math.min(postBalance, totalMonthlyPay - intAmt);
        postBalance = Math.max(0, postBalance - princPaid);
        newMonthsCount++;
      }
    }

    const interestSaved = Math.max(0, Math.round(totalInterest - newTotalInterest));
    const monthsSaved = Math.max(0, n - newMonthsCount);

    return {
      interestSaved,
      monthsSaved,
      newTenureMonths: newMonthsCount,
      newEMI: revisedEMI,
      newTotalInterest: Math.round(newTotalInterest),
    };
  }, [loanAmount, monthlyRate, totalTenureMonths, emi, totalInterest, prepayType, prepayAmount, prepayMonth, targetOutcome]);

  // Steppers for inputs
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
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors text-slate-900 dark:text-white">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Wallet className="w-3.5 h-3.5 text-emerald-600" />
            <span>Dedicated Prepayment Calculator</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
            Loan Prepayment Calculator
          </h1>

          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 font-medium">
            Calculate your direct interest savings and tenure reduction by prepaying early.
          </p>
        </div>

        {/* 1. HERO PREPAYMENT SAVINGS CARD */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-700 to-slate-900 text-white p-6 sm:p-8 shadow-2xl border border-emerald-500/30 relative overflow-hidden space-y-6">
          <div className="flex items-center justify-between text-emerald-100 text-xs font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>Projected Prepayment Benefits</span>
            </span>
            <span className="text-[11px] bg-black/20 px-2.5 py-1 rounded-full border border-white/10">
              Direct Loan Math
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-200 block">
                Total Interest Saved
              </span>
              <div className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-0.5">
                {formatINR(prepaymentMath.interestSaved)}
              </div>
              <p className="text-xs text-emerald-200/90 mt-1 font-medium">
                Money saved directly on interest charges
              </p>
            </div>

            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-4 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-emerald-200 font-medium">Tenure Reduction</span>
                <span className="font-extrabold text-white text-sm">
                  {prepaymentMath.monthsSaved} Months Faster
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/10">
                <span className="text-emerald-200 font-medium">New Total Interest</span>
                <span className="font-extrabold text-amber-300 text-sm">
                  {formatINR(prepaymentMath.newTotalInterest)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. BASE LOAN PARAMETERS (FULL EDITABLE CONTROLS) */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <span>1. Base Loan Parameters</span>
            </h2>
            <span className="text-xs text-slate-500 font-medium">Tap number to edit or use + / -</span>
          </div>

          {/* Amount */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Sanctioned Loan Amount
              </span>
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">({formatINRCompact(loanAmount || 0)})</span>
            </div>

            <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-950 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500 transition-colors">
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

            <input
              type="range"
              min={10000}
              max={10000000}
              step={10000}
              value={Math.min(loanAmount, 10000000)}
              onChange={(e) => updateInput('loanAmount', Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>

          {/* Rate & Tenure in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            
            {/* Rate */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1"><Percent className="w-3.5 h-3.5 text-emerald-500" /> Interest Rate</span>
                <span>{interestRate}% p.a.</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => stepRate(-0.25)}
                  className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex items-center">
                  <input
                    type="number"
                    step="0.05"
                    value={interestRate === 0 ? '' : interestRate}
                    onChange={(e) => updateInput('interestRate', e.target.value === '' ? 0 : parseFloat(e.target.value))}
                    className="w-16 bg-transparent text-center font-black text-xl text-slate-900 dark:text-white outline-none border-none p-0 focus:ring-0"
                  />
                  <span className="text-lg font-bold text-slate-400">%</span>
                </div>
                <button
                  type="button"
                  onClick={() => stepRate(0.25)}
                  className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tenure */}
            <div className="space-y-2 bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-emerald-500" /> Loan Tenure</span>
                <span>{tenureValue} Years ({tenureValue * 12} EMIs)</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => stepTenure(-1)}
                  className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <div className="flex items-center">
                  <input
                    type="number"
                    value={tenureValue === 0 ? '' : tenureValue}
                    onChange={(e) => updateInput('tenureValue', e.target.value === '' ? 1 : Number(e.target.value))}
                    className="w-16 bg-transparent text-center font-black text-xl text-slate-900 dark:text-white outline-none border-none p-0 focus:ring-0"
                  />
                  <span className="text-sm font-bold text-slate-400">Yrs</span>
                </div>
                <button
                  type="button"
                  onClick={() => stepTenure(1)}
                  className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-900 dark:text-white font-bold flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* 3. PREPAYMENT CONFIGURATION CARD */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <PiggyBank className="w-4 h-4 text-emerald-500" />
              <span>2. Prepayment Strategy</span>
            </h2>
          </div>

          {/* Mode Selector */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setPrepayType('lumpSum')}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                prepayType === 'lumpSum'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              <span>One-Time Lump Sum</span>
            </button>

            <button
              type="button"
              onClick={() => setPrepayType('monthlyExtra')}
              className={`py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-1.5 ${
                prepayType === 'monthlyExtra'
                  ? 'bg-emerald-600 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Plus className="w-4 h-4" />
              <span>Extra Monthly EMI</span>
            </button>
          </div>

          {/* Prepayment Inputs */}
          <div className="space-y-4">
            
            {/* Amount Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span>{prepayType === 'lumpSum' ? 'One-Time Payment Amount' : 'Extra Monthly Contribution'}</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">{formatINR(prepayAmount)}</span>
              </div>

              <div className="flex items-center bg-slate-50 dark:bg-slate-950 px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 focus-within:border-emerald-500">
                <span className="text-xl font-bold text-slate-400 mr-2">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={prepayAmount === 0 ? '' : prepayAmount}
                  onChange={(e) => setPrepayAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                  placeholder="50000"
                  className="w-full bg-transparent font-black text-xl text-slate-900 dark:text-white outline-none border-none p-0 focus:ring-0"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="flex flex-wrap gap-2 pt-1">
                {(prepayType === 'lumpSum' ? [25000, 50000, 100000, 200000] : [1000, 2000, 5000, 10000]).map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPrepayAmount(val)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                      prepayAmount === val
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {formatINRCompact(val)}
                  </button>
                ))}
              </div>
            </div>

            {/* If Lump sum: Choose Prepayment Month */}
            {prepayType === 'lumpSum' && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1.5"><CalendarCheck className="w-4 h-4 text-emerald-500" /> Payment Month</span>
                  <span>After {prepayMonth} Months (Year {(prepayMonth / 12).toFixed(1)})</span>
                </div>

                <input
                  type="range"
                  min={1}
                  max={Math.max(1, totalTenureMonths - 1)}
                  step={1}
                  value={prepayMonth}
                  onChange={(e) => setPrepayMonth(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                />
              </div>
            )}

            {/* If Lump sum: Choose Target Goal (Reduce Tenure vs Reduce EMI) */}
            {prepayType === 'lumpSum' && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                  Choose Prepayment Goal
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetOutcome('reduceTenure')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      targetOutcome === 'reduceTenure'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs sm:text-sm">
                      <span>Reduce Tenure (Recommended)</span>
                      {targetOutcome === 'reduceTenure' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] mt-1 text-slate-500">Keep EMI same and close the loan years earlier</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTargetOutcome('reduceEMI')}
                    className={`p-3.5 rounded-2xl border text-left transition-all ${
                      targetOutcome === 'reduceEMI'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-900 dark:text-white shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="flex items-center justify-between font-bold text-xs sm:text-sm">
                      <span>Reduce Monthly EMI</span>
                      {targetOutcome === 'reduceEMI' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                    </div>
                    <p className="text-[11px] mt-1 text-slate-500">Keep tenure same and lower monthly cash outflow</p>
                  </button>
                </div>
              </div>
            )}

          </div>

        </div>

      </main>

      <Footer />
    </div>
  );
}