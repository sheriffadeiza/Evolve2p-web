"use client";

import React, { useRef, useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation";

const UpdatePin: React.FC = () => {
  const router = useRouter();
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Get email from localStorage on component mount
    const getUserEmail = () => {
      try {
        const stored = localStorage.getItem("UserData");
        if (stored) {
          const userData = JSON.parse(stored);
          // Try to get email from different possible locations
          const email = 
            userData?.email || 
            userData?.userData?.email || 
            userData?.user?.email || 
            userData?.userEmail;
          
          if (email) {
            setUserEmail(email);
          } else {
            console.warn("Email not found in user data:", userData);
          }
        }
      } catch (e) {
        console.error("Error parsing user data:", e);
      }
    };

    getUserEmail();
  }, []);

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

  const handleContinue = async () => {
    const pin = inputRefs.current.map((input) => input.value).join("");
    if (pin.length !== 4) {
      alert("Please enter your full 4-digit PIN");
      return;
    }

    if (!userEmail) {
      alert("Email not found. Please log in again.");
      router.push("/Logins/login");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("https://evolve2p-backend.onrender.com/api/check-pin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin, email: userEmail }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.success || data.message === "PIN verified successfully") {
        alert("✅ PIN verified successfully!");
        router.push("/change-pin/newpin");
      } else {
        alert(data.message || "❌ Invalid PIN. Please try again.");
      }
    } catch (err) {
      console.error("API Error:", err);
      alert("Unexpected server response. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgetPin = () => {
    // Store email for the forgot pin flow
    if (userEmail) {
      sessionStorage.setItem("forgotPinEmail", userEmail);
    }
    router.push("/change-pin/forgotpin");
  };

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="px-4 py-6 md:px-8 md:py-8 lg:max-w-7xl lg:mx-auto">
        {/* Navbar */}
        <Nav />

        <div className="flex flex-col lg:flex-row items-start gap-6 mt-6 lg:mt-8">
          {/* Settings Sidebar */}
          <div className="w-full lg:w-auto">
            <Settings />
          </div>

          {/* Right Side - Main Content */}
          <div className="w-full bg-[#1A1A1A] rounded-lg lg:rounded-r-[8px] p-6 md:p-8 lg:p-16 flex flex-col">
            <p className="text-xl md:text-2xl font-bold text-[#FFFFFF] mb-4 md:mb-6">
              Update Security PIN
            </p>

            <div className="flex flex-col w-full max-w-md mx-auto lg:mx-0 lg:ml-[110px] p-4 md:p-6">
              <p className="text-lg md:text-xl font-bold text-[#FFFFFF]">
                Enter Current PIN
              </p>
              <p className="text-sm md:text-base text-[#C7C7C7] font-normal mt-2 md:mt-3">
                For security reasons, enter your current PIN before setting a new one.
              </p>

            

              {/* PIN Input Boxes */}
              <div className="flex justify-center lg:justify-start items-center gap-3 md:gap-4 mt-6 md:mt-8">
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
                    className="w-14 h-12 md:w-16 md:h-14 lg:w-[67.75px] lg:h-[56px] p-2 text-center text-base md:text-lg font-bold text-[#FFFFFF] bg-[#222222] border border-[#2E2E2E] rounded-lg md:rounded-xl lg:rounded-[12px] focus:outline-none focus:border-[#4DF2BE] transition-colors"
                  />
                ))}
              </div>

              {/* Forget PIN */}
              <div
                onClick={handleForgetPin}
                className="mt-4 md:mt-6 text-[#FFFFFF] text-center lg:text-left lg:ml-[200px] text-sm font-bold hover:underline cursor-pointer"
              >
                Forget PIN
              </div>

              {/* Continue Button with Loader */}
              <button
                onClick={handleContinue}
                disabled={isLoading || !userEmail}
                className="w-full max-w-sm mx-auto lg:mx-0 lg:w-[395px] h-12 md:h-[48px] mt-8 md:mt-10 border border-[#4DF2BE] bg-[#4DF2BE] text-[#0F1012] font-bold text-sm rounded-full hover:opacity-90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="loader"></div>
                    <span>Verifying...</span>
                  </div>
                ) : !userEmail ? (
                  "Email not found"
                ) : (
                  "Continue"
                )}
              </button>

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
            </div>
          </div>
        </div>

        {/* Footer Divider */}
        <div className="w-[100%] h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
        <div className="mb-[80px] whitespace-nowrap mt-[10%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default UpdatePin;