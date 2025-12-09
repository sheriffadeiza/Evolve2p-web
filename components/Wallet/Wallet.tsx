"use client";

import React, { useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import Image from "next/image";
import Parrow from "../../public/Assets/Evolve2p_pArrow/elements.svg";
import SlashH from "../../public/Assets/Evolve2p_viewslash/view-off-slash.png";
import ViewIcon from "../../public/Assets/Evolve2p_viewslash/view-off-slash.png"; // Add a proper view icon
import Send from "../../public/Assets/Evolve2p_send/Dashboard/elements.svg";
import Barrow from "../../public/Assets/Evolve2p_Barrow/arrow-down-01.svg";
import Rarrowd from "../../public/Assets/Evolve2p_Rarrowd/arrow-down-right-01.svg";
import Swap from "../../public/Assets/Evolve2p_Swap/elements.svg";
import R_arrow from "../../public/Assets/Evolve2p_R/arrow-right-02.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import Larrow from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Points from "../../public/Assets/Evolve2p_threep/Wallet/elements.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import { QRCodeCanvas } from "qrcode.react";
import Yellow_i from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import Copy from "../../public/Assets/Evolve2p_code/elements.svg";
import Share from "../../public/Assets/Evolve2p_share/elements.svg";
import Footer from "../Footer/Footer";
import TabsNav from "../TabsNav/TabsNav";
import { useRouter } from "next/navigation";
import WalletTransactions from "@/app/walletTransaction/walletTrans";

interface QRCodeBoxProps {
  value?: string;
}

interface Wallet {
  id: string;
  currency: string;
  address: string;
  balance: number;
}

interface Currency {
  name: string;
  symbol: string;
}

const currencies: Currency[] = [
  { name: "USD", symbol: "$" },
  { name: "NGN", symbol: "₦" },
  { name: "BTC", symbol: "₿" },
  { name: "ETH", symbol: "Ξ" },
];

// Crypto Price Service using fetch
const CryptoPriceService = {
  async getMultipleCryptoPrices(coinIds: string[], vsCurrencies: string[] = ['usd']) {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=${vsCurrencies.join(',')}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching crypto prices from CoinGecko:', error);
      throw error;
    }
  },

  async getUSDToNGNRate() {
    try {
      // Using a free forex API for USD to NGN conversion
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.rates.NGN || 1500; // Fallback to 1500 if API fails
    } catch (error) {
      console.error('Error fetching USD to NGN rate:', error);
      return 1500; // Fallback rate
    }
  }
};

