'use client';

import React from 'react';
import Link from 'next/link';
import {
  Calculator,
  Percent,
  Calendar,
  Scale,
  Wallet,
  RefreshCw,
  Presentation,
  ArrowRight,
  Sparkles,
  Home as HomeIcon,
  Layers,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export default function Home() {
  const appCards = [
    {
      id: 'emi',
      title: 'EMI Calculator',
      desc: 'Monthly EMI & interest',
      icon: <Calculator className="w-5 h-5 text-blue-400" />,
      badgeColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      href: '/calculators/emi',
    },
    {
      id: 'charges',
      title: 'Processing Fees',
      desc: 'Fee, GST & upfront cost',
      icon: <Percent className="w-5 h-5 text-amber-400" />,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      href: '/calculators/charges',
    },
    {
      id: 'breakdown',
      title: 'Loan Breakdown',
      desc: 'Month & day schedule',
      icon: <Calendar className="w-5 h-5 text-indigo-400" />,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      href: '/calculators/breakdown',
    },
    {
      id: 'compare',
      title: 'Loan Compare',
      desc: 'Compare tenure & amount',
      icon: <Scale className="w-5 h-5 text-indigo-400" />,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      href: '/compare',
    },
    {
      id: 'prepayment',
      title: 'Prepayment',
      desc: 'Calculate interest savings',
      icon: <Wallet className="w-5 h-5 text-emerald-400" />,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      href: '/calculators/prepayment',
    },
    {
      id: 'od-flexi',
      title: 'OD / Flexi Loan',
      desc: 'Utilized limit interest',
      icon: <RefreshCw className="w-5 h-5 text-cyan-400" />,
      badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      href: '/calculators/od-flexi',
    },
    {
      id: 'interest',
      title: 'Interest Rate',
      desc: 'Monthly & annual rate',
      icon: <Percent className="w-5 h-5 text-purple-400" />,
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      href: '/calculators/interest',
    },
    {
      id: 'customer-view',
      title: 'Customer View',
      desc: '1-tap presentation card',
      icon: <Presentation className="w-5 h-5 text-amber-400" />,
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      href: '/customer-view',
    },
  ];

  return (
    <div className="min-h-screen sm:min-h-[100dvh] flex flex-col justify-between bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white font-sans overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      {/* TOP NATIVE APP BAR */}
      <header className="px-4 py-3.5 sm:py-4 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-white">
                Loan<span className="text-blue-400">Calc</span>
              </span>
              <p className="text-[10px] text-slate-400 font-medium leading-none">
                Calculate. Compare. Understand.
              </p>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/80 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Sales App</span>
          </div>

        </div>
      </header>

      {/* MAIN 1-SCREEN NATIVE APP LAUNCHER BODY */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-3 sm:py-6 flex flex-col justify-center space-y-4">
        
        {/* Compact App Header */}
        <div className="text-center space-y-1">
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            What do you want to calculate?
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-medium">
            Tap any tool to open instant mobile calculator
          </p>
        </div>

        {/* NATIVE APP TILES GRID (2 Cols on Phone • Fits 1 Screen) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 my-auto">
          {appCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group relative p-3.5 sm:p-5 rounded-2xl sm:rounded-3xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/90 hover:border-blue-500/50 shadow-md transition-all duration-150 active:scale-95 flex flex-col justify-between space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border ${card.badgeColor}`}>
                  {card.icon}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
              </div>

              <div className="space-y-0.5">
                <h2 className="text-xs sm:text-base font-extrabold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                  {card.title}
                </h2>
                <p className="text-[10px] sm:text-xs text-slate-400 line-clamp-1">
                  {card.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Trust Badge */}
        <div className="text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5 pt-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>100% Client-Side Math • No Login Required</span>
        </div>

      </main>

      {/* NATIVE MOBILE BOTTOM NAVIGATION BAR */}
      <footer className="bg-slate-950/95 backdrop-blur-lg border-t border-slate-800/90 py-2.5 px-4 sticky bottom-0 z-30">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1 text-center">
          
          <Link
            href="/"
            className="flex flex-col items-center justify-center py-1 text-blue-400 font-bold"
          >
            <HomeIcon className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>

          <Link
            href="/calculators/emi"
            className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-white font-medium"
          >
            <Calculator className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">EMI</span>
          </Link>

          <Link
            href="/compare"
            className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-white font-medium"
          >
            <Scale className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Compare</span>
          </Link>

          <Link
            href="/customer-view"
            className="flex flex-col items-center justify-center py-1 text-amber-400 font-bold"
          >
            <Presentation className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Present</span>
          </Link>

        </div>
      </footer>

    </div>
  );
}
