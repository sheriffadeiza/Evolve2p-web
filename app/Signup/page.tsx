

import React from 'react';
import Header from '../../components/Header';
import Ev2pnav from '../../components/Ev2pnav';
import SignupForm from '../../components/SignupForm';
import ImageContent from '@/components/ImageContent';

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      {/* Header Section */}
      <Header />
      
      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Section */}
        <div className="w-1/2 min-h-[calc(150vh-64px)]">
          <Ev2pnav />
          <SignupForm />
        </div>
        
        {/* Right Section */}
        <div className="w-1/2 mt-[20px]  min-h-[calc(150vh-64px)] bg-[#2D2D2D]">
          <ImageContent />
        </div>
      </div>
    </div>
  );
};

export default Page;