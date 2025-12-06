"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "../../components/NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Lessthan from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import Image from "next/image";
import Footer from "../../components/Footer/Footer";
import Modalc from "../../public/Assets/Evolve2p_modalC/elements.png";

const FConfirmPin: React.FC = () => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const [showModal, setShowModal] = useState(false);

  // Proper ref callback function
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputsRef.current[index] = el;
  };

  const updatePinAt = (index: number, value: string) => {
    setPin((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const lastChar = val.slice(-1);
    if (!/^\d$/.test(lastChar)) {
      if (val === "") updatePinAt(index, "");
      return;
    }
    updatePinAt(index, lastChar);
    inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (pin[index]) updatePinAt(index, "");
      else inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").trim();
    if (/^\d{4}$/.test(paste)) {
      setPin(paste.split(""));
      setTimeout(() => inputsRef.current[3]?.focus(), 0);
    }
    e.preventDefault();
  };

  const allFilled = pin.every((digit) => digit !== "");

  // ✅ Just verify client-side
  const handleContinue = () => {
    if (!allFilled) return;

    const confirmAction = confirm("Do you want to confirm this PIN?");
    if (!confirmAction) return;

    // PINs match: show success modal
    setShowModal(true);
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
              onClick={() => router.push("/change-pin/fnewpin")}
              className="flex items-center gap-2 w-fit px-4 h-9 cursor-pointer rounded-full bg-[#2D2D2D] hover:bg-[#3A3A3A] transition-colors mb-6 lg:mb-8"
            >
              <Image src={Lessthan} alt="back" width={16} height={16} />
              <p className="text-sm font-semibold text-white">Back</p>
            </div>

            {/* Main Form */}
            <div className="flex flex-col items-center lg:items-start max-w-lg mx-auto lg:mx-0">
              <p className="text-xl lg:text-2xl font-bold text-white text-center lg:text-left">
                Confirm your PIN
              </p>
              <p className="text-sm lg:text-base text-[#C7C7C7] font-normal mt-2 text-center lg:text-left">
                Re-enter your PIN to make sure it's correct.
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
                disabled={!allFilled}
                className={`w-full max-w-xs lg:max-w-sm h-12 mt-6 lg:mt-8 border border-[#4DF2BE] bg-[#4DF2BE] text-[#0F1012] font-semibold text-sm lg:text-base rounded-full transition-all hover:bg-[#3fe0ad] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4DF2BE]`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>

         <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] mt-[10%] ">
                  <Footer />
                </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-[#0F1012] rounded-xl p-6 lg:p-8 w-full max-w-md text-center border border-[#2D2D2D]">
            <Image 
              src={Modalc} 
              alt="Success" 
              className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4" 
            />
            <h2 className="text-lg lg:text-xl font-bold text-white mb-3">
              PIN Confirmed
            </h2>
            <p className="text-sm lg:text-base text-[#C7C7C7] font-normal leading-relaxed mb-6">
              Your new security PIN has been verified. You can now use it to access and authorize transactions.
            </p>
            <button
              onClick={() => router.push("/profile")}
              className="w-full max-w-xs h-12 border-none bg-[#2D2D2D] text-white font-semibold rounded-full hover:bg-[#3A3A3A] transition-colors text-sm lg:text-base"
            >
              Back to Profile
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default FConfirmPin;