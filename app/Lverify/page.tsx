

import React from 'react';
import Header from '../../components/Header';
import Lverifynav from '../../Lcomponents5/Lverifynav';
import Lverifybd from '@/Lcomponents5/Lverifybd';

const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      {/* Header Section */}
      <Header />
      
      {/* Main Content */}
      <div className="">
        
          <Lverifynav/>
          <Lverifybd/>
         
         
        </div>
        

     
    </div>
  );
};

export default page;