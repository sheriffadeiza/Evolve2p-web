'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LAuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to homepage
    router.push('/');
  }, [router]);

  // Return a minimal loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1012] text-white">
      <p>Redirecting to homepage...</p>
    </div>
  );
}
