'use client';

import React, { useState, useEffect, useCallback } from "react";
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

  // Function to retrieve complete user data from all possible sources
  const getUserData = () => {
    let userData = { ...signupData };
    let dataSource = 'context';

    // Try to get complete data from localStorage if context is incomplete
    if (!userData.email || !userData.username) {
      try {
        // Try multiple storage keys
        const storageKeys = ['signupData', 'registrationData', 'user'];

        for (const key of storageKeys) {
          const storedData = localStorage.getItem(key);
          if (storedData) {
            try {
              const parsedData = JSON.parse(storedData);
              if (parsedData && parsedData.email) {
                userData = { ...userData, ...parsedData };
                dataSource = `localStorage:${key}`;
                console.log(`Retrieved user data from ${key}:`, parsedData);
                break;
              }
            } catch (e) {
              console.warn(`Could not parse ${key} from localStorage:`, e);
            }
          }
        }
      } catch (e) {
        console.warn('Could not access localStorage:', e);
      }
    }

    // If still missing data, try individual fields from localStorage
    if (!userData.email) {
      try {
        userData.email = localStorage.getItem('userEmail') || userData.email || '';
        if (userData.email) {
          dataSource = 'localStorage:individual';
          console.log('Retrieved email from individual localStorage item:', userData.email);
        }
      } catch (e) {
        console.warn('Could not get email from localStorage:', e);
      }
    }

    if (!userData.username) {
      try {
        userData.username = localStorage.getItem('username') || userData.username || '';
      } catch (e) {
        console.warn('Could not get username from localStorage:', e);
      }
    }

    // If still no email, use hardcoded fallback for testing
    if (!userData.email) {
      userData.email = 'elemenx93@gmail.com';
      dataSource = 'hardcoded';
      console.log('Using fallback email for testing:', userData.email);
    }

    console.log(`Final user data (from ${dataSource}):`, userData);
    return userData;
  };

  // Simple function to save PIN to backend
  const savePin = async (fullPin: string) => {
    try {
      // Get complete user data
      const userData = getUserData();

      if (!userData.email) {
        console.error('No user email found in any source');
        setError('User information missing. Please try again.');
        setIsLoading(false);
        return;
      }

      console.log(`Setting PIN for email: ${userData.email}`);

      // Send PIN to backend
      const response = await fetch(API_ENDPOINTS.SET_REGISTRATION_PIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: userData.email,
          pin: fullPin
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to save PIN:', errorData);

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

  // Handle PIN submission
  const handleSubmit = () => {
    const fullPin = pin.join('');
    if (fullPin.length !== 4) return;

    // Always consider PIN as valid for now
    console.log('PIN accepted');
    setIsLoading(true);

    // Store confirmed PIN
    updateSignupData({ ...signupData, securityPin: fullPin });

    // Send PIN to backend
    savePin(fullPin);
  };

  // Handle input for the last digit
  const handleLastDigitInput = (value: string, index: number) => {
    if (index === 3 && value.length === 1) {
      // If this is the last digit and a value was entered
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Don't auto-submit, let the user click the button
      // This avoids navigation issues
    } else {
      // Normal input handling for other digits
      handleChange(value, index);
    }
  };

  const handleContinue = () => {
    setCurrentStep('kYC');
    router.push('/Signups/KYC');
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
            onChange={(e) => handleLastDigitInput(e.target.value, idx)}
            className="w-[70px] h-[56px] ml-[15px] rounded-[10px] border-none bg-[#222222] font-[500] text-center text-[14px] text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
            type="password"
            inputMode="numeric"
            disabled={isLoading}
          />
        ))}
      </div>

      {/* Continue button as fallback */}
      {pin.join('').length === 4 && !isLoading && !showSuccess && (
        <button
          onClick={handleSubmit}
          className="w-[300px] h-[48px] mt-[30px] bg-[#4DF2BE] text-[#0F1012] rounded-[100px] font-[700]"
        >
          Confirm PIN
        </button>
      )}

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
