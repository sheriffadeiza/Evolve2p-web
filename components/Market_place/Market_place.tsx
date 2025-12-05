"use client";

import React, { useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Arrow_d from "../../public/Assets/Evolve2p_arrowd/arrow-down-01.png";
import Globe from "../../public/Assets/Evolve2p_globe/Makretplace/elements.svg";
import Funnel from "../../public/Assets/Evolve2p_funnel/elements.svg";
import Vector from "../../public/Assets/Evolve2p_vector/vector.svg";
import Repeat from "../../public/Assets/Evolve2p_Repeat/repeat.svg";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import Divider from "../../public/Assets/Evolve2p_divider/Divider.svg";
import Thumbs from "../../public/Assets/Evolve2p_thumbs/elements.svg";
import Timer from "../../public/Assets/Evolve2p_timer/elements.svg";
import Dminus from "../../public/Assets/Evolve2p_Dminus/Divider.svg";
import Dyellow from "../../public/Assets/Evolve2p_Dyellow/Divider.svg";
import Dpurple from "../../public/Assets/Evolve2p_Dpurple/Divider.svg";
import Dpink from "../../public/Assets/Evolve2p_Dpink/Divider.svg";
import Dgreen from "../../public/Assets/Evolve2p_Dgreen/Divider.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import AD from "../../public/Assets/Evolve2p_Ad/P2P Marketplace/element.svg";
import Footer from "../../components/Footer/Footer";
import { countryCurrencyService, CurrencyOption } from "../../utils/countryCurrencyService";

interface Offer {
  id?: string;
  crypto: string;
  type: string;
  margin: number;
  minLimit: number;
  maxLimit: number;
  paymentMethod: any;
  createdAt: string;
  time?: string;
  user?: {
    username?: string;
  };
  currency?: string; // Fiat currency from offer creation
  fiatCurrency?: string; // Alternative field name
  basePrice?: number; // Market price from backend
  finalPrice?: number; // Price with margin from backend
}

interface Crypto {
  name: string;
  icon: any;
}

interface AdTypes {
  tradeableOnly: boolean;
  verifiedOnly: boolean;
  noVerification: boolean;
}

interface UserData {
  accessToken?: string;
  token?: string;
  username?: string;
  email?: string;
  user?: {
    username?: string;
  };
  userData?: {
    username?: string;
  };
}

const Market_place: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("Buy");
  const tabs = ["Buy", "Sell"];
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState<boolean>(false);
  const [selectedCrypto, setSelectedCrypto] = useState<Crypto>({ name: "BTC", icon: BTC });
  const [isAmountOpen, setIsAmountOpen] = useState<boolean>(false);
  const [minAmount, setMinAmount] = useState<number | string>("");
  const [maxAmount, setMaxAmount] = useState<number | string>("");
  const [isPaymentOpen, setIsPaymentOpen] = useState<boolean>(false);
  const [selectedMethod, setSelectedMethod] = useState<string>("Payment Method");
  const [loadingMethods, setLoadingMethods] = useState<boolean>(false);
  const [errorMethods, setErrorMethods] = useState<string>("");
  const [selected2Method, setSelected2Method] = useState<string>("Payment Method");
  const [isFunnelOpen, setIsFunnelOpen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<string | number>("Bank Transfer");
  const [payment2Method, setPayment2Method] = useState<string>("Bank Transfer");
  const [isPayment2Open, setIsPayment2Open] = useState<boolean>(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState<boolean>(false);
  const [selectedFiatCurrencyCode, setSelectedFiatCurrencyCode] = useState<string>("USD");
  const [isRegionOpen, setIsRegionOpen] = useState<boolean>(false);
  const [region, setRegion] = useState<string>("All Regions");

  const router = useRouter();
  const [adTypes, setAdTypes] = useState<AdTypes>({
    tradeableOnly: true,
    verifiedOnly: true,
    noVerification: false,
  });
  const [sortBy, setSortBy] = useState<string>("Best Rate");

  // Offer creation & display
  const [offers, setOffers] = useState<Offer[]>([]);
  const [allOffers, setAllOffers] = useState<Offer[]>([]); // Store all fetched offers
  const [loadingOffers, setLoadingOffers] = useState<boolean>(false);
  const [errorOffers, setErrorOffers] = useState<string>("");

  const [clientUser, setClientUser] = useState<UserData | null>(null);

  // New currency service state
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [selectedFiatCurrencyData, setSelectedFiatCurrencyData] = useState<CurrencyOption | null>(null);
  const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);
  const [currencySearch, setCurrencySearch] = useState<string>("");

  // State for market prices in header
  const [marketPrices, setMarketPrices] = useState<{
    BTC: number | null;
    ETH: number | null;
    USDT: number | null;
    USDC: number | null;
  }>({
    BTC: null,
    ETH: null,
    USDT: null,
    USDC: null,
  });

  // Payment methods state - fetched from API
  const [methods, setMethods] = useState<{ id: string | number; name: string }[]>([]);

  // Debug state
  const [debugInfo, setDebugInfo] = useState<string>("");

  // Helper function to safely render payment method
  const renderPaymentMethod = (paymentMethod: any): string => {
    if (!paymentMethod) return "N/A";
    
    if (typeof paymentMethod === 'string') {
      // Check if it's a method from our fetched list
      const methodObj = methods.find(m => m.id === paymentMethod || m.name === paymentMethod);
      return methodObj?.name || paymentMethod;
    }
    
    if (typeof paymentMethod === 'object') {
      // Check if it matches our fetched methods structure
      const methodId = paymentMethod.id || paymentMethod._id;
      const methodName = paymentMethod.name || paymentMethod.methodName;
      
      if (methodId) {
        const methodObj = methods.find(m => m.id === methodId);
        return methodObj?.name || methodName || "Unknown";
      }
      
      return methodName || "N/A";
    }
    
    return "N/A";
  };

  // Helper function to get display type (reversed logic for buttons)
  const getDisplayType = (offerType: string): string => {
    return offerType?.toUpperCase() === 'BUY' ? 'Sell' : 'Buy';
  };

  // Helper function to get offer's fiat currency
  const getOfferFiatCurrency = (offer: Offer): string => {
    // Try both field names
    return offer.fiatCurrency || offer.currency || selectedFiatCurrencyCode;
  };

  // Helper function to format currency
  const formatCurrency = (amount: number | undefined | null, currencyCode: string = selectedFiatCurrencyCode): string => {
    if (amount === undefined || amount === null) {
      return 'Loading...';
    }
    
    // Handle zero
    if (amount === 0) {
      const symbol = selectedFiatCurrencyData?.symbol || '$';
      return `${symbol}0.00`;
    }
    
    // Get currency symbol
    const currencyData = selectedFiatCurrencyData || currencyOptions.find(c => c.code === currencyCode);
    const symbol = currencyData?.symbol || '$';
    
    // For crypto prices (often < 1)
    if (amount < 0.01 && amount > 0) {
      return `${symbol}${amount.toFixed(8)}`;
    } else if (amount < 1) {
      return `${symbol}${amount.toFixed(4)}`;
    } else {
      return `${symbol}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  };

  const toggleMarketDropdown = () => {
    setIsMarketDropdownOpen((prev) => !prev);
  };

  const toggleFunnel = () => setIsFunnelOpen((prev) => !prev);

  const handleApply = () => {
    console.log("Min:", minAmount, "Max:", maxAmount);
    setIsAmountOpen(false);
  };

  const cryptoOptions: Crypto[] = [
    { name: "BTC", icon: BTC },
    { name: "ETH", icon: ETH },
    { name: "USDT", icon: USDT },
    { name: "USDC", icon: USDC },
  ];

  const methods2 = [
    "Bank Transfer",
    "PayPal",
    "Credit Card",
    "Cryptocurrency Wallet",
    "Mobile Payment App",
  ];

  const regions = [
    "All Regions",
    "United States",
    "Nigeria",
    "Brazil",
    "Ethiopia",
    "Germany",
  ];

  const sortOptions = [
    "Best Rate",
    "Highest Volume",
    "Completion Rate",
    "Rating",
  ];

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
        className={`w-[40px] h-[20px] rounded-full p-[2px] flex items-center cursor-pointer transition-colors duration-300
          ${enabled ? "bg-[#4DF2BE]" : "bg-[#8F8F8F]"}`}
      >
        <div
          className={`w-[15px] h-[15px] rounded-full transition-transform duration-300
    ${enabled ? "translate-x-[25px] bg-[#000]" : "translate-x-0 bg-[#fff]"}
  `}
        />
      </div>
    );
  };

  // Function to fetch payment methods from API
  const fetchPaymentMethods = async () => {
    setLoadingMethods(true);
    setErrorMethods("");
    
    try {
      const userDataRaw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
      if (!userDataRaw) throw new Error("No userData in localStorage");

      let userData: UserData;
      try {
        userData = JSON.parse(userDataRaw);
      } catch (e) {
        throw new Error("Invalid userData in localStorage");
      }

      const token = userData?.accessToken || userData?.token;
      if (!token) throw new Error("No access token found");

      console.log("🚀 Fetching payment methods from backend...");
      const response = await fetch(
        "https://evolve2p-backend.onrender.com/api/get-payment-methods",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data?.message || `Server error ${response.status}`);
      }

      // Handle different possible response structures
      let paymentMethods: any[] = [];
      
      if (Array.isArray(data)) {
        paymentMethods = data;
      } else if (Array.isArray(data.data)) {
        paymentMethods = data.data;
      } else if (Array.isArray(data.paymentMethods)) {
        paymentMethods = data.paymentMethods;
      } else if (data.data && Array.isArray(data.data.paymentMethods)) {
        paymentMethods = data.data.paymentMethods;
      }

      console.log(`✅ Fetched ${paymentMethods.length} payment methods`);
      
      // Transform the API response to match your expected format
      const transformedMethods = paymentMethods.map((method: any) => ({
        id: method.id || method._id || method.name,
        name: method.name || method.methodName || "Unknown Method"
      }));

      setMethods(transformedMethods);
      
      // If no methods were fetched, keep some defaults as fallback
      if (transformedMethods.length === 0) {
        console.warn("No payment methods found in API, using fallback");
        setMethods([
          { id: "bank", name: "Bank Transfer" },
          { id: "paypal", name: "PayPal" },
          { id: "card", name: "Credit Card" },
        ]);
      }
      
    } catch (err: any) {
      console.error("❌ Error fetching payment methods:", err);
      setErrorMethods(err.message || "Error fetching payment methods");
      
      // Fallback to default methods on error
      setMethods([
        { id: "bank", name: "Bank Transfer" },
        { id: "paypal", name: "PayPal" },
        { id: "card", name: "Credit Card" },
      ]);
    } finally {
      setLoadingMethods(false);
    }
  };

  // Load currencies from country currency service
  useEffect(() => {
    const loadCurrencies = async () => {
      setLoadingCurrencies(true);
      try {
        await countryCurrencyService.initialize();
        const currencies = countryCurrencyService.getAllCurrencies();
        setCurrencyOptions(currencies);
        
        // Set default currency from localStorage or default to USD
        const savedCurrency = localStorage.getItem('selectedCurrency');
        const currencyCode = savedCurrency || 'USD';
        
        const defaultCurrency = countryCurrencyService.getCurrencyByCode(currencyCode) || 
                               currencies.find(c => c.code === 'USD') || 
                               currencies[0];
        
        setSelectedFiatCurrencyData(defaultCurrency);
        setSelectedFiatCurrencyCode(defaultCurrency.code);
        
      } catch (error) {
        console.error('Error loading currencies:', error);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    loadCurrencies();
  }, []);

  // Fetch payment methods on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchPaymentMethods();
    }
  }, []);

  // Handle fiat currency selection
  const handleFiatCurrencySelect = (currencyOption: CurrencyOption) => {
    setSelectedFiatCurrencyData(currencyOption);
    setSelectedFiatCurrencyCode(currencyOption.code);
    setIsCurrencyOpen(false);
    setCurrencySearch("");
    
    // Save to localStorage
    localStorage.setItem('selectedCurrency', currencyOption.code);
    localStorage.setItem('selectedCurrencyData', JSON.stringify(currencyOption));
    
    // Re-apply filters after currency change
    if (allOffers.length > 0) {
      applyFilters(allOffers);
    }
  };

  // Filter currencies based on search
  const filteredCurrencies = currencySearch
    ? countryCurrencyService.searchCurrencies(currencySearch)
    : currencyOptions;

  const handleReset = () => {
    setMinAmount("");
    setMaxAmount("");
    setSelectedMethod("Payment Method");
    setSelectedFiatCurrencyCode("USD");
    setSelectedCrypto({ name: "BTC", icon: BTC });
    // Reset to USD currency
    const usdCurrency = currencyOptions.find(c => c.code === 'USD') || currencyOptions[0];
    if (usdCurrency) {
      handleFiatCurrencySelect(usdCurrency);
    }
    setRegion("All Regions");
    
    // Reset to show all offers
    if (allOffers.length > 0) {
      applyFilters(allOffers);
    }
  };

  // Main function to apply all filters
  const applyFilters = (offersList: Offer[]) => {
    console.log("🔍 Applying filters...");
    console.log("Selected Crypto:", selectedCrypto.name);
    console.log("Selected Fiat Currency:", selectedFiatCurrencyCode);
    console.log("Selected Payment Method:", selectedMethod);
    console.log("Active Tab:", activeTab);
    console.log("Amount Range:", minAmount, "-", maxAmount);
    
    const filtered = offersList.filter((offer: Offer) => {
      const offerFiatCurrency = getOfferFiatCurrency(offer);
      
      console.log(`🔍 Checking offer: ${offer.crypto}/${offerFiatCurrency} - ${offer.type}`);
      
      // Filter 1: Cryptocurrency type
      if (selectedCrypto.name !== "BTC" && offer.crypto !== selectedCrypto.name) {
        console.log(`❌ Filtered: Wrong crypto - ${offer.crypto} != ${selectedCrypto.name}`);
        return false;
      }
      
      // Filter 2: Fiat currency - MUST MATCH THE OFFER'S ORIGINAL CURRENCY
      if (selectedFiatCurrencyData && offerFiatCurrency !== selectedFiatCurrencyCode) {
        console.log(`❌ Filtered: Wrong fiat currency - ${offerFiatCurrency} != ${selectedFiatCurrencyCode}`);
        return false;
      }
      
      // Filter 3: Payment method
      if (selectedMethod && selectedMethod !== "Payment Method") {
        const offerPaymentMethod = typeof offer.paymentMethod === 'object'
          ? offer.paymentMethod.name
          : offer.paymentMethod;
        if (offerPaymentMethod !== selectedMethod) {
          console.log(`❌ Filtered: Wrong payment method - ${offerPaymentMethod} != ${selectedMethod}`);
          return false;
        }
      }
      
      // Filter 4: Buy/Sell type (opposite logic)
      const offerType = offer.type?.toUpperCase();
      if (activeTab === "Buy") {
        if (offerType !== "SELL") {
          console.log(`❌ Filtered: Wrong type for Buy tab - ${offerType} != SELL`);
          return false;
        }
      } else if (activeTab === "Sell") {
        if (offerType !== "BUY") {
          console.log(`❌ Filtered: Wrong type for Sell tab - ${offerType} != BUY`);
          return false;
        }
      }
      
      // Filter 5: Amount range (if set)
      if (minAmount && typeof minAmount === 'number' && offer.minLimit < minAmount) {
        console.log(`❌ Filtered: Min amount too low - ${offer.minLimit} < ${minAmount}`);
        return false;
      }
      if (maxAmount && typeof maxAmount === 'number' && offer.maxLimit > maxAmount) {
        console.log(`❌ Filtered: Max amount too high - ${offer.maxLimit} > ${maxAmount}`);
        return false;
      }
      
      console.log(`✅ Passed all filters: ${offer.crypto}/${offerFiatCurrency} - ${offer.type}`);
      return true;
    });
    
    console.log(`🎯 Filtered to ${filtered.length} offers out of ${offersList.length}`);
    setOffers(filtered);
  };

  const handleFetchOffers = async () => {
    setLoadingOffers(true);
    setErrorOffers("");
    setDebugInfo("Fetching offers...");

    try {
      const userDataRaw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;

      if (!userDataRaw) throw new Error("No userData in localStorage");

      let userData: UserData;
      try {
        userData = JSON.parse(userDataRaw);
      } catch (e) {
        throw new Error("Invalid userData in localStorage");
      }

      const token = userData?.accessToken || userData?.token;
      if (!token) throw new Error("No access token found");

      console.log("🚀 Fetching offers from backend...");
      const response = await fetch(
        "https://evolve2p-backend.onrender.com/api/get-offers",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();
      console.log("📦 Raw response from backend:", text);
      
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error("❌ Failed to parse JSON:", e);
        data = {};
      }

      console.log("📊 Parsed data structure:", data);
      
      if (!response.ok) {
        throw new Error(data?.message || `Server error ${response.status}`);
      }

      // Try to extract offers from different possible structures
      let offerList: Offer[] = [];
      let debugMessage = "";
      
      // Check various response structures
      if (Array.isArray(data)) {
        offerList = data;
        debugMessage = "Found offers as direct array";
      } else if (Array.isArray(data.data)) {
        offerList = data.data;
        debugMessage = "Found offers in data.data array";
      } else if (Array.isArray(data.offers)) {
        offerList = data.offers;
        debugMessage = "Found offers in data.offers array";
      } else if (data.data && Array.isArray(data.data.offers)) {
        offerList = data.data.offers;
        debugMessage = "Found offers in data.data.offers array";
      } else if (typeof data === 'object') {
        // Try to find any array in the object
        for (const key in data) {
          if (Array.isArray(data[key])) {
            offerList = data[key];
            debugMessage = `Found offers in data.${key} array`;
            break;
          }
        }
        
        // If still not found, check nested
        if (offerList.length === 0 && data.data && typeof data.data === 'object') {
          for (const key in data.data) {
            if (Array.isArray(data.data[key])) {
              offerList = data.data[key];
              debugMessage = `Found offers in data.data.${key} array`;
              break;
            }
          }
        }
      }

      console.log(`🎯 ${debugMessage}, Total: ${offerList.length}`);
      setDebugInfo(`${debugMessage}. Found ${offerList.length} offers.`);

      // Debug currency information from offers
      if (offerList.length > 0) {
        const currencies = new Set();
        offerList.forEach((offer, index) => {
          const fiatCurrency = getOfferFiatCurrency(offer);
          currencies.add(fiatCurrency);
          if (index < 3) {
            console.log(`🔍 Offer ${index}: ${offer.crypto}/${fiatCurrency} - ${offer.type} - ${renderPaymentMethod(offer.paymentMethod)}`);
          }
        });
        console.log("📊 Unique currencies in offers:", Array.from(currencies));
        setDebugInfo(prev => prev + ` Currencies found: ${Array.from(currencies).join(', ')}`);
      }

      // Store all offers
      setAllOffers(offerList);
      
      // Apply current filters
      applyFilters(offerList);

    } catch (err: any) {
      console.error("❌ Error fetching offers:", err);
      setErrorOffers(err.message || "Error fetching offers");
      setDebugInfo(`Error: ${err.message}`);
    } finally {
      setLoadingOffers(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("UserData");
    if (!raw) return;
    try {
      const parsed: UserData = JSON.parse(raw);
      setClientUser(parsed.userData ?? parsed);
    } catch (e) {
      console.error("Failed parsing UserData from localStorage", e);
    }
  }, []);

  // Re-apply filters when any filter changes
  useEffect(() => {
    if (allOffers.length > 0) {
      console.log("🔄 Re-applying filters due to filter change");
      applyFilters(allOffers);
    }
  }, [selectedCrypto, selectedFiatCurrencyData, selectedMethod, activeTab, minAmount, maxAmount]);

  // Calculate offer price
  const calculateOfferPrice = (offer: Offer): string => {
    const offerFiatCurrency = getOfferFiatCurrency(offer);
    
    // Use finalPrice from backend if available and valid
    if (offer.finalPrice !== undefined && offer.finalPrice !== null && offer.finalPrice > 0) {
      return formatCurrency(offer.finalPrice, offerFiatCurrency);
    }
    
    // If finalPrice is 0 or missing, calculate from basePrice and margin
    if (offer.basePrice !== undefined && offer.basePrice !== null && offer.basePrice > 0 && offer.margin !== undefined) {
      const isBuyOffer = offer.type?.toUpperCase() === 'BUY';
      let calculatedPrice;
      
      if (isBuyOffer) {
        // BUY offer: buyer pays less than market
        calculatedPrice = offer.basePrice * (1 - (offer.margin / 100));
      } else {
        // SELL offer: seller gets more than market
        calculatedPrice = offer.basePrice * (1 + (offer.margin / 100));
      }
      
      return formatCurrency(calculatedPrice, offerFiatCurrency);
    }
    
    // If basePrice is also 0 or missing
    return 'Price not available';
  };

  // Get current market price for display
  const getCurrentMarketPrice = (offer: Offer): string => {
    const offerFiatCurrency = getOfferFiatCurrency(offer);
    
    if (offer.basePrice !== undefined && offer.basePrice !== null) {
      return formatCurrency(offer.basePrice, offerFiatCurrency);
    }
    
    return 'Market price not available';
  };

  // Format limits with currency
  const formatLimits = (offer: Offer): string => {
    const offerFiatCurrency = getOfferFiatCurrency(offer);
    const min = formatCurrency(offer.minLimit, offerFiatCurrency);
    const max = formatCurrency(offer.maxLimit, offerFiatCurrency);
    return `${min} – ${max}`;
  };

  // Get trading pair display
  const getTradingPair = (offer: Offer): string => {
    const offerFiatCurrency = getOfferFiatCurrency(offer);
    return `${offer.crypto}/${offerFiatCurrency}`;
  };

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Nav />

        {/* Current Filters Display */}
        {offers.length > 0 && (
          <div className="mb-4 p-3 bg-[#222222] rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#8F8F8F]">Current Filters:</span>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-[#3A3A3A] px-3 py-1 rounded-full">
                  {selectedCrypto.name}
                </span>
                <span className="text-xs bg-[#3A3A3A] px-3 py-1 rounded-full">
                  {selectedFiatCurrencyCode}
                </span>
                {selectedMethod !== "Payment Method" && (
                  <span className="text-xs bg-[#3A3A3A] px-3 py-1 rounded-full">
                    {selectedMethod}
                  </span>
                )}
                <span className="text-xs bg-[#4DF2BE] text-[#0F1012] px-3 py-1 rounded-full">
                  {activeTab}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Left Sidebar - FILTERS */}
          <div className="bg-[#222222] p-4 lg:p-6 rounded-lg lg:w-96 lg:max-w-md w-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#FCFCFC]">
                Find an Offer
              </h2>
              <div className="flex items-center gap-2 bg-[#2D2D2D] p-3 rounded-full border border-[#2D2D2D] w-fit">
                <Image src={AD} alt="ad" className="w-5 h-5" />
                <p className="text-[#FFFA66] cursor-pointer text-sm font-bold"
                  onClick={() => { router.push("/market_place/post_ad") }}
                >Post an Ad</p>
              </div>
            </div>
            <p className="text-[#DBDBDB] mt-4 text-sm w-full">
              Filter offers by cryptocurrency, fiat currency, and payment method.
            </p>

            <div className="space-y-4 mt-6">
              <label className="block text-sm font-medium text-[#8F8F8F]">
                I want to
              </label>
              <div
                className="w-full h-12 bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
                onClick={() => setActiveTab(activeTab === "Buy" ? "Sell" : "Buy")}
              >
                <span className="text-[#FCFCFC] text-sm font-medium">
                  {activeTab}
                </span>
                <Image
                  src={Arrow_d}
                  alt="arrow"
                  className={`text-[#DBDBDB] transition-transform duration-200 ${activeTab === "Sell" ? "rotate-180" : ""
                    }`}
                />
              </div>
              
              {/* Cryptocurrency Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#8F8F8F] mb-2">
                  Cryptocurrency
                </label>
                <div
                  className="w-full h-12 bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
                  onClick={() => setIsMarketDropdownOpen(!isMarketDropdownOpen)}
                >
                  <span className="flex items-center text-[#FCFCFC] text-sm font-medium">
                    <Image
                      src={selectedCrypto.icon}
                      alt={selectedCrypto.name}
                      className="w-5 h-5"
                    />
                    <p className="ml-2">{selectedCrypto.name}</p>
                  </span>
                  <Image
                    src={Arrow_d}
                    alt="arrow"
                    className={`text-[#DBDBDB] transition-transform duration-200 ${isMarketDropdownOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>

                {/* Dropdown */}
                {isMarketDropdownOpen && (
                  <div
                    className="absolute w-full bg-[#222222] rounded-xl mt-2 shadow-lg p-2 z-50 border border-[#2D2D2D]"
                  >
                    {cryptoOptions.map((crypto, index) => (
                      <div
                        key={index}
                        className="flex items-center py-2 px-2 cursor-pointer hover:text-emerald-400 rounded-lg hover:bg-[#2D2D2D]"
                        onClick={() => {
                          setSelectedCrypto(crypto);
                          setIsMarketDropdownOpen(false);
                        }}
                      >
                        <Image
                          src={crypto.icon}
                          alt={crypto.name}
                          className="w-5 h-5"
                        />
                        <p className="ml-3 text-white text-sm font-medium">
                          {crypto.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-[#8F8F8F] my-6"></div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#8F8F8F]">
                Fiat Currency & Payment
              </label>

              {/* Fiat Currency Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#8F8F8F] mb-2">
                  Fiat Currency
                </label>
                <div
                  className="w-full h-12 bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
                  onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                >
                  <div className="flex items-center space-x-3">
                    {selectedFiatCurrencyData && (
                      <img
                        src={selectedFiatCurrencyData.flag}
                        alt={`${selectedFiatCurrencyData.country} flag`}
                        className="w-6 h-4 rounded object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://flagcdn.com/w320/us.png';
                        }}
                      />
                    )}
                    <div>
                      <span className="text-[#FCFCFC] text-sm font-medium block">
                        {selectedFiatCurrencyData?.code || 'USD'}
                      </span>
                      <span className="text-[#8F8F8F] text-xs block">
                        {selectedFiatCurrencyData?.name || 'Select Currency'}
                      </span>
                    </div>
                  </div>
                  <Image
                    src={Arrow_d}
                    alt="arrow"
                    className={`text-[#DBDBDB] transition-transform duration-200 ${isCurrencyOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>

                {/* Fiat Currency Dropdown */}
                {isCurrencyOpen && (
                  <div
                    className="absolute w-full bg-[#222222] rounded-xl mt-2 shadow-lg p-2 z-50 max-h-80 overflow-y-auto border border-[#2D2D2D]"
                  >
                    {/* Search input */}
                    <div className="sticky top-0 bg-[#222222] pb-2">
                      <input
                        type="text"
                        placeholder="Search fiat currencies..."
                        value={currencySearch}
                        onChange={(e) => setCurrencySearch(e.target.value)}
                        className="w-full bg-[#2D2D2D] text-white px-3 py-2 rounded-lg border border-[#3A3A3A] focus:outline-none focus:border-[#4DF2BE] text-sm"
                      />
                    </div>

                    {loadingCurrencies ? (
                      <div className="text-white text-sm font-medium py-4 text-center">
                        Loading fiat currencies...
                      </div>
                    ) : filteredCurrencies.length > 0 ? (
                      <div className="space-y-1 mt-2">
                        {filteredCurrencies.map((currencyOption) => (
                          <div
                            key={currencyOption.code}
                            className={`flex items-center py-2 px-3 cursor-pointer rounded-lg hover:bg-[#2D2D2D] ${
                              selectedFiatCurrencyData?.code === currencyOption.code ? 'bg-[#2D2D2D] border border-[#4DF2BE]' : ''
                            }`}
                            onClick={() => handleFiatCurrencySelect(currencyOption)}
                          >
                            <img
                              src={currencyOption.flag}
                              alt={`${currencyOption.country} flag`}
                              className="w-6 h-4 rounded mr-3 object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://flagcdn.com/w320/us.png';
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">
                                {currencyOption.code}
                              </p>
                              <p className="text-[#8F8F8F] text-xs truncate">
                                {currencyOption.name}
                              </p>
                            </div>
                            <span className="text-[#4DF2BE] text-sm font-medium">
                              {currencyOption.symbol}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[#8F8F8F] text-sm font-medium py-4 text-center">
                        No fiat currencies found
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#8F8F8F] mb-2">
                  Payment Method
                </label>
                <div
                  className="w-full h-12 bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
                  onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                >
                  <span className="text-[#FCFCFC] text-sm font-medium">
                    {selectedMethod}
                  </span>
                  <Image
                    src={Arrow_d}
                    alt="arrow"
                    className={`text-[#DBDBDB] transition-transform duration-200 ${isPaymentOpen ? "rotate-180" : ""
                      }`}
                  />
                </div>

                {isPaymentOpen && (
                  <div
                    className="absolute w-full bg-[#222222] rounded-xl mt-2 shadow-lg p-2 z-50 border border-[#2D2D2D] max-h-60 overflow-y-auto"
                  >
                    {loadingMethods ? (
                      <div className="text-white text-sm font-medium py-2 px-3 text-center">
                        Loading payment methods...
                      </div>
                    ) : errorMethods ? (
                      <div className="text-red-400 text-sm font-medium py-2 px-3">
                        Error loading methods
                      </div>
                    ) : (
                      <>
                        <div
                          className="text-white text-sm font-medium py-2 px-3 cursor-pointer hover:text-emerald-400 rounded-lg hover:bg-[#2D2D2D]"
                          onClick={() => {
                            setSelectedMethod("Payment Method");
                            setIsPaymentOpen(false);
                          }}
                        >
                          All Payment Methods
                        </div>
                        {methods.map((method) => (
                          <div
                            key={method.id}
                            className="text-white text-sm font-medium py-2 px-3 cursor-pointer hover:text-emerald-400 rounded-lg hover:bg-[#2D2D2D]"
                            onClick={() => {
                              setSelectedMethod(method.name);
                              setIsPaymentOpen(false);
                            }}
                          >
                            {method.name}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-8 w-full">
              <button
                className="bg-[#2D2D2D] flex items-center justify-center border-none w-full sm:w-auto px-6 h-12 text-white text-sm rounded-full font-bold hover:bg-[#3A3A3A] transition-colors"
                onClick={handleReset}
              >
                Reset Filters
              </button>
              <button
                className="bg-[#4DF2BE] text-[#0F1012] text-sm font-bold px-6 py-3 rounded-full w-full sm:flex-1 h-12 border border-[#4DF2BE] hover:bg-[#3DD2A5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleFetchOffers}
                disabled={loadingOffers}
              >
                {loadingOffers ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0F1012]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Offers...
                  </span>
                ) : (
                  "Find Offers"
                )}
              </button>
            </div>
          </div>

          {/* Main Content - OFFERS DISPLAY */}
          <div className="flex-1">
            {/* Filters Bar */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              {/* Buy/Sell Tabs */}
              <div className="flex bg-[#2D2D2D] rounded-[56px] items-center">
                {tabs.map((tab) => (
                  <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center justify-center text-sm w-16 h-8 rounded-[40px] cursor-pointer
                        ${activeTab === tab
                        ? "bg-[#4A4A4A] text-[#FCFCFC] font-medium"
                        : "bg-[#2D2D2D] text-[#DBDBDB] font-normal"
                      }`}
                  >
                    {tab}
                  </div>
                ))}
              </div>

              {/* Cryptocurrency Filter */}
              <div className="relative">
                <div
                  className="flex items-center w-28 h-10 space-x-2 bg-[#2D2D2D] p-2 rounded-full cursor-pointer"
                  onClick={() => setIsMarketDropdownOpen(!isMarketDropdownOpen)}
                >
                  <div className="flex items-center w-full space-x-2">
                    <Image
                      src={selectedCrypto.icon}
                      alt={selectedCrypto.name}
                      className="w-5 h-5"
                    />
                    <p className="text-sm font-normal text-[#FCFCFC]">
                      {selectedCrypto.name}
                    </p>
                    <Image
                      src={Arrow_d}
                      alt="arrow"
                      className="w-5 h-5 text-[#8F8F8F]"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Filter */}
              <div className="relative">
                <div
                  className="flex items-center w-auto h-10 bg-[#2D2D2D] p-2 rounded-full cursor-pointer min-w-[120px]"
                  onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                >
                  <div className="flex items-center space-x-2 px-1">
                    {loadingMethods ? (
                      <span className="text-sm font-normal text-[#8F8F8F] whitespace-nowrap">
                        Loading...
                      </span>
                    ) : (
                      <>
                        <p className="text-sm font-normal text-[#FCFCFC] whitespace-nowrap">
                          {selectedMethod}
                        </p>
                        <Image
                          src={Arrow_d}
                          alt="arrow"
                          className={`w-5 h-5 text-[#8F8F8F] transition-transform duration-200 ${
                            isPaymentOpen ? "rotate-180" : ""
                          }`}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Offers Section */}
            <div className="flex flex-col space-y-4 mt-6">
              {/* Results Summary */}
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#FCFCFC]">
                  Available Offers
                </h3>
                <div className="text-sm text-[#8F8F8F]">
                  Showing <span className="text-[#4DF2BE] font-bold">{offers.length}</span> offers
                  {allOffers.length > 0 && (
                    <span className="text-[#8F8F8F] ml-2">
                      (out of {allOffers.length} total)
                    </span>
                  )}
                </div>
              </div>

              {/* Debug Info - remove in production */}
              {errorOffers && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm font-bold">Error: {errorOffers}</p>
                  <p className="text-red-300 text-xs mt-2">Check console for details</p>
                </div>
              )}

              {/* Offers Display */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loadingOffers ? (
                  <div className="col-span-full text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DF2BE] mx-auto"></div>
                    <p className="text-[#aaa] mt-4">Loading offers from server...</p>
                  </div>
                ) : offers.length === 0 && allOffers.length > 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-[#aaa] text-lg">No offers match your filters</p>
                    <p className="text-[#8F8F8F] text-sm mt-2">Try changing your filter criteria</p>
                    <button
                      onClick={handleReset}
                      className="mt-4 bg-[#4DF2BE] text-[#0F1012] font-bold px-6 py-2 rounded-full hover:bg-[#3DD2A5] transition-colors"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : offers.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-[#aaa] text-lg">No offers available</p>
                    <p className="text-[#8F8F8F] text-sm mt-2">Click "Find Offers" to load offers</p>
                    <button
                      onClick={handleFetchOffers}
                      className="mt-4 bg-[#4DF2BE] text-[#0F1012] font-bold px-6 py-2 rounded-full hover:bg-[#3DD2A5] transition-colors"
                    >
                      Load Offers
                    </button>
                  </div>
                ) : (
                  offers.map((offer: Offer, index: number) => {
                    const rawName = offer?.user?.username || clientUser?.username || clientUser?.user?.username || clientUser?.email || "User";
                    const username = typeof rawName === "string" ? rawName : String(rawName);
                    const displayName = username ? (username.startsWith("@") ? username : `@${username}`) : "@User";
                    const initial = (username && username.length > 0) ? username.charAt(username.startsWith("@") ? 1 : 0).toUpperCase() : "U";
                    
                    const offerFiatCurrency = getOfferFiatCurrency(offer);
                    const tradingPair = getTradingPair(offer);
                    const offerPrice = calculateOfferPrice(offer);
                    const marketPrice = getCurrentMarketPrice(offer);
                    const limits = formatLimits(offer);
                    const displayType = getDisplayType(offer.type);
                    const isBuyOffer = displayType === 'Buy';
                    
                    return (
                      <div
                        key={offer.id || index}
                        className="bg-[#1F1F1F] rounded-xl p-4 min-w-0 hover:border hover:border-[#4DF2BE] transition-colors duration-200"
                      >
                        {/* User Info */}
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center rounded-full text-xs w-8 h-8 bg-[#4A4A4A] font-bold text-[#C7C7C7]">
                              {initial}
                            </div>
                            <p className="ml-2 text-sm text-white font-medium whitespace-nowrap">
                              {displayName}
                            </p>
                            <Image src={Mark_green} alt="mark" className="ml-2 w-3 h-3" />
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            offer.type === "SELL" 
                              ? "bg-green-500/20 text-green-400" 
                              : "bg-blue-500/20 text-blue-400"
                          }`}>
                            {offer.type}
                          </span>
                        </div>

                        {/* Trading Pair */}
                        <div className="mb-3">
                          <p className="text-sm text-[#C7C7C7] font-medium">
                            {tradingPair}
                          </p>
                        </div>

                        {/* Price Information */}
                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[#8F8F8F]">Price:</span>
                            <span className="text-base font-bold text-[#4DF2BE]">
                              {offerPrice}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[#8F8F8F]">Market:</span>
                            <span className="text-xs text-[#C7C7C7]">
                              {marketPrice}
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[#8F8F8F]">Margin:</span>
                            <span className="text-sm text-[#4DF2BE] font-medium">
                              {offer.margin}%
                            </span>
                          </div>

                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[#8F8F8F]">Limits:</span>
                            <span className="text-sm text-white font-medium">
                              {limits}
                            </span>
                          </div>
                        </div>

                        {/* Payment Method */}
                        <div className="flex items-center mt-2 mb-3">
                          <span className="text-xs text-[#8F8F8F]">Payment:</span>
                          <span className="text-[#4DF2BE] text-xs font-medium ml-1">
                            {renderPaymentMethod(offer.paymentMethod)}
                          </span>
                        </div>

                        {/* Time and Action Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Image src={Timer} alt="timer" className="w-4 h-4 mr-1" />
                            <p className="text-xs text-[#8F8F8F]">
                              {offer.time || "30 min"}
                            </p>
                          </div>
                          <button
                            className="bg-[#4DF2BE] text-xs text-[#0F1012] font-bold rounded-full py-2 px-4 border border-[#4DF2BE] hover:bg-[#3DD2A5] transition-colors"
                            onClick={() => router.push(`/offers/${offer.id}?fiatCurrency=${offerFiatCurrency}`)}
                          >
                            {displayType} {offer.crypto}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
        <div className="mb-[80px] whitespace-nowrap mt-[10%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Market_place;