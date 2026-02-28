"use client";

import React, { useState, ClipboardEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";

const SecPinbd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false); // kept for potential future use
  const router = useRouter();

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;

    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    setError("");

    if (val && idx < 3) {
      const nextInput = document.getElementById(`pin-${idx + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  // Handle backspace key for seamless deletion across fields
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === "Backspace") {
      // If current field is empty and it's not the first field, move to previous and clear it
      if (pin[idx] === "" && idx > 0) {
        e.preventDefault(); // Prevent default backspace behaviour
        const newPin = [...pin];
        newPin[idx - 1] = ""; // Clear previous field
        setPin(newPin);
        // Focus previous input
        const prevInput = document.getElementById(`pin-${idx - 1}`);
        if (prevInput) (prevInput as HTMLInputElement).focus();
      }
    }
  };

  // Handle paste event: fill all four inputs if pasted content is 4 digits
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();
    if (/^\d{4}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setPin(digits);
      setError("");
      // Focus the last input after paste
      const lastInput = document.getElementById("pin-3");
      if (lastInput) (lastInput as HTMLInputElement).focus();
    } else {
      setError("Please paste a valid 4-digit PIN");
    }
  };

  const handleSubmit = async () => {
    const pinValue = pin.join("");
    localStorage.setItem("currentPin", JSON.stringify({ pin: pinValue }));
    router.push("/Signups/Sconfirm");
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md mx-auto mt-10 p-4 text-white">
        <h2 className="text-2xl text-[#FCFCFC] font-bold">
          Setup security PIN
        </h2>
        <p className="text-base font-normal mt-1 mb-6 text-[#8F8F8F]">
          Your PIN helps you log in faster and approve transactions securely.
        </p>

        <div className="flex gap-2 justify-between">
          {pin.map((digit, idx) => (
            <input
              key={idx}
              id={`pin-${idx}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={idx === 0 ? handlePaste : undefined} // only first input handles paste
              className="w-16 h-14 rounded-lg border-none bg-[#222222] font-medium text-center text-sm text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
              type="password"
              inputMode="numeric"
              disabled={isLoading}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {error && (
          <div className="text-[#F5918A] text-sm font-medium mt-4">
            {error}
          </div>
        )}

        {pin.every((d) => d !== "") && (
          <button
            className="w-full h-12 mt-8 bg-[#4DF2BE] text-base text-[#0F1012] rounded-full font-bold disabled:opacity-50 hover:bg-[#3dd0a3] transition-colors"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Setting PIN..." : "Continue"}
          </button>
        )}

        {isLoading && (
          <div className="flex justify-center mt-6">
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
    </div>
  );
};

export default SecPinbd;