'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/context/LoginContext';
import { API_ENDPOINTS } from '@/config/api';

const LsecPinBd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pinSubmitted, setPinSubmitted] = useState(false);
  const router = useRouter();
  const { user, updateUser } = useLogin();

  useEffect(() => {
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

    if (val && idx < 3) {
      document.getElementById(`pin-${idx + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === 'Backspace' && !pin[idx] && idx > 0) {
      document.getElementById(`pin-${idx - 1}`)?.focus();
    }
  };

  const handlePinSubmit = useCallback(async () => {
    // For invalid PIN errors, we want to allow immediate resubmission
    // So we only check for non-PIN related errors
    const hasBlockingError = error &&
      !error.includes('Invalid security PIN') &&
      !error.includes('Invalid PIN');

    // Prevent multiple submissions or resubmission if there's a blocking error
    if (loading || pinSubmitted || hasBlockingError) {
      console.log('Submission prevented:', { loading, pinSubmitted, hasBlockingError });
      return;
    }

    // Set submitted state immediately to prevent double submission
    setPinSubmitted(true);

    let authToken;
    try {
      authToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (!authToken) {
        setError('Session expired. Please login again.');
        setTimeout(() => router.push('/Logins/login'), 1500);
        return;
      }
    } catch (e) {
      console.error('Error accessing token:', e);
      setError('Unable to access authentication data. Please try again.');
      setTimeout(() => setPinSubmitted(false), 2000);
      return;
    }

    // Prioritize user from context, fallback to localStorage
    let currentUser;
    let email;
    const pinStr = pin.join('');

    try {
      if (user) {
        currentUser = user;
      } else if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        currentUser = storedUser ? JSON.parse(storedUser) : {};
      }

      email = currentUser?.email;

      if (!email) {
        setError('User email not found');
        return;
      }
    } catch (e) {
      console.error('Error accessing user data:', e);
      setError('Unable to access user data. Please try again.');
      return;
    }

    setLoading(true);
    setPinSubmitted(true);
    setError('');

    try {
      console.log(`Verifying PIN for email: ${email}`);
      console.log(`Using endpoint: ${API_ENDPOINTS.CHECK_PIN}`);

      const response = await fetch(API_ENDPOINTS.CHECK_PIN, {
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
        } else if (responseData?.detail) {
          readableMessage = responseData.detail;
        } else if (typeof responseData === 'string') {
          readableMessage = responseData;
        } else if (Object.keys(responseData).length === 0) {
          readableMessage = 'Server error: empty JSON response.';
        }

        // Handle specific error cases
        if (response.status === 400 && responseData?.non_field_errors?.[0] === "Invalid security PIN") {
          readableMessage = "Invalid PIN. Please try again.";
        } else if (response.status === 404) {
          readableMessage = "User not found. Please login again.";
        }

        throw new Error(readableMessage);
      }

      try {
        // Update user context with the PIN
        updateUser({ pin: pinStr });

        // Redirect directly to dashboard instead of authentication page
        console.log('PIN verified successfully, redirecting to dashboard');

        // Use a timeout to ensure state updates complete before navigation
        setTimeout(() => {
          router.push('/dashboard');
        }, 300);
      } catch (e) {
        console.error('Error updating user data:', e);
        setError('Error completing authentication. Please try again.');
      }
    } catch (err: any) {
      // Extract error message
      const finalMessage = typeof err === 'string' ? err : err?.message || JSON.stringify(err);
      console.error('PIN verification error:', finalMessage);

      // Check if it's an invalid PIN error
      const isInvalidPin = finalMessage.includes('Invalid security PIN') ||
                          finalMessage.includes('Invalid PIN');

      if (isInvalidPin) {
        // For invalid PIN, don't show error message to user
        console.log('Invalid PIN entered, allowing retry');

        // Just clear the PIN and allow immediate retry
        setPin(['', '', '', '']);

        // Add a subtle visual shake animation to the PIN inputs
        const pinContainer = document.querySelector('.pin-container');
        if (pinContainer) {
          pinContainer.classList.add('shake');
          setTimeout(() => {
            pinContainer.classList.remove('shake');
          }, 500);
        }

        // Focus on first input immediately
        setTimeout(() => {
          const firstInput = document.getElementById('pin-0');
          if (firstInput) {
            firstInput.focus();
          }
        }, 100);
      } else {
        // For other errors, show the error message
        setError(finalMessage);
      }
    } finally {
      // Reset loading state
      setLoading(false);

      // Allow resubmission immediately for invalid PIN,
      // or after a delay for other errors
      const delay = error ? 2000 : 300;
      setTimeout(() => {
        setPinSubmitted(false);
        console.log('PIN submission reset, can try again');
      }, delay);
    }
  }, [pin, loading, router, user, updateUser, pinSubmitted]);

  // Only trigger pin submission when all digits are entered and not already loading or submitted
  useEffect(() => {
    // Check if all PIN digits are filled
    const allDigitsFilled = pin.every(digit => digit !== '');

    // For invalid PIN errors, we want to allow immediate resubmission
    // So we only check for non-PIN related errors
    const hasBlockingError = error &&
      !error.includes('Invalid security PIN') &&
      !error.includes('Invalid PIN');

    // Only proceed if all conditions are met
    if (allDigitsFilled && !loading && !pinSubmitted && !hasBlockingError) {
      console.log('Triggering PIN submission');

      // Add a small delay to prevent immediate submission which can cause issues
      const timer = setTimeout(() => {
        handlePinSubmit();
      }, 100);

      // Clean up the timer if the component unmounts
      return () => clearTimeout(timer);
    }
  }, [pin, loading, pinSubmitted, error, handlePinSubmit]);

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

      <div className="flex gap-2 pin-container">
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

        /* Shake animation for invalid PIN */
        .shake {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default LsecPinBd;