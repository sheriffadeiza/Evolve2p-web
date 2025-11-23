"use client";

import React from "react";
import Image from "next/image";
import evolve_logo from "../../../public/Assets/Logo/Create account/Logo.svg";

const Loginnav = () => {
  return (
    <div className="flex mt-[80px] gap-[30%] items-center  lg:ml-[40px] p-[12px_20px] border-0 border-red-500 md:w-[50%] md:justify-center md:ml-[10%] sm:ml-[14%]">
      {" "}
      {/* Updated padding */}
      {/* Logo */}
      <Image src={evolve_logo} alt="Evolve2p Logo" width={200} height={40} />
    </div>
  );
};

export default Loginnav;
