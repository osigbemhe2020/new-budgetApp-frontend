import type { Metadata } from 'next';
import Providers from './providers';   // your new client‑side provider component
import StyledComponentsRegistry from '@/lib/registry'; // if you have this
import './globals.css';

export const metadata: Metadata = {
  title: 'BudgetWise — Smart Personal Finance',
  description: 'Smart personal finance & budgeting app. Track income, expenses, savings, and debts in one place.',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ fontFamily: "'Inter', sans-serif" }}>
        <StyledComponentsRegistry>   {/* must be outermost for styled‑components SSR */}
          <Providers>               {/* all client providers inside */}
            {children}
          </Providers>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}