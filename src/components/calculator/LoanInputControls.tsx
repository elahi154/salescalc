'use client';

import React from 'react';
import { LoanInputState, RateType, TenureType } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { IndianRupee, Percent, Calendar, Plus, Minus, HelpCircle } from 'lucide-react';

interface LoanInputControlsProps {
  inputs: LoanInputState;
  onUpdateInput: <K extends keyof LoanInputState>(key: K, value: LoanInputState[K]) => void;
  onSetFullState: (state: Partial<LoanInputState>) => void;
  simpleMode?: boolean;
}

export const LoanInputControls: React.FC<LoanInputControlsProps> = ({
  inputs,
  onUpdateInput,
  onSetFullState,
  simpleMode = false,
}) => {
  const { loanAmount, interestRate, rateType, tenureValue, tenureType } = inputs;

  // Preset loan amount options
  const loanPresets = [
    { label: '₹5L', value: 500000 },
    { label: '₹10L', value: 1000000 },
    { label: '₹20L', value: 2000000 },
    { label: '₹50L', value: 5000000 },
    { label: '₹1Cr', value: 10000000 },
  ];

  // Handle Rate Type Toggle
  const handleRateTypeChange = (newRateType: RateType) => {
    if (newRateType === rateType) return;
    
    let newRate = interestRate;
    if (newRateType === 'annual' && rateType === 'monthly') {
      newRate = Number((interestRate * 12).toFixed(2));
    } else if (newRateType === 'monthly' && rateType === 'annual') {
      newRate = Number((interestRate / 12).toFixed(2));
    }

    onSetFullState({
      rateType: newRateType,
      interestRate: newRate,
    });
  };

  // Handle Tenure Type Toggle
  const handleTenureTypeChange = (newTenureType: TenureType) => {
    if (newTenureType === tenureType) return;

    let newValue = tenureValue;
    if (newTenureType === 'months' && tenureType === 'years') {
      newValue = tenureValue * 12;
    } else if (newTenureType === 'years' && tenureType === 'months') {
      newValue = Math.max(1, Math.round(tenureValue / 12));
    }

    onSetFullState({
      tenureType: newTenureType,
      tenureValue: newValue,
    });
  };

  // Derived conversions for display badge
  const equivalentAnnualRate = rateType === 'monthly' ? (interestRate * 12).toFixed(2) : interestRate.toFixed(2);
  const equivalentMonthlyRate = rateType === 'annual' ? (interestRate / 12).toFixed(2) : interestRate.toFixed(2);

  // Bounds
  const minAmount = 50000;
  const maxAmount = 10000000;

  const minRate = rateType === 'monthly' ? 0.1 : 1.0;
  const maxRate = rateType === 'monthly' ? 3.0 : 36.0;
  const rateStep = rateType === 'monthly' ? 0.05 : 0.25;

  const minTenure = tenureType === 'years' ? 1 : 3;
  const maxTenure = tenureType === 'years' ? 30 : 360;

  // Stepper functions for touch-friendly +/- buttons
  const stepAmount = (delta: number) => {
    const next = Math.min(maxAmount, Math.max(minAmount, loanAmount + delta));
    onUpdateInput('loanAmount', next);
  };

  const stepRate = (delta: number) => {
    const next = Number(Math.min(maxRate, Math.max(minRate, interestRate + delta)).toFixed(2));
    onUpdateInput('interestRate', next);
  };

  const stepTenure = (delta: number) => {
    const next = Math.min(maxTenure, Math.max(minTenure, tenureValue + delta));
    onUpdateInput('tenureValue', next);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6 sm:space-y-8">
      
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <span>{simpleMode ? '1. Enter Loan Details' : 'Loan Parameters'}</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {simpleMode ? 'Tap buttons or drag sliders to set your loan' : 'Adjust inputs to calculate instant EMI'}
          </p>
        </div>
      </div>

      {/* 1. LOAN AMOUNT */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <IndianRupee className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {simpleMode ? 'Money You Want to Borrow (Principal)' : 'Loan Amount'}
          </label>

          {/* Stepper Buttons for Mobile (+/- 1 Lakh) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => stepAmount(-100000)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-0.5 active:scale-95"
              title="Decrease ₹1 Lakh"
            >
              <Minus className="w-3.5 h-3.5" /> ₹1L
            </button>
            <button
              onClick={() => stepAmount(100000)}
              className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center gap-0.5 active:scale-95"
              title="Increase ₹1 Lakh"
            >
              <Plus className="w-3.5 h-3.5" /> ₹1L
            </button>
          </div>
        </div>

        {/* Large Amount Display Banner & Editable Input */}
        <div className="flex items-center justify-between gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-blue-600 dark:text-blue-400 tracking-tight">
              {formatINR(loanAmount)}
            </div>
            <span className="text-xs font-semibold text-slate-500">
              ({formatINRCompact(loanAmount)})
            </span>
          </div>

          <div className="relative flex items-center">
            <span className="absolute left-3 text-xs font-bold text-slate-400">₹</span>
            <input
              type="text"
              value={formatINR(loanAmount, false)}
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, '');
                const num = parseInt(raw, 10);
                onUpdateInput('loanAmount', isNaN(num) ? 0 : Math.min(maxAmount, num));
              }}
              className="w-32 sm:w-40 pl-6 pr-3 py-1.5 text-right font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Slider */}
        <input
          type="range"
          min={minAmount}
          max={maxAmount}
          step={50000}
          value={loanAmount}
          onChange={(e) => onUpdateInput('loanAmount', Number(e.target.value))}
          className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
        />

        {/* Preset Chips */}
        <div className="flex flex-wrap gap-2 pt-1">
          {loanPresets.map((preset) => (
            <button
              key={preset.value}
              onClick={() => onUpdateInput('loanAmount', preset.value)}
              className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all ${
                loanAmount === preset.value
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. INTEREST RATE */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Percent className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {simpleMode ? 'Interest Rate Charged by Bank' : 'Interest Rate'}
          </label>

          {/* Toggle Switch: Monthly vs Annual */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => handleRateTypeChange('monthly')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                rateType === 'monthly'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleRateTypeChange('annual')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                rateType === 'annual'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Annual
            </button>
          </div>
        </div>

        {/* Display Banner & Input */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {interestRate.toFixed(2)}% <span className="text-sm font-medium text-slate-500">/ {rateType === 'monthly' ? 'month' : 'p.a.'}</span>
            </div>
            
            {/* Subtitle Conversion Display */}
            <div className="text-xs font-bold text-blue-600 dark:text-blue-400 mt-0.5">
              {rateType === 'monthly' ? (
                <span>≈ {equivalentAnnualRate}% p.a. (Annual)</span>
              ) : (
                <span>≈ {equivalentMonthlyRate}% / month</span>
              )}
            </div>
          </div>

          {/* Stepper Buttons for Rate (+/- 0.1%) */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => stepRate(-0.1)}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              step={rateStep}
              min={minRate}
              max={maxRate}
              value={interestRate}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onUpdateInput('interestRate', isNaN(val) ? 0 : Math.min(maxRate, Math.max(0, val)));
              }}
              className="w-20 px-2 py-1 text-center font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={() => stepRate(0.1)}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Rate Slider */}
        <input
          type="range"
          min={minRate}
          max={maxRate}
          step={rateStep}
          value={interestRate}
          onChange={(e) => onUpdateInput('interestRate', Number(e.target.value))}
          className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
        />
      </div>

      {/* 3. TENURE */}
      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <label className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            {simpleMode ? 'Time to Repay Loan (Tenure)' : 'Tenure'}
          </label>

          {/* Toggle Switch: Years vs Months */}
          <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => handleTenureTypeChange('years')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                tenureType === 'years'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Years
            </button>
            <button
              onClick={() => handleTenureTypeChange('months')}
              className={`px-3 py-1 text-xs font-extrabold rounded-lg transition-all ${
                tenureType === 'months'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Months
            </button>
          </div>
        </div>

        {/* Display Banner & Stepper */}
        <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 p-3 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div>
            <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {tenureValue} <span className="text-sm font-medium text-slate-500">{tenureType === 'years' ? (tenureValue === 1 ? 'Year' : 'Years') : (tenureValue === 1 ? 'Month' : 'Months')}</span>
            </div>
            {tenureType === 'years' && (
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 block mt-0.5">
                ({tenureValue * 12} Total Monthly Installments)
              </span>
            )}
          </div>

          {/* Stepper Buttons for Tenure */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => stepTenure(-1)}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold active:scale-95"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min={minTenure}
              max={maxTenure}
              value={tenureValue}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateInput('tenureValue', isNaN(val) ? 1 : Math.min(maxTenure, Math.max(1, val)));
              }}
              className="w-16 px-2 py-1 text-center font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
            <button
              onClick={() => stepTenure(1)}
              className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold active:scale-95"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tenure Slider */}
        <input
          type="range"
          min={minTenure}
          max={maxTenure}
          step={1}
          value={tenureValue}
          onChange={(e) => onUpdateInput('tenureValue', Number(e.target.value))}
          className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600 dark:accent-blue-500"
        />
      </div>

    </div>
  );
};
