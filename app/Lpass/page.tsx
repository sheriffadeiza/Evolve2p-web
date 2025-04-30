

import React from 'react';
import Header from '../../components/Signup/SignupEmail/Header';
import Lpassbd from '@/Lcomponents6/Lpassbd';
import Lpassnav from '@/Lcomponents6/Lpassnav';

const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      {/* Header Section */}
      <Header />
      
      {/* Main Content */}
      <div className="">
        
          <Lpassnav/>
          <Lpassbd/>
         
         
        </div>
        

     
    </div>
  );
};

export default page;