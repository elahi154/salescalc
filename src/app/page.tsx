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
  Sparkles,
  Home as HomeIcon,
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
      badgeColor: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
      href: '/calculators/emi',
    },
    {
      id: 'charges',
      title: 'Processing Fees',
      desc: 'Fee, GST & upfront cost',
      icon: <Percent className="w-5 h-5 text-amber-400" />,
      badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      href: '/calculators/charges',
    },
    {
      id: 'breakdown',
      title: 'Loan Breakdown',
      desc: 'Month & day schedule',
      icon: <Calendar className="w-5 h-5 text-indigo-400" />,
      badgeColor: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400',
      href: '/calculators/breakdown',
    },
    {
      id: 'compare',
      title: 'Loan Compare',
      desc: 'Compare tenure & amount',
      icon: <Scale className="w-5 h-5 text-sky-400" />,
      badgeColor: 'bg-sky-500/10 border-sky-500/20 text-sky-400',
      href: '/compare',
    },
    {
      id: 'prepayment',
      title: 'Prepayment',
      desc: 'Calculate interest savings',
      icon: <Wallet className="w-5 h-5 text-emerald-400" />,
      badgeColor: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      href: '/calculators/prepayment',
    },
    {
      id: 'od-flexi',
      title: 'OD / Flexi Loan',
      desc: 'Utilized limit interest',
      icon: <RefreshCw className="w-5 h-5 text-cyan-400" />,
      badgeColor: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
      href: '/calculators/od-flexi',
    },
    {
      id: 'interest',
      title: 'Interest Rate',
      desc: 'Monthly & annual rate',
      icon: <Percent className="w-5 h-5 text-purple-400" />,
      badgeColor: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
      href: '/calculators/interest',
    },
    {
      id: 'customer-view',
      title: 'Customer View',
      desc: '1-tap presentation card',
      icon: <Presentation className="w-5 h-5 text-amber-300" />,
      badgeColor: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
      href: '/customer-view',
    },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col bg-[#070A12] text-white font-sans selection:bg-blue-600 selection:text-white">
      
      {/* TOP APP BAR */}
      <header className="px-4 py-3 border-b border-slate-800/80 bg-[#070A12]/95 backdrop-blur-md sticky top-0 z-30 shrink-0">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Calculator className="w-4 h-4" />
            </div>
            <div>
              <span className="font-black text-base tracking-tight text-white block leading-none">
                Loan<span className="text-blue-400">Calc</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">
                Finance Sales Suite
              </span>
            </div>
          </div>

          <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-800/80 text-[11px] font-bold">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Sales App</span>
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-3 pb-20 flex flex-col justify-center space-y-3">
        
        {/* Header Content */}
        <div className="text-center space-y-0.5">
          <h1 className="text-lg sm:text-xl font-black text-white tracking-tight">
            What do you want to calculate?
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium">
            Tap any tool to open instant mobile calculator
          </p>
        </div>

        {/* 2-COL TILES GRID */}
        <div className="grid grid-cols-2 gap-2.5">
          {appCards.map((card) => (
            <Link
              key={card.id}
              href={card.href}
              className="group p-3 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800/90 hover:border-blue-500/40 shadow-sm transition-all duration-150 active:scale-[0.98] flex flex-col justify-between space-y-2.5"
            >
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-xl border ${card.badgeColor} shrink-0`}>
                  {card.icon}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-transform" />
              </div>

              <div className="space-y-0.5">
                <h2 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                  {card.title}
                </h2>
                <p className="text-[10px] text-slate-400 truncate leading-tight">
                  {card.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom Trust Badge */}
        <div className="text-center text-[10px] text-slate-400 font-medium flex items-center justify-center gap-1.5 pt-0.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span>100% Client-Side Math • Fast & Offline Ready</span>
        </div>

      </main>

      {/* BOTTOM NAVIGATION BAR */}
      <footer className="bg-[#070A12]/95 backdrop-blur-lg border-t border-slate-800 py-2 px-4 fixed bottom-0 left-0 right-0 z-30">
        <div className="max-w-md mx-auto grid grid-cols-4 gap-1 text-center">
          <Link
            href="/"
            className="flex flex-col items-center justify-center py-1 text-blue-400 font-bold"
          >
            <HomeIcon className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>

          <Link
            href="/calculators/emi"
            className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <Calculator className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">EMI</span>
          </Link>

          <Link
            href="/compare"
            className="flex flex-col items-center justify-center py-1 text-slate-400 hover:text-white font-medium transition-colors"
          >
            <Scale className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Compare</span>
          </Link>

          <Link
            href="/customer-view"
            className="flex flex-col items-center justify-center py-1 text-amber-400 font-bold"
          >
            <Presentation className="w-4 h-4" />
            <span className="text-[10px] mt-0.5">Present</span>
          </Link>
        </div>
      </footer>

    </div>
  );
}