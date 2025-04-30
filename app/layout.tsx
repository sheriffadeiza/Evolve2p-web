'use client';

import { ReactNode } from 'react';
import './globals.css';
import { SignupProvider } from '@/context/SignupContext';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en"> 
      <body className="bg-[#0F1012]">
        <SignupProvider>
          {children}
        </SignupProvider>
      </body>
    </html>
  );
}