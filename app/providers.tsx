'use client';

import { ReactNode } from 'react';
import { SignupProvider } from '@/context/SignupContext';
import { LoginProvider } from '@/context/LoginContext';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <LoginProvider>
      <SignupProvider>{children}</SignupProvider>
    </LoginProvider>
  );
}
