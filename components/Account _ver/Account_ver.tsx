"use client";

import React, { useEffect, useState } from "react";
import Nav from "../NAV/Nav";
import Settings from "../Settings/Settings";
import Footer from "../Footer/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Import icons (you'll need to update these with appropriate icons)
import EmailIcon from "../../public/Assets/Evolve2p_email_icon.svg"; // Add your email icon
import PhoneIcon from "../../public/Assets/Evolve2p_phone_icon.svg"; // Add your phone icon
import KYCIcon from "../../public/Assets/Evolve2p_kyc_icon.svg"; // Add your KYC icon
import VerifiedIcon from "../../public/Assets/Evolve2p_verified_icon.svg"; // Add your verified icon
import NotVerifiedIcon from "../../public/Assets/Evolve2p_notverified_icon.svg"; // Add your not verified icon

// If you don't have these icons yet, you can use these placeholders:
const PlaceholderEmailIcon = () => (
  <div className="w-10 h-10 rounded-full bg-[#4DF2BE]/20 flex items-center justify-center">
    <span className="text-[#4DF2BE] text-lg">@</span>
  </div>
);

const PlaceholderPhoneIcon = () => (
  <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
    <span className="text-blue-400 text-lg">📱</span>
  </div>
);

const PlaceholderKYCIcon = () => (
  <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
    <span className="text-purple-400 text-lg">✓</span>
  </div>
);

// Define a complete UserData interface matching what's in localStorage
interface CompleteUserData {
  email?: string;
  username?: string;
  phone?: string;
  country?: {
    name: string;
    code: string;
    dial_code: string;
  };
  emailVerified?: boolean;
  phoneVerified?: boolean;
  kycVerified?: boolean;
  isVerified?: boolean;
  accessToken?: string;
  verified?: boolean;
  // Nested userData from backend (if present)
  userData?: {
    email?: string;
    name?: string;
    DOB?: string | null;
    authType?: string | null;
    country?: string;
    createdAt?: string;
    emailVerified?: boolean;
    id?: string;
    is2faEnabled?: boolean;
    kycVerified?: boolean;
    phoneVerified?: boolean;
  };
}

interface VerificationData {
  email: string;
  phone: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  kycVerified: boolean;
  overallVerified: boolean;
}

