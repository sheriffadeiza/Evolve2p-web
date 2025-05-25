

import React from 'react';
import Header from '@/components/Signup/SignupEmail/Header';
import Resetpnav from '@/components/Login/LoginReset/Resetpnav';
import Resetpbd from '@/components/Login/LoginReset/Resetpbd';


const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      {/* Header Section */}
      <Header />
      
      {/* Main Content */}
      <div className="">
        
          <Resetpnav/>
          <Resetpbd/>
         
        </div>
        

     
    </div>
  );
};

export default page;