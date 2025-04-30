'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
const VerifyEmailBody: React.FC = () => {
  const router = useRouter();
  const [pin, setPin] = useState<string[]>(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return; // Only allow numbers

    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);

    // Move focus to next input
    if (val && idx < 5) {
      const nextInput = document.getElementById(`pin-${idx + 1}`);
      if (nextInput) (nextInput as HTMLInputElement).focus();
    }

    // If all fields are filled, show loader then redirect
    if (newPin.every(d => d !== '')) {
      setIsLoading(true);
      setTimeout(() => {
        router.push('/Profile'); // Replace with your desired route
      }, 1500); // Simulate loading
    }
  };

  return (
    <div className="max-w-md mx-auto ml-[80px] mt-10 px-4 text-white">
      <h1 className="text-[24px] text-[#FCFCFC] font-[700] mb-2">Verify Email</h1>
      <p className="text-[16px] font-[400] text-[#8F8F8F] mb-6">
        Please enter the 6-digit code sent to <br />
        <span className="text-[#DBDBDB]">davidokeyemi@sample.com</span>
      </p>

      

<div className="flex gap-[10px] ml-[-15%] border-none justify-center mb-6">
  {pin.map((digit, idx) => (
    <input
      key={idx}
      id={`pin-${idx}`}
      maxLength={1}
      value={digit}
      onChange={(e) => handleChange(e.target.value, idx)}
      className="w-[62px] h-[56px] rounded-[10px] border-none bg-[#222222] text-center text-[14px] font-[500] text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#4DF2BE]"
      type="password"
      inputMode="numeric"
      pattern="[0-9]*"
    />
  ))}
</div>



      <div className="text-center text-[14px] font-[400] text-[#DBDBDB] ml-[-15%] mt-[20px]">
        Didn’t receive code?{' '}
        <button className="text-[#FFFFFF] w-[149px] h-[40px] text-[14px] ml-[10px] rounded-[100px] bg-[#222222] border-none font-[700] hover:underline">
          Resend code 30s
        </button>
      </div>
      {isLoading && (
        <div className="fixed inset-0 flex ml-[15%] mt-[30px] items-center justify-center bg-black bg-opacity-50 z-50">
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

export default VerifyEmailBody;
