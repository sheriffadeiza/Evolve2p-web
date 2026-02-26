'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the correct login page
    router.replace('/Logins/login');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1012] text-white">
      <p>Redirecting to login page...</p>
    </div>
  );
}