const AccountVerification: React.FC = () => {
  const router = useRouter();
  const [userData, setUserData] = useState<CompleteUserData | null>(null);
  const [verificationData, setVerificationData] = useState<VerificationData>({
    email: "",
    phone: "",
    emailVerified: false,
    phoneVerified: false,
    kycVerified: false,
    overallVerified: false
  });
  const [loading, setLoading] = useState(true);

  // ✅ Load complete user data from localStorage and extract verification status
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("UserData");
        if (stored) {
          const parsed: CompleteUserData = JSON.parse(stored);
          setUserData(parsed);
          
          // Extract verification data from the complete user data structure
          const extractedData: VerificationData = {
            email: parsed.email || parsed.userData?.email || "",
            phone: parsed.phone || "",
            
            // Check email verification from multiple possible locations
            emailVerified: 
              parsed.emailVerified || 
              parsed.userData?.emailVerified || 
              parsed.verified || 
              parsed.isVerified || 
              false,
            
            // Check phone verification from multiple possible locations
            phoneVerified: 
              parsed.phoneVerified || 
              parsed.userData?.phoneVerified || 
              false,
            
            // Check KYC verification from multiple possible locations
            kycVerified: 
              parsed.kycVerified || 
              parsed.userData?.kycVerified || 
              false,
            
            // Overall verification status (all three must be true)
            overallVerified: false
          };
          
          // Calculate overall verification status
          extractedData.overallVerified = 
            extractedData.emailVerified && 
            extractedData.phoneVerified && 
            extractedData.kycVerified;
          
          setVerificationData(extractedData);
          
          console.log("📊 Verification Data Loaded:", {
            email: extractedData.email,
            phone: extractedData.phone,
            emailVerified: extractedData.emailVerified,
            phoneVerified: extractedData.phoneVerified,
            kycVerified: extractedData.kycVerified,
            overallVerified: extractedData.overallVerified,
            rawData: parsed
          });
        } else {
          console.log("❌ No UserData found in localStorage");
        }
      } catch (error) {
        console.error("❌ Error parsing user data:", error);
      } finally {
        setLoading(false);
      }
    }
  }, []);

  // Navigation to profile for phone verification
  const handleVerifyPhoneClick = () => {
    router.push("/profile");
  };

  // Navigation to KYC page
  const handleVerifyKYCClick = () => {
    router.push("/Signups/KYC");
  };

  // Handle email verification (you might need to implement API call)
  const handleVerifyEmailClick = () => {
    // TODO: Implement email verification API call
    console.log("Email verification requested");
    // Example: Send verification email
    // fetch("/api/verify-email", { method: "POST" })
    alert("Email verification link would be sent to your email address");
  };

  // Verification status component with clickable phone verification
  const VerificationStatus = ({ 
    type, 
    verified, 
    info,
    onClick
  }: { 
    type: string; 
    verified: boolean; 
    info?: string;
    onClick?: () => void;
  }) => {
    const isClickable = type === "Phone" && !verified && onClick;
    const isKYCClickable = type === "KYC" && !verified && onClick;
    
    return (
      <div 
        className={`flex items-center justify-between p-4 md:p-6 rounded-lg md:rounded-xl w-full bg-[#2D2D2D] mb-4 ${
          (isClickable || isKYCClickable) ? "cursor-pointer hover:bg-[#3A3A3A] transition-colors" : ""
        }`}
        onClick={(isClickable || isKYCClickable) ? onClick : undefined}
      >
        <div className="flex items-center gap-4">
          {type === "Email" ? <PlaceholderEmailIcon /> :
           type === "Phone" ? <PlaceholderPhoneIcon /> :
           <PlaceholderKYCIcon />}
          
          <div>
            <p className="text-sm md:text-base font-medium text-[#DBDBDB]">{type} Verification</p>
            {info && <p className="text-xs text-gray-400 mt-1">{info}</p>}
          </div>
        </div>
        
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
          verified 
            ? "bg-[#4DF2BE]/20 text-[#4DF2BE]" 
            : (isClickable || isKYCClickable)
              ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
              : "bg-[#FE857D]/20 text-[#FE857D]"
        }`}>
          {verified ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-xs md:text-sm font-medium">Verified</span>
            </>
          ) : (isClickable || isKYCClickable) ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
              <span className="text-xs md:text-sm font-medium">
                {type === "Phone" ? "Go to Profile" : "Complete KYC"}
              </span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-xs md:text-sm font-medium">Not Verified</span>
            </>
          )}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0F1012] text-white p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Nav />
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto border-4 border-[#4DF2BE] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading verification status...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1012] text-white p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 mt-6 lg:mt-8">
          {/* Settings Sidebar */}
          <div className="lg:w-[300px]">
            <Settings />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#1A1A1A] rounded-xl p-4 lg:p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-xl lg:text-2xl font-bold text-white">
                Account Verification
              </h1>
              <p className="text-sm text-gray-400 mt-2">
                Complete your verification steps to unlock all features
              </p>
            </div>

            {/* Overall Verification Status Banner */}
            <div className={`mb-6 p-4 rounded-lg border ${
              verificationData.overallVerified
                ? "bg-[#1A3A2F] border-[#4DF2BE]/30"
                : "bg-[#2D2A2A] border-yellow-500/30"
            }`}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  verificationData.overallVerified
                    ? "bg-[#4DF2BE]"
                    : "bg-yellow-500"
                }`}>
                  {verificationData.overallVerified ? (
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    verificationData.overallVerified
                      ? "text-[#4DF2BE]"
                      : "text-yellow-400"
                  }`}>
                    {verificationData.overallVerified
                      ? "🎉 Fully Verified! All checks complete"
                      : "⚠️ Verification Incomplete"}
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    {verificationData.overallVerified
                      ? "Your account is fully verified. You have access to all platform features."
                      : "Complete all verification steps to unlock full platform access and higher limits."}
                  </p>
                </div>
              </div>
            </div>

            {/* Email Verification */}
            <VerificationStatus 
              type="Email" 
              verified={verificationData.emailVerified}
              info={verificationData.email || "No email found"}
            />

            {/* Phone Verification - Clickable if not verified */}
            <VerificationStatus 
              type="Phone" 
              verified={verificationData.phoneVerified}
              info={verificationData.phone || "No phone number found"}
              onClick={!verificationData.phoneVerified ? handleVerifyPhoneClick : undefined}
            />

            {/* KYC Verification */}
            <VerificationStatus 
              type="KYC" 
              verified={verificationData.kycVerified}
              info="Complete KYC to increase your limits"
              onClick={!verificationData.kycVerified ? handleVerifyKYCClick : undefined}
            />

            {/* Verification Status Summary */}
            <div className="mt-8 p-4 md:p-6 bg-[#222222] rounded-lg md:rounded-xl">
              <h3 className="text-base md:text-lg font-medium text-[#FFFFFF] mb-4">
                Verification Status Summary
              </h3>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Overall Status</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    verificationData.overallVerified
                      ? "bg-[#4DF2BE]/20 text-[#4DF2BE]"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}>
                    {verificationData.overallVerified
                      ? "Fully Verified"
                      : "Partially Verified"}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Email Status</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${
                      verificationData.emailVerified ? "text-[#4DF2BE]" : "text-[#FE857D]"
                    }`}>
                      {verificationData.emailVerified ? "Verified" : "Not Verified"}
                    </span>
                    {!verificationData.emailVerified && (
                      <button
                        onClick={handleVerifyEmailClick}
                        className="text-xs bg-[#4DF2BE] text-black px-2 py-0.5 rounded hover:bg-[#3DD2A5] transition-colors"
                      >
                        Verify Email
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">Phone Status</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${
                      verificationData.phoneVerified ? "text-[#4DF2BE]" : "text-[#FE857D]"
                    }`}>
                      {verificationData.phoneVerified ? "Verified" : "Not Verified"}
                    </span>
                    {!verificationData.phoneVerified && (
                      <button
                        onClick={handleVerifyPhoneClick}
                        className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded hover:bg-blue-600 transition-colors"
                      >
                        Verify Now
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-300">KYC Status</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs ${
                      verificationData.kycVerified ? "text-[#4DF2BE]" : "text-[#FE857D]"
                    }`}>
                      {verificationData.kycVerified ? "Verified" : "Not Verified"}
                    </span>
                    {!verificationData.kycVerified && (
                      <button
                        onClick={handleVerifyKYCClick}
                        className="text-xs bg-purple-500 text-white px-2 py-0.5 rounded hover:bg-purple-600 transition-colors"
                      >
                        Complete KYC
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress Indicator */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-300">Verification Progress</span>
                  <span className="text-sm font-medium text-white">
                    {[verificationData.emailVerified, verificationData.phoneVerified, verificationData.kycVerified]
                      .filter(Boolean).length}/3 Complete
                  </span>
                </div>
                <div className="w-full bg-[#3A3A3A] rounded-full h-2">
                  <div 
                    className="bg-[#4DF2BE] h-2 rounded-full transition-all duration-500"
                    style={{
                      width: `${([verificationData.emailVerified, verificationData.phoneVerified, verificationData.kycVerified]
                        .filter(Boolean).length / 3) * 100}%`
                    }}
                  ></div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-[#3A3A3A] flex flex-col sm:flex-row gap-3">
                {!verificationData.emailVerified && (
                  <button 
                    onClick={handleVerifyEmailClick}
                    className="flex-1 bg-[#4DF2BE] text-black font-medium py-2.5 px-4 rounded-lg hover:bg-[#3DD2A5] transition-colors"
                  >
                    Verify Email
                  </button>
                )}
                
                {!verificationData.phoneVerified && (
                  <button 
                    onClick={handleVerifyPhoneClick}
                    className="flex-1 bg-blue-500 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Go to Profile to Verify Phone
                  </button>
                )}
                
                {!verificationData.kycVerified && (
                  <button 
                    onClick={handleVerifyKYCClick}
                    className="flex-1 bg-purple-500 text-white font-medium py-2.5 px-4 rounded-lg hover:bg-purple-600 transition-colors"
                  >
                    Complete KYC
                  </button>
                )}
                
                {verificationData.overallVerified && (
                  <button className="flex-1 bg-[#4DF2BE] text-black font-medium py-2.5 px-4 rounded-lg cursor-default">
                    All Verified ✓
                  </button>
                )}
              </div>
            </div>

            {/* Verification Instructions */}
            <div className="mt-8 p-4 md:p-6 bg-[#222222] rounded-lg md:rounded-xl">
              <h3 className="text-base md:text-lg font-medium text-[#FFFFFF] mb-4">
                How to Complete Verification
              </h3>
              
              <div className="grid md:grid-cols-3 gap-4">
                {/* Email Verification Instructions */}
                <div className="bg-[#2D2D2D] p-4 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-[#4DF2BE]/20 flex items-center justify-center mb-3">
                    <span className="text-[#4DF2BE] text-sm font-bold">1</span>
                  </div>
                  <h4 className="text-sm font-medium text-white mb-2">Email Verification</h4>
                  <p className="text-xs text-gray-400">
                    Check your email for a verification link sent during registration. Click the link to verify your email address.
                  </p>
                </div>
                
                {/* Phone Verification Instructions */}
                <div className="bg-[#2D2D2D] p-4 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mb-3">
                    <span className="text-blue-400 text-sm font-bold">2</span>
                  </div>
                  <h4 className="text-sm font-medium text-white mb-2">Phone Verification</h4>
                  <p className="text-xs text-gray-400">
                    Go to your Profile page, enter your phone number, click "Click to Verify", then save changes.
                  </p>
                </div>
                
                {/* KYC Verification Instructions */}
                <div className="bg-[#2D2D2D] p-4 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mb-3">
                    <span className="text-purple-400 text-sm font-bold">3</span>
                  </div>
                  <h4 className="text-sm font-medium text-white mb-2">KYC Verification</h4>
                  <p className="text-xs text-gray-400">
                    Complete the KYC process by providing identification documents for enhanced security and limits.
                  </p>
                </div>
              </div>
            </div>

            {/* Verification Benefits */}
            <div className="mt-8 p-4 md:p-6 bg-[#222222] rounded-lg md:rounded-xl">
              <h3 className="text-base md:text-lg font-medium text-[#FFFFFF] mb-4">
                Benefits of Full Verification
              </h3>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#4DF2BE]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#4DF2BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Higher Transaction Limits</p>
                    <p className="text-xs text-gray-400 mt-1">Unlock increased deposit and withdrawal limits</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#4DF2BE]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#4DF2BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Full Platform Access</p>
                    <p className="text-xs text-gray-400 mt-1">Access all trading features and markets</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#4DF2BE]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#4DF2BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Enhanced Security</p>
                    <p className="text-xs text-gray-400 mt-1">Multi-layer verification for account protection</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#4DF2BE]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-[#4DF2BE]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-300">Priority Support</p>
                    <p className="text-xs text-gray-400 mt-1">Faster response times from customer support</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-white/20 my-8" />
        
        <div className="mb-8">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default AccountVerification;