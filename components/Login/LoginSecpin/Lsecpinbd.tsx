'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/context/LoginContext';
import { API_ENDPOINTS } from '@/config/api';
import { enhancedFetch, getApiEnvironment } from '@/utils/apiUtils';

const LsecPinBd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [apiInfo, setApiInfo] = useState({ baseUrl: '', isLocal: false });
  const router = useRouter();
  const { user, updateUser } = useLogin();

  // Display API environment information on component mount
  useEffect(() => {
    const env = getApiEnvironment();
    setApiInfo(env);
    console.log('API Environment in PIN verification:', env);
  }, []);

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
      console.log(`Attempting PIN verification with API endpoint: ${API_ENDPOINTS.CHECK_PIN}`);
      console.log('Request payload:', { email, pin: pinStr });

      const { data: responseData } = await enhancedFetch(API_ENDPOINTS.CHECK_PIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, pin: pinStr }),
      });

      updateUser({ pin: pinStr });

      // Show success message briefly before redirecting
      setError('');
      setSuccess('PIN verified successfully! Redirecting to dashboard...');
      setLoading(false);

      // Add a small delay before redirecting to dashboard
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (err: any) {
      console.error('PIN verification error:', err);

      // Get a user-friendly error message
      let finalMessage = '';
      if (typeof err === 'string') {
        finalMessage = err;
      } else if (err?.message) {
        finalMessage = err.message;
      } else {
        finalMessage = 'An error occurred while verifying your PIN. Please try again.';
      }

      // Set the error and reset the PIN
      setSuccess('');
      setError(finalMessage);
      setPin(['', '', '', '']);
      setPinComplete(false); // Reset the PIN complete flag
      setTimeout(() => document.getElementById('pin-0')?.focus(), 100);
      setLoading(false);
    }
  };

  // Track if PIN is complete to avoid multiple submissions
  const [pinComplete, setPinComplete] = useState(false);

  // This effect handles PIN submission when all digits are filled
  useEffect(() => {
    // Only submit when all digits are filled, not already loading, and not already submitted
    const allDigitsFilled = pin.every(digit => digit !== '');

    if (allDigitsFilled && !loading && !pinComplete) {
      setPinComplete(true); // Mark as complete to prevent multiple submissions
      handlePinSubmit();
    } else if (!allDigitsFilled && pinComplete) {
      // Reset the complete flag if PIN is changed/cleared
      setPinComplete(false);
    }
  }, [pin, loading, pinComplete]);

  return (
    <div className="text-white ml-[95px] mt-[30px]">
      <h2 className="text-[24px] text-[#FCFCFC] font-[700]">Enter security PIN</h2>
      <p className="text-[16px] font-[400] mt-[-10px] mb-6 text-[#8F8F8F]">
        Your PIN helps you log in faster and approve transactions <br /> securely.
      </p>

      {error && (
        <div className="p-3 mb-4 text-[#F5918A] bg-[#332222] rounded w-[90%]">
          <p>{error}</p>
          {error.includes('expired') && (
            <span className="text-[#4DF2BE] ml-2">Redirecting...</span>
          )}
        </div>
      )}

      {success && (
        <div className="p-3 mb-4 text-[#4DF2BE] bg-[#223322] rounded w-[90%]">
          <p>{success}</p>
        </div>
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