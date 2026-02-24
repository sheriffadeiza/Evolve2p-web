"use client";

import React, { useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Arrow_d from "../../public/Assets/Evolve2p_arrowd/arrow-down-01.png";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import Divider from "../../public/Assets/Evolve2p_divider/Divider.svg";
import Thumbs from "../../public/Assets/Evolve2p_thumbs/elements.svg";
import Timer from "../../public/Assets/Evolve2p_timer/elements.svg";
import Currency from "../../public/Assets/Evolve2p_Currency/Profile/money-04.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import Barrow from "../../public/Assets/Evolve2p_Barrow/arrow-down-01.svg";
import Footer from "../../components/Footer/Footer";
import { countryCurrencyService, CurrencyOption } from "../../utils/countryCurrencyService";

const Post: React.FC = () => {
    const [activeTab, setActiveTab] = useState("Buy");
    const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
    const [selectedCoin, setSelectedCoin] = useState({ name: "BTC", icon: BTC });
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<string>("Select payment method");
    const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);
    const [loadingUserMethods, setLoadingUserMethods] = useState(false);
    const [errorUserMethods, setErrorUserMethods] = useState("");
    const [userPaymentMethods, setUserPaymentMethods] = useState<any[]>([]);
    const [tempSelectedMethod, setTempSelectedMethod] = useState<any | null>(null);
    const [showPaymentDetails, setShowPaymentDetails] = useState(false);
    const [openCurrency, setOpenCurrency] = useState(false);
    const [currencySearch, setCurrencySearch] = useState("");

    const [isTimeLimitOpen, setIsTimeLimitOpen] = useState(false);
    const [selectedTimeLimit, setSelectedTimeLimit] = useState("30 minutes");

    const timeOptions = ["15 minutes", "30 minutes", "45 minutes", "1 hour"];

    const router = useRouter();
    const [adTypes, setAdTypes] = useState({
        tradeableOnly: true,
        verifiedOnly: true,
        noVerification: false,
    });
    const [sortBy, setSortBy] = useState("Best Rate");

    // Offer creation & display
    const [offers, setOffers] = useState<any[]>([]);
    const [loadingOffers, setLoadingOffers] = useState(false);
    const [errorOffers, setErrorOffers] = useState("");

    // Ad modal state
    const [isAdModalOpen, setIsAdModalOpen] = useState(false);
    const [modalMinUSD, setModalMinUSD] = useState<number | "">("");
    const [modalMaxUSD, setModalMaxUSD] = useState<number | "">("");
    const [modalMargin, setModalMargin] = useState<number>(2.5);
    const [terms, setTerms] = useState<string>("");
    const [autoReply, setAutoReply] = useState<string>("");

    // Currency state using the service
    const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
    const [selectedCurrency, setSelectedCurrency] = useState<CurrencyOption | null>(null);
    const [loadingCurrencies, setLoadingCurrencies] = useState(true);

    // User data and verification
    const [clientUser, setClientUser] = useState<any>(null);
    const isVerified = clientUser?.kycVerified ?? false;

    const coins = [
        { name: "BTC", icon: BTC },
        { name: "ETH", icon: ETH },
        { name: "USDT", icon: USDT },
        { name: "USDC", icon: USDC },
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

    // Load user from localStorage
    useEffect(() => {
        if (typeof window === "undefined") return;
        const raw = localStorage.getItem("UserData");
        if (!raw) return;
        try {
            const parsed = JSON.parse(raw);
            setClientUser(parsed.userData ?? parsed);
        } catch (e) {
            // ignore
        }
    }, []);

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

                setSelectedCurrency(defaultCurrency);

            } catch (error) {
                // ignore
            } finally {
                setLoadingCurrencies(false);
            }
        };

        loadCurrencies();
    }, []);

    const handleCurrencySelect = (currencyOption: CurrencyOption) => {
        setSelectedCurrency(currencyOption);
        setOpenCurrency(false);
        setCurrencySearch("");
        localStorage.setItem('selectedCurrency', currencyOption.code);
        localStorage.setItem('selectedCurrencyData', JSON.stringify(currencyOption));
    };

    const filteredCurrencies = currencySearch
        ? countryCurrencyService.searchCurrencies(currencySearch)
        : currencyOptions;

    // Fetch user's saved payment methods
    const fetchUserPaymentMethods = async () => {
        setLoadingUserMethods(true);
        setErrorUserMethods("");
        try {
            const stored = localStorage.getItem("UserData");
            const token = stored ? JSON.parse(stored)?.accessToken : null;
            if (!token) throw new Error("Not authenticated");

            const res = await fetch(
                "https://evolve2p-backend.onrender.com/api/get-user-payment-methods",
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to load your payment methods");
            setUserPaymentMethods(data.data || []);
        } catch (err: any) {
            setErrorUserMethods(err.message);
        } finally {
            setLoadingUserMethods(false);
        }
    };

    useEffect(() => {
        fetchUserPaymentMethods();
    }, []);

    // Helper to display method details
    const getMethodDisplay = (method: any) => {
        const typeName = method.type?.name || "Payment Method";
        const details = method.details || {};
        const firstField = Object.values(details)[0];
        return firstField ? `${typeName} - ${firstField}` : typeName;
    };

    // When user selects a method from dropdown, show preview
    const handleMethodSelect = (method: any) => {
        if (!isVerified) return; // should not be reachable if UI is disabled, but guard anyway
        setTempSelectedMethod(method);
        setShowPaymentDetails(true);
        setIsPaymentOpen(false);
    };

    // Confirm the selected method
    const confirmPaymentMethod = () => {
        if (tempSelectedMethod) {
            const methodId = tempSelectedMethod.id || tempSelectedMethod._id;
            setSelectedMethod(getMethodDisplay(tempSelectedMethod));
            setSelectedMethodId(methodId);
            setTempSelectedMethod(null);
            setShowPaymentDetails(false);
        }
    };

    // Cancel method selection
    const cancelMethodSelection = () => {
        setTempSelectedMethod(null);
        setShowPaymentDetails(false);
    };

    const handleReset = () => {
        setModalMaxUSD("");
        setModalMinUSD("");
        setSelectedMethodId(null);
        setSelectedMethod("Select payment method");
        setSelectedCoin({ name: "BTC", icon: BTC });
        setTerms("");
        setAutoReply("");
        setTempSelectedMethod(null);
        setShowPaymentDetails(false);
    };

    const handleCreateOffer = async (limits?: { minLimit: number; maxLimit: number; margin: number }) => {
        if (!limits?.minLimit || !limits?.maxLimit) {
            setErrorOffers("Please fill in both min and max limits.");
            return;
        }
        if (!selectedMethodId) {
            setErrorOffers("Please select a payment method.");
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

            const payload = {
                type: activeTab.toLowerCase(),
                crypto: selectedCoin.name,
                currency: selectedCurrency?.code || "USD",
                minLimit: limits.minLimit,
                maxLimit: limits.maxLimit,
                margin: limits.margin,
                paymentMethod: selectedMethodId,
                paymentTerms: terms || "Send only from your verified bank account.",
                autoReply: autoReply || `Hello! I'm ready to ${activeTab.toLowerCase()} ${selectedCoin.name}. Please read my terms carefully before proceeding.`,
                paymentTime: selectedTimeLimit,
            };

            const response = await fetch("https://evolve2p-backend.onrender.com/api/create-offer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (!response.ok) throw new Error(data?.message || "Failed to create offer");

            const newOffer = data.offer || data;

            // Try to enrich with full method details
            const selectedMethodDetails = userPaymentMethods.find(
                m => m.id === selectedMethodId || m._id === selectedMethodId
            );
            if (selectedMethodDetails) {
                newOffer.paymentMethod = selectedMethodDetails;
            }

            setOffers((prev) => [...prev, newOffer]);
            setIsAdModalOpen(false);
            handleReset();
        } catch (err: any) {
            setErrorOffers(err.message || "Error creating offer");
        } finally {
            setLoadingOffers(false);
        }
    };

    useEffect(() => {
        if (isAdModalOpen) {
            setAutoReply(`Hello! I'm ready to ${activeTab.toLowerCase()} ${selectedCoin.name}. Please read my terms carefully before proceeding.`);
        }
    }, [isAdModalOpen, activeTab, selectedCoin]);

    // Helper to render payment method details in the offer card
    const renderPaymentMethod = (paymentMethod: any) => {
        if (!paymentMethod) return "N/A";

        if (paymentMethod.type?.name && paymentMethod.details) {
            return (
                <div className="text-xs">
                    <span className="text-[#4DF2BE]">{paymentMethod.type.name}</span>
                    {Object.entries(paymentMethod.details).map(([key, val]) => (
                        <div key={key} className="text-[#8F8F8F] mt-0.5">
                            {key}: <span className="text-white">{String(val)}</span>
                        </div>
                    ))}
                </div>
            );
        }

        if (typeof paymentMethod === 'object' && (paymentMethod.id || paymentMethod._id)) {
            const id = paymentMethod.id || paymentMethod._id;
            const found = userPaymentMethods.find(m => m.id === id || m._id === id);
            if (found) {
                const typeName = found.type?.name || "Payment Method";
                const details = found.details || {};
                return (
                    <div className="text-xs">
                        <span className="text-[#4DF2BE]">{typeName}</span>
                        {Object.entries(details).map(([key, val]) => (
                            <div key={key} className="text-[#8F8F8F] mt-0.5">
                                {key}: <span className="text-white">{String(val)}</span>
                            </div>
                        ))}
                    </div>
                );
            }
            return <span className="text-[#4DF2BE] text-xs">{id}</span>;
        }

        if (typeof paymentMethod === 'string') {
            const found = userPaymentMethods.find(m => m.id === paymentMethod || m._id === paymentMethod);
            if (found) {
                const typeName = found.type?.name || "Payment Method";
                const details = found.details || {};
                return (
                    <div className="text-xs">
                        <span className="text-[#4DF2BE]">{typeName}</span>
                        {Object.entries(details).map(([key, val]) => (
                            <div key={key} className="text-[#8F8F8F] mt-0.5">
                                {key}: <span className="text-white">{String(val)}</span>
                            </div>
                        ))}
                    </div>
                );
            }
            return <span className="text-[#4DF2BE] text-xs">{paymentMethod}</span>;
        }

        return "N/A";
    };

    return (
        <main className="min-h-screen bg-[#0F1012] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                <Nav />

                {/* KYC Banner for unverified users */}
                {clientUser && !isVerified && (
                    <div className="mb-6 p-4 bg-[#342827] rounded-lg border-l-4 border-[#FE857D]">
                        <div className="flex items-start gap-3">
                            <svg className="w-5 h-5 text-[#FE857D] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <div>
                                <p className="text-sm font-medium text-white mb-1">Complete KYC to create offers</p>
                                <p className="text-xs text-[#DBDBDB] mb-2">
                                    You need to verify your identity before you can create offers and select payment methods.
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

                <div className="flex flex-col lg:flex-row gap-6 mt-6">
                    {/* Left Sidebar */}
                    <div className="bg-[#222222] p-4 lg:p-6 rounded-lg lg:w-96 lg:max-w-md w-full">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl lg:text-2xl font-bold text-[#FCFCFC]">Create an Ad</h2>
                        </div>

                        <p className="text-[#DBDBDB] mt-4 text-sm w-full">
                            Select the asset to trade, your payment method, and the payment time frame.
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

                            <div className="relative">
                                <div
                                    className="w-full h-12 bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
                                    onClick={() => setIsMarketDropdownOpen(!isMarketDropdownOpen)}
                                >
                                    <span className="flex items-center text-[#FCFCFC] text-sm font-medium">
                                        <Image src={selectedCoin.icon} alt={selectedCoin.name} className="w-5 h-5" />
                                        <p className="ml-2">{selectedCoin.name}</p>
                                    </span>
                                    <Image src={Arrow_d} alt="arrow" className={`text-[#DBDBDB] transition-transform duration-200 ${isMarketDropdownOpen ? "rotate-180" : ""}`} />
                                </div>

                                {isMarketDropdownOpen && (
                                    <div className="absolute w-full bg-[#222222] rounded-xl mt-2 shadow-lg p-2 z-50 border border-[#2D2D2D]">
                                        {coins.map((coin, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center py-2 px-2 cursor-pointer hover:text-emerald-400 rounded-lg hover:bg-[#2D2D2D]"
                                                onClick={() => {
                                                    setSelectedCoin(coin);
                                                    setIsMarketDropdownOpen(false);
                                                }}
                                            >
                                                <Image src={coin.icon} alt={coin.name} className="w-5 h-5" />
                                                <p className="ml-3 text-white text-sm font-medium">{coin.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="w-full h-px bg-[#8F8F8F] my-6" />

                        <div className="space-y-4">
                            <label className="block text-sm font-medium text-[#8F8F8F]">With Fiat</label>

                            {/* Preferred Currency */}
                            <div className="relative">
                                <div className="flex items-center w-full justify-between h-11 p-3 bg-[#2D2D2D] rounded-lg">
                                    <div className="flex items-center gap-2">
                                        <Image src={Currency} alt="currency" className="w-5 h-5" />
                                        <p className="text-sm font-medium text-[#DBDBDB]">Preferred currency</p>
                                    </div>

                                    <div
                                        onClick={() => setOpenCurrency(!openCurrency)}
                                        className="flex items-center w-32 h-7 bg-[#3A3A3A] px-2 rounded-2xl cursor-pointer"
                                    >
                                        {selectedCurrency?.flag && (
                                            <img
                                                src={selectedCurrency.flag}
                                                alt={selectedCurrency.name}
                                                width={20}
                                                height={14}
                                                className="rounded-sm object-cover"
                                            />
                                        )}

                                        <p className="text-xs font-medium text-[#DBDBDB] ml-2">
                                            {selectedCurrency?.code || "Select"}
                                        </p>

                                        <Image src={Barrow} alt="arrow-down" className="ml-auto w-3.5" />
                                    </div>
                                </div>

                                {openCurrency && (
                                    <div className="absolute top-12 left-0 right-0 sm:left-auto sm:right-0 sm:w-96 w-full max-h-80 bg-[#1A1A1A] rounded-lg shadow-lg overflow-y-auto z-50 border border-[#2D2D2D]">
                                        <div className="p-4 relative">
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
                                                className="w-full h-12 px-4 bg-[#2D2D2D] border-none text-white rounded-lg outline-none text-sm"
                                            />

                                            <div className="mt-4 space-y-2 max-h-60 overflow-y-auto">
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

                            <label className="text-[#8F8F8F] text-sm font-medium">Payment Method</label>
                            <div
                                className={`flex items-center justify-between w-full h-10 bg-[#2D2D2D] p-2 rounded-lg ${
                                    isVerified ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                                }`}
                                onClick={() => {
                                    if (isVerified) setIsPaymentOpen(!isPaymentOpen);
                                }}
                            >
                                <div className="flex items-center">
                                    <p className="text-sm font-normal text-[#FCFCFC] whitespace-nowrap">
                                        {loadingUserMethods ? "Loading..." : 
                                         !isVerified ? "Verify to select payment method" : selectedMethod}
                                    </p>
                                </div>
                                <Image
                                    src={Arrow_d}
                                    alt="arrow"
                                    className={`w-5 h-5 text-[#8F8F8F] transition-transform duration-200 ${
                                        isPaymentOpen && isVerified ? "rotate-180" : ""
                                    }`}
                                />
                            </div>

                            {isPaymentOpen && isVerified && (
                                <div className="absolute mt-2 w-full lg:w-64 bg-[#222222] rounded-xl shadow-lg p-2 z-50 border border-[#2D2D2D] max-h-60 overflow-y-auto">
                                    {errorUserMethods ? (
                                        <p className="text-red-400 text-center text-sm">{errorUserMethods}</p>
                                    ) : loadingUserMethods ? (
                                        <p className="text-[#aaa] text-center text-sm">Loading your methods...</p>
                                    ) : userPaymentMethods.length > 0 ? (
                                        userPaymentMethods.map((method) => {
                                            const methodId = method.id || method._id;
                                            return (
                                                <p
                                                    key={methodId}
                                                    className="text-white text-sm font-medium py-2 px-3 cursor-pointer hover:text-emerald-400 rounded-lg hover:bg-[#2D2D2D]"
                                                    onClick={() => handleMethodSelect(method)}
                                                >
                                                    {getMethodDisplay(method)}
                                                </p>
                                            );
                                        })
                                    ) : (
                                        <p className="text-[#aaa] text-center text-sm">No saved methods found. Add one in Settings.</p>
                                    )}
                                </div>
                            )}

                            {/* Payment Method Preview & Confirmation */}
                            {showPaymentDetails && tempSelectedMethod && (
                                <div className="mt-4 p-4 bg-[#2D2D2D] rounded-lg border border-[#3A3A3A]">
                                    <h4 className="text-sm font-bold text-[#FCFCFC] mb-2">Payment Method Details</h4>
                                    <div className="space-y-2 text-sm">
                                        <p className="text-[#8F8F8F]">Type: <span className="text-white">{tempSelectedMethod.type?.name || "N/A"}</span></p>
                                        {tempSelectedMethod.details && Object.entries(tempSelectedMethod.details).map(([key, value]) => (
                                            <p key={key} className="text-[#8F8F8F]">{key}: <span className="text-white">{String(value)}</span></p>
                                        ))}
                                    </div>
                                    <div className="flex gap-3 mt-4">
                                        <button
                                            onClick={confirmPaymentMethod}
                                            className="flex-1 bg-[#4DF2BE] text-[#0F1012] font-bold px-4 py-2 rounded-full text-sm hover:bg-[#3DD2A5] transition-colors"
                                        >
                                            Use this payment method
                                        </button>
                                        <button
                                            onClick={cancelMethodSelection}
                                            className="flex-1 bg-[#3A3A3A] text-white font-bold px-4 py-2 rounded-full text-sm hover:bg-[#4A4A4A] transition-colors"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Payment Time Limit */}
                        <div className="relative mt-6">
                            <label className="block text-sm font-medium text-[#8F8F8F] mb-2">Payment Time Limit</label>

                            <div
                                className="w-full h-11 bg-[#2D2D2D] flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer"
                                onClick={() => setIsTimeLimitOpen(!isTimeLimitOpen)}
                            >
                                <p className="text-[#FCFCFC] text-sm font-medium">{selectedTimeLimit}</p>
                                <Image src={Arrow_d} alt="arrow" className={`w-4 h-4 transition-transform duration-200 ${isTimeLimitOpen ? "rotate-180" : ""}`} />
                            </div>

                            {isTimeLimitOpen && (
                                <div className="absolute top-12 w-full bg-[#3A3A3A] rounded-lg shadow-lg z-50">
                                    {timeOptions.map((time, index) => (
                                        <div
                                            key={index}
                                            className="py-3 px-4 cursor-pointer hover:bg-[#4A4A4A] text-[#DBDBDB] text-sm"
                                            onClick={() => {
                                                setSelectedTimeLimit(time);
                                                setIsTimeLimitOpen(false);
                                            }}
                                        >
                                            {time}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex mt-8 w-full">
                            <button
                                className={`bg-[#4DF2BE] text-[#0F1012] text-sm font-bold px-6 py-3 rounded-full w-full h-12 border border-[#4DF2BE] hover:bg-[#3DD2A5] transition-colors ${
                                    !isVerified ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                                onClick={() => {
                                    if (isVerified) setIsAdModalOpen(true);
                                }}
                                disabled={!isVerified}
                            >
                                {isVerified ? "Create Ad" : "Verify to Create Ad"}
                            </button>
                        </div>

                        {isAdModalOpen && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                                <div className="bg-[#222222] w-full max-w-2xl p-6 rounded-xl relative max-h-[90vh] overflow-y-auto">
                                    <button
                                        className="absolute top-4 right-4 text-[#DBDBDB] font-bold text-lg hover:text-white"
                                        onClick={() => setIsAdModalOpen(false)}
                                    >
                                        ×
                                    </button>

                                    <h2 className="text-xl font-bold text-white mb-6">Set Order Details</h2>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[#DBDBDB] mb-2">
                                                Min Limit ({selectedCurrency?.code || "USD"})
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={modalMinUSD}
                                                onChange={(e) => setModalMinUSD(Number(e.target.value))}
                                                className="w-full p-3 bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg text-white outline-none focus:border-[#4DF2BE] transition-colors"
                                                placeholder="Enter minimum amount"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-[#DBDBDB] mb-2">
                                                Max Limit ({selectedCurrency?.code || "USD"})
                                            </label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={modalMaxUSD}
                                                onChange={(e) => setModalMaxUSD(Number(e.target.value))}
                                                className="w-full p-3 bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg text-white outline-none focus:border-[#4DF2BE] transition-colors"
                                                placeholder="Enter maximum amount"
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-[#DBDBDB] mb-2">
                                            Margin (%)
                                        </label>
                                        <input
                                            type="number"
                                            min={-10}
                                            max={100}
                                            step="0.1"
                                            value={modalMargin}
                                            onChange={(e) => setModalMargin(Number(e.target.value))}
                                            className="w-full p-3 bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg text-white outline-none focus:border-[#4DF2BE] transition-colors"
                                        />
                                        <p className="text-[#8F8F8F] text-xs mt-2">
                                            Your offer price will be calculated based on current market price + {modalMargin}% margin
                                        </p>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-bold text-[#DBDBDB] mb-2">
                                            Terms (Optional)
                                        </label>
                                        <p className="text-[#8F8F8F] text-sm mb-3">
                                            Set clear instructions and an automatic greeting to enhance your trading experience. Terms will be displayed to the counterparty.
                                        </p>
                                        <textarea
                                            value={terms}
                                            onChange={(e) => setTerms(e.target.value)}
                                            maxLength={500}
                                            placeholder="Enter your trading terms and conditions..."
                                            className="w-full h-32 p-3 bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg text-white outline-none focus:border-[#4DF2BE] transition-colors resize-none"
                                        />
                                        <div className="flex justify-between text-xs text-[#8F8F8F] mt-1">
                                            <span>Terms will be displayed to the counterparty</span>
                                            <span>{terms.length}/500</span>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-bold text-[#DBDBDB] mb-2">
                                            Auto-Reply Message
                                        </label>
                                        <p className="text-[#8F8F8F] text-sm mb-3">
                                            This message will be sent automatically when someone starts a trade with you.
                                        </p>
                                        <textarea
                                            value={autoReply}
                                            onChange={(e) => setAutoReply(e.target.value)}
                                            maxLength={500}
                                            placeholder="Enter your automatic reply message..."
                                            className="w-full h-24 p-3 bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg text-white outline-none focus:border-[#4DF2BE] transition-colors resize-none"
                                        />
                                        <div className="flex justify-between text-xs text-[#8F8F8F] mt-1">
                                            <span>Automatic greeting message</span>
                                            <span>{autoReply.length}/500</span>
                                        </div>
                                    </div>

                                    <div className="bg-[#2D2D2D] rounded-lg p-4 mb-6">
                                        <h3 className="text-sm font-bold text-[#DBDBDB] mb-3">Order Summary</h3>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-[#8F8F8F]">Type:</span>
                                                <span className="text-white">{activeTab} {selectedCoin.name}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#8F8F8F]">Currency:</span>
                                                <span className="text-white">{selectedCurrency?.code || "USD"}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#8F8F8F]">Payment Method:</span>
                                                <span className="text-white">{selectedMethod}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#8F8F8F]">Time Limit:</span>
                                                <span className="text-white">{selectedTimeLimit}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#8F8F8F]">Margin:</span>
                                                <span className="text-white">{modalMargin}%</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-[#8F8F8F]">Price Range:</span>
                                                <span className="text-white">
                                                    {modalMinUSD || "0"} - {modalMaxUSD || "0"} {selectedCurrency?.code || "USD"}
                                                </span>
                                            </div>
                                            <div className="flex justify-between border-t border-[#3A3A3A] pt-2">
                                                <span className="text-[#8F8F8F]">Price Calculation:</span>
                                                <span className="text-[#4DF2BE] font-bold">
                                                    Market Price + {modalMargin}% margin
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="w-full bg-[#4DF2BE] text-[#0F1012] font-bold py-4 rounded-lg text-sm hover:bg-[#3DD2A5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        onClick={() => {
                                            handleCreateOffer({
                                                minLimit: Number(modalMinUSD),
                                                maxLimit: Number(modalMaxUSD),
                                                margin: Number(modalMargin),
                                            });
                                        }}
                                        disabled={loadingOffers || !modalMinUSD || !modalMaxUSD || !selectedMethodId}
                                    >
                                        {loadingOffers ? "Creating..." : "Post Your Ad"}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Content */}
                    <div className="flex-1">
                        <div className="hidden lg:flex flex-wrap gap-4 text-sm text-[#8F8F8F] font-normal mb-6">
                            <p className="w-48">Seller</p>
                            <p className="w-40">Offer Details</p>
                            <p className="w-52">Limits & Payment</p>
                        </div>

                        <div className="flex flex-col items-center space-y-4">
                            {loadingOffers && (
                                <div className="flex justify-center items-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4DF2BE]"></div>
                                </div>
                            )}
                            
                            {errorOffers && (
                                <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 w-full">
                                    <p className="text-red-400 text-sm">{errorOffers}</p>
                                </div>
                            )}

                            {!loadingOffers && !errorOffers && offers.length > 0 && offers.map((offer, i) => (
                                <div key={i} className="bg-[#222222] p-6 w-full rounded-xl border border-[#2D2D2D]">
                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                                        <div className="flex items-center">
                                            <div className="flex items-center w-fit px-3 py-2 rounded-full bg-[#2D2D2D]">
                                                {(() => {
                                                    const rawName = offer?.user?.username || clientUser?.username || clientUser?.user?.username || clientUser?.email || "User";
                                                    const username = typeof rawName === "string" ? rawName : String(rawName);
                                                    const displayName = username ? (username.startsWith("@") ? username : `@${username}`) : "User";
                                                    const initial = (username && username.length > 0) ? username[0].toUpperCase() : "U";
                                                    return (
                                                        <>
                                                            <div className="flex items-center justify-center rounded-full text-sm w-8 h-8 bg-[#4A4A4A] font-bold text-[#C7C7C7]">
                                                                {initial}
                                                            </div>
                                                            <p className="ml-3 text-white font-medium whitespace-nowrap">
                                                                {displayName}
                                                            </p>
                                                        </>
                                                    );
                                                })()}
                                                <Image src={Mark_green} alt="mark" className="ml-2 w-4 h-4" />
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-4 text-sm font-normal text-[#8F8F8F]">
                                            <p className="whitespace-nowrap">Type: <span className="text-white">{offer.type}</span></p>
                                            <Image src={Divider} alt="divider" className="w-px h-4" />
                                            <div className="flex items-center space-x-1">
                                                <Image src={Thumbs} alt="thumbs" className="w-4 h-4" />
                                                <p className="whitespace-nowrap">Margin: <span className="text-white">{offer.margin}%</span></p>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <Image src={Timer} alt="timer" className="w-4 h-4" />
                                                <p className="whitespace-nowrap">Time: <span className="text-white">{offer.paymentTime || "30 minutes"}</span></p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col space-y-2">
                                            <p className="text-xs font-medium text-[#C7C7C7]">Currency: {offer.currency}</p>
                                            <div className="flex items-center">
                                                <p className="text-sm font-normal text-[#8F8F8F]">Min: <span className="text-white">{offer.minLimit} {offer.currency}</span></p>
                                                <Image src={Divider} alt="divider" className="w-px h-3 mx-3" />
                                                <p className="text-sm font-normal text-[#8F8F8F]">Max: <span className="text-white">{offer.maxLimit} {offer.currency}</span></p>
                                            </div>
                                        </div>

                                        {/* Payment Info */}
                                        <div className="flex flex-col">
                                            <div className="text-sm text-[#8F8F8F]">
                                                Payment:
                                            </div>
                                            <div className="text-[#4DF2BE] text-xs font-medium mt-1">
                                                {renderPaymentMethod(offer.paymentMethod)}
                                            </div>
                                        </div>

                                        <div className="w-24 whitespace-nowrap">
                                            <button
                                                className="bg-[#4DF2BE] text-xs text-[#0F1012] font-bold rounded-full py-3 px-4 border border-[#4DF2BE] w-full hover:bg-[#3DD2A5] transition-colors"
                                                onClick={() => String(offer.type || "").toLowerCase() === "buy" ? router.push("/myoffers") : router.push("/market_place/")}
                                            >
                                                {String(offer.type || "").toLowerCase() === "buy" ? "Buy" : "Sell"} {offer.crypto}
                                            </button>
                                        </div>
                                    </div>

                                    {offer.paymentTerms && offer.paymentTerms !== "Send only from your verified bank account." && (
                                        <div className="mt-4 p-3 bg-[#2D2D2D] rounded-lg border-l-4 border-l-[#4DF2BE]">
                                            <p className="text-xs text-[#8F8F8F] mb-1">Terms:</p>
                                            <p className="text-sm text-white">{offer.paymentTerms}</p>
                                        </div>
                                    )}
                                </div>
                            ))}

                            {offers.length === 0 && !loadingOffers && !errorOffers && (
                                <div className="text-center text-[#8F8F8F] py-12">
                                    <div className="text-lg mb-4">No offers created yet</div>
                                    <p className="text-sm mb-6">Create your first ad to see it displayed here</p>
                                    {isVerified ? (
                                        <button
                                            onClick={() => setIsAdModalOpen(true)}
                                            className="bg-[#4DF2BE] text-[#0F1012] font-bold px-6 py-3 rounded-full hover:bg-[#3DD2A5] transition-colors"
                                        >
                                            Create Your First Offer
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => router.push("/Signups/KYC")}
                                            className="bg-[#FE857D] text-white font-bold px-6 py-3 rounded-full hover:bg-[#E8746D] transition-colors"
                                        >
                                            Verify to Create Offer
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="w-[100%] h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
                <div className="mb-[80px] whitespace-nowrap mt-[10%]">
                    <Footer />
                </div>
            </div>
        </main>
    );
};

export default Post;