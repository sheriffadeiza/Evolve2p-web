import React from 'react';

import Emailvernav from '../../components3/Emailvernav';
import VerifyEmailbd from '../../components3/verifyEmailbd';
import ImageContent from '@/components/ImageContent';

import Header from '../../components2/Header';


const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      <Header />

      <div className="flex flex-1">

        {/* Left side content */}
        
      <div className="w-1/2 min-h-[calc(150vh-64px)]"> 
      <Emailvernav/>
      <VerifyEmailbd/>
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
