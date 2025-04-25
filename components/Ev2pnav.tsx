'use client';

import React from 'react';
import Image from 'next/image';
import evolve_logo from '../public/Assets/Logo/Create account/Logo.svg';

const Ev2pnav = () => {
  return (
    <div className="flex mt-[80px] gap-[30%] items-center ml-[50px] p-[12px_20px]"> {/* Updated padding */}
      
        {/* Logo */}
        <Image
          src={evolve_logo}
          alt="Evolve2p Logo"
          width={200} 
          height={40}  
        />

        {/* Step Button */}
       <button
          className=" w-[84px] h-[24px]  flex items-center justify-center  border-0 transition-colors  rounded-full  text-[14px] font-[500] bg-[#3A3A3A] text-[#DBDBDB]"
         
        >
          Step 1 of 6
        </button>
      </div>

      
    
  ); 
};

export default Ev2pnav;