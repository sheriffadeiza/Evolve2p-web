import React from "react";
import Header from "@/components/Signup/SignupEmail/Header";

import ImageContent from "@/components/Signup/SignupEmail/ImageContent";
import Loginnav from "@/components/Login/LoginE&P/Loginnav";
import Loginbd from "@/components/Login/LoginE&P/Loginbd";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 min-h-[calc(150vh-64px)]">
          <Loginnav />
          <Loginbd />
        </div>

        {/* Right Section */}
        <div className=" w-full lg:w-1/2 mt-[20px]  min-h-[calc(150vh-64px)]  hidden lg:flex">
          <ImageContent />
        </div>
      </div>
    </div>
  );
};

export default page;
