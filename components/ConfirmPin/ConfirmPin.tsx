"use client";

import React, { useRef, useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Lessthan from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import Image from "next/image";
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation";
import Modalc from "../../public/Assets/Evolve2p_modalC/elements.png";

const CHECK_PIN_ENDPOINT =
  "https://evolve2p-backend.onrender.com/api/check-pin"; // ✅ make sure this is the correct endpoint

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
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8 relative">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex items-start mt-[20px] mr-[40px]">
          <Settings />

          <div className="w-[809px] h-[784px] bg-[#1A1A1A] rounded-r-[8px] p-[64px] flex flex-col">
            {/* Back Button */}
            <div
              onClick={() => router.push("/change-pin/newpin")}
              className="flex items-center gap-[10px] w-[85px] h-[36px] px-[14px] cursor-pointer rounded-full bg-[#2D2D2D] hover:opacity-80 transition-all"
            >
              <Image
                src={Lessthan}
                alt="lessthan"
                width={16}
                height={16}
                className="ml-[6px]"
              />
              <p className="text-[14px] font-[700] text-[#FFFFFF]">Back</p>
            </div>

            <div className="flex flex-col ml-[110px] p-[24px_20px]">
              <p className="text-[24px] font-[700] text-[#FFFFFF]">
                Confirm your PIN
              </p>
              <p className="text-[16px] text-[#C7C7C7] font-[400] mt-[8px]">
                Re-enter your PIN to make sure it’s correct.
              </p>

              {/* PIN Input Boxes */}
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

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!allFilled || isLoading}
                className={`w-[395px] h-[48px] mt-[40px] border-[1px] bg-[#4DF2BE] border-[#4DF2BE]  text-[#0F1012] font-[700] text-[14px] rounded-full transition-all ${
                  !allFilled || isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : ""
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
                    border-top-color: #0F1012;
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

        {/* Divider */}
          <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] mt-[10%] ">
                  <Footer />
                </div>
      </div>

      {/* 🟢 Success Modal */}
      {showModal && (
        <div className="fixed top-[200px] ml-[40%] inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="w-[420px] h-[336px] bg-[#0F1012] rounded-[12px] flex flex-col items-center justify-center border border-[#2D2D2D] text-center px-6">
            <Image
              src={Modalc}
              alt="Success"
              width={64}
              height={64}
              className="mb-6"
            />
            <h2 className="text-[20px] font-[700] text-[#FFFFFF]">
             Transaction PIN Updated!
            </h2>
            <p className="text-[16px] font-[400] text-[#C7C7C7] mt-[8px]">
            Your Transaction PIN has been set successfully!
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="mt-[30px] w-[260px] h-[48px] border-none bg-[#2D2D2D] text-[#FFFFFF] rounded-full font-[700] text-[14px] hover:bg-[#333333] transition-all"
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
