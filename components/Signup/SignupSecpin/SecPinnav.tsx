"use client";

import React from "react";
import Image from "next/image";
import image from "../../../public/Assets/Evolve2p_goback/Content.png";
import { useRouter } from "next/navigation";

const SecPinnav = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.push("/Signups/Profile");
  };

  return (
    <div className="flex gap-[48%] ml-[8px]  mt-[100px] items-center sm:justify-center sm:gap-[30%] lg:ml-[70px] xl:max-w-md p-[12px_20px] md:justify-center md:gap-[28%] lg:gap-[58%] ">
      <button
        onClick={handleGoBack}
        className="border-0 bg-transparent cursor-pointer"
      >
        <Image src={image} alt="Go back" width={60} height={25} />
      </button>

      <button className="w-[84px] h-[24px] flex items-center justify-center border-0 transition-colors rounded-full text-[14px] font-[500] bg-[#3A3A3A] text-[#DBDBDB]">
        Step 5 of 6
      </button>
    </div>
  );
};

export default SecPinnav;
