'use client';

import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useLoanCalculator } from '@/hooks/useLoanCalculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { Zap, Building2 } from 'lucide-react';

export default function ProcessingChargesPage() {
  const { inputs, updateInput } = useLoanCalculator();
  const { loanAmount } = inputs;

  // Lending mode
  const [feeStructure, setFeeStructure] = useState<'added' | 'deducted'>('added');

  // Input states (direct numeric typing & clean backspace)
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(2.5);
  const [flexiOtherCharge, setFlexiOtherCharge] = useState<number>(0);
  const [gstPercent, setGstPercent] = useState<number>(0);

  // Exact calculations
  const baseProcessingFee = Math.round(((loanAmount || 0) * (processingFeePercent || 0)) / 100);
  const taxableTotal = baseProcessingFee + (flexiOtherCharge || 0);
  const gstAmount = Math.round((taxableTotal * (gstPercent || 0)) / 100);
  const totalExtraCharges = baseProcessingFee + (flexiOtherCharge || 0) + gstAmount;

  // Final outputs
  const effectivePrincipal = feeStructure === 'added'
    ? (loanAmount || 0) + totalExtraCharges
    : (loanAmount || 0);

  const netInHandDisbursal = feeStructure === 'deducted'
    ? Math.max(0, (loanAmount || 0) - totalExtraCharges)
    : (loanAmount || 0);

  // Graph Calculations
  const chartTotal = feeStructure === 'added' ? effectivePrincipal : (loanAmount || 1);
  const inHandMoney = feeStructure === 'added' ? (loanAmount || 0) : netInHandDisbursal;
  
  const inHandPct = chartTotal > 0 ? Number(((inHandMoney / chartTotal) * 100).toFixed(1)) : 0;
  const feePct = chartTotal > 0 ? Number(((baseProcessingFee / chartTotal) * 100).toFixed(1)) : 0;
  const flexiPct = chartTotal > 0 ? Number(((flexiOtherCharge / chartTotal) * 100).toFixed(1)) : 0;
  const gstPct = chartTotal > 0 ? Number(((gstAmount / chartTotal) * 100).toFixed(1)) : 0;

  // Donut SVG constants
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const inHandOffset = 0;
  const feeOffset = (inHandPct / 100) * circumference;
  const flexiOffset = ((inHandPct + feePct) / 100) * circumference;
  const gstOffset = ((inHandPct + feePct + flexiPct) / 100) * circumference;

  return (
    <div className="min-h-screen flex flex-col bg-[#070A12] text-white selection:bg-blue-600 selection:text-white pb-12">
      <Navbar />

      <main className="flex-1 max-w-md w-full mx-auto px-4 py-3 space-y-3">
        
        {/* 1. LENDER MODE SELECTOR */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-slate-900/90 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => setFeeStructure('added')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              feeStructure === 'added'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Bajaj (Add to Loan)</span>
          </button>

          <button
            type="button"
            onClick={() => setFeeStructure('deducted')}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              feeStructure === 'deducted'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bank (Deduct Upfront)</span>
          </button>
        </div>

        {/* 2. HERO DISPLAY CARD */}
        <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 p-4 text-center shadow-lg border border-white/15">
          <span className="text-[11px] font-bold text-blue-100 uppercase tracking-wider block">
            {feeStructure === 'added' ? 'Total Loan Financed (EMI Base)' : 'Net In-Hand Cash Received'}
          </span>

          <div className="text-3xl sm:text-4xl font-black text-white tracking-tight my-1">
            {formatINR(feeStructure === 'added' ? effectivePrincipal : netInHandDisbursal)}
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-white/20 text-left text-xs">
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block">Sanctioned Loan</span>
              <span className="font-bold text-white text-sm block truncate">{formatINR(loanAmount || 0)}</span>
            </div>
            <div className="bg-black/20 rounded-xl p-2 border border-white/5">
              <span className="text-[10px] text-blue-200 block">Total Extra Charges</span>
              <span className="font-bold text-amber-300 text-sm block truncate">+{formatINR(totalExtraCharges)}</span>
            </div>
          </div>
        </div>

        {/* 3. CLEAN EDITABLE INPUTS */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          
          {/* Loan Amount */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-semibold">1. Loan Amount</label>
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
          </div>

          {/* Fee Rate & Flexi Charge */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-300 font-semibold">Processing Fee</label>
                <span className="text-amber-400 font-bold text-[11px]">{formatINR(baseProcessingFee)}</span>
              </div>
              <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-blue-500">
                <input
                  type="number"
                  step="0.1"
                  inputMode="decimal"
                  value={processingFeePercent === 0 ? '' : processingFeePercent}
                  onChange={(e) => setProcessingFeePercent(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                  className="w-full bg-transparent font-bold text-base text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="2.5"
                />
                <span className="text-xs font-bold text-slate-500 ml-1">%</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="text-slate-300 font-semibold">Flexi / Doc</label>
                <span className="text-slate-400 font-bold text-[11px]">{flexiOtherCharge === 0 ? '₹0' : formatINR(flexiOtherCharge)}</span>
              </div>
              <div className="flex items-center bg-slate-950 px-2.5 py-1.5 rounded-xl border border-slate-800 focus-within:border-blue-500">
                <span className="text-xs font-bold text-slate-500 mr-1.5">₹</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={flexiOtherCharge === 0 ? '' : flexiOtherCharge}
                  onChange={(e) => setFlexiOtherCharge(e.target.value === '' ? 0 : Number(e.target.value))}
                  className="w-full bg-transparent font-bold text-base text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* GST % */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center text-xs">
              <label className="text-slate-300 font-semibold">GST on Charges</label>
              <span className="text-slate-400 font-bold text-[11px]">{gstPercent}% = {formatINR(gstAmount)}</span>
            </div>
            <div className="flex items-center bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 focus-within:border-blue-500">
              <input
                type="number"
                step="1"
                inputMode="numeric"
                value={gstPercent === 0 ? '' : gstPercent}
                onChange={(e) => setGstPercent(e.target.value === '' ? 0 : parseFloat(e.target.value))}
                className="w-full bg-transparent font-bold text-base text-white outline-none border-none p-0 focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="0"
              />
              <span className="text-xs font-bold text-slate-500 ml-1">%</span>
            </div>
          </div>

        </div>

        {/* 4. CHARGES & CASH GRAPH BREAKDOWN */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3.5 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-slate-300 uppercase tracking-wider text-[11px]">
              Deductions & Cash Share
            </span>
            <span className="text-amber-400 font-bold text-[11px]">
              Charges: +{formatINR(totalExtraCharges)}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            {/* SVG Donut Chart */}
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

                {/* In-Hand Disbursed / Base Slice (Blue) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#3b82f6"
                  strokeWidth="11"
                  strokeDasharray={`${(inHandPct / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-inHandOffset}
                />

                {/* Processing Fee Slice (Amber) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#f59e0b"
                  strokeWidth="11"
                  strokeDasharray={`${(feePct / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-feeOffset}
                />

                {/* Flexi Charge Slice (Rose) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#f43f5e"
                  strokeWidth="11"
                  strokeDasharray={`${(flexiPct / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-flexiOffset}
                />

                {/* GST Slice (Emerald) */}
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  fill="transparent"
                  stroke="#10b981"
                  strokeWidth="11"
                  strokeDasharray={`${(gstPct / 100) * circumference} ${circumference}`}
                  strokeDashoffset={-gstOffset}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-[9px] text-slate-400 font-medium">In-Hand</span>
                <span className="text-xs font-black text-white">{inHandPct}%</span>
              </div>
            </div>

            {/* Legend Stats */}
            <div className="flex-1 space-y-1 text-xs">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span>In-Hand Cash</span>
                </span>
                <span className="font-bold text-white">{formatINR(inHandMoney)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Proc. Fee</span>
                </span>
                <span className="font-bold text-amber-400">+{formatINR(baseProcessingFee)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span>Flexi / Doc</span>
                </span>
                <span className="font-bold text-rose-400">+{formatINR(flexiOtherCharge)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 text-slate-300">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>GST ({gstPercent}%)</span>
                </span>
                <span className="font-bold text-emerald-400">+{formatINR(gstAmount)}</span>
              </div>
            </div>
          </div>

          {/* Quick Proportion Bar */}
          <div className="w-full h-2 rounded-full overflow-hidden flex bg-slate-800 mt-1">
            <div style={{ width: `${inHandPct}%` }} className="h-full bg-blue-500" />
            <div style={{ width: `${feePct}%` }} className="h-full bg-amber-500" />
            <div style={{ width: `${flexiPct}%` }} className="h-full bg-rose-500" />
            <div style={{ width: `${gstPct}%` }} className="h-full bg-emerald-500" />
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}