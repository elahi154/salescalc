'use client';

import React, { useState } from 'react';
import {
  AmortizationRow,
  PeriodBreakdownRow,
  AnnualBreakdownRow,
  BreakdownTab,
} from '@/types/calculator';
import { formatINR } from '@/lib/calculations/formatting';
import { Table, Info } from 'lucide-react';

interface PaymentBreakdownProps {
  monthlySchedule: AmortizationRow[];
  dailySchedule: PeriodBreakdownRow[];
  weeklySchedule: PeriodBreakdownRow[];
  annualSchedule: AnnualBreakdownRow[];
}

export const PaymentBreakdown: React.FC<PaymentBreakdownProps> = ({
  monthlySchedule,
  dailySchedule,
  weeklySchedule,
  annualSchedule,
}) => {
  // MONTH is selected by default as explicitly required
  const [activeTab, setActiveTab] = useState<BreakdownTab>('month');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-5">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Table className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Payment Breakdown Schedule</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            View detailed repayment schedule across time intervals
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl self-start sm:self-auto">
          {(['day', 'week', 'month', 'year'] as BreakdownTab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all ${
                activeTab === tab
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Disclaimers for Estimated Views */}
      {activeTab === 'day' && (
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-2 text-xs text-blue-800 dark:text-blue-200">
          <Info className="w-4 h-4 shrink-0 text-blue-600" />
          <span className="font-semibold">Estimated Daily Breakdown</span> (Illustrative estimate assuming 30 days per month).
        </div>
      )}

      {activeTab === 'week' && (
        <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-200/60 dark:border-blue-800/60 flex items-center gap-2 text-xs text-blue-800 dark:text-blue-200">
          <Info className="w-4 h-4 shrink-0 text-blue-600" />
          <span className="font-semibold">Estimated Weekly Breakdown</span> (Illustrative weekly payment pacing).
        </div>
      )}

      {/* MOBILE CARD VIEW (Small Screens < sm) */}
      <div className="sm:hidden space-y-3 max-h-[380px] overflow-y-auto pr-1">
        {activeTab === 'month' &&
          monthlySchedule.slice(0, 36).map((row) => (
            <div
              key={row.period}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                <span>Month {row.period}</span>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">EMI: {formatINR(row.emi)}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Principal</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{formatINR(row.principal)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Interest</span>
                  <span className="font-bold text-rose-500">{formatINR(row.interest)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Balance</span>
                  <span className="font-semibold">{formatINR(row.balance)}</span>
                </div>
              </div>
            </div>
          ))}

        {activeTab === 'year' &&
          annualSchedule.map((row) => (
            <div
              key={row.year}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                <span>{row.label}</span>
                <span className="text-slate-900 dark:text-white font-extrabold">Paid: {formatINR(row.totalPaid)}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Principal</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{formatINR(row.principalPaid)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Interest</span>
                  <span className="font-bold text-rose-500">{formatINR(row.interestPaid)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Balance</span>
                  <span className="font-semibold">{formatINR(row.remainingBalance)}</span>
                </div>
              </div>
            </div>
          ))}

        {(activeTab === 'day' || activeTab === 'week') &&
          (activeTab === 'day' ? dailySchedule : weeklySchedule).slice(0, 30).map((row) => (
            <div
              key={row.period}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-2"
            >
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white border-b border-slate-200/60 dark:border-slate-700/60 pb-1.5">
                <span>{row.label}</span>
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">{formatINR(row.emi)}</span>
              </div>
              <div className="grid grid-cols-3 gap-1 text-[11px]">
                <div>
                  <span className="text-slate-500 block">Principal</span>
                  <span className="font-bold text-blue-600 dark:text-blue-400">{formatINR(row.principal)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Interest</span>
                  <span className="font-bold text-rose-500">{formatINR(row.interest)}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Balance</span>
                  <span className="font-semibold">{formatINR(row.balance)}</span>
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* DESKTOP TABLE VIEW (Medium Screens >= sm) */}
      <div className="hidden sm:block overflow-x-auto rounded-2xl border border-slate-200/80 dark:border-slate-800 max-h-[420px] overflow-y-auto">
        <table className="w-full text-left text-xs sm:text-sm">
          
          <thead className="sticky top-0 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider text-[11px] z-10">
            {activeTab === 'month' && (
              <tr>
                <th className="py-3 px-4">Month</th>
                <th className="py-3 px-4 text-right">EMI</th>
                <th className="py-3 px-4 text-right">Principal</th>
                <th className="py-3 px-4 text-right">Interest</th>
                <th className="py-3 px-4 text-right">Balance</th>
              </tr>
            )}

            {(activeTab === 'day' || activeTab === 'week') && (
              <tr>
                <th className="py-3 px-4">{activeTab === 'day' ? 'Day' : 'Week'}</th>
                <th className="py-3 px-4 text-right">Est. EMI</th>
                <th className="py-3 px-4 text-right">Est. Principal</th>
                <th className="py-3 px-4 text-right">Est. Interest</th>
                <th className="py-3 px-4 text-right">Est. Balance</th>
              </tr>
            )}

            {activeTab === 'year' && (
              <tr>
                <th className="py-3 px-4">Year</th>
                <th className="py-3 px-4 text-right">Principal Paid</th>
                <th className="py-3 px-4 text-right">Interest Paid</th>
                <th className="py-3 px-4 text-right">Total Paid</th>
                <th className="py-3 px-4 text-right">Remaining Balance</th>
              </tr>
            )}
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-medium text-slate-800 dark:text-slate-200">
            {activeTab === 'month' &&
              monthlySchedule.map((row) => (
                <tr key={row.period} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">{row.period}</td>
                  <td className="py-2.5 px-4 text-right font-bold">{formatINR(row.emi)}</td>
                  <td className="py-2.5 px-4 text-right text-blue-600 dark:text-blue-400">{formatINR(row.principal)}</td>
                  <td className="py-2.5 px-4 text-right text-rose-500 dark:text-rose-400">{formatINR(row.interest)}</td>
                  <td className="py-2.5 px-4 text-right font-semibold">{formatINR(row.balance)}</td>
                </tr>
              ))}

            {activeTab === 'day' &&
              dailySchedule.map((row) => (
                <tr key={row.period} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">Day {row.period}</td>
                  <td className="py-2.5 px-4 text-right font-bold">{formatINR(row.emi)}</td>
                  <td className="py-2.5 px-4 text-right text-blue-600 dark:text-blue-400">{formatINR(row.principal)}</td>
                  <td className="py-2.5 px-4 text-right text-rose-500 dark:text-rose-400">{formatINR(row.interest)}</td>
                  <td className="py-2.5 px-4 text-right font-semibold">{formatINR(row.balance)}</td>
                </tr>
              ))}

            {activeTab === 'week' &&
              weeklySchedule.map((row) => (
                <tr key={row.period} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">Week {row.period}</td>
                  <td className="py-2.5 px-4 text-right font-bold">{formatINR(row.emi)}</td>
                  <td className="py-2.5 px-4 text-right text-blue-600 dark:text-blue-400">{formatINR(row.principal)}</td>
                  <td className="py-2.5 px-4 text-right text-rose-500 dark:text-rose-400">{formatINR(row.interest)}</td>
                  <td className="py-2.5 px-4 text-right font-semibold">{formatINR(row.balance)}</td>
                </tr>
              ))}

            {activeTab === 'year' &&
              annualSchedule.map((row) => (
                <tr key={row.year} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{row.label}</td>
                  <td className="py-3 px-4 text-right font-semibold text-blue-600 dark:text-blue-400">{formatINR(row.principalPaid)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-rose-500 dark:text-rose-400">{formatINR(row.interestPaid)}</td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 dark:text-white">{formatINR(row.totalPaid)}</td>
                  <td className="py-3 px-4 text-right font-semibold">{formatINR(row.remainingBalance)}</td>
                </tr>
              ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};
