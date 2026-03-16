"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import Nav from "../../components/NAV/Nav";
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

// Types and helper functions (unchanged)
type CoinSymbol = "BTC" | "ETH" | "USDT" | "USDC";

interface CoinInfo {
  usd: number;
  btc: number;
  eth: number;
}

interface CoinDataMap {
  [key: string]: CoinInfo;
}

// CryptoCompare API (CORS‑friendly)
async function fetchCoinData(): Promise<CoinDataMap | null> {
  const symbols = ['BTC', 'ETH', 'USDT', 'USDC'];
  try {
    const response = await fetch(
      `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols.join(',')}&tsyms=USD`
    );
    if (!response.ok) return null;
    const data = await response.json();
    const usdPrices: { bitcoin: number; ethereum: number; tether: number; 'usd-coin': number } = {
      bitcoin: data.BTC?.USD || 0,
      ethereum: data.ETH?.USD || 0,
      tether: data.USDT?.USD || 1,
      'usd-coin': data.USDC?.USD || 1,
    };

    const btcPrice = usdPrices.bitcoin;
    const ethPrice = usdPrices.ethereum;
    if (!btcPrice || !ethPrice) return null;

    const formattedPrices: CoinDataMap = {};
    (["bitcoin", "ethereum", "tether", "usd-coin"] as const).forEach((key) => {
      const usd = usdPrices[key];
      formattedPrices[key] = {
        usd,
        btc: parseFloat((usd / btcPrice).toFixed(8)),
        eth: parseFloat((usd / ethPrice).toFixed(8)),
      };
    });
    formattedPrices.bitcoin.btc = 1;
    formattedPrices.ethereum.eth = 1;

    return formattedPrices;
  } catch {
    return null;
  }
}

function getCoinData(symbol: string, coinData?: CoinDataMap | null): CoinInfo | null {
  if (!symbol || !coinData) return null;
  const key = {
    BTC: "bitcoin",
    ETH: "ethereum",
    USDT: "tether",
    USDC: "usd-coin",
  }[symbol.toUpperCase()] || symbol.toLowerCase();
  return coinData[key] || null;
}

function convertCoinValue(
  fromSymbol: string,
  toSymbol: string,
  amount: number,
  coinData?: CoinDataMap | null
): number {
  const fromData = getCoinData(fromSymbol, coinData);
  const toData = getCoinData(toSymbol, coinData);
  if (!fromData || !toData) return 0;
  return parseFloat(((amount * fromData.usd) / toData.usd).toFixed(8));
}

