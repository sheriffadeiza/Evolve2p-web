import './globals.css';
import type { ReactNode } from 'react';


export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-[#0F1012]">
        {children}
      </body>
    </html>
  );
}
