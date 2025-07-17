'use client';
import React from 'react';
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation';
import Bell from "../../public/Assets/Evolve2p_bell/elements.svg";
import Profile from "../../public/Assets/Evolve2p_profile/Dashboard/elements.svg";
import Logo from "../../public/Assets/Evolve2p_logods/Dashboard/Logo.svg";
import Parrow from "../../public/Assets/Evolve2p_pArrow/elements.svg";

const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Wallet", path: "/wallet" },
  { name: "Marketplace", path: "/market_place" },
  { name: "Trade history", path: "/trade-history" },
  { name: "Support", path: "/support" },
];

const Nav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
  <nav className="flex items-center">
    <div className="mr-[40px]">
      <Image src={Logo} alt="logo" />
    </div>
    <ul className="flex items-center space-x-[40px] text-[#FFFFFF] list-none mb-[25px]">
      {navLinks.map(link => {
        const isActive = pathname === link.path;
        return (
          <li
            key={link.name}
            onClick={() => router.push(link.path)}
            className={`cursor-pointer transition rounded-[40px] 
              ${isActive ? "bg-[#2D2D2D] text-[#4DF2BE] w-[115px] h-[42px] flex items-center justify-center" : ""}
            `}
            style={{
              minWidth: isActive ? "115px" : "unset",
              minHeight: isActive ? "42px" : "unset",
              width: isActive ? "115px" : "fit-content",
              height: isActive ? "42px" : "fit-content"
            }}
          >
            {link.name}
          </li>
        );
      })}
    </ul>
    <div className="flex items-center space-x-[10px] ml-auto mr-[20px]">
      <div
        className="w-[30px] h-[25px] justify-center flex items-center bg-transparent mt-[10px] mr-[20px] mb-[10px] relative border rounded-full"
        style={{ borderColor: "#2D2D2D", borderWidth: "1px" }}
      >
        <Image src={Bell} alt="bell" />
        <span className="absolute text-[white] text-[10px] -top-[1.5px] -right-[-1.5px] w-[10px] h-[12px] bg-[red] font-[500] rounded-full text-xs flex items-center justify-center text-white">
          0
        </span>
      </div>
      <div
        className="flex w-[40px] h-[25px] items-center bg-transparent mt-[10px] pr-[5px] space-x-[15px] mr-[20px] mb-[15px] border rounded-full"
        style={{ borderColor: "#2D2D2D", borderWidth: "1px" }}
      >
        <Image src={Profile} alt="itsprofile" />
        <Image src={Parrow} alt="itsprofile" />
      </div>
    </div>
  </nav>
);
}
export default Nav;