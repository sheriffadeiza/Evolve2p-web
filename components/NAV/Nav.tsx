"use client";
import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
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
    <>
      <nav className="items-center   lg:flex flex relative top-[-20px] left-[-16px] w-[110%] sm:w-[106%] p-[2px] md:w-[108%] md:left-[-4%]  xl:left-[-4px] xl:w-[100%]">
        <div className="mr-[40px] ">
          <Image src={Logo} alt="logo" />
        </div>
        <ul className="flex items-center hidden space-x-[40px] text-[#FFFFFF] list-none mb-[25px] md:flex md:space-x-[24px] md:border-0 md:border-red-500 md:mb-0 md:ml-[-14px]">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <li
                key={link.name}
                onClick={() => router.push(link.path)}
                className={`cursor-pointer transition rounded-[40px] 
                ${
                  isActive
                    ? "bg-[#2D2D2D] text-[#4DF2BE] w-[115px] h-[42px] flex items-center justify-center"
                    : ""
                }
              `}
                style={{
                  minWidth: isActive ? "115px" : "unset",
                  minHeight: isActive ? "42px" : "unset",
                  width: isActive ? "115px" : "fit-content",
                  height: isActive ? "42px" : "fit-content",
                }}
              >
                {link.name}
              </li>
            );
          })}
        </ul>
        <div className="flex items-center space-x-[10px] ml-auto xl:mr-[20px]">
          <div
            className=" w-[30px] h-[25px] justify-center flex items-center bg-transparent mt-[10px] mr-[20px] mb-[10px] relative border rounded-full"
            style={{ borderColor: "#2D2D2D", borderWidth: "1px" }}
          >
            <Image src={Bell} alt="bell" />
            <span className="absolute text-[10px] -top-[1.5px] -right-[-1.5px] w-[10px] h-[12px] bg-[red] font-[500] rounded-full  flex items-center justify-center text-[#fff]"></span>
          </div>

          <div
            className="flex w-[40px] h-[25px] items-center bg-transparent mt-[10px] pr-[5px] space-x-[15px] mr-[20px] mb-[15px] border-2 cursor-pointer rounded-full"
            style={{ borderColor: "#2D2D2D", borderWidth: "1px" }}
          >
            <Image src={Profile} alt="itsprofile" />
            <Image
              src={Parrow}
              alt="dropdown arrow"
              onClick={toggleProfiledown}
            />
          </div>

          {isProfileOpen && (
            <div
              className="absolute top-[110%] left-[36%] xl:top-[60px] xl:left-[82%] w-[234px] h-[380px] bg-[#222222] space-y-[20px]  rounded-[12px] shadow-lg p-[8px] z-50 text-white sm:left-[62%] md:left-[68%]"
              // style={{ border: "1px solid #2D2D2D" }}
            >
              {profileOptions.map((item, index) => (
                <div
                  key={index}
                  onClick={item.action}
                  className="flex justify-between items-center cursor-pointer hover:text-[#4DF2BE] text-[16px] font-medium"
                >
                  <span className="flex  items-center space-x-2">
                    <Image
                      src={item.icon}
                      alt={item.name}
                      width={20}
                      height={20}
                    />
                    <span
                      className={`ml-[10px] text-[16px] font-[500] ${
                        item.name === "Verify me"
                          ? "text-[#FE857D]"
                          : "text-[#FCFCFC]"
                      }`}
                    >
                      {item.name}
                    </span>
                  </span>
                  {item.tier && (
                    <span
                      className="bg-[#3A3A3A]  flex items-center w-[55px] text-center justify-center h-[22px] text-[12px] font-[500] text-[#DBDBDB]  rounded-[16px]"
                      style={{ padding: "2px 8px" }}
                    >
                      {item.tier}
                    </span>
                  )}
                </div>
              ))}
              <hr className="border-[#333]" />
              <div className="flex items-center space-x-2 text-[#FE857D] cursor-pointer hover:underline">
                <Image src={Logout} alt="logout" width={20} height={20} />
                <span className="ml-[10px] text-[16px] font-[500] text-[#FE857D]">
                  Logout
                </span>
              </div>
            </div>
          )}
        </div>
      </nav>
      <div className="lg:hidden md:hidden">
        <div className=" cursor-pointer text-[28px] mt-[-20px] mb-[10px]">
          <FaBars />
        </div>
      </div>
    </>
  );
};

export default Nav;
