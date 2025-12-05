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
import Footer from "../../components/Footer/Footer";
import { countryCurrencyService, CurrencyOption } from "../../utils/countryCurrencyService";

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
  dayOfBirth?: string;
  darkMode?: boolean;
  language?: string;
  currency?: string;
  phoneVerified?: boolean;
  accessToken?: string;
  userData?: {
    email: string;
    name: string;
    DOB: string | null;
    authType: string | null;
    country: string;
    createdAt: string;
    emailVerified: boolean;
    id: string;
    is2faEnabled: boolean;
    kycVerified: boolean;
  };
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
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");

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

  // Function to check and fix localStorage data structure
  const checkAndFixUserData = () => {
    if (typeof window !== "undefined") {
      const userDataStr = localStorage.getItem("UserData");
      console.log("🔍 Raw UserData from localStorage:", userDataStr);
      
      if (userDataStr) {
        try {
          const parsedData = JSON.parse(userDataStr);
          console.log("🔍 Parsed UserData structure:", parsedData);
          
          // Check if email and username are nested inside userData
          if (parsedData.userData && (parsedData.userData.email || parsedData.userData.name)) {
            console.log("🔄 Found nested userData, extracting email and username...");
            
            const fixedData = {
              ...parsedData,
              email: parsedData.userData.email || "",
              username: parsedData.userData.name || parsedData.userData.email?.split('@')[0] || "user",
              phone: parsedData.phone || "",
              country: parsedData.country || { name: "Nigeria", code: "NG", dial_code: "+234" },
              verified: parsedData.verified || true,
              accessToken: parsedData.accessToken || "",
              dayOfBirth: parsedData.userData.DOB,
              darkMode: parsedData.darkMode,
              language: parsedData.language,
              currency: parsedData.currency,
              phoneVerified: parsedData.phoneVerified
            };
            
            console.log("🔄 Fixed UserData:", fixedData);
            localStorage.setItem("UserData", JSON.stringify(fixedData));
            return fixedData;
          }
          return parsedData;
        } catch (error) {
          console.error('Error parsing UserData:', error);
        }
      } else {
        console.log("❌ No UserData found in localStorage");
      }
    }
    return null;
  };

  // Enhanced phone validation patterns for different countries
  const phoneValidationPatterns: { [key: string]: { pattern: RegExp, example: string, minLength: number, maxLength: number } } = {
    'NG': {
      pattern: /^(70|71|80|81|90|91)\d{8}$/,
      example: "7012345678",
      minLength: 10,
      maxLength: 10
    },
    'US': {
      pattern: /^[2-9]\d{9}$/,
      example: "5551234567",
      minLength: 10,
      maxLength: 10
    },
    'GB': {
      pattern: /^7[1-9]\d{8}$/,
      example: "7123456789",
      minLength: 10,
      maxLength: 10
    },
    'CA': {
      pattern: /^[2-9]\d{9}$/,
      example: "5551234567",
      minLength: 10,
      maxLength: 10
    },
    'GH': {
      pattern: /^[2-9]\d{8}$/,
      example: "231234567",
      minLength: 9,
      maxLength: 9
    },
    'ZA': {
      pattern: /^[6-8]\d{8}$/,
      example: "712345678",
      minLength: 9,
      maxLength: 9
    },
    'KE': {
      pattern: /^[17]\d{8}$/,
      example: "712345678",
      minLength: 9,
      maxLength: 9
    },
    'IN': {
      pattern: /^[6-9]\d{9}$/,
      example: "9876543210",
      minLength: 10,
      maxLength: 10
    },
    'FR': {
      pattern: /^[67]\d{8}$/,
      example: "612345678",
      minLength: 9,
      maxLength: 9
    },
    'DE': {
      pattern: /^[157]\d{9,10}$/,
      example: "15123456789",
      minLength: 10,
      maxLength: 11
    },
    'BR': {
      pattern: /^[1-9]{2}9?\d{8}$/,
      example: "11987654321",
      minLength: 10,
      maxLength: 11
    },
    'AU': {
      pattern: /^[2-478]\d{8}$/,
      example: "412345678",
      minLength: 9,
      maxLength: 9
    },
    'CN': {
      pattern: /^1[3-9]\d{9}$/,
      example: "13812345678",
      minLength: 11,
      maxLength: 11
    },
    'JP': {
      pattern: /^[789]0\d{8}$/,
      example: "9012345678",
      minLength: 10,
      maxLength: 10
    },
  };

  // Enhanced phone validation function
  const validatePhoneNumber = (phoneNumber: string, countryCode: string): { isValid: boolean; error?: string } => {
    if (!phoneNumber) {
      return { isValid: false, error: "Phone number is required" };
    }

    const cleanNumber = phoneNumber.replace(/\D/g, '');
    const validationRules = phoneValidationPatterns[countryCode];

    if (!validationRules) {
      if (cleanNumber.length < 7) {
        return { isValid: false, error: "Phone number is too short" };
      }
      if (cleanNumber.length > 15) {
        return { isValid: false, error: "Phone number is too long" };
      }
      if (!/^\d+$/.test(cleanNumber)) {
        return { isValid: false, error: "Phone number must contain only digits" };
      }
      return { isValid: true };
    }

    if (cleanNumber.length < validationRules.minLength) {
      return {
        isValid: false,
        error: `Phone number must be ${validationRules.minLength} digits for ${selectedCountry.name}`
      };
    }

    if (cleanNumber.length > validationRules.maxLength) {
      return {
        isValid: false,
        error: `Phone number must be ${validationRules.maxLength} digits for ${selectedCountry.name}`
      };
    }

    if (!validationRules.pattern.test(cleanNumber)) {
      return {
        isValid: false,
        error: `Invalid phone number format for ${selectedCountry.name}. Example: ${validationRules.example}`
      };
    }

    return { isValid: true };
  };

  // Free API phone validation function
  const validatePhoneWithFreeAPI = async (phoneNumber: string, countryCode: string) => {
    if (!phoneNumber || phoneNumber.length < 7) {
      return { isValid: false, error: "Phone number is too short" };
    }

    try {
      const fullNumber = `${selectedCountry.dial_code}${phoneNumber}`;
      const response = await fetch(
        `https://phonevalidation.abstractapi.com/v1/?api_key=demo&phone=${fullNumber}`
      );

      if (response.ok) {
        const result = await response.json();
        return {
          isValid: result.valid || false,
          error: result.valid ? undefined : "Invalid phone number format"
        };
      }

      throw new Error('API not available');
    } catch (error) {
      console.log('Free API failed, using local validation:', error);
      return validatePhoneNumber(phoneNumber, countryCode);
    }
  };

  // Validation effect using debounced phone
  useEffect(() => {
    const validatePhone = async () => {
      if (debouncedPhone && debouncedPhone.length >= 7) {
        setPhoneVerificationLoading(true);
        setPhoneValidationError("");

        try {
          const validation = await validatePhoneWithFreeAPI(debouncedPhone, selectedCountry.code);
          setIsPhoneVerified(validation.isValid);
          setPhoneValidationError(validation.error || "");

          if (!validation.isValid) {
            setUserClickedVerified(false);
          }
        } catch (error) {
          console.error('Phone validation error:', error);
          const localValidation = validatePhoneNumber(debouncedPhone, selectedCountry.code);
          setIsPhoneVerified(localValidation.isValid);
          setPhoneValidationError(localValidation.error || "");

          if (!localValidation.isValid) {
            setUserClickedVerified(false);
          }
        } finally {
          setPhoneVerificationLoading(false);
        }

      } else if (debouncedPhone && debouncedPhone.length > 0) {
        setIsPhoneVerified(false);
        setUserClickedVerified(false);
        setPhoneValidationError("Phone number is too short");
      } else {
        setIsPhoneVerified(false);
        setUserClickedVerified(false);
        setPhoneValidationError("");
      }
    };

    validatePhone();
  }, [debouncedPhone, selectedCountry.code]);

  // Handle verified phone click
  const handleVerifiedClick = () => {
    if (isPhoneVerified) {
      setUserClickedVerified(true);

      if (userData) {
        const updatedData = {
          ...userData,
          phone: phone,
          country: selectedCountry,
          phoneVerified: true
        };
        localStorage.setItem("UserData", JSON.stringify(updatedData));
        setUserData(updatedData);
      }

      setSaveMessage("✅ Phone number verified! You can now save changes.");
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
        console.error('Error loading countries:', error);
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
        // First check and fix the data structure if needed
        const fixedUserData = checkAndFixUserData();
        
        if (fixedUserData) {
          console.log("📥 Loading fixed user data:", fixedUserData);
          setUserData(fixedUserData);
          
          // Set initial data from UserData - handle both direct and nested data
          const userEmail = fixedUserData.email || fixedUserData.userData?.email || "";
          const userUsername = fixedUserData.username || fixedUserData.userData?.name || fixedUserData.userData?.email?.split('@')[0] || "user";
          
          setEmail(userEmail);
          setUsername(userUsername);
          setPhone(fixedUserData.phone || "");
          setSelectedCountry(fixedUserData.country || { name: "Nigeria", code: "NG", dial_code: "+234" });
          
          // Set date of birth if available
          if (fixedUserData.dayOfBirth || fixedUserData.userData?.DOB) {
            const birthDate = new Date(fixedUserData.dayOfBirth || fixedUserData.userData.DOB || "");
            setDay(birthDate.getDate().toString().padStart(2, "0"));
            setMonth((birthDate.getMonth() + 1).toString().padStart(2, "0"));
            setYear(birthDate.getFullYear().toString());
          }
          
          setDarkModeEnabled(fixedUserData.darkMode || false);
          setSelectedLang(fixedUserData.language || "English");
          setUserClickedVerified(fixedUserData.phoneVerified || false);

          // Save original data for discard functionality
          setOriginalData({
            phone: fixedUserData.phone || "",
            country: fixedUserData.country || { name: "Nigeria", code: "NG", dial_code: "+234" },
            day: fixedUserData.dayOfBirth ? new Date(fixedUserData.dayOfBirth).getDate().toString().padStart(2, "0") : "",
            month: fixedUserData.dayOfBirth ? (new Date(fixedUserData.dayOfBirth).getMonth() + 1).toString().padStart(2, "0") : "",
            year: fixedUserData.dayOfBirth ? new Date(fixedUserData.dayOfBirth).getFullYear().toString() : "",
            darkMode: fixedUserData.darkMode || false,
            language: fixedUserData.language || "English",
            currency: fixedUserData.currency || "USD",
            phoneVerified: fixedUserData.phoneVerified || false
          });
        } else {
          console.log("❌ No valid UserData found in localStorage");
        }
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

    if (numericValue.length < 7) {
      setIsPhoneVerified(false);
      setUserClickedVerified(false);
      setPhoneValidationError("Phone number is too short");
    } else {
      setPhoneValidationError("");
      setUserClickedVerified(false);
    }
  };

  // Handle country selection
  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    setOpenCountry(false);
    setCountrySearch("");
    setUserClickedVerified(false);

    if (phone.length >= 7) {
      const validation = validatePhoneNumber(phone, country.code);
      setIsPhoneVerified(validation.isValid);
      setPhoneValidationError(validation.error || "");
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

  
// CORRECTED Save Changes function - Only send phone and country to API
// CORRECTED Save Changes function - Update Date of Birth in userData
const handleSaveChanges = async () => {
  // Prevent save if phone is not verified by user click
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

    // Prepare update data - ONLY what the API accepts
    const composedPhone = `${selectedCountry.dial_code}${phone}`;
    
    // Format date of birth for localStorage only (not sent to API)
    let formattedDateOfBirth = null;
    if (day && month && year) {
      const formattedDay = day.padStart(2, '0');
      const formattedMonth = month.padStart(2, '0');
      formattedDateOfBirth = `${year}-${formattedMonth}-${formattedDay}`;
      
      // Validate the date
      const dateObj = new Date(formattedDateOfBirth);
      if (isNaN(dateObj.getTime())) {
        setSaveMessage("❌ Invalid date of birth");
        setIsSaving(false);
        return;
      }
    }

    // Only send the fields that the API accepts (Format 3 that worked)
    const updateData = {
      phone: composedPhone,
      country: selectedCountry.code
    };

    console.log("🔄 Sending update request to API:", updateData);

    const res = await fetch("https://evolve2p-backend.onrender.com/api/update-user", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
      },
      body: JSON.stringify(updateData),
    });

    console.log("📥 Response Status:", res.status, res.statusText);

    let responseData;
    let responseText = "";
    
    try {
      responseText = await res.text();
      console.log("📥 Raw Response:", responseText);
      
      if (responseText && responseText.trim() !== "") {
        responseData = JSON.parse(responseText);
      } else {
        responseData = {};
      }
    } catch (parseError) {
      console.error("❌ Response parse error:", parseError);
      responseData = { rawResponse: responseText };
    }

    if (!res.ok) {
      console.error("❌ API Error:", {
        status: res.status,
        statusText: res.statusText,
        response: responseData
      });
      
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
    console.log("✅ Profile updated successfully via API!", responseData);
    setSaveMessage("✅ Profile updated successfully!");
    
    // Update localStorage with ALL data (including Date of Birth in userData)
    const updatedUserData = { 
      ...userData, 
      phone: phone,
      country: selectedCountry,
      phoneVerified: true,
      // Save Date of Birth locally even though it's not in the API
      ...(formattedDateOfBirth && { dayOfBirth: formattedDateOfBirth }),
      // Update the nested userData object with Date of Birth
      userData: userData.userData ? {
        ...userData.userData,
        DOB: formattedDateOfBirth || userData.userData.DOB
      } : userData.userData
    };
    
    localStorage.setItem("UserData", JSON.stringify(updatedUserData));
    setUserData(updatedUserData);

    // Update original data to current state
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

    // Clear message after 3 seconds
    setTimeout(() => setSaveMessage(""), 3000);

  } catch (error) {
    console.error("💥 Network error:", error);
    setSaveMessage("❌ Network error: Failed to connect to server");
  } finally {
    setIsSaving(false);
  }
};
  // Discard Changes function
  // Discard Changes function - Fixed to handle nested userData
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

    if (originalData.currency) {
      const currency = currencyOptions.find(c => c.code === originalData.currency);
      if (currency) {
        setSelectedCurrency(currency);
      }
    }

    setIsPhoneVerified(false);
    setPhoneValidationError("");

    setSaveMessage("✅ Changes discarded");
    setTimeout(() => setSaveMessage(""), 3000);
  } else if (userData) {
    // Fallback: restore from current userData
    setPhone(userData.phone || "");
    setSelectedCountry(userData.country || { name: "Nigeria", code: "NG", dial_code: "+234" });
    
    // Restore Date of Birth from nested userData
    if (userData.userData?.DOB) {
      const birthDate = new Date(userData.userData.DOB);
      setDay(birthDate.getDate().toString().padStart(2, "0"));
      setMonth((birthDate.getMonth() + 1).toString().padStart(2, "0"));
      setYear(birthDate.getFullYear().toString());
    } else if (userData.dayOfBirth) {
      const birthDate = new Date(userData.dayOfBirth);
      setDay(birthDate.getDate().toString().padStart(2, "0"));
      setMonth((birthDate.getMonth() + 1).toString().padStart(2, "0"));
      setYear(birthDate.getFullYear().toString());
    } else {
      setDay("");
      setMonth("");
      setYear("");
    }
    
    setDarkModeEnabled(userData.darkMode || false);
    setSelectedLang(userData.language || "English");
    setUserClickedVerified(userData.phoneVerified || false);

    setIsPhoneVerified(false);
    setPhoneValidationError("");

    setSaveMessage("✅ Changes discarded");
    setTimeout(() => setSaveMessage(""), 3000);
  }
};

  // Helper function to get display email
  const getDisplayEmail = () => {
    return userData?.email || userData?.userData?.email || "No email found";
  };

  // Helper function to get display username
  const getDisplayUsername = () => {
    return userData?.username || userData?.userData?.name || userData?.userData?.email?.split('@')[0] || "No username found";
  };

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

            {/* Enhanced Debug Info */}
        {/*}   {process.env.NODE_ENV === 'development' && (
              <div className="mb-4 p-3 bg-blue-900/30 rounded-lg">
                <p className="text-xs text-blue-400">Debug Info:</p>
                <p className="text-xs text-blue-300">User Data: {userData ? "Loaded" : "Not loaded"}</p>
                <p className="text-xs text-blue-300">Email: {getDisplayEmail()}</p>
                <p className="text-xs text-blue-300">Username: {getDisplayUsername()}</p>
                <p className="text-xs text-blue-300">Access Token: {userData?.accessToken ? "Present" : "Missing"}</p>
                <p className="text-xs text-blue-300">Nested UserData: {userData?.userData ? "Present" : "Not present"}</p>
                {userData?.userData && (
                  <>
                    <p className="text-xs text-blue-300">Nested Email: {userData.userData.email || "Not found"}</p>
                    <p className="text-xs text-blue-300">Nested Name: {userData.userData.name || "Not found"}</p>
                  </>
                )}
                <button 
                  onClick={() => {
                    const stored = localStorage.getItem("UserData");
                    console.log("LocalStorage UserData:", stored);
                    const parsed = JSON.parse(stored || "{}");
                    console.log("Parsed structure:", parsed);
                    console.log("Nested userData:", parsed.userData);
                    alert("Check browser console for UserData details");
                  }}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded"
                >
                  Check LocalStorage
                </button>
              </div>
            )}
*/}
            {/* Phone Verification Notice */}
            {!userClickedVerified && phone && phone.length >= 7 && (
              <div className="mb-6 p-4 bg-[#2D2D2D] rounded-lg border border-[#4DF2BE]/30">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#4DF2BE] rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="#0F1012" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-[#4DF2BE]">
                      Phone verification required
                    </p>
                    <p className="text-xs text-[#8F8F8F] mt-1">
                      Click "Click to Verify" to confirm your phone number before saving changes
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8F8F8F] text-base">
                    @
                  </span>
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
                      {phone && phone.length >= 7 && (
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
                        placeholder="Phone number"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2">
                        {phone && phone.length >= 7 && isPhoneVerified && userClickedVerified ? (
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

                  {/* Phone validation error message */}
                  {phoneValidationError && (
                    <div className="mt-2 text-xs text-[#FE857D] font-medium">
                      {phoneValidationError}
                    </div>
                  )}

                  {/* Phone validation success message */}
                  {isPhoneVerified && !userClickedVerified && (
                    <div className="mt-2 text-xs text-[#4DF2BE] font-medium">
                      Phone number is valid. Click "Click to Verify" to confirm.
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