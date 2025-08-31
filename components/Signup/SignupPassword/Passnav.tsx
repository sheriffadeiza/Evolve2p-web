'use client';

import React from 'react';
import Image from 'next/image';
import image from '../../../public/Assets/Evolve2p_goback/Content.png';
import { useRouter } from 'next/navigation';

const Passnav = () => {
  const router = useRouter();

  const handleGoBack = () => {

    localStorage.getItem('UserEmail');
    router.push('/Signups/VerifyEmail');
  };

  return (
    <div className="flex gap-[48%] mt-[100px] items-center ml-[50px] p-[12px_20px]">
      <button 
        onClick={handleGoBack}
        className="border-0 bg-transparent cursor-pointer"
      >
        <Image 
          src={image} 
          alt="Go back" 
          width={60} 
          height={25} 
        />
      </button>

      <button
        className="w-[84px] h-[24px] flex items-center justify-center border-0 transition-colors rounded-full text-[14px] font-[500] bg-[#3A3A3A] text-[#DBDBDB]"
      >
        Step 3 of 6
      </button>
    </div>
  );
};

export default Passnav;