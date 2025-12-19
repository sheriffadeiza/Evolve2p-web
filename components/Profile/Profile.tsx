"use client";

import React, { useState, useEffect, useRef } from "react";
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
import PhoneInput from 'react-phone-number-input';
import { isValidPhoneNumber, isPossiblePhoneNumber } from 'react-phone-number-input';
import { E164Number } from 'libphonenumber-js';
import 'react-phone-number-input/style.css';

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

// Helper function to format phone number to E.164
const formatToE164 = (phone: string, countryDialCode: string = "+234"): string => {
  if (!phone) return "";
  
  // If already in E.164 format, return as is
  if (phone.startsWith('+')) {
    return phone;
  }
  
  // Remove all non-digits
  const cleaned = phone.replace(/\D/g, '');
  
  if (!cleaned) return "";
  
  // Remove country code digits from dial code
  const countryCodeDigits = countryDialCode.replace('+', '');
  
  // Remove leading zero if present
  let digits = cleaned;
  if (digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  
  // Check if the number already starts with country code
  if (digits.startsWith(countryCodeDigits)) {
    return `+${digits}`;
  }
  
  // Return in E.164 format
  return `+${countryCodeDigits}${digits}`;
};

const Profile = () => {
  const router = useRouter();
  const countryRef = useRef<HTMLDivElement>(null);
  const currencyRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);

  // Currency states using the service
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption | null>(null);
  const [openCurrency, setOpenCurrency] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  // Phone and Country states
  const [phoneNumber, setPhoneNumber] = useState<E164Number | undefined>();
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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(event.target as Node)) {
        setOpenCountry(false);
      }
      if (currencyRef.current && !currencyRef.current.contains(event.target as Node)) {
        setOpenCurrency(false);
      }
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setOpenLang(false);
      }
      if (dateRef.current && !dateRef.current.contains(event.target as Node)) {
        setOpenDate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Function to update phoneVerified in localStorage
  const updatePhoneVerifiedInLocalStorage = (isVerified: boolean) => {
    try {
      const stored = localStorage.getItem("UserData");
      if (stored) {
        const parsed = JSON.parse(stored);
        
        const updatedData = {
          ...parsed,
          phoneVerified: isVerified,
          ...(parsed.userData && {
            userData: {
              ...parsed.userData,
              phoneVerified: isVerified
            }
          })
        };
        
        localStorage.setItem("UserData", JSON.stringify(updatedData));
        setUserData(updatedData);
        
        const userDataFromStorage = updatedData?.userData || updatedData;
        setClientUser(userDataFromStorage);
        
        return true;
      }
    } catch (error) {
      console.error("Error updating phoneVerified in localStorage:", error);
    }
    return false;
  };

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
        detectedCountry: undefined
      };
      
    } catch (error) {
      console.error("Phone validation error:", error);
      return {
        isValid: false,
        message: "Error validating phone number",
        formattedNumber: "",
        detectedCountry: undefined
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
        
        setIsPhoneVerified(validation.isValid);
        setPhoneFormatted(validation.formattedNumber);
        setPhoneValidationError(validation.isValid ? "" : validation.message);

        if (!validation.isValid) {
          setUserClickedVerified(false);
          updatePhoneVerifiedInLocalStorage(false);
        }
        
        setPhoneVerificationLoading(false);
      } else if (phoneNumber && phoneNumber.toString().length > 0) {
        setIsPhoneVerified(false);
        setUserClickedVerified(false);
        setPhoneFormatted("");
        setPhoneValidationError("Phone number is too short");
        updatePhoneVerifiedInLocalStorage(false);
      } else {
        setIsPhoneVerified(false);
        setPhoneValidationError("");
      }
    };

    validatePhone();
  }, [phoneNumber]);

  // Handle verified phone click
  const handleVerifiedClick = () => {
    if (isPhoneVerified) {
      setUserClickedVerified(true);
      
      const updatedSuccessfully = updatePhoneVerifiedInLocalStorage(true);
      
      if (updatedSuccessfully) {
        setSaveMessage("✅ Phone number verified! Don't forget to save changes.");
        setTimeout(() => setSaveMessage(""), 3000);
      } else {
        setSaveMessage("⚠️ Could not update verification status. Please try again.");
      }
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

  // Load user data and currencies - FIXED E.164 FORMATTING
  useEffect(() => {
    const loadUserData = async () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      
      const stored = localStorage.getItem("UserData");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          
          const userDataFromStorage = parsed?.userData || parsed;
          
          setClientUser(userDataFromStorage);
          
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
          
          // FIX: Convert local number to E.164 format
          const selectedCountry = userDataObj.country || { name: "Nigeria", code: "NG", dial_code: "+234" };
          
          // Format phone to E.164
          const formattedPhone = formatToE164(userDataObj.phone, selectedCountry.dial_code);
          
          setPhoneNumber(formattedPhone as E164Number || undefined);
          setSelectedCountry(selectedCountry);
          
          const phoneVerifiedStatus = userDataObj.phoneVerified || false;
          setUserClickedVerified(phoneVerifiedStatus);
          
          if (phoneVerifiedStatus && userDataObj.phone) {
            setIsPhoneVerified(true);
          }
          
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

          const originalDataObj = {
            phone: formattedPhone || "",
            country: selectedCountry,
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
          console.error("Error loading user data:", error);
          setSaveMessage("Error loading user data. Please refresh the page.");
        }
      }
      
      setLoading(false);
    };

    const loadCurrencies = async () => {
      if (typeof window === 'undefined') {
        setLoadingCurrencies(false);
        return;
      }
      
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

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setOpenCountry(false);
    setCountrySearch("");
    setUserClickedVerified(false);
    updatePhoneVerifiedInLocalStorage(false);
  };

  // Filter countries based on search
  const filteredCountries = countrySearch
    ? countries.filter(country =>
      country.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      country.code.toLowerCase().includes(countrySearch.toLowerCase())
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

  // Helper function to get display username
  const getDisplayUsername = () => {
    if (loading) return "@User";
    
    let rawUsername = "";
    
    if (clientUser?.username) {
      rawUsername = clientUser.username;
    }
    
    if (rawUsername) {
      const cleanUsername = rawUsername.replace(/@/g, '');
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
        phone: phoneNumber || "",
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

      setSaveMessage("✅ Profile updated successfully! Phone verification saved.");
      
      const currentStored = localStorage.getItem("UserData");
      if (currentStored) {
        const currentParsed = JSON.parse(currentStored);
        const updatedUserData = { 
          ...currentParsed, 
          phone: phoneNumber || "",
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

      setOriginalData({
        phone: phoneNumber || "",
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
      setPhoneNumber(originalData.phone as E164Number || undefined);
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
      <style jsx global>{`
        /* Phone Input Container Styles */
        .custom-phone-input {
          width: 100%;
        }
        
        .custom-phone-input .PhoneInput {
          display: flex;
          align-items: center;
          width: 100%;
        }
        
        .custom-phone-input .PhoneInputCountry {
          background: #1F1F1F;
          padding: 0.5rem;
          border-radius: 0.5rem 0 0 0.5rem;
          margin-right: 0.5rem;
          border: 1px solid #3A3A3A;
          height: 44px;
          gap:40%;
          min-width: 80px;
        }
        
        .custom-phone-input .PhoneInputCountrySelect {
          background: #000;
          border: none;
          color: #4DF2BE;
        }
        
        .custom-phone-input .PhoneInputCountrySelectArrow {
          color: #8F8F8F;
          margin-left: 4px;
        }
        
        .custom-phone-input .PhoneInputCountryIcon {
          border-radius: 0.25rem;
          width: 20px;
          height: 15px;
        }
        
        .custom-phone-input .PhoneInputCountryIcon--border {
          box-shadow: none;
        }
        
        .custom-phone-input .PhoneInputInput {
          background: #1F1F1F;
          color: #FFFFFF;
          border: 1px solid #3A3A3A;
          border-radius: 0 0.5rem 0.5rem 0;
          padding: 0.75rem 1rem;
          height: 44px;
          font-size: 0.875rem;
          width: 100%;
          flex: 1;
        }
        
        .custom-phone-input .PhoneInputInput:focus {
          outline: none;
          border-color: #4DF2BE;
          box-shadow: 0 0 0 1px #4DF2BE;
        }
        
        .custom-phone-input .PhoneInputInput::placeholder {
          color: #8F8F8F;
        }
        
        /* Phone Input Dropdown Styles */
        .PhoneInputCountryDropdown {
          background: #1A1A1A;
          border: 1px solid #3A3A3A;
          border-radius: 0.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
          max-height: 300px;
          overflow-y: auto;
          width: 320px !important;
          z-index: 9999;
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
          background: #1A1A1A;
          color: #FFFFFF;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #2D2D2D;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .PhoneInputCountryDropdown option:hover {
          background: #2D2D2D;
        }
        
        .PhoneInputCountryDropdown option:checked,
        .PhoneInputCountryDropdown option:focus {
          background: #4DF2BE;
          color: #0F1012;
        }
        
        /* Responsive adjustments */
        @media (max-width: 640px) {
          .custom-phone-input .PhoneInputCountry {
            min-width: 70px;
          }
          
          .PhoneInputCountryDropdown {
            width: 280px !important;
          }
        }
        
        @media (min-width: 1024px) {
          .PhoneInputCountryDropdown {
            width: 350px !important;
          }
        }
      `}</style>

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
                      ? `Your phone number ${phoneFormatted || phoneNumber} is verified. Changes are saved locally.`
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
                  className="h-12 lg:h-14 bg-[#1F1F1F] border border-[#3A3A3A] mt-1 px-4 rounded-lg text-sm font-normal text-[#FFFFFF] cursor-not-allowed focus:border-[#4DF2BE] transition-colors"
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
                    className="w-full h-12 lg:h-14 bg-[#1F1F1F] border border-[#3A3A3A] px-10 mt-1 rounded-t-lg text-sm font-normal text-[#FFFFFF] cursor-not-allowed focus:border-[#4DF2BE] transition-colors"
                  />
                </div>
                <div className="flex items-center h-7 bg-[#2D2D2D] text-xs text-[#8F8F8F] font-normal px-3 rounded-b-lg">
                  Contact admin to change username
                </div>
              </div>

              {/* Phone & Country - Editable */}
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Phone Number - This handles country codes */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-[#C7C7C7]">
                      Phone number
                    </p>
                    <div className="flex items-center gap-2">
                      {phoneNumber && phoneNumber.toString().length >= 4 && (
                        phoneVerificationLoading ? (
                          <span className="text-sm text-[#8F8F8F]">Checking...</span>
                        ) : (
                          <div className="flex items-center gap-2">
                            {isPhoneVerified ? (
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
                            )}
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="relative w-full">
                    <PhoneInput
                      international
                      countryCallingCodeEditable={false}
                      defaultCountry="NG"
                      value={phoneNumber || ""}
                      onChange={setPhoneNumber}
                      className="custom-phone-input"
                      style={{
                        '--PhoneInput-color--focus': '#4DF2BE',
                        '--PhoneInputCountrySelectArrow-color': '#C7C7C7',
                        '--PhoneInputCountryFlag-borderColor': 'transparent',
                        '--PhoneInputCountryFlag-height': '20px',
                        '--PhoneInputCountryFlag-width': '30px',
                      } as React.CSSProperties}
                    />
                    
                    <span className="absolute right-3 top-1/2 -translate-y-1/2">
                      {phoneNumber && phoneNumber.toString().length >= 4 && isPhoneVerified && userClickedVerified ? (
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

                {/* Country Dropdown - Just shows countries (no codes) */}
                <div className="flex-1" ref={countryRef}>
                  <p className="text-sm font-medium text-[#C7C7C7] mb-2">
                    Country
                  </p>
                  <div className="relative">
                    <div
                      className="flex items-center cursor-pointer"
                      onClick={() => setOpenCountry(!openCountry)}
                    >
                      <div className="w-full h-12 lg:h-14 bg-gradient-to-b from-[#1F1F1F] to-[#222222] border border-[#3A3A3A] hover:border-[#4DF2BE]/50 transition-all duration-200 rounded-lg flex items-center justify-between px-4 group hover:shadow-lg hover:shadow-[#4DF2BE]/10">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-6 bg-gradient-to-br from-[#2D2D2D] to-[#1A1A1A] rounded-md flex items-center justify-center text-xs font-semibold text-[#DBDBDB] shadow-md">
                            {selectedCountry.code}
                          </div>
                          <span className="text-sm font-medium text-white">
                            {selectedCountry.name}
                          </span>
                        </div>
                        <div className={`transition-transform duration-200 ${openCountry ? "rotate-180" : ""}`}>
                          <Image src={ArrowD} alt="arrow-down" className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                        </div>
                      </div>
                    </div>

                    {openCountry && (
                      <div className="absolute mt-2 w-full bg-gradient-to-b from-[#1A1A1A] to-[#222222] rounded-lg shadow-xl max-h-80 overflow-y-auto z-50 border border-[#2D2D2D] backdrop-blur-sm">
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-base font-bold text-white">Select Country</p>
                            <button
                              onClick={() => setOpenCountry(false)}
                              className="w-6 h-6 rounded-full bg-[#2D2D2D] flex items-center justify-center hover:bg-[#3A3A3A] transition-colors"
                            >
                              <Image
                                src={Times}
                                alt="times"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                            </button>
                          </div>

                          <div className="relative mb-4">
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              className="w-full h-12 px-4 pl-10 bg-[#2D2D2D] border border-[#3A3A3A] text-white rounded-lg outline-none text-sm focus:border-[#4DF2BE] transition-colors"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 14L11.1 11.1" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>

                          <div className="space-y-1 max-h-60 overflow-y-auto">
                            {filteredCountries.length > 0 ? (
                              filteredCountries.map((country) => (
                                <div
                                  key={country.code}
                                  onClick={() => handleCountrySelect(country)}
                                  className={`flex items-center py-3 px-4 rounded-lg cursor-pointer transition-all duration-150 ${selectedCountry.code === country.code
                                    ? "bg-gradient-to-r from-[#4DF2BE]/10 to-[#4DF2BE]/5 border-l-2 border-[#4DF2BE]"
                                    : "bg-[#2D2D2D] hover:bg-[#3A3A3A]"
                                    }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-6 rounded-md flex items-center justify-center text-xs font-semibold shadow-sm ${selectedCountry.code === country.code
                                      ? "bg-gradient-to-br from-[#4DF2BE] to-[#3DE0AD] text-[#0F1012]"
                                      : "bg-gradient-to-br from-[#3A3A3A] to-[#2D2D2D] text-[#DBDBDB]"
                                      }`}>
                                      {country.code}
                                    </div>
                                    <div className={`text-sm font-medium ${selectedCountry.code === country.code ? "text-white" : "text-[#DBDBDB]"}`}>
                                      {country.name}
                                    </div>
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#2D2D2D] flex items-center justify-center">
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10 6V10" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10 14H10.01" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                                <p className="text-[#999] text-sm">No countries found</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Date of Birth - Editable */}
              <div className="relative" ref={dateRef}>
                <label className="text-sm font-medium text-[#C7C7C7] mb-1 block">
                  Date of Birth
                </label>

                <div
                  className="relative h-12 lg:h-14 bg-gradient-to-b from-[#1F1F1F] to-[#222222] border border-[#3A3A3A] hover:border-[#4DF2BE]/50 transition-all duration-200 rounded-lg px-4 flex items-center cursor-pointer group hover:shadow-lg hover:shadow-[#4DF2BE]/10"
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

                  <div className={`absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${openDate ? "rotate-180" : ""}`}>
                    <Image src={ArrowD} alt="arrow" className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                  </div>
                </div>

                {openDate && (
                  <div className="absolute mt-2 w-full bg-gradient-to-b from-[#1A1A1A] to-[#222222] rounded-lg shadow-xl p-4 z-50 border border-[#2D2D2D] backdrop-blur-sm">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="flex-1">
                        <label className="text-xs text-[#8F8F8F] mb-1 block">Day</label>
                        <select
                          className="w-full h-10 bg-[#2D2D2D] text-[#C7C7C7] text-sm font-normal focus:outline-none p-2 rounded border border-[#3A3A3A] focus:border-[#4DF2BE] transition-colors"
                          value={day}
                          onChange={(e) => setDay(e.target.value)}
                        >
                          <option value="" className="bg-[#2D2D2D]">Select</option>
                          {days.map((d) => (
                            <option key={d} value={d.toString().padStart(2, "0")} className="bg-[#2D2D2D]">
                              {d.toString().padStart(2, "0")}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1">
                        <label className="text-xs text-[#8F8F8F] mb-1 block">Month</label>
                        <select
                          className="w-full h-10 bg-[#2D2D2D] text-[#C7C7C7] text-sm font-normal focus:outline-none p-2 rounded border border-[#3A3A3A] focus:border-[#4DF2BE] transition-colors"
                          value={month}
                          onChange={(e) => setMonth(e.target.value)}
                        >
                          <option value="" className="bg-[#2D2D2D]">Select</option>
                          {months.map((m) => (
                            <option key={m} value={m} className="bg-[#2D2D2D]">
                              {m}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="flex-1">
                        <label className="text-xs text-[#8F8F8F] mb-1 block">Year</label>
                        <select
                          className="w-full h-10 bg-[#2D2D2D] text-[#C7C7C7] text-sm font-normal focus:outline-none p-2 rounded border border-[#3A3A3A] focus:border-[#4DF2BE] transition-colors"
                          value={year}
                          onChange={(e) => setYear(e.target.value)}
                        >
                          <option value="" className="bg-[#2D2D2D]">Select</option>
                          {years.map((y) => (
                            <option key={y} value={y} className="bg-[#2D2D2D]">
                              {y}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-[#3A3A3A] to-transparent my-6" />

              {/* Others Section - Local Preferences Only */}
              <div>
                <p className="text-sm font-medium text-[#C7C7C7] mb-4">Preferences (Local Only)</p>

                <div className="space-y-3">
                  {/* Preferred Currency - Improved */}
                  <div className="relative" ref={currencyRef}>
                    <div className="flex items-center justify-between h-12 bg-gradient-to-r from-[#2D2D2D] to-[#222222] px-4 rounded-lg border border-[#3A3A3A]">
                      <div className="flex items-center gap-3">
                        <Image src={Currency} alt="currency" className="w-5 h-5" />
                        <p className="text-sm font-medium text-[#DBDBDB]">
                          Preferred currency
                        </p>
                      </div>
                      <div
                        onClick={() => setOpenCurrency(!openCurrency)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#3A3A3A] rounded-lg cursor-pointer hover:bg-[#4A4A4A] transition-colors group"
                      >
                        <p className="text-xs font-medium text-[#DBDBDB]">
                          {selectedCurrency?.code || "USD"}
                        </p>
                        <Image
                          src={Barrow}
                          alt="arrow-down"
                          className={`w-3 h-3 transition-transform duration-200 ${openCurrency ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>

                    {openCurrency && (
                      <div className="absolute top-14 left-0 right-0 bg-gradient-to-b from-[#1A1A1A] to-[#222222] rounded-lg shadow-xl max-h-80 overflow-y-auto z-50 border border-[#2D2D2D] backdrop-blur-sm">
                        <div className="p-4">
                          <div className="flex justify-between items-center mb-4">
                            <p className="text-base font-bold text-white">Select Currency</p>
                            <button
                              onClick={() => setOpenCurrency(false)}
                              className="w-6 h-6 rounded-full bg-[#2D2D2D] flex items-center justify-center hover:bg-[#3A3A3A] transition-colors"
                            >
                              <Image
                                src={Times}
                                alt="times"
                                width={16}
                                height={16}
                                className="w-4 h-4"
                              />
                            </button>
                          </div>

                          <div className="relative mb-4">
                            <input
                              type="text"
                              placeholder="Search currency..."
                              value={currencySearch}
                              onChange={(e) => setCurrencySearch(e.target.value)}
                              className="w-full h-12 px-4 pl-10 bg-[#2D2D2D] border border-[#3A3A3A] text-white rounded-lg outline-none text-sm focus:border-[#4DF2BE] transition-colors"
                            />
                            <div className="absolute left-3 top-1/2 -translate-y-1/2">
                              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M14 14L11.1 11.1" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </div>
                          </div>

                          <div className="space-y-1 max-h-60 overflow-y-auto">
                            {loadingCurrencies ? (
                              <div className="text-center py-6">
                                <div className="w-8 h-8 mx-auto border-2 border-[#4DF2BE] border-t-transparent rounded-full animate-spin mb-3"></div>
                                <p className="text-sm text-[#999]">Loading currencies...</p>
                              </div>
                            ) : filteredCurrencies.length > 0 ? (
                              filteredCurrencies.map((currencyOption) => (
                                <div
                                  key={currencyOption.code}
                                  onClick={() => handleCurrencySelect(currencyOption)}
                                  className={`flex items-center justify-between py-3 px-4 rounded-lg cursor-pointer transition-all duration-150 ${selectedCurrency?.code === currencyOption.code
                                    ? "bg-gradient-to-r from-[#4DF2BE]/10 to-[#4DF2BE]/5 border-l-2 border-[#4DF2BE]"
                                    : "bg-[#2D2D2D] hover:bg-[#3A3A3A]"
                                    }`}
                                >
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={currencyOption.flag}
                                      alt={`${currencyOption.country} flag`}
                                      width={24}
                                      height={24}
                                      className="rounded-full object-cover border border-[#3A3A3A] shadow-sm"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://flagcdn.com/w320/us.png';
                                      }}
                                    />
                                    <div>
                                      <div className={`text-sm font-medium ${selectedCurrency?.code === currencyOption.code ? "text-white" : "text-[#DBDBDB]"}`}>
                                        {currencyOption.name}
                                      </div>
                                      <div className="text-xs text-[#8F8F8F]">{currencyOption.country}</div>
                                    </div>
                                  </div>
                                  <span className={`text-sm font-medium ${selectedCurrency?.code === currencyOption.code ? "text-[#4DF2BE]" : "text-[#8F8F8F]"}`}>
                                    {currencyOption.code}
                                  </span>
                                </div>
                              ))
                            ) : (
                              <div className="text-center py-6">
                                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[#2D2D2D] flex items-center justify-center">
                                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10 6V10" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10 14H10.01" stroke="#8F8F8F" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                  </svg>
                                </div>
                                <p className="text-[#999] text-sm">No currencies found</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dark Mode */}
                  <div className="flex items-center justify-between h-12 bg-gradient-to-r from-[#2D2D2D] to-[#222222] px-4 rounded-lg border border-[#3A3A3A]">
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

                  {/* App Language - Improved */}
                  <div className="relative" ref={langRef}>
                    <div className="flex items-center justify-between h-12 bg-gradient-to-r from-[#2D2D2D] to-[#222222] px-4 rounded-lg border border-[#3A3A3A]">
                      <div className="flex items-center gap-3">
                        <Image src={Lang} alt="lang" className="w-5 h-5" />
                        <p className="text-sm font-medium text-[#DBDBDB]">
                          App Language
                        </p>
                      </div>
                      <div
                        onClick={() => setOpenLang(!openLang)}
                        className="flex items-center gap-2 px-3 py-1.5 bg-[#3A3A3A] rounded-lg cursor-pointer hover:bg-[#4A4A4A] transition-colors group"
                      >
                        <p className="text-xs font-medium text-[#DBDBDB] truncate max-w-[80px]">
                          {selectedLang}
                        </p>
                        <Image
                          src={Barrow}
                          alt="arrow"
                          className={`ml-2 w-3 h-3 transition-transform duration-200 ${openLang ? "rotate-180" : ""}`}
                        />
                      </div>
                    </div>

                    {openLang && (
                      <div className="absolute top-14 left-0 right-0 bg-gradient-to-b from-[#1A1A1A] to-[#222222] rounded-lg shadow-xl z-50 border border-[#2D2D2D] backdrop-blur-sm">
                        <div className="py-2 max-h-48 overflow-y-auto">
                          {languages.map((lang) => (
                            <div
                              key={lang}
                              onClick={() => {
                                setSelectedLang(lang);
                                setOpenLang(false);
                              }}
                              className={`px-4 py-3 flex items-center justify-between cursor-pointer transition-all duration-150 ${selectedLang === lang
                                ? "bg-gradient-to-r from-[#4DF2BE]/10 to-[#4DF2BE]/5 border-l-2 border-[#4DF2BE]"
                                : "hover:bg-[#2D2D2D]"
                                }`}
                            >
                              <span className={`text-sm font-medium ${selectedLang === lang ? "text-[#4DF2BE]" : "text-[#DBDBDB]"}`}>
                                {lang}
                              </span>
                              {selectedLang === lang && (
                                <span className="w-2 h-2 rounded-full bg-[#4DF2BE] shadow-sm"></span>
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
              <div className="flex items-center justify-between h-12 bg-gradient-to-r from-[#2D2D2D] to-[#222222] px-4 rounded-lg border border-[#3A3A3A]">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-[#3A3A3A] to-[#2D2D2D] rounded flex items-center justify-center shadow-sm">
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

              <div className="mt-4 p-4 bg-gradient-to-b from-[#222222] to-[#1F1F1F] rounded-lg border border-[#3A3A3A]">
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

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent my-8"></div>
        
        <div className="mb-[80px] mt-8">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Profile;