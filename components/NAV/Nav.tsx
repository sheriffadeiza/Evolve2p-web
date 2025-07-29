'use client';
import React, { useState } from 'react';
import Image from "next/image";
import { usePathname, useRouter } from 'next/navigation';
import Bell from "../../public/Assets/Evolve2p_bell/elements.svg";
import Profile from "../../public/Assets/Evolve2p_profile/Dashboard/elements.svg";
import Logo from "../../public/Assets/Evolve2p_logods/Dashboard/Logo.svg";
import Parrow from "../../public/Assets/Evolve2p_pArrow/elements.svg";
import VerifyIcon from "../../public/Assets/Evolve2p_vericon/elements.svg";
import ProfileIcon from "../../public/Assets/Evolve2p_proicon/user-circle.svg";
import LevelIcon from "../../public/Assets/Evolve2p_levicon/user-check-01.svg";
import SettingsIcon from "../../public/Assets/Evolve2p_setticon/setting-07.svg";
import TransactionsIcon from "../../public/Assets/Evolve2p_transicon/elements.svg";
import LimitIcon from "../../public/Assets/Evolve2p_limicon/elements.svg";
import HistoryIcon from "../../public/Assets/Evolve2p_trahisicon/elements.svg";
import Logout from "../../public/Assets/Evolve2p_logouticon/elements.svg";

const navLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Wallet", path: "/wallet" },
  { name: "Marketplace", path: "/market_place" },
  { name: "Trade history", path: "/trade-history" },
  { name: "Support", path: "/support" },
];

const profileOptions = [
  { name: "Verify me", icon: VerifyIcon, action: () => {} },
  { name: "My Profile", icon: ProfileIcon, action: () => {} },
  { name: "Account Level", icon: LevelIcon, tier: "Tier 1", action: () => {} },
  { name: "Settings", icon: SettingsIcon, action: () => {} },
  { name: "My Transactions", icon: TransactionsIcon, action: () => {} },
  { name: "Transaction Limit", icon: LimitIcon, action: () => {} },
  { name: "Trade History", icon: HistoryIcon, action: () => {} },
];

const Nav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const toggleProfiledown = () => {
    setIsProfileOpen((prev) => !prev);
  };

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
          <span className="absolute text-[10px] -top-[1.5px] -right-[-1.5px] w-[10px] h-[12px] bg-[red] font-[500] rounded-full  flex items-center justify-center text-[#fff]">
            0
          </span>
        </div>

        <div
          className="flex w-[40px] h-[25px] items-center bg-transparent mt-[10px] pr-[5px] space-x-[15px] mr-[20px] mb-[15px] border rounded-full"
          style={{ borderColor: "#2D2D2D", borderWidth: "1px" }}
        >
          <Image src={Profile} alt="itsprofile" />
          <Image src={Parrow} alt="dropdown arrow" onClick={toggleProfiledown} />
        </div>

        {isProfileOpen && (
          <div className="absolute top-[100px] left-[80%] w-[234px] h-[337px] bg-[#222222] space-y-[20px]  rounded-[12px] shadow-lg p-[8px] z-50 text-white space-y-4"
          style={{border: '1px solid #2D2D2D'}}
          >
            {profileOptions.map((item, index) => (
              <div
                key={index}
                onClick={item.action}
                className="flex justify-between items-center cursor-pointer hover:text-[#4DF2BE] text-[16px] font-medium"
              >
                <span className="flex  items-center space-x-2">
                  <Image src={item.icon} alt={item.name} width={20} height={20} />
                  <span  className={`ml-[10px] text-[16px] font-[500] ${ item.name === "Verify me" ? "text-[#FE857D]"  : "text-[#FCFCFC]"}`}>{item.name}</span>
                </span>
                {item.tier && (
                  <span className="bg-[#3A3A3A]  flex items-center w-[43px] h-[22px] text-[12px] font-[500] text-[#DBDBDB]  rounded-[16px]"
                  style={{padding: '2px 8px'}}
                  >{item.tier}</span>
                )}
              </div>
            ))}
            <hr className="border-[#333]" />
            <div className="flex items-center space-x-2 text-[#FE857D] cursor-pointer hover:underline">
              <Image src={Logout} alt="logout" width={20} height={20} />
              <span className='ml-[10px] text-[16px] font-[500] text-[#FE857D]'>Logout</span>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Nav;
