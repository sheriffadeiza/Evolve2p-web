"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
  currency?: string;
  fiatCurrency?: string;
  basePrice?: number;
  finalPrice?: number;
}

interface Crypto {
  name: string;
  icon: any;
}

interface AdTypes {
  tradeableOnly: boolean;
  verifiedOnly: boolean;
  noVerification: false;
}

interface UserData {
  accessToken?: string;
  token?: string;
  username?: string;
  email?: string;
  kycVerified?: boolean;          // added
  user?: {
    username?: string;
    kycVerified?: boolean;
  };
  userData?: {
    username?: string;
    kycVerified?: boolean;
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

  // Offer display
  const [offers, setOffers] = useState<Offer[]>([]);
  const [allOffers, setAllOffers] = useState<Offer[]>([]);
  const [loadingOffers, setLoadingOffers] = useState<boolean>(false);
  const [errorOffers, setErrorOffers] = useState<string>("");

  const [clientUser, setClientUser] = useState<UserData | null>(null);

  // Currency service
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [selectedFiatCurrencyData, setSelectedFiatCurrencyData] = useState<CurrencyOption | null>(null);
  const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);
  const [currencySearch, setCurrencySearch] = useState<string>("");

  // Global payment method types (from /api/get-payment-methods) – kept for filter, not for display
  const [methods, setMethods] = useState<{ id: string | number; name: string }[]>([]);

  // ========== VERIFICATION CHECK ==========
  const isVerified = useMemo(() => {
    // Check multiple possible paths for kycVerified
    if (!clientUser) return false;
    return !!(clientUser.kycVerified ||
              clientUser.user?.kycVerified ||
              clientUser.userData?.kycVerified);
  }, [clientUser]);

  // ================== HELPER: format date ==================
  const formatDate = (dateString: string): string => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  // ================== EXISTING FUNCTIONS ==================
  const getDisplayType = (offerType: string): string => {
    return offerType?.toUpperCase() === 'BUY' ? 'Sell' : 'Buy';
  };

  const getOfferFiatCurrency = (offer: Offer): string => {
    return offer.fiatCurrency || offer.currency || selectedFiatCurrencyCode;
  };

