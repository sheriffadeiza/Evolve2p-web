'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS, API_ENV } from "@/config/api";

const VerifyEmailBody: React.FC = () => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  // Initialize email and send OTP on mount
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      setEmail(userEmail);
      sendOTP(userEmail);
    } else {
      router.push("/Signups/Email");
    }

    // Start resend timer
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
  }, [router]);

  // Send OTP function
  const sendOTP = async (email: string) => {
    setIsLoading(true);
    setError("");

    try {
      console.log(`Sending OTP to ${email} with endpoint: ${API_ENDPOINTS.SEND_OTP}`);
      console.log(`API_BASE_URL: ${API_ENV.apiUrl}`);
      console.log(`Environment: ${API_ENV.isLocal ? 'Development' : 'Production'}`);

      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const urlWithTimestamp = `${API_ENDPOINTS.SEND_OTP}?_=${timestamp}`;

      const response = await fetch(
        urlWithTimestamp,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
          },
          body: JSON.stringify({ email }),
        }
      );

      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, Object.fromEntries([...response.headers.entries()]));

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", contentType);
        const text = await response.text();
        console.error("Response text:", text);

        // Try to parse the response as JSON anyway (sometimes content-type is wrong)
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError);
          throw new Error("Server returned non-JSON response. Please try again later.");
        }
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || data.detail || "Failed to send OTP");
      }

      // If the response includes the OTP code (for development), log it
      if (data.code) {
        console.log(`OTP code for testing: ${data.code}`);
      }
    } catch (err: any) {
      console.error("Send OTP error:", err);
      setError(err.message || "Failed to send verification code");
    } finally {
      setIsLoading(false);
    }
  };

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

  const verifyCode = async (code: string) => {
    setIsLoading(true);
    setError("");

    try {
      console.log(`Verifying code with endpoint: ${API_ENDPOINTS.VERIFY_EMAIL}`);
      console.log(`API_BASE_URL: ${API_ENV.apiUrl}`);
      console.log(`Environment: ${API_ENV.isLocal ? 'Development' : 'Production'}`);

      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const urlWithTimestamp = `${API_ENDPOINTS.VERIFY_EMAIL}?_=${timestamp}`;

      const response = await fetch(
        urlWithTimestamp,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache"
          },
          body: JSON.stringify({
            email: email,
            verificationCode: code,
          }),
        }
      );

      console.log(`Response status: ${response.status}`);
      console.log(`Response headers:`, Object.fromEntries([...response.headers.entries()]));

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Response is not JSON:", contentType);
        const text = await response.text();
        console.error("Response text:", text);

        // Try to parse the response as JSON anyway (sometimes content-type is wrong)
        try {
          return JSON.parse(text);
        } catch (parseError) {
          console.error("Failed to parse response as JSON:", parseError);
          throw new Error("Server returned non-JSON response. Please try again later.");
        }
      }

      const data = await response.json();
      console.log("Response data:", data);

      if (!response.ok) {
        throw new Error(data.message || data.detail || "Verification failed");
      }

      // Store verification status
      localStorage.setItem("email_verified", "true");

      // Show success message
      setError(""); // Clear any previous errors

      // Add a small delay before redirecting
      setTimeout(() => {
        // On success navigate to Profile page (next step)
        router.push("/Signups/Profile");
      }, 1000);
    } catch (err: any) {
      console.error("Verification error:", err);
      setError(err.message || "Invalid verification code. Please try again.");
      setPin(["", "", "", "", "", ""]);
      const firstInput = document.getElementById("pin-0");
      if (firstInput) (firstInput as HTMLInputElement).focus();
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend) return;

    setIsLoading(true);
    setError("");
    setCanResend(false);
    setResendTimer(30);

    try {
      await sendOTP(email);

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
    } catch (err: any) {
      setError(err.message || "Failed to resend verification code");
      setCanResend(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto ml-[70px] mt-10 px-4 text-white">
      <h1 className="text-[24px] text-[#FCFCFC] font-[700] mb-2">Verify Email</h1>
      <p className="text-[16px] font-[400] text-[#8F8F8F] mb-6">
        Please enter the 6-digit code sent to <br />
        <span className="text-[#DBDBDB]">{email || "your email"}</span>
      </p>

      {error && (
        <div className="text-[#F5918A] text-[14px] font-[500] mb-4">{error}</div>
      )}

      <div className="flex gap-[5px] ml-[-80px] border-none justify-center mb-6">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            className="w-[55px] h-[56px] rounded-[10px] border-none bg-[#222222] text-center text-[14px] font-[500] text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#4DF2BE]"
            type="password"
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={isLoading}
          />
        ))}
      </div>

      <div className="text-center text-[14px] font-[400] text-[#DBDBDB] ml-[-15%] mt-[20px]">
        Didn't receive code?{" "}
        <button
          onClick={handleResendCode}
          disabled={!canResend}
          className={`text-[#FFFFFF] w-[149px] h-[40px] text-[14px] ml-[10px] rounded-[100px] bg-[#222222] border-none font-[700] hover:underline ${
            !canResend ? "opacity-50 cursor-not-allowed" : ""
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

export default VerifyEmailBody;
