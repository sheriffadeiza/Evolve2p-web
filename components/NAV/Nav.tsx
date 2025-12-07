"use client";
import React, { useState, useEffect } from "react";
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

const Nav: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [clientUser, setClientUser] = useState<{ kycVerified?: boolean } | null>(null);
  const [notificationCount, setNotificationCount] = useState(0);


 useEffect(() => {
  setIsMounted(true);

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("UserData");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const userData = parsed?.userData || parsed;

        setClientUser(userData);

        // Load notifications count
      if (Array.isArray(parsed?.userData?.notifications)) {
  setNotificationCount(parsed.userData.notifications.length);
} else {
  setNotificationCount(0);
}
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }
}, []);

  const toggleProfiledown = () => {
    setIsProfileOpen((prev) => !prev);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userData");
    localStorage.removeItem("UserData");
    router.push("/Logins/login");
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Wallet", path: "/wallet" },
    { name: "Marketplace", path: "/market_place" },
    { name: "Trade history", path: "/tradehistory" },
    { name: "Support", path: "/support" },
  ];

  const profileOptions = [
    { name: "My Profile", icon: ProfileIcon, action: () => router.push("/profile") },
    { name: "Notifications", icon: SettingsIcon, action: () => router.push("/notifications") },
    { name: "My Transactions", icon: TransactionsIcon, action: () => router.push("/transactions") },
    { name: "Transaction Limit", icon: LimitIcon, action: () => router.push("/translim") },
    { name: "Trade History", icon: HistoryIcon, action: () => router.push("/tradehistory") },
  ];

  // Add Verify Me option conditionally
  if (!clientUser?.kycVerified) {
    profileOptions.unshift({
      name: "Verify me",
      icon: VerifyIcon,
      action: () => {} // Add your verification route here if needed
    });
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.profile-dropdown') && !target.closest('.profile-trigger')) {
        setIsProfileOpen(false);
      }
      if (!target.closest('.mobile-menu') && !target.closest('.mobile-menu-trigger')) {
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

  if (!isMounted) {
    return (
      <nav className="w-full bg-[#0F1012] border-b border-[#2D2D2D] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="w-32 h-8 bg-[#2D2D2D] rounded animate-pulse"></div>
        </div>
      </nav>
    );
  }

  return ( 
    <>
      <nav className="w-full bg-[#0F1012] border-b border-[#2D2D2D] py-4 px-4 sm:px-6 lg:px-8 relative z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Image 
              src={Logo} 
              alt="logo" 
              className="w-32 h-8 cursor-pointer"
              onClick={() => router.push("/dashboard")}
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

          {/* Right Section - Icons & Profile */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
  <div
    onClick={() => router.push("/bell_notify")}
    className="relative w-10 h-10 flex items-center justify-center bg-transparent border border-[#2D2D2D] rounded-full cursor-pointer hover:bg-[#2D2D2D] transition-colors"
  >
    <Image src={Bell} alt="bell" width={20} height={20} />

    {notificationCount > 0 && (
      <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 
  bg-red-500 text-white-600 rounded-full 
  flex items-center justify-center text-[10px] font-bold shadow-md">
  {notificationCount}
</span>
    )}
  </div>
</div>


            {/* Profile Dropdown */}
            <div className="relative profile-trigger">
              <div
                className="flex items-center space-x-2 bg-transparent border border-[#2D2D2D] rounded-full px-3 py-2 cursor-pointer hover:bg-[#2D2D2D] transition-colors"
                onClick={toggleProfiledown}
              >
                <Image src={Profile} alt="profile" width={20} height={20} />
                <Image
                  src={Parrow}
                  alt="dropdown arrow"
                  width={16}
                  height={16}
                  className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}
                />
              </div>

              {isProfileOpen && (
                <div className="profile-dropdown absolute top-full right-0 mt-2 w-64 bg-[#222222] rounded-xl shadow-lg border border-[#333] p-4 z-50 space-y-3">
                  {profileOptions.map((item, index) => (
                    <div
                      key={index}
                      onClick={item.action}
                      className="flex justify-between items-center cursor-pointer hover:text-[#4DF2BE] transition-colors p-2 rounded-lg hover:bg-[#2D2D2D]"
                    >
                      <div className="flex items-center space-x-3">
                        <Image
                          src={item.icon}
                          alt={item.name}
                          width={20}
                          height={20}
                        />
                        <span
                          className={`text-sm font-medium ${
                            item.name === "Verify me"
                              ? "text-[#FE857D]"
                              : "text-[#FCFCFC]"
                          }`}
                        >
                          {item.name}
                        </span>
                      </div>
                    </div>
                  ))}
                  
                  <hr className="border-[#333]" />
                  
                  <div 
                    className="flex items-center space-x-3 cursor-pointer p-2 rounded-lg hover:bg-[#2D2D2D] transition-colors"
                    onClick={() => setShowLogoutModal(true)}
                  >
                    <Image src={Logout} alt="logout" width={20} height={20} />
                    <span className="text-sm font-medium text-[#FE857D]">
                      Logout
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden mobile-menu-trigger text-2xl text-white p-2 hover:bg-[#2D2D2D] rounded-full transition-colors"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile Menu - Only shows the 5 navigation items */}
        <div className={`lg:hidden mobile-menu fixed top-0 right-0 h-full w-80 bg-[#1A1A1A] border-l border-[#2D2D2D] z-50 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          {/* Header with close button */}
          <div className="flex items-center justify-between p-6 border-b border-[#2D2D2D]">
            <Image 
              src={Logo} 
              alt="logo" 
              className="w-32 h-8"
            />
            <button 
              onClick={toggleMobileMenu}
              className="text-2xl text-white p-2 hover:bg-[#2D2D2D] rounded-full transition-colors"
            >
              <FaTimes />
            </button>
          </div>

          {/* Navigation Links - Only the 5 specified items */}
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

          {/* REMOVED the profile section at the bottom */}
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
              <Image
                src={Switch}
                alt="switch"
                width={56}
                height={56}
              />
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