"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const EmailForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const SEND_OTP_ENDPOINT =
    "https://evolve2p-backend.onrender.com/api/send-otp";

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

      const sendMail = await response.json();

      if (!response.ok || sendMail.error) {
        throw new Error(sendMail?.message || "Failed to send code");
      }

      alert(sendMail?.message);
      router.push("/Signups/VerifyEmail");
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

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    if (error) setError("");
  };

  const handleContinue = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(
        "https://evolve2p-backend.onrender.com/api/check-email-exist",
        {
          body: JSON.stringify({ email }),
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const userExists = await response.json();

      if (userExists?.success) {
        alert("Email already registered.");
        return;
      }

      // ✅ Always save the entered email to localStorage
      localStorage.setItem("UserReg", JSON.stringify({ email }));

      // ✅ Then send OTP
      await sendOTP(email);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pl-[100px] pt-[30px]">
      <div className="flex flex-col gap-2 max-w-md">
        <h1 className="text-[24px] font-[700] text-[#FCFCFC]">
          Create account
        </h1>
        <p className="text-[16px] font-[400] mt-[-10px] text-[#8F8F8F]">
          Enter your email to start trading securely.
        </p>

        <label className="text-[14px] mt-[10px] font-[500] text-[#8F8F8F]">
          Email
        </label>

        <input
          type="email"
          value={email}
          onChange={handleEmailChange}
          placeholder="Enter your email address"
          className="p-3 rounded-[8px] w-[400px] mt-[10px] h-[56px] bg-[#222222] pl-[20px] text-[14px] font-[500] text-[#FCFCFC] border-none focus:outline-none"
        />

        {error && (
          <p className="text-[#F5918A] text-[14px] font-[500] mt-1">{error}</p>
        )}

        <button
          className={`p-3 w-[420px] h-[56px] mt-[8%] bg-[#4DF2BE] text-[#0F1012] rounded-[100px] border border-brand-green ${
            isLoading
              ? "opacity-50 cursor-not-allowed"
              : "cursor-pointer hover:bg-[#3dd9ab]"
          }`}
          onClick={handleContinue}
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Continue"}
        </button>

        <div className="flex flex-col items-center ml-[-20%] gap-4">
          <p className="text-14px font-[400] text-[#DBDBDB]">
            Already have an account?{" "}
            <a
              href="/login"
              className="text-[#FCFCFC] ml-[20px] text-[14px] font-[700] no-underline hover:underline"
            >
              Log in
            </a>
          </p>

          <small className="text-[16px] leading-6 mt-[50px] font-[400] text-[#8F8F8F]">
            By creating an account you are agreeing to <br /> our{" "}
            <a
              href="/terms"
              className="text-[#DBDBDB] ml-[5px] no-underline hover:underline"
            >
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a
              href="/privacy"
              className="text-[#DBDBDB] ml-[5px] no-underline hover:underline"
            >
              Privacy Policy
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default EmailForm;
