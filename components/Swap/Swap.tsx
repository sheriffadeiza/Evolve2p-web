"use client";

import React, { useEffect, useState } from "react";
import Nav from "../../components/NAV/Nav";
import TabsNav from "../TabsNav/TabsNav";
import Image from "next/image";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import Arrow from "../../public/Assets/Evolve2p_arrowd/arrow-down-01.png";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import Swapicon from "../../public/Assets/Evolve2p_swapicon/elements.svg";
import I_icon from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import Rotate from "../../public/Assets/Evolve2p_rotate/elements.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";

type CoinSymbol = "BTC" | "ETH" | "USDT" | "USDC";

interface CoinInfo {
  usd: number;
  btc: number;
  eth: number;
}

interface CoinDataMap {
  [key: string]: CoinInfo;
}

/**
 * Fetches latest coin prices from CoinPaprika and returns a CoinDataMap.
 */
export async function fetchCoinData(): Promise<CoinDataMap | null> {
  const symbolToId: Record<string, string> = {
    bitcoin: "btc-bitcoin",
    ethereum: "eth-ethereum",
    tether: "usdt-tether",
    "usd-coin": "usdc-usd-coin",
  };

  try {
    // Fetch USD prices for all supported coins
    const entries = await Promise.all(
      Object.entries(symbolToId).map(async ([key, id]) => {
        const res = await fetch(`https://api.coinpaprika.com/v1/tickers/${id}`);
        const data = await res.json();
        return [key, parseFloat(data.quotes.USD.price)];
      })
    );

    const usdPrices = Object.fromEntries(entries) as Record<string, number>;
    const btcPrice = usdPrices.bitcoin;
    const ethPrice = usdPrices.ethereum;

    const formattedPrices: CoinDataMap = {};

    for (const key in usdPrices) {
      const usd = usdPrices[key];
      formattedPrices[key] = {
        usd,
        btc: parseFloat((usd / btcPrice).toFixed(8)),
        eth: parseFloat((usd / ethPrice).toFixed(8)),
      };
    }

    // Set 1 for base units
    formattedPrices.bitcoin.btc = 1;
    formattedPrices.ethereum.eth = 1;

    return formattedPrices;
  } catch (error) {
    console.error("❌ Failed to fetch coin prices:", error);
    return null;
  }
}

/**
 * Get coin data safely using a switch-case symbol mapper.
 */
export function getCoinData(
  symbol: string,
  coinData?: CoinDataMap
): CoinInfo | { error: true; message: string } {
  if (!symbol) return { error: true, message: "Symbol is required" };
  if (!coinData) return { error: true, message: "Coin data is undefined" };

  let key: string;

  switch (symbol.toUpperCase()) {
    case "BTC":
      key = "bitcoin";
      break;
    case "ETH":
      key = "ethereum";
      break;
    case "USDT":
      key = "tether";
      break;
    case "USDC":
      key = "usd-coin";
      break;
    default:
      key = symbol.toLowerCase();
  }

  const data = coinData[key];
  return data || { error: true, message: `No data found for symbol "${symbol}"` };
}

export function convertCoinValue(
  fromSymbol: string,
  toSymbol: string,
  amount: number,
  coinData?: CoinDataMap
): number | { error: true; message: string } {
  const fromData = getCoinData(fromSymbol, coinData);
  const toData = getCoinData(toSymbol, coinData);

  if ("error" in fromData) return fromData;
  if ("error" in toData) return toData;

  // Convert through USD as a base reference
  const usdValue = amount * fromData.usd;
  const converted = usdValue / toData.usd;

  return parseFloat(converted.toFixed(8));
}

