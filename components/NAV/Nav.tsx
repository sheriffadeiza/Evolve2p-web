"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import Bell from "../../public/Assets/Evolve2p_bell/elements.svg";
import Profile from "../../public/Assets/Evolve2p_profile/Dashboard/elements.svg";
import Logo from "../../public/Assets/Evolve2p_logods/Dashboard/Logo.svg";
import Parrow from "../../public/Assets/Evolve2p_pArrow/elements.svg";
import VerifyIcon from "../../public/Assets/Evolve2p_vericon/elements.svg";
import ProfileIcon from "../../public/Assets/Evolve2p_proicon/user-circle.svg";
import SettingsIcon from "../../public/Assets/Evolve2p_setticon/setting-07.svg";
import TransactionsIcon from "../../public/Assets/Evolve2p_transicon/elements.svg";
import LimitIcon from "../../public/Assets/Evolve2p_limicon/elements.svg";
import HistoryIcon from "../../public/Assets/Evolve2p_trahisicon/elements.svg";
import Switch from "../../public/Assets/Evolve2p_switch/Profile/elements.svg";
import Logout from "../../public/Assets/Evolve2p_logouticon/elements.svg";

// Safe localStorage access (returns null on error or server)
const getStoredUser = () => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem("UserData");
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    return parsed?.userData || parsed;
  } catch {
    return null;
  }
};

