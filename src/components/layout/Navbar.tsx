'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Calculator,
  Percent,
  Calendar,
  Scale,
  Wallet,
  RefreshCw,
  Presentation,
  Moon,
  Sun,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isCalcDropdownOpen, setIsCalcDropdownOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const calculatorsList = [
    { label: 'EMI Calculator', href: '/calculators/emi', icon: <Calculator className="w-4 h-4 text-blue-600" /> },
    { label: 'Processing Charges', href: '/calculators/charges', icon: <Percent className="w-4 h-4 text-amber-500" /> },
    { label: 'Loan Breakdown', href: '/calculators/breakdown', icon: <Calendar className="w-4 h-4 text-indigo-600" /> },
    { label: 'Prepayment Savings', href: '/calculators/prepayment', icon: <Wallet className="w-4 h-4 text-emerald-600" /> },
    { label: 'OD / Flexi Calculator', href: '/calculators/od-flexi', icon: <RefreshCw className="w-4 h-4 text-cyan-600" /> },
    { label: 'Interest Calculator', href: '/calculators/interest', icon: <Percent className="w-4 h-4 text-purple-600" /> },
  ];

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Tagline */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-lg sm:text-2xl tracking-tight text-slate-900 dark:text-white">
                  Loan<span className="text-blue-600 dark:text-blue-400">Calc</span>
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Calculate. Compare. Understand.
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            
            <Link
              href="/"
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-colors ${
                pathname === '/'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Home
            </Link>

            {/* Calculators Dropdown Menu */}
            <div className="relative">
              <button
                onClick={() => setIsCalcDropdownOpen(!isCalcDropdownOpen)}
                onBlur={() => setTimeout(() => setIsCalcDropdownOpen(false), 200)}
                className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-colors inline-flex items-center gap-1 ${
                  pathname.startsWith('/calculators')
                    ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>Calculators</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {isCalcDropdownOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 p-2 space-y-1 z-50 animate-fade-in">
                  {calculatorsList.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/compare"
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-colors ${
                pathname === '/compare'
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Compare
            </Link>

            <Link
              href="/customer-view"
              className={`px-3 py-2 rounded-xl text-xs lg:text-sm font-bold transition-colors inline-flex items-center gap-1.5 ${
                pathname === '/customer-view'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700'
              }`}
            >
              <Presentation className="w-4 h-4" />
              <span>Customer View</span>
            </Link>

          </div>

          {/* Right Controls */}
          <div className="flex items-center space-x-2">
            
            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl md:hidden text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-6 space-y-3">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800"
          >
            Home
          </Link>

          <div className="space-y-1">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 block pt-1">
              Calculators
            </span>
            {calculatorsList.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-2.5 py-2 px-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          <div className="pt-2 space-y-2">
            <Link
              href="/compare"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-2 text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800"
            >
              Compare
            </Link>

            <Link
              href="/customer-view"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-blue-600 text-white text-xs font-bold text-center"
            >
              <Presentation className="w-4 h-4" />
              <span>Customer View</span>
            </Link>
          </div>
        </div>
      )}

    </nav>
  );
};
