'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSignup } from '@/context/SignupContext';

const SecPinBd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setCurrentStep } = useSignup();

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

  useEffect(() => {
    const fullPin = pin.join('');
    if (fullPin.length === 4) {
      setIsLoading(true);

      // Add debugging to see what's happening
      console.log('Setting PIN in localStorage:', fullPin);

      // Clear any existing PIN first
      localStorage.removeItem('tempPin');

      // Save temp PIN for confirm step
      localStorage.setItem('tempPin', fullPin);

      // Verify the PIN was stored correctly
      const storedPin = localStorage.getItem('tempPin');
      console.log('Verified PIN in localStorage:', storedPin);

      // Delay navigation to show loader briefly
      setTimeout(() => {
        setCurrentStep('confirm-pin');
        router.push('/Signups/Sconfirm');
      }, 1000);
    }
  }, [pin, router, setCurrentStep]);

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
