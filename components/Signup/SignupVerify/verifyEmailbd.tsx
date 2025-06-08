'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const VERIFY_EMAIL_ENDPOINT = "https://evolve2p-backend.onrender.com/api/verify-email";
const SEND_OTP_ENDPOINT = "https://evolve2p-backend.onrender.com/api/send-otp";

const VerifyEmailbd: React.FC = () => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // On mount: get email and send OTP
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setEmail(userEmail);
      sendOTP(userEmail);
    } else {
      router.push("/Signups/Email");
    }
    // eslint-disable-next-line
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

  // Send or Resend OTP
  const sendOTP = async (email: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch(SEND_OTP_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        let msg =
          typeof data.message === "string"
            ? data.message
            : typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data);
        throw new Error(msg || "Failed to send code");
      }
    } catch (err: any) {
      setError(
        typeof err.message === "string"
          ? err.message
          : JSON.stringify(err.message) || "Failed to send code"
      );
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

    if (newPin.every((d) => d !== "")) {
      verifyCode(newPin.join(""));
    }
  };

  // Verify OTP
  const verifyCode = async (code: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(VERIFY_EMAIL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: email,
          otp_code: code,
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        let msg = "Verification failed";
        if (Array.isArray(data.detail) && data.detail.length > 0 && data.detail[0].msg) {
          msg = data.detail[0].msg;
        } else if (typeof data.message === "string") {
          msg = data.message;
        } else if (typeof data.detail === "string") {
          msg = data.detail;
        } else {
          msg = JSON.stringify(data);
        }
        throw new Error(msg);
      }

      localStorage.setItem("email_verified", "true");
      setError("");
      setTimeout(() => {
        router.push("/Signups/Profile");
      }, 1000);
    } catch (err: any) {
      let msg = "Invalid verification code. Please try again.";
      if (err?.message) {
        msg = typeof err.message === "string" ? err.message : JSON.stringify(err.message);
      }
      setError(msg);
      setPin(["", "", "", "", "", ""]);
      const firstInput = document.getElementById("pin-0");
      if (firstInput) (firstInput as HTMLInputElement).focus();
    } finally {
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

  return (
    <div className="max-w-md mx-auto ml-[120px] mt-10 px-4 text-white">
      <h1 className="text-[24px] text-[#FCFCFC] font-[700] mb-2">Verify Email</h1>
      <p className="text-[16px] font-[400] text-[#8F8F8F] mb-6">
        Please enter the 6-digit code sent to <br />
        <span className="text-[#DBDBDB]">{email || "your email"}</span>
      </p>

      {error && (
        <div className="text-[#F5918A] text-[14px] font-[500] mb-4">{error}</div>
      )}

      <div className="flex gap-[5px] ml-[-150px] border-none justify-center mb-6">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            maxLength={1}
            value={pin[idx]}
            onChange={(e) => handleChange(e.target.value, idx)}
            className="w-[55px] h-[56px] rounded-[10px] border-none bg-[#222222] text-center text-[14px] font-[500] text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#4DF2BE]"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={isLoading}
          />
        ))}
      </div>

      <div className="text-center text-[14px] font-[400] text-[#DBDBDB] ml-[-25%] mt-[20px]">
        Didn't receive code?{" "}
        <button
          onClick={handleResendCode}
          disabled={!canResend || isLoading}
          className={`text-[#FFFFFF] w-[149px] h-[40px] text-[14px] ml-[10px] rounded-[100px] bg-[#222222] border-none font-[700] hover:underline ${
            !canResend || isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {canResend ? "Resend code" : `Resend code ${resendTimer}s`}
        </button>
      </div>

      {isLoading && (
        <div className="fixed inset-0 flex ml-[15%] mt-[30px] items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="loader"></div>
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
              border-top-color: #4df2be;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default VerifyEmailbd;