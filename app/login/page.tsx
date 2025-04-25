

import React from 'react';
import Header from '../../components/Header';

import ImageContent from '@/components/ImageContent';
import Loginnav from '@/Lcomponents1/Loginnav';
import Loginbd from '@/Lcomponents1/Loginbd';


const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      {/* Header Section */}
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Section */}
        <div className="w-1/2 min-h-[calc(150vh-64px)]">
          <Loginnav/>
          <Loginbd/>
        </div>
        
        {/* Right Section */}
        <div className="w-1/2 mt-[20px]  min-h-[calc(150vh-64px)] bg-[#2D2D2D]">
          <ImageContent />
        </div>
      </div>
    </div>
  );
};

export default page;