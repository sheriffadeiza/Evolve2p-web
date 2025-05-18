'use client';

import React from 'react'
import Image from 'next/image';
import image from '../../../public/Assets/Evolve2p_goback/Content.png'


const Lpassnav = () => {
  return (
    <div className="flex  ml-[-20%] mt-[100px] flex-col  items-center  p-[12px_20px]"> {/* Updated padding */}
               
    <Image src={image}  alt="Evolve2p_goback"  width={80}  />


    </div>
  )
}

export default Lpassnav;