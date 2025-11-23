import React from "react";

import Emailvernav from "../../../components/Signup/SignupVerify/Emailvernav";
import VerifyEmailbd from "../../../components/Signup/SignupVerify/verifyEmailbd";
import ImageContent from "@/components/Signup/SignupEmail/ImageContent";

import Header from "../../../components/Signup/SignupPassword/Header";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      <Header />

      <div className="flex flex-1 justify-center">
        {/* Left side content */}

        <div className="w-full lg:w-1/2 min-h-[calc(150vh-64px)]">
          <Emailvernav />
          <VerifyEmailbd />
        </div>

        {/* Right side content */}

        <div className="w-full lg:w-1/2 mt-[20px]  min-h-[calc(150vh-64px)] hidden lg:flex">
          <ImageContent />
        </div>
      </div>
    </div>
  );
};

export default page;
