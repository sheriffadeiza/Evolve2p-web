'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const Lauthbd: React.FC = () => {
  const [pin, setPin] = useState<string[]>(["", "", "", "", "", ""]);
  const router = useRouter();

  const handleChange = (val: string, idx: number) => {
    if (!/^\d?$/.test(val)) return;

    const newPin = [...pin];
    newPin[idx] = val;
    setPin(newPin);

    const nextInput = document.getElementById(`pin-${idx + 1}`);
    if (val && nextInput) (nextInput as HTMLInputElement).focus();
  };

  // Automatically redirect when all 6 digits are filled
  useEffect(() => {
    if (pin.every((digit) => digit !== '')) {
      setTimeout(() => {
        router.push('/Resetp'); 
      }, 500); // Small delay for UX
    }
  }, [pin, router]);

  return (
    <div className="text-white ml-[95px] mt-[30px]">
      <h2 className="text-[24px] text-[#FCFCFC] font-[700]">Enter Authentication code</h2>
      <p className="text-[16px] font-[400] mt-[-10px] mb-6 text-[#8F8F8F]">
        Your PIN helps you log in faster and approve transactions <br /> securely.
      </p>

      <div className="flex gap-[5px]">
        {pin.map((digit, idx) => (
          <input
            key={idx}
            id={`pin-${idx}`}
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            className="w-[60px] h-[56px] rounded-[10px] border-none bg-[#222222] text-center text-xl text-[#8F8F8F] focus:outline-none focus:ring-1 focus:ring-[#1ECB84]"
            type="password"
          />
        ))}
      </div>

      <div className="text-[14px] mt-[70px] ml-[-20%] font-[700] text-center text-[#FCFCFC] hover:underline">
        Forgot PIN
      </div>
    </div>
  );
};

export default Lauthbd;
