'use client';

import React, { useState } from 'react';
import { CalculationResult, LoanInputState } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { Sparkles, HelpCircle, ArrowRight, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

interface PlainEnglishStoryProps {
  calculation: CalculationResult;
  inputs: LoanInputState;
}

export const PlainEnglishStory: React.FC<PlainEnglishStoryProps> = ({ calculation, inputs }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const { loanAmount, emi, totalInterest, totalCharges, totalCost, tenureMonths } = calculation;
  const { tenureValue, tenureType, interestRate, rateType } = inputs;

  const tenureYearsStr = tenureType === 'years' ? `${tenureValue} years` : `${(tenureMonths / 12).toFixed(1)} years`;

  // Ratio calculation: for every 100 rupees paid back
  const principalShare = totalPayableShare(loanAmount, totalInterest);
  const interestShare = 100 - principalShare;

  function totalPayableShare(principal: number, interest: number) {
    const total = principal + interest;
    if (total <= 0) return 100;
    return Math.round((principal / total) * 100);
  }

  const faqs = [
    {
      question: 'What is EMI in simple words?',
      answer:
        'EMI stands for Equated Monthly Installment. It is the fixed amount of money you pay to the bank every single month until your loan is fully paid off.',
    },
    {
      question: 'Where does my monthly EMI money go?',
      answer:
        'Every month, part of your EMI pays off the original money you borrowed (Principal), and the remaining part pays the bank’s profit fee (Interest). In the beginning months, more money goes to interest.',
    },
    {
      question: 'Why should I care about Tenure (Time)?',
      answer:
        'If you choose more years to repay, your monthly EMI becomes smaller and easier to pay. However, the bank charges interest for more years, so your total extra cost becomes higher!',
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 rounded-3xl p-5 sm:p-8 shadow-sm border border-blue-200/70 dark:border-slate-800 space-y-6">
      
      {/* Title */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              How This Loan Works (In Plain English)
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">
              Simple 3-step summary so anyone can understand instantly
            </p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 font-bold text-xs">
          Easy Explainer
        </span>
      </div>

      {/* 3-Step Simple Story Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Step 1: Money You Get */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Step 1: Money You Borrow</span>
            <span className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center text-xs">1</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {formatINR(loanAmount)}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
            This is the exact cash amount deposited into your bank account.
          </p>
        </div>

        {/* Step 2: Monthly Payment */}
        <div className="p-5 rounded-2xl bg-blue-600 text-white shadow-md shadow-blue-600/20 space-y-2">
          <div className="flex items-center justify-between text-blue-200 text-xs font-bold uppercase tracking-wider">
            <span>Step 2: Pay Every Month</span>
            <span className="w-6 h-6 rounded-full bg-white/20 text-white flex items-center justify-center text-xs">2</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">
            {formatINR(emi)} <span className="text-xs font-semibold text-blue-200">/ mo</span>
          </div>
          <p className="text-xs text-blue-100 leading-snug">
            You pay this fixed amount every month for <strong>{tenureYearsStr}</strong> ({tenureMonths} total payments).
          </p>
        </div>

        {/* Step 3: Extra Bank Cost */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-500 text-xs font-bold uppercase tracking-wider">
            <span>Step 3: Bank’s Extra Charge</span>
            <span className="w-6 h-6 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center text-xs">3</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-600 dark:text-rose-400">
            {formatINRCompact(totalInterest)}
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
            This is the extra interest money the bank earns for lending you the loan.
          </p>
        </div>

      </div>

      {/* Visual Rupee Breakdown Bar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 space-y-3">
        <div className="flex items-center justify-between text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
          <span>💡 Where does your money go for every ₹100 paid?</span>
          <span className="text-xs font-semibold text-slate-500">₹{principalShare} Principal • ₹{interestShare} Interest</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-4 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden flex">
          <div
            style={{ width: `${principalShare}%` }}
            className="h-full bg-blue-600 transition-all duration-500"
            title={`₹${principalShare} clears your loan principal`}
          />
          <div
            style={{ width: `${interestShare}%` }}
            className="h-full bg-rose-500 transition-all duration-500"
            title={`₹${interestShare} pays bank interest`}
          />
        </div>

        <div className="flex items-center justify-between text-xs font-semibold pt-1">
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
            ₹{principalShare} clears your loan principal
          </span>
          <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            ₹{interestShare} goes to bank interest
          </span>
        </div>
      </div>

      {/* Frequently Asked Plain-English Questions */}
      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-blue-600" />
          Common Questions Answered Simply
        </h4>

        <div className="space-y-2">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-4 py-3.5 text-left font-bold text-xs sm:text-sm text-slate-900 dark:text-white flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                <span>{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>

              {openFaq === index && (
                <div className="px-4 pb-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed border-t border-slate-100 dark:border-slate-700/60 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
