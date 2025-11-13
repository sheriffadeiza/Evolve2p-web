"use client";

import React, { useRef, useState, useEffect } from "react";
import Nav from "../NAV/Nav";
import Settings from "../Settings/Settings";
import Lessthan from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import Image from "next/image";
import Footer from "../Footer/Footer";
import { useRouter } from "next/navigation";

const FNewPin: React.FC = () => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [storedPassword, setStoredPassword] = useState<string | null>(null);

  // ✅ Load password from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("reset_password");
      setStoredPassword(saved);
    }
  }, []);

  const handleChange =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const lastChar = val.slice(-1);

      if (!/^\d$/.test(lastChar)) {
        if (val === "") updatePinAt(index, "");
        return;
      }

      updatePinAt(index, lastChar);
      const next = inputsRef.current[index + 1];
      if (next) next.focus();
    };

  const updatePinAt = (index: number, value: string) => {
    setPin((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleKeyDown =
    (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace") {
        if (pin[index]) {
          updatePinAt(index, "");
          return;
        }
        const prev = inputsRef.current[index - 1];
        if (prev) prev.focus();
      }
    };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{4}$/.test(paste)) {
      const arr = paste.split("");
      setPin(arr);
      setTimeout(() => inputsRef.current[3]?.focus(), 0);
    }
    e.preventDefault();
  };

  const allFilled = pin.every((digit) => digit !== "");

  const handleContinue = async () => {
    if (!allFilled || isLoading) return;

    const confirmAction = confirm("Are you sure you want to reset your PIN?");
    if (!confirmAction) return;

    if (!storedPassword) {
      alert("Password not found. Please go back and re-enter your password.");
      router.push("/change-pin/forgotpin");
      return;
    }

    const token = localStorage.getItem("accessToken");
    if (!token) {
      alert("Unauthorized. Please log in again.");
      router.push("/login");
      return;
    }

    const newPin = pin.join("");
    setIsLoading(true);

    try {
      const res = await fetch(
        "https://evolve2p-backend.onrender.com/api/reset-pin",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            password: storedPassword.trim(),
            newPin: newPin.trim(),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Failed to reset PIN. Try again.");
      } else {
        alert(data?.message || "PIN reset successful!");

        // ✅ Remove stored password only after successful reset
        localStorage.removeItem("reset_password");

        router.push("/change-pin/fconfirmpin");
      }
    } catch (error) {
      console.error("Error resetting PIN:", error);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex items-start mt-[20px] mr-[40px]">
          <Settings />

          <div className="w-[809px] h-[784px] bg-[#1A1A1A] rounded-r-[8px] p-[64px] flex flex-col">
            <div
              className="flex items-center gap-[10px] w-[85px] h-[36px] p-[8px-14px] cursor-pointer rounded-full bg-[#2D2D2D]"
              onClick={() => router.push("/change-pin/forgotpin")}
            >
              <Image
                src={Lessthan}
                alt="lessthan"
                width={16}
                height={16}
                className="ml-[10px]"
              />
              <p className="text-[14px] font-[700] text-[#FFFFFF]">Back</p>
            </div>

            <div className="flex flex-col ml-[110px] p-[24px_20px]">
              <p className="text-[24px] font-[700] text-[#FFFFFF]">
                Enter new PIN
              </p>
              <p className="text-[16px] text-[#C7C7C7] font-[400] mt-[8px]">
                Your PIN helps you log in faster and approve
                <br />
                transactions securely.
              </p>

              <div className="flex items-center ml-[35px] gap-[12px] mt-[20px]">
                {[0, 1, 2, 3].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      inputsRef.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={pin[index]}
                    onChange={handleChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    onPaste={handlePaste}
                    className="w-[67.75px] h-[56px] text-center text-[14px] font-[500] text-[#FFFFFF] bg-[#222222] border border-[#2E2E2E] rounded-[12px] focus:outline-none focus:border-[#4DF2BE] caret-transparent"
                  />
                ))}
              </div>

              <button
                onClick={handleContinue}
                disabled={!allFilled || isLoading}
                className={`w-[395px] h-[48px] mt-[40px] border-[1px] bg-[#4DF2BE] border-[#4DF2BE] text-[#0F1012] font-[700] text-[14px] rounded-full transition-all ${
                  !allFilled || isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="loader"></div>
                  </div>
                ) : (
                  "Continue"
                )}

                <style jsx>{`
                  .loader {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: #0f1012;
                    animation: spin 1s ease-in-out infinite;
                  }
                  @keyframes spin {
                    to {
                      transform: rotate(360deg);
                    }
                  }
                `}</style>
              </button>
            </div>
          </div>
        </div>

        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>

        <div className="mb-[80px] mt-[30%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default FNewPin;
