'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the correct signup page
    router.replace('/Signups/Email');
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1012] text-white">
      <p>Redirecting to signup page...</p>
    </div>
  );
}
