'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type SignupStep = 'email' | 'password' | 'verify' | 'profile' | 'secpin' | 'confirm';

interface SignupData {
  email: string;
  username: string;
  password: string;
  country: string;
  phone: string;
  verified?: boolean;
  securityPin?: string;
}

interface SignupContextType {
  currentStep: SignupStep;
  setCurrentStep: (step: SignupStep) => void;
  signupData: SignupData;
  updateSignupData: (data: Partial<SignupData>) => void;
}

const defaultSignupData: SignupData = {
  email: '',
  username: '',
  password: '',
  country: '',
  phone: '',
  verified: false,
  securityPin: ''
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<SignupStep>('email');
  const [signupData, setSignupData] = useState<SignupData>(defaultSignupData);

  useEffect(() => {
    try {
      // Try to load complete signup data from localStorage
      const storageKeys = ['signupData', 'registrationData', 'user'];
      let loadedData = null;

      // Try each storage key
      for (const key of storageKeys) {
        try {
          const storedData = localStorage.getItem(key);
          if (storedData) {
            const parsedData = JSON.parse(storedData);
            if (parsedData && parsedData.email) {
              loadedData = parsedData;
              console.log(`Loaded signup data from localStorage key '${key}':`, parsedData);
              break;
            }
          }
        } catch (e) {
          console.warn(`Error parsing data from localStorage key '${key}':`, e);
        }
      }

      // If complete data wasn't found, try individual fields
      if (!loadedData) {
        const email = localStorage.getItem('userEmail') || '';
        const username = localStorage.getItem('username') || '';
        const password = localStorage.getItem('password') || '';
        const country = localStorage.getItem('country') || '';
        const phone = localStorage.getItem('phone') || '';
        const securityPin = localStorage.getItem('tempPin') || '';

        if (email || username || password) {
          loadedData = {
            email,
            username,
            password,
            country,
            phone,
            securityPin,
            verified: false
          };
          console.log('Loaded signup data from individual localStorage items:', loadedData);
        }
      }

      // Update state with loaded data
      if (loadedData) {
        setSignupData(prev => ({
          ...prev,
          ...loadedData
        }));
      }
    } catch (e) {
      console.warn('Error loading signup data from localStorage:', e);
    }
  }, []);

  const updateSignupData = (data: Partial<SignupData>) => {
    // Update state
    setSignupData(prev => {
      const newData = {
        ...prev,
        ...data
      };

      // Also save to localStorage
      try {
        // Save complete data
        localStorage.setItem('signupData', JSON.stringify(newData));

        // Also save individual fields for backward compatibility
        if (data.email) localStorage.setItem('userEmail', data.email);
        if (data.username) localStorage.setItem('username', data.username);
        if (data.password) localStorage.setItem('password', data.password);
        if (data.country) localStorage.setItem('country', data.country);
        if (data.phone) localStorage.setItem('phone', data.phone);
        if (data.securityPin) localStorage.setItem('tempPin', data.securityPin);

        console.log('Saved updated signup data to localStorage:', newData);
      } catch (e) {
        console.warn('Could not save signup data to localStorage:', e);
      }

      return newData;
    });
  };

  return (
    <SignupContext.Provider value={{ currentStep, setCurrentStep, signupData, updateSignupData }}>
      {children}
    </SignupContext.Provider>
  );
}

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
};

export default SignupContext;
