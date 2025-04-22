'use client';

import React from 'react'
import Image from 'next/image';
import image from '../public/Assets/Evolve2p remix/remix_icon/Group.svg';

const ImageContent = () => {
  return (
    <div className="flex h-full  items-center justify-center bg-[#2D2D2D]">
      <Image 
        src={image} 
        alt="Evolve2p Logo" 
        width={200} 
        height={200} 
        className="object-contain"
      />
    </div>
  )
}

export default ImageContent