'use client';

import React from 'react';
import Image from 'next/image';
import evolve_logo from '../../../public/Assets/Logo/Create account/Logo.svg';






const Loginnav = () => {
  return (
    <div className="flex mt-[80px] gap-[30%] items-center ml-[50px] p-[12px_20px]"> {/* Updated padding */}
      
{/* Logo */}
<Image
  src={evolve_logo}
  alt="Evolve2p Logo"
  width={200} 
  height={40}  
/>

</div>



  )
}

export default Loginnav
