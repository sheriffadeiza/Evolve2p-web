"use client";

import React from "react";
import Image from "next/image";
import image from "../../../public/Assets/Evolve2p_goback/Content.png";

const Lauthnav = () => {
  return (
    <div className="flex ml-[60px] gap-[45%] mt-[100px] items-center lg:ml-[146px] md:ml-[200px]  p-[12px_20px]  sm:ml-[150px]">
      {" "}
      {/* Updated padding */}
      <Image src={image} alt="Evolve2p_goback" width={80} />
    </div>
  );
};

export default Lauthnav;
