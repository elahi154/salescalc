import { useState, useEffect } from 'react';
import { SavedCalculation, LoanInputState, CalculationResult } from '@/types/calculator';

const STORAGE_KEY = 'loancalc_recent_calculations_v1';
const MAX_HISTORY = 8;

export function useRecentCalculations() {
  const [history, setHistory] = useState<SavedCalculation[]>([]);

  // Load history on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load recent calculations', e);
    }
  }, []);

  // Save calculation to history
  const saveCalculation = (input: LoanInputState, result: CalculationResult) => {
    try {
      const newEntry: SavedCalculation = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        loanAmount: input.loanAmount,
        interestRate: input.interestRate,
        rateType: input.rateType,
        tenureValue: input.tenureValue,
        tenureType: input.tenureType,
        emi: result.emi,
        totalPayable: result.totalPayable,
      };

      setHistory((prev) => {
        // Filter out identical recent calculations if needed
        const filtered = prev.filter(
          (item) =>
            !(
              item.loanAmount === newEntry.loanAmount &&
              item.interestRate === newEntry.interestRate &&
              item.rateType === newEntry.rateType &&
              item.tenureValue === newEntry.tenureValue &&
              item.tenureType === newEntry.tenureType
            )
        );

        const updated = [newEntry, ...filtered].slice(0, MAX_HISTORY);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        return updated;
      });
    } catch (e) {
      console.error('Failed to save calculation to localStorage', e);
    }
  };

  const clearHistory = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      setHistory([]);
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  };

  return {
    history,
    saveCalculation,
    clearHistory,
  };
}
