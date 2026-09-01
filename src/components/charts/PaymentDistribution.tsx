'use client';

import React from 'react';
import { CalculationResult } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { PieChart as PieIcon } from 'lucide-react';

interface PaymentDistributionProps {
  calculation: CalculationResult;
}

export const PaymentDistribution: React.FC<PaymentDistributionProps> = ({ calculation }) => {
  const { loanAmount, totalInterest, totalCharges, totalCost } = calculation;

  const data = [
    { name: 'Principal', value: loanAmount, color: '#2563EB' },
    { name: 'Interest', value: totalInterest, color: '#F43F5E' },
    { name: 'Additional Charges', value: totalCharges, color: '#F59E0B' },
  ].filter((item) => item.value > 0);

  const compactTotal = formatINRCompact(totalCost);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
      
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span>Payment Distribution</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Proportional split of your total outflow
          </p>
        </div>
      </div>

      <div className="relative flex flex-col md:flex-row items-center justify-between gap-6 py-2">
        
        {/* Donut Chart Container */}
        <div className="relative w-full max-w-[280px] h-[240px] flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any) => [formatINR(Number(value)), 'Amount']}
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#1E293B',
                  borderRadius: '12px',
                  color: '#FFF',
                  fontSize: '12px',
                  fontWeight: 'bold',
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center Text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {compactTotal}
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Total Cost
            </span>
          </div>
        </div>

        {/* Dynamic Legend */}
        <div className="w-full md:w-auto flex-1 space-y-3">
          {data.map((item) => {
            const percentage = totalCost > 0 ? ((item.value / totalCost) * 100).toFixed(1) : '0';
            return (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-3.5 h-3.5 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <div>
                    <span className="text-xs font-bold text-slate-900 dark:text-white block">
                      {item.name}
                    </span>
                    <span className="text-[11px] text-slate-500">{percentage}% of total</span>
                  </div>
                </div>

                <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                  {formatINR(item.value)}
                </span>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
