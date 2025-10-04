"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

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
      const res = await fetch(
        "https://evolve2p-backend.onrender.com/api/update-user",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user?.accessToken}`,
          },
          body: JSON.stringify({ pin: pinValue }),
        }
      );

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
    <div className="w-full lg:mx-auto">
      <div className="text-whitemt-[30px]  lg:max-w-md mx-auto p-8 max-w-sm">
        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-[#3e3e3e] ml-[25%] h- bg-opacity-70 flex items-center justify-center z-50">
            <div className=" text-white w-[450px] h-[250px] p-6 rounded-[10px] text-center  z-[100]">
              <h3 className="text-[#4DF2BE] text-[18px] font-bold mb-2">
                Success!
              </h3>
              <p className="mt-[50px] text-[#FCFCFC]">
                PIN confirmed successfully
              </p>
              <button
                onClick={handleContinue}
                className="bg-[#4DF2BE] border-none w-[250px] h-[30px]  text-[16px]  mt-[30px] transition-colors duration-200 text-black font-semibold py-2 px-4 rounded-full"
              >
                Continue to KYC
              </button>
            </div>
          </div>
        )}
        <div className="w-full">
          <h2 className="text-[24px] text-[#FCFCFC] font-[700]">
            Confirm your PIN
          </h2>
          <p className="text-[16px] font-[400] mt-[4px] mb-6 text-[#8F8F8F]">
            Re-enter your PIN to make sure it's correct.
          </p>

          {error && (
            <div className="text-[#F5918A] text-[14px] mb-4 w-[350px]">
              {error}
            </div>
          )}

          <div className="flex gap-1">
            {pin.map((digit, idx) => (
              <input
                key={idx}
                id={`pin-${idx}`}
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, idx)}
                className="w-full lg:w-[70px] h-[56px] lg:ml-[15px] rounded-[10px] border-none bg-[#222222] font-[500] text-center text-[14px] text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
                type="password"
                inputMode="numeric"
                disabled={showSuccess}
              />
            ))}
          </div>

          {pin.join("").length === 4 && (
            <button
              className="w-full lg:w-[300px] h-[48px] mt-[30px] lg:ml-[50px] text-[16px] border-none bg-[#4DF2BE] text-[#0F1012] rounded-[100px] font-[700] disabled:opacity-50"
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
    </div>
  );
};

export default Confirmbd;
