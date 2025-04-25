'use client';

// app/layout.tsx or app/layout.js


import { ReactNode } from 'react';
import './globals.css';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en"> 
      <body className="bg-[#0F1012]">
        {children}
      </body>
    </html>
  );
}

