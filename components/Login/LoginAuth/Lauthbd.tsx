'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Lauthbd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Check if user is authenticated
  useEffect(() => {
    // Use a try-catch block to handle potential localStorage errors
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!token) {
        setError('Please login first');
        setTimeout(() => router.push('/Logins/login'), 1500);
      }
    } catch (e) {
      console.error('Error accessing localStorage:', e);
      setError('Unable to access authentication data. Please try again.');
    }
  }, [router]);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;

    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);

    const nextInput = document.getElementById(`pin-${idx + 1}`);
    if (val && nextInput) (nextInput as HTMLInputElement).focus();
  };

  // Automatically redirect when all 6 digits are filled
  useEffect(() => {
    if (pin.every((digit) => digit !== '') && !loading) {
      setLoading(true);

      // Use a try-catch block to handle potential localStorage errors
      try {
        // Simulate verification process - in a real app, you would verify the code with the server
        setTimeout(() => {
          console.log('Authentication code verified, redirecting to dashboard');
          // Redirect to dashboard
          router.push('/dashboard');
        }, 500); // Small delay for UX
      } catch (e) {
        console.error('Error during authentication:', e);
        setError('Authentication failed. Please try again.');
        setLoading(false);
      }
    }
  }, [pin, router, loading]);

  return (
    <div className="text-white ml-[95px] mt-[30px]">
      <h2 className="text-[24px] text-[#FCFCFC] font-[700]">Enter Authentication code</h2>
      <p className="text-[16px] font-[400] mt-[-10px] mb-6 text-[#8F8F8F]">
        Please enter the 6-digit authentication code <br /> to complete your login.
      </p>

      {error && (
        <p className="text-[#F5918A] mb-4">
          {error}
          {error.includes('login') && (
            <span className="text-[#4DF2BE] ml-2">Redirecting...</span>
          )}
        </p>
      )}

      <div className="flex gap-[5px]">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            className="w-[60px] h-[56px] rounded-[10px] border-none bg-[#222222] text-center text-xl text-[#8F8F8F] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
            type="password"
            disabled={loading}
            autoFocus={idx === 0}
          />
        ))}
      </div>

      {loading && (
        <div className="flex justify-center mt-6">
          <div className="loader"></div>
        </div>
      )}

      <div className="text-[14px] mt-[70px] ml-[-20%] font-[700] text-center text-[#FCFCFC] hover:underline cursor-pointer">
        Resend code
      </div>

      <style jsx global>{`
        .loader {
          width: 30px;
          height: 30px;
          position: relative;
        }
        .loader::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 70%;
          height: 70%;
          border: 5px solid #333333;
          border-top-color: #4DF2BE;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Lauthbd;
