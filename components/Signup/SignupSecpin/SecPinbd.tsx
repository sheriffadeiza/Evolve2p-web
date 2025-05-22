'use client';

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from 'next/navigation';
import { useSignup } from '@/context/SignupContext';

const SecPinBd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setCurrentStep, updateSignupData, signupData } = useSignup();

  // Handle input change, only allow digits
  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;

    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);

    // Move focus to next input if value entered
    if (val) {
      const nextInput = document.getElementById(`pin-${idx + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  // Handle backspace key to move focus back
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace" && pin[idx] === "") {
      const prevInput = document.getElementById(`pin-${idx - 1}`);
      if (prevInput) (prevInput as HTMLInputElement).focus();
    }
  };

  // Handle PIN submission - memoized to prevent infinite re-renders
  const handlePinSubmit = useCallback(() => {
    const fullPin = pin.join('');
    if (fullPin.length !== 4) return;

    setIsLoading(true);

    try {
      // Store the PIN in the signup context
      console.log('Setting PIN in context:', fullPin);
      updateSignupData({ securityPin: fullPin });
      console.log('PIN stored successfully in context');

      // Add a safety timeout to prevent infinite loading
      const navigationTimeout = setTimeout(() => {
        setCurrentStep('confirm-pin');
        router.push('/Signups/Sconfirm');
      }, 1000);

      // Add a safety timeout to reset loading state if navigation fails
      const safetyTimeout = setTimeout(() => {
        if (document.visibilityState !== 'hidden') {
          console.warn('Navigation timeout - resetting loading state');
          setIsLoading(false);
          clearTimeout(navigationTimeout);
        }
      }, 5000);

      // Clean up timeouts if component unmounts
      return () => {
        clearTimeout(navigationTimeout);
        clearTimeout(safetyTimeout);
      };
    } catch (error) {
      console.error('Error handling PIN submission:', error);
      setIsLoading(false);
    }
  }, [pin, updateSignupData, setCurrentStep, router, setIsLoading]);

  // Detect when all 4 digits are entered
  useEffect(() => {
    const fullPin = pin.join('');
    if (fullPin.length === 4) {
      handlePinSubmit();
    }
  }, [pin, handlePinSubmit]);

  return (
    <div className="text-white ml-[100px] mt-[30px]">
      <h2 className="text-[24px] text-[#FCFCFC] font-[700]">Setup security PIN</h2>
      <p className="text-[16px] font-[400] mt-[-10px] mb-6 text-[#8F8F8F]">
        Your PIN helps you log in faster and approve transactions <br /> securely.
      </p>

      <div className="flex gap-1">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-[70px] h-[56px] ml-[10px] rounded-[10px] border-none bg-[#222222] font-[500] text-center text-[14px] text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
            type="password"
            inputMode="numeric"
            autoComplete="one-time-code"
            aria-label={`Digit ${idx + 1} of 4`}
            disabled={isLoading}
            autoFocus={idx === 0}
          />
        ))}
      </div>

      {/* Loader below PIN inputs */}
      {isLoading && (
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
          content: "";
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
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default SecPinBd;
