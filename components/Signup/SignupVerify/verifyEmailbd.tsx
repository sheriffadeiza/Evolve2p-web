"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SEND_OTP_ENDPOINT = "https://evolve2p-backend.onrender.com/api/send-otp";
const VERIFY_EMAIL_ENDPOINT =
  "https://evolve2p-backend.onrender.com/api/verify-email";

const VerifyEmailbd: React.FC = () => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // ✅ On mount: get email from localStorage (UserReg) and send OTP
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("UserReg");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.email) {
            setEmail(parsed.email);
            sendOTP(parsed.email);
          } else {
            router.push("/Signups/Email");
          }
        } catch {
          router.push("/Signups/Email");
        }
      } else {
        router.push("/Signups/Email");
      }
    }
  }, [router]);

  // Timer for resend button
  useEffect(() => {
    if (!canResend && resendTimer > 0) {
      const timer = setInterval(() => {
        setResendTimer((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [canResend, resendTimer]);

  // Send OTP
  const sendOTP = async (email: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(SEND_OTP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email }),
      });

      await response.json();

      if (!response.ok) {
        throw new Error("Failed to send code");
      }
    } catch (err: any) {
      setError(err?.message || "Failed to send code");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle PIN input
  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;

    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    setError("");

    if (val && idx < 5) {
      const nextInput = document.getElementById(`pin-${idx + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  // Verify code
  const verifyCode = async (code: string) => {
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      const response = await fetch(VERIFY_EMAIL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email, otp: code }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const msg =
          data?.message || data?.detail || "Verification failed. Try again.";
        setError(msg);
        setPin(["", "", "", "", "", ""]);
        document.getElementById("pin-0")?.focus();
        setIsLoading(false);
        return;
      }

      // ✅ Success → mark verified in localStorage
      const currentLocalData = localStorage.getItem("UserReg")
        ? JSON.parse(localStorage.getItem("UserReg") as string)
        : {};
      localStorage.setItem(
        "UserReg",
        JSON.stringify({ ...currentLocalData, isEmailVerified: true })
      );

      setError("");
      setSuccess(true);
      setIsLoading(false);
      setTimeout(() => {
        router.push("/Signups/Password");
      }, 1000);
    } catch (err: any) {
      setError(err?.message || "Invalid verification code.");
      setPin(["", "", "", "", "", ""]);
      document.getElementById("pin-0")?.focus();
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendCode = async () => {
    if (!canResend) return;
    setIsLoading(true);
    setError("");
    setCanResend(false);
    setResendTimer(30);

    await sendOTP(email);
  };

  const isPinComplete = pin.every((d) => d !== "");

  return (
    <div className="w-full lg:mx-0  flex justify-center">
      <div className="lg:max-w-md max-w-sm  p-4 mx-auto lg:ml-[120px] mt-10 lg:px-4 text-white">
        <h1 className="text-[24px] text-[#FCFCFC] font-[700] mb-2">
          Verify Email
        </h1>
        <p className="text-[16px] font-[400] text-[#8F8F8F] mb-6">
          Please enter the 6-digit code sent to <br />
          <span className="text-[#DBDBDB]">{email || "your email"}</span>
        </p>

        {error && (
          <div className="text-[#F5918A] text-[14px] font-[500] mb-4">
            {error}
          </div>
        )}

        {success && (
          <div className="text-[#1ECB84] text-[14px] font-[500] mb-4">
            Email verified successfully! Redirecting...
          </div>
        )}

        <div className="flex gap-[5px] lg:ml-[-150px] justify-center mb-6">
          {pin.map((digit, idx) => (
            <input
              key={idx}
              id={`pin-${idx}`}
              maxLength={1}
              value={pin[idx]}
              onChange={(e) => handleChange(e.target.value, idx)}
              className=" w-full lg:w-[55px] h-[56px] rounded-[10px] border-none bg-[#222222] text-center text-[14px] font-[500] text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#4DF2BE] "
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={isLoading}
            />
          ))}
        </div>

        {isPinComplete && (
          <button
            className=" w-full lg:w-[300px] h-[48px] mt-[10px] lg:ml-[-10px] bg-[#4DF2BE] border-none text-[#0F1012] rounded-[100px] font-[700] disabled:opacity-50 "
            onClick={() => verifyCode(pin.join(""))}
            disabled={isLoading}
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        )}

        <div className="text-center text-[14px] font-[400] text-[#DBDBDB] lg:ml-[-5%] mt-[20px] ">
          Didn't receive code?{" "}
          <button
            onClick={handleResendCode}
            disabled={!canResend || isLoading}
            className={`text-[#FFFFFF] w-[149px] h-[40px] text-[14px] ml-[30px] rounded-[100px] bg-[#222222] border-none font-[700] hover:underline ${
              !canResend || isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {canResend ? "Resend code" : `Resend code ${resendTimer}s`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailbd;
