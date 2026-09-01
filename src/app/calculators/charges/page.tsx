'use client';

import React, { useState, useId } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import {
  Percent,
  Receipt,
  IndianRupee,
  Zap,
  Building2,
  Plus,
  Minus,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

export default function ProcessingChargesPage() {
  const { inputs, updateInput } = useLoanCalculator();
  const { loanAmount } = inputs;

  const loanAmountInputId = useId();

  // Mode: 'added' (Bajaj / Added to Loan) | 'deducted' (Bank / Deducted from In-Hand)
  const [feeStructure, setFeeStructure] = useState<'added' | 'deducted'>('added');

  // Charge States: Default 2.5% Processing Fee, ₹0 Flexi, 0% GST (All directly editable)
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(2.5);
  const [flexiOtherCharge, setFlexiOtherCharge] = useState<number>(0);
  const [gstPercent, setGstPercent] = useState<number>(0);

  // 1. Processing Fee calculated on FULL Loan Amount
  const baseProcessingFee = Math.round((loanAmount * processingFeePercent) / 100);

  // 2. GST Calculation on Total Charges (0% by default, editable)
  const taxableTotal = baseProcessingFee + flexiOtherCharge;
  const gstAmount = Math.round((taxableTotal * gstPercent) / 100);

  // 3. Total Additional Charges
  const totalExtraCharges = baseProcessingFee + flexiOtherCharge + gstAmount;

  // Effective Loan Base (Bajaj Financed)
  const effectivePrincipal = feeStructure === 'added'
    ? loanAmount + totalExtraCharges
    : loanAmount;

  // Net In-Hand Disbursal (Bank Model)
  const netInHandDisbursal = feeStructure === 'deducted'
    ? Math.max(0, loanAmount - totalExtraCharges)
    : loanAmount;

  // Quick Amount Preset Chips
  const presets = [
    { label: '₹50k', val: 50000 },
    { label: '₹1L', val: 100000 },
    { label: '₹2L', val: 200000 },
    { label: '₹5L', val: 500000 },
    { label: '₹10L', val: 1000000 },
    { label: '₹20L', val: 2000000 },
  ];

  const feePresets = [1.0, 1.5, 2.0, 2.5, 3.0];
  const gstPresets = [0, 5, 12, 18];

  const stepAmount = (delta: number) => {
    const next = Math.min(100000000, Math.max(0, loanAmount + delta));
    updateInput('loanAmount', next);
  };

  const stepFeePercent = (delta: number) => {
    const next = Math.max(0, Math.min(10, Number((processingFeePercent + delta).toFixed(1))));
    setProcessingFeePercent(next);
  };

  const stepGstPercent = (delta: number) => {
    const next = Math.max(0, Math.min(28, Number((gstPercent + delta).toFixed(1))));
    setGstPercent(next);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#070A11] text-white selection:bg-blue-600 selection:text-white pb-16">
      
      {/* Ambient background glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-72 h-44 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 max-w-lg w-full mx-auto px-4 py-5 space-y-4 relative z-10">
        
        {/* HEADER */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Charges Calculator</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white">
            Loan Fee & Disbursal
          </h1>
          <p className="text-xs text-slate-400">
            Calculate processing fee on full amount, custom flexi, and GST
          </p>
        </div>

        {/* 1. HERO RESULT CARD (CASH IMPACT) */}
        <div className="rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-slate-900 p-5 shadow-2xl border border-white/15 space-y-4">
          <div className="flex items-center justify-between text-blue-200 text-xs font-bold">
            <span className="flex items-center gap-1">
              <Receipt className="w-3.5 h-3.5 text-amber-300" />
              {feeStructure === 'added' ? 'Bajaj / NBFC Mode' : 'Bank Deduction Mode'}
            </span>
            <span className="text-[11px] text-blue-300 font-semibold">Live Calculation</span>
          </div>

          <div className="space-y-0.5">
            <span className="text-[11px] uppercase font-bold tracking-wider text-blue-200 block">
              {feeStructure === 'added' ? 'Total Loan Financed (EMI Base)' : 'In-Hand Money You Receive'}
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              {feeStructure === 'added' ? formatINR(effectivePrincipal) : formatINR(netInHandDisbursal)}
            </div>
          </div>

          {/* Sub-Pills */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/15 text-left">
            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-2.5 px-3 border border-white/10">
              <span className="text-[10px] text-blue-200 block font-medium">Original Loan</span>
              <span className="text-sm font-bold text-white">{formatINR(loanAmount)}</span>
            </div>

            <div className="bg-black/25 backdrop-blur-md rounded-2xl p-2.5 px-3 border border-white/10">
              <span className="text-[10px] text-blue-200 block font-medium">Total Extra Charges</span>
              <span className="text-sm font-bold text-amber-300">+{formatINR(totalExtraCharges)}</span>
            </div>
          </div>
        </div>

        {/* 2. LENDER STRUCTURE TOGGLE */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl">
          <button
            type="button"
            onClick={() => setFeeStructure('added')}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              feeStructure === 'added'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-4 h-4 text-amber-300" />
            <span>Bajaj (Add in Loan)</span>
          </button>

          <button
            type="button"
            onClick={() => setFeeStructure('deducted')}
            className={`py-2.5 px-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all ${
              feeStructure === 'deducted'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Bank (Deduct)</span>
          </button>
        </div>

        {/* 3. LOAN AMOUNT CARD (DIRECT EDITABLE INPUT + QUICK PRESETS) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-blue-400" />
                <span>Sanctioned Loan</span>
              </span>
              <span className="text-[11px] text-slate-500">Tap number to edit directly</span>
            </div>
            <span className="text-xs font-black text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
              {formatINRCompact(loanAmount)}
            </span>
          </div>

          {/* Stepper + Direct Input */}
          <div className="flex items-center justify-between gap-2 bg-slate-950 p-2.5 rounded-2xl border border-slate-800 focus-within:border-blue-500 transition-colors">
            <button
              type="button"
              onClick={() => stepAmount(-50000)}
              aria-label="Decrease Amount"
              className="w-10 h-10 rounded-xl bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
            >
              <Minus className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center flex-1 px-2">
              <span className="text-xl font-bold text-slate-500 mr-1">₹</span>
              <input
                id={loanAmountInputId}
                type="number"
                inputMode="numeric"
                min={0}
                max={100000000}
                value={loanAmount || ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  updateInput('loanAmount', val);
                }}
                className="w-full bg-transparent text-center font-black text-2xl text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
                aria-label="Sanctioned Loan Amount"
              />
            </div>

            <button
              type="button"
              onClick={() => stepAmount(50000)}
              aria-label="Increase Amount"
              className="w-10 h-10 rounded-xl bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {presets.map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => updateInput('loanAmount', p.val)}
                className={`flex-1 min-w-[54px] py-1.5 text-[11px] font-bold rounded-xl transition-all ${
                  loanAmount === p.val
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 4. CLEAN & EDITABLE FEE BREAKDOWN CONTROLS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-4 sm:p-5 space-y-4">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wide block">
            Fee Breakdown Controls
          </span>

          {/* 1. PROCESSING FEE (DIRECT EDITABLE % + STEPPERS + CHIPS) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-blue-400" />
                Processing Fee Rate
              </span>
              <span className="text-xs font-extrabold text-amber-400">
                = {formatINR(baseProcessingFee)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 focus-within:border-blue-500 transition-colors">
              <button
                type="button"
                onClick={() => stepFeePercent(-0.1)}
                className="w-9 h-9 rounded-lg bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center flex-1">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  inputMode="decimal"
                  value={processingFeePercent === 0 ? '0' : processingFeePercent || ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    setProcessingFeePercent(val);
                  }}
                  className="w-16 bg-transparent text-center font-black text-xl text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
                <span className="text-lg font-black text-slate-400 ml-0.5">%</span>
              </div>

              <button
                type="button"
                onClick={() => stepFeePercent(0.1)}
                className="w-9 h-9 rounded-lg bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Fee % chips */}
            <div className="flex items-center gap-1.5 pt-0.5">
              {feePresets.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setProcessingFeePercent(pct)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    processingFeePercent === pct
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>

            <span className="text-[10px] text-slate-500 block">
              Calculated on full loan of {formatINR(loanAmount)}
            </span>
          </div>

          {/* 2. FLEXI / DOC / UPFRONT CHARGE (DEFAULT ₹0 - EDITABLE) */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Flexi / Doc / Upfront Charge
              </span>
              <span className="text-xs font-bold text-slate-400">
                {flexiOtherCharge === 0 ? '₹0 (None)' : formatINR(flexiOtherCharge)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 focus-within:border-blue-500 transition-colors">
              <span className="text-base font-bold text-slate-500 pl-3">₹</span>
              <input
                type="number"
                inputMode="numeric"
                min={0}
                value={flexiOtherCharge === 0 ? '0' : flexiOtherCharge || ''}
                onChange={(e) => {
                  const val = e.target.value === '' ? 0 : Number(e.target.value);
                  setFlexiOtherCharge(val);
                }}
                className="w-full bg-transparent text-left font-black text-xl text-white outline-none border-none px-2 p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />

              {flexiOtherCharge > 0 && (
                <button
                  type="button"
                  onClick={() => setFlexiOtherCharge(0)}
                  className="px-2.5 py-1 text-[10px] font-extrabold text-slate-400 hover:text-rose-400 bg-slate-800 rounded-lg shrink-0 transition-colors"
                >
                  Reset ₹0
                </button>
              )}
            </div>

            {/* Quick Presets for Flexi */}
            <div className="flex items-center gap-1.5">
              {[0, 499, 799, 999, 1499].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFlexiOtherCharge(val)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    flexiOtherCharge === val
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  ₹{val}
                </button>
              ))}
            </div>
          </div>

          {/* 3. GST ON CHARGES (DEFAULT 0% - DIRECTLY EDITABLE INPUT + STEPPERS + CHIPS) */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 font-semibold flex items-center gap-1.5">
                <FileSpreadsheet className="w-3.5 h-3.5 text-indigo-400" />
                GST on Charges
              </span>
              <span className="text-xs font-extrabold text-slate-300">
                = {formatINR(gstAmount)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800 focus-within:border-blue-500 transition-colors">
              <button
                type="button"
                onClick={() => stepGstPercent(-1)}
                className="w-9 h-9 rounded-lg bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
              >
                <Minus className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center flex-1">
                <input
                  type="number"
                  step="1"
                  min="0"
                  max="28"
                  inputMode="numeric"
                  value={gstPercent === 0 ? '0' : gstPercent || ''}
                  onChange={(e) => {
                    const val = e.target.value === '' ? 0 : parseFloat(e.target.value);
                    setGstPercent(val);
                  }}
                  className="w-16 bg-transparent text-center font-black text-xl text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
                <span className="text-lg font-black text-slate-400 ml-0.5">%</span>
              </div>

              <button
                type="button"
                onClick={() => stepGstPercent(1)}
                className="w-9 h-9 rounded-lg bg-slate-800 active:bg-slate-700 text-white flex items-center justify-center transition-transform active:scale-95 shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Quick GST % chips */}
            <div className="flex items-center gap-1.5 pt-0.5">
              {gstPresets.map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() => setGstPercent(pct)}
                  className={`flex-1 py-1 text-[11px] font-bold rounded-lg transition-all ${
                    gstPercent === pct
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>

          {/* 4. TOTAL CHARGES SUMMARY PILL */}
          <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs mt-2">
            <div>
              <span className="text-slate-400 block font-bold text-[11px] uppercase tracking-wider">
                Total Charges
              </span>
              <span className="text-[10px] text-slate-500">
                Fee ({formatINR(baseProcessingFee)}) + Doc ({formatINR(flexiOtherCharge)}) + GST ({formatINR(gstAmount)})
              </span>
            </div>
            <span className="text-lg font-black text-amber-400">+{formatINR(totalExtraCharges)}</span>
          </div>

        </div>

        {/* 5. USER EXPLANATION BANNER */}
        <div className="bg-slate-900/70 border border-slate-800/80 rounded-3xl p-4 text-xs space-y-2.5">
          <span className="font-bold text-slate-400 uppercase tracking-wider text-[10px] block">
            How it affects you
          </span>

          <div className="flex items-start gap-2 text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
            <ArrowRight className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <span>
              {feeStructure === 'added'
                ? `In Bajaj mode, you get the full ${formatINR(loanAmount)} credited in hand. The ${formatINR(totalExtraCharges)} charge is added to your loan, making total repayment principal ${formatINR(effectivePrincipal)}.`
                : `In Bank mode, the ${formatINR(totalExtraCharges)} charge is deducted upfront. You receive ${formatINR(netInHandDisbursal)} in your account, and pay EMI on ${formatINR(loanAmount)}.`}
            </span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}