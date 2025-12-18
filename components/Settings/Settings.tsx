"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import E2p_logo from "../../public/Assets/Evolve2p_E2p/Profile/Logo.svg";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import Lg_arrow from "../../public/Assets/Evolve2p_Lgarrow/Profile/arrow-right-01.svg";
import Arrow_great from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Gbell from "../../public/Assets/Evolve2p_Gbell/Profile/elements.svg";
import Profile from "../../public/Assets/Evolve2p_G_AccountL/Profile/user-check-01.svg";
import Gclock from "../../public/Assets/Evolve2p_Gclock/Profile/elements.svg";
import Changep from "../../public/Assets/Evolve2p_changeP/Profile/elements.svg";
import Glocked from "../../public/Assets/Evolve2p_Glocked/Profile/locked.svg";
import Gpin from "../../public/Assets/Evolve2p_Gpin/Profile/pin-code.svg";
import Ghead from "../../public/Assets/Evolve2p_Ghead/Profile/elements.svg";
import Logout from "../../public/Assets/Evolve2p_logouticon/elements.svg";
import Switch from "../../public/Assets/Evolve2p_switch/Profile/elements.svg";

const Settings = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [clientUser, setClientUser] = useState<{ 
    username?: string; 
    kycVerified?: boolean;
    verificationStatus?: string;
    isVerified?: boolean;
  } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("UserData");
      if (stored) {
        const parsed = JSON.parse(stored);
        const userData = parsed?.userData || parsed;
        setClientUser(userData);
      }
    }
  }, []);

  const username =
    clientUser?.username
      ? clientUser.username.startsWith("@")
        ? clientUser.username
        : `@${clientUser.username}`
      : "@User";

  // Check if user is verified
  const isUserVerified = () => {
    if (!clientUser) return false;
    
    // Check multiple possible verification fields
    return clientUser.kycVerified === true || 
           clientUser.verificationStatus === 'verified' || 
           clientUser.isVerified === true ||
           clientUser.verificationStatus === 'approved';
  };

  // ✅ Logout handler
  const handleLogout = () => {
    try {
      localStorage.removeItem("UserData");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userPassword");
      setShowLogoutModal(false);
      router.push("/login"); // redirect to login
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  // Menu items data for better organization
  const menuSections = [
    {
      title: "ACCOUNT",
      items: [
        {
          href: "/account_ver",
          icon: Profile,
          label: "Account Verification",
          path: "/account_ver",
          showVerificationStatus: true,
          isVerified: isUserVerified()
        },
        {
          href: "/translim",
          icon: Gclock,
          label: "Transaction Limits",
          path: "/translim"
        }
      ]
    },
    {
      title: "SECURITY",
      items: [
        {
          href: "/changep",
          icon: Changep,
          label: "Change Password",
          path: "/changep"
        },
        {
          href: "/tfa",
          icon: Glocked,
          label: "Two Factor Authentication",
          path: "/tfa"
        },
        {
          href: "/change-pin",
          icon: Gpin,
          label: "Change your Security PIN",
          path: "/change-pin"
        }
      ]
    },
    {
      title: "OTHERS",
      items: [
        {
          href: "/support",
          icon: Ghead,
          label: "Talk to support",
          path: "/support"
        }
      ]
    }
  ];

  return (
    <div>
      {/* Mobile Menu Button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="w-full bg-[#222222] text-white p-3 rounded-lg flex items-center justify-between"
        >
          <span className="text-lg font-bold">Settings Menu</span>
          <svg
            className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Settings Sidebar */}
      <div className={`
        bg-[#222222] border-r-[2px] border-r-[#3A3A3A]
        ${isMobileMenuOpen ? 'block' : 'hidden'} 
        lg:block lg:w-64 xl:w-80
        w-full max-h-[80vh] lg:max-h-none overflow-y-auto
      `}>
        <div className="p-3 lg:p-4">
          <p className="text-xl lg:text-2xl font-bold text-white">Settings</p>
        </div>

        <div className="p-3 lg:p-4 space-y-4 lg:space-y-6">
          {/* Profile */}
          <Link href="/profile" className="no-underline" onClick={() => setIsMobileMenuOpen(false)}>
            <div
              className={`flex items-center gap-3 h-16 lg:h-20 p-3 rounded-lg cursor-pointer transition-colors duration-300 ${
                pathname.startsWith("/profile") ? "bg-[#20342E]" : "bg-[#2D2D2D]"
              }`}
            >
              <Image src={E2p_logo} alt="e2p" className="w-6 h-6 lg:w-7 lg:h-7" />
              <div className="flex items-center justify-between flex-1">
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <p
                      className={`text-sm lg:text-base font-medium ${
                        pathname.startsWith("/profile")
                          ? "text-[#4DF2BE]"
                          : "text-[#DBDBDB]"
                      }`}
                    >
                      {username}
                    </p>
                    <Image
                      src={Mark_green}
                      alt="mark"
                      className="ml-2 w-3 h-3"
                    />
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      pathname.startsWith("/profile")
                        ? "text-[#4DF2BE]"
                        : "text-[#DBDBDB]"
                    }`}
                  >
                    Your unique Identity
                  </p>
                </div>
                <Image src={Lg_arrow} alt="lgarrow" className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
            </div>
          </Link>

          {/* Menu Sections */}
          {menuSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="space-y-2">
              <p className="text-xs font-medium mt-[20px] text-[#C7C7C7] uppercase tracking-wide">
                {section.title}
              </p>
              
              <div className="space-y-px rounded-lg overflow-hidden">
                {section.items.map((item, itemIndex) => (
                  <Link 
                    key={itemIndex} 
                    href={item.href} 
                    className="no-underline"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <div
                      className={`flex flex-col p-3 cursor-pointer transition-colors ${
                        pathname.startsWith(item.path)
                          ? "bg-[#20342E]"
                          : "bg-[#2D2D2D] hover:bg-[#3A3A3A]"
                      }`}
                    >
                      {/* Main content row */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 lg:gap-4">
                          <Image 
                            src={item.icon} 
                            alt={item.label} 
                            className="w-5 h-5 lg:w-6 lg:h-6" 
                          />
                          <p
                            className={`text-sm lg:text-base font-medium ${
                              pathname.startsWith(item.path)
                                ? "text-[#4DF2BE]"
                                : "text-[#DBDBDB]"
                            }`}
                          >
                            {item.label}
                          </p>
                        </div>
                        <Image 
                          src={Arrow_great} 
                          alt="arrow" 
                          className="w-3 h-3 lg:w-4 lg:h-4" 
                        />
                      </div>
                      
                      {/* Verification status row (only for Account Verification) */}
                      {item.showVerificationStatus && (
                        <div className="mt-2 ml-8 lg:ml-10">
                          <span className={`text-xs ${
                            item.isVerified ? "text-[#4DF2BE]" : "text-[#FE857D]"
                          }`}>
                            {item.isVerified ? "✓ Verified" : "Not Verified"}
                          </span>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Logout Section */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-[#C7C7C7] uppercase tracking-wide">
              SESSION
            </p>
            
            <div 
              className="flex items-center justify-between h-16 lg:h-20 bg-[#2D2D2D] rounded-lg p-3 cursor-pointer hover:bg-[#3A3A3A] transition-colors"
              onClick={() => setShowLogoutModal(true)}
            >
              <div className="flex items-center gap-3 lg:gap-4">
                <Image src={Logout} alt="logout" className="w-5 h-5 lg:w-6 lg:h-6" />
                <div>
                  <p className="text-sm lg:text-base font-medium text-[#FE857D]">
                    Logout
                  </p>
                  <p className="text-xs text-[#DBDBDB] mt-1">
                    Version 1.0
                  </p>
                </div>
              </div>
              <Image src={Arrow_great} alt="arrow" className="w-3 h-3 lg:w-4 lg:h-4" />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Logout Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-[#0F1012] rounded-2xl w-full max-w-md text-center text-white shadow-lg">
            {/* Header */}
            <div className="flex items-center justify-center p-6 lg:p-8">
              <Image
                src={Switch}
                alt="switch"
                className="w-12 h-12 lg:w-14 lg:h-14"
              />
            </div>

            {/* Content */}
            <div className="px-4 lg:px-6 pb-4">
              <h2 className="text-lg lg:text-xl font-bold text-white mb-3">
                Are you sure you want to log out?
              </h2>
              <p className="text-[#C7C7C7] text-sm lg:text-base font-normal leading-relaxed">
                You are about to log out of your account. Make sure you've saved any
                important information before proceeding.
              </p>
            </div>

            {/* Buttons */}
            <div className="p-4 lg:p-6 space-y-3">
              <button
                onClick={handleLogout}
                className="w-full h-12 bg-[#FE857D] text-sm lg:text-base border border-[#FE857D] rounded-full text-[#0F1012] font-bold transition-opacity hover:opacity-90"
              >
                Log out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full h-12 bg-[#2D2D2D] text-white rounded-full border-none text-sm lg:text-base font-bold transition-colors hover:bg-[#3A3A3A]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;