const Swap: React.FC = () => {
  const [isSwapModal, setIsSwapModal] = useState(false);
  const [secDropdownOpen, setSecDropdownOpen] = useState(false);
  const [secDropdownOpenTwo, setSecDropdownOpenTwo] = useState(false);
  const [clientUser, setClientUser] = useState<any>(null);
  const [coinPrices, setCoinPrices] = useState<CoinDataMap | null>(null);
  const [fromCoinValue, setFromCoinValue] = useState("");
  const [convertedValue, setConvertedValue] = useState(0);
  const [isSwapping, setIsSwapping] = useState(false);
  const [networkFeePercent, setNetworkFeePercent] = useState(1);
  const [priceError, setPriceError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState(14);
  const [selectedCoin, setSelectedCoin] = useState({ name: "BTC", icon: BTC });
  const [selectedCoinTwo, setSelectedCoinTwo] = useState({ name: "ETH", icon: ETH });
  const [activeTab, setActiveTab] = useState("swap");
  const [error, setError] = useState("");

  const router = useRouter();

  const coins = useMemo(
    () => [
      { name: "BTC", icon: BTC },
      { name: "ETH", icon: ETH },
      { name: "USDT", icon: USDT },
      { name: "USDC", icon: USDC },
    ],
    []
  );

  // Load user data from localStorage (normalize)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("UserData");
    if (!stored) {
      setError("Please login first");
      setTimeout(() => router.push("/Logins/login"), 1500);
      return;
    }
    try {
      const parsed = JSON.parse(stored);
      const accessToken = parsed.accessToken || parsed.token || parsed.userData?.token;
      const userData = parsed.userData || parsed.user || parsed;
      const normalized = { accessToken, userData };
      localStorage.setItem("UserData", JSON.stringify(normalized));
      setClientUser(userData);
    } catch {
      setError("Invalid user data");
    }
  }, [router]);

  // Fetch live prices
  useEffect(() => {
    (async () => {
      const prices = await fetchCoinData();
      if (prices) {
        setCoinPrices(prices);
        setPriceError(null);
      } else {
        setPriceError("Unable to load live prices.");
      }
    })();
  }, []);

  // Fetch admin settings for swap fee
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const stored = localStorage.getItem("UserData");
        if (!stored) return;
        const parsed = JSON.parse(stored);
        const token = parsed.accessToken;
        if (!token) return;
        const res = await fetch(`${API_BASE_URL}/api/admin/settings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("UserData");
          setError("Session expired. Please login again.");
          setTimeout(() => router.push("/Logins/login"), 1500);
          return;
        }

        if (res.ok) {
          const data = await res.json();
          if (data.swapFee !== undefined) {
            setNetworkFeePercent(parseFloat(data.swapFee));
          }
        }
      } catch {
        // fallback to default
      }
    };
    fetchSettings();
  }, [router]);

  // Update conversion when inputs change
  useEffect(() => {
    if (!coinPrices) return;
    const value = convertCoinValue(
      selectedCoin.name,
      selectedCoinTwo.name,
      parseFloat(fromCoinValue) || 0,
      coinPrices
    );
    setConvertedValue(value);
  }, [fromCoinValue, selectedCoin, selectedCoinTwo, coinPrices]);

  // Auto-refresh countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          handleRefresh();
          return 14;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const closeSwapModal = () => setIsSwapModal(false);

  const toggleSecDropdown = () => {
    setSecDropdownOpen((prev) => !prev);
    setSecDropdownOpenTwo(false);
  };

  const toggleSecDropdownTwo = () => {
    setSecDropdownOpenTwo((prev) => !prev);
    setSecDropdownOpen(false);
  };

  // fetchLatestUser – no logs
  const fetchLatestUser = useCallback(
    async (email: string, token: string): Promise<any | null> => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/get-user`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email }),
        });

        if (res.status === 401) {
          localStorage.removeItem("UserData");
          setError("Session expired. Please login again.");
          setTimeout(() => router.push("/Logins/login"), 1500);
          return null;
        }

        if (!res.ok) return null;
        const data = await res.json();
        return data.userData || data;
      } catch {
        return null;
      }
    },
    []
  );

  // Merge function: combine optimistic updates with backend data
  const mergeUserData = useCallback((backendUser: any, optimisticUser: any): any => {
    const merged = { ...optimisticUser, ...backendUser };
    merged.wallets = backendUser.wallets || optimisticUser.wallets || [];
    merged.swaps = backendUser.swaps || optimisticUser.swaps || [];
    return merged;
  }, []);

  const updateUserData = useCallback((updatedUser: any, newToken?: string) => {
    setClientUser(updatedUser);
    const stored = localStorage.getItem("UserData");
    if (!stored) return;
    try {
      const parsed = JSON.parse(stored);
      if (newToken) {
        parsed.accessToken = newToken;
      }
      parsed.userData = updatedUser;
      localStorage.setItem("UserData", JSON.stringify(parsed));

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('userDataUpdated'));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleSwap = async () => {
    if (!fromCoinValue || !clientUser) return;
    setIsSwapping(true);

    const stored = localStorage.getItem("UserData");
    if (!stored) return;
    const parsed = JSON.parse(stored);
    const token = parsed.accessToken;
    if (!token) {
      setError("Authentication token missing");
      setTimeout(() => router.push("/Logins/login"), 1500);
      return;
    }

    const email = clientUser?.email;
    if (!email) {
      setError("User email not found");
      setTimeout(() => router.push("/Logins/login"), 1500);
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/swap`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fromCoin: selectedCoin.name,
          toCoin: selectedCoinTwo.name,
          fromAmount: fromCoinValue,
        }),
      });

      if (res.status === 401) {
        localStorage.removeItem("UserData");
        setError("Session expired. Please login again.");
        setTimeout(() => router.push("/Logins/login"), 1500);
        return;
      }

      const data = await res.json();

      if (data?.error) {
        alert(data.message);
        return;
      }

      if (data?.success) {
        const newToken = data.accessToken;

        // Perform optimistic update
        const fromAmountNum = parseFloat(fromCoinValue);
        const feeInSource = getNetworkFeeInSource();

        const fromWallet = clientUser.wallets?.find((w: any) => w.currency === selectedCoin.name);
        const toWallet = clientUser.wallets?.find((w: any) => w.currency === selectedCoinTwo.name);

        if (!fromWallet || !toWallet) {
          alert("Wallet not found");
          setIsSwapping(false);
          return;
        }

        const newFromBalance = fromWallet.balance - fromAmountNum - feeInSource;
        const newToBalance = toWallet.balance + convertedValue;

        const updatedWallets = clientUser.wallets.map((wallet: any) => {
          if (wallet.currency === selectedCoin.name) {
            return { ...wallet, balance: newFromBalance };
          }
          if (wallet.currency === selectedCoinTwo.name) {
            return { ...wallet, balance: newToBalance };
          }
          return wallet;
        });

        const newSwap = {
          id: data.swapId || `swap_${Date.now()}`,
          fromCoin: selectedCoin.name,
          toCoin: selectedCoinTwo.name,
          fromAmount: fromAmountNum,
          toAmount: convertedValue,
          fee: feeInSource,
          timestamp: new Date().toISOString(),
        };

        const optimisticUser = {
          ...clientUser,
          wallets: updatedWallets,
          swaps: [...(clientUser.swaps || []), newSwap],
        };
        updateUserData(optimisticUser, newToken);

        // Refresh from backend after a short delay and merge
        setTimeout(async () => {
          const storedNow = localStorage.getItem("UserData");
          if (!storedNow) return;
          const parsedNow = JSON.parse(storedNow);
          const currentToken = parsedNow.accessToken;
          if (currentToken && email) {
            const freshUser = await fetchLatestUser(email, currentToken);
            if (freshUser) {
              const currentOptimistic = parsedNow.userData || optimisticUser;
              const mergedUser = mergeUserData(freshUser, currentOptimistic);
              updateUserData(mergedUser);
            }
          }
        }, 500);

        setFromCoinValue("");
        setConvertedValue(0);
        setIsSwapModal(false);
        alert(data.message || "Swap completed");
      }
    } catch {
      alert("Network error. Please try again.");
    } finally {
      setIsSwapping(false);
    }
  };

  const swapCoins = () => {
    setSelectedCoin((prev) => {
      const prevTwo = selectedCoinTwo;
      setSelectedCoinTwo(prev);
      return prevTwo;
    });
    const leftVal = fromCoinValue;
    const rightVal = convertedValue ? String(convertedValue) : "";
    setFromCoinValue(rightVal);
    setConvertedValue(parseFloat(leftVal) || 0);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    const prices = await fetchCoinData();
    if (prices) {
      setCoinPrices(prices);
      setPriceError(null);
      const value = convertCoinValue(
        selectedCoin.name,
        selectedCoinTwo.name,
        parseFloat(fromCoinValue) || 0,
        prices
      );
      setConvertedValue(value);
    } else {
      setPriceError("Unable to load live prices.");
    }
    setTimeout(() => setIsRefreshing(false), 600);
    setRefreshCountdown(14);
  };

  const getExchangeRateText = useCallback(() => {
    if (!coinPrices) return "0";
    const leftKey = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      USDC: "usd-coin",
    }[selectedCoin.name];
    const rightKey = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      USDC: "usd-coin",
    }[selectedCoinTwo.name];
    const leftData = leftKey ? coinPrices[leftKey] : null;
    const rightData = rightKey ? coinPrices[rightKey] : null;
    if (!leftData || !rightData) return "0";
    const rate = leftData.usd / rightData.usd;
    return isFinite(rate) ? rate.toFixed(6) : "0";
  }, [coinPrices, selectedCoin.name, selectedCoinTwo.name]);

  const getNetworkFeeInSource = useCallback((): number => {
    const amount = parseFloat(fromCoinValue) || 0;
    return amount * (networkFeePercent / 100);
  }, [fromCoinValue, networkFeePercent]);

  const getNetworkFeeInTarget = useCallback((): string => {
    if (!coinPrices) return "—";
    const feeInSource = getNetworkFeeInSource();
    const sourceKey = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      USDC: "usd-coin",
    }[selectedCoin.name];
    const targetKey = {
      BTC: "bitcoin",
      ETH: "ethereum",
      USDT: "tether",
      USDC: "usd-coin",
    }[selectedCoinTwo.name];
    const sourcePrice = sourceKey ? coinPrices[sourceKey]?.usd : null;
    const targetPrice = targetKey ? coinPrices[targetKey]?.usd : null;
    if (!sourcePrice || !targetPrice) return "—";
    const feeUSD = feeInSource * sourcePrice;
    const feeInTarget = feeUSD / targetPrice;
    return feeInTarget.toFixed(8);
  }, [coinPrices, selectedCoin.name, selectedCoinTwo.name, getNetworkFeeInSource]);

  const feeInSource = getNetworkFeeInSource();

  const CustomTabs = useMemo(
    () => (
      <div className="flex bg-[#2D2D2D] rounded-[56px] w-full md:w-[296px] h-[48px] p-1">
        {[
          { id: "balance", label: "Balance", path: "/wallet" },
          { id: "transaction", label: "Transaction", path: "/wallet?tab=transaction" },
          { id: "swap", label: "Swap", path: "#" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "swap") setActiveTab(tab.id);
              else router.push(tab.path);
            }}
            className={`flex-1 flex items-center justify-center rounded-[56px] text-[16px] font-[500] transition-all ${
              activeTab === tab.id
                ? "bg-[#4A4A4A] text-[#FCFCFC]"
                : "text-[#DBDBDB] hover:text-[#FCFCFC]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    ),
    [activeTab, router]
  );

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1012] text-white">
        <h1 className="text-2xl font-bold mb-4 text-[#F5918A]">Authentication Error</h1>
        <p className="mb-6">{error}</p>
        <button onClick={() => router.push("/Logins/login")} className="bg-[#4DF2BE] text-[#0F1012] px-6 py-2 rounded-full">
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Nav />
        <div className="flex justify-center md:justify-start mt-8">{CustomTabs}</div>

        <div className="bg-[#1A1A1A] mt-6 rounded-[12px] p-6 lg:p-8">
          <h1 className="text-[24px] font-[700] mb-6">Swap Crypto</h1>

          {priceError && (
            <div className="bg-[#342827] border-l-4 border-[#FE857D] p-4 mb-6 rounded-r-[12px]">
              <p className="text-[#FE857D] text-sm">{priceError}</p>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 relative">
            {/* From Card */}
            <div className="bg-[#222222] rounded-[12px] p-4 lg:p-6 flex-1">
              <p className="text-[14px] text-[#8F8F8F] mb-4">You are swapping</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <input
                  value={fromCoinValue}
                  onChange={(e) => setFromCoinValue(e.target.value)}
                  placeholder="0"
                  className="bg-transparent border-none outline-none text-[24px] lg:text-[30px] w-full placeholder-[#8F8F8F]"
                />
                <div className="relative">
                  <div
                    onClick={toggleSecDropdown}
                    className="w-[96px] h-[32px] flex items-center justify-between bg-[#2D2D2D] rounded-full px-3 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Image src={selectedCoin.icon} alt="" width={24} height={24} />
                      <span className="text-[14px] font-[700] text-[#DBDBDB]">{selectedCoin.name}</span>
                    </div>
                    <Image src={Arrow} alt="" width={16} height={16} />
                  </div>
                  {secDropdownOpen && (
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
                            <Image src={coin.icon} alt="" width={20} height={20} />
                            <span className="text-[14px] font-[500]">{coin.name}</span>
                          </div>
                          <div
                            className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center ${
                              selectedCoin.name === coin.name
                                ? "border-[#4DF2BE] bg-[#4DF2BE]"
                                : "border-[#8F8F8F]"
                            }`}
                          >
                            {selectedCoin.name === coin.name && (
                              <div className="w-[6px] h-[6px] rounded-full bg-[#0F1012]" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                <span className="bg-[#2D2D2D] text-[#8F8F8F] text-[12px] px-3 py-1 rounded-full">
                  Min: 0.0001276
                </span>
                <div className="flex items-center space-x-2">
                  <span className="text-[14px] text-[#8F8F8F]">Balance:</span>
                  <span className="text-[14px] font-[500]">
                    {clientUser?.wallets?.find((w: any) => w?.currency === selectedCoin.name)?.balance || 0}{" "}
                    {selectedCoin.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Swap Button */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
              <div
                onClick={swapCoins}
                className="w-[40px] h-[40px] rounded-full border-4 border-[#0F1012] bg-[#4DF2BE] flex items-center justify-center cursor-pointer hover:bg-[#3DD2A5] transition-colors"
              >
                <Image src={Swapicon} alt="" width={21} height={21} />
              </div>
            </div>

            {/* To Card */}
            <div className="bg-[#222222] rounded-[12px] p-4 lg:p-6 flex-1">
              <p className="text-[14px] text-[#8F8F8F] mb-4">You will receive (after fee)</p>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <input
                  disabled
                  value={String(convertedValue)}
                  className="bg-transparent border-none outline-none text-[24px] lg:text-[30px] w-full text-white"
                />
                <div className="relative">
                  <div
                    onClick={toggleSecDropdownTwo}
                    className="w-[96px] h-[32px] flex items-center justify-between bg-[#2D2D2D] rounded-full px-3 cursor-pointer"
                  >
                    <div className="flex items-center space-x-2">
                      <Image src={selectedCoinTwo.icon} alt="" width={24} height={24} />
                      <span className="text-[14px] font-[700] text-[#DBDBDB]">{selectedCoinTwo.name}</span>
                    </div>
                    <Image src={Arrow} alt="" width={16} height={16} />
                  </div>
                  {secDropdownOpenTwo && (
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
                            <Image src={coin.icon} alt="" width={20} height={20} />
                            <span className="text-[14px] font-[500]">{coin.name}</span>
                          </div>
                          <div
                            className={`w-[16px] h-[16px] rounded-full border-2 flex items-center justify-center ${
                              selectedCoinTwo.name === coin.name
                                ? "border-[#4DF2BE] bg-[#4DF2BE]"
                                : "border-[#8F8F8F]"
                            }`}
                          >
                            {selectedCoinTwo.name === coin.name && (
                              <div className="w-[6px] h-[6px] rounded-full bg-[#0F1012]" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                <span className="bg-[#2D2D2D] text-[#FCFCFC] text-[12px] px-3 py-1 rounded-full">≈ $0</span>
                <div className="flex items-center space-x-2">
                  <span className="text-[14px] text-[#8F8F8F]">Balance:</span>
                  <span className="text-[14px] font-[500]">
                    {clientUser?.wallets?.find((w: any) => w?.currency === selectedCoinTwo.name)?.balance || 0}{" "}
                    {selectedCoinTwo.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#2D2D2D] border-l-4 border-[#FFC051] rounded-r-[12px] p-4 mt-6">
            <div className="flex items-start space-x-3">
              <Image src={I_icon} alt="" width={20} height={20} className="mt-1 flex-shrink-0" />
              <p className="text-[14px] text-[#DBDBDB]">
                The exchange rate includes all fees from Evolv2p and our hedging counterparty
              </p>
            </div>
          </div>

          <div className="bg-[#222222] rounded-[8px] p-4 mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center space-x-4">
                <div className="w-[28px] h-[28px] flex items-center justify-center">
                  {isRefreshing ? (
                    <div className="animate-spin w-6 h-6 rounded-full border-2 border-[#FFC051] border-t-transparent" />
                  ) : (
                    <Image
                      src={Rotate}
                      alt=""
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={handleRefresh}
                    />
                  )}
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-[16px] font-[500]">
                    <span className="text-[#DBDBDB]">1 {selectedCoin.name}</span>
                    <small className="text-[#8F8F8F]">=</small>
                    <span className="text-[#DBDBDB]">
                      {getExchangeRateText()} {selectedCoinTwo.name}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#8F8F8F] mt-1">
                    Refreshing in <span className="text-[#FFC051] font-[500]">{refreshCountdown} Seconds</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSwapModal(true)}
                disabled={!fromCoinValue || isSwapping}
                className="w-full sm:w-[120px] h-[44px] bg-[#4DF2BE] rounded-full text-[14px] font-[700] text-[#0F1012] hover:bg-[#3DD2A5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <h2 className="text-[16px] font-[700]">Confirm Swap</h2>
                  <Image
                    src={Times}
                    alt=""
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
                  <Image src={selectedCoin.icon} alt="" width={58} height={58} />
                  <Image src={selectedCoinTwo.icon} alt="" width={58} height={58} className="-ml-4" />
                </div>
                <div className="text-center mb-6">
                  <p className="text-[20px] font-[700]">
                    Confirm swap of {selectedCoin.name} to {selectedCoinTwo.name}
                  </p>
                </div>
                <div className="space-y-3 mb-6">
                  {[
                    { label: "You are swapping", value: `${fromCoinValue} ${selectedCoin.name}` },
                    { label: "Network Fee", value: `${feeInSource.toFixed(8)} ${selectedCoin.name} ≈ ${getNetworkFeeInTarget()} ${selectedCoinTwo.name} (${networkFeePercent}%)` },
                    { label: "You will receive (after fee)", value: `${convertedValue} ${selectedCoinTwo.name}` },
                    { label: "Total deducted from your wallet", value: `${fromCoinValue ? (Number(fromCoinValue) + feeInSource).toFixed(8) : "—"} ${selectedCoin.name}` },
                    { label: "Estimated Time", value: "< 2 minutes" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center text-[14px] text-[#DBDBDB] bg-[#222222] p-3 rounded-[6px]"
                    >
                      <span>{item.label}</span>
                      <span className="text-[#FCFCFC] font-[500]">{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={closeSwapModal}
                    className="flex-1 h-[48px] bg-[#2D2D2D] rounded-full text-white text-[14px] font-[700] hover:bg-[#3A3A3A] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSwapping}
                    onClick={handleSwap}
                    className="flex-1 h-[48px] bg-[#4DF2BE] rounded-full text-[14px] text-[#0F1012] font-[700] hover:bg-[#3DD2A5] transition-colors disabled:opacity-50"
                  >
                    {isSwapping ? "Swapping..." : "Confirm Swap"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-full h-[1px] bg-white opacity-20 my-8" />
        <div className="mb-[80px] whitespace-nowrap mt-[10%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Swap;