const Wallet: React.FC<QRCodeBoxProps> = ({ value }) => {
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [myDate, setMyDate] = useState("");
  const [clientUser, setClientUser] = useState<any>(null);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);
  const [currentCoin, setCurrentCoin] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [showAllBalances, setShowAllBalances] = useState(true); // New state for hiding all balances
  const [error, setError] = useState("");
  const [isTransOpen, setIsTransOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [totalBalanceUSD, setTotalBalanceUSD] = useState<number>(0);
  const [convertedBalance, setConvertedBalance] = useState<string>("0.00");
  const [cryptoPrices, setCryptoPrices] = useState<any>({});
  const [usdToNgnRate, setUsdToNgnRate] = useState<number>(1500);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [activeTab, setActiveTab] = useState("balance");

  const router = useRouter();

  // Safe number conversion helper
  const safeNumber = (value: any): number => {
    if (value === null || value === undefined) return 0;
    const num = Number(value);
    return isNaN(num) ? 0 : num;
  };

  // Fetch crypto prices and conversion rates
  useEffect(() => {
    const fetchAllPrices = async () => {
      setLoadingPrices(true);
      try {
        // Fetch crypto prices in USD
        const [cryptoPricesData, ngnRate] = await Promise.all([
          CryptoPriceService.getMultipleCryptoPrices(
            ['bitcoin', 'ethereum', 'tether', 'usd-coin'],
            ['usd']
          ),
          CryptoPriceService.getUSDToNGNRate()
        ]);

        setCryptoPrices(cryptoPricesData);
        setUsdToNgnRate(ngnRate);
      } catch (error) {
        console.error('Error fetching prices:', error);
        // Set fallback prices in case of API failure
        setCryptoPrices({
          bitcoin: { usd: 50000 },
          ethereum: { usd: 3000 },
          tether: { usd: 1 },
          'usd-coin': { usd: 1 }
        });
        setUsdToNgnRate(1500);
      } finally {
        setLoadingPrices(false);
      }
    };

    fetchAllPrices();
    const interval = setInterval(fetchAllPrices, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  // Calculate total balance in USD
  useEffect(() => {
    if (clientUser?.wallets && Object.keys(cryptoPrices).length > 0) {
      let totalUSD = 0;
      
      clientUser.wallets.forEach((wallet: Wallet) => {
        const walletBalance = safeNumber(wallet.balance);
        let usdValue = 0;

        switch (wallet.currency?.toUpperCase()) {
          case 'BTC':
            usdValue = walletBalance * safeNumber(cryptoPrices.bitcoin?.usd);
            break;
          case 'ETH':
            usdValue = walletBalance * safeNumber(cryptoPrices.ethereum?.usd);
            break;
          case 'USDT':
            usdValue = walletBalance * safeNumber(cryptoPrices.tether?.usd || 1);
            break;
          case 'USDC':
            usdValue = walletBalance * safeNumber(cryptoPrices['usd-coin']?.usd || 1);
            break;
          default:
            usdValue = walletBalance;
        }

        totalUSD += usdValue;
      });

      setTotalBalanceUSD(totalUSD);
    }
  }, [clientUser, cryptoPrices]);

  // Convert balance to selected currency
  useEffect(() => {
    if (totalBalanceUSD > 0) {
      let convertedValue = 0;
      
      switch (selectedCurrency.name) {
        case 'USD':
          convertedValue = totalBalanceUSD;
          break;
        case 'NGN':
          convertedValue = totalBalanceUSD * usdToNgnRate;
          break;
        case 'BTC':
          convertedValue = totalBalanceUSD / safeNumber(cryptoPrices.bitcoin?.usd || 1);
          break;
        case 'ETH':
          convertedValue = totalBalanceUSD / safeNumber(cryptoPrices.ethereum?.usd || 1);
          break;
        default:
          convertedValue = totalBalanceUSD;
      }

      // Format based on currency type
      if (selectedCurrency.name === 'BTC' || selectedCurrency.name === 'ETH') {
        setConvertedBalance(convertedValue.toFixed(8));
      } else {
        setConvertedBalance(convertedValue.toFixed(2));
      }
    } else {
      setConvertedBalance("0.00");
    }
  }, [totalBalanceUSD, selectedCurrency, cryptoPrices, usdToNgnRate]);

  const handleSelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsTransOpen(false);
  };

  const toggleDropdown = () => setOpen((prev) => !prev);
  const toggleReceiveDropdown = () => setIsReceiveOpen((prev) => !prev);
  const toggleVisibility = () => {
    setShowBalance(!showBalance);
    setShowAllBalances(!showAllBalances); // Toggle all balances visibility
  };
  const toggleTransDropdown = () => setIsTransOpen((prev) => !prev);

  const handleReceiveClick = (symbol: string) => {
    setCurrentCoin(symbol);
    setShowReceiveModal(true);
    setIsReceiveOpen(false);
  };

  const closeReceiveModal = () => setShowReceiveModal(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("UserData");
      if (!stored) {
        setError("Please login first");
        setTimeout(() => router.push("/Logins/login"), 1500);
        return;
      }
      try {
        const userData = JSON.parse(stored);
        setClientUser(userData?.userData || userData);
      } catch (e) {
        console.error("Error parsing user data:", e);
        setError("Invalid user data");
      }
    }
  }, [router]);

  useEffect(() => {
    if (currentCoin !== "" && clientUser?.wallets) {
      const wallet = clientUser.wallets.find(
        (w: Wallet) => w.currency?.toUpperCase() === currentCoin.toUpperCase()
      );
      setCurrentWallet(wallet || null);
    }
  }, [currentCoin, clientUser]);

  useEffect(() => {
    setMyDate(new Date().toLocaleString());
  }, []);

  // Get wallet balance in USD
  const getWalletBalanceUSD = (wallet: Wallet): number => {
    const walletBalance = safeNumber(wallet.balance);
    
    switch (wallet.currency?.toUpperCase()) {
      case 'BTC':
        return walletBalance * safeNumber(cryptoPrices.bitcoin?.usd);
      case 'ETH':
        return walletBalance * safeNumber(cryptoPrices.ethereum?.usd);
      case 'USDT':
        return walletBalance * safeNumber(cryptoPrices.tether?.usd || 1);
      case 'USDC':
        return walletBalance * safeNumber(cryptoPrices['usd-coin']?.usd || 1);
      default:
        return walletBalance;
    }
  };

  // Format balance with appropriate decimal places
  const formatBalance = (balance: number, currency: string): string => {
    const safeBalance = safeNumber(balance);
    
    if (currency === 'BTC' || currency === 'ETH') {
      if (safeBalance === 0) return "0.00";
      if (safeBalance < 0.001) return safeBalance.toFixed(8);
      if (safeBalance < 1) return safeBalance.toFixed(6);
      return safeBalance.toFixed(4);
    }
    
    // For stablecoins
    return safeBalance.toFixed(2);
  };

  // Get current price for display
  const getCurrentPrice = (symbol: string): string => {
    switch (symbol.toLowerCase()) {
      case 'btc':
        return `1 USD = ${(1 / safeNumber(cryptoPrices.bitcoin?.usd || 1)).toFixed(8)} BTC`;
      case 'eth':
        return `1 USD = ${(1 / safeNumber(cryptoPrices.ethereum?.usd || 1)).toFixed(6)} ETH`;
      case 'usdt':
        return `1 USD = 1.00 USDT`;
      case 'usdc':
        return `1 USD = 1.00 USDC`;
      default:
        return "Loading...";
    }
  };

  const cryptoAssets = [
    { symbol: "BTC", name: "Bitcoin", icon: BTC },
    { symbol: "ETH", name: "Ethereum", icon: ETH },
    { symbol: "USDC", name: "USDC", icon: USDC },
    { symbol: "USDT", name: "USDT", icon: USDT },
  ];

  // Custom Tabs Component
  const CustomTabs = () => {
    const tabs = [
      { id: "balance", label: "Balance" },
      { id: "transaction", label: "Transaction" },
      { id: "swap", label: "Swap" },
    ];

    return (
      <div className="flex bg-[#2D2D2D] rounded-[56px] w-full max-w-md md:w-[296px] h-12 md:h-[48px] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "swap") {
                router.push("/swap");
              } else {
                setActiveTab(tab.id);
              }
            }}
            className={`flex-1 flex items-center justify-center rounded-[56px] text-sm md:text-[16px] font-[500] transition-all ${
              activeTab === tab.id
                ? "bg-[#4A4A4A] text-[#FCFCFC]"
                : "text-[#DBDBDB] hover:text-[#FCFCFC]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Nav />

        {/* Custom Tabs Navigation */}
        <div className="flex justify-center md:justify-start mt-6 md:mt-8">
          <CustomTabs />
        </div>

        {/* Balance Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
          {/* Available Balance Card */}
          <div className="bg-[#222222] rounded-[12px] p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <p className="text-[14px] sm:text-[16px] font-[400] text-[#DBDBDB]">
                Available Balance
              </p>
              <div className="flex items-center cursor-pointer" onClick={toggleVisibility}>
                <Image
                  src={showBalance ? SlashH : ViewIcon}
                  alt={showBalance ? "hide" : "show"}
                  width={20}
                  height={20}
                  className="w-5 h-5 sm:w-6 sm:h-6"
                />
                <span className="text-[12px] sm:text-[14px] ml-2 text-[#DBDBDB]">
                  {showBalance ? "Hide Balances" : "Show Balances"}
                </span>
              </div>
            </div>
            
            {/* Balance and Currency Selector - Responsive Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              {/* Balance Display */}
              <div className="flex items-baseline space-x-2">
                <span className="text-[24px] sm:text-[28px] font-[700] text-[#FCFCFC]">
                  {selectedCurrency.symbol}
                </span>
                <span className="text-[32px] sm:text-[36px] font-[700] text-[#FCFCFC]">
                  {showBalance ? convertedBalance : "****"}
                </span>
              </div>
              
              {/* Currency Dropdown */}
              <div className="relative self-start sm:self-auto">
                <div 
                  className="flex items-center bg-[#2D2D2D] px-3 py-2 sm:px-4 sm:py-2 rounded-full cursor-pointer min-w-[90px] sm:min-w-[100px]"
                  onClick={toggleTransDropdown}
                >
                  <p className="text-[12px] sm:text-[14px] font-[700] text-[#DBDBDB] mr-2">
                    {selectedCurrency.name}
                  </p>
                  <Image src={Parrow} alt="arrow" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>

                {isTransOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[#222] rounded-[12px] shadow-lg z-50 border border-[#2D2D2D]">
                    {currencies.map((currency) => (
                      <div
                        key={currency.name}
                        onClick={() => handleSelect(currency)}
                        className={`flex justify-between items-center px-3 py-2 sm:px-4 sm:py-3 cursor-pointer hover:bg-[#2D2D2D] ${
                          currency.name === selectedCurrency.name ? "bg-[#2D2D2D]" : ""
                        }`}
                      >
                        <span className="text-[14px] sm:text-[16px] font-[500] text-[#FCFCFC]">
                          {currency.name}
                        </span>
                        <span
                          className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 ${
                            currency.name === selectedCurrency.name
                              ? "border-[#4DF2BE] bg-[#4DF2BE]"
                              : "border-[#5C5C5C]"
                          }`}
                        ></span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons - Responsive Layout */}
            <div className="flex flex-col xs:flex-row gap-3">
              <div className="relative">
                <button 
                  className="flex items-center justify-center bg-[#2D2D2D] text-[#4DF2BE] px-3 py-2 sm:px-4 sm:py-3 rounded-full font-[700] text-[12px] sm:text-[14px] gap-2 w-full xs:w-auto min-w-[110px] sm:min-w-[120px]"
                  onClick={toggleDropdown}
                >
                  <Image src={Send} alt="send" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                  Send
                  <Image src={Barrow} alt="arrow" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {open && (
                  <div className="absolute top-full left-0 mt-2 w-48 xs:w-64 bg-[#222222] rounded-[12px] shadow-lg z-50 p-3 sm:p-4">
                    {cryptoAssets.map((asset) => (
                      <div
                        key={asset.symbol}
                        className="flex justify-between items-center py-2 sm:py-3 cursor-pointer hover:opacity-80 border-b border-[#2D2D2D] last:border-b-0"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Image src={asset.icon} alt={asset.name} width={24} height={24} className="w-6 h-6 sm:w-7 sm:h-7" />
                          <span className="font-[400] text-[#FCFCFC] text-[12px] sm:text-[14px]">
                            Send {asset.name}
                          </span>
                        </div>
                        <Image src={Larrow} alt="arrow" width={20} height={20} className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <button 
                  className="flex items-center justify-center bg-[#2D2D2D] text-[#4DF2BE] px-3 py-2 sm:px-4 sm:py-3 rounded-full font-[700] text-[12px] sm:text-[14px] gap-2 w-full xs:w-auto min-w-[120px] sm:min-w-[130px]"
                  onClick={toggleReceiveDropdown}
                >
                  <Image src={Rarrowd} alt="receive" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                  Receive
                  <Image src={Barrow} alt="arrow" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {isReceiveOpen && (
                  <div className="absolute top-full left-0 mt-2 w-48 xs:w-64 bg-[#222222] rounded-[12px] shadow-lg z-50 p-3 sm:p-4">
                    {cryptoAssets.map((asset) => (
                      <div
                        key={asset.symbol}
                        onClick={() => handleReceiveClick(asset.symbol)}
                        className="flex justify-between items-center py-2 sm:py-3 cursor-pointer hover:opacity-80 border-b border-[#2D2D2D] last:border-b-0"
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Image src={asset.icon} alt={asset.name} width={24} height={24} className="w-6 h-6 sm:w-7 sm:h-7" />
                          <span className="font-[400] text-[#FCFCFC] text-[12px] sm:text-[14px]">
                            Receive {asset.name}
                          </span>
                        </div>
                        <Image src={Larrow} alt="arrow" width={20} height={20} className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                className="flex items-center justify-center bg-[#2D2D2D] text-[#4DF2BE] px-3 py-2 sm:px-4 sm:py-3 rounded-full font-[700] text-[12px] sm:text-[14px] gap-2 w-full xs:w-auto min-w-[110px] sm:min-w-[120px]"
                onClick={() => router.push("/swap")}
              >
                <Image src={Swap} alt="swap" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                Swap
              </button>
            </div>
          </div>

          {/* Daily Limit Card */}
          <div className="bg-[#222222] rounded-[12px] p-4 sm:p-6">
            <div className="mb-4">
              <p className="text-[14px] sm:text-[16px] font-[400] text-[#DBDBDB]">Daily Limit</p>
              <p className="text-[16px] sm:text-[18px] font-[500] text-[#FCFCFC]">
                {showAllBalances ? "$14,850,000" : "****"}
              </p>
            </div>

            <div className="w-full bg-[#4A4A4A] rounded-[4px] h-2 mb-2">
              <div className="bg-[#4DF2BE] rounded-[4px] h-2 w-3/4"></div>
            </div>

            <div className="flex flex-col xs:flex-row xs:justify-between text-[12px] sm:text-[14px] font-[400] text-[#DBDBDB] mb-4 gap-1">
              <p>
                {showAllBalances ? "$14,850,000 remaining" : "**** remaining"}
              </p>
              <p>Refreshes in 10 minutes</p>
            </div>

            <button className="bg-[#2D2D2D] text-[#FCFCFC] px-4 py-2 sm:px-6 sm:py-2 rounded-full font-[700] text-[12px] sm:text-[14px] w-full xs:w-auto ml-auto block">
              Increase Limit
            </button>
          </div>
        </div>

        {/* My Assets Section */}
        <div className="mt-8 md:mt-12">
          <div className="flex justify-between items-center mb-4 md:mb-6">
            <p className="text-[14px] sm:text-[16px] font-[500] text-[#8F8F8F]">My Assets</p>
            <button className="flex items-center text-[12px] sm:text-[14px] font-[700] text-[#FCFCFC]">
              See all
              <Image src={R_arrow} alt="arrow" width={14} height={14} className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>

          {/* Assets Grid */}
          <div className="grid grid-cols-1 gap-3 md:gap-4">
            {cryptoAssets.map((asset) => {
              const wallet = clientUser?.wallets?.find((w: any) => 
                w.currency?.toUpperCase() === asset.symbol.toUpperCase()
              );
              const walletBalance = safeNumber(wallet?.balance);
              const usdValue = getWalletBalanceUSD(wallet || { currency: asset.symbol, balance: 0 } as Wallet);

              return (
                <div key={asset.symbol} className="bg-[#222222] rounded-[12px] p-3 md:p-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                    <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                      <Image src={asset.icon} alt={asset.name} width={32} height={32} className="w-8 h-8 md:w-10 md:h-10" />
                      <div className="min-w-0 flex-1">
                        <p className="text-[14px] md:text-[16px] font-[700] text-[#FCFCFC] truncate">{asset.name}</p>
                        <p className="text-[12px] md:text-[14px] font-[400] text-[#8F8F8F] truncate">
                          {getCurrentPrice(asset.symbol)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center md:space-x-8 flex-1 justify-start md:justify-center">
                      <div className="text-right md:text-center">
                        <p className="text-[12px] md:text-[14px] font-[500] text-[#FCFCFC]">
                          {showAllBalances ? formatBalance(walletBalance, asset.symbol) : "****"}
                        </p>
                        <p className="text-[10px] md:text-[12px] font-[500] text-[#DBDBDB]">
                          {asset.symbol}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center md:space-x-8 flex-1 justify-start md:justify-end">
                      <div className="text-right">
                        <div className="flex items-baseline space-x-1">
                          <span className="text-[10px] md:text-[12px] font-[500] text-[#DBDBDB]">$</span>
                          <span className="text-[12px] md:text-[14px] font-[500] text-[#FCFCFC]">
                            {showAllBalances ? usdValue.toFixed(2) : "****"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 flex-wrap gap-2">
                      <button className="bg-[#2D2D2D] text-[#DBDBDB] px-2 py-1 md:px-3 md:py-2 rounded-full text-[10px] md:text-[14px] font-[500] min-w-[70px] md:min-w-[85px] flex items-center justify-center">
                        <Image src={Send} alt="send" width={10} height={10} className="mr-1 md:mr-2 w-2 h-2 md:w-3 md:h-3" />
                        Send
                      </button>
                      <button 
                        className="bg-[#2D2D2D] text-[#DBDBDB] px-2 py-1 md:px-3 md:py-2 rounded-full text-[10px] md:text-[14px] font-[500] min-w-[80px] md:min-w-[101px] flex items-center justify-center"
                        onClick={() => handleReceiveClick(asset.symbol)}
                      >
                        <Image src={Rarrowd} alt="receive" width={10} height={10} className="mr-1 md:mr-2 w-2 h-2 md:w-3 md:h-3" />
                        Receive
                      </button>
                      <button 
                        className="bg-[#2D2D2D] text-[#DBDBDB] px-2 py-1 md:px-3 md:py-2 rounded-full text-[10px] md:text-[14px] font-[500] min-w-[70px] md:min-w-[87px] flex items-center justify-center"
                        onClick={() => router.push("/swap")}
                      >
                        <Image src={Swap} alt="swap" width={10} height={10} className="mr-1 md:mr-2 w-2 h-2 md:w-3 md:h-3" />
                        Swap
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Transactions Section - Only show if activeTab is transaction */}
        {activeTab === "transaction" && (
          <div className="mt-8 md:mt-12">
            <WalletTransactions />
          </div>
        )}

        {/* Receive Modal */}
        {showReceiveModal && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
            <div className="bg-[#0F1012] rounded-[20px] max-w-md w-full max-h-[85vh] overflow-y-auto">
              <div className="p-4 sm:p-6">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-[14px] sm:text-[16px] font-[700] text-[#FCFCFC]">
                    Receive {currentCoin}
                  </h2>
                  <Image
                    src={Times}
                    alt="close"
                    width={28}
                    height={28}
                    className="cursor-pointer w-7 h-7 sm:w-8 sm:h-8"
                    onClick={closeReceiveModal}
                  />
                </div>

                <div className="mb-4 sm:mb-6">
                  <p className="text-[16px] sm:text-[18px] font-[700] text-[#FCFCFC] mb-2">
                    Your {currentCoin} Address
                  </p>
                  <p className="text-[12px] sm:text-[14px] font-[400] text-[#DBDBDB]">
                    Use this address to deposit <strong>{currentCoin}</strong> to your Evolve2p wallet.
                  </p>
                </div>

                <div className="flex justify-center mb-4 sm:mb-6">
                  <QRCodeCanvas
                    value={currentWallet?.address || ""}
                    size={180}
                    bgColor="#3A3A3A"
                    fgColor="#FFFFFF"
                    level="H"
                    includeMargin={true}
                  />
                </div>

                <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                  <div className="flex justify-between items-center bg-[#2D2D2D] p-2 sm:p-3 rounded-[8px]">
                    <p className="text-[12px] sm:text-[14px] text-[#DBDBDB] font-[400]">Network</p>
                    <strong className="text-[12px] sm:text-[14px] font-[500] text-[#FCFCFC]">
                      {currentCoin === "USDC" ? "BSC" : currentCoin === "USDT" ? "TRON" : currentCoin}
                    </strong>
                  </div>
                  <div className="flex justify-between items-center bg-[#2D2D2D] p-2 sm:p-3 rounded-[8px]">
                    <p className="text-[12px] sm:text-[14px] text-[#DBDBDB] font-[400]">Created</p>
                    <strong className="text-[12px] sm:text-[14px] font-[500] text-[#FCFCFC]">{myDate}</strong>
                  </div>
                </div>

                <div className="bg-[#2D2D2D] border-l-4 border-[#FFC051] p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="flex space-x-2 sm:space-x-3">
                    <Image src={Yellow_i} alt="info" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                    <p className="text-[11px] sm:text-[14px] font-[400] text-[#DBDBDB]">
                      Make sure to only send {currentCoin} through the selected network:{" "}
                      {currentCoin === "USDC" ? "BSC" : currentCoin === "USDT" ? "TRON" : currentCoin}.
                      Sending incompatible cryptocurrencies or sending through a different network may result in irreversible loss.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                  <button className="flex-1 bg-[#2D2D2D] text-[#FCFCFC] py-2 sm:py-3 rounded-full font-[700] text-[12px] sm:text-[14px] flex items-center justify-center">
                    {currentWallet?.address ? 
                      `${currentWallet.address.substring(0, 6)}...${currentWallet.address.substring(currentWallet.address.length - 4)}` : 
                      "Generating address..."
                    }
                    <Image src={Copy} alt="copy" width={14} height={14} className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                  <button className="flex-1 bg-[#2D2D2D] text-[#4DF2BE] py-2 sm:py-3 rounded-full font-[700] text-[12px] sm:text-[14px] flex items-center justify-center">
                    Share
                    <Image src={Share} alt="share" width={14} height={14} className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] whitespace-nowrap mt-[10%] ">
                  <Footer />
                </div>
      </div>
    </main>
  );
};

export default Wallet;