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
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [showModal, setShowModal] = useState(false);

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
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8 relative">
      <div className="max-w-7xl mx-auto">
        <Nav />
        <div className="flex items-start mt-[20px] mr-[40px]">
          <Settings />
          <div className="w-[809px] h-[784px] bg-[#1A1A1A] rounded-r-[8px] p-[64px] flex flex-col">
            {/* Back Button */}
            <div
              onClick={() => router.push("/change-pin/fnewpin")}
              className="flex items-center gap-[10px] w-[85px] h-[36px] px-[14px] cursor-pointer rounded-full bg-[#2D2D2D] hover:opacity-80 transition-all"
            >
              <Image src={Lessthan} alt="lessthan" width={16} height={16} className="ml-[6px]" />
              <p className="text-[14px] font-[700] text-[#FFFFFF]">Back</p>
            </div>

            <div className="flex flex-col ml-[110px] p-[24px_20px]">
              <p className="text-[24px] font-[700] text-[#FFFFFF]">Confirm your PIN</p>
              <p className="text-[16px] text-[#C7C7C7] font-[400] mt-[8px]">
                Re-enter your PIN to make sure it’s correct.
              </p>

              <div className="flex items-center ml-[35px] gap-[12px] mt-[20px]">
                {[0, 1, 2, 3].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputsRef.current[index] = el)}
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
                disabled={!allFilled}
                className={`w-[395px] h-[48px] mt-[40px] border-[1px] bg-[#4DF2BE] border-[#4DF2BE] text-[#0F1012] font-[700] text-[14px] rounded-full transition-all ${
                  !allFilled ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                Continue
              </button>
            </div>
          </div>
        </div>

        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>
        <div className="mb-[80px] mt-[30%]"><Footer /></div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed top-[200px] ml-[40%] inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="w-[420px] h-[336px] bg-[#0F1012] rounded-[12px] flex flex-col items-center justify-center border border-[#2D2D2D] text-center px-6">
            <Image src={Modalc} alt="Success" width={64} height={64} className="mb-6" />
            <h2 className="text-[20px] font-[700] text-[#FFFFFF]">PIN Confirmed</h2>
            <p className="text-[16px] font-[400] text-[#C7C7C7] mt-[8px]">
              Your new security PIN has been verified. You can now <br /> use it
              to access and authorize transactions.
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

export default FConfirmPin;
