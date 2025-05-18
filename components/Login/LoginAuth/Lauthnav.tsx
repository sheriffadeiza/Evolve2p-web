'use client';

import React from 'react'
import Image from 'next/image';
import image from '../../../public/Assets/Evolve2p_goback/Content.png'


const Lauthnav = () => {
  return (
    <div className="flex  gap-[45%] mt-[100px] items-center ml-[70px] p-[12px_20px]"> {/* Updated padding */}
               
    <Image src={image}  alt="Evolve2p_goback"  width={80}  />


    </div>
  )
}

export default Lauthnav