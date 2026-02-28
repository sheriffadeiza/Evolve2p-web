"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import eyeIcon from "../../../public/Assets/Evolve2p_viewslash/view-off-slash.png";
import checklistInactive from "../../../public/Assets/Evolve2p_checklist2/checklist-inactive.svg";
import checklistActive from "../../../public/Assets/Evolve2p_checklist2/checklist-active.svg";

const Passwordbd = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<any>(null);

  // Safely read localStorage on the client only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("UserReg");
      if (stored) {
        try {
          setCurrentUserData(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse UserReg", e);
        }
      }
    }
  }, []);

  // Validation checks
  const isMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
  const passwordsMatch = password === confirmPassword;

  const handleContinue = async () => {
    if (!currentUserData?.email) {
      setError("Email is missing. Please go back and enter your email.");
      return;
    }
    if (!isMinLength || !hasNumber || !hasSpecialChar || !hasUpperLower) {
      setError("Please meet all password requirements");
      return;
    }
    if (!passwordsMatch) {
      setError("Passwords don't match");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(
          "UserReg",
          JSON.stringify({ ...currentUserData, password })
        );
      }
      router.push("/Signups/Profile");
    } catch (err: any) {
      setError(
        typeof err?.message === "string"
          ? err.message
          : JSON.stringify(err?.message || "Something went wrong")
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md mx-auto mt-10 p-4 text-white">
        <h1 className="text-2xl text-[#FCFCFC] font-bold mb-2">
          Create password
        </h1>
        <p className="text-base font-normal text-[#8F8F8F]">
          Create a strong password to protect your trades and funds.
        </p>

        {error && (
          <div className="text-[#F5918A] text-sm font-medium mt-4 mb-2">
            {error}
          </div>
        )}

        <label className="block text-sm font-medium text-[#8F8F8F] mt-6 mb-1">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError("");
            }}
            className={`w-full h-14 bg-[#222222] text-[#DBDBDB] text-sm font-medium pl-4 pr-12 rounded-lg border-2 focus:outline-none ${
              error &&
              (!isMinLength || !hasNumber || !hasSpecialChar || !hasUpperLower)
                ? "border-[#F5918A]"
                : "border-[#222222] focus:border-[#4DF2BE]"
            }`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#DBDBDB]"
            aria-label="Toggle password visibility"
          >
            <Image src={eyeIcon} alt="" width={20} height={20} />
          </button>
        </div>

        <ul className="w-full text-sm font-normal text-[#8F8F8F] mt-4 mb-6 space-y-2 pl-0">
          <li className="flex items-center gap-2">
            <Image
              src={isMinLength ? checklistActive : checklistInactive}
              alt=""
              width={16}
              height={16}
            />
            <span className={isMinLength ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}>
              Minimum 6 characters
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Image
              src={hasNumber ? checklistActive : checklistInactive}
              alt=""
              width={16}
              height={16}
            />
            <span className={hasNumber ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}>
              At least 1 number
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Image
              src={hasSpecialChar ? checklistActive : checklistInactive}
              alt=""
              width={16}
              height={16}
            />
            <span
              className={hasSpecialChar ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}
            >
              At least 1 special character
            </span>
          </li>
          <li className="flex items-center gap-2">
            <Image
              src={hasUpperLower ? checklistActive : checklistInactive}
              alt=""
              width={16}
              height={16}
            />
            <span
              className={hasUpperLower ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}
            >
              1 uppercase and 1 lowercase letter
            </span>
          </li>
        </ul>

        <label className="block text-sm font-medium text-[#8F8F8F] mb-1">
          Confirm password
        </label>
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (error) setError("");
            }}
            className={`w-full h-14 bg-[#222222] text-[#DBDBDB] text-sm font-medium pl-4 pr-12 rounded-lg border-2 focus:outline-none ${
              error && !passwordsMatch
                ? "border-[#F5918A]"
                : "border-[#222222] focus:border-[#4DF2BE]"
            }`}
            placeholder="Re-enter your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-[#DBDBDB]"
            aria-label="Toggle confirm password visibility"
          >
            <Image src={eyeIcon} alt="" width={20} height={20} />
          </button>
        </div>

        <button
          className="w-full h-14 mt-8 bg-[#4DF2BE] text-[#0F1012] font-bold rounded-full hover:bg-[#3dd0a3] disabled:opacity-50 transition-colors"
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default Passwordbd;