
import React from 'react';
import Header from '@/components/Signup/SignupEmail/Header';

import ImageContent from '@/components/Signup/SignupEmail/ImageContent';
import Lauthnav from '@/components/Login/LoginAuth/Lauthnav';
import Lauthbd from '@/components/Login/LoginAuth/Lauthbd';


 
  const page = () => {
  return (
       <div className="min-h-screen flex flex-col bg-[#0F1012]">
      {/* Header Section */}
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Section */}
        <div className="w-1/2 min-h-[calc(150vh-64px)]">
          <Lauthnav/>
          <Lauthbd/>
        </div>
        
        {/* Right Section */}
        <div className="w-1/2 mt-[20px]  min-h-[calc(150vh-64px)]">
          <ImageContent />
        </div>
      </div>
    </div>
  );

  };

  export default page;