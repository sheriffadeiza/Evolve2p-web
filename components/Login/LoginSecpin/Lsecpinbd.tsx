"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const CHECK_PIN_ENDPOINT =
  "https://evolve2p-backend.onrender.com/api/check-pin";

const Lsecpinbd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [userData, setUserData] = useState<{
    accessToken: string;
    userData: any;
  } | null>(null);

  const router = useRouter();

  // ✅ Load UserData from localStorage on client-side
  useEffect(() => {
    try {
      const stored = localStorage.getItem("UserData");
      if (stored) {
        setUserData(JSON.parse(stored));
      } else {
        setError("Please login first");
        setTimeout(() => router.push("/Logins/login"), 1500);
      }
    } catch {
      setError("Failed to read user data");
    }
  }, [router]);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    setError("");

    // Focus next input
    if (val && idx < 3) {
      document.getElementById(`pin-${idx + 1}`)?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !pin[idx] && idx > 0) {
      document.getElementById(`pin-${idx - 1}`)?.focus();
    }
  };

  const handleSubmit = async () => {
    setError("");
    setSuccess("");
    const tempPin = pin.join("");
    if (tempPin.length !== 4) {
      setError("Please enter your 4-digit PIN");
      return;
    }

    if (!userData?.accessToken) {
      setError("Session expired. Please login again.");
      setTimeout(() => router.push("/Logins/login"), 1500);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(CHECK_PIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.accessToken}`,
        },
        body: JSON.stringify({
          email: userData.userData?.email,
          pin: tempPin,
        }),
      });

      const data = await response.json();

      if (!data?.success) {
        setError(data?.message || "Invalid PIN");
        setPin(["", "", "", ""]);
        return;
      }

      setSuccess("PIN verified!");
      setTimeout(() => router.push("/Loader"), 1000);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isPinComplete = pin.every((digit) => digit !== "");

  return (
    <div className="text-white space-y-[20px] px-4 sm:px-6 md:ml-[95px] md:mt-[30px] w-full max-w-md mx-auto md:mx-0 md:max-w-none">
      <h2 className="text-[20px] sm:text-[22px] md:text-[24px] text-[#FCFCFC] font-[700] text-center md:text-left">
        Enter security PIN
      </h2>
      <p className="text-[14px]  sm:text-[15px] md:text-[16px] font-[400] mt-[10px] md:mt-[-10px] mb-6 text-[#8F8F8F] text-center md:text-left">
        Your PIN helps you log in faster and approve transactions <br className="hidden md:block" />{" "}
        securely.
      </p>

      {error && (
        <div className="p-3 md:p-4 mb-4 text-[#F5918A] bg-[#332222] rounded w-full md:w-[90%] border border-[#553333]">
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {success && (
        <div className="p-3 mb-4 text-[#4DF2BE] bg-[#223322] rounded w-full md:w-[90%]">
          <p className="text-sm md:text-base">{success}</p>
        </div>
      )}

      <div className="flex justify-center md:justify-start items-center gap-2 sm:gap-3 md:gap-2">
        {[0, 1, 2, 3].map((idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            maxLength={1}
            value={pin[idx]}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="w-16 h-14 sm:w-18 sm:h-15 md:w-[83.5px] md:h-[56px] md:ml-[15px] rounded-[8px] sm:rounded-[9px] md:rounded-[10px] border-none bg-[#222222] text-center text-lg sm:text-xl md:text-xl text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#1ECB84] transition-all"
            type="password"
            disabled={loading}
            autoFocus={idx === 0}
          />
        ))}
      </div>

      {isPinComplete && (
        <button
          className="w-full max-w-[280px] sm:w-[300px] h-12 sm:h-[48px] mx-auto md:ml-[12%] md:mr-0 mt-6 sm:mt-[30px] border-none bg-[#4DF2BE] text-[#0F1012] rounded-[100px] font-[700] disabled:opacity-50 hover:opacity-90 transition-opacity block"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Continue"}
        </button>
      )}

      <div
        className="text-[13px] sm:text-[14px] mt-12 sm:mt-[70px] text-center md:text-center md:ml-[-23%] font-[700] text-[#FCFCFC] hover:underline cursor-pointer"
        onClick={() => alert("Forgot PIN functionality coming soon")}
      >
        Forgot PIN
      </div>

      {loading && (
        <div className="flex justify-center mt-6 sm:mt-[30px] md:ml-[-40px]">
          <div className="loader"></div>
        </div>
      )}

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
  );
};

export default Lsecpinbd;