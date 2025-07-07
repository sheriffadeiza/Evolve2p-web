'use client';

import React, { useState } from "react";
import { useRouter } from 'next/navigation';
import { useSignup } from '@/context/SignupContext';

const SecPinbd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();
  const { setCurrentStep } = useSignup();

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;

    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);

    const nextInput = document.getElementById(`pin-${idx + 1}`);
    if (val && nextInput) (nextInput as HTMLInputElement).focus();
  };

  const handleSubmit = async () => {
    const pinValue = pin.join('');
    setError('');

    // Always get the latest accessToken from localStorage right before submitting
    const latestToken = localStorage.getItem('accessToken') || '';

    // Get email from userProfile in localStorage
    const userProfile = localStorage.getItem('userProfile');
    let email = '';
    if (userProfile) {
      try {
        email = JSON.parse(userProfile).email || '';
      } catch {
        email = '';
      }
    }
    if (!email) {
      setError('Email is missing. Please complete registration.');
      return;
    }

    if (!latestToken) {
      setError('Session expired. Please log in to generate token.');
      return;
    }

    if (!/^\d{4}$/.test(pinValue)) {
      setError('PIN must be a 4-digit number.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(
        'https://evolve2p-backend.onrender.com/api/update-user',
        {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${latestToken}`,
          },
          body: JSON.stringify({ pin: pinValue }),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.detail || data.message || 'Failed to update PIN. Please try again.');
        setIsLoading(false);
        return;
      }

      // Optionally update localStorage with new pin, and keep the token as is
      let updatedProfile = {};
      if (userProfile) {
        try {
          updatedProfile = { ...JSON.parse(userProfile), pin: pinValue };
        } catch {
          updatedProfile = { pin: pinValue };
        }
      } else {
        updatedProfile = { pin: pinValue };
      }
      localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

      setCurrentStep('confirm-pin');
      router.push('/Signups/Sconfirm');
    } catch (err: any) {
      setError("Failed to set PIN");
      setPin(["", "", "", ""]);
    } finally {
      setIsLoading(false);
    }
  };

  // --- Delete Account Handler ---
  const handleDeleteAccount = async () => {
    const userProfile = localStorage.getItem('userProfile');
    let email = '';
    if (userProfile) {
      try {
        email = JSON.parse(userProfile).email || '';
      } catch {
        email = '';
      }
    }
    const accessToken = localStorage.getItem('accessToken') || '';
    if (!email) {
      alert('No user email found.');
      return;
    }
    if (!accessToken) {
      alert('You are not authorized. Please log in again.');
      router.push('/Logins/login');
      return;
    }
    if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    setDeleteLoading(true);
    try {
      const res = await fetch('https://evolve2p-backend.onrender.com/api/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify({}), // If your backend expects an empty object
      });
      if (res.ok) {
        localStorage.clear();
        alert('Account deleted successfully.');
        router.push('/Logins/login');
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete account.');
      }
    } catch (err) {
      alert('Error deleting account.');
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <div className="text-white ml-[95px] mt-[30px]">
      <h2 className="text-[24px] text-[#FCFCFC] font-[700]">Setup security PIN</h2>
      <p className="text-[16px] font-[400] mt-[-10px] mb-6 text-[#8F8F8F]">
        Your PIN helps you log in faster and approve transactions <br /> securely.
      </p>

      <div className="flex gap-1 ml-[20px]">
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
            autoFocus={idx === 0}
          />
        ))}
      </div>

      {error && (
        <div className="text-[#F5918A] text-[14px] font-[500] mt-4">{error}</div>
      )}

      {pin.join('').length === 4 && (
        <button
          className="w-[300px] h-[48px] mt-[30px] bg-[#4DF2BE] text-[#0F1012] rounded-[100px] font-[700] disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? 'Setting PIN...' : 'Continue'}
        </button>
      )}

      {isLoading && (
        <div className="flex justify-center mt-[30px] ml-[-40px]">
          <div className="loader"></div>
        </div>
      )}

      {/* Delete Account Button */}
      <div className="mt-[30px] text-center">
        <button
          onClick={handleDeleteAccount}
          className="px-6 py-2 bg-[#000] text-[#fff] rounded-full hover:bg-red-700 transition"
          disabled={deleteLoading}
        >
          {deleteLoading ? 'Deleting...' : 'Delete Account'}
        </button>
      </div>

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

export default SecPinbd;