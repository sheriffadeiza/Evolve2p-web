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
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />
        <div className="flex items-center mt-[20px] mr-[40px]">
          <Settings />

          {/* Right Side */}
          <div className="w-[809px] h-[865px] bg-[#1A1A1A] gap-[20px] p-[24px_64px]">
            <p className="text-[24px] font-[700] text-[#FFFFFF]">Change Password</p>

            {/* ✅ Success Modal */}
            {showSuccessModal && (
              <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="bg-[#0F1012] p-8 rounded-[10px] w-[375px] h-[300px] flex flex-col items-center justify-center">
                  <Image src={ModalC} alt="Success Icon" width={58.001} height={58} />
                  <h2 className="text-[20px] text-[#FCFCFC] font-[700] mb-2">Password Updated!</h2>
                  <p className="text-[16px] font-[400] text-[#8F8F8F] mb-6 text-center">
                    Your password has been changed successfully. Use your new password to log in next time.
                  </p>
                  <button
                    onClick={handleGoToProfile}
                    className="w-[356px] h-[48px] bg-[#4DF2BE] mt-[30px] text-[14px] text-[#0F1012] border-none font-[700] py-3 rounded-[100px] hover:bg-[#3dd9ab] transition"
                  >
                    Back to Profile
                  </button>
                </div>
              </div>
            )}

            {/* ✅ Password Form */}
            <div className="flex flex-col ml-[150px]">
              <h1 className="text-[24px] text-[#FCFCFC] font-[700]">Change Your Password</h1>
              <p className="text-[16px] font-[400] mt-[-10px] text-[#8F8F8F] whitespace-nowrap">
                Create a strong password to protect your trades and funds.
              </p>

              {error && (
                <div className="text-[#FCFCFC] text-[20px] font-[700] mt-4 mb-2">
                  {error}
                </div>
              )}

              {/* ✅ Current Password */}
              <label className="block text-[14px] mt-[30px] font-[500] text-[#8F8F8F] mb-[10px]">
                Current password
              </label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={handleCurrentPasswordChange}
                  className="w-[380px] h-[56px] bg-[#222222] text-[#DBDBDB] text-[14px] font-[500] outline-none border mb-4 pl-[15px] pr-10 rounded-[10px] border-[#2E2E2E]"
                  placeholder="Enter your current password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute border-0 right-2 ml-[-40px] top-[50%] bg-[#222222] -translate-y-1/2 text-[#DBDBDB]"
                  disabled={isLoading}
                >
                  <Image src={image} alt="Toggle password visibility" width={20} height={20} />
                </button>
              </div>

              {/* ✅ New Password */}
              <label className="block text-[14px] mt-[30px] font-[500] text-[#8F8F8F] mb-[10px]">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={handlePasswordChange}
                  className={`w-[380px] h-[56px] bg-[#222222] text-[#DBDBDB] text-[14px] outline-none font-[500] border mb-4 pl-[15px] pr-10 rounded-[10px] ${
                    error && (!isMinLength || !hasNumber || !hasSpecialChar || !hasUpperLower)
                      ? "border-[#F5918A]"
                      : "border-[#2E2E2E]"
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute border-0 right-2 ml-[-40px] top-[55%] bg-[#222222] -translate-y-1/2 text-[#DBDBDB]"
                  disabled={isLoading}
                >
                  <Image src={image} alt="Toggle password visibility" width={20} height={20} />
                </button>
              </div>

              {/* ✅ Password Checklist */}
              <ul className="text-[14px] ml-[-40px] font-[400] font-satoshi text-[#8F8F8F] mb-6 space-y-[10px]">
                <li className="flex items-center gap-[5px]">
                  <Image src={isMinLength ? schecklistActive : schecklistInactive} alt="check list" width={16} height={16} />
                  <span className={`${isMinLength ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}`}>Minimum 6 characters</span>
                </li>
                <li className="flex items-center gap-[5px]">
                  <Image src={hasNumber ? schecklistActive : schecklistInactive} alt="check list" width={16} height={16} />
                  <span className={`${hasNumber ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}`}>At least 1 number</span>
                </li>
                <li className="flex items-center gap-[5px]">
                  <Image src={hasSpecialChar ? schecklistActive : schecklistInactive} alt="check list" width={16} height={16} />
                  <span className={`${hasSpecialChar ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}`}>At least 1 special character</span>
                </li>
                <li className="flex items-center gap-[5px]">
                  <Image src={hasUpperLower ? schecklistActive : schecklistInactive} alt="check list" width={16} height={16} />
                  <span className={`${hasUpperLower ? "text-[#FCFCFC]" : "text-[#8F8F8F]"}`}>1 uppercase and 1 lowercase letter</span>
                </li>
              </ul>

              {/* ✅ Confirm Password */}
              <label className="block text-[14px] mt-[10px] font-[500] text-[#8F8F8F] mb-[10px]">Confirm New password</label>
              <div className="relative inline-block">
                <input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  className={`w-[380px] h-[56px] bg-[#222222] text-[#DBDBDB] outline-none text-[14px] font-[500] border mb-4 pl-[15px] pr-10 rounded-[10px] ${
                    error && !passwordsMatch ? "border-[#F5918A]" : "border-[#2E2E2E]"
                  }`}
                  placeholder="Re-enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute top-[55%] border-0 right-2 ml-[-40px] bg-[#222222] -translate-y-1/2 text-[#DBDBDB]"
                  disabled={isLoading}
                >
                  <Image src={image} alt="Toggle password visibility" width={20} height={20} />
                </button>
              </div>

              {/* ✅ Submit */}
              <button
                className={`w-[400px] h-[56px] border-none mt-[40px] bg-[#4DF2BE] text-[#0F1012] py-3 rounded-[100px] hover:bg-[#1a5d50] transition ${
                  !allFieldsValid() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSubmit}
                disabled={!allFieldsValid() || isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="loader"></div>
                  </div>
                ) : 'Continue'}

                <style jsx>{`
                  .loader {
                    width: 20px;
                    height: 20px;
                    border: 3px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    border-top-color: #0F1012;
                    animation: spin 1s ease-in-out infinite;
                  }
                  @keyframes spin {
                    to {
                      transform: rotate(360deg);
                    }
                  }
                `}</style>
              </button>
            </div>
          </div>
        </div>

        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>
        <div className="mb-[80px] mt-[30%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default ChangeP;