const Swap: React.FC = () => {
  const [isSwapModal, setIsSwapModal] = useState(false);
  const [IsSecpinModal, setIsSecpinModal] = useState(false);
  const [SecDropdownOpen, setSecDropdownOpen] = useState(false);
  const [SecDropdownOpenTwo, setSecDropdownOpenTwo] = useState(false);
  const [clientUser, setClientUser] = useState<any>(null);
  const [coinPrices, setCoinPrices] = useState<CoinDataMap | null>(null);
  const [fromCoinValue, setFromCoinValue] = useState<string>("");
  const [toCoinValue, setToCoinValue] = useState<string>("0");
  const [convertedValue, setConvertedValue] = useState<number>(0);
  const [isSwapping, setIsSwapping] = useState(false);

  // Refreshing/countdown states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(14);

  const router = useRouter();

  const closeSwapModal = () => setIsSwapModal(false);
  const closeSecpinModal = () => setIsSecpinModal(false);

  const toggleSecDropdown = () => {
    setSecDropdownOpen((prev) => !prev);
    setSecDropdownOpenTwo(false); // Close other dropdown
  };

  const toggleSecDropdownTwo = () => {
    setSecDropdownOpenTwo((prev) => !prev);
    setSecDropdownOpen(false); // Close other dropdown
  };

  // initial fetch
  useEffect(() => {
    (async () => {
      const res = await fetchCoinData();
      setCoinPrices(res);
    })();
  }, []);

  const coins = [
    { name: "BTC", icon: BTC },
    { name: "ETH", icon: ETH },
    { name: "USDT", icon: USDT },
    { name: "USDC", icon: USDC },
  ];

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [selectedCoinTwo, setSelectedCoinTwo] = useState(coins[1]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("UserData");
      if (!stored) {
        router.push("/Logins/login");
        return;
      }
      if (stored) {
        console.log(JSON.parse(stored));
        setClientUser(JSON.parse(stored)?.userData);
      }
    }
  }, []);

  // convert when inputs / selection / prices change
  useEffect(() => {
    const value = convertCoinValue(
      selectedCoin?.name,
      selectedCoinTwo?.name,
      Number(fromCoinValue) || 0,
      coinPrices || undefined
    );

    if (typeof value === "number") {
      setConvertedValue(value);
    } else {
      setConvertedValue(0);
    }
  }, [fromCoinValue, selectedCoin, selectedCoinTwo, coinPrices]);

  // countdown effect for auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          // time to refresh
          handleRefresh();
          return 14; // reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSwap = async () => {
    if (!fromCoinValue) return;
    setIsSwapping(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("UserData");
      const accessToken = JSON.parse(stored || "")?.accessToken;

      const res = await fetch(`${API_BASE_URL}/api/swap`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
          fromCoin: selectedCoin?.name,
          toCoin: selectedCoinTwo?.name,
          fromAmount: fromCoinValue,
        }),
        method: "POST",
      });

      const data = await res?.json();

      if (data?.error) {
        setIsSwapping(false);
        alert(data?.message);
        return;
      }

      if (data?.success) {
        setIsSwapping(false);
        setFromCoinValue("");
        setConvertedValue(0);
        alert(data?.message);
      }
    }
  };

  // swap coins in the UI (left <-> right) and swap amounts
  const swapCoins = () => {
    // swap selected coins
    setSelectedCoin((prevLeft) => {
      const prevRight = selectedCoinTwo;
      // set right to prevLeft
      setSelectedCoinTwo(prevLeft);
      return prevRight;
    });

    // swap amounts: left value becomes right and vice versa
    const leftVal = fromCoinValue; // string
    const rightVal = convertedValue ? String(convertedValue) : "";

    setFromCoinValue(rightVal);
    // set convertedValue to left numeric or 0
    setConvertedValue(Number(leftVal) || 0);
  };

  // refresh handler for Rotate icon — fetches prices and shows spinner
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetchCoinData();
      if (res) {
        setCoinPrices(res);
        // recalc using existing fromCoinValue
        const value = convertCoinValue(
          selectedCoin?.name,
          selectedCoinTwo?.name,
          Number(fromCoinValue) || 0,
          res
        );
        if (typeof value === "number") setConvertedValue(value);
      }
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      // short delay for nicer UX
      setTimeout(() => setIsRefreshing(false), 600);
      setRefreshCountdown(14);
    }
  };

  // helper to compute and format exchange rate text: 1 LEFT = X RIGHT
  const getExchangeRateText = () => {
    if (!coinPrices) {
      // fallback to computed value: if fromCoinValue provided, show ratio
      const denom = Number(fromCoinValue) || 1;
      const rate = convertedValue && denom !== 0 ? convertedValue / denom : 0;
      return rate ? rate.toFixed(6) : "0";
    }

    // map dropdown symbol to coinPrices key
    const mapSymbolToKey = (sym: string) => {
      switch (sym.toUpperCase()) {
        case "BTC":
          return "bitcoin";
        case "ETH":
          return "ethereum";
        case "USDT":
          return "tether";
        case "USDC":
          return "usd-coin";
        default:
          return sym.toLowerCase();
      }
    };

    const leftKey = mapSymbolToKey(selectedCoin.name);
    const rightKey = mapSymbolToKey(selectedCoinTwo.name);

    const leftData = coinPrices[leftKey];
    const rightData = coinPrices[rightKey];

    if (!leftData || !rightData) return "0";

    const rate = leftData.usd / rightData.usd;
    return isFinite(rate) ? rate.toFixed(6) : "0";
  };

  // Custom Tabs Component
  const CustomTabs = () => {
    const tabs = [
      { id: "balance", label: "Balance" },
      { id: "transaction", label: "Transaction" },
      { id: "swap", label: "Swap" },
    ];

    return (
      <div className="flex bg-[#2D2D2D] rounded-[56px] w-full md:w-[296px] h-[48px] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "balance") {
                router.push("/wallet");
              } else if (tab.id === "transaction") {
                router.push("/wallet?tab=transaction");
              } else {
                // Swap tab - stay on current page
                setActiveTab(tab.id);
              }
            }}
            className={`flex-1 flex items-center justify-center rounded-[56px] text-[16px] font-[500] transition-all ${
              tab.id === "swap"
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

  const [activeTab, setActiveTab] = useState("swap");

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Nav />

        {/* Custom Tabs Navigation */}
        <div className="flex justify-center md:justify-start mt-8">
          <CustomTabs />
        </div>

        {/* Main Swap Container */}
        <div className="bg-[#1A1A1A] mt-6 rounded-[12px] p-6 lg:p-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-[24px] font-[700] text-[#FCFCFC]">Swap Crypto</h1>
          </div>

          {/* Swap Cards Container */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 relative">
            {/* From Card */}
            <div className="bg-[#222222] rounded-[12px] p-4 lg:p-6 flex-1">
              <div className="mb-4">
                <p className="text-[14px] text-[#8F8F8F] font-[400]">You are swapping</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <input
                    value={fromCoinValue}
                    onChange={(e) => setFromCoinValue(e.target.value)}
                    placeholder="0"
                    className="bg-transparent border-none outline-none text-[24px] lg:text-[30px] w-full text-[#FCFCFC] placeholder-[#8F8F8F]"
                  />
                </div>
                
                {/* Coin Selector */}
                <div className="relative">
                  <div 
                    className="w-[96px] h-[32px] flex items-center justify-between bg-[#2D2D2D] rounded-full px-3 cursor-pointer"
                    onClick={toggleSecDropdown}
                  >
                    <div className="flex items-center space-x-2">
                      <Image src={selectedCoin.icon} alt={selectedCoin.name} width={24} height={24} />
                      <p className="text-[14px] font-[700] text-[#DBDBDB]">{selectedCoin.name}</p>
                    </div>
                    <Image src={Arrow} alt="arrow_down" width={16} height={16} />
                  </div>

                  {SecDropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-[200px] bg-[#222222] rounded-[12px] shadow-lg z-50 p-4 space-y-2">
                      {coins.map((coin) => (
                        <div
                          key={coin.name}
                          onClick={() => {
                            setSelectedCoin(coin);
                            setSecDropdownOpen(false);
                          }}
                          className="flex items-center justify-between cursor-pointer hover:bg-[#2D2D2D] px-3 py-2 rounded-[8px]"
                        >
                          <div className="flex items-center space-x-3">
                            <Image src={coin.icon} alt={coin.name} width={20} height={20} />
                            <p className="text-[14px] font-[500] text-[#FFFFFF]">{coin.name}</p>
                          </div>
                          <div
                            className={`w-[16px] h-[16px] rounded-full border-2 ${
                              selectedCoin.name === coin.name ? "border-[#4DF2BE] bg-[#4DF2BE]" : "border-[#8F8F8F]"
                            } flex items-center justify-center`}
                          >
                            {selectedCoin.name === coin.name && <div className="w-[6px] h-[6px] rounded-full bg-[#0F1012]"></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                <div className="bg-[#2D2D2D] text-[#8F8F8F] text-[12px] px-3 py-1 rounded-full whitespace-nowrap">
                  Min: 0.0001276
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">Balance:</p>
                  <span className="text-[14px] font-[500] text-[#FCFCFC]">
                    {clientUser?.wallets?.find((w: any) => w?.currency === selectedCoin?.name)?.balance || 0} {selectedCoin?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div
                className="w-[40px] h-[40px] rounded-full border-4 border-[#0F1012] bg-[#4DF2BE] flex items-center justify-center cursor-pointer hover:bg-[#3DD2A5] transition-colors"
                onClick={swapCoins}
              >
                <Image src={Swapicon} alt="swap" width={21} height={21} />
              </div>
            </div>

            {/* To Card */}
            <div className="bg-[#222222] rounded-[12px] p-4 lg:p-6 flex-1">
              <div className="mb-4">
                <p className="text-[14px] text-[#8F8F8F] font-[400]">You will receive</p>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                  <input
                    disabled
                    value={String(convertedValue)}
                    className="bg-transparent border-none outline-none text-[24px] lg:text-[30px] w-full text-white"
                  />
                </div>
                
                {/* Coin Selector */}
                <div className="relative">
                  <div 
                    className="w-[96px] h-[32px] flex items-center justify-between bg-[#2D2D2D] rounded-full px-3 cursor-pointer"
                    onClick={toggleSecDropdownTwo}
                  >
                    <div className="flex items-center space-x-2">
                      <Image src={selectedCoinTwo.icon} alt={selectedCoinTwo.name} width={24} height={24} />
                      <p className="text-[14px] font-[700] text-[#DBDBDB]">{selectedCoinTwo.name}</p>
                    </div>
                    <Image src={Arrow} alt="arrow_down" width={16} height={16} />
                  </div>

                  {SecDropdownOpenTwo && (
                    <div className="absolute top-full right-0 mt-2 w-[200px] bg-[#222222] rounded-[12px] shadow-lg z-50 p-4 space-y-2">
                      {coins.map((coin) => (
                        <div
                          key={coin.name}
                          onClick={() => {
                            setSelectedCoinTwo(coin);
                            setSecDropdownOpenTwo(false);
                          }}
                          className="flex items-center justify-between cursor-pointer hover:bg-[#2D2D2D] px-3 py-2 rounded-[8px]"
                        >
                          <div className="flex items-center space-x-3">
                            <Image src={coin.icon} alt={coin.name} width={20} height={20} />
                            <p className="text-[14px] font-[500] text-[#FFFFFF]">{coin.name}</p>
                          </div>
                          <div
                            className={`w-[16px] h-[16px] rounded-full border-2 ${
                              selectedCoinTwo.name === coin.name ? "border-[#4DF2BE] bg-[#4DF2BE]" : "border-[#8F8F8F]"
                            } flex items-center justify-center`}
                          >
                            {selectedCoinTwo.name === coin.name && <div className="w-[6px] h-[6px] rounded-full bg-[#0F1012]"></div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                <div className="bg-[#2D2D2D] text-[#FCFCFC] text-[12px] px-3 py-1 rounded-full whitespace-nowrap">
                  $0
                </div>
                <div className="flex items-center space-x-2">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">Balance:</p>
                  <span className="text-[14px] font-[500] text-[#FCFCFC]">
                    {clientUser?.wallets?.find((w: any) => w?.currency === selectedCoinTwo?.name)?.balance || 0} {selectedCoinTwo?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-[#2D2D2D] border-l-4 border-[#FFC051] rounded-r-[12px] p-4 mt-6">
            <div className="flex items-start space-x-3">
              <Image src={I_icon} alt="info" width={20} height={20} className="mt-1 flex-shrink-0" />
              <p className="text-[14px] font-[400] text-[#DBDBDB]">
                The exchange rate includes all fees from Evolv2p and our hedging counterparty
              </p>
            </div>
          </div>

          {/* Exchange Rate & Swap Button */}
          <div className="bg-[#222222] rounded-[8px] p-4 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                {/* Refresh Button */}
                <div className="w-[28px] h-[28px] flex items-center justify-center">
                  {isRefreshing ? (
                    <div className="animate-spin w-6 h-6 rounded-full border-2 border-[#FFC051] border-t-transparent" />
                  ) : (
                    <Image 
                      src={Rotate} 
                      alt="rotate" 
                      className="cursor-pointer hover:opacity-80 transition-opacity" 
                      onClick={handleRefresh} 
                    />
                  )}
                </div>

                {/* Exchange Rate */}
                <div className="flex flex-col">
                  <div className="flex items-center space-x-2 text-[16px] font-[500]">
                    <p className="text-[#DBDBDB]">1 {selectedCoin.name}</p>
                    <small className="text-[#8F8F8F]">=</small>
                    <span className="text-[#DBDBDB]">
                      {getExchangeRateText()} {selectedCoinTwo.name}
                    </span>
                  </div>
                  <p className="text-[14px] font-[400] text-[#8F8F8F] mt-1">
                    Refreshing in <span className="text-[#FFC051] font-[500]">{refreshCountdown} Seconds</span>
                  </p>
                </div>
              </div>

              {/* Swap Button */}
              <button
                onClick={() => setIsSwapModal(true)}
                disabled={!fromCoinValue || isSwapping}
                className="w-full sm:w-[120px] h-[44px] bg-[#4DF2BE] rounded-full text-[14px] font-[700] text-[#0F1012] border border-[#4DF2BE] hover:bg-[#3DD2A5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSwapping ? "Swapping..." : "Swap now"}
              </button>
            </div>
          </div>
        </div>

        {/* Swap Confirmation Modal */}
        {isSwapModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-[#1A1A1A] rounded-[12px] w-full max-w-md max-h-[85vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-[16px] font-[700] text-[#FFFFFF]">Confirm Swap</h2>
                  <Image
                    src={Times}
                    alt="close"
                    width={32}
                    height={32}
                    className="cursor-pointer hover:opacity-80"
                    onClick={closeSwapModal}
                  />
                </div>

                <p className="text-center text-[#8F8F8F] text-[16px] font-[500] mb-6">
                  Review the above before confirming <br /> Once made, your transaction is irreversible.
                </p>

                <div className="flex justify-center items-center mb-6">
                  <Image src={selectedCoin.icon} alt={selectedCoin.name} width={58} height={58} />
                  <Image src={selectedCoinTwo.icon} alt={selectedCoinTwo.name} width={58} height={58} className="-ml-4" />
                </div>

                <div className="text-center mb-6">
                  <p className="text-[20px] font-[700] text-[#FFFFFF]">
                    Confirm swap of {selectedCoin.name} to {selectedCoinTwo.name}
                  </p>
                </div>

                <div className="space-y-3 mb-6">
                  {[
                    { label: "You are swapping", value: `${fromCoinValue} ${selectedCoin.name}` },
                    { label: "You will receive", value: `${convertedValue} ${selectedCoinTwo.name}` },
                    { label: "Exchange Rate", value: `1 ${selectedCoin.name} = ${getExchangeRateText()} ${selectedCoinTwo.name}` },
                    { label: "Network Fee", value: "0.0001 BTC (≈ $4.80)" },
                    { label: "Total Cost", value: `${fromCoinValue ? String(Number(fromCoinValue) + 0.0001) : "—"} ${selectedCoin.name}` },
                    { label: "Estimated Time", value: "< 2 minutes" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center text-[14px] font-[400] text-[#DBDBDB] bg-[#222222] p-3 rounded-[6px]"
                    >
                      <span>{item.label}</span>
                      <span className="text-[#FCFCFC] font-[500]">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={closeSwapModal}
                    className="flex-1 h-[48px] bg-[#2D2D2D] rounded-full text-[#FFFFFF] text-[14px] font-[700] hover:bg-[#3A3A3A] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSwapping}
                    onClick={handleSwap}
                    className="flex-1 h-[48px] bg-[#4DF2BE] rounded-full text-[14px] text-[#0F1012] font-[700] border border-[#4DF2BE] hover:bg-[#3DD2A5] transition-colors disabled:opacity-50"
                  >
                    {isSwapping ? "Swapping..." : "Confirm Swap"}
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

export default Swap;