'use client';

import React from 'react';
import { SavedCalculation, LoanInputState } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { History, X, Trash2, ArrowUpRight } from 'lucide-react';

interface RecentCalculationsProps {
  isOpen: boolean;
  onClose: () => void;
  history: SavedCalculation[];
  onSelectHistoryItem: (item: SavedCalculation) => void;
  onClearHistory: () => void;
}

export const RecentCalculations: React.FC<RecentCalculationsProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistoryItem,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <History className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Recent Calculations
              </h3>
              <p className="text-xs text-slate-500">
                Client-side history stored in localStorage
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <History className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto" />
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
              No recent calculations saved yet
            </p>
            <p className="text-xs text-slate-400 max-w-xs mx-auto">
              Your recent EMI calculations will automatically appear here for quick access.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {history.map((item) => {
              const tenureStr =
                item.tenureType === 'years' ? `${item.tenureValue} Years` : `${item.tenureValue} Months`;
              const rateStr =
                item.rateType === 'monthly' ? `${item.interestRate}%/mo` : `${item.interestRate}% p.a.`;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    onSelectHistoryItem(item);
                    onClose();
                  }}
                  className="group cursor-pointer p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 hover:bg-blue-50/50 dark:hover:bg-blue-950/30 transition-all flex items-center justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        {formatINRCompact(item.loanAmount)}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {rateStr}
                      </span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {tenureStr}
                      </span>
                    </div>

                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      EMI: {formatINR(item.emi)}
                    </div>
                  </div>

                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Footer Actions */}
        {history.length > 0 && (
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">
              Showing last {history.length} calculations
            </span>
            <button
              onClick={onClearHistory}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 px-3 py-1.5 rounded-xl transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear History
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
