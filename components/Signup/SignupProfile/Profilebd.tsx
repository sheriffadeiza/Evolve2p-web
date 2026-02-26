"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { E164Number } from 'libphonenumber-js';
import { API_BASE_URL } from "@/config";

const BASE_URL = `${API_BASE_URL}/api/`;

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
  const [usernameStatus, setUsernameStatus] = useState("");
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState(""); // combined error display

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
        setErrorMessage("Failed to load country data. Please refresh.");
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

  // Submit with timeout and better error handling
  const handleSubmit = async () => {
    setIsLoading(true);
    setErrorMessage("");

    if (!allFieldsValid()) {
      setErrorMessage("Please fill in all fields correctly.");
      setIsLoading(false);
      return;
    }

    try {
      const currentData = localStorage.getItem("UserReg")
        ? JSON.parse(localStorage.getItem("UserReg") as string)
        : null;

      if (!currentData?.email || !currentData?.password) {
        throw new Error("Missing email or password from previous step.");
      }

      const UserData = {
        email: currentData.email,
        username: formData.username,
        password: currentData.password,
        country: formData.country,
        emailVerified: currentData.isEmailVerified || false,
        phone: phoneNumber?.toString() || "",
      };

      // Use AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const SignupResponse = await fetch(BASE_URL + "auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(UserData),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await SignupResponse.json();

      if (!SignupResponse.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      const token = data?.accessToken || data?.token;
      if (!token) {
        throw new Error("No access token received.");
      }

      // Fetch user data with token
      const userResponse = await fetch(BASE_URL + "get-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      });

      const userData = await userResponse.json();

      // Check if response contains user object (adjust based on actual API)
      const user = userData?.user || userData?.data || userData;
      if (!user) {
        throw new Error("Failed to fetch user data.");
      }

      // Store user data
      localStorage.removeItem("UserReg");
      localStorage.setItem(
        "UserData",
        JSON.stringify({
          accessToken: token,
          userData: user,
        })
      );

      // Show success modal
      setShowSuccessModal(true);
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.name === 'AbortError') {
        setErrorMessage("Request timed out. Please check your connection and try again.");
      } else {
        setErrorMessage(error.message || "An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full lg:mx-0">
      <div className="flex flex-col px-4 lg:px-4 mx-auto py-16 lg:ml-[100px] gap-2 w-full border-none max-w-[400px] text-white">

        {/* Success Modal - improved styling */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
            <div className="bg-[#222222] p-8 rounded-xl w-[350px] text-center shadow-2xl border border-[#4DF2BE]/30">
              <div className="w-16 h-16 mx-auto mb-4 bg-[#1B362B] rounded-full flex items-center justify-center border-2 border-[#1ECB84]">
                <svg className="w-8 h-8 text-[#1ECB84]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-[#4DF2BE] text-2xl font-bold mb-4">Success!</h3>
              <p className="text-[#FCFCFC] mb-8">Registration completed successfully.</p>
              <button
                onClick={handleContinueToSecurityPin}
                className="w-full h-12 bg-[#4DF2BE] text-[#0F1012] font-bold rounded-full hover:bg-[#3DD2A5] transition-colors"
              >
                Continue to Security Pin
              </button>
            </div>
          </div>
        )}

        <h1 className="text-2xl text-[#FCFCFC] font-bold">Complete Your Profile</h1>
        <p className="text-base text-[#8F8F8F] mb-6">This helps personalize your experience.</p>

        {/* Error display */}
        {errorMessage && (
          <div className="bg-[#342827] border border-[#FE857D] text-[#FE857D] px-4 py-3 rounded-lg mb-4 text-sm">
            {errorMessage}
          </div>
        )}

        {/* Username */}
        <div className="mt-4 w-full">
          <label className="text-sm font-medium text-[#8F8F8F]">Username</label>
          <div
            className={`relative w-full rounded-t-lg border-2 ${
              usernameStatus === "invalid"
                ? "border-[#F5918A]"
                : "border-[#2E2E2E]"
            }`}
          >
            <span className="text-[#DBDBDB] absolute left-3 top-1/2 -translate-y-1/2">@</span>
            <input
              type="text"
              value={formData.username}
              onChange={handleUsernameChange}
              className="w-full h-14 text-[#FCFCFC] rounded-t-lg pl-8 pr-4 py-3 bg-[#222222] border-none focus:outline-none"
            />
          </div>
          <div
            className={`w-full h-8 flex items-center pl-4 bg-[#222222] rounded-b-lg text-xs ${
              usernameStatus === "invalid"
                ? "border border-[#F5918A] border-t-0"
                : "border border-[#2E2E2E] border-t-0"
            }`}
          >
            {usernameStatus === "checking" && (
              <span className="text-[#8F8F8F]">Checking username...</span>
            )}
            {usernameStatus === "valid" && (
              <span className="text-[#1ECB84]">Username available</span>
            )}
            {usernameStatus === "invalid" && (
              <span className="text-[#F5918A]">
                {formData.username.length < 4
                  ? "Minimum 4 characters"
                  : "Username not available"}
              </span>
            )}
            {usernameStatus === "" && formData.username.trim() === "" && (
              <span className="text-[#8F8F8F]">Enter a username</span>
            )}
          </div>
        </div>

        {/* Phone Input */}
        <div className="mt-4 w-full">
          <label className="text-sm font-medium text-[#8F8F8F] mb-2 block">Phone number</label>
          <div className={`relative w-full rounded-lg ${
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
            />
            
            {phoneNumber && phoneNumber.toString().length >= 4 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {phoneVerificationLoading ? (
                  <div className="w-5 h-5 border-2 border-[#4DF2BE] border-t-transparent rounded-full animate-spin"></div>
                ) : isPhoneValid ? (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#1ECB84" />
                    <path d="M5 10L8.5 13.5L15 7" stroke="#0F1012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <circle cx="10" cy="10" r="10" fill="#F5918A" />
                    <path d="M13 7L7 13" stroke="#0F1012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M7 7L13 13" stroke="#0F1012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
            )}
          </div>
          
          {phoneValidationError && (
            <div className={`mt-2 text-xs font-medium ${
              isPhoneValid ? "text-[#1ECB84]" : "text-[#F5918A]"
            }`}>
              {phoneValidationError}
            </div>
          )}
          
          {isPhoneValid && formData.country && (
            <div className="mt-2 text-xs text-[#1ECB84] flex items-center gap-2">
              ✓ Detected country: {formData.country}
            </div>
          )}
        </div>

        {/* Country Display (auto-detected) */}
        <div className="mt-4">
          <label className="text-sm font-medium text-[#8F8F8F] mb-2 block">
            Country (auto-detected from phone)
          </label>
          <div className="relative w-full">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none">
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
              className="w-full h-14 bg-[#222222] pl-14 pr-4 border border-[#2E2E2E] rounded-lg text-sm font-medium text-[#FCFCFC] cursor-not-allowed"
              value={formData.country || "Will be auto-detected from phone"}
            />
          </div>
        </div>

        {/* Continue Button */}
        <button
          onClick={handleSubmit}
          className={`w-full h-12 bg-[#4DF2BE] text-[#0F1012] font-bold rounded-full mt-8 flex items-center justify-center transition-colors ${
            !allFieldsValid() || isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#3DD2A5]"
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
            padding: 0 1rem;
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
          
          .PhoneInputCountryDropdown {
            background: #1A1A1A !important;
            border: 1px solid #3A3A3A !important;
            border-radius: 0.5rem !important;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5) !important;
            max-height: 300px !important;
            overflow-y: auto !important;
            z-index: 9999 !important;
          }
          
          .PhoneInputCountryDropdown option {
            background: #1A1A1A !important;
            color: #FFFFFF !important;
            padding: 0.75rem 1rem !important;
            border-bottom: 1px solid #2D2D2D !important;
            cursor: pointer !important;
          }
          
          .PhoneInputCountryDropdown option:hover {
            background: #2D2D2D !important;
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
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div> 
    </div>
  );
};

export default Profilebd;