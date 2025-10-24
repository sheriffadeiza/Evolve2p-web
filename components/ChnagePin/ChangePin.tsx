"use client";

import React, { useRef, useState } from "react";
import Nav from "../../components/NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation";

const UpdatePin: React.FC = () => {
  const router = useRouter();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (!/^[0-9]*$/.test(value)) return; // Only allow numbers

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !e.currentTarget.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleContinue = () => {
    setIsLoading(true);
    // Simulate an async action before routing
    setTimeout(() => {
      router.push("/change-pin/newpin");
      setIsLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navbar */}
        <Nav />

        <div className="flex items-start mt-[20px] mr-[40px]">
          {/* Settings Sidebar */}
          <Settings />

          {/* Right Side */}
          <div className="w-[809px] h-[784px] bg-[#1A1A1A] rounded-r-[8px] p-[64px] flex flex-col">
            <p className="text-[24px] font-[700] text-[#FFFFFF]">
              Update Security PIN
            </p>

            <div className="flex flex-col ml-[110px] p-[24px_20px]">
              <p className="text-[20px] font-[700] text-[#FFFFFF]">
                Enter Current PIN
              </p>
              <p className="text-[16px] text-[#C7C7C7] font-[400] mt-[8px]">
                For security reasons, enter your current PIN before
                <br />
                setting a new one.
              </p>

              {/* PIN Input Boxes */}
              <div className="flex items-center ml-[35px] gap-[12px] mt-[20px]">
                {[1, 2, 3, 4].map((_, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    onChange={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-[67.75px] h-[56px] p-[8px] text-center text-[18px] font-[700] text-[#FFFFFF] bg-[#222222] border border-[#2E2E2E] rounded-[12px] focus:outline-none focus:border-[#4DF2BE]"
                  />
                ))}
              </div>

              {/* Forget PIN */}
              <div
                onClick={() => router.push("/change-pin/forgotpin")}
                className="mt-[20px] text-[#FFFFFF] ml-[200px] text-[14px] font-[700] hover:underline cursor-pointer"
              >
                Forget PIN
              </div>

              {/* Continue Button with Loader */}
              <button
                onClick={handleContinue}
                disabled={isLoading}
                className="w-[395px] h-[48px] mt-[40px] border-[1px] bg-[#4DF2BE] border-[#4DF2BE] ml-[38px] p-[12px_20px] text-[#0F1012] font-[700] text-[14px] rounded-full hover:opacity-90 transition-all flex items-center justify-center"
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
                    border: 3px solid rgba(0, 0, 0, 0.2);
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
        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>

        {/* Footer */}
        <div className="mb-[80px] mt-[30%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default UpdatePin;
