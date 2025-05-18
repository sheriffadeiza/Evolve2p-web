'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Lverifybd: React.FC = () => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleChange = (val: string, idx: number) => {
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    
    if (val && idx < 5) {
      const nextInput = document.getElementById(`pin-${idx + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }
  };

  useEffect(() => {
    // Check if all PIN fields are filled
    const allFilled = pin.every(digit => digit.length === 1);
    setIsComplete(allFilled);

    if (allFilled) {
      setIsLoading(true);
      
      // Simulate verification process
      const timer = setTimeout(() => {
        router.push('Logins/Lpass'); // Change to your desired route
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [pin, router]);

  return (
    <div className="max-w-md mx-auto ml-[-80px] text-center mt-10 px-4 text-white">
      <h1 className="text-[24px] ml-[-15%] text-[#FCFCFC] font-[700] mb-2">Verify Email</h1>
      <p className="text-[16px] ml-[-7%] font-[400] text-[#8F8F8F] mb-6">
        Please enter the 6-digit code sent to <br />
        <span className="text-[#DBDBDB] ml-[-3.5%]">davidokeyemi@sample.com</span>
      </p>

      <div className="flex gap-[10px] ml-[10%] border-none justify-center mb-6">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            className="w-[62px] h-[56px] rounded-[10px] border-none bg-[#222222] text-center text-xl text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
            type="password"
            disabled={isLoading}
          />
        ))}
      </div>

      <div className="text-center text-[14px] font-[400] text-[#DBDBDB] ml-[10%] mt-[20px]">
        Didn't receive code?{' '}
        <button 
          className="text-[#FFFFFF] w-[149px] h-[40px] text-[14px] ml-[10px] rounded-[100px] bg-[#222222] border-none font-[700] hover:underline"
          disabled={isLoading}
        >
          Resend code 30s
        </button>
      </div>
      {isLoading && (
        <div className="fixed inset-0 flex ml-[55%] mt-[30px] items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="loader"></div>
          
          <style jsx global>{`
            .loader {
              width: 30px;
              height: 30px;
              position: relative;
            }
            .loader::after {
              content: "";
              position: absolute;
              top: 0;
              left: 0;
              width: 70%;
              height: 70%;
              border: 5px solid #333333;
              border-top-color: #4DF2BE;
              border-radius: 50%;
              animation: spin 1s linear infinite;
            }
            @keyframes spin {
              0% {
                transform: rotate(0deg);
              }
              100% {
                transform: rotate(360deg);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
};

export default Lverifybd;