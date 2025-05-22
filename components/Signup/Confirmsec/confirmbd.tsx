'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useSignup } from '@/context/SignupContext';
import { API_ENDPOINTS } from '@/config/api';

const ConfirmPinBd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const router = useRouter();
  const { setCurrentStep, signupData, updateSignupData } = useSignup();

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;

    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    setError("");

    if (val && idx < 3) {
      const nextInput = document.getElementById(`pin-${idx + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  useEffect(() => {
    const fullPin = pin.join('');
    if (fullPin.length !== 4) return;

    try {
      // Get the original PIN from various storage options
      let originalPin = '';

      try {
        // Try localStorage first
        originalPin = localStorage.getItem('tempPin') || '';
        console.log('Retrieved PIN from localStorage:', originalPin);
      } catch (e) {
        console.warn('Could not access localStorage:', e);

        try {
          // Try sessionStorage as fallback
          originalPin = sessionStorage.getItem('tempPin') || '';
          console.log('Retrieved PIN from sessionStorage:', originalPin);
        } catch (e2) {
          console.warn('Could not access sessionStorage:', e2);

          // Try global variable as last resort
          if ((window as any).tempPin) {
            originalPin = (window as any).tempPin;
            console.log('Retrieved PIN from window.tempPin:', originalPin);
          } else {
            console.warn('No PIN found in any storage');
          }
        }
      }

      console.log('Entered PIN:', fullPin);
      console.log('Original PIN from storage:', originalPin);

      // Normalize both PINs to ensure consistent comparison
      const normalizedEnteredPin = fullPin.trim();
      const normalizedOriginalPin = originalPin.trim();

      console.log('Normalized entered PIN:', normalizedEnteredPin);
      console.log('Normalized original PIN:', normalizedOriginalPin);

      // If we couldn't retrieve a PIN or it doesn't match
      if (!normalizedOriginalPin || normalizedEnteredPin !== normalizedOriginalPin) {
        console.log('PINs do not match');
        setError("PINs don't match. Please try again.");
        setPin(["", "", "", ""]);
        const firstInput = document.getElementById('pin-0');
        if (firstInput) (firstInput as HTMLInputElement).focus();
        return;
      }

      console.log('PINs match successfully');
    } catch (error) {
      console.error('Error comparing PINs:', error);
      setError("An error occurred. Please try again.");
      return;
    }

    setIsLoading(true);

    // Store confirmed PIN
    updateSignupData({ ...signupData, securityPin: fullPin });
    localStorage.setItem('userPin', fullPin);
    localStorage.removeItem('tempPin');

    // Send PIN to backend
    const savePin = async () => {
      try {
        // Get user email from localStorage or signup context
        const userEmail = localStorage.getItem('userEmail') || signupData.email;
        if (!userEmail) {
          console.error('No user email found');
          setError('User information missing. Please try again.');
          setIsLoading(false);
          return;
        }

        console.log(`Setting PIN for email: ${userEmail}`);
        console.log(`Using endpoint: ${API_ENDPOINTS.SET_REGISTRATION_PIN}`);

        // Send PIN to backend using the registration endpoint (no auth required)
        const response = await fetch(API_ENDPOINTS.SET_REGISTRATION_PIN, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: userEmail,
            pin: fullPin
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error('Failed to save PIN:', errorData);

          // Handle specific error cases
          if (response.status === 404) {
            setError('User not found. Please complete registration first.');
          } else {
            setError('Failed to save PIN. Please try again.');
          }

          setIsLoading(false);
          return;
        }

        // Show success message
        setShowSuccess(true);
        setIsLoading(false);
      } catch (error) {
        console.error('Error saving PIN:', error);
        setError('An error occurred. Please try again.');
        setIsLoading(false);
      }
    };

    savePin();
  }, [pin, signupData, updateSignupData]);

  const handleContinue = () => {
    setCurrentStep('kyc');
    router.push('/Signups/Kyc');
  };

  return (
    <div className="text-white ml-[100px] mt-[30px]">
      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 bg-[#333333] bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-black text-white w-[250px] p-6 rounded-[10px] text-center shadow-lg">
            <h3 className="text-[#4DF2BE] text-[18px] font-bold mb-2">Success!</h3>
            <p className="mb-4 text-[#FCFCFC]">PIN created successfully</p>
            <button
              onClick={handleContinue}
              className="bg-[#1ECB84] hover:bg-[#19b97a] transition-colors duration-200 text-black font-semibold py-2 px-4 rounded w-full"
            >
              Continue to KYC
            </button>
          </div>
        </div>
      )}

      <h2 className="text-[24px] text-[#FCFCFC] font-[700]">Confirm your PIN</h2>
      <p className="text-[16px] font-[400] mt-[-10px] mb-6 text-[#8F8F8F]">
        Re-enter your PIN to make sure it's correct.
      </p>

      {error && (
        <div className="text-[#F5918A] text-[14px] mb-4 w-[350px]">
          {error}
        </div>
      )}

      <div className="flex gap-1">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            className="w-[70px] h-[56px] ml-[10px] rounded-[10px] border-none bg-[#222222] font-[500] text-center text-[14px] text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
            type="password"
            inputMode="numeric"
            disabled={isLoading}
          />
        ))}
      </div>

      {/* Loader */}
      {isLoading && !showSuccess && (
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

export default ConfirmPinBd;
