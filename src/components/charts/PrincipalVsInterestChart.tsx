'use client';

import React from 'react';
import { AmortizationRow } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LineChart as LineChartIcon } from 'lucide-react';

interface PrincipalVsInterestChartProps {
  schedule: AmortizationRow[];
}

export const PrincipalVsInterestChart: React.FC<PrincipalVsInterestChartProps> = ({ schedule }) => {
  if (!schedule || schedule.length === 0) return null;

  // Downsample data if tenure is long (> 60 months) so chart renders smoothly
  const downsampleStep = schedule.length > 120 ? 6 : schedule.length > 60 ? 3 : 1;
  const chartData = schedule.filter((_, idx) => idx === 0 || (idx + 1) % downsampleStep === 0 || idx === schedule.length - 1);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
      
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <LineChartIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span>Principal vs Interest Over Time</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Repayment ratio progression across your loan tenure
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400">
            <span className="w-3 h-3 rounded-full bg-blue-600" />
            Principal Paid
          </span>
          <span className="flex items-center gap-1.5 text-rose-500 dark:text-rose-400">
            <span className="w-3 h-3 rounded-full bg-rose-500" />
            Interest Paid
          </span>
        </div>
      </div>

      <div className="w-full h-[260px] sm:h-[300px] pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.15} />
            <XAxis
              dataKey="period"
              tickFormatter={(val) => `M${val}`}
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(val) => formatINRCompact(val, false)}
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data: AmortizationRow = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3.5 rounded-xl shadow-xl text-white text-xs space-y-1.5 min-w-[170px]">
                      <p className="font-extrabold text-blue-400 border-b border-slate-800 pb-1">
                        {data.label}
                      </p>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Monthly EMI:</span>
                        <span className="font-bold">{formatINR(data.emi)}</span>
                      </div>
                      <div className="flex justify-between text-blue-300">
                        <span>Principal:</span>
                        <span className="font-bold">{formatINR(data.principal)}</span>
                      </div>
                      <div className="flex justify-between text-rose-400">
                        <span>Interest:</span>
                        <span className="font-bold">{formatINR(data.interest)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300 pt-1 border-t border-slate-800">
                        <span>Balance:</span>
                        <span className="font-bold">{formatINR(data.balance)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="principal"
              name="Principal Portion"
              stroke="#2563EB"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorPrincipal)"
            />
            <Area
              type="monotone"
              dataKey="interest"
              name="Interest Portion"
              stroke="#F43F5E"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorInterest)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
