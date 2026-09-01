/**
 * Format standard Indian currency (e.g. ₹20,00,000)
 */
export function formatINR(val: number, includeSymbol: boolean = true): string {
  if (isNaN(val) || !isFinite(val)) return includeSymbol ? '₹0' : '0';
  const rounded = Math.round(val);
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 0,
  }).format(rounded);
  return includeSymbol ? `₹${formatted}` : formatted;
}

/**
 * Compact Indian currency formatting (e.g. ₹27.16L, ₹1.50Cr, ₹50K)
 */
export function formatINRCompact(val: number, includeSymbol: boolean = true): string {
  if (isNaN(val) || !isFinite(val)) return includeSymbol ? '₹0' : '0';
  const abs = Math.abs(val);
  const prefix = val < 0 ? '-' : '';
  const sym = includeSymbol ? '₹' : '';

  if (abs >= 10000000) { // 1 Crore
    const cr = val / 10000000;
    return `${sym}${prefix}${cr.toFixed(2)} Cr`;
  } else if (abs >= 100000) { // 1 Lakh
    const lakh = val / 100000;
    return `${sym}${prefix}${lakh.toFixed(2)} L`;
  } else if (abs >= 1000) { // Thousand
    const k = val / 1000;
    return `${sym}${prefix}${k.toFixed(1)} K`;
  }

  return formatINR(val, includeSymbol);
}

/**
 * Format percent string (e.g. 1.00% or 12.00%)
 */
export function formatPercent(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0%';
  return `${val.toFixed(decimals)}%`;
}
