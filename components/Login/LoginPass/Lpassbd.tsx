'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import image from '../../../public/Assets/Evolve2p_viewslash/view-off-slash.png';
import schecklistInactive from '../../../public/Assets/Evolve2p_checklist2/checklist-inactive.svg';
import schecklistActive from '../../../public/Assets/Evolve2p_checklist2/checklist-active.svg';
import ModalC from '../../../public/Assets/Evolve2p_modalC/elements.png';
import { useRouter } from 'next/navigation';

const Lpassbd = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Validation Checks
  const isMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
  const passwordsMatch = password === confirmPassword;

  const allFieldsValid = () => {
    return isMinLength && hasNumber && hasSpecialChar && hasUpperLower && passwordsMatch;
  };

  const handleSubmit = async () => {
    if (!isMinLength || !hasNumber || !hasSpecialChar || !hasUpperLower) {
      setError("Please meet all password requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      // Get email from localStorage for forgot password endpoint
      const email = typeof window !== 'undefined' ? localStorage.getItem('reset_email') || '' : '';

      if (!email) {
        setError("No email found for password reset. Please start the reset process again.");
        setIsLoading(false);
        return;
      }

      // Use forgot-password endpoint with email and password
      const updateBody = {
        email,
        password,
      };

      const res = await fetch('https://evolve2p-backend.onrender.com/api/forgot-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateBody),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.message || 'Failed to update password. Please try again.');
        setIsLoading(false);
        return;
      }

      setShowSuccessModal(true);

      // Update userProfile in localStorage with new password
      const userProfile = localStorage.getItem('userProfile');
      if (userProfile) {
        try {
          const parsed = JSON.parse(userProfile);
          parsed.password = password;
          localStorage.setItem('userProfile', JSON.stringify(parsed));
        } catch {
          localStorage.setItem('userProfile', JSON.stringify({ password }));
        }
      } else {
        localStorage.setItem('userProfile', JSON.stringify({ password }));
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToLogin = () => {
    router.push("/Logins/login");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (error) setError("");
  };

  return (
    <div className="flex flex-col text-center items-center justify-center max-w-md ml-[80px] mx-auto mt-10 px-4 text-white">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-[#0F1012] p-8 rounded-[10px] w-[375px] h-[300px] flex flex-col items-center justify-center">
            <Image src={ModalC} alt="Success Icon" width={58.001} height={58} />
            <h2 className="text-[20px] text-[#FCFCFC] font-[700] mb-2">Password Changed</h2>
            <p className="text-[16px] font-[400] text-[#8F8F8F] mb-6 text-center">
              Your password has been successfully updated. You can now log in with your new password.
            </p>
            <button
              onClick={handleGoToLogin}
              className="w-[356px] h-[48px] bg-[#4DF2BE] mt-[30px] text-[14px] text-[#0F1012] border-none font-[700] py-3 rounded-[100px] hover:bg-[#3dd9ab] transition"
            >
              Go to log in
            </button>
          </div>
        </div>
      )}

      <h1 className="text-[24px] ml-[-20%] text-[#FCFCFC] font-[700]">Create new password</h1>
      <p className="text-[16px] font-[400] mt-[-10px] ml-[-25px] text-[#8F8F8F] whitespace-nowrap">
        Create a strong password to protect your trades and funds.
      </p>

      {error && (
        <div className="text-[#FCFCFC] text-[20px] font-[700] mt-4 mb-2">
          {error}
        </div>
      )}

      <label className="block text-[14px] ml-[-30.5%] mt-[30px] font-[500] text-[#8F8F8F] mb-[10px]">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={handlePasswordChange}
          className={`w-[380px] h-[56px] bg-[#222222] text-[#DBDBDB] text-[14px] font-[500] border mb-4 pl-[15px] pr-10 rounded-[10px] ${
            error && (!isMinLength || !hasNumber || !hasSpecialChar || !hasUpperLower)
              ? "border-[#F5918A]"
              : "border-[#2E2E2E]"
          }`}
          placeholder="Enter your password"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute border-0 right-2 ml-[-40px] top-[55%] bg-[#222222] -translate-y-1/2 text-[#DBDBDB]"
          disabled={isLoading}
        >
          <Image 
            src={image} 
            alt="Toggle password visibility" 
            width={20} 
            height={20}
          />
        </button>
      </div>

      <ul className="text-[14px] font-[400] font-satoshi ml-[-20%] text-[#8F8F8F] mb-6 space-y-[10px]">
        <li className="flex items-center gap-[5px]">
          <Image
            src={isMinLength ? schecklistActive : schecklistInactive} 
            alt="check list" 
            width={16} 
            height={16} 
          />
          <span className={`${isMinLength ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}`}>
            Minimum 6 characters
          </span>
        </li>
        <li className="flex items-center gap-[5px]">
          <Image
            src={hasNumber ? schecklistActive : schecklistInactive} 
            alt="check list" 
            width={16} 
            height={16} 
          />
          <span className={`${hasNumber ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}`}>
            At least 1 number
          </span>
        </li>
        <li className="flex items-center gap-[5px]">
          <Image
            src={hasSpecialChar ? schecklistActive : schecklistInactive}
            alt="check list"
            width={16}
            height={16}
          />
          <span className={`${hasSpecialChar ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}`}>
            At least 1 special character
          </span>
        </li>
        <li className="flex items-center gap-[5px]">
          <Image
            src={hasUpperLower ? schecklistActive : schecklistInactive}
            alt="check list"
            width={16}
            height={16}
          />
          <span className={`${hasUpperLower ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}`}>
            1 uppercase and 1 lowercase letter
          </span>
        </li>
      </ul>

      <label className="block text-[14px] mt-[10px] font-[500] ml-[-26.5%] text-[#8F8F8F] mb-[10px]">Confirm password</label>
      <div className="relative inline-block">
        <input
          type={showConfirm ? "text" : "password"}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          className={`w-[380px] h-[56px] bg-[#222222] text-[#DBDBDB] text-[14px] font-[500] border text-white mb-4 pl-[15px] pr-10 rounded-[10px] ${
            error && !passwordsMatch ? "border-[#F5918A]" : "border-[#2E2E2E]"
          }`}
          placeholder="Re-enter your password"
          disabled={isLoading}
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute top-[55%] border-0 right-2 ml-[-40px] bg-[#222222] -translate-y-1/2 text-[#DBDBDB]"
          disabled={isLoading}
        >
          <Image src={image} alt="Toggle password visibility" width={20} height={20} />
        </button>
      </div>

      <button 
        className={`w-[400px] h-[56px] border-none mt-[40px] bg-[#4DF2BE] text-[#0F1012] py-3 rounded-[100px] hover:bg-[#1a5d50] transition ${
          !allFieldsValid() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        onClick={handleSubmit}
        disabled={!allFieldsValid() || isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="loader"></div>
          </div>
        ) : 'Continue'}
        
        <style jsx>{`
          .loader {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #0F1012;
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </button>
    </div>
  );
};

export default Lpassbd;