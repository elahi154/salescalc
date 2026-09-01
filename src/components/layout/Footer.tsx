'use client';

import React from 'react';
import { ShieldCheck, Calculator } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 bg-slate-100/80 dark:bg-slate-900/80 border-t border-slate-200/80 dark:border-slate-800 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Calculator className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-slate-900 dark:text-white">
              Loan<span className="text-blue-600 dark:text-blue-400">Calc</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Calculate. Compare. Understand. — Premium Sales Presentation Tool
          </p>
        </div>

        {/* Financial Disclaimer Box */}
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>Important Financial Disclaimer</span>
          </div>
          <p className="leading-relaxed">
            Calculations are illustrative estimates for planning purposes. Actual EMI, interest, charges and repayment schedule may vary based on lender terms, applicable taxes, fees and calculation methodology.
          </p>
        </div>

        <div className="text-center text-[11px] text-slate-400 pt-2 border-t border-slate-200/40 dark:border-slate-800/40">
          © {new Date().getFullYear()} LoanCalc. All calculations performed client-side in real-time.
        </div>

      </div>
    </footer>
  );
};
