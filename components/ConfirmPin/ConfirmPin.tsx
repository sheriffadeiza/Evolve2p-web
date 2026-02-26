"use client";

import React, { useRef, useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Lessthan from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import Image from "next/image";
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation";
import Modalc from "../../public/Assets/Evolve2p_modalC/elements.png";
import { API_BASE_URL } from "@/config";

const CHECK_PIN_ENDPOINT =
  `${API_BASE_URL}/api/check-pin`;

const ConfirmPin: React.FC = () => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  // ✅ Load user email from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("UserData");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserEmail(parsed?.userData?.email || "");
      } else {
        alert("Session expired. Please log in again.");
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to load user email:", err);
    }
  }, [router]);

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
    if (!allFilled || isLoading || !userEmail) return;

    const enteredPin = pin.join("");
    setIsLoading(true);

    try {
      const res = await fetch(CHECK_PIN_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: userEmail, pin: enteredPin }),
      });

      const data = await res.json();
      console.log("Check-pin response:", data);

      if (!res.ok || !data?.success) {
        const message =
          typeof data?.message === "string"
            ? data.message
            : data?.message
            ? JSON.stringify(data.message)
            : "PIN verification failed. Try again.";
        alert(message);
        setPin(["", "", "", ""]);
      } else {
        setShowModal(true);
      }
    } catch (err) {
      console.error("Error checking PIN:", err);
      alert("An unexpected error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="px-4 py-6 sm:px-6 md:px-8 lg:max-w-7xl lg:mx-auto">
        <Nav />

        <div className="flex flex-col lg:flex-row items-start gap-6 mt-6 lg:mt-8">
          {/* Settings Sidebar - Full width on mobile, auto width on desktop */}
          <div className="w-full lg:w-auto">
            <Settings />
          </div>

          {/* Main Content Area */}
          <div className="w-full bg-[#1A1A1A] rounded-lg lg:rounded-r-[8px] p-6 md:p-8 lg:p-16 flex flex-col">
            {/* Back Button */}
            <div
              onClick={() => router.push("/change-pin/newpin")}
              className="flex items-center justify-center lg:justify-start gap-2 w-full lg:w-[85px] h-10 lg:h-[36px] px-4 lg:px-[14px] cursor-pointer rounded-full bg-[#2D2D2D] hover:opacity-80 transition-all mb-6 lg:mb-0"
            >
              <Image
                src={Lessthan}
                alt="lessthan"
                width={16}
                height={16}
                className="lg:ml-[6px]"
              />
              <p className="text-sm font-bold text-[#FFFFFF]">Back</p>
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-full max-w-lg mx-auto lg:mx-0 lg:ml-[110px] p-4 md:p-6 mt-4 lg:mt-0">
              <h1 className="text-xl md:text-2xl font-bold text-[#FFFFFF] mb-2">
                Confirm your PIN
              </h1>
              <p className="text-sm md:text-base text-[#C7C7C7] font-normal mb-6 md:mb-8">
                Re-enter your PIN to make sure it&apos;s correct.
              </p>

              {/* PIN Input Boxes */}
              <div className="flex justify-center lg:justify-start items-center gap-3 md:gap-4 mb-6 md:mb-8">
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
                    className="w-16 h-14 md:w-20 md:h-16 lg:w-[67.75px] lg:h-[56px] text-center text-lg md:text-xl font-medium text-[#FFFFFF] bg-[#222222] border border-[#2E2E2E] rounded-lg md:rounded-xl lg:rounded-[12px] focus:outline-none focus:border-[#4DF2BE] caret-transparent"
                  />
                ))}
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!allFilled || isLoading}
                className={`w-full max-w-sm mx-auto lg:mx-0 lg:w-[395px] h-12 md:h-[48px] border border-[#4DF2BE] bg-[#4DF2BE] text-[#0F1012] font-bold text-sm rounded-full transition-all ${
                  !allFilled || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90"
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="loader"></div>
                    <span>Verifying...</span>
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

        {/* Footer Divider */}
         <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] whitespace-nowrap mt-[10%] ">
                  <Footer />
                </div>
      </div>

      {/* 🟢 Success Modal - Responsive */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md bg-[#0F1012] rounded-xl md:rounded-[12px] flex flex-col items-center justify-center border border-[#2D2D2D] text-center p-6 md:p-8">
            <Image
              src={Modalc}
              alt="Success"
              width={64}
              height={64}
              className="mb-4 md:mb-6 w-12 h-12 md:w-16 md:h-16"
            />
            <h2 className="text-lg md:text-xl font-bold text-white mb-2">
              Transaction PIN Updated!
            </h2>
            <p className="text-sm md:text-base text-[#C7C7C7] mb-6 md:mb-8">
              Your Transaction PIN has been set successfully!
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="w-full max-w-xs h-12 md:h-[48px] border-none bg-[#2D2D2D] text-white rounded-full font-bold text-sm md:text-base hover:bg-[#333333] transition-all"
            >
              Back to Profile
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ConfirmPin;