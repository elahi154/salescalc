'use client';

import React, { useState } from 'react';
import { LoanInputState, CalculationResult, AmortizationRow, TenureComparisonItem } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { PaymentDistribution } from '../charts/PaymentDistribution';
import { X, Sparkles, Presentation, Clock, Table } from 'lucide-react';

interface CustomerViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: LoanInputState;
  calculation: CalculationResult;
  monthlySchedule: AmortizationRow[];
  tenureComparison: TenureComparisonItem[];
}

export const CustomerViewModal: React.FC<CustomerViewModalProps> = ({
  isOpen,
  onClose,
  inputs,
  calculation,
  monthlySchedule,
  tenureComparison,
}) => {
  const [subView, setSubView] = useState<'monthly' | 'compare'>('monthly');

  if (!isOpen) return null;

  const { loanAmount, emi, totalInterest, monthlyRate, annualRate } = calculation;
  const { tenureValue, tenureType } = inputs;

  // Pure Total Payable (Principal + Interest only)
  const cleanTotalPayable = loanAmount + totalInterest;

  const monthlyRateFormatted = (monthlyRate * 100).toFixed(2);
  const annualRateFormatted = (annualRate * 100).toFixed(2);
  const tenureStr = tenureType === 'years' ? `${tenureValue} Years` : `${tenureValue} Months`;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/90 backdrop-blur-lg flex flex-col items-center justify-start p-3 sm:p-6 animate-fade-in text-slate-900 dark:text-white">
      
      {/* Top Floating Control Bar */}
      <div className="w-full max-w-3xl flex items-center justify-between py-3 mb-2 sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md px-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
            <Presentation className="w-4 h-4" />
          </div>
          <span className="font-extrabold text-sm sm:text-base text-white tracking-tight">
            Loan<span className="text-blue-400">Calc</span> Customer Presentation
          </span>
        </div>

        <button
          onClick={onClose}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-colors border border-white/10 shadow-lg"
        >
          <X className="w-4 h-4" />
          <span>Exit Customer View</span>
        </button>
      </div>

      {/* Main Presentation Content Card */}
      <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl border border-slate-200/80 dark:border-slate-800 space-y-8 my-auto">
        
        {/* Header Badge */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-bold text-xs uppercase tracking-widest border border-blue-200 dark:border-blue-800">
            <Sparkles className="w-3.5 h-3.5" /> Customer Loan Quote
          </span>
          <p className="text-xs text-slate-500">
            Calculated instantly for your financial review
          </p>
        </div>

        {/* 1. YOUR LOAN & HUGE EMI RESULT */}
        <div className="text-center space-y-3 bg-gradient-to-b from-blue-50/70 to-indigo-50/50 dark:from-slate-800/60 dark:to-indigo-950/40 p-6 sm:p-8 rounded-3xl border border-blue-100 dark:border-slate-800">
          
          <div className="space-y-0.5">
            <span className="text-xs uppercase font-extrabold tracking-widest text-slate-500 dark:text-slate-400">
              Your Requested Loan
            </span>
            <div className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
              {formatINR(loanAmount)}
            </div>
          </div>

          <div className="py-4 border-t border-b border-blue-200/60 dark:border-slate-700/60 space-y-1">
            <span className="text-xs uppercase font-black tracking-wider text-blue-600 dark:text-blue-400">
              MONTHLY EMI
            </span>
            <div className="text-4xl sm:text-6xl font-black tracking-tight text-blue-600 dark:text-blue-400">
              {formatINR(emi)}
            </div>
            <div className="text-xs font-semibold text-slate-600 dark:text-slate-300 pt-1">
              <span>{monthlyRateFormatted}% / month</span>
              <span className="mx-2 text-slate-400">•</span>
              <span>≈ {annualRateFormatted}% p.a.</span>
              <span className="mx-2 text-slate-400">•</span>
              <span>{tenureStr}</span>
            </div>
          </div>

        </div>

        {/* 2. PAYMENT SUMMARY CARDS (2 CARDS ONLY - NO ADDITIONAL CHARGES) */}
        <div className="space-y-3">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Payment Summary
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-center">
            
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <span className="text-xs font-medium text-slate-500 block">Total Interest</span>
              <span className="text-xl font-extrabold text-rose-600 dark:text-rose-400">
                {formatINRCompact(totalInterest)}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 text-white dark:bg-blue-950 dark:border-blue-800 border">
              <span className="text-xs font-medium text-blue-200 block">Total Payable</span>
              <span className="text-xl font-extrabold text-white">
                {formatINRCompact(cleanTotalPayable)}
              </span>
            </div>

          </div>
        </div>

        {/* 3. DONUT CHART */}
        <PaymentDistribution calculation={calculation} />

        {/* 4. PAYMENT BREAKDOWN SUB-VIEW & TENURE COMPARISON */}
        <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
          
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Repayment Breakdown
            </h4>

            {/* Toggle Buttons */}
            <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
              <button
                onClick={() => setSubView('monthly')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  subView === 'monthly'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Table className="w-3.5 h-3.5" />
                Monthly Schedule
              </button>
              <button
                onClick={() => setSubView('compare')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1 ${
                  subView === 'compare'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Compare Tenure
              </button>
            </div>
          </div>

          {/* SubView 1: Monthly Amortization Preview */}
          {subView === 'monthly' && (
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 max-h-[300px]">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Month</th>
                    <th className="py-2.5 px-3 text-right">EMI</th>
                    <th className="py-2.5 px-3 text-right">Principal</th>
                    <th className="py-2.5 px-3 text-right">Interest</th>
                    <th className="py-2.5 px-3 text-right">Balance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {monthlySchedule.slice(0, 24).map((row) => (
                    <tr key={row.period}>
                      <td className="py-2 px-3 font-semibold">{row.period}</td>
                      <td className="py-2 px-3 text-right font-bold">{formatINR(row.emi)}</td>
                      <td className="py-2 px-3 text-right text-blue-600 dark:text-blue-400">{formatINR(row.principal)}</td>
                      <td className="py-2 px-3 text-right text-rose-500">{formatINR(row.interest)}</td>
                      <td className="py-2 px-3 text-right">{formatINR(row.balance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* SubView 2: Compare Tenure Options */}
          {subView === 'compare' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {tenureComparison.map((item) => (
                <div
                  key={item.years}
                  className={`p-4 rounded-2xl border space-y-2 ${
                    item.isSelected
                      ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 dark:border-blue-500'
                      : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <span className="text-xs font-bold block">{item.years} Years</span>
                  <div className="text-lg font-black text-blue-600 dark:text-blue-400">
                    {formatINR(item.emi)} <span className="text-[10px] font-normal text-slate-500">/mo</span>
                  </div>
                  <div className="text-[11px] text-slate-500 space-y-0.5">
                    <div>Interest: <span className="font-bold text-rose-500">{formatINRCompact(item.totalInterest)}</span></div>
                    <div>Payable: <span className="font-bold">{formatINRCompact(item.totalPayable)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};