'use client';

import React from 'react';
import { SmartInsightItem } from '@/lib/calculations/insights';
import { Sparkles, PieChart, Clock, Receipt, TrendingUp } from 'lucide-react';

interface SmartInsightsProps {
  insights: SmartInsightItem[];
}

export const SmartInsights: React.FC<SmartInsightsProps> = ({ insights }) => {
  if (!insights || insights.length === 0) return null;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'PieChart':
        return <PieChart className="w-5 h-5 text-blue-600 dark:text-blue-400" />;
      case 'Clock':
        return <Clock className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
      case 'Receipt':
        return <Receipt className="w-5 h-5 text-amber-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      default:
        return <Sparkles className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 sm:p-7 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-4">
      
      <div>
        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span>Smart Calculation Insights</span>
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Automated observations based on your current inputs
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {insights.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-white dark:bg-slate-900 shadow-sm shrink-0">
              {renderIcon(item.icon)}
            </div>

            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                💡 {item.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
