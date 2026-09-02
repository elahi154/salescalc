'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  Receipt,
  TrendingDown,
  CheckCircle2,
  Plus,
  X,
} from 'lucide-react';

export default function ComparePage() {
  const {
    inputs,
    updateInput,
    setFullState,
  } = useLoanCalculator();

  const { loanAmount, interestRate, rateType, tenureValue, tenureType } = inputs;
  const [compareMode, setCompareMode] = useState<'tenure' | 'amount'>('tenure');

  // Upfront Extra Charges
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(2.5);
  const [otherCharges, setOtherCharges] = useState<number>(0);

  // By default sirf 5 main standard tenures (1Y, 2Y, 3Y, 5Y, 7Y). Baki add karne par yahan dynamically judenge.
  const [tenureYearsList, setTenureYearsList] = useState<number[]>([1, 2, 3, 5, 7]);
  const [customYearInput, setCustomYearInput] = useState<string>('');

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

  // Helper EMI Calculator with capitalized charges
  const calcEMIWithCharges = (P: number, rAnnual: number, months: number, feePct: number, otherFee: number) => {
    const feeAmt = Math.round((P * (feePct || 0)) / 100);
    const totalExtra = feeAmt + (otherFee || 0);
    const financedP = P + totalExtra;

    if (financedP <= 0 || rAnnual <= 0 || months <= 0) {
      return {
        baseLoan: P,
        extraCharges: totalExtra,
        financedPrincipal: financedP,
        emi: 0,
        totalInterest: 0,
        totalPayable: financedP,
      };
    }

    const r = rAnnual / 12 / 100;
    const factor = Math.pow(1 + r, months);
    const emi = Math.round((financedP * r * factor) / (factor - 1));
    const totalPayable = emi * months;
    const totalInterest = Math.max(0, totalPayable - financedP);

    return {
      baseLoan: P,
      extraCharges: totalExtra,
      financedPrincipal: financedP,
      emi,
      totalInterest,
      totalPayable,
    };
  };

  const currentAnnualRate = rateType === 'monthly' ? (interestRate || 0) * 12 : (interestRate || 0);
  const durationMonths = tenureType === 'years' ? (tenureValue || 1) * 12 : (tenureValue || 1);

  // 1. Current Active Selection Calculation
  const currentCalc = calcEMIWithCharges(
    loanAmount || 0,
    currentAnnualRate,
    durationMonths,
    processingFeePercent,
    otherCharges
  );

  // Add custom year to list
  const handleAddCustomYear = () => {
    const yr = parseInt(customYearInput, 10);
    if (yr && yr > 0 && yr <= 40) {
      if (!tenureYearsList.includes(yr)) {
        setTenureYearsList((prev) => [...prev, yr].sort((a, b) => a - b));
      }
      setFullState({ tenureValue: yr, tenureType: 'years' });
      setCustomYearInput('');
    }
  };

  // Remove added custom year (agar user remove karna chahe aur wo default 5 me se na ho)
  const handleRemoveYear = (yrToRemove: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setTenureYearsList((prev) => prev.filter((yr) => yr !== yrToRemove));
    if (tenureValue === yrToRemove) {
      setFullState({ tenureValue: 5, tenureType: 'years' });
    }
  };

  // 2. Live Compare Scenarios for Tenures (Default 5 + user added)
  const tenureScenarios = useMemo(() => {
    return tenureYearsList.map((yrs) => {
      const months = yrs * 12;
      const res = calcEMIWithCharges(
        loanAmount || 0,
        currentAnnualRate,
        months,
        processingFeePercent,
        otherCharges
      );
      const isSelected = tenureType === 'years' && tenureValue === yrs;
      const isCustomAdded = ![1, 2, 3, 5, 7].includes(yrs);
      return {
        label: `${yrs} Year${yrs > 1 ? 's' : ''}`,
        years: yrs,
        months,
        isSelected,
        isCustomAdded,
        ...res,
      };
    });
  }, [tenureYearsList, loanAmount, currentAnnualRate, processingFeePercent, otherCharges, tenureType, tenureValue]);

  // 3. Live Compare Scenarios for Amounts (By default 5 scenarios)
  const baseAmt = loanAmount || 500000;
  const amountScenarios = useMemo(() => {
    return [
      Math.round(baseAmt * 0.5),
      Math.round(baseAmt * 0.75),
      baseAmt,
      Math.round(baseAmt * 1.25),
      Math.round(baseAmt * 1.5),
    ].map((amt) => {
      const res = calcEMIWithCharges(
        amt,
        currentAnnualRate,
        durationMonths,
        processingFeePercent,
        otherCharges
      );
      const isSelected = loanAmount === amt;
      return {
        amount: amt,
        isSelected,
        ...res,
      };
    });
  }, [baseAmt, currentAnnualRate, durationMonths, processingFeePercent, otherCharges, loanAmount]);

  return (
    <div className="min-h-screen bg-[#070A12] text-white font-sans selection:bg-blue-600 selection:text-white pb-20">
      
      {/* 1. TOP BAR */}
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
            Loan Comparison
          </span>

          <span className="w-10" />
        </div>
      </header>

      {/* 2. MAIN CONTAINER */}
      <main className="max-w-md mx-auto px-4 pt-3 space-y-3">
        
        {/* HERO CARD: CURRENT SELECTION */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-center shadow-lg border border-white/15">
          <div className="flex items-center justify-center gap-1.5 text-blue-100 text-[11px] font-bold uppercase tracking-wider mb-0.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Monthly EMI ({tenureType === 'years' ? `${tenureValue} Yrs` : `${tenureValue} Mos`})</span>
          </div>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-1">
            {formatINR(currentCalc.emi)}
            <span className="text-xs font-normal text-blue-200 ml-1">/ mo</span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-3 pt-2.5 border-t border-white/20 text-left text-xs">
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block truncate">Total Financed</span>
              <span className="font-bold text-white text-xs block truncate">{formatINRCompact(currentCalc.financedPrincipal)}</span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block truncate">Total Interest</span>
              <span className="font-bold text-amber-300 text-xs block truncate">+{formatINRCompact(currentCalc.totalInterest)}</span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block truncate">Extra Charges</span>
              <span className="font-bold text-rose-300 text-xs block truncate">+{formatINRCompact(currentCalc.extraCharges)}</span>
            </div>
          </div>
        </div>

        {/* MODE SWITCHER */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setCompareMode('tenure')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              compareMode === 'tenure'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Compare Tenures</span>
          </button>

          <button
            type="button"
            onClick={() => setCompareMode('amount')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              compareMode === 'amount'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Compare Amounts</span>
          </button>
        </div>

        {/* BASE INPUT CONTROLS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-2.5">
          
          {/* Loan Amount & Rate */}
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

          {/* Upfront Charges Row */}
          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Receipt className="w-3 h-3 text-rose-400" />
                Extra Charges
              </span>
              <span className="text-rose-400 font-bold">+{formatINR(currentCalc.extraCharges)}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Fee Rate</span>
                  <span className="text-amber-400 font-semibold">{formatINR(Math.round(((loanAmount || 0) * (processingFeePercent || 0)) / 100))}</span>
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

          {/* Quick Year Add input (Default 5 options ke alawa agar 10, 15, 20 add karna ho) */}
          {compareMode === 'tenure' && (
            <div className="pt-2 border-t border-slate-800/80">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400 mb-1">
                <span>Add Extra Tenure</span>
                <span className="text-[10px] text-slate-500">Default: 5 options</span>
              </div>
              
              <div className="flex items-center gap-1.5">
                <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 flex-1 focus-within:border-blue-500">
                  <input
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={40}
                    value={customYearInput}
                    onChange={(e) => setCustomYearInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCustomYear();
                    }}
                    className="w-full bg-transparent font-bold text-sm text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="Type year (e.g. 10, 15, 20)"
                  />
                  <span className="text-xs text-slate-500 ml-1">Yrs</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddCustomYear}
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white flex items-center gap-1 shrink-0 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Option</span>
                </button>
              </div>

              {/* Quick Preset chips to add with 1 tap */}
              <div className="flex items-center gap-1 pt-1.5">
                <span className="text-[10px] text-slate-500 mr-0.5">Quick add:</span>
                {[10, 15, 20, 25, 30].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      if (!tenureYearsList.includes(yr)) {
                        setTenureYearsList((prev) => [...prev, yr].sort((a, b) => a - b));
                      }
                      setFullState({ tenureValue: yr, tenureType: 'years' });
                    }}
                    className={`px-2 py-0.5 text-[10px] font-bold rounded-lg border transition-colors ${
                      tenureYearsList.includes(yr)
                        ? 'bg-blue-600/30 border-blue-500 text-blue-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    +{yr}Y
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Base Tenure Duration (Only when Comparing Amounts) */}
          {compareMode === 'amount' && (
            <div className="space-y-1 pt-2 border-t border-slate-800/80">
              <div className="flex justify-between items-center text-[11px] font-semibold text-slate-400">
                <span>Base Tenure (Years)</span>
                <span className="text-blue-400 text-[10px]">{(tenureValue || 0) * 12} EMIs</span>
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
          )}
        </div>

        {/* 3. COMPARISON TILES */}
        <div className="space-y-2">
          <div className="flex justify-between items-center px-1 text-xs text-slate-400 font-bold uppercase tracking-wider">
            <span>{compareMode === 'tenure' ? `Tenure Options (${tenureScenarios.length})` : 'Amount Options (5)'}</span>
            <span>Tap to Apply</span>
          </div>

          {compareMode === 'tenure' ? (
            /* TENURE TILES (By default 5 items, customized items can be removed) */
            tenureScenarios.map((item) => (
              <div
                key={item.years}
                onClick={() =>
                  setFullState({
                    tenureValue: item.years,
                    tenureType: 'years',
                  })
                }
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  item.isSelected
                    ? 'bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold text-white">{item.label}</span>
                    {item.isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    )}
                    {item.isCustomAdded && (
                      <button
                        type="button"
                        onClick={(e) => handleRemoveYear(item.years, e)}
                        className="p-0.5 hover:bg-slate-800 text-slate-500 hover:text-rose-400 rounded-md transition-colors"
                        title="Remove custom option"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Charges: <span className="text-rose-400 font-medium">+{formatINR(item.extraCharges)}</span> | Interest: <span className="text-amber-400 font-medium">{formatINR(item.totalInterest)}</span>
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-base font-black text-white block">
                    {formatINR(item.emi)}
                    <span className="text-[10px] font-normal text-slate-400">/mo</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Total: {formatINRCompact(item.totalPayable)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            /* AMOUNT TILES (By default 5 options) */
            amountScenarios.map((item) => (
              <div
                key={item.amount}
                onClick={() => updateInput('loanAmount', item.amount)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  item.isSelected
                    ? 'bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-500'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-extrabold text-white">{formatINR(item.amount)}</span>
                    {item.isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 block">
                    Charges: <span className="text-rose-400 font-medium">+{formatINR(item.extraCharges)}</span> | Interest: <span className="text-amber-400 font-medium">{formatINR(item.totalInterest)}</span>
                  </span>
                </div>

                <div className="text-right space-y-0.5">
                  <span className="text-base font-black text-white block">
                    {formatINR(item.emi)}
                    <span className="text-[10px] font-normal text-slate-400">/mo</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block font-medium">
                    Total: {formatINRCompact(item.totalPayable)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 4. TAKEAWAY NOTE */}
        <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
          <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-[11px] text-slate-400">
            By default 5 standard options active hain. Kisi bhi option par tap karte hi live calculation update ho jayegi, aur upar se aap koi bhi custom saal (+10Y, +15Y, +20Y) instant add kar sakte hain.
          </p>
        </div>

      </main>
    </div>
  );
}