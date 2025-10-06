"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import image from "../../../public/Assets/Evolve2p_goback/Content.png";

const Resetpnav = () => {
  const router = useRouter();

  return (
    <div className="flex  ml-[-68%] sm:ml-[-54%] md:ml-[-44%] mt-[100px] sm:mt-[6%] flex-col  items-center  p-[12px_20px] lg:ml-[-36%] xl:ml-[-24%]">
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
