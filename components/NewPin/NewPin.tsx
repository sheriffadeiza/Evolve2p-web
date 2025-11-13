"use client";

import React, { useRef, useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Lessthan from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import Image from "next/image";
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation";

const UPDATE_PIN_ENDPOINT =
  "https://evolve2p-backend.onrender.com/api/update-user"; // make sure this is correct

const NewPin: React.FC = () => {
  const router = useRouter();

  const [pin, setPin] = useState<string[]>(["", "", "", ""]);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<{ accessToken: string; userData: any } | null>(null);

  const allFilled = pin.every((digit) => digit !== "");

  // Load userData from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("UserData");
      if (stored) setUserData(JSON.parse(stored));
      else {
        alert("Session expired. Please log in again.");
        router.push("/login");
      }
    } catch (err) {
      console.error("Failed to parse user data", err);
    }
  }, [router]);

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
      if (pin[index]) {
        updatePinAt(index, "");
        return;
      }
      inputsRef.current[index - 1]?.focus();
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

  const handleContinue = async () => {
    if (!allFilled || isLoading || !userData?.accessToken) return;

    if (!confirm("Do you want to update your PIN?")) return;

    setIsLoading(true);
    const newPin = pin.join("");

    try {
      const res = await fetch(UPDATE_PIN_ENDPOINT, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.accessToken}`,
        },
        body: JSON.stringify({
          email: userData.userData?.email,
          pin: newPin,
        }),
      });

      const data = await res.json();
      console.log("Backend response:", data);

      if (!res.ok || !data?.success) {
        // Safely handle object messages
        const message =
          data?.message && typeof data.message === "string"
            ? data.message
            : data?.message
            ? JSON.stringify(data.message)
            : "Failed to update PIN. Please try again.";
        alert(message);
        setPin(["", "", "", ""]);
      } else {
        alert(data?.message || "PIN updated successfully!");
        router.push("/change-pin/confirmpin");
      }
    } catch (err) {
      console.error("Error updating PIN:", err);
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
            {/* Back Button */}
            <div
              className="flex items-center gap-[10px] w-[85px] h-[36px] p-[8px-14px] cursor-pointer rounded-full bg-[#2D2D2D]"
              onClick={() => router.push("/change-pin")}
            >
              <Image src={Lessthan} alt="lessthan" width={16} height={16} className="ml-[10px]" />
              <p className="text-[14px] font-[700] text-[#FFFFFF]">Back</p>
            </div>

            <div className="flex flex-col ml-[110px] p-[24px_20px]">
              <p className="text-[24px] font-[700] text-[#FFFFFF]">Enter new PIN</p>
              <p className="text-[16px] text-[#C7C7C7] font-[400] mt-[8px]">
                Your PIN helps you log in faster and approve
                <br />
                transactions securely.
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

        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>
        <div className="mb-[80px] mt-[30%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default NewPin;
