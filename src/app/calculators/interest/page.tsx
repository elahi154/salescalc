'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  ArrowLeft,
  Percent,
  IndianRupee,
  Calendar,
  Sparkles,
  Receipt,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
} from 'lucide-react';

export default function InterestCalculatorPage() {
  const {
    inputs,
    updateInput,
    setFullState,
  } = useLoanCalculator();

  const { loanAmount, interestRate, rateType, tenureValue, tenureType } = inputs;

  // Capitalized Extra Charges (Processing Fee + Other Charges)
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(2.5);
  const [otherCharges, setOtherCharges] = useState<number>(0);

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

  // Capitalized Principal Calculation
  const processingFeeAmount = Math.round(((loanAmount || 0) * (processingFeePercent || 0)) / 100);
  const totalUpfrontCharges = processingFeeAmount + (otherCharges || 0);
  const financedPrincipal = (loanAmount || 0) + totalUpfrontCharges;

  const totalTenureMonths = tenureType === 'years' ? (tenureValue || 1) * 12 : (tenureValue || 1);
  const baseAnnualRate = rateType === 'monthly' ? (interestRate || 0) * 12 : (interestRate || 0);

  // Helper EMI Calculation with Capitalized Charges
  const calculateEMI = (principal: number, annualRate: number, months: number) => {
    if (principal <= 0 || annualRate <= 0 || months <= 0) {
      return { emi: 0, totalInterest: 0, totalPayable: principal };
    }
    const r = annualRate / 12 / 100;
    const factor = Math.pow(1 + r, months);
    const emi = Math.round((principal * r * factor) / (factor - 1));
    const totalPayable = emi * months;
    const totalInterest = Math.max(0, totalPayable - principal);
    return { emi, totalInterest, totalPayable };
  };

  // Base Calculation Result
  const currentCalc = useMemo(() => {
    return calculateEMI(financedPrincipal, baseAnnualRate, totalTenureMonths);
  }, [financedPrincipal, baseAnnualRate, totalTenureMonths]);

  // Sensitivity Scenarios (-1%, -0.5%, -0.25%, Current, +0.25%, +0.5%, +1%)
  const sensitivityDeltas = [-1.0, -0.5, -0.25, 0, 0.25, 0.5, 1.0];

  const sensitivityCards = useMemo(() => {
    return sensitivityDeltas
      .map((delta) => {
        const scenarioRate = Math.max(0.1, Number((baseAnnualRate + delta).toFixed(2)));
        const res = calculateEMI(financedPrincipal, scenarioRate, totalTenureMonths);
        const emiDiff = res.emi - currentCalc.emi;
        const isCurrent = delta === 0;

        return {
          delta,
          scenarioRate,
          emiDiff,
          isCurrent,
          ...res,
        };
      })
      .filter(
        // Remove duplicate rate entries if base rate is very low
        (item, index, self) => index === self.findIndex((t) => t.scenarioRate === item.scenarioRate)
      );
  }, [financedPrincipal, baseAnnualRate, totalTenureMonths, currentCalc.emi]);

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
            Interest Sensitivity
          </span>

          <span className="w-10" />
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-3">
        
        {/* HERO CARD: CURRENT EMI & TOTAL OUTFLOW */}
        <div className="rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-700 p-4 text-center shadow-lg border border-white/15">
          <div className="flex items-center justify-center gap-1.5 text-purple-100 text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Current EMI ({interestRate}% {rateType === 'annual' ? 'p.a.' : '/mo'})</span>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-1">
            {formatINR(currentCalc.emi)}
            <span className="text-xs font-normal text-purple-200 ml-1">/ mo</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/20 text-left text-xs">
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-purple-200 block truncate">Total Financed</span>
              <span className="font-bold text-white text-xs block truncate">{formatINRCompact(financedPrincipal)}</span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-purple-200 block truncate">Total Interest</span>
              <span className="font-bold text-amber-300 text-xs block truncate">+{formatINRCompact(currentCalc.totalInterest)}</span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-purple-200 block truncate">Extra Charges</span>
              <span className="font-bold text-rose-300 text-xs block truncate">+{formatINRCompact(totalUpfrontCharges)}</span>
            </div>
          </div>
        </div>

        {/* BASE INPUT CONTROLS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2.5">
          
          {/* Loan Amount & Rate */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[11px] font-semibold text-slate-400">Loan Amount (₹)</span>
              <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-purple-500">
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
                <span>Interest Rate</span>
                <div className="inline-flex text-[10px]">
                  <button
                    type="button"
                    onClick={() =>
                      setFullState({
                        rateType: 'annual',
                        interestRate: rateType === 'monthly' ? Number(((interestRate || 0) * 12).toFixed(2)) : interestRate,
                      })
                    }
                    className={`px-1.5 py-0.5 rounded font-bold ${
                      rateType === 'annual' ? 'text-purple-400 bg-purple-500/10' : 'text-slate-500'
                    }`}
                  >
                    Yr
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFullState({
                        rateType: 'monthly',
                        interestRate: rateType === 'annual' ? Number(((interestRate || 0) / 12).toFixed(2)) : interestRate,
                      })
                    }
                    className={`px-1.5 py-0.5 rounded font-bold ${
                      rateType === 'monthly' ? 'text-purple-400 bg-purple-500/10' : 'text-slate-500'
                    }`}
                  >
                    Mo
                  </button>
                </div>
              </div>

              <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-purple-500">
                <input
                  type="number"
                  step="0.05"
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

          {/* Upfront Charges Row */}
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
                <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-purple-500">
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
                <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-purple-500">
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
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-purple-400" />
                Duration
              </span>
              <span className="text-purple-400 text-[10px]">{totalTenureMonths} Total EMIs</span>
            </div>
            <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-purple-500">
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

        {/* 3. SENSITIVITY SCENARIOS LIST */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>Interest Fluctuation Matrix</span>
            <span>Tap to Switch Rate</span>
          </div>

          {sensitivityCards.map((item) => (
            <div
              key={item.scenarioRate}
              onClick={() => {
                setFullState({
                  rateType: 'annual',
                  interestRate: item.scenarioRate,
                });
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                item.isCurrent
                  ? 'bg-purple-600/15 border-purple-500 shadow-md ring-1 ring-purple-500'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-white">
                    {item.scenarioRate}% p.a.
                  </span>
                  {item.isCurrent ? (
                    <span className="px-1.5 py-0.5 text-[9px] bg-purple-500/20 text-purple-300 rounded font-bold border border-purple-500/30 flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5" /> Current
                    </span>
                  ) : item.delta > 0 ? (
                    <span className="text-[10px] font-bold text-rose-400 flex items-center">
                      <ArrowUpRight className="w-3 h-3" />+{item.delta}%
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-emerald-400 flex items-center">
                      <ArrowDownRight className="w-3 h-3" />{item.delta}%
                    </span>
                  )}
                </div>

                <span className="text-[11px] text-slate-400 block">
                  Total Interest: <strong className="text-amber-400 font-semibold">{formatINR(item.totalInterest)}</strong>
                </span>
              </div>

              <div className="text-right space-y-0.5">
                <span className="text-base font-black text-white block">
                  {formatINR(item.emi)}
                  <span className="text-[10px] font-normal text-slate-400">/mo</span>
                </span>

                <div className="text-[10px] font-medium">
                  {item.isCurrent ? (
                    <span className="text-slate-400">Base EMI</span>
                  ) : item.emiDiff > 0 ? (
                    <span className="text-rose-400 font-bold">+{formatINR(item.emiDiff)}/mo</span>
                  ) : (
                    <span className="text-emerald-400 font-bold">{formatINR(item.emiDiff)}/mo</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 4. TAKEAWAY NOTE */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
          <TrendingUp className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] text-slate-400">
            Interest rate mein sirf <strong className="text-white">0.25% se 0.50%</strong> ka badlav bhi lambe tenure mein aapke total interest aur monthly EMI par bada asar daalta hai. Kisi bhi card par tap karke aap seedha woh interest rate apply kar sakte hain.
          </p>
        </div>

      </main>
    </div>
  );
}