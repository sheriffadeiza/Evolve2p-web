'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const LoaderPage = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/dashboard');
    }, 2000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0F1012]">
      <div className="loader mb-6"></div>
      <span className="text-[#FFFFFF] text-lg font-semibold">Loading your dashboard...</span>
      <style jsx>{`
        .loader {
          width: 40px;
          height: 40px;
          border: 5px solid rgba(255, 255, 255, 0.3);
          border-radius: 50%;
          border-top-color: #4DF2BE;
          animation: spin 1s ease-in-out infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoaderPage;