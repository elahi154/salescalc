'use client';

import React from 'react';
import {
  Calculator,
  Presentation,
  PieChart,
  Scale,
  PiggyBank,
  Download,
  Sparkles,
  History,
  ArrowRight,
} from 'lucide-react';

interface SalesFeaturesGridProps {
  onOpenCalculator: () => void;
  onOpenCustomerView: () => void;
  onOpenCompare: () => void;
  onOpenPrepayment: () => void;
  onOpenReport: () => void;
  onOpenHistory: () => void;
}

export const SalesFeaturesGrid: React.FC<SalesFeaturesGridProps> = ({
  onOpenCalculator,
  onOpenCustomerView,
  onOpenCompare,
  onOpenPrepayment,
  onOpenReport,
  onOpenHistory,
}) => {
  const tools = [
    {
      id: 'emi-calc',
      title: 'Instant EMI Calculator',
      badge: 'Core Tool',
      icon: <Calculator className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      description:
        'Live real-time math with monthly interest rate default (1.00%/mo ≈ 12% p.a.), quick amount presets (₹5L–₹1Cr), and smooth sliders.',
      actionText: 'Calculate EMI',
      action: onOpenCalculator,
      color: 'blue',
    },
    {
      id: 'customer-view',
      title: 'Customer Presentation Mode',
      badge: 'Sales Favorite',
      icon: <Presentation className="w-6 h-6 text-amber-500" />,
      description:
        'Ultra-clean 1-tap presentation card designed for sales executives to hand their phone or tablet to customers during face-to-face meetings.',
      actionText: 'Open Presentation Mode',
      action: onOpenCustomerView,
      color: 'amber',
    },
    {
      id: 'tenure-compare',
      title: 'Tenure & Amount Comparison',
      badge: 'Decision Helper',
      icon: <Scale className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      description:
        'Instantly compare 3Y vs 5Y vs 7Y tenures or ₹10L vs ₹30L borrowing options to help customers find an EMI that fits their monthly salary.',
      actionText: 'Compare Tenures',
      action: onOpenCompare,
      color: 'indigo',
    },
    {
      id: 'prepayment-calc',
      title: 'Prepayment Savings Tool',
      badge: 'Interest Saver',
      icon: <PiggyBank className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />,
      description:
        'Show customers how making a 10% part-prepayment or paying extra EMIs reduces tenure by months and saves lakhs in interest liability.',
      actionText: 'Calculate Savings',
      action: onOpenPrepayment,
      color: 'emerald',
    },
    {
      id: 'pdf-report',
      title: 'Official Customer PDF Quote',
      badge: 'Instant Handout',
      icon: <Download className="w-6 h-6 text-rose-500" />,
      description:
        'Generate and print professional, customer-ready loan quotes complete with repayment schedules and cost breakdowns in 1 click.',
      actionText: 'Generate PDF Report',
      action: onOpenReport,
      color: 'rose',
    },
    {
      id: 'easy-explainer',
      title: 'Plain-English "Easy Mode"',
      badge: 'No Jargon',
      icon: <Sparkles className="w-6 h-6 text-amber-500" />,
      description:
        'Translates complex banking jargon into simple 3-step stories ("Money You Get", "Monthly Payment", "Bank Fee") so customers sign faster.',
      actionText: 'View Easy Mode',
      action: onOpenCalculator,
      color: 'amber',
    },
    {
      id: 'true-cost',
      title: 'True Out-of-Pocket Cost',
      badge: 'Zero Surprises',
      icon: <PieChart className="w-6 h-6 text-blue-600 dark:text-blue-400" />,
      description:
        'Includes user-configurable processing fees %, GST %, and documentation charges so customers see the exact total cash outflow.',
      actionText: 'View Total Cost',
      action: onOpenCalculator,
      color: 'blue',
    },
    {
      id: 'history-drawer',
      title: 'Local Client-Side History',
      badge: 'Offline Friendly',
      icon: <History className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />,
      description:
        'Automatically stores the last 8 customer calculations on your device. Restore previous quotes instantly with zero internet dependency.',
      actionText: 'Open Saved Quotes',
      action: onOpenHistory,
      color: 'indigo',
    },
  ];

  return (
    <div className="space-y-6">
      
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Everything a Loan Sales Executive Needs
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Built to answer every customer question, overcome objections, and present clean loan quotes on the spot.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {tools.map((tool) => (
          <div
            key={tool.id}
            className="group relative bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-800 group-hover:scale-105 transition-transform">
                  {tool.icon}
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {tool.badge}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {tool.title}
              </h3>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {tool.description}
              </p>
            </div>

            <button
              onClick={tool.action}
              className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 text-xs font-bold text-slate-700 dark:text-slate-300 transition-all group-hover:shadow-sm"
            >
              <span>{tool.actionText}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
