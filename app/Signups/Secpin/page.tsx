import React from 'react';
import Header from '../../components/Signup/SignupPassword/Header';

import ImageContent from '@/components/Signup/SignupEmail/ImageContent';
import SecPinnav from '@/components5/SecPinnav';
import SecPinBd from '@/components5/SecPinbd';



const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      <Header />

      <div className="flex flex-1">

        {/* Left side content */}
        
      <div className="w-1/2 min-h-[calc(150vh-64px)]"> 
      <SecPinnav/>
      <SecPinBd/>
     
      </div>
       
       {/* Right side content */}

      <div className="w-1/2 mt-[20px]  min-h-[calc(150vh-64px)] bg-[#2D2D2D]">
          <ImageContent />
        </div>
     
    </div>
    </div>
    
  )
}

export default page
