"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Nav from "../NAV/Nav";
import { useRouter } from "next/navigation";
import Settings from "../../components/Settings/Settings";
import Yellow_i from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import Callen from "../../public/Assets/Evolve2p_Callen/Profile/elements.svg";
import ArrowD from "../../public/Assets/Evolve2p_arrowd/arrow-down-01.png";
import Currency from "../../public/Assets/Evolve2p_Currency/Profile/money-04.svg";
import Barrow from "../../public/Assets/Evolve2p_Barrow/arrow-down-01.svg";
import Mode from "../../public/Assets/Evolve2p_mode/Profile/elements.svg";
import Lang from "../../public/Assets/Evolve2p_Lang/Profile/globe.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import Footer from "../Footer/Footer";
import { countryCurrencyService, CurrencyOption } from "../../utils/countryCurrencyService";
import { parsePhoneNumberFromString, isValidPhoneNumber } from "libphonenumber-js";

// Add blue tick icon
const BlueTick = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="10" cy="10" r="10" fill="#4DF2BE" />
    <path d="M5 10L8.5 13.5L15 7" stroke="#0F1012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// Debounce hook
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

interface Country {
  name: string;
  code: string;
  dial_code: string;
}

interface UserData {
  email: string;
  username: string;
  phone: string;
  country: Country;
  verified: boolean;
  phoneVerified: boolean;
  dayOfBirth?: string;
  darkMode?: boolean;
  language?: string;
  currency?: string;
  accessToken?: string;
  userData?: any;
}

const Toggle = ({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) => {
  return (
    <div
      onClick={onToggle}
      className={`w-10 h-5 rounded-full p-0.5 flex items-center cursor-pointer transition-colors duration-300
        ${enabled ? "bg-[#4DF2BE]" : "bg-[#8F8F8F]"}`}
    >
      <div
        className={`w-3.5 h-3.5 rounded-full transition-transform duration-300
          ${enabled ? "translate-x-6 bg-[#000]" : "translate-x-0 bg-[#fff]"}`}
      />
    </div>
  );
};

const Profile = () => {
  const router = useRouter();

  // Currency states using the service
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption | null>(null);
  const [openCurrency, setOpenCurrency] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  // Phone and Country states
  const [phone, setPhone] = useState<string>("");
  const debouncedPhone = useDebounce(phone, 800);
  const [isPhoneVerified, setIsPhoneVerified] = useState<boolean>(false);
  const [userClickedVerified, setUserClickedVerified] = useState<boolean>(false);
  const [phoneVerificationLoading, setPhoneVerificationLoading] = useState<boolean>(false);
  const [phoneValidationError, setPhoneValidationError] = useState<string>("");
  const [phoneFormatted, setPhoneFormatted] = useState<string>("");
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country>({
    name: "Nigeria",
    code: "NG",
    dial_code: "+234"
  });
  const [openCountry, setOpenCountry] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");

  // User data states
  const [userData, setUserData] = useState<UserData | null>(null);
  const [clientUser, setClientUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Date states
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [openDate, setOpenDate] = useState(false);

  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const languages = [
    "English",
    "Filipino",
    "Swahili",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Russian",
    "Arabic",
  ];

  const [openLang, setOpenLang] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  // Save states and loading
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [originalData, setOriginalData] = useState<any>(null);

  // Function to update phoneVerified in localStorage
  const updatePhoneVerifiedInLocalStorage = (isVerified: boolean) => {
    try {
      const stored = localStorage.getItem("UserData");
      if (stored) {
        const parsed = JSON.parse(stored);
        
        const updatedData = {
          ...parsed,
          phoneVerified: isVerified,
          userData: parsed.userData ? {
            ...parsed.userData,
            phoneVerified: isVerified
          } : parsed.userData
        };
        
        localStorage.setItem("UserData", JSON.stringify(updatedData));
        setUserData(updatedData);
        return true;
      }
    } catch (error) {
      console.error("Error updating phoneVerified in localStorage:", error);
    }
    return false;
  };

  // Phone validation function using libphonenumber-js
  const validatePhoneNumberWithLib = (phoneNumber: string, countryDialCode: string, countryCode: string) => {
    if (!phoneNumber || phoneNumber.length < 4) {
      return { 
        isValid: false, 
        message: "Phone number is too short",
        formattedNumber: ""
      };
    }

    const fullNumber = `${countryDialCode}${phoneNumber}`;
    
    try {
      const phoneNumberObj = parsePhoneNumberFromString(fullNumber);
      
      if (!phoneNumberObj) {
        return { 
          isValid: false, 
          message: "Invalid phone number format",
          formattedNumber: ""
        };
      }

      const isValid = isValidPhoneNumber(fullNumber);
      const formatted = phoneNumberObj.formatInternational();
      const phoneCountry = phoneNumberObj.country;
      
      let message = "";
      if (!isValid) {
        message = "Please enter a valid phone number";
      } else if (phoneCountry && countryCode && 
                 phoneCountry !== countryCode.toLowerCase()) {
        message = `Number appears to be from ${phoneCountry.toUpperCase()}. Change country or update number.`;
      } else {
        message = "Valid phone number ✓";
      }
      
      return {
        isValid,
        message,
        formattedNumber: formatted,
        detectedCountry: phoneCountry
      };
      
    } catch (error) {
      return {
        isValid: false,
        message: "Error validating phone number",
        formattedNumber: "",
        detectedCountry: undefined
      };
    }
  };

  // Validation effect using debounced phone and libphonenumber-js
  useEffect(() => {
    const validatePhone = async () => {
      if (debouncedPhone && debouncedPhone.length >= 4) {
        setPhoneVerificationLoading(true);
        setPhoneValidationError("");

        try {
          const validation = validatePhoneNumberWithLib(
            debouncedPhone, 
            selectedCountry.dial_code, 
            selectedCountry.code
          );
          
          setIsPhoneVerified(validation.isValid);
          setPhoneFormatted(validation.formattedNumber);
          setPhoneValidationError(validation.isValid ? "" : validation.message);

          if (!validation.isValid) {
            setUserClickedVerified(false);
            updatePhoneVerifiedInLocalStorage(false);
          }
        } catch (error) {
          setIsPhoneVerified(false);
          setPhoneValidationError("Error validating phone number");
          setUserClickedVerified(false);
          updatePhoneVerifiedInLocalStorage(false);
        } finally {
          setPhoneVerificationLoading(false);
        }

      } else if (debouncedPhone && debouncedPhone.length > 0) {
        setIsPhoneVerified(false);
        setUserClickedVerified(false);
        setPhoneFormatted("");
        setPhoneValidationError("Phone number is too short");
        updatePhoneVerifiedInLocalStorage(false);
      } else {
        setIsPhoneVerified(false);
        setUserClickedVerified(false);
        setPhoneFormatted("");
        setPhoneValidationError("");
        updatePhoneVerifiedInLocalStorage(false);
      }
    };

    validatePhone();
  }, [debouncedPhone, selectedCountry]);

  // Handle verified phone click
  const handleVerifiedClick = () => {
    if (isPhoneVerified) {
      setUserClickedVerified(true);
      updatePhoneVerifiedInLocalStorage(true);
      setSaveMessage("✅ Phone number verified! Don't forget to save changes.");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // Check if save should be disabled
  const isSaveDisabled = () => {
    return !userClickedVerified || isSaving;
  };

  // Load countries from API
  useEffect(() => {
    const loadCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,cca2,idd');
        const data = await response.json();

        const formattedCountries: Country[] = data.map((country: any) => {
          const root = country.idd?.root || '';
          const suffixes = country.idd?.suffixes || [];
          const dial_code = suffixes.length > 0 ? `${root}${suffixes[0]}` : root;

          return {
            name: country.name.common,
            code: country.cca2,
            dial_code: dial_code || '+1'
          };
        }).filter((country: Country) => country.dial_code).sort((a: Country, b: Country) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);
      } catch (error) {
        setCountries([
          { name: "Nigeria", code: "NG", dial_code: "+234" },
          { name: "United States", code: "US", dial_code: "+1" },
          { name: "United Kingdom", code: "GB", dial_code: "+44" },
          { name: "Canada", code: "CA", dial_code: "+1" },
          { name: "Ghana", code: "GH", dial_code: "+233" },
          { name: "South Africa", code: "ZA", dial_code: "+27" },
          { name: "Kenya", code: "KE", dial_code: "+254" },
        ]);
      }
    };

    loadCountries();
  }, []);

  // Load user data and currencies
  useEffect(() => {
    const loadUserData = async () => {
      if (typeof window !== "undefined") {
        setLoading(true);
        
        const stored = localStorage.getItem("UserData");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            
            // Extract user data from either root or nested userData
            const userDataFromStorage = parsed?.userData || parsed;
            
            // Set the client user data - this is where username should be
            setClientUser(userDataFromStorage);
            
            // Create UserData object from the stored data
            const userDataObj: UserData = {
              email: userDataFromStorage.email || parsed.email || "",
              username: userDataFromStorage.username || parsed.username || "",
              phone: parsed.phone || userDataFromStorage.phone || "",
              country: parsed.country || userDataFromStorage.country || { name: "Nigeria", code: "NG", dial_code: "+234" },
              verified: parsed.verified || userDataFromStorage.verified || true,
              phoneVerified: parsed.phoneVerified || userDataFromStorage.phoneVerified || false,
              accessToken: parsed.accessToken || userDataFromStorage.accessToken || "",
              dayOfBirth: parsed.dayOfBirth || userDataFromStorage.DOB || userDataFromStorage.dayOfBirth,
              darkMode: parsed.darkMode || userDataFromStorage.darkMode,
              language: parsed.language || userDataFromStorage.language,
              currency: parsed.currency || userDataFromStorage.currency,
              userData: userDataFromStorage
            };
            
            setUserData(userDataObj);
            
            // Set initial data
            setPhone(userDataObj.phone || "");
            setSelectedCountry(userDataObj.country || { name: "Nigeria", code: "NG", dial_code: "+234" });
            
            // Validate the initial phone if exists
            if (userDataObj.phone && userDataObj.phone.length >= 4 && userDataObj.country) {
              const validation = validatePhoneNumberWithLib(
                userDataObj.phone,
                userDataObj.country.dial_code,
                userDataObj.country.code
              );
              setIsPhoneVerified(validation.isValid);
              setPhoneFormatted(validation.formattedNumber);
            }
            
            // Set date of birth if available
            if (userDataObj.dayOfBirth) {
              try {
                const birthDate = new Date(userDataObj.dayOfBirth);
                if (!isNaN(birthDate.getTime())) {
                  setDay(birthDate.getDate().toString().padStart(2, "0"));
                  setMonth((birthDate.getMonth() + 1).toString().padStart(2, "0"));
                  setYear(birthDate.getFullYear().toString());
                }
              } catch (dateError) {
                console.error("Error parsing date of birth:", dateError);
              }
            }
            
            setDarkModeEnabled(userDataObj.darkMode || false);
            setSelectedLang(userDataObj.language || "English");
            
            // Set userClickedVerified based on existing phoneVerified status
            const phoneVerifiedStatus = userDataObj.phoneVerified || false;
            setUserClickedVerified(phoneVerifiedStatus);
            if (phoneVerifiedStatus && userDataObj.phone) {
              setIsPhoneVerified(true);
            }

            // Save original data for discard functionality
            const originalDataObj = {
              phone: userDataObj.phone || "",
              country: userDataObj.country || { name: "Nigeria", code: "NG", dial_code: "+234" },
              day: userDataObj.dayOfBirth ? new Date(userDataObj.dayOfBirth).getDate().toString().padStart(2, "0") : "",
              month: userDataObj.dayOfBirth ? (new Date(userDataObj.dayOfBirth).getMonth() + 1).toString().padStart(2, "0") : "",
              year: userDataObj.dayOfBirth ? new Date(userDataObj.dayOfBirth).getFullYear().toString() : "",
              darkMode: userDataObj.darkMode || false,
              language: userDataObj.language || "English",
              currency: userDataObj.currency || "USD",
              phoneVerified: phoneVerifiedStatus
            };
            
            setOriginalData(originalDataObj);
            
          } catch (error) {
            setSaveMessage("Error loading user data. Please refresh the page.");
          }
        }
        
        setLoading(false);
      }
    };

    const loadCurrencies = async () => {
      setLoadingCurrencies(true);
      try {
        await countryCurrencyService.initialize();
        const currencies = countryCurrencyService.getAllCurrencies();
        setCurrencyOptions(currencies);

        const savedCurrency = localStorage.getItem('selectedCurrency');
        const currencyCode = savedCurrency || 'USD';

        const defaultCurrency = countryCurrencyService.getCurrencyByCode(currencyCode) ||
          currencies.find(c => c.code === 'USD') ||
          currencies[0];

        setSelectedCurrency(defaultCurrency);

      } catch (error) {
        console.error('Error loading currencies:', error);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    loadUserData();
    loadCurrencies();
  }, []);

  // Handle phone number change
  const handlePhoneChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "");
    setPhone(numericValue);

    if (numericValue.length < 4) {
      setIsPhoneVerified(false);
      setUserClickedVerified(false);
      setPhoneFormatted("");
      setPhoneValidationError("Phone number is too short");
      updatePhoneVerifiedInLocalStorage(false);
    } else {
      setPhoneValidationError("");
      setUserClickedVerified(false);
      updatePhoneVerifiedInLocalStorage(false);
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setOpenCountry(false);
    setCountrySearch("");
    setUserClickedVerified(false);
    updatePhoneVerifiedInLocalStorage(false);

    if (phone.length >= 4) {
      const validation = validatePhoneNumberWithLib(phone, country.dial_code, country.code);
      setIsPhoneVerified(validation.isValid);
      setPhoneFormatted(validation.formattedNumber);
      setPhoneValidationError(validation.isValid ? "" : validation.message);
    }
  };

  // Filter countries based on search
  const filteredCountries = countrySearch
    ? countries.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.dial_code.includes(countrySearch)
    )
    : countries;

  // Handle currency selection
  const handleCurrencySelect = (currencyOption: CurrencyOption) => {
    setSelectedCurrency(currencyOption);
    setOpenCurrency(false);
    setCurrencySearch("");
  };

  // Filter currencies based on search
  const filteredCurrencies = currencySearch
    ? countryCurrencyService.searchCurrencies(currencySearch)
    : currencyOptions;

  // Helper function to get display email
  const getDisplayEmail = () => {
    if (loading) return "Loading...";
    
    if (clientUser?.email) {
      return clientUser.email;
    }
    
    if (userData?.email) {
      return userData.email;
    }
    
    return "No email found";
  };

  // Helper function to get display username - EXACTLY ONE @
  const getDisplayUsername = () => {
    if (loading) return "@User";
    
    let rawUsername = "";
    
    // Get username from clientUser (which contains userData from localStorage)
    if (clientUser?.username) {
      rawUsername = clientUser.username;
    }
    
    // If we have a username, clean it and add exactly one @
    if (rawUsername) {
      // Remove ALL @ characters from the username
      const cleanUsername = rawUsername.replace(/@/g, '');
      // Add exactly one @ prefix
      return `@${cleanUsername}`;
    }
    
    return "@User";
  };

  // CORRECTED Save Changes function
  const handleSaveChanges = async () => {
    if (!userClickedVerified) {
      setSaveMessage("❌ Please verify your phone number before saving changes");
      setTimeout(() => setSaveMessage(""), 3000);
      return;
    }

    if (!userData) {
      setSaveMessage("❌ Error: User data not found");
      return;
    }

    try {
      setIsSaving(true);
      setSaveMessage("");

      const storedUser = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
      const accessToken = storedUser ? JSON.parse(storedUser)?.accessToken : null;

      if (!accessToken) {
        setSaveMessage("❌ Error: No access token found. Please log in again.");
        return;
      }

      // Prepare update data
      const composedPhone = phoneFormatted || `${selectedCountry.dial_code}${phone}`;
      
      // Format date of birth for localStorage
      let formattedDateOfBirth = null;
      if (day && month && year) {
        const formattedDay = day.padStart(2, '0');
        const formattedMonth = month.padStart(2, '0');
        formattedDateOfBirth = `${year}-${formattedMonth}-${formattedDay}`;
        
        const dateObj = new Date(formattedDateOfBirth);
        if (isNaN(dateObj.getTime())) {
          setSaveMessage("❌ Invalid date of birth");
          setIsSaving(false);
          return;
        }
      }

      const updateData = {
        phone: composedPhone,
        country: selectedCountry.code
      };

      const res = await fetch("https://evolve2p-backend.onrender.com/api/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`
        },
        body: JSON.stringify(updateData),
      });

      let responseData;
      let responseText = "";
      
      try {
        responseText = await res.text();
        if (responseText && responseText.trim() !== "") {
          responseData = JSON.parse(responseText);
        } else {
          responseData = {};
        }
      } catch (parseError) {
        responseData = { rawResponse: responseText };
      }

      if (!res.ok) {
        let errorMessage = "Failed to update profile";
        
        if (responseData) {
          if (typeof responseData === 'string') {
            errorMessage = responseData;
          } else if (responseData.message) {
            errorMessage = responseData.message;
          } else if (responseData.error) {
            errorMessage = typeof responseData.error === 'string' 
              ? responseData.error 
              : JSON.stringify(responseData.error);
          }
        }
        
        setSaveMessage(`❌ ${errorMessage}`);
        return;
      }

      // ✅ SUCCESS - API update successful
      setSaveMessage("✅ Profile updated successfully! Phone verification saved.");
      
      // Update localStorage
      const currentStored = localStorage.getItem("UserData");
      if (currentStored) {
        const currentParsed = JSON.parse(currentStored);
        const updatedUserData = { 
          ...currentParsed, 
          phone: phone,
          country: selectedCountry,
          phoneVerified: true,
          ...(formattedDateOfBirth && { dayOfBirth: formattedDateOfBirth }),
          darkMode: darkModeEnabled,
          language: selectedLang,
          currency: selectedCurrency?.code || "USD",
          userData: currentParsed.userData ? {
            ...currentParsed.userData,
            phoneVerified: true
          } : currentParsed.userData
        };
        
        localStorage.setItem("UserData", JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
        
        const userDataFromStorage = updatedUserData?.userData || updatedUserData;
        setClientUser(userDataFromStorage);
      }

      // Update original data
      setOriginalData({
        phone,
        country: selectedCountry,
        day,
        month,
        year,
        darkMode: darkModeEnabled,
        language: selectedLang,
        currency: selectedCurrency?.code || "USD",
        phoneVerified: true
      });

      setTimeout(() => setSaveMessage(""), 3000);

    } catch (error) {
      setSaveMessage("❌ Network error: Failed to connect to server");
    } finally {
      setIsSaving(false);
    }
  };

  // Discard Changes function
  const handleDiscardChanges = () => {
    if (originalData) {
      setPhone(originalData.phone || "");
      setSelectedCountry(originalData.country || { name: "Nigeria", code: "NG", dial_code: "+234" });
      setDay(originalData.day || "");
      setMonth(originalData.month || "");
      setYear(originalData.year || "");
      setDarkModeEnabled(originalData.darkMode || false);
      setSelectedLang(originalData.language || "English");
      setUserClickedVerified(originalData.phoneVerified || false);
      
      const currentStored = localStorage.getItem("UserData");
      if (currentStored && userData) {
        const currentParsed = JSON.parse(currentStored);
        const updatedUserData = {
          ...currentParsed,
          phone: originalData.phone || "",
          country: originalData.country || { name: "Nigeria", code: "NG", dial_code: "+234" },
          phoneVerified: originalData.phoneVerified || false,
          userData: currentParsed.userData ? {
            ...currentParsed.userData,
            phoneVerified: originalData.phoneVerified || false
          } : currentParsed.userData
        };
        
        localStorage.setItem("UserData", JSON.stringify(updatedUserData));
        setUserData(updatedUserData);
      }

      if (originalData.currency) {
        const currency = currencyOptions.find(c => c.code === originalData.currency);
        if (currency) {
          setSelectedCurrency(currency);
        }
      }

      setIsPhoneVerified(originalData.phoneVerified || false);
      setPhoneValidationError("");
      setPhoneFormatted("");

      setSaveMessage("✅ Changes discarded");
      setTimeout(() => setSaveMessage(""), 3000);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <main className="min-h-screen bg-[#0F1012] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
          <Nav />
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto border-4 border-[#4DF2BE] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Loading profile...</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Nav />

        <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:mt-8">
          {/* Settings Sidebar */}
          <div className="lg:w-[300px]">
            <Settings />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#1A1A1A] rounded-xl p-4 lg:p-6">
            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <p className="text-xl lg:text-2xl font-bold text-white">Profile</p>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleDiscardChanges}
                  disabled={isSaving}
                  className="flex items-center justify-center whitespace-nowrap w-32 lg:w-36 h-9 text-sm text-white font-bold bg-[#2D2D2D] px-4 rounded-full hover:bg-[#3A3A3A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Discard Changes
                </button>

                <button
                  onClick={handleSaveChanges}
                  disabled={isSaveDisabled()}
                  className="flex items-center  justify-center w-28 lg:w-32 h-9 text-sm text-[#0F1012] whitespace-nowrap font-bold border border-[#4DF2BE] bg-[#4DF2BE] px-4 rounded-full hover:bg-[#3DE0AD] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Save Message */}
            {saveMessage && (
              <div className={`mb-6 p-3 rounded-lg text-sm font-medium ${saveMessage.includes("✅")
                ? "bg-[#1A3A2F] text-[#4DF2BE]"
                : "bg-[#3A2A2A] text-[#FE857D]"
                }`}>
                {saveMessage}
              </div>
            )}

            {/* Phone Verification Status */}
            <div className="mb-6 p-4 bg-[#2D2D2D] rounded-lg border border-[#4DF2BE]/30">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                  userClickedVerified ? "bg-[#4DF2BE]" : "bg-blue-500"
                }`}>
                  <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {userClickedVerified ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    )}
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-medium ${
                    userClickedVerified ? "text-[#4DF2BE]" : "text-blue-400"
                  }`}>
                    {userClickedVerified ? "Phone Verified ✓" : "Phone Verification Required"}
                  </p>
                  <p className="text-xs text-gray-300 mt-1">
                    {userClickedVerified 
                      ? "Your phone number is verified. Remember to save changes to update your profile."
                      : "Enter your phone number, then click 'Click to Verify' above. Finally, save changes to complete verification."}
                  </p>
                </div>
              </div>
            </div>

            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Email - Locked */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-[#C7C7C7]">
                  Email
                </label>
                <input
                  type="email"
                  readOnly
                  value={getDisplayEmail()}
                  className="h-12 lg:h-14 bg-[#222222] mt-1 px-4 rounded-lg text-sm font-normal border-none text-[#8F8F8F] cursor-not-allowed"
                />
                <div className="flex items-center h-7 bg-[#2D2D2D] text-xs text-[#8F8F8F] font-normal px-3 rounded-b-lg">
                  Contact admin to change email
                </div>
              </div>

              {/* Username - Locked */}
              <div className="flex flex-col">
                <label className="text-sm font-medium text-[#C7C7C7]">
                  Username
                </label>
                <div className="relative">
                  
                  <input
                    type="text"
                    readOnly
                    value={getDisplayUsername()}
                    className="w-full h-12 lg:h-14 bg-[#222222] px-10 mt-1 rounded-t-lg text-sm font-normal border-none text-[#8F8F8F] cursor-not-allowed"
                  />
                </div>
                <div className="flex items-center h-7 bg-[#2D2D2D] text-xs text-[#8F8F8F] font-normal px-3 rounded-b-lg">
                  Contact admin to change username
                </div>
              </div>

              {/* Phone & Country - Editable */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Phone Number */}
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-[#C7C7C7]">
                      Phone number
                    </p>
                    <div className="flex items-center gap-2">
                      {phone && phone.length >= 4 && (
                        phoneVerificationLoading ? (
                          <span className="text-sm text-[#8F8F8F]">Checking...</span>
                        ) : isPhoneVerified ? (
                          userClickedVerified ? (
                            <span className="text-sm font-bold text-[#4DF2BE] flex items-center gap-1">
                              ✓ Verified
                            </span>
                          ) : (
                            <button
                              type="button"
                              onClick={handleVerifiedClick}
                              className="text-sm font-bold text-[#4DF2BE] flex items-center gap-1 cursor-pointer hover:underline bg-transparent border-none"
                            >
                              ✓ Click to Verify
                            </button>
                          )
                        ) : (
                          <span className="text-sm font-bold text-[#FE857D] flex items-center gap-1">
                            ✗ Not Verified
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex items-center mt-2">
                    <div className="relative w-full">
                      <span className="flex items-center justify-center absolute w-16 h-6 bg-[#3A3A3A] left-3 top-1/2 -translate-y-1/2 rounded-2xl text-xs font-medium text-[#DBDBDB]">
                        {selectedCountry.dial_code}
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="w-full h-12 lg:h-14 bg-[#222222] rounded-lg border-none pl-20 pr-10 text-sm font-normal text-[#C7C7C7]"
                        placeholder="Enter phone number"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {phone && phone.length >= 4 && isPhoneVerified && userClickedVerified ? (
                          <BlueTick />
                        ) : (
                          <Image
                            src={Yellow_i}
                            alt="yellowi"
                            width={20}
                            height={20}
                            className="w-5 h-5"
                          />
                        )}
                      </span>
                    </div>
                  </div>

                  {/* Phone validation messages */}
                  {phoneValidationError && (
                    <div className="mt-2 text-xs text-[#FE857D] font-medium">
                      {phoneValidationError}
                    </div>
                  )}

                  {/* Phone formatted preview */}
                  {isPhoneVerified && phoneFormatted && (
                    <div className="mt-2 text-xs text-[#4DF2BE] font-medium">
                      Formatted: {phoneFormatted}
                      {!userClickedVerified && " - Click 'Click to Verify' above"}
                    </div>
                  )}
                </div>

                {/* Country */}
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#C7C7C7]">
                    Country
                  </p>
                  <div className="flex items-center mt-2">
                    <div className="relative w-full">
                      <div
                        className="flex items-center cursor-pointer"
                        onClick={() => setOpenCountry(!openCountry)}
                      >
                        <input
                          type="text"
                          readOnly
                          className="w-full h-12 lg:h-14 bg-[#222222] rounded-lg border-none px-4 text-sm font-normal text-[#C7C7C7] cursor-pointer"
                          value={selectedCountry.name}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                          <Image src={ArrowD} alt="arrow-down" className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {openCountry && (
                    <div className="absolute mt-2 w-full bg-[#1A1A1A] rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 border border-[#2D2D2D]">
                      <div className="p-4">
                        <div className="flex justify-between items-center mb-4">
                          <p className="text-base font-bold text-white">Select Country</p>
                          <Image
                            src={Times}
                            alt="times"
                            width={24}
                            height={24}
                            className="w-6 h-6 cursor-pointer"
                            onClick={() => setOpenCountry(false)}
                          />
                        </div>

                        <input
                          type="text"
                          placeholder="Search country..."
                          value={countrySearch}
                          onChange={(e) => setCountrySearch(e.target.value)}
                          className="w-full h-12 px-4 bg-[#2D2D2D] border-none text-white rounded-lg outline-none text-sm mb-4"
                        />

                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                              <div
                                key={country.code}
                                onClick={() => handleCountrySelect(country)}
                                className="flex items-center justify-between bg-[#3A3A3A] py-3 px-4 rounded-lg cursor-pointer hover:bg-[#4A4A4A]"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-6 bg-[#2D2D2D] rounded flex items-center justify-center text-xs text-[#DBDBDB]">
                                    {country.code}
                                  </div>
                                  <div>
                                    <div className="text-[#DBDBDB] text-sm font-medium">{country.name}</div>
                                  </div>
                                </div>
                                <span className="text-[#4DF2BE] text-sm font-medium">
                                  {country.dial_code}
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-center text-[#999] py-4">No results found</p>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Date of Birth - Editable */}
              <div className="relative">
                <label className="text-sm font-medium text-[#C7C7C7] mb-1 block">
                  Date of Birth
                </label>

                <div
                  className="relative h-12 lg:h-14 bg-[#222222] rounded-lg border-none px-4 flex items-center cursor-pointer"
                  onClick={() => setOpenDate(!openDate)}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    <Image src={Callen} alt="calendar" width={20} height={20} className="w-5 h-5" />
                  </div>

                  <span className="ml-8 text-[#C7C7C7] text-sm font-normal">
                    {day && month && year
                      ? `${day}/${month}/${year}`
                      : "DD/MM/YYYY"}
                  </span>

                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Image src={ArrowD} alt="arrow" className="w-4 h-4" />
                  </div>
                </div>

                {openDate && (
                  <div className="absolute mt-2 w-full bg-[#222222] rounded-lg shadow-lg p-4 z-50">
                    <div className="flex gap-3">
                      <select
                        className="flex-1 bg-[#222222] text-[#C7C7C7] text-sm font-normal focus:outline-none p-2 rounded border border-[#3A3A3A]"
                        value={day}
                        onChange={(e) => setDay(e.target.value)}
                      >
                        <option value="">Day</option>
                        {days.map((d) => (
                          <option key={d} value={d.toString().padStart(2, "0")}>
                            {d.toString().padStart(2, "0")}
                          </option>
                        ))}
                      </select>

                      <select
                        className="flex-1 bg-[#222222] text-[#C7C7C7] text-sm font-normal focus:outline-none p-2 rounded border border-[#3A3A3A]"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        <option value="">Month</option>
                        {months.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>

                      <select
                        className="flex-1 bg-[#222222] text-[#C7C7C7] text-sm font-normal focus:outline-none p-2 rounded border border-[#3A3A3A]"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value="">Year</option>
                        {years.map((y) => (
                          <option key={y} value={y}>
                            {y}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-px bg-[#3A3A3A] my-6" />

              {/* Others Section - Local Preferences Only */}
              <div>
                <p className="text-sm font-medium text-[#C7C7C7] mb-4">Preferences (Local Only)</p>

                <div className="space-y-3">
                  {/* Preferred Currency */}
                  <div className="relative">
                    <div className="flex items-center justify-between h-11 bg-[#2D2D2D] px-4 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Image src={Currency} alt="currency" className="w-5 h-5" />
                        <p className="text-sm font-medium text-[#DBDBDB]">
                          Preferred currency
                        </p>
                      </div>
                      <div
                        onClick={() => setOpenCurrency(!openCurrency)}
                        className="flex items-center w-16 h-6 bg-[#3A3A3A] px-2 rounded-2xl cursor-pointer"
                      >
                        <p className="text-xs font-medium text-[#DBDBDB]">
                          {selectedCurrency?.code || "USD"}
                        </p>
                        <Image
                          src={Barrow}
                          alt="arrow-down"
                          className="ml-2 w-3 h-3"
                        />
                      </div>
                    </div>

                    {openCurrency && (
                      <div className="absolute top-12 left-0 right-0 bg-[#1A1A1A] rounded-lg shadow-lg max-h-80 overflow-y-auto z-50 border border-[#2D2D2D]">
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-base font-bold text-white">Select preferred currency</p>
                            <Image
                              src={Times}
                              alt="times"
                              width={24}
                              height={24}
                              className="w-6 h-6 cursor-pointer"
                              onClick={() => setOpenCurrency(false)}
                            />
                          </div>

                          <input
                            type="text"
                            placeholder="Search currency..."
                            value={currencySearch}
                            onChange={(e) => setCurrencySearch(e.target.value)}
                            className="w-full h-12 px-4 bg-[#2D2D2D] border-none text-white rounded-lg outline-none text-sm mb-4"
                          />

                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {loadingCurrencies ? (
                              <div className="text-center text-[#999] py-4">Loading currencies...</div>
                            ) : filteredCurrencies.length > 0 ? (
                              filteredCurrencies.map((currencyOption) => (
                                <div
                                  key={currencyOption.code}
                                  onClick={() => handleCurrencySelect(currencyOption)}
                                  className="flex items-center justify-between bg-[#3A3A3A] py-3 px-4 rounded-lg cursor-pointer hover:bg-[#4A4A4A]"
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={currencyOption.flag}
                                      alt={`${currencyOption.country} flag`}
                                      width={24}
                                      height={24}
                                      className="rounded-full object-cover"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://flagcdn.com/w320/us.png';
                                      }}
                                    />
                                    <div>
                                      <div className="text-[#DBDBDB] text-sm font-medium">{currencyOption.name}</div>
                                      <div className="text-[#8F8F8F] text-xs">{currencyOption.country}</div>
                                    </div>
                                  </div>
                                  <span className="text-[#4DF2BE] text-sm font-medium">
                                    {currencyOption.code}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <p className="text-center text-[#999] py-4">No results found</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dark Mode */}
                  <div className="flex items-center justify-between h-11 bg-[#2D2D2D] px-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Image src={Mode} alt="mode" className="w-5 h-5" />
                      <p className="text-sm font-medium text-[#DBDBDB]">
                        Dark mode
                      </p>
                    </div>
                    <Toggle
                      enabled={darkModeEnabled}
                      onToggle={() => setDarkModeEnabled(!darkModeEnabled)}
                    />
                  </div>

                  {/* App Language */}
                  <div className="flex items-center justify-between h-11 bg-[#2D2D2D] px-4 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Image src={Lang} alt="lang" className="w-5 h-5" />
                      <p className="text-sm font-medium text-[#DBDBDB]">
                        App Language
                      </p>
                    </div>

                    <div
                      onClick={() => setOpenLang(!openLang)}
                      className="flex items-center w-20 h-6 bg-[#3A3A3A] px-2 rounded-2xl cursor-pointer"
                    >
                      <p className="text-xs font-medium text-[#DBDBDB] truncate">
                        {selectedLang}
                      </p>
                      <Image
                        src={Barrow}
                        alt="arrow"
                        className={`ml-2 w-3 h-3 transition-transform duration-200 ${openLang ? "rotate-180" : ""
                          }`}
                      />
                    </div>

                    {openLang && (
                      <div className="absolute top-12 right-0 left-0 mt-2 bg-[#222222] rounded-lg shadow-lg z-50">
                        <div className="py-2 max-h-48 overflow-y-auto">
                          {languages.map((lang) => (
                            <div
                              key={lang}
                              onClick={() => {
                                setSelectedLang(lang);
                                setOpenLang(false);
                              }}
                              className={`px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-[#2D2D2D] text-sm font-medium ${selectedLang === lang
                                ? "text-[#4DF2BE]"
                                : "text-[#DBDBDB]"
                                }`}
                            >
                              {lang}
                              {selectedLang === lang && (
                                <span className="w-2 h-2 rounded-full bg-[#4DF2BE]"></span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>

            {/* Account Management Notice */}
            <div className="mt-8">
              <div className="flex items-center justify-between h-11 bg-[#2D2D2D] px-4 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-[#3A3A3A] rounded flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 11C8.76142 11 11 8.76142 11 6C11 3.23858 8.76142 1 6 1C3.23858 1 1 3.23858 1 6C1 8.76142 3.23858 11 6 11Z" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 8V6" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M6 4H6.005" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-[#DBDBDB]">
                    Account Management
                  </p>
                </div>
                <p className="text-xs text-[#8F8F8F] font-medium">
                  Contact admin for account changes
                </p>
              </div>

              <div className="mt-4 p-4 bg-[#222222] rounded-lg">
                <p className="text-sm font-medium text-[#DBDBDB] mb-2">
                  Account Security Notice
                </p>
                <p className="text-xs text-[#8F8F8F]">
                  For security reasons, email and username changes are restricted.
                  Please contact our admin team for any account modifications.
                  Phone number, country, date of birth, and preferences can be updated freely.
                </p>
              </div>
            </div>
          </div>
        </div>

          <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] whitespace-nowrap mt-[10%] ">
                  <Footer />
                </div>
      </div>
    </main>
  );
};

export default Profile;