"use client";

import React, { useState } from "react";
import Image from "next/image";
import Nav from "../../components/NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation";
import ViewSlash from "../../public/Assets/Evolve2p_viewslash/view-off-slash.png";
import Lessthan from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";

const ForgotPin: React.FC = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleContinue = async () => {
    if (!password) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/change-pin/newpin"); // proceed to the "Enter new pin" page
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Navbar */}
        <Nav />

        <div className="flex items-start mt-[20px] mr-[40px]">
          {/* Settings Sidebar */}
          <Settings />

          {/* Right Section */}
          <div className="w-[809px] h-[784px] bg-[#1A1A1A] rounded-r-[8px] p-[64px] flex flex-col">
            {/* Back Button */}
            <div
              onClick={() => router.push("/change-pin")}
              className="flex items-center gap-[10px] w-[85px] h-[36px] px-[14px] cursor-pointer rounded-full bg-[#2D2D2D] hover:opacity-80 transition-all"
            >
              <Image
                src={Lessthan}
                alt="back"
                width={16}
                height={16}
                className="ml-[6px]"
              />
              <p className="text-[14px] font-[700] text-[#FFFFFF]">Back</p>
            </div>

            {/* Main Form */}
            <div className="flex flex-col ml-[110px] mt-[40px]">
              <p className="text-[24px] font-[700] text-[#FFFFFF]">
                Reset Security PIN
              </p>
              <p className="text-[16px] font-[400] text-[#C7C7C7] mt-[8px] leading-[24px]">
                For your security, please enter your account <br /> password to
                reset your PIN.
              </p>

              {/* Password Input */}
              <div className="relative mt-[30px] w-[395px]">
                <label className="text-[14px] font-[500] text-[#C7C7C7]">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-[380px] h-[56px] mt-[10px] bg-[#222222] text-[#DBDBDB] text-[14px] font-[500] pl-[15px] pr-10 rounded-[10px] border-2 border-[#222222] focus:outline-none focus:border-[#4DF2BE]"
                    placeholder="Enter your password"
                  />
                
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-[58%] border-0 right-2 ml-[90%] bg-[#222222] -translate-y-1/2 text-[#DBDBDB]"
                  disabled={isLoading}
                  >
                    <Image
                      src={ViewSlash}
                      alt="Toggle password visibility"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>   //
              </div>

              {/* Forgot Password */}
              <p
                onClick={() => router.push("/forgot-password")}
                className="text-[14px] font-[700] ml-[46%] text-[#FFFFFF] mt-[20px] cursor-pointer hover:underline mt-[10px]"
              >
                Forgot password?
              </p>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!password || isLoading}
                className={`w-[395px] h-[48px] mt-[40px] bg-[#4DF2BE] text-[#0F1012] font-[700] text-[14px] rounded-full border border-[#4DF2BE] transition-all ${
                  !password || isLoading
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
        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>

        <div className="mb-[80px] mt-[30%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default ForgotPin;
