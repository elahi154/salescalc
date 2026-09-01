'use client';

import React from 'react';
import { Calculator, Presentation, Scale, PiggyBank, Sparkles, Download, ShieldCheck, ArrowRight } from 'lucide-react';

interface LandingHeroProps {
  onOpenCalculator: () => void;
  onOpenCustomerView: () => void;
  onOpenCompare: () => void;
  onOpenPrepayment: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenCalculator,
  onOpenCustomerView,
  onOpenCompare,
  onOpenPrepayment,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-12 shadow-2xl border border-indigo-900/50 space-y-8">
      
      {/* Decorative ambient background lights */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
        
        {/* Top Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-xs font-extrabold uppercase tracking-widest text-blue-300 border border-white/15">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Sales Executive Presentation Toolkit</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-6xl font-black tracking-tight leading-tight text-white drop-shadow-sm">
          Close loan deals faster with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-amber-300">instant clarity</span>.
        </h1>

        {/* Hero Subtitle */}
        <p className="text-sm sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
          The ultimate presentation and calculation tool designed for loan sales executives. Show instant EMIs, compare tenures, and hand your phone to customers with confidence.
        </p>

        {/* Quick Tool Launch Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          
          <button
            onClick={onOpenCalculator}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm sm:text-base shadow-xl shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Calculator className="w-5 h-5" />
            <span>Launch Main Calculator</span>
          </button>

          <button
            onClick={onOpenCustomerView}
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm sm:text-base backdrop-blur-md border border-white/20 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Presentation className="w-5 h-5 text-amber-400" />
            <span>Customer View Mode</span>
          </button>

          <button
            onClick={onOpenCompare}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-colors"
          >
            <Scale className="w-4 h-4 text-blue-400" />
            <span>Compare Tenures</span>
          </button>

          <button
            onClick={onOpenPrepayment}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 font-bold text-xs sm:text-sm border border-slate-700 transition-colors"
          >
            <PiggyBank className="w-4 h-4 text-emerald-400" />
            <span>Prepayment Savings</span>
          </button>

        </div>

        {/* Key Feature Trust Badges */}
        <div className="pt-6 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs font-semibold text-slate-300">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>100% Client-Side Math</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>No Login / CRM Required</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>1-Click PDF Quotes</span>
          </div>
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Mobile Touch Steppers</span>
          </div>
        </div>

      </div>
    </div>
  );
};
