'use client';

import React from 'react';
import Image from 'next/image';
import image from '../../../public/Assets/Evolve2p_goback/Content.png';
import { useSignup } from '@/context/SignupContext';
import { useRouter } from 'next/navigation';

const Profilenav = () => {
  const { setCurrentStep } = useSignup();
  const router = useRouter();

  const handleGoBack = () => {
    setCurrentStep('verify');
    router.push('/Signups/Verify');
  };

  return (
    <div className="flex gap-[55%] mt-[100px] items-center ml-[70px] p-[12px_20px]">
      <button
        onClick={handleGoBack}
        className="border-0 bg-transparent cursor-pointer"
      >
        <Image 
          src={image} 
          alt="Go back" 
          width={50} 
          height={25}
        />
      </button>

      <button
        className="w-[84px] h-[24px] flex items-center justify-center border-0 transition-colors rounded-full text-[14px] font-[500] bg-[#3A3A3A] text-[#DBDBDB]"
      >
        Step 4 of 6
      </button>
    </div>
  );
};

export default Profilenav;