const Nav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isVerified, setIsVerified] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Load user data once on mount
  useEffect(() => {
    const user = getStoredUser();
    setIsVerified(!!user?.kycVerified);
    if (user?.notifications) {
      setNotificationCount(user.notifications.length);
    }
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const toggleProfile = useCallback(() => {
    setIsProfileOpen(prev => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("UserData");
    router.push("/Logins/login");
  }, [router]);

  // Navigation links – static
  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Wallet", path: "/wallet" },
    { name: "Marketplace", path: "/market_place" },
    { name: "Trade history", path: "/tradehistory" },
    { name: "Support", path: "/support" },
  ];

  // All profile options (including Verify me) – always rendered
  const profileOptions = [
    {
      name: "Verify me",
      icon: VerifyIcon,
      path: "/Signups/KYC",
      special: true,
    },
    { name: "My Profile", icon: ProfileIcon, path: "/profile" },
    { name: "Notifications", icon: SettingsIcon, path: "/bell_notify" },
    { name: "My Transactions", icon: TransactionsIcon, path: "/transactions" },
    { name: "Transaction Limit", icon: LimitIcon, path: "/translim" },
    { name: "Trade History", icon: HistoryIcon, path: "/tradehistory" },
  ];

  return (
    <>
      <nav className="w-full bg-[#0F1012] border-b border-[#2D2D2D] py-4 px-4 sm:px-6 lg:px-8 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image
              src={Logo}
              alt="logo"
              width={109}
              height={32}
              className="w-32 h-auto cursor-pointer"
              onClick={() => router.push("/dashboard")}
              priority
            />
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden lg:flex items-center space-x-2 xl:space-x-4 text-white list-none">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <li
                  key={link.name}
                  onClick={() => router.push(link.path)}
                  className={`cursor-pointer transition-all duration-200 rounded-full px-4 py-2 text-sm font-medium
                    ${
                      isActive
                        ? "bg-[#2D2D2D] text-[#4DF2BE]"
                        : "text-[#DBDBDB] hover:text-[#FCFCFC] hover:bg-[#2D2D2D]"
                    }
                  `}
                >
                  {link.name}
                </li>
              );
            })}
          </ul>

          {/* Right Section – Icons & Profile */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <div
                onClick={() => router.push("/bell_notify")}
                className="relative w-10 h-10 flex items-center justify-center bg-transparent border border-[#2D2D2D] rounded-full cursor-pointer hover:bg-[#2D2D2D] transition-colors"
              >
                <Image src={Bell} alt="bell" width={20} height={20} className="w-5 h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-white rounded-full flex items-center justify-center text-[10px] font-bold shadow-md">
                    {notificationCount}
                  </span>
                )}
              </div>
            </div>

            {/* Profile Dropdown */}
            <div className="relative profile-trigger" ref={profileRef}>
              <div
                className="flex items-center space-x-2 bg-transparent border border-[#2D2D2D] rounded-full px-3 py-2 cursor-pointer hover:bg-[#2D2D2D] transition-colors"
                onClick={toggleProfile}
              >
                <Image src={Profile} alt="profile" width={20} height={20} className="w-5 h-5" />
                <Image
                  src={Parrow}
                  alt="dropdown arrow"
                  width={16}
                  height={16}
                  className={`transition-transform w-4 h-4 ${isProfileOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {isProfileOpen && (
                <div className="profile-dropdown absolute top-full right-0 mt-2 w-64 bg-[#222222] rounded-xl shadow-lg border border-[#333] p-4 z-50 space-y-3">
                  {profileOptions.map((item, index) => {
                    // Hide "Verify me" if already verified
                    if (item.special && isVerified) return null;
                    return (
                      <div
                        key={index}
                        onClick={() => {
                          router.push(item.path);
                          setIsProfileOpen(false);
                        }}
                        className="flex justify-between items-center cursor-pointer hover:text-[#4DF2BE] transition-colors p-2 rounded-lg hover:bg-[#2D2D2D]"
                      >
                        <div className="flex items-center space-x-3">
                          <Image src={item.icon} alt={item.name} width={20} height={20} className="w-5 h-5" />
                          <span
                            className={`text-sm font-medium ${
                              item.special ? "text-[#FE857D]" : "text-[#FCFCFC]"
                            }`}
                          >
                            {item.name}
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  <hr className="border-[#333]" />

                  <div
                    className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#2D2D2D] transition-colors"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <Image src={Logout} alt="logout" width={20} height={20} className="w-5 h-5" />
                    <span className="text-sm font-medium text-[#FE857D]">Logout</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden mobile-menu-trigger text-2xl text-white p-2 hover:bg-[#2D2D2D] rounded-full transition-colors"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          ref={mobileMenuRef}
          className={`lg:hidden mobile-menu fixed top-0 right-0 h-full w-80 bg-[#1A1A1A] border-l border-[#2D2D2D] z-50 transform transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between p-6 border-b border-[#2D2D2D]">
            <Image src={Logo} alt="logo" width={109} height={32} className="w-32 h-auto" priority />
            <button
              onClick={toggleMobileMenu}
              className="text-2xl text-white p-2 hover:bg-[#2D2D2D] rounded-full transition-colors"
              aria-label="Close menu"
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <div
                  key={link.name}
                  onClick={() => {
                    router.push(link.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`cursor-pointer transition-all duration-200 rounded-lg px-4 py-4 text-base font-medium border-l-4 ${
                    isActive
                      ? "bg-[#2D2D2D] text-[#4DF2BE] border-[#4DF2BE]"
                      : "text-[#DBDBDB] hover:text-[#FCFCFC] hover:bg-[#2D2D2D] border-transparent"
                  }`}
                >
                  {link.name}
                </div>
              );
            })}
          </div>
        </div>

        {/* Overlay when mobile menu is open */}
        {isMobileMenuOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleMobileMenu}
          />
        )}
      </nav>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
          <div className="bg-[#0F1012] rounded-2xl max-w-md w-full text-center text-white shadow-lg border border-[#333]">
            <div className="flex items-center justify-center p-8">
              <Image src={Switch} alt="switch" width={56} height={56} className="w-14 h-14" />
            </div>
            <div className="px-6 pb-6">
              <h2 className="text-xl font-bold text-white mb-3">
                Are you sure you want to log out?
              </h2>
              <p className="text-[#C7C7C7] text-base">
                You are about to log out of your account. Make sure you've saved any
                important information before proceeding.
              </p>
            </div>
            <div className="p-6 space-y-3">
              <button
                onClick={handleLogout}
                className="w-full bg-[#FE857D] text-[#0F1012] py-3 rounded-full font-bold text-sm border border-[#FE857D] hover:bg-[#e5746d] transition-colors"
              >
                Log out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full bg-[#2D2D2D] text-white py-3 rounded-full font-bold text-sm hover:bg-[#3A3A3A] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;