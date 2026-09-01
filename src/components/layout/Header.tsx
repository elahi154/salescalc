'use client';

import React from 'react';
import { Calculator, Presentation, History, Moon, Sun, Download, Sparkles, Home, Layers } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  simpleMode: boolean;
  activeView: 'home' | 'calc';
  onSelectView: (view: 'home' | 'calc') => void;
  onToggleDarkMode: () => void;
  onToggleSimpleMode: () => void;
  onOpenCustomerView: () => void;
  onOpenHistory: () => void;
  onOpenReport: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  simpleMode,
  activeView,
  onSelectView,
  onToggleDarkMode,
  onToggleSimpleMode,
  onOpenCustomerView,
  onOpenHistory,
  onOpenReport,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Main Nav Tabs */}
          <div className="flex items-center space-x-3 sm:space-x-6">
            <div
              onClick={() => onSelectView('home')}
              className="flex items-center space-x-2.5 cursor-pointer group"
            >
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0 group-hover:scale-105 transition-transform">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                    Loan<span className="text-blue-600 dark:text-blue-400">Calc</span>
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden md:block">
                  Sales Executive Toolkit
                </p>
              </div>
            </div>

            {/* View Navigation Switcher */}
            <div className="hidden sm:inline-flex p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl">
              <button
                onClick={() => onSelectView('home')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeView === 'home'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Feature Hub</span>
              </button>

              <button
                onClick={() => onSelectView('calc')}
                className={`px-3 py-1.5 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 ${
                  activeView === 'calc'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Calculator Suite</span>
              </button>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Easy Mode vs Detailed Mode Toggle */}
            <button
              onClick={onToggleSimpleMode}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                simpleMode
                  ? 'bg-amber-500 text-white border-amber-400 shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
              title="Toggle Easy Plain-English Mode vs Detailed Mode"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{simpleMode ? 'Easy Mode' : 'Detailed'}</span>
            </button>

            {/* Customer View Button */}
            <button
              onClick={onOpenCustomerView}
              className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 shadow-sm transition-all duration-150 active:scale-95"
              title="Switch to Customer Presentation View"
            >
              <Presentation className="w-4 h-4" />
              <span className="hidden sm:inline">Present</span>
            </button>

            {/* Download Report Button */}
            <button
              onClick={onOpenReport}
              className="p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              title="Download Presentation Report"
            >
              <Download className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="hidden md:inline">Report</span>
            </button>

            {/* History Button */}
            <button
              onClick={onOpenHistory}
              className="relative p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              title="Recent Calculations History"
            >
              <History className="w-4 h-4 text-slate-600 dark:text-slate-300" />
              <span className="hidden md:inline">History</span>
              {historyCount > 0 && (
                <span className="ml-0.5 px-1.5 py-0.2 text-[10px] font-bold bg-blue-600 text-white rounded-full">
                  {historyCount}
                </span>
              )}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={onToggleDarkMode}
              className="p-2 sm:p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
