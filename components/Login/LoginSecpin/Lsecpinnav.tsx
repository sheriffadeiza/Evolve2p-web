'use client';

import React from 'react'
import Image from 'next/image';
import image from '../../../public/Assets/Evolve2p_goback/Content.png'
import { useRouter } from 'next/navigation';

const LsecPinnav = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/Logins/login'); // Adjust the path to your login page
  };

  return (
    <div className="flex gap-[45%] mt-[50px] md:mt-[100px] items-center ml-[20px] md:ml-[70px] p-[12px_20px]">
      <button 
        onClick={handleGoBack} 
        className="cursor-pointer hover:opacity-80 transition-opacity active:scale-95"
      >
        <Image 
          src={image} 
          alt="Go back to login" 
          width={60} 
          className="md:w-[80px]"
        />
      </button>
    </div>
  )
}

export default LsecPinnav