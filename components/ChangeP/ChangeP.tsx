'use client';
import Nav from "../NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Image from "next/image";
import image from '../../public/Assets/Evolve2p_viewslash/view-off-slash.png';
import schecklistInactive from '../../public/Assets/Evolve2p_checklist2/checklist-inactive.svg';
import schecklistActive from '../../public/Assets/Evolve2p_checklist2/checklist-active.svg';
import ModalC from '../../public/Assets/Evolve2p_modalC/elements.png';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Footer from "../../components/Footer/Footer";

const ChangeP = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // ✅ Load user info from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("UserData");
      if (!stored) {
        setError("Please login first");
        setTimeout(() => router.push("/Logins/login"), 1500);
        return;
      }
      const parsed = JSON.parse(stored);
      const email = parsed?.userData?.email || parsed?.email;
      const accessToken = parsed?.accessToken;
      setUserEmail(email);
      setToken(accessToken);
    }
  }, [router]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (error) setError("");
  };

  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
    if (error) setError("");
  };

  // ✅ Validation checks
  const isMinLength = password.length >= 6;
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasUpperLower = /(?=.*[a-z])(?=.*[A-Z])/.test(password);
  const passwordsMatch = password === confirmPassword;
  const allFieldsValid = () =>
    isMinLength && hasNumber && hasSpecialChar && hasUpperLower && passwordsMatch;

  const handleSubmit = async () => {
    if (!userEmail) {
      setError("User email not found. Please log in again.");
      return;
    }

    if (!isMinLength || !hasNumber || !hasSpecialChar || !hasUpperLower) {
      setError("Please meet all password requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords don't match");
      return;
    }

    setIsLoading(true);

    try {
      const updateBody = {
        email: userEmail,
        currentPassword,
        newPassword: password,
      };

      const res = await fetch("https://evolve2p-backend.onrender.com/api/change-password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(updateBody),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || data.message || "Failed to change password. Please try again.");
        return;
      }

      setShowSuccessModal(true);
    } catch (error) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToProfile = () => router.push("/profile");

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Nav />
        
        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Settings Sidebar */}
          <div className="lg:w-64">
            <Settings />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#1A1A1A] rounded-xl p-4 lg:p-8">
            <p className="text-xl lg:text-2xl font-bold text-white mb-6 lg:mb-8">
              Change Password
            </p>

            {/* ✅ Password Form */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="w-full max-w-lg">
                <h1 className="text-xl lg:text-2xl font-bold text-white mb-2">
                  Change Your Password
                </h1>
                <p className="text-sm lg:text-base text-[#8F8F8F] mb-6 lg:mb-8">
                  Create a strong password to protect your trades and funds.
                </p>

                {error && (
                  <div className="text-red-400 text-sm lg:text-base font-medium mb-4 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                    {error}
                  </div>
                )}

                {/* ✅ Current Password */}
                <div className="mb-4 lg:mb-6">
                  <label className="block text-sm font-medium text-[#8F8F8F] mb-2">
                    Current password
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={handleCurrentPasswordChange}
                      className="w-full h-12 lg:h-14 bg-[#222222] text-white text-sm lg:text-base outline-none border pl-4 pr-12 rounded-lg border-[#2E2E2E] focus:border-[#4DF2BE] transition-colors"
                      placeholder="Enter your current password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#DBDBDB] hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      <Image src={image} alt="Toggle password visibility" width={20} height={20} />
                    </button>
                  </div>
                </div>

                {/* ✅ New Password */}
                <div className="mb-4 lg:mb-6">
                  <label className="block text-sm font-medium text-[#8F8F8F] mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={handlePasswordChange}
                      className={`w-full h-12 lg:h-14 bg-[#222222] text-white text-sm lg:text-base outline-none border pl-4 pr-12 rounded-lg transition-colors ${
                        error && (!isMinLength || !hasNumber || !hasSpecialChar || !hasUpperLower)
                          ? "border-[#F5918A]"
                          : "border-[#2E2E2E] focus:border-[#4DF2BE]"
                      }`}
                      placeholder="Enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#DBDBDB] hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      <Image src={image} alt="Toggle password visibility" width={20} height={20} />
                    </button>
                  </div>
                </div>

                {/* ✅ Password Checklist */}
                <div className="mb-4 lg:mb-6">
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-3">
                      <Image 
                        src={isMinLength ? schecklistActive : schecklistInactive} 
                        alt="check list" 
                        width={16} 
                        height={16} 
                      />
                      <span className={isMinLength ? "text-white" : "text-[#8F8F8F]"}>
                        Minimum 6 characters
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Image 
                        src={hasNumber ? schecklistActive : schecklistInactive} 
                        alt="check list" 
                        width={16} 
                        height={16} 
                      />
                      <span className={hasNumber ? "text-white" : "text-[#8F8F8F]"}>
                        At least 1 number
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Image 
                        src={hasSpecialChar ? schecklistActive : schecklistInactive} 
                        alt="check list" 
                        width={16} 
                        height={16} 
                      />
                      <span className={hasSpecialChar ? "text-white" : "text-[#8F8F8F]"}>
                        At least 1 special character
                      </span>
                    </li>
                    <li className="flex items-center gap-3">
                      <Image 
                        src={hasUpperLower ? schecklistActive : schecklistInactive} 
                        alt="check list" 
                        width={16} 
                        height={16} 
                      />
                      <span className={hasUpperLower ? "text-white" : "text-[#8F8F8F]"}>
                        1 uppercase and 1 lowercase letter
                      </span>
                    </li>
                  </ul>
                </div>

                {/* ✅ Confirm Password */}
                <div className="mb-6 lg:mb-8">
                  <label className="block text-sm font-medium text-[#8F8F8F] mb-2">
                    Confirm New password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      className={`w-full h-12 lg:h-14 bg-[#222222] text-white text-sm lg:text-base outline-none border pl-4 pr-12 rounded-lg transition-colors ${
                        error && !passwordsMatch ? "border-[#F5918A]" : "border-[#2E2E2E] focus:border-[#4DF2BE]"
                      }`}
                      placeholder="Re-enter your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#DBDBDB] hover:text-white transition-colors"
                      disabled={isLoading}
                    >
                      <Image src={image} alt="Toggle password visibility" width={20} height={20} />
                    </button>
                  </div>
                </div>

                {/* ✅ Submit Button */}
                <button
                  className={`w-full h-12 lg:h-14 border-none bg-[#4DF2BE] text-[#0F1012] font-semibold rounded-lg hover:bg-[#3fe0ad] transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm lg:text-base`}
                  onClick={handleSubmit}
                  disabled={!allFieldsValid() || isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-[#0F1012] border-t-transparent rounded-full animate-spin"></div>
                      Changing Password...
                    </div>
                  ) : (
                    'Continue'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
            <div className="bg-[#0F1012] rounded-xl p-6 lg:p-8 w-full max-w-md text-center border border-[#2E2E2E]">
              <Image 
                src={ModalC} 
                alt="Success Icon" 
                className="w-14 h-14 lg:w-16 lg:h-16 mx-auto mb-4" 
              />
              <h2 className="text-lg lg:text-xl font-bold text-white mb-2">
                Password Updated!
              </h2>
              <p className="text-sm lg:text-base text-[#8F8F8F] mb-6">
                Your password has been changed successfully. Use your new password to log in next time.
              </p>
              <button
                onClick={handleGoToProfile}
                className="w-full h-12 bg-[#4DF2BE] text-[#0F1012] font-bold rounded-lg hover:bg-[#3fe0ad] transition-colors text-sm lg:text-base"
              >
                Back to Profile
              </button>
            </div>
          </div>
        )}

         <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] mt-[10%] ">
                  <Footer />
                </div>
      </div>
    </main>
  );
};

export default ChangeP;