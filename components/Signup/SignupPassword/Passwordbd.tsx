'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSignup } from "@/context/SignupContext";
import eyeIcon from "../../../public/Assets/Evolve2p_viewslash/view-off-slash.png";
import checklistInactive from "../../../public/Assets/Evolve2p_checklist2/checklist-inactive.svg";
import checklistActive from "../../../public/Assets/Evolve2p_checklist2/checklist-active.svg";

const Passwordbd = () => {
  const router = useRouter();
  const { updateSignupData, setCurrentStep } = useSignup();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isMounted, setIsMounted] = useState(false);

  // Safely access localStorage after component mounts
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      setUserEmail(localStorage.getItem("userEmail") || "");
    }
  }, []);

  // Validation checks
  const isMinLength = password.length >= 6; // Using 6 characters to match backend setting
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
  const passwordsMatch = password === confirmPassword;

  // Simple check for personal info
  const emailUsername = userEmail ? userEmail.split('@')[0] : "";
  const containsPersonalInfo = emailUsername && password.toLowerCase().includes(emailUsername.toLowerCase());

  const handleSubmit = () => {
    // Validate password rules
    if (!isMinLength || !hasNumber || !hasSpecialChar || !hasUpperLower) {
      setError("Please meet all password requirements");
      return;
    }

    if (containsPersonalInfo) {
      setError("Password should not contain parts of your email address.");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords don't match");
      return;
    }

    // Clear error
    setError("");

    // Save password in signup context
    updateSignupData({ password });

    // Safely use localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("userPassword", password);
    }

    // Move to next step: verify email
    setCurrentStep("verify");
    router.push("/Signups/VerifyEmail");
  };

  return (
    <div className="max-w-md ml-[80px] mx-auto mt-10 px-4 text-white">
      <h1 className="text-[24px] text-[#FCFCFC] font-[700] mb-2">Create password</h1>
      <p className="text-[16px] font-[400] text-[#8F8F8F] whitespace-nowrap">
        Create a strong password to protect your trades and funds.
      </p>

      {error && (
        <div className="text-[#F5918A] text-[14px] font-[500] mt-4 mb-2">{error}</div>
      )}

      <label className="block text-[14px] mt-[30px] font-[500] text-[#8F8F8F] mb-1">Password</label>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            if (error) setError("");
          }}
          className={`w-[380px] h-[56px] mt-[10px] bg-[#222222] text-[#DBDBDB] text-[14px] font-[500] mb-4 pl-[15px] pr-10 focus:outline-none rounded-[10px] border-2 ${
            error && (!isMinLength || !hasNumber || !hasSpecialChar || !hasUpperLower)
              ? "border-[#F5918A]"
              : "border-[#222222]"
          }`}
          placeholder="Enter your password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute border-0 right-2 ml-[-40px] top-[65%] bg-[#222222] -translate-y-1/2 text-[#DBDBDB]"
          aria-label="Toggle password visibility"
        >
          <Image src={eyeIcon} alt="Toggle password visibility" width={20} height={20} />
        </button>
      </div>

      <ul className="text-[14px] font-[400] font-satoshi ml-[-40px] text-[#8F8F8F] mb-6 space-y-[10px]">
        <li className="flex items-center gap-[5px]">
          <Image
            src={isMinLength ? checklistActive : checklistInactive}
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
            src={hasNumber ? checklistActive : checklistInactive}
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
            src={hasSpecialChar ? checklistActive : checklistInactive}
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
            src={hasUpperLower ? checklistActive : checklistInactive}
            alt="check list"
            width={16}
            height={16}
          />
          <span className={`${hasUpperLower ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}`}>
            1 uppercase and 1 lowercase letter
          </span>
        </li>
      
      </ul>

      <label className="block text-[14px] mt-[20px] font-[500] text-[#8F8F8F] mb-1">Confirm password</label>
      <div className="relative inline-block">
        <input
          type={showConfirm ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            if (error) setError("");
          }}
          className={`w-[380px] h-[56px] bg-[#222222] mt-[10px] text-[#DBDBDB] text-[14px] mb-4 pl-[15px] font-[500] pr-10 rounded-[10px] focus:outline-none border-2 ${
            error && !passwordsMatch ? "border-[#F5918A]" : "border-[#222222]"
          }`}
          placeholder="Re-enter your password"
        />
        <button
          type="button"
          onClick={() => setShowConfirm(!showConfirm)}
          className="absolute top-[65%] border-0 right-2 ml-[-40px] bg-[#222222] -translate-y-1/2 text-[#DBDBDB]"
          aria-label="Toggle confirm password visibility"
        >
          <Image src={eyeIcon} alt="Toggle password visibility" width={20} height={20} />
        </button>
      </div>

      <button
        className="w-[370px] h-[56px] border-none cursor-pointer mt-[40px] bg-[#4DF2BE] text-[#0F1012] py-3 rounded-[100px] hover:bg-[#1a5d50]"
        onClick={handleSubmit}
      >
        Continue
      </button>
    </div>
  );
};

export default Passwordbd;
