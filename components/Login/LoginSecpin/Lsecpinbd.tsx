'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/context/LoginContext';

const LsecPinBd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, updateUser } = useLogin();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please login first');
      setTimeout(() => router.push('/Logins/login'), 1500);
    }
  }, [router]);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;

    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);

    if (val && idx < 3) {
      document.getElementById(`pin-${idx + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !pin[idx] && idx > 0) {
      document.getElementById(`pin-${idx - 1}`)?.focus();
    }
  };

  const handlePinSubmit = async () => {
    const authToken = localStorage.getItem('token');
    if (!authToken) {
      setError('Session expired. Please login again.');
      setTimeout(() => router.push('/Logins/login'), 1500);
      return;
    }

    // Prioritize user from context, fallback to localStorage
    const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
    const email = currentUser?.email;
    const pinStr = pin.join('');

    if (!email) {
      setError('User email not found');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://evolve2p-backend.onrender.com/api/check-pin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({ email, pin: pinStr }),
      });

      let responseData: any;
      try {
        responseData = await response.json();
        console.log('SERVER RESPONSE:', responseData); // Keep this for debugging
      } catch (e) {
        const text = await response.text();
        console.log('SERVER RESPONSE (text):', text); // Log text response
        responseData = { message: text || 'Invalid server response format' };
      }

      if (!response.ok) {
        let readableMessage = 'Something went wrong';
        if (responseData?.message) {
          readableMessage = typeof responseData.message === 'string' ? responseData.message : JSON.stringify(responseData.message);
        } else if (typeof responseData === 'string') {
          readableMessage = responseData;
        } else if (Object.keys(responseData).length === 0) {
          readableMessage = 'Server error: empty JSON response.';
        }
        throw new Error(`HTTP error! status: ${response.status}, message: ${readableMessage}`);
      }

      updateUser({ pin: pinStr });
      router.push('/Logins/Lauth');
    } catch (err: any) {
      const finalMessage = typeof err === 'string' ? err : err?.message || JSON.stringify(err);
      setError(finalMessage);
      setPin(['', '', '', '']);
      setTimeout(() => document.getElementById('pin-0')?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (pin.every(digit => digit !== '') && !loading) {
      handlePinSubmit();
    }
  }, [pin, loading, handlePinSubmit]); // Added handlePinSubmit to dependency array (best practice for useCallback-like behavior)

  return (
    <div className="text-white ml-[95px] mt-[30px]">
      <h2 className="text-[24px] text-[#FCFCFC] font-[700]">Enter security PIN</h2>
      <p className="text-[16px] font-[400] mt-[-10px] mb-6 text-[#8F8F8F]">
        Your PIN helps you log in faster and approve transactions <br /> securely.
      </p>

      {error && (
        <p className="text-[#ffffff] mb-4">
          {error}
          {error.includes('expired') && (
            <span className="text-[#4DF2BE] ml-2">Redirecting...</span>
          )}
        </p>
      )}

      <div className="flex gap-2">
        {[0, 1, 2, 3].map((idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            maxLength={1}
            value={pin[idx]}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-[83.5px] h-[56px] ml-[15px] rounded-[10px] border-none bg-[#222222] text-center text-xl text-[#8F8F8F] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
            type="password"
            disabled={loading}
            autoFocus={idx === 0}
          />
        ))}
      </div>

      <div
        className="text-[14px] mt-[70px] ml-[-20%] font-[700] text-center text-[#FCFCFC] hover:underline cursor-pointer"
        onClick={() => alert('Forgot PIN functionality coming soon')}
      >
        Forgot PIN
      </div>

      {loading && (
        <div className="flex justify-center mt-[30px] ml-[-40px]">
          <div className="loader"></div>
        </div>
      )}

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

export default LsecPinBd;