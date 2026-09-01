'use client';

import React from 'react';
import { Presentation, Calculator, FileCheck, ArrowRight, CheckCircle2 } from 'lucide-react';

interface SalesWorkflowSectionProps {
  onOpenCalculator: () => void;
  onOpenCustomerView: () => void;
  onOpenReport: () => void;
}

export const SalesWorkflowSection: React.FC<SalesWorkflowSectionProps> = ({
  onOpenCalculator,
  onOpenCustomerView,
  onOpenReport,
}) => {
  const steps = [
    {
      number: '1',
      title: 'Enter Customer Requirements',
      subtitle: 'Loan Amount, Rate, Tenure',
      description:
        'Ask the customer how much they want to borrow. Use touch steppers (+/-) or amount presets for instant EMI response.',
      actionText: 'Step 1: Enter Details',
      action: onOpenCalculator,
      icon: <Calculator className="w-5 h-5 text-blue-600 dark:text-blue-400" />,
    },
    {
      number: '2',
      title: 'Hand Phone in Customer View',
      subtitle: 'Present Apple-Style Card',
      description:
        'Tap "Present" to open Customer View mode. Hand your phone or tablet to the customer so they see a beautiful presentation card.',
      actionText: 'Step 2: Present Mode',
      action: onOpenCustomerView,
      icon: <Presentation className="w-5 h-5 text-amber-500" />,
    },
    {
      number: '3',
      title: 'Print / Download Official Quote',
      subtitle: 'Generate PDF Report',
      description:
        'Click "Report" to generate an official loan summary PDF. Hand it over or email it to secure the customer sign-off on the spot.',
      actionText: 'Step 3: Print Quote',
      action: onOpenReport,
      icon: <FileCheck className="w-5 h-5 text-emerald-500" />,
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800/80 rounded-3xl p-6 sm:p-10 shadow-sm border border-blue-200/70 dark:border-slate-800 space-y-6">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-200 font-extrabold text-xs uppercase tracking-wider">
          Field Sales Playbook
        </span>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Close Customer Deals in 3 Simple Steps
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          How sales executives use LoanCalc during field and branch customer meetings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
        {steps.map((step) => (
          <div
            key={step.number}
            className="p-6 rounded-3xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700 shadow-sm space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  {step.icon}
                </div>
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                  {step.number}
                </span>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  {step.title}
                </h3>
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 block">
                  {step.subtitle}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {step.description}
              </p>
            </div>

            <button
              onClick={step.action}
              className="inline-flex items-center justify-center gap-1.5 w-full py-2.5 px-4 rounded-xl bg-slate-100 dark:bg-slate-700 hover:bg-blue-600 hover:text-white text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors"
            >
              <span>{step.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
