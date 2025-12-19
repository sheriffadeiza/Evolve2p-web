"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { E164Number } from 'libphonenumber-js';

const BASE_URL = "https://evolve2p-backend.onrender.com/api/";

const Profilebd = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    country: "",
    countryCode: "",
  });

  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>();
  const [phoneValidationError, setPhoneValidationError] = useState("");
  const [isPhoneValid, setIsPhoneValid] = useState(false);
  const [phoneVerificationLoading, setPhoneVerificationLoading] = useState(false);

  const [countries, setCountries] = useState<any[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showCountrySearch, setShowCountrySearch] = useState(false);

  // Phone validation using react-phone-number-input
  const validatePhoneNumber = (phone: E164Number | undefined) => {
    if (!phone || phone.toString().length < 4) {
      return { 
        isValid: false, 
        message: "Phone number is too short",
        formattedNumber: ""
      };
    }

    try {
      const phoneString = phone.toString();
      const isValid = isValidPhoneNumber(phoneString);
      
      let message = "";
      if (!isValid) {
        message = "Please enter a valid international phone number";
      } else {
        message = "Valid phone number ✓";
      }
      
      return {
        isValid,
        message,
        formattedNumber: phoneString,
      };
      
    } catch (error) {
      console.error("Phone validation error:", error);
      return {
        isValid: false,
        message: "Error validating phone number",
        formattedNumber: "",
      };
    }
  };

  // Validate phone number on change
  useEffect(() => {
    const validatePhone = () => {
      if (phoneNumber && phoneNumber.toString().length >= 4) {
        setPhoneVerificationLoading(true);
        setPhoneValidationError("");

        const validation = validatePhoneNumber(phoneNumber);
        
        setIsPhoneValid(validation.isValid);
        setPhoneValidationError(validation.isValid ? "" : validation.message);

        if (validation.isValid) {
          // Extract country code from phone number for formData
          const countryMatch = countries.find(country => 
            phoneNumber.toString().startsWith(country.dialCode)
          );
          
          if (countryMatch) {
            setFormData(prev => ({
              ...prev,
              country: countryMatch.name,
              countryCode: countryMatch.code,
            }));
          }
        }
        
        setPhoneVerificationLoading(false);
      } else if (phoneNumber && phoneNumber.toString().length > 0) {
        setIsPhoneValid(false);
        setPhoneValidationError("Phone number is too short");
      } else {
        setIsPhoneValid(false);
        setPhoneValidationError("");
      }
    };

    const timeoutId = setTimeout(validatePhone, 500);
    return () => clearTimeout(timeoutId);
  }, [phoneNumber, countries]);

  // Fetch countries with dial codes
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd"
        );
        const data = await response.json();

        const formattedCountries = data
          .map((country: any) => {
            const root = country?.idd?.root || "";
            const suffix = country?.idd?.suffixes?.[0] || "";
            const dial = root && suffix ? `${root}${suffix}` : root || "+1";

            return {
              name: country.name.common,
              code: country.cca2,
              dialCode: dial,
            };
          })
          .sort((a: any, b: any) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);

        const nigeria = formattedCountries.find((c: any) => c.code === "NG");
        if (nigeria) {
          setFormData((prev) => ({
            ...prev,
            country: nigeria.name,
            countryCode: nigeria.code,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Debounce username check
  useEffect(() => {
    if (formData.username.trim() === "") {
      setUsernameStatus("");
      setIsValidUsername(false);
      return;
    }

    setUsernameStatus("checking");

    const handler = setTimeout(() => {
      const lower = formData.username.toLowerCase();
      const isValid =
        formData.username.length >= 4 &&
        !["admin", "user", "test"].includes(lower);

      if (isValid) {
        setUsernameStatus("valid");
        setIsValidUsername(true);
      } else {
        setUsernameStatus("invalid");
        setIsValidUsername(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [formData.username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, username: e.target.value }));
  };

  const allFieldsValid = () => {
    return (
      isValidUsername &&
      isPhoneValid &&
      formData.country.trim() !== ""
    );
  };

  const handleContinueToSecurityPin = () => {
    router.push("/Signups/Secpin");
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!allFieldsValid()) {
      setErrorMessage("Please fill in all fields correctly");
      setIsLoading(false);
      return;
    }

    try {
      const currentData = localStorage.getItem("UserReg")
        ? JSON.parse(localStorage.getItem("UserReg") as string)
        : null;

      const UserData = {
        email: currentData?.email,
        username: formData.username,
        password: currentData?.password,
        country: formData.country,
        emailVerified: currentData?.isEmailVerified,
        phone: phoneNumber?.toString() || "",
      };

      const SignupResponse = await fetch(BASE_URL + "auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(UserData),
      });

      const data = await SignupResponse.json();

      if (data?.error) {
        alert(data?.message);
        return;
      }

      let token = data?.accessToken;

      if (token) {
        const userResponse = await fetch(BASE_URL + "get-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        const userData = await userResponse.json();

        if (userData?.success) {
          localStorage.removeItem("UserReg");
          localStorage.setItem(
            "UserData",
            JSON.stringify({
              accessToken: token,
              userData: userData?.user,
            })
          );
          setShowSuccessModal(true);
        }
      }
    } catch (error: any) {
      setError(
        error.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:mx-0">
      <div className="flex flex-col px-4 lg:px-4 mx-auto py-16 lg:ml-[100px] gap-2 w-full border-none max-w-[400px] text-white">

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70  flex items-center justify-center z-50">
            <div className="bg-[#222222] h-[40vh] p-6 rounded-[10px] ml-[-10px] w-[300px] text-center">
              <h3 className="text-[#4DF2BE] text-[18px] font-bold mb-2">
                Success!
              </h3>
              <p className="text-[#FCFCFC] mt-[50px]">
                Registration completed successfully
              </p>
              <button
                onClick={handleContinueToSecurityPin}
                className="w-[250px] h-[50px] mt-[50px] border-none bg-[#4DF2BE] text-[#000] py-2 rounded-[100px] font-bold hover:bg-[#3dd9ab] transition"
              >
                Continue to Security Pin
              </button>
            </div>
          </div>
        )}

        <h1 className="text-[24px] text-[#FCFCFC] font-[700]">
          Complete Your Profile
        </h1>
        <p className="text-[16px] font-[400] mt-[-5px] text-[#8F8F8F] mb-6">
          This helps personalize your experience.
        </p>

        {errorMessage && (
          <div className="w-[370px] p-3 mb-4 text-[#F5918A] text-sm">
            {errorMessage}
          </div>
        )}

        {/* Username */}
        <div className="mt-[20px] w-full">
          <label className="text-[14px] mt-2 font-[500] text-[#8F8F8F]">
            Username
          </label>
          <div
            className={`relative w-full rounded-t-[10px] border-2 ${
              usernameStatus === "invalid"
                ? "border-[#F5918A]"
                : "border-[#2E2E2E]"
            }`}
          >
            <span className="text-[#DBDBDB] absolute ml-[10px] mt-[18px]">@</span>
            <input
              type="text"
              value={formData.username}
              onChange={handleUsernameChange}
              className="w-full h-[56px] text-[#FCFCFC] rounded-t-[10px] px-4 py-3 bg-[#222222] border-none pl-[25px] focus:outline-none"
            />
          </div>
          <div
            className={`w-full h-[30px] pl-[20px] flex items-center bg-[#222222] rounded-b-[10px] ${
              usernameStatus === "invalid"
                ? "border border-[#F5918A] border-t-0"
                : "border border-[#2E2E2E] border-t-0"
            }`}
          >
            {usernameStatus === "checking" && (
              <span className="text-[12px] text-[#8F8F8F]">
                Checking username...
              </span>
            )}
            {usernameStatus === "valid" && (
              <span className="text-[12px] text-[#1ECB84]">
                Username available
              </span>
            )}
            {usernameStatus === "invalid" && (
              <span className="text-[12px] text-[#F5918A]">
                {formData.username.length < 4
                  ? "Minimum 4 characters"
                  : "Username not available"}
              </span>
            )}
            {usernameStatus === "" && formData.username.trim() === "" && (
              <span className="text-[12px] text-[#8F8F8F]">
                Enter a username
              </span>
            )}
          </div>
        </div>

        {/* Phone Input using react-phone-number-input */}
        <div className="mt-[20px] w-full">
          <label className="text-[14px] font-[500] text-[#8F8F8F] mb-2 block">
            Phone number
          </label>
          <div className={`relative w-full rounded-[10px] ${
            phoneValidationError && !isPhoneValid
              ? "border-2 border-[#F5918A]"
              : isPhoneValid
              ? "border-2 border-[#1ECB84]"
              : "border border-[#2E2E2E]"
          }`}>
            <PhoneInput
              international
              countryCallingCodeEditable={false}
              defaultCountry="NG"
              value={phoneNumber || ""}
              onChange={setPhoneNumber}
              className="custom-phone-input-register"
              style={{
                '--PhoneInput-color--focus': '#4DF2BE',
                '--PhoneInputCountrySelectArrow-color': '#C7C7C7',
                '--PhoneInputCountryFlag-borderColor': 'transparent',
              } as React.CSSProperties}
            />
            
            {/* Phone validation indicator */}
            {phoneNumber && phoneNumber.toString().length >= 4 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {phoneVerificationLoading ? (
                  <div className="w-5 h-5 border-2 border-[#4DF2BE] border-t-transparent rounded-full animate-spin"></div>
                ) : isPhoneValid ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#1ECB84" />
                    <path d="M5 10L8.5 13.5L15 7" stroke="#0F1012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="10" cy="10" r="10" fill="#F5918A" />
                    <path d="M13 7L7 13" stroke="#0F1012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 7L13 13" stroke="#0F1012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            )}
          </div>
          
          {/* Phone validation messages */}
          {phoneValidationError && (
            <div className={`mt-2 text-xs font-medium ${
              isPhoneValid ? "text-[#1ECB84]" : "text-[#F5918A]"
            }`}>
              {phoneValidationError}
            </div>
          )}
          
          {/* Country info */}
          {isPhoneValid && formData.country && (
            <div className="mt-2 text-xs text-[#1ECB84] flex items-center gap-2">
              ✓ Detected country: {formData.country}
            </div>
          )}
        </div>

        {/* Country Display (read-only, auto-filled from phone) */}
        <div className="mt-[20px]">
          <label className="text-[14px] font-[500] text-[#8F8F8F] mb-2 block">
            Country (auto-detected from phone)
          </label>
          <div className="relative w-full">
            <div className="absolute left-4 top-1/2 mt-[5px] -translate-y-1/2 flex items-center pointer-events-none">
              {formData.countryCode && (
                <img
                  src={`https://flagcdn.com/w20/${formData.countryCode.toLowerCase()}.png`}
                  width={20}
                  height={20}
                  className="rounded-sm"
                  alt={formData.country}
                />
              )}
            </div>
            <input
              type="text"
              readOnly
              className="w-full h-[56px] bg-[#222222] mt-[10px] pl-[60px] pr-12 border border-[#2E2E2E] rounded-[10px] text-[14px] font-[500] text-[#FCFCFC] focus:outline-none cursor-not-allowed"
              value={formData.country || "Will be auto-detected from phone"}
            />
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          className={`w-full h-[48px] border-none bg-[#2DE3A3] text-[#0F1012] text-[14px] font-[700] mt-[40px] py-3 rounded-full flex items-center justify-center ${
            !allFieldsValid() || isLoading
              ? "opacity-50 cursor-not-allowed"
              : ""
          }`}
          disabled={!allFieldsValid() || isLoading}
        >
          {isLoading ? <div className="loader-small"></div> : "Complete Registration"}
        </button>

        {/* Global Styles for Phone Input */}
        <style jsx global>{`
          .custom-phone-input-register {
            width: 100%;
          }
          
          .custom-phone-input-register .PhoneInput {
            display: flex;
            align-items: center;
            width: 100%;
          }
          
          .custom-phone-input-register .PhoneInputCountry {
            background: #3A3A3A;
            padding: 1rem;
            border-radius: 0.625rem 0 0 0.625rem;
            margin-right: 0;
            height: 56px;
            min-width: 120px;
            display: flex;
            align-items: center;
            gap: 8px;
            border-right: 1px solid #2E2E2E;
          }
          
          .custom-phone-input-register .PhoneInputCountrySelect {
            background: transparent;
            border: none;
            color: #C7C7C7;
            font-size: 14px;
            padding: 0;
          }
          
          .custom-phone-input-register .PhoneInputCountrySelectArrow {
            color: #C7C7C7;
            margin-left: 4px;
          }
          
          .custom-phone-input-register .PhoneInputCountryIcon {
            border-radius: 2px;
          }
          
          .custom-phone-input-register .PhoneInputInput {
            flex: 1;
            background: #222222;
            color: #FCFCFC;
            border: none;
            border-radius: 0 0.625rem 0.625rem 0;
            padding: 1rem;
            height: 56px;
            font-size: 14px;
            outline: none;
          }
          
          .custom-phone-input-register .PhoneInputInput:focus {
            outline: none;
          }
          
          .PhoneInputCountryDropdown {
            background: #1A1A1A !important;
            border: 1px solid #3A3A3A !important;
            border-radius: 0.5rem !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            z-index: 9999 !important;
          }
          
          .PhoneInputCountryDropdown::-webkit-scrollbar {
            width: 6px;
          }
          
          .PhoneInputCountryDropdown::-webkit-scrollbar-track {
            background: #2D2D2D;
            border-radius: 3px;
          }
          
          .PhoneInputCountryDropdown::-webkit-scrollbar-thumb {
            background: #4DF2BE;
            border-radius: 3px;
          }
          
          .PhoneInputCountryDropdown option {
            background: #1A1A1A !important;
            color: #FFFFFF !important;
            padding: 0.75rem 1rem !important;
            border-bottom: 1px solid #2D2D2D !important;
            cursor: pointer !important;
            transition: all 0.2s ease !important;
          }
          
          .PhoneInputCountryDropdown option:hover {
            background: #2D2D2D !important;
          }
          
          .PhoneInputCountryDropdown option:checked,
          .PhoneInputCountryDropdown option:focus {
            background: #4DF2BE !important;
            color: #0F1012 !important;
          }
          
          .loader-small {
            width: 20px;
            height: 20px;
            position: relative;
          }
          .loader-small::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: 3px solid #333333;
            border-top-color: #4df2be;
            border-radius: 50%;
            animation: spin 0.8s linear infinite;
          }
          @keyframes spin {
            0% {
              transform: rotate(0deg);
            }
            100% {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div> 
    </div>
  );
};

export default Profilebd;