'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Signup/SignupEmail/Header';
import { API_ENDPOINTS } from '@/config/api';
import { extractErrorMessage } from '@/Utils/errorHandler';

const VerifyEmailPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  useEffect(() => {
    // Get email from localStorage
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('unverified_email') : null;
    if (storedEmail) {
      setEmail(storedEmail);
      // Send OTP automatically when page loads
      handleSendOTP(storedEmail);
    } else {
      setError('No email found. Please go back to login.');
    }
  }, []);

  useEffect(() => {
    // Countdown timer for resend button
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);

  const handleSendOTP = async (emailToUse: string) => {
    if (!emailToUse) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');
    setResendDisabled(true);
    setCountdown(30); // 30 seconds cooldown

    try {
      const response = await fetch(API_ENDPOINTS.SEND_OTP, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailToUse }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(extractErrorMessage(data));
      }

      setSuccess('Verification code sent to your email');

      // For development, show the OTP in the console
      if (data.code) {
        console.log('OTP Code (for development):', data.code);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !verificationCode) {
      setError('Email and verification code are required');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(API_ENDPOINTS.VERIFY_EMAIL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, verificationCode }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(extractErrorMessage(data));
      }

      setSuccess('Email verified successfully');

      // If we received a token, store it
      if (data.token) {
        localStorage.setItem('token', data.token);

        // Store user data
        if (data.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          localStorage.setItem('user', JSON.stringify({ email, is_verified: true }));
        }

        // Clear the unverified email
        localStorage.removeItem('unverified_email');

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/Logins/login');
        }, 1500);
      } else if (data.email_verified) {
        // Email is verified but no user exists yet (signup flow)
        localStorage.setItem('email_verified', 'true');
        localStorage.setItem('verified_email', email);

        // Clear the unverified email
        localStorage.removeItem('unverified_email');

        setSuccess('Email verified successfully. You can now log in.');

        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push('/Logins/login');
        }, 1500);
      } else {
        // If no token and no email_verified flag, just redirect to login
        setTimeout(() => {
          router.push('/Logins/login');
        }, 1500);
      }
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      <Header />

      <div className="flex-1 flex justify-center items-center">
        <div className="w-full max-w-md p-6 bg-[#1A1A1C] rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-[#FCFCFC] mb-6">Verify Your Email</h2>

          {error && (
            <div className="p-3 mb-4 text-[#F5918A] bg-[#332222] rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 mb-4 text-[#4DF2BE] bg-[#223322] rounded">
              {success}
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div>
              <label className="block text-[14px] font-[500] text-[#8F8F8F] mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 rounded w-full bg-[#222222] text-[#FCFCFC] border-none focus:outline-none"
                disabled
              />
            </div>

            <div>
              <label className="block text-[14px] font-[500] text-[#8F8F8F] mb-1">Verification Code</label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                className="p-3 rounded w-full bg-[#222222] text-[#FCFCFC] border-none focus:outline-none"
                required
              />
            </div>

            <button
              type="button"
              onClick={() => handleSendOTP(email)}
              disabled={resendDisabled || loading}
              className="text-[14px] font-[700] text-[#4DF2BE] hover:underline disabled:text-[#8F8F8F] disabled:no-underline"
            >
              {resendDisabled ? `Resend code in ${countdown}s` : 'Resend verification code'}
            </button>

            <button
              type="submit"
              disabled={loading}
              className="w-full p-3 bg-[#4DF2BE] text-[#0F1012] rounded-full font-bold disabled:opacity-50"
            >
              {loading ? 'Verifying...' : 'Verify Email'}
            </button>

            <button
              type="button"
              onClick={() => router.push('/Logins/login')}
              className="w-full p-3 bg-transparent border border-[#8F8F8F] text-[#FCFCFC] rounded-full font-bold"
            >
              Back to Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
