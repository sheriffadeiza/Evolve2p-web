import React from "react";
import Header from "../../../components/Signup/SignupPassword/Header";

import ImageContent from "@/components/Signup/SignupEmail/ImageContent";
import Confirmbd from "../../../components/Signup/Confirmsec/confirmbd";
import Confirmnav from "@/components/Signup/Confirmsec/Confirmnav";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      <Header />

      <div className="flex flex-1  w-full  justify-center lg:flex lg:flex-1 lg:justify-start">
        {/* Left side content */}

        <div className="w-full lg:w-1/2 min-h-[calc(150vh-64px)]">
          <Confirmnav />
          <Confirmbd />
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
