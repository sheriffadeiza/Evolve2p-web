"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const SecPinbd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);
  const router = useRouter();

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;

    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);

    const nextInput = document.getElementById(`pin-${idx + 1}`);
    if (val && nextInput) (nextInput as HTMLInputElement).focus();
  };

  const handleSubmit = async () => {
    const pinValue = pin.join("");
    localStorage.setItem("currentPin", JSON.stringify({ pin: pinValue }));
    router.push("/Signups/Sconfirm");
  };

  return (
    <div className="text-white ml-[95px] mt-[30px]">
      <h2 className="text-[24px] text-[#FCFCFC] font-[700]">
        Setup security PIN
      </h2>
      <p className="text-[16px] font-[400] mt-[-10px] mb-6 text-[#8F8F8F]">
        Your PIN helps you log in faster and approve transactions <br />{" "}
        securely.
      </p>

      <div className="flex gap-1 ml-[20px]">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            className="w-[70px] h-[56px] ml-[10px] rounded-[10px] border-none bg-[#222222] font-[500] text-center text-[14px] text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
            type="password"
            inputMode="numeric"
            disabled={isLoading}
            autoFocus={idx === 0}
          />
        ))}
      </div>

      {error && (
        <div className="text-[#F5918A] text-[14px] font-[500] mt-4">
          {error}
        </div>
      )}

      {pin.join("").length === 4 && (
        <button
          className="w-[300px] h-[48px] ml-[55px] border-none mt-[30px] bg-[#4DF2BE] text-[16px] text-[#0F1012] rounded-[100px] font-[700] disabled:opacity-50"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? "Setting PIN..." : "Continue"}
        </button>
      )}

      {isLoading && (
        <div className="flex justify-center mt-[30px] ml-[-40px]">
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

export default SecPinbd;
