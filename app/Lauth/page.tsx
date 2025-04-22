import React from 'react';
import Header from '../../components2/Header';

import ImageContent from '@/components/ImageContent';
import Lauthnav from '@/Lcomponents3/Lauthnav';
import Lauthbd from '@/Lcomponents3/Lauthbd';


const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      <Header />

      <div className="flex flex-1">

        {/* Left side content */}
        
      <div className="w-1/2 min-h-[calc(150vh-64px)]"> 
      <Lauthnav/>
      <Lauthbd/>
   
     
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
