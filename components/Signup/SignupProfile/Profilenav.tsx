"use client";

import React from "react";
import Image from "next/image";
import image from "../../../public/Assets/Evolve2p_goback/Content.png";
import { useRouter } from "next/navigation";

const Profilenav = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/Signups/Password");
  };

  return (
    <div className="flex gap-[54%] ml-[8px]  mt-[100px] sm:justify-between sm:w-[400px] sm:ml-[120px] items-center lg:ml-[100px] p-[12px_20px]   md:ml-[188px] lg:gap-[48%]">
      <button
        onClick={handleGoBack}
        className="border-0 bg-transparent cursor-pointer"
      >
        <Image src={image} alt="Go back" width={60} height={25} />
      </button>

      <button className="w-[84px] h-[24px] flex items-center justify-center border-0 transition-colors rounded-full text-[14px] font-[500] bg-[#3A3A3A] text-[#DBDBDB]">
        Step 4 of 6
      </button>
    </div>
  );
};

export default Profilenav;
