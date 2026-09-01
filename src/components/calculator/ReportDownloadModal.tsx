'use client';

import React, { useRef } from 'react';
import { LoanInputState, CalculationResult, AmortizationRow } from '@/types/calculator';
import { formatINR, formatINRCompact } from '@/lib/calculations/formatting';
import { Download, Printer, X, Calculator, ShieldCheck, CheckCircle } from 'lucide-react';

interface ReportDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: LoanInputState;
  calculation: CalculationResult;
  monthlySchedule: AmortizationRow[];
}

export const ReportDownloadModal: React.FC<ReportDownloadModalProps> = ({
  isOpen,
  onClose,
  inputs,
  calculation,
  monthlySchedule,
}) => {
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const {
    loanAmount,
    emi,
    totalInterest,
    totalPayable,
    processingFee,
    gstAmount,
    otherCharges,
    totalCharges,
    totalCost,
    monthlyRate,
    annualRate,
    tenureMonths,
  } = calculation;

  const { tenureValue, tenureType } = inputs;
  const monthlyRateFormatted = (monthlyRate * 100).toFixed(2);
  const annualRateFormatted = (annualRate * 100).toFixed(2);
  const dateStr = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fade-in text-slate-900 dark:text-white">
      
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 relative my-8">
        
        {/* Top Control Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <Download className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Download Loan Summary Report
              </h3>
              <p className="text-xs text-slate-500">
                Official presentation report for customer review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-sm"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div ref={reportRef} className="printable-report space-y-6 p-4 sm:p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800">
          
          {/* Document Header */}
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Loan<span className="text-blue-600">Calc</span> Report
                </h1>
                <p className="text-xs text-slate-500">Calculate. Compare. Understand.</p>
              </div>
            </div>

            <div className="text-right text-xs text-slate-500">
              <p className="font-semibold text-slate-900 dark:text-white">Quote Ref: #{Math.floor(100000 + Math.random() * 900000)}</p>
              <p>Generated: {dateStr}</p>
            </div>
          </div>

          {/* Key Loan Metrics Table */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Loan Principal</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{formatINR(loanAmount)}</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Interest Rate</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{monthlyRateFormatted}%/mo ({annualRateFormatted}% p.a.)</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block">Tenure</span>
              <span className="text-base font-extrabold text-slate-900 dark:text-white">{tenureValue} {tenureType} ({tenureMonths} mo)</span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-blue-600 block">Monthly EMI</span>
              <span className="text-base font-black text-blue-600 dark:text-blue-400">{formatINR(emi)}</span>
            </div>
          </div>

          {/* Detailed Cost Breakdown Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Financial Breakdown Summary
            </h4>

            <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
              <thead className="bg-slate-100 dark:bg-slate-800 font-bold uppercase tracking-wider text-[10px] text-slate-600 dark:text-slate-400">
                <tr>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3 text-right">Calculation Basis</th>
                  <th className="py-2.5 px-3 text-right">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                <tr>
                  <td className="py-2.5 px-3">Loan Principal Amount</td>
                  <td className="py-2.5 px-3 text-right text-slate-500">Borrowed principal</td>
                  <td className="py-2.5 px-3 text-right font-bold">{formatINR(loanAmount)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 text-rose-600">Total Interest Liability</td>
                  <td className="py-2.5 px-3 text-right text-slate-500">{tenureMonths} months @ {monthlyRateFormatted}%/mo</td>
                  <td className="py-2.5 px-3 text-right font-bold text-rose-600">{formatINR(totalInterest)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">Processing Fee</td>
                  <td className="py-2.5 px-3 text-right text-slate-500">{inputs.processingFeePercent}% of principal</td>
                  <td className="py-2.5 px-3 text-right font-semibold">{formatINR(processingFee)}</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3">GST on Processing Fee</td>
                  <td className="py-2.5 px-3 text-right text-slate-500">{inputs.gstPercent}% tax</td>
                  <td className="py-2.5 px-3 text-right font-semibold">{formatINR(gstAmount)}</td>
                </tr>
                {otherCharges > 0 && (
                  <tr>
                    <td className="py-2.5 px-3">Other Additional Charges</td>
                    <td className="py-2.5 px-3 text-right text-slate-500">User entered documentation</td>
                    <td className="py-2.5 px-3 text-right font-semibold">{formatINR(otherCharges)}</td>
                  </tr>
                )}
                <tr className="bg-slate-50 dark:bg-slate-800/80 font-black text-sm text-slate-900 dark:text-white">
                  <td className="py-3 px-3">Total Estimated Out-of-Pocket Cost</td>
                  <td className="py-3 px-3 text-right text-xs font-normal text-slate-500">Principal + Interest + Charges</td>
                  <td className="py-3 px-3 text-right text-blue-600 dark:text-blue-400">{formatINR(totalCost)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* First 6 Months Schedule Preview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Amortization Schedule Preview (Months 1–6)
            </h4>
            <table className="w-full text-xs text-left border border-slate-200 dark:border-slate-800 rounded-xl">
              <thead className="bg-slate-100 dark:bg-slate-800 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2 px-3">Month</th>
                  <th className="py-2 px-3 text-right">EMI</th>
                  <th className="py-2 px-3 text-right">Principal</th>
                  <th className="py-2 px-3 text-right">Interest</th>
                  <th className="py-2 px-3 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {monthlySchedule.slice(0, 6).map((row) => (
                  <tr key={row.period}>
                    <td className="py-2 px-3 font-semibold">{row.period}</td>
                    <td className="py-2 px-3 text-right font-bold">{formatINR(row.emi)}</td>
                    <td className="py-2 px-3 text-right text-blue-600">{formatINR(row.principal)}</td>
                    <td className="py-2 px-3 text-right text-rose-500">{formatINR(row.interest)}</td>
                    <td className="py-2 px-3 text-right">{formatINR(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Disclaimer */}
          <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 space-y-1">
            <p className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Calculations are illustrative estimates for customer presentation & planning purposes.
            </p>
            <p>
              Actual EMI, interest, taxes, charges and repayment schedule may vary based on lender terms, credit assessment, applicable GST/taxes and exact disbursement timing.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
