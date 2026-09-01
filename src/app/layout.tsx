import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'LoanCalc — Calculate. Compare. Understand.',
  description:
    'Premium, mobile-first loan calculation & customer presentation tool. See instant EMI, total interest, processing charges, amortization breakdown, tenure comparisons, and prepayment savings.',
  keywords: [
    'loan calculator',
    'EMI calculator',
    'loan presentation tool',
    'amortization schedule',
    'processing fee calculator',
    'prepayment calculator',
    'fintech calculator',
  ],
  authors: [{ name: 'LoanCalc' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans min-h-screen flex flex-col antialiased`}>
        {children}
      </body>
    </html>
  );
}
