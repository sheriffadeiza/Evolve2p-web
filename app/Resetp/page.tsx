

import React from 'react';
import Header from '../../components/Header';
import Resetpnav from '@/Lcomponents4/Resetpnav';
import Resetpbd from '@/Lcomponents4/Resetpbd';


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