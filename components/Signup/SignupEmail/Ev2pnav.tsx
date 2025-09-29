"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import evolve_logo from "../../../public/Assets/Logo/Create account/Logo.svg";

// Define the valid step names and corresponding numbers
const stepNumbers: Record<string, number> = {
  email: 1,
  password: 2,
  verify: 3,
  profile: 4,
  secpin: 5,
  confirm: 5,
  kyc: 6,
};

const Ev2pnav = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);

  useEffect(() => {
    // Read from localStorage on client
    const stepKey = localStorage.getItem("currentStepName");

    if (stepKey && stepNumbers[stepKey]) {
      setCurrentStep(stepNumbers[stepKey]);
    } else {
      setCurrentStep(1); // default fallback
    }
  }, []);

  return (
    <div className="flex mt-[80px] gap-[30%] md:gap-[20%] items-center justify-center lg:ml-[40px] p-[12px_20px] lg:flex lg:justify-between ">
      <Image src={evolve_logo} alt="Evolve2p Logo" width={200} height={40} />

      <button className=" md:py-4 w-[100px] md:w-[84px]l h-[24px] flex items-center justify-center border-0 transition-colors rounded-full text-[14px] font-[500] bg-[#3A3A3A] text-[#DBDBDB]">
        Step {currentStep} of 6
      </button>
    </div>
  );
};

export default Ev2pnav;
