"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import image from "../../../public/Assets/Evolve2p_goback/Content.png";

const Lpassnav = () => {
  const router = useRouter();

  return (
    <div className="flex  mt-[60px] flex-col  items-center  p-[12px_20px]  ml-[-70%] md:ml-[-44%] lg:ml-[-42%] sm:ml-[-48%]">
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

export default Lpassnav;
