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
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = () => {
    router.push("/reset-password");
  };

  const handleContinue = async () => {
    if (!password) return alert("Please enter your password before continuing.");

    try {
      // ✅ Save password in localStorage
      localStorage.setItem("reset_password", password);
    } catch (error) {
      console.error("Error saving password:", error);
      alert("Unable to save password. Please try again.");
      return;
    }

    setIsLoading(true);

    // Delay for smoother UX and ensure localStorage saves before routing
    setTimeout(() => {
      setIsLoading(false);
      router.push("/change-pin/fnewpin"); // proceed to the next page
    }, 800);
  };

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Navbar */}
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
              onClick={() => router.push("/change-pin")}
              className="flex items-center gap-2 w-fit px-4 h-9 cursor-pointer rounded-full bg-[#2D2D2D] hover:bg-[#3A3A3A] transition-colors mb-6 lg:mb-8"
            >
              <Image
                src={Lessthan}
                alt="back"
                width={16}
                height={16}
              />
              <p className="text-sm font-semibold text-white">Back</p>
            </div>

            {/* Main Form */}
            <div className="flex flex-col items-center lg:items-start max-w-lg mx-auto lg:mx-0">
              <p className="text-xl lg:text-2xl font-bold text-white text-center lg:text-left">
                Reset Security PIN
              </p>
              <p className="text-sm lg:text-base text-[#C7C7C7] font-normal mt-2 text-center lg:text-left leading-relaxed">
                For your security, please enter your account password to reset your PIN.
              </p>

              {/* Password Input */}
              <div className="w-full mt-6 lg:mt-8">
                <label className="block text-sm font-medium text-[#C7C7C7] mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full h-12 lg:h-14 bg-[#222222] text-white text-sm lg:text-base pl-4 pr-12 rounded-lg border-2 border-[#222222] focus:outline-none focus:border-[#4DF2BE] transition-colors"
                    placeholder="Enter your password"
                    disabled={isLoading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#DBDBDB] hover:text-white transition-colors"
                    disabled={isLoading}
                  >
                    <Image
                      src={ViewSlash}
                      alt="Toggle password visibility"
                      width={20}
                      height={20}
                    />
                  </button>
                </div>

                {/* Forgot Password Link */}
                <div
                  onClick={handleForgotPassword}
                  className="text-right mt-3 text-sm font-semibold text-white hover:underline cursor-pointer transition-colors"
                >
                  Forgot password?
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-[#FE857D] mt-3 font-semibold text-sm">
                    {error}
                  </div>
                )}
              </div>

              {/* Continue Button */}
              <button
                onClick={handleContinue}
                disabled={!password || isLoading}
                className={`w-full max-w-xs lg:max-w-sm h-12 mt-6 lg:mt-8 bg-[#4DF2BE] text-[#0F1012] font-semibold text-sm lg:text-base rounded-full border border-[#4DF2BE] transition-all hover:bg-[#3fe0ad] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#4DF2BE]`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-[#0F1012] border-t-transparent rounded-full animate-spin"></div>
                    Continuing...
                  </div>
                ) : (
                  "Continue"
                )}
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
    </main>
  );
};

export default ForgotPin;