'use client';

import React from 'react';
import Image from 'next/image';
import evolve_logo from '../../../public/Assets/Logo/Create account/Logo.svg';
import { useSignup } from '@/context/SignupContext';

const stepNumbers = {
  email: 1,
  password: 2,
  verify: 3,
  profile: 4,
  secpin: 5,
  confirm: 6
};

const Ev2pnav = () => {
  const { currentStep } = useSignup();

  return (
    <div className="flex mt-[80px] gap-[30%] items-center ml-[50px] p-[12px_20px]">
      <Image
        src={evolve_logo}
        alt="Evolve2p Logo"
        width={200} 
        height={40}  
      />

      <button className="w-[84px] h-[24px] flex items-center justify-center border-0 transition-colors rounded-full text-[14px] font-[500] bg-[#3A3A3A] text-[#DBDBDB]">
        Step {stepNumbers[currentStep]} of 6
      </button>
    </div>
  );
};

export default Ev2pnav;