"use client";

import React, { useState, ClipboardEvent, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";

const Confirmbd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [error, setError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
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
    setError("");

    // Always get the latest accessToken from localStorage right before submitting
    const user = localStorage.getItem("UserData")
      ? JSON.parse(localStorage.getItem("UserData") as string)
      : null;

    const currentPin = localStorage.getItem("currentPin")
      ? JSON.parse(localStorage.getItem("currentPin") as string)
      : null;

    if (!user?.userData?.email) {
      setError("Email is missing. Please complete registration.");
      return;
    }

    if (!user?.accessToken) {
      setError("Session expired. Please log in to generate token.");
      return;
    }

    if (!/^\d{4}$/.test(pinValue)) {
      setError("PIN must be a 4-digit number.");
      return;
    }

    if (!(currentPin?.pin == pinValue)) {
      alert("Pins do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/update-user`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify({ pin: pinValue }),
      });

      const data = await res.json();

      if (data.error) {
        setError(data?.message);
        setIsLoading(false);
        return;
      }

      if (data?.success) {
        localStorage.removeItem("currentPin");
        setShowSuccess(true);
        router.push("/Signups/Sconfirm");
      }
    } catch (err: any) {
      setError("Failed to set PIN");
      setPin(["", "", "", ""]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinue = () => {
    router.push("/Signups/KYC");
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-md mx-auto mt-10 p-4 text-white">
        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="text-white w-[300px] h-[250px] bg-[#222222] p-6 rounded-[10px] text-center z-[100]">
              <h3 className="text-[#4DF2BE] text-[18px] font-bold mb-2">
                Success!
              </h3>
              <p className="mt-[50px] text-[#FCFCFC]">
                PIN confirmed successfully
              </p>
              <button
                onClick={handleContinue}
                className="flex items-center justify-center bg-[#4DF2BE] mt-[50px] border-none w-[250px] h-[30px] text-[16px] transition-colors duration-200 text-black font-semibold py-2 px-4 rounded-full"
              >
                Continue to KYC
              </button>
            </div>
          </div>
        )}

        <h2 className="text-2xl text-[#FCFCFC] font-bold">
          Confirm your PIN
        </h2>
        <p className="text-base font-normal mt-1 mb-6 text-[#8F8F8F]">
          Re-enter your PIN to make sure it's correct.
        </p>

        {error && (
          <div className="text-[#F5918A] text-sm mb-4">{error}</div>
        )}

        <div className="flex gap-2 justify-between">
          {pin.map((digit, idx) => (
            <input
              key={idx}
              id={`pin-${idx}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              onPaste={idx === 0 ? handlePaste : undefined}
              className="w-16 h-14 rounded-lg border-none bg-[#222222] font-medium text-center text-sm text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
              type="password"
              inputMode="numeric"
              disabled={showSuccess}
              autoFocus={idx === 0}
            />
          ))}
        </div>

        {pin.every((d) => d !== "") && (
          <button
            className="w-full h-12 mt-8 bg-[#4DF2BE] text-base text-[#0F1012] rounded-full font-bold disabled:opacity-50 hover:bg-[#3dd0a3] transition-colors"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Setting PIN..." : "Continue"}
          </button>
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

export default Confirmbd;