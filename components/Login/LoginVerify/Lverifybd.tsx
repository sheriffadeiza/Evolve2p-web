"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Lverifybd: React.FC = () => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const email =
    typeof window !== "undefined"
      ? localStorage.getItem("reset_email") || ""
      : "";

  const handleChange = (val: string, idx: number) => {
    if (!/^\d*$/.test(val)) return; // Only allow digits
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);

    if (val && idx < 5) {
      const nextInput = document.getElementById(`pin-${idx + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const code = pin.join("");
      const res = await fetch(
        "https://evolve2p-backend.onrender.com/api/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: email,
            otp: code,
          }),
        }
      );
      const data = await res.json();

      if (!res.ok) {
        setError(
          data.detail ||
            data.message ||
            "Verification failed. Please try again."
        );
        setIsLoading(false);
        return;
      }

      setShowModal(true);
      setTimeout(() => {
        setShowModal(false);
        router.push("/Logins/Lpass");
      }, 1500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendLoading(true);
    try {
      const otpRes = await fetch(
        "https://evolve2p-backend.onrender.com/api/send-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );
      const otpData = await otpRes.json();
      if (!otpRes.ok) {
        setError(
          otpData.detail ||
            otpData.message ||
            "Failed to resend code. Please try again."
        );
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  const allFilled = pin.every((digit) => digit.length === 1);

  return (
    <div className="max-w-md mx-auto  text-center mt-4 px-4 text-white  mb-6">
      <h1 className="text-[24px] ml-[-15%] text-[#FCFCFC] font-[700] mb-2">
        Verify Email
      </h1>
      <p className="text-[16px] ml-[-8%]  font-[400] text-[#8F8F8F] mb-6">
        Please enter the 6-digit code sent to <br />
        <span className="text-[#DBDBDB] ml-[20px] ">{email}</span>
      </p>

      <form onSubmit={handleVerify}>
        <div className="flex gap-[10px]   justify-center mb-6 ">
          {pin.map((digit, idx) => (
            <input
              key={idx}
              id={`pin-${idx}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              className="w-[100%] h-[56px] rounded-[10px] border-none bg-[#222222] text-center text-xl text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
              type="password"
              disabled={isLoading}
              autoComplete="one-time-code"
            />
          ))}
        </div>

        {error && (
          <div className="text-[#F5918A] text-[14px] font-[500] mb-2">
            {error}
          </div>
        )}

        {allFilled && (
          <button
            type="submit"
            disabled={isLoading}
            className="w-[380px] h-[56px] py-2 mt-[20px] ml-[10%] border-none justify-center rounded-[100px] text-[14px] font-[700] bg-[#4DF2BE] text-[#0F1012] hover:opacity-90"
          >
            {isLoading ? "Verifying email..." : "Verify Email"}
          </button>
        )}
      </form>

      <div className="text-center text-[14px] font-[400] text-[#DBDBDB] ml-[10%] mt-[20px]">
        Didn't receive code?{" "}
        <button
          className="text-[#FFFFFF] w-[149px] h-[40px] text-[14px] ml-[10px] rounded-[100px] bg-[#222222] border-none font-[700] hover:underline"
          disabled={isLoading || resendLoading}
          type="button"
          onClick={handleResend}
        >
          {resendLoading ? "Sending..." : "Resend code"}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 flex ml-[14%] md:mt-[-8%] w-[70%] mt-[14%] items-center justify-center  bg-opacity-60 z-50 xl:mt-[40%%]">
          <div className="bg-[#1F1F1F] rounded-lg p-8 shadow-lg text-center flex flex-col items-center justify-center border-2">
            <h2 className="text-[#1ECB84] text-[20px] font-[700] mb-2">
              Email Verified!
            </h2>
            <p className="text-[#DBDBDB] text-[16px]">Redirecting...</p>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 flex ml-[55%] mt-[30px] items-center justify-center bg-black bg-opacity-50 z-50">
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

export default Lverifybd;
