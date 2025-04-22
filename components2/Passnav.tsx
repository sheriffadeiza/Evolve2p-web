'use client';

import React from 'react';
import Image from 'next/image';
import image from '../public/Assets/Evolve2p_goback/Content.png'



const Passnav = () => {
  return (
    
     

       <div className="flex  gap-[45%] mt-[100px] items-center ml-[70px] p-[12px_20px]"> {/* Updated padding */}
            
            <Image src={image}  alt="Evolve2p goback"  width={80}  />
      
              {/* Step Button */}
              <button
          className=" w-[84px] h-[24px]  flex items-center justify-center  border-0 transition-colors  rounded-full  text-[14px] font-[500] bg-[#3A3A3A] text-[#DBDBDB]"
         
        >
          Step 2 of 6
        </button>
            </div>
  
  );
};

export default Passnav;

