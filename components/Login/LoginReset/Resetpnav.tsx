"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import image from "../../../public/Assets/Evolve2p_goback/Content.png";

const Resetpnav = () => {
  const router = useRouter();

  return (
    <div className="flex  ml-[-72%] sm:mt-[20%] mt-[-20px] flex-col  items-center  p-[12px_20px] lg:mt-[-8%] md:mt-[-8%] sm:ml-[-44%] lg:ml-[-30%] xl:ml-[-20%] xl:mt-[-6%] ">
      <button
        type="button"
        onClick={() => router.back()}
        className="focus:outline-none"
        aria-label="Go back"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
        }}
      >
        <Image src={image} alt="Evolve2p_goback" width={80} />
      </button>
    </div>
  );
};

export default Resetpnav;