  const formatCurrency = (amount: number | undefined | null, currencyCode: string = selectedFiatCurrencyCode): string => {
    if (amount === undefined || amount === null) return 'Loading...';
    if (amount === 0) {
      const symbol = selectedFiatCurrencyData?.symbol || '$';
      return `${symbol}0.00`;
    }
    const currencyData = selectedFiatCurrencyData || currencyOptions.find(c => c.code === currencyCode);
    const symbol = currencyData?.symbol || '$';
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

  const toggleMarketDropdown = () => setIsMarketDropdownOpen((prev) => !prev);
  const toggleFunnel = () => setIsFunnelOpen((prev) => !prev);

  const handleApply = () => {
    // console removed
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
    ${enabled ? "translate-x-[25px] bg-[#000]" : "translate-x-0 bg-[#fff]"}`}
        />
      </div>
    );
  };

  // Fetch global payment method types (used for filter dropdown)
  const fetchPaymentMethods = async () => {
    setLoadingMethods(true);
    setErrorMethods("");
    try {
      const userDataRaw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
      if (!userDataRaw) throw new Error("No userData in localStorage");
      const userData = JSON.parse(userDataRaw);
      const token = userData?.accessToken || userData?.token;
      if (!token) throw new Error("No access token found");

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
      if (!response.ok) throw new Error(data?.message || `Server error ${response.status}`);

      let paymentMethods: any[] = [];
      if (Array.isArray(data)) paymentMethods = data;
      else if (Array.isArray(data.data)) paymentMethods = data.data;
      else if (Array.isArray(data.paymentMethods)) paymentMethods = data.paymentMethods;
      else if (data.data && Array.isArray(data.data.paymentMethods)) paymentMethods = data.data.paymentMethods;

      const transformedMethods = paymentMethods.map((method: any) => ({
        id: method.id || method._id || method.name,
        name: method.name || method.methodName || "Unknown Method"
      }));

      setMethods(transformedMethods);
      if (transformedMethods.length === 0) {
        setMethods([
          { id: "bank", name: "Bank Transfer" },
          { id: "paypal", name: "PayPal" },
          { id: "card", name: "Credit Card" },
        ]);
      }
    } catch (err: any) {
      setErrorMethods(err.message || "Error fetching payment methods");
      setMethods([
        { id: "bank", name: "Bank Transfer" },
        { id: "paypal", name: "PayPal" },
        { id: "card", name: "Credit Card" },
      ]);
    } finally {
      setLoadingMethods(false);
    }
  };

  // Load currencies
  useEffect(() => {
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
        setSelectedFiatCurrencyData(defaultCurrency);
        setSelectedFiatCurrencyCode(defaultCurrency.code);
      } catch (error) {
        // ignore
      } finally {
        setLoadingCurrencies(false);
      }
    };
    loadCurrencies();
  }, []);

  // Fetch global methods on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      fetchPaymentMethods();
    }
  }, []);

  const handleFiatCurrencySelect = (currencyOption: CurrencyOption) => {
    setSelectedFiatCurrencyData(currencyOption);
    setSelectedFiatCurrencyCode(currencyOption.code);
    setIsCurrencyOpen(false);
    setCurrencySearch("");
    localStorage.setItem('selectedCurrency', currencyOption.code);
    localStorage.setItem('selectedCurrencyData', JSON.stringify(currencyOption));
    if (allOffers.length > 0) applyFilters(allOffers);
  };

  const filteredCurrencies = currencySearch
    ? countryCurrencyService.searchCurrencies(currencySearch)
    : currencyOptions;

  const handleReset = () => {
    setMinAmount("");
    setMaxAmount("");
    setSelectedMethod("Payment Method");
    setSelectedFiatCurrencyCode("USD");
    setSelectedCrypto({ name: "BTC", icon: BTC });
    const usdCurrency = currencyOptions.find(c => c.code === 'USD') || currencyOptions[0];
    if (usdCurrency) handleFiatCurrencySelect(usdCurrency);
    setRegion("All Regions");
    if (allOffers.length > 0) applyFilters(allOffers);
  };

  const applyFilters = (offersList: Offer[]) => {
    const filtered = offersList.filter((offer: Offer) => {
      const offerFiatCurrency = getOfferFiatCurrency(offer);
      if (selectedCrypto.name !== "BTC" && offer.crypto !== selectedCrypto.name) return false;
      if (selectedFiatCurrencyData && offerFiatCurrency !== selectedFiatCurrencyCode) return false;
      if (selectedMethod && selectedMethod !== "Payment Method") {
        const offerPaymentMethod = typeof offer.paymentMethod === 'object'
          ? (offer.paymentMethod.name || offer.paymentMethod.methodName)
          : offer.paymentMethod;
        if (offerPaymentMethod !== selectedMethod) return false;
      }
      const offerType = offer.type?.toUpperCase();
      if (activeTab === "Buy" && offerType !== "SELL") return false;
      if (activeTab === "Sell" && offerType !== "BUY") return false;
      if (minAmount && typeof minAmount === 'number' && offer.minLimit < minAmount) return false;
      if (maxAmount && typeof maxAmount === 'number' && offer.maxLimit > maxAmount) return false;
      return true;
    });
    setOffers(filtered);
  };

  const handleFetchOffers = async () => {
    // If not verified, show a message and do nothing
    if (!isVerified) {
      alert("You need to complete KYC verification to view offers. Please verify your account.");
      return;
    }

    setLoadingOffers(true);
    setErrorOffers("");

    try {
      const userDataRaw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
      if (!userDataRaw) throw new Error("No userData in localStorage");
      const userData = JSON.parse(userDataRaw);
      const token = userData?.accessToken || userData?.token;
      if (!token) throw new Error("No access token found");

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
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        data = {};
      }

      if (!response.ok) throw new Error(data?.message || `Server error ${response.status}`);

      let offerList: Offer[] = [];
      if (Array.isArray(data)) offerList = data;
      else if (Array.isArray(data.data)) offerList = data.data;
      else if (Array.isArray(data.offers)) offerList = data.offers;
      else if (data.data && Array.isArray(data.data.offers)) offerList = data.data.offers;

      setAllOffers(offerList);
      applyFilters(offerList);
    } catch (err: any) {
      setErrorOffers(err.message || "Error fetching offers");
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
      // ignore
    }
  }, []);

  // Re-apply filters when any filter changes
  useEffect(() => {
    if (allOffers.length > 0) applyFilters(allOffers);
  }, [selectedCrypto, selectedFiatCurrencyData, selectedMethod, activeTab, minAmount, maxAmount]);

  // Price calculation helpers
  const calculateOfferPrice = (offer: Offer): string => {
    const offerFiatCurrency = getOfferFiatCurrency(offer);
    if (offer.finalPrice !== undefined && offer.finalPrice !== null && offer.finalPrice > 0) {
      return formatCurrency(offer.finalPrice, offerFiatCurrency);
    }
    if (offer.basePrice !== undefined && offer.basePrice !== null && offer.basePrice > 0 && offer.margin !== undefined) {
      const isBuyOffer = offer.type?.toUpperCase() === 'BUY';
      const calculatedPrice = isBuyOffer
        ? offer.basePrice * (1 - offer.margin / 100)
        : offer.basePrice * (1 + offer.margin / 100);
      return formatCurrency(calculatedPrice, offerFiatCurrency);
    }
    return 'Price not available';
  };

  const getCurrentMarketPrice = (offer: Offer): string => {
    const offerFiatCurrency = getOfferFiatCurrency(offer);
    if (offer.basePrice !== undefined && offer.basePrice !== null) {
      return formatCurrency(offer.basePrice, offerFiatCurrency);
    }
    return 'Market price not available';
  };

  const formatLimits = (offer: Offer): string => {
    const offerFiatCurrency = getOfferFiatCurrency(offer);
    const min = formatCurrency(offer.minLimit, offerFiatCurrency);
    const max = formatCurrency(offer.maxLimit, offerFiatCurrency);
    return `${min} – ${max}`;
  };

  const getTradingPair = (offer: Offer): string => {
    const offerFiatCurrency = getOfferFiatCurrency(offer);
    return `${offer.crypto}/${offerFiatCurrency}`;
  };

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Nav />

        {/* Show KYC prompt if unverified */}
        {!isVerified && clientUser && (
          <div className="mb-6 p-4 bg-[#342827] rounded-lg border-l-4 border-[#FE857D]">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-[#FE857D] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-white mb-1">Complete KYC to view offers</p>
                <p className="text-xs text-[#DBDBDB] mb-2">
                  You need to verify your identity before you can see and trade offers on the marketplace.
                </p>
                <button
                  onClick={() => router.push("/Signups/KYC")}
                  className="px-4 py-2 bg-[#FE857D] text-white text-xs font-medium rounded-full hover:bg-[#E8746D] transition-colors"
                >
                  Verify Now
                </button>
              </div>
            </div>
          </div>
        )}

        {offers.length > 0 && (
          <div className="mb-4 p-3 bg-[#222222] rounded-lg">
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#8F8F8F]">Current Filters:</span>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-[#3A3A3A] px-3 py-1 rounded-full">{selectedCrypto.name}</span>
                <span className="text-xs bg-[#3A3A3A] px-3 py-1 rounded-full">{selectedFiatCurrencyCode}</span>
                {selectedMethod !== "Payment Method" && (
                  <span className="text-xs bg-[#3A3A3A] px-3 py-1 rounded-full">{selectedMethod}</span>
                )}
                <span className="text-xs bg-[#4DF2BE] text-[#0F1012] px-3 py-1 rounded-full">{activeTab}</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Left Sidebar - FILTERS */}
          <div className="bg-[#222222] p-4 lg:p-6 rounded-lg lg:w-96 lg:max-w-md w-full">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-2xl font-bold text-[#FCFCFC]">Find an Offer</h2>
              <div className="flex items-center gap-2 bg-[#2D2D2D] p-3 rounded-full border border-[#2D2D2D] w-fit">
                <Image src={AD} alt="ad" className="w-5 h-5" />
                <p className="text-[#FFFA66] cursor-pointer text-sm font-bold"
                  onClick={() => router.push("/market_place/post_ad")}>Post an Ad</p>
              </div>
            </div>
            <p className="text-[#DBDBDB] mt-4 text-sm w-full">
              Filter offers by cryptocurrency, fiat currency, and payment method.
            </p>

            <div className="space-y-4 mt-6">
              <label className="block text-sm font-medium text-[#8F8F8F]">I want to</label>
              <div
                className="w-full h-12 bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
                onClick={() => setActiveTab(activeTab === "Buy" ? "Sell" : "Buy")}
              >
                <span className="text-[#FCFCFC] text-sm font-medium">{activeTab}</span>
                <Image src={Arrow_d} alt="arrow" className={`text-[#DBDBDB] transition-transform duration-200 ${activeTab === "Sell" ? "rotate-180" : ""}`} />
              </div>

              {/* Cryptocurrency Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#8F8F8F] mb-2">Cryptocurrency</label>
                <div
                  className="w-full h-12 bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
                  onClick={() => setIsMarketDropdownOpen(!isMarketDropdownOpen)}
                >
                  <span className="flex items-center text-[#FCFCFC] text-sm font-medium">
                    <Image src={selectedCrypto.icon} alt={selectedCrypto.name} className="w-5 h-5" />
                    <p className="ml-2">{selectedCrypto.name}</p>
                  </span>
                  <Image src={Arrow_d} alt="arrow" className={`text-[#DBDBDB] transition-transform duration-200 ${isMarketDropdownOpen ? "rotate-180" : ""}`} />
                </div>
                {isMarketDropdownOpen && (
                  <div className="absolute w-full bg-[#222222] rounded-xl mt-2 shadow-lg p-2 z-50 border border-[#2D2D2D]">
                    {cryptoOptions.map((crypto, index) => (
                      <div
                        key={index}
                        className="flex items-center py-2 px-2 cursor-pointer hover:text-emerald-400 rounded-lg hover:bg-[#2D2D2D]"
                        onClick={() => { setSelectedCrypto(crypto); setIsMarketDropdownOpen(false); }}
                      >
                        <Image src={crypto.icon} alt={crypto.name} className="w-5 h-5" />
                        <p className="ml-3 text-white text-sm font-medium">{crypto.name}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="w-full h-px bg-[#8F8F8F] my-6"></div>

            <div className="space-y-4">
              <label className="block text-sm font-medium text-[#8F8F8F]">Fiat Currency & Payment</label>

              {/* Fiat Currency Selection */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#8F8F8F] mb-2">Fiat Currency</label>
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
                        onError={(e) => (e.target as HTMLImageElement).src = 'https://flagcdn.com/w320/us.png'}
                      />
                    )}
                    <div>
                      <span className="text-[#FCFCFC] text-sm font-medium block">{selectedFiatCurrencyData?.code || 'USD'}</span>
                      <span className="text-[#8F8F8F] text-xs block">{selectedFiatCurrencyData?.name || 'Select Currency'}</span>
                    </div>
                  </div>
                  <Image src={Arrow_d} alt="arrow" className={`text-[#DBDBDB] transition-transform duration-200 ${isCurrencyOpen ? "rotate-180" : ""}`} />
                </div>
                {isCurrencyOpen && (
                  <div className="absolute w-full bg-[#222222] rounded-xl mt-2 shadow-lg p-2 z-50 max-h-80 overflow-y-auto border border-[#2D2D2D]">
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
                      <div className="text-white text-sm font-medium py-4 text-center">Loading fiat currencies...</div>
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
                            <img src={currencyOption.flag} alt={`${currencyOption.country} flag`} className="w-6 h-4 rounded mr-3 object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">{currencyOption.code}</p>
                              <p className="text-[#8F8F8F] text-xs truncate">{currencyOption.name}</p>
                            </div>
                            <span className="text-[#4DF2BE] text-sm font-medium">{currencyOption.symbol}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-[#8F8F8F] text-sm font-medium py-4 text-center">No fiat currencies found</div>
                    )}
                  </div>
                )}
              </div>

              {/* Payment Method Filter */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#8F8F8F] mb-2">Payment Method</label>
                <div
                  className="w-full h-12 bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
                  onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                >
                  <span className="text-[#FCFCFC] text-sm font-medium">{selectedMethod}</span>
                  <Image src={Arrow_d} alt="arrow" className={`text-[#DBDBDB] transition-transform duration-200 ${isPaymentOpen ? "rotate-180" : ""}`} />
                </div>
                {isPaymentOpen && (
                  <div className="absolute w-full bg-[#222222] rounded-xl mt-2 shadow-lg p-2 z-50 border border-[#2D2D2D] max-h-60 overflow-y-auto">
                    {loadingMethods ? (
                      <div className="text-white text-sm font-medium py-2 px-3 text-center">Loading payment methods...</div>
                    ) : errorMethods ? (
                      <div className="text-red-400 text-sm font-medium py-2 px-3">Error loading methods</div>
                    ) : (
                      <>
                        <div
                          className="text-white text-sm font-medium py-2 px-3 cursor-pointer hover:text-emerald-400 rounded-lg hover:bg-[#2D2D2D]"
                          onClick={() => { setSelectedMethod("Payment Method"); setIsPaymentOpen(false); }}
                        >
                          All Payment Methods
                        </div>
                        {methods.map((method) => (
                          <div
                            key={method.id}
                            className="text-white text-sm font-medium py-2 px-3 cursor-pointer hover:text-emerald-400 rounded-lg hover:bg-[#2D2D2D]"
                            onClick={() => { setSelectedMethod(method.name); setIsPaymentOpen(false); }}
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
                disabled={loadingOffers || !isVerified}
              >
                {loadingOffers ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#0F1012]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Loading Offers...
                  </span>
                ) : !isVerified ? (
                  "Verify to View"
                ) : (
                  "Find Offers"
                )}
              </button>
            </div>
          </div>

          {/* Main Content - OFFERS DISPLAY */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="flex bg-[#2D2D2D] rounded-[56px] items-center">
                {tabs.map((tab) => (
                  <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center justify-center text-sm w-16 h-8 rounded-[40px] cursor-pointer
                        ${activeTab === tab ? "bg-[#4A4A4A] text-[#FCFCFC] font-medium" : "bg-[#2D2D2D] text-[#DBDBDB] font-normal"}`}
                  >
                    {tab}
                  </div>
                ))}
              </div>

              <div className="relative">
                <div
                  className="flex items-center w-28 h-10 space-x-2 bg-[#2D2D2D] p-2 rounded-full cursor-pointer"
                  onClick={() => setIsMarketDropdownOpen(!isMarketDropdownOpen)}
                >
                  <div className="flex items-center w-full space-x-2">
                    <Image src={selectedCrypto.icon} alt={selectedCrypto.name} className="w-5 h-5" />
                    <p className="text-sm font-normal text-[#FCFCFC]">{selectedCrypto.name}</p>
                    <Image src={Arrow_d} alt="arrow" className="w-5 h-5 text-[#8F8F8F]" />
                  </div>
                </div>
              </div>

              <div className="relative">
                <div
                  className="flex items-center w-auto h-10 bg-[#2D2D2D] p-2 rounded-full cursor-pointer min-w-[120px]"
                  onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                >
                  <div className="flex items-center space-x-2 px-1">
                    {loadingMethods ? (
                      <span className="text-sm font-normal text-[#8F8F8F] whitespace-nowrap">Loading...</span>
                    ) : (
                      <>
                        <p className="text-sm font-normal text-[#FCFCFC] whitespace-nowrap">{selectedMethod}</p>
                        <Image src={Arrow_d} alt="arrow" className={`w-5 h-5 text-[#8F8F8F] transition-transform duration-200 ${isPaymentOpen ? "rotate-180" : ""}`} />
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center w-auto h-10 bg-[#2D2D2D] p-2 rounded-full cursor-pointer min-w-[120px]">
                <p onClick={() => router.push("/myoffers")} className='text-[#4DF2BE]'>My Offers</p>
              </div>
            </div>

            <div className="flex flex-col space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#FCFCFC]">Available Offers</h3>
                <div className="text-sm text-[#8F8F8F]">
                  Showing <span className="text-[#4DF2BE] font-bold">{offers.length}</span> offers
                  {allOffers.length > 0 && (
                    <span className="text-[#8F8F8F] ml-2">(out of {allOffers.length} total)</span>
                  )}
                </div>
              </div>

              {errorOffers && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                  <p className="text-red-400 text-sm font-bold">Error: {errorOffers}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {loadingOffers ? (
                  <div className="col-span-full text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DF2BE] mx-auto"></div>
                    <p className="text-[#aaa] mt-4">Loading offers from server...</p>
                  </div>
                ) : !isVerified ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-[#aaa] text-lg">Verification Required</p>
                    <p className="text-[#8F8F8F] text-sm mt-2">Please complete KYC to view available offers.</p>
                    <button
                      onClick={() => router.push("/Signups/KYC")}
                      className="mt-4 bg-[#4DF2BE] text-[#0F1012] font-bold px-6 py-2 rounded-full hover:bg-[#3DD2A5] transition-colors"
                    >
                      Verify Now
                    </button>
                  </div>
                ) : offers.length === 0 && allOffers.length > 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-[#aaa] text-lg">No offers match your filters</p>
                    <p className="text-[#8F8F8F] text-sm mt-2">Try changing your filter criteria</p>
                    <button onClick={handleReset} className="mt-4 bg-[#4DF2BE] text-[#0F1012] font-bold px-6 py-2 rounded-full hover:bg-[#3DD2A5] transition-colors">Reset Filters</button>
                  </div>
                ) : offers.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <p className="text-[#aaa] text-lg">No offers available</p>
                    <p className="text-[#8F8F8F] text-sm mt-2">Click "Find Offers" to load offers</p>
                    <button onClick={handleFetchOffers} className="mt-4 bg-[#4DF2BE] text-[#0F1012] font-bold px-6 py-2 rounded-full hover:bg-[#3DD2A5] transition-colors">Load Offers</button>
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

                    return (
                      <div key={offer.id || index} className="bg-[#1F1F1F] rounded-xl p-4 min-w-0 hover:border hover:border-[#4DF2BE] transition-colors duration-200">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center">
                            <div className="flex items-center justify-center rounded-full text-xs w-8 h-8 bg-[#4A4A4A] font-bold text-[#C7C7C7]">{initial}</div>
                            <p className="ml-2 text-sm text-white font-medium whitespace-nowrap">{displayName}</p>
                            <Image src={Mark_green} alt="mark" className="ml-2 w-3 h-3" />
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${offer.type === "SELL" ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"}`}>{offer.type}</span>
                        </div>

                        <div className="mb-3"><p className="text-sm text-[#C7C7C7] font-medium">{tradingPair}</p></div>

                        <div className="space-y-2 mb-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[#8F8F8F]">Price:</span>
                            <span className="text-base font-bold text-[#4DF2BE]">{offerPrice}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[#8F8F8F]">Market:</span>
                            <span className="text-xs text-[#C7C7C7]">{marketPrice}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[#8F8F8F]">Margin:</span>
                            <span className="text-sm text-[#4DF2BE] font-medium">{offer.margin}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-[#8F8F8F]">Limits:</span>
                            <span className="text-sm text-white font-medium">{limits}</span>
                          </div>
                        </div>

                        {/* Created At - replaces Payment */}
                        <div className="flex items-center mt-2 mb-3">
                          <span className="text-xs text-[#8F8F8F]">Created:</span>
                          <span className="text-[#4DF2BE] text-xs font-medium ml-1">
                            {formatDate(offer.createdAt)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Image src={Timer} alt="timer" className="w-4 h-4 mr-1" />
                            <p className="text-xs text-[#8F8F8F]">{offer.time || "30 min"}</p>
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

        <div className="w-[100%] h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        <div className="mb-[80px] whitespace-nowrap mt-[10%]"><Footer /></div>
      </div>
    </main>
  );
};

export default Market_place;