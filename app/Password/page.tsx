'use client';

import React from 'react';
import Passwordbd from '@/components2/Passwordbd';
import Header from '../../components2/Header';
import Passnav from '../../components2/Passnav';
import ImageContent from '../../components/ImageContent';


const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      <Header />
      <div className="flex flex-1">
        {/* Left side content */}
        <div className="w-1/2 min-h-[calc(150vh-64px)]">
          <Passnav />
          <Passwordbd />
        </div>
        
        {/* Right side content */}
        <div className="w-1/2 mt-[20px] min-h-[calc(150vh-64px)] bg-[#2D2D2D]">
        <ImageContent/>
        </div>
      </div>
    </div>
  );
};

export default page;