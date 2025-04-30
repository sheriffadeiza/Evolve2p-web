'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSignup } from '@/context/SignupContext';

const EmailForm = () => {
  const router = useRouter();
  const { setCurrentStep, updateSignupData } = useSignup();
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://evolve2p-backend.onrender.com/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          username: 'temp_user',    // Use temporary values
          password: 'temp_pass',    // These will be updated later
          country: 'default',
          phone: '0000000000',
          verified: false
        }),
      });
  
      const data = await response.json();
      console.log('Server response:', data);
  
      if (!response.ok) {
        if (data?.message?.toLowerCase().includes('already')) {
          setError('Email already exists. Please use a different email.');
          return;
        }
        throw new Error(data?.message || 'Registration failed');
      }
  
      // Success flow
      updateSignupData({ email });
      localStorage.setItem('userEmail', email);
      setCurrentStep('password');
      router.push('/Signups/Password');
  
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err?.message || 'Unable to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pl-[100px] pt-[30px]">
      <div className="flex flex-col gap-2 max-w-md">
        <h1 className="text-[24px] font-[700] text-[#FCFCFC]">Create account</h1>
        <p className="text-[16px] font-[400] mt-[-10px] text-[#8F8F8F]">
          Enter your email to start trading securely.
        </p>

        <label className="text-[14px] mt-[10px] font-[500] text-[#8F8F8F]">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email address"
          className="p-3 rounded-[8px] w-[350px] mt-[10px] h-[56px] bg-[#222222]  pl-[20px] text-[14px] font-[500] h-[56px] text-[#FCFCFC] border-none focus:outline-none"
        />

        {error && (
          <p className="text-[#F5918A] text-[14px] font-[500] mt-1">{error}</p>
        )}

        <button
          className={`p-3 w-[380px] h-[48px] mt-[8%] bg-[#4DF2BE] text-[#0F1012] h-[56px] rounded-[100px] border border-brand-green ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#3dd9ab]'
          }`}
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Continue'}
        </button>

        <div className="flex flex-col items-center ml-[-20%] gap-4">
          <p className="text-14px font-[400] text-[#DBDBDB]">
            Already have an account?{' '}
            <a
              href="/login"
              className="text-[#FCFCFC] ml-[20px] text-[14px] font-[700] no-underline hover:underline"
            >
              Log in
            </a>
          </p>

          <small className="text-[16px] leading-6 mt-[50px] font-[400] text-[#8F8F8F]">
            By creating an account you are agreeing to <br /> our{' '}
            <a href="/terms" className="text-[#DBDBDB] ml-[5px] no-underline hover:underline">
              Terms & Conditions
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-[#DBDBDB] ml-[5px] no-underline hover:underline">
              Privacy Policy
            </a>
            .
          </small>
        </div>
      </div>
    </div>
  );
};

export default EmailForm;