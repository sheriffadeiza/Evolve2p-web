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
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [storedPassword, setStoredPassword] = useState<string | null>(null);

  // ✅ Load password from localStorage after component mounts
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("reset_password");
      setStoredPassword(saved);
    }
  }, []);

  // Proper ref callback function
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputsRef.current[index] = el;
  };

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
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Nav />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Settings Sidebar */}
          <div className="lg:w-64">
            <Settings />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#1A1A1A] rounded-xl p-4 lg:p-8">
            {/* Back Button */}
            <div
              className="flex items-center gap-2 w-fit px-4 h-9 cursor-pointer rounded-full bg-[#2D2D2D] hover:bg-[#3A3A3A] transition-colors mb-6 lg:mb-8"
              onClick={() => router.push("/change-pin/forgotpin")}
            >
              <Image
                src={Lessthan}
                alt="back"
                width={16}
                height={16}
              />
              <p className="text-sm font-semibold text-white">Back</p>
            </div>

            {/* Main Content */}
            <div className="flex flex-col items-center lg:items-start max-w-lg mx-auto lg:mx-0">
              <p className="text-xl lg:text-2xl font-bold text-white text-center lg:text-left">
                Enter new PIN
              </p>
              <p className="text-sm lg:text-base text-[#C7C7C7] font-normal mt-2 text-center lg:text-left leading-relaxed">
                Your PIN helps you log in faster and approve transactions securely.
              </p>

              {/* PIN Input Boxes */}
              <div className="flex justify-center lg:justify-start gap-3 lg:gap-4 mt-6 lg:mt-8">
                {[0, 1, 2, 3].map((_, index) => (
                  <input
                    key={index}
                    ref={setInputRef(index)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={pin[index]}
                    onChange={handleChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    onPaste={handlePaste}
                    className="w-14 h-14 lg:w-16 lg:h-16 text-center text-base lg:text-lg font-medium text-white bg-[#222222] border border-[#2E2E2E] rounded-lg focus:outline-none focus:border-[#4DF2BE] caret-transparent transition-colors"
                  />
                ))}
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!allFilled || isLoading}
                className={`w-full max-w-xs lg:max-w-sm h-12 mt-6 lg:mt-8 border border-[#4DF2BE] bg-[#4DF2BE] text-[#0F1012] font-semibold text-sm lg:text-base rounded-full transition-all hover:bg-[#3fe0ad] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4DF2BE]`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#0F1012] border-t-transparent rounded-full animate-spin"></div>
                    Resetting...
                  </div>
                ) : (
                  "Continue"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-white/20 my-8"></div>

        <div className="mb-16 mt-8">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default FNewPin;