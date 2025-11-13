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
import Switch from "../../public/Assets/Evolve2p_switch/Profile/elements.svg";
import Logout from "../../public/Assets/Evolve2p_logouticon/elements.svg";

const Nav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // 🟢 New state for modal

  const toggleProfiledown = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const handleLogout = () => {
    // 🟢 Clear localStorage and redirect
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    router.push("/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Wallet", path: "/wallet" },
    { name: "Marketplace", path: "/market_place" },
    { name: "Trade history", path: "/tradehistory" },
    { name: "Support", path: "/support" },
  ];

  const profileOptions = [
    { name: "Verify me", icon: VerifyIcon, action: () => {} },
    { name: "My Profile", icon: ProfileIcon, action: () => router.push("/profile") },
    { name: "Account Level", icon: LevelIcon, tier: "Tier 1", action: () => router.push("/accountL") },
    { name: "Notifications", icon: SettingsIcon, action: () => router.push("/notifications") },
    { name: "My Transactions", icon: TransactionsIcon, action: () => router.push("/transactions") },
    { name: "Transaction Limit", icon: LimitIcon, action: () => router.push("/translim") },
    { name: "Trade History", icon: HistoryIcon, action: () => router.push("/tradehistory") },
  ];

  return (
    <nav className="flex items-center relative">
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
              }}
            >
              {link.name}
            </li>
          );
        })}
      </ul>

      <div className="flex items-center space-x-[10px] ml-auto mr-[20px]">
        {/* Bell */}
        <div
          className="w-[30px] h-[25px] justify-center flex items-center bg-transparent mt-[10px] mr-[20px] mb-[10px] relative border rounded-full"
          style={{ borderColor: "#2D2D2D", borderWidth: "1px" }}
        >
          <Image src={Bell} alt="bell" />
          <span className="absolute text-[10px] -top-[1.5px] -right-[-1.5px] w-[10px] h-[12px] bg-[red] font-[500] rounded-full flex items-center justify-center text-[#fff]">
            0
          </span>
        </div>

        {/* Profile Dropdown */}
        <div
          className="flex w-[40px] h-[25px] items-center bg-transparent mt-[10px] pr-[5px] space-x-[15px] mr-[20px] mb-[15px] border rounded-full"
          style={{ borderColor: "#2D2D2D", borderWidth: "1px" }}
        >
          <Image src={Profile} alt="itsprofile" />
          <Image src={Parrow} alt="dropdown arrow" onClick={toggleProfiledown} className="cursor-pointer" />
        </div>

        {isProfileOpen && (
          <div
            className="absolute top-[100px] left-[80%] w-[234px] h-[337px] bg-[#222222] space-y-[20px] rounded-[12px] shadow-lg p-[8px] z-50 text-white"
            style={{ border: '1px solid #2D2D2D' }}
          >
            {profileOptions.map((item, index) => (
              <div
                key={index}
                onClick={item.action}
                className="flex justify-between items-center cursor-pointer hover:text-[#4DF2BE] text-[16px] font-medium"
              >
                <span className="flex items-center space-x-2">
                  <Image src={item.icon} alt={item.name} width={20} height={20} />
                  <span
                    className={`ml-[10px] text-[16px] font-[500] ${
                      item.name === "Verify me" ? "text-[#FE857D]" : "text-[#FCFCFC]"
                    }`}
                  >
                    {item.name}
                  </span>
                </span>
                {item.tier && (
                  <span
                    className="bg-[#3A3A3A] flex items-center w-[43px] h-[22px] text-[12px] font-[500] text-[#DBDBDB] rounded-[16px]"
                    style={{ padding: '2px 8px' }}
                  >
                    {item.tier}
                  </span>
                )}
              </div>
            ))}
            <hr className="border-[#333]" />

            {/* Logout Button - opens modal */}
            <div
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center space-x-2 text-[#FE857D] cursor-pointer hover:underline"
            >
              <Image src={Logout} alt="logout" width={20} height={20} />
              <span className="ml-[10px] text-[16px] font-[500] text-[#FE857D]">Logout</span>
            </div>
          </div>
        )}
      </div>

      {/* 🟢 Logout Confirmation Modal */}
       {showLogoutModal && (
        <div className="fixed inset-0 top-[80px] ml-[40%] flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-[#0F1012] rounded-[16px] w-[420px] h-[485px] text-center text-white shadow-lg">
            <div className="flex items-center h-[108px] justify-center p-[36px_126px_16px_126px]">
              <Image
                src={Switch}
                alt="switch"
                className="p-[2.334px_4.667px_2.333px_4.667px] w-[56px] h-[56px]"
              />
            </div>

            <div className="flex flex-col items-center h-[152px] p-[24px_20px]">
              <h2 className="text-[20px] font-[700] text-[#FFFFFF]">
                Are you sure you want to log out?
              </h2>
              <p className="text-[#C7C7C7] text-[16px] font-[400]">
                You are about to log out of your account. Make sure you’ve saved any
                important information before proceeding.
              </p>
            </div>

            <div className="h-[148px] space-y-[10px] p-[8px_0_32px_0]">
              <button
                onClick={handleLogout} // ✅ logs out and redirects
                className="w-[380px] h-[48px] bg-[#FE857D] text-[14px] border-[1px] border-[#FE857D] rounded-full text-[#0F1012] font-[700] mb-3"
              >
                Log out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-[380px] h-[48px] bg-[#2D2D2D] text-[#FFFFFF] rounded-full border-none text-[14px] font-[700]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Nav;
