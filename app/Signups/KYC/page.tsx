import React from "react";
import Header from "../../../components/Signup/SignupEmail/Header";
import KYCVnav from "../../../components/Signup/KYCV/KYCVnav";
import KYCVbd from "../../../components/Signup/KYCV/KYCVbd";
import ImageContent from "@/components/Signup/SignupEmail/ImageContent";

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <div className="flex flex-1  justify-center lg:flex lg:flex-1 lg:justify-start">
        {/* Left Section */}
        <div className="w-full lg:w-1/2 min-h-[calc(150vh-64px)]">
          <KYCVnav />
          <KYCVbd />
        </div>

        {/* Right Section */}
        <div className="w-full lg:w-1/2 mt-[20px]  min-h-[calc(150vh-64px)] hidden lg:flex">
          <ImageContent />
        </div>
      </div>
    </div>
  );
};

export default Page;
