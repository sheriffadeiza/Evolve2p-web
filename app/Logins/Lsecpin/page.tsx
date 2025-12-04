import React from 'react';
import Header from '../../../components/Signup/SignupPassword/Header';
import ImageContent from '@/components/Signup/SignupEmail/ImageContent';
import LsecPinnav from '@/components/Login/LoginSecpin/Lsecpinnav';
import LsecPinBd from '@/components/Login/LoginSecpin/Lsecpinbd';

const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      <Header />

      <div className="flex flex-1 flex-col lg:flex-row">
        {/* Left side content - Full width on mobile, half on desktop */}
        <div className="w-full lg:w-1/2 min-h-screen lg:min-h-[calc(150vh-64px)]"> 
          <LsecPinnav/>
          <LsecPinBd/>
        </div>
       
        {/* Right side content - Hidden on mobile, visible on desktop */}
        <div className="hidden lg:block w-1/2 mt-[20px] min-h-[calc(150vh-64px)]">
          <ImageContent />
        </div>
      </div>
    </div>
  );
}

export default page;