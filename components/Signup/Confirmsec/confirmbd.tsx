// components/SecPinBd.tsx
'use client';


import React, { useState } from "react";

const SecPinBd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(["", "", "", "",]);

  const handleChange = (val: string, idx: number) => {
    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);
    const nextInput = document.getElementById(`pin-${idx + 1}`);
    if (val && nextInput) (nextInput as HTMLInputElement).focus();
  };

  return (
    <div className="text-white ml-[100px] mt-[30px]">
      <h2 className="text-[24px] text-[#FCFCFC] font-[700]">Confirm your PIN</h2>
      <p className="text-[16px] font-[400] mt-[-10px]  mb-6 text-[#8F8F8F]">
        Re-enter your PIN to make sure it's correct.
      </p>

      <div className="flex gap-2">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            className="w-[83.5px] h-[56px] ml-[10px] rounded-[10px] border-none bg-[#222222] font-[500] text-center text-[14px] text-[#FCFCFC] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
            type="password"
          />
        ))}
      </div>
    </div>
  );
};

export default SecPinBd;
