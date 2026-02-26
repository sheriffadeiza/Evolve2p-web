"use client";

import React, { useEffect, useState, useMemo, useCallback, lazy, Suspense } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Nav from "../../components/NAV/Nav";
import Parrow from "../../public/Assets/Evolve2p_pArrow/elements.svg";
import icon_i from "../../public/Assets/Evolve2p_i/Dashboard/elements.svg";
import SlashH from "../../public/Assets/Evolve2p_viewslash/view-off-slash.png";
import ViewIcon from "../../public/Assets/Evolve2p_viewslash/view-off-slash.png";
import Send from "../../public/Assets/Evolve2p_send/Dashboard/elements.svg";
import Barrow from "../../public/Assets/Evolve2p_Barrow/arrow-down-01.svg";
import Rarrowd from "../../public/Assets/Evolve2p_Rarrowd/arrow-down-right-01.svg";
import Swap from "../../public/Assets/Evolve2p_Swap/elements.svg";
import R_arrow from "../../public/Assets/Evolve2p_R/arrow-right-02.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import Eclipse from "../../public/Assets/Evolve2p_eclpise9/Ellipse 9.svg";
import Buy from "../../public/Assets/Evolve2p_Buy/elements.svg";
import Larrow from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Sell from "../../public/Assets/Evolve2p_Sell/elements.svg";
import Offer from "../../public/Assets/Evolve2p_Offer/elements.svg";
import Limit from "../../public/Assets/Evolve2p_Limit/elements.svg";
import Set from "../../public/Assets/Evolve2p_Set/elements.svg";
import Refer from "../../public/Assets/Evolve2p_Refer/elements.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import checklistInactive from "../../public/Assets/Evolve2p_checklist2/checklist-inactive.svg";
import Yellow_i from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import Copy from "../../public/Assets/Evolve2p_code/elements.svg";
import Share from "../../public/Assets/Evolve2p_share/elements.svg";
import DashboardTransactions from "@/app/dashboardTransaction/dashboardTrans";
import Footer from "../../components/Footer/Footer";

// Lazy load QRCode component
const QRCodeCanvas = lazy(() => import("qrcode.react").then(mod => ({ default: mod.QRCodeCanvas })));

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

interface Transaction {
  id: string;
  amount: string;
  currency: string;
  receiverAddress: string;
  networkFee: string;
  status: "Completed" | "Pending" | "Failed";
  date: string;
  usdValue: number;
}

const currencies: Currency[] = [
  { name: "USD", symbol: "$" },
  { name: "NGN", symbol: "₦" },
  { name: "BTC", symbol: "₿" },
  { name: "ETH", symbol: "Ξ" },
];

// Safe number parser – prevents NaN
const safeNumber = (value: any): number => {
  if (value === null || value === undefined) return 0;
  const num = Number(value);
  return isNaN(num) ? 0 : num;
};

// Crypto Price Service with fallback (no logs, user‑friendly errors)
const CryptoPriceService = {
  async getMultipleCryptoPrices(coinIds: string[], vsCurrencies: string[] = ['usd']) {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${coinIds.join(',')}&vs_currencies=${vsCurrencies.join(',')}`
      );
      if (!response.ok) throw new Error();
      return await response.json();
    } catch {
      // Fallback prices – safe, no logs
      return {
        bitcoin: { usd: 50000 },
        ethereum: { usd: 3000 },
        tether: { usd: 1 },
        'usd-coin': { usd: 1 }
      };
    }
  },

  async getUSDToNGNRate() {
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) throw new Error();
      const data = await response.json();
      return data.rates.NGN || 1500;
    } catch {
      return 1500;
    }
  }
};

const Dashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSendModal, setShowSendModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showTxDetails, setShowTxDetails] = useState(false);
  const [open, setOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [clientUser, setClientUser] = useState<any>(null);
  const [currentWallet, setCurrentWallet] = useState<Wallet | null>(null);
  const [currentCoin, setCurrentCoin] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [showAllBalances, setShowAllBalances] = useState(true);
  const [isTransOpen, setIsTransOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(currencies[0]);
  const [cryptoPrices, setCryptoPrices] = useState<any>({});
  const [usdToNgnRate, setUsdToNgnRate] = useState<number>(1500);
  const [loadingPrices, setLoadingPrices] = useState(true);
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [sendAmount, setSendAmount] = useState<string>("");
  const [networkFee] = useState<number>(0.00012);
  const [sendStep, setSendStep] = useState<"address" | "amount">("address");
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string>("");
  const [recentTransaction, setRecentTransaction] = useState<Transaction | null>(null);

  // ========== VERIFICATION CHECK ==========
  const requireVerification = useCallback((callback: () => void) => {
    if (!clientUser?.kycVerified) {
      setShowVerifyModal(true);
      return;
    }
    callback();
  }, [clientUser]);

  // ========== Memoized totals ==========
  const totalBalanceUSD = useMemo(() => {
    if (!clientUser?.wallets || !cryptoPrices) return 0;
    let total = 0;
    clientUser.wallets.forEach((wallet: Wallet) => {
      const balance = safeNumber(wallet.balance);
      switch (wallet.currency?.toUpperCase()) {
        case 'BTC':
          total += balance * safeNumber(cryptoPrices.bitcoin?.usd);
          break;
        case 'ETH':
          total += balance * safeNumber(cryptoPrices.ethereum?.usd);
          break;
        case 'USDT':
          total += balance * safeNumber(cryptoPrices.tether?.usd || 1);
          break;
        case 'USDC':
          total += balance * safeNumber(cryptoPrices['usd-coin']?.usd || 1);
          break;
        default:
          total += balance;
      }
    });
    return total;
  }, [clientUser, cryptoPrices]);

  const convertedBalance = useMemo(() => {
    if (totalBalanceUSD === 0) return "0.00";
    let converted = 0;
    switch (selectedCurrency.name) {
      case 'USD': converted = totalBalanceUSD; break;
      case 'NGN': converted = totalBalanceUSD * usdToNgnRate; break;
      case 'BTC': converted = totalBalanceUSD / safeNumber(cryptoPrices.bitcoin?.usd || 1); break;
      case 'ETH': converted = totalBalanceUSD / safeNumber(cryptoPrices.ethereum?.usd || 1); break;
    }
    return (selectedCurrency.name === 'BTC' || selectedCurrency.name === 'ETH')
      ? converted.toFixed(8)
      : converted.toFixed(2);
  }, [totalBalanceUSD, selectedCurrency, cryptoPrices, usdToNgnRate]);

  // ========== Price fetching ==========
  useEffect(() => {
    const fetchPrices = async () => {
      setLoadingPrices(true);
      const [cryptoData, ngnRate] = await Promise.all([
        CryptoPriceService.getMultipleCryptoPrices(['bitcoin', 'ethereum', 'tether', 'usd-coin']),
        CryptoPriceService.getUSDToNGNRate()
      ]);
      setCryptoPrices(cryptoData);
      setUsdToNgnRate(ngnRate);
      setLoadingPrices(false);
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 60000);
    return () => clearInterval(interval);
  }, []);

  // ========== Helper functions ==========
  const getAssetBalance = useCallback((symbol: string): string => {
    const wallet = clientUser?.wallets?.find((w: any) => w.currency?.toUpperCase() === symbol.toUpperCase());
    const balance = safeNumber(wallet?.balance);
    if (symbol === 'BTC' || symbol === 'ETH') {
      if (balance === 0) return "0.00";
      if (balance < 0.001) return balance.toFixed(8);
      if (balance < 1) return balance.toFixed(6);
      return balance.toFixed(4);
    }
    return balance.toFixed(2);
  }, [clientUser]);

  const getWalletBalanceUSD = useCallback((wallet: Wallet): number => {
    const balance = safeNumber(wallet.balance);
    switch (wallet.currency?.toUpperCase()) {
      case 'BTC': return balance * safeNumber(cryptoPrices.bitcoin?.usd);
      case 'ETH': return balance * safeNumber(cryptoPrices.ethereum?.usd);
      case 'USDT': return balance * safeNumber(cryptoPrices.tether?.usd || 1);
      case 'USDC': return balance * safeNumber(cryptoPrices['usd-coin']?.usd || 1);
      default: return balance;
    }
  }, [cryptoPrices]);

  const getCurrentPrice = useCallback((symbol: string): string => {
    switch (symbol.toLowerCase()) {
      case 'btc': return `1 USD = ${(1 / safeNumber(cryptoPrices.bitcoin?.usd || 1)).toFixed(8)} BTC`;
      case 'eth': return `1 USD = ${(1 / safeNumber(cryptoPrices.ethereum?.usd || 1)).toFixed(6)} ETH`;
      case 'usdt':
      case 'usdc': return `1 USD = 1.00 ${symbol}`;
      default: return "Loading...";
    }
  }, [cryptoPrices]);

  const formatShortAddress = useCallback((addr: string) => {
    if (!addr) return "";
    return addr.length > 12 ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 6)}` : addr;
  }, []);

  const getCurrencyIcon = useCallback((currency: string) => {
    switch (currency.toUpperCase()) {
      case 'BTC': return '₿';
      case 'ETH': return 'Ξ';
      case 'USDT':
      case 'USDC': return '$';
      default: return currency.charAt(0);
    }
  }, []);

  const getCurrencyColor = useCallback((currency: string) => {
    switch (currency.toUpperCase()) {
      case 'BTC': return 'bg-orange-500';
      case 'ETH': return 'bg-purple-500';
      case 'USDT': return 'bg-green-500';
      case 'USDC': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  }, []);

  const getAmountInUSD = useCallback(() => {
    if (!selectedAsset || !sendAmount) return 0;
    const amount = parseFloat(sendAmount);
    switch (selectedAsset.symbol) {
      case 'BTC': return amount * safeNumber(cryptoPrices.bitcoin?.usd || 50000);
      case 'ETH': return amount * safeNumber(cryptoPrices.ethereum?.usd || 3000);
      default: return amount; // USDT/USDC
    }
  }, [selectedAsset, sendAmount, cryptoPrices]);

  const getFeeInUSD = useCallback(() => {
    if (!selectedAsset) return 0;
    switch (selectedAsset.symbol) {
      case 'BTC': return networkFee * safeNumber(cryptoPrices.bitcoin?.usd || 50000);
      case 'ETH': return networkFee * safeNumber(cryptoPrices.ethereum?.usd || 3000);
      default: return networkFee;
    }
  }, [selectedAsset, networkFee, cryptoPrices]);

  // ========== User loading ==========
  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("UserData");
    if (!stored) {
      setError("Please login first");
      setTimeout(() => router.push("/Logins/login"), 1500);
      return;
    }
    try {
      const userData = JSON.parse(stored);
      setClientUser(userData?.userData || userData);
    } catch {
      setError("Invalid user data");
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Update current wallet when coin changes
  useEffect(() => {
    if (currentCoin && clientUser?.wallets) {
      const wallet = clientUser.wallets.find((w: Wallet) => w.currency?.toUpperCase() === currentCoin.toUpperCase());
      setCurrentWallet(wallet || null);
    }
  }, [currentCoin, clientUser]);

  // ========== Static data ==========
  const cryptoAssets = useMemo(() => [
    { symbol: "BTC", name: "Bitcoin", icon: BTC },
    { symbol: "ETH", name: "Ethereum", icon: ETH },
    { symbol: "USDC", name: "USDC", icon: USDC },
    { symbol: "USDT", name: "USDT", icon: USDT },
  ], []);

  // ========== Handlers ==========
  const toggleVerifyModal = useCallback(() => setShowVerifyModal(prev => !prev), []);
  const toggleReceiveDropdown = useCallback(() => setIsReceiveOpen(prev => !prev), []);
  const toggleVisibility = useCallback(() => {
    setShowBalance(prev => !prev);
    setShowAllBalances(prev => !prev);
  }, []);
  const toggleTransDropdown = useCallback(() => setIsTransOpen(prev => !prev), []);
  const closeReceiveModal = useCallback(() => setShowReceiveModal(false), []);
  const closeSendModal = useCallback(() => {
    setShowSendModal(false);
    setReceiverAddress("");
    setSendAmount("");
    setSendStep("address");
  }, []);
  const closeReviewModal = useCallback(() => setShowReviewModal(false), []);

  const handleSelect = useCallback((currency: Currency) => {
    setSelectedCurrency(currency);
    setIsTransOpen(false);
  }, []);

  const handleReceiveClick = useCallback((symbol: string) => {
    setCurrentCoin(symbol);
    setShowReceiveModal(true);
    setIsReceiveOpen(false);
  }, []);

  // Send dropdown click – requires verification to open
  const handleSendDropdownClick = useCallback(() => {
    if (!clientUser?.kycVerified) {
      setShowVerifyModal(true);
    } else {
      setOpen(prev => !prev);
    }
  }, [clientUser]);

  // Individual asset Send – requires verification
  const handleSendClick = useCallback((symbol: string) => {
    requireVerification(() => {
      const asset = cryptoAssets.find(a => a.symbol === symbol);
      setSelectedAsset(asset);
      setOpen(false);
      setSendStep("address");
      setReceiverAddress("");
      setSendAmount("");
      setShowSendModal(true);
    });
  }, [cryptoAssets, requireVerification]);

  // Swap – requires verification
  const handleSwapClick = useCallback((symbol?: string) => {
    requireVerification(() => {
      router.push(symbol ? `/swap?from=${symbol}` : "/swap");
    });
  }, [router, requireVerification]);

  const handleAddressContinue = useCallback(() => {
    if (receiverAddress.trim()) setSendStep("amount");
  }, [receiverAddress]);

  const handleAmountContinue = useCallback(() => {
    if (sendAmount.trim() && parseFloat(sendAmount) > 0) {
      setShowSendModal(false);
      setShowReviewModal(true);
    }
  }, [sendAmount]);

  const handleQuickAmount = useCallback((percentage: string) => {
    if (!selectedAsset) return;
    const wallet = clientUser?.wallets?.find((w: any) => w.currency?.toUpperCase() === selectedAsset.symbol.toUpperCase());
    const balance = safeNumber(wallet?.balance);
    let amount = 0;
    if (percentage === "Max" || percentage === "100%") amount = balance - networkFee;
    else if (percentage === "10%") amount = balance * 0.1;
    else if (percentage === "25%") amount = balance * 0.25;
    else if (percentage === "50%") amount = balance * 0.5;
    else if (percentage === "75%") amount = balance * 0.75;
    setSendAmount(amount > 0 ? amount.toFixed(8) : "0");
  }, [selectedAsset, clientUser, networkFee]);

  const handleCopyAddress = useCallback(() => {
    if (currentWallet?.address) {
      navigator.clipboard.writeText(currentWallet.address)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch(() => {});
    }
  }, [currentWallet]);

  const handleConfirmSend = useCallback(async () => {
    try {
      setIsSending(true);
      const stored = localStorage.getItem("UserData");
      if (!stored) throw new Error("Authentication required");
      const userData = JSON.parse(stored);
      const token = userData.accessToken || userData.token;
      if (!token) throw new Error("Authentication required");

      const amount = parseFloat(sendAmount);
      if (isNaN(amount) || amount <= 0) throw new Error("Invalid amount");

      const transactionData = {
        toAddress: receiverAddress.trim(),
        amount,
        coin: selectedAsset.symbol,
        userId: clientUser?._id || clientUser?.id,
        networkFee: networkFee.toString(),
      };

      const response = await fetch('https://evolve2p-backend.onrender.com/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(transactionData),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Transaction failed");

      const mockHash = result.transactionHash || `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
      setTransactionHash(mockHash);

      const newTransaction: Transaction = {
        id: result.transactionId || `txn_${mockHash.substring(2, 10).toUpperCase()}`,
        amount: `-${sendAmount} ${selectedAsset.symbol}`,
        currency: selectedAsset.symbol,
        receiverAddress,
        networkFee: `${networkFee.toFixed(8)} ${selectedAsset.symbol}`,
        status: "Completed",
        date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' }),
        usdValue: getAmountInUSD()
      };
      setRecentTransaction(newTransaction);

      // Update local wallet balance (optimistic)
      if (clientUser?.wallets) {
        const updatedWallets = clientUser.wallets.map((wallet: Wallet) => {
          if (wallet.currency?.toUpperCase() === selectedAsset.symbol.toUpperCase()) {
            const newBalance = safeNumber(wallet.balance) - amount - networkFee;
            return { ...wallet, balance: newBalance > 0 ? newBalance : 0 };
          }
          return wallet;
        });
        setClientUser({ ...clientUser, wallets: updatedWallets });
      }

      closeReviewModal();
      setTimeout(() => setSuccess(true), 300);
    } catch (err) {
      alert("Transaction failed. Please try again."); // user‑friendly, no details
    } finally {
      setIsSending(false);
    }
  }, [clientUser, selectedAsset, sendAmount, receiverAddress, networkFee, getAmountInUSD, closeReviewModal]);

  const todoItems = useMemo(() => [
    { icon: Buy, title: "Buy Crypto", description: "Start a new buy order", onClick: () => router.push("/market_place") },
    { icon: Sell, title: "Sell Crypto", description: "Start a new sell order", onClick: () => router.push("/market_place") },
    { icon: Offer, title: "Post an Offer", description: "Create your P2P offer", onClick: () => router.push("/market_place/post_ad") },
    { icon: Limit, title: "Increase Buy/Sell Limits", description: "Unlock higher trading limits by upgrading verification." },
    { icon: Set, title: "Set Up 2FA", description: "Secure your account with two-factor authentication.", onClick: () => router.push("/tfa") },
    { icon: Refer, title: "Refer & Earn", description: "Invite friends and earn rewards on every trade." },
  ], [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1012]">
        <p className="text-white text-lg">Loading...</p>
      </div>
    );
  }

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Nav />

        {/* Header */}
        <div className="flex space-x-2 text-lg sm:text-[20px] md:text-[24px] font-medium items-center mb-4 sm:mb-6">
          <p className="text-[#8F8F8F]">Hello</p>
          <p className="text-[#FCFCFC]">
            {clientUser?.username
              ? (clientUser.username.startsWith("@") ? clientUser.username : `@${clientUser.username}`)
              : "User"}
          </p>
        </div>

        {/* KYC Banner - only shown when not verified */}
        {!clientUser?.kycVerified && (
          <div className="flex flex-col sm:flex-row items-center bg-[#342827] w-full p-3 sm:p-4 mb-4 sm:mb-6 rounded-r-xl border-l-2 border-[#FE857D]">
            <Image src={icon_i} alt="info" width={20} height={20} className="w-5 h-5 sm:w-6 sm:h-6 mb-2 sm:mb-0" />
            <p className="text-xs sm:text-[14px] ml-0 sm:ml-4 font-medium text-[#FCFCFC] flex-1 text-center sm:text-left mb-3 sm:mb-0">
              Complete KYC and enjoy access to all features available on the app.
            </p>
            <button
              className="text-xs sm:text-[14px] px-3 py-1.5 sm:px-4 sm:py-2 text-[#4DF2BE] font-bold bg-[#2D2D2D] border border-[#222] rounded-full cursor-pointer whitespace-nowrap w-full sm:w-auto"
              onClick={toggleVerifyModal}
            >
              Complete KYC
            </button>
          </div>
        )}

        {/* Balance Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mt-6 md:mt-8">
          <div className="bg-[#222222] rounded-[12px] p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <p className="text-[14px] sm:text-[16px] font-[400] text-[#DBDBDB]">Available Balance</p>
              <div className="flex items-center cursor-pointer" onClick={toggleVisibility}>
                <Image src={showBalance ? SlashH : ViewIcon} alt={showBalance ? "hide" : "show"} width={20} height={20} className="w-5 h-5 sm:w-6 sm:h-6" />
                <span className="text-[12px] sm:text-[14px] ml-2 text-[#DBDBDB]">
                  {showBalance ? "Hide Balances" : "Show Balances"}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-[24px] sm:text-[28px] font-[700] text-[#FCFCFC]">{selectedCurrency.symbol}</span>
                <span className="text-[32px] sm:text-[36px] font-[700] text-[#FCFCFC]">
                  {showBalance ? convertedBalance : "****"}
                </span>
              </div>

              <div className="relative self-start sm:self-auto">
                <div className="flex items-center bg-[#2D2D2D] px-3 py-2 sm:px-4 sm:py-2 rounded-full cursor-pointer min-w-[90px] sm:min-w-[100px]" onClick={toggleTransDropdown}>
                  <p className="text-[12px] sm:text-[14px] font-[700] text-[#DBDBDB] mr-2">{selectedCurrency.name}</p>
                  <Image src={Parrow} alt="arrow" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                {isTransOpen && (
                  <div className="absolute top-full left-0 mt-2 w-full bg-[#222] rounded-[12px] shadow-lg z-50 border border-[#2D2D2D]">
                    {currencies.map((currency) => (
                      <div
                        key={currency.name}
                        onClick={() => handleSelect(currency)}
                        className={`flex justify-between items-center px-3 py-2 sm:px-4 sm:py-3 cursor-pointer hover:bg-[#2D2D2D] ${currency.name === selectedCurrency.name ? "bg-[#2D2D2D]" : ""}`}
                      >
                        <span className="text-[14px] sm:text-[16px] font-[500] text-[#FCFCFC]">{currency.name}</span>
                        <span className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 ${currency.name === selectedCurrency.name ? "border-[#4DF2BE] bg-[#4DF2BE]" : "border-[#5C5C5C]"}`} />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col xs:flex-row gap-3">
              {/* Send button with dropdown – requires verification */}
              <div className="relative">
                <button 
                  className="flex items-center justify-center bg-[#2D2D2D] text-[#4DF2BE] px-3 py-2 sm:px-4 sm:py-3 rounded-full font-[700] text-[12px] sm:text-[14px] gap-2 w-full xs:w-auto min-w-[110px] sm:min-w-[120px]" 
                  onClick={handleSendDropdownClick}
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
                        onClick={() => handleSendClick(asset.symbol)}
                      >
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <Image src={asset.icon} alt={asset.name} width={24} height={24} className="w-6 h-6 sm:w-7 sm:h-7" />
                          <span className="font-[400] text-[#FCFCFC] text-[12px] sm:text-[14px]">Send {asset.name}</span>
                        </div>
                        <Image src={Larrow} alt="arrow" width={20} height={20} className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Receive button – always available */}
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
                          <span className="font-[400] text-[#FCFCFC] text-[12px] sm:text-[14px]">Receive {asset.name}</span>
                        </div>
                        <Image src={Larrow} alt="arrow" width={20} height={20} className="w-4 h-4 sm:w-6 sm:h-6" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Swap button – requires verification */}
              <button 
                className="flex items-center justify-center bg-[#2D2D2D] text-[#4DF2BE] px-3 py-2 sm:px-4 sm:py-3 rounded-full font-[700] text-[12px] sm:text-[14px] gap-2 w-full xs:w-auto min-w-[110px] sm:min-w-[120px]" 
                onClick={() => handleSwapClick()}
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
              <p>{showAllBalances ? "$14,850,000 remaining" : "**** remaining"}</p>
              <p>Refreshes in 10 minutes</p>
            </div>
            <button 
              className="bg-[#2D2D2D] text-[#FCFCFC] px-4 py-2 sm:px-6 sm:py-2 rounded-full font-[700] text-[12px] sm:text-[14px] w-full xs:w-auto ml-auto block"
              onClick={() => requireVerification(() => alert('Increase limit flow'))}
            >
              Increase Limit
            </button>
          </div>
        </div>

        {/* My Assets + Todo List */}
        <div className="mt-8 md:mt-12">
          <div className="flex flex-col lg:flex-row lg:items-start gap-6">
            {/* My Assets */}
            <div className="lg:flex-1">
              <div className="flex justify-between items-center mb-4 md:mb-6">
                <p className="text-[14px] sm:text-[16px] font-[500] text-[#8F8F8F]">My Assets</p>
                <button className="flex items-center text-[12px] sm:text-[14px] font-[700] text-[#FCFCFC]">
                  See all
                  <Image src={R_arrow} alt="arrow" width={14} height={14} className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {cryptoAssets.map((asset) => {
                  const wallet = clientUser?.wallets?.find((w: any) => w.currency?.toUpperCase() === asset.symbol.toUpperCase());
                  const balance = safeNumber(wallet?.balance);
                  const usdValue = wallet ? getWalletBalanceUSD(wallet) : 0;

                  return (
                    <div key={asset.symbol} className="bg-[#222222] rounded-[12px] p-3 md:p-4">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
                        <div className="flex items-center space-x-3 md:space-x-4 flex-1">
                          <Image src={asset.icon} alt={asset.name} width={32} height={32} className="w-8 h-8 md:w-10 md:h-10" />
                          <div className="min-w-0 flex-1">
                            <p className="text-[14px] md:text-[16px] font-[700] text-[#FCFCFC] truncate">{asset.name}</p>
                            <p className="text-[12px] md:text-[14px] font-[400] text-[#8F8F8F] truncate">{getCurrentPrice(asset.symbol)}</p>
                          </div>
                        </div>

                        <div className="flex items-center md:space-x-8 flex-1 justify-start md:justify-center">
                          <div className="text-right md:text-center">
                            <p className="text-[12px] md:text-[14px] font-[500] text-[#FCFCFC]">
                              {showAllBalances ? (asset.symbol === 'BTC' || asset.symbol === 'ETH' ? balance.toFixed(8) : balance.toFixed(2)) : "****"}
                            </p>
                            <p className="text-[10px] md:text-[12px] font-[500] text-[#DBDBDB]">{asset.symbol}</p>
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
                          <button 
                            onClick={() => requireVerification(() => handleSendClick(asset.symbol))} 
                            className="bg-[#2D2D2D] text-[#DBDBDB] px-2 py-1 md:px-3 md:py-2 rounded-full text-[10px] md:text-[14px] font-[500] min-w-[70px] md:min-w-[85px] flex items-center justify-center"
                          >
                            <Image src={Send} alt="send" width={10} height={10} className="mr-1 md:mr-2 w-2 h-2 md:w-3 md:h-3" />
                            Send
                          </button>
                          <button 
                            onClick={() => handleReceiveClick(asset.symbol)} 
                            className="bg-[#2D2D2D] text-[#DBDBDB] px-2 py-1 md:px-3 md:py-2 rounded-full text-[10px] md:text-[14px] font-[500] min-w-[80px] md:min-w-[101px] flex items-center justify-center"
                          >
                            <Image src={Rarrowd} alt="receive" width={10} height={10} className="mr-1 md:mr-2 w-2 h-2 md:w-3 md:h-3" />
                            Receive
                          </button>
                          <button 
                            onClick={() => handleSwapClick(asset.symbol)} 
                            className="bg-[#2D2D2D] text-[#DBDBDB] px-2 py-1 md:px-3 md:py-2 rounded-full text-[10px] md:text-[14px] font-[500] min-w-[70px] md:min-w-[87px] flex items-center justify-center"
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

            {/* Todo List */}
            <div className="lg:w-96">
              <div className="flex justify-between items-center mb-4">
                <p className="text-[14px] sm:text-[16px] font-[500] text-[#8F8F8F]">Todo list</p>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:gap-3">
                {todoItems.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-[#222222] rounded-lg p-2 sm:p-3 flex items-center gap-2 sm:gap-3 cursor-pointer hover:bg-[#2A2A2A] transition-colors" 
                    onClick={item.onClick}
                  >
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                      <Image src={Eclipse} alt="bg" width={32} height={32} className="w-8 h-8 sm:w-10 sm:h-10" />
                      <Image src={item.icon} alt={item.title} width={16} height={16} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-[14px] font-medium text-[#FCFCFC] truncate">{item.title}</p>
                      <p className="text-[10px] sm:text-[12px] text-[#DBDBDB] line-clamp-2">{item.description}</p>
                    </div>
                    <Image src={Larrow} alt="arrow" width={12} height={12} className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Section */}
        <div className="mt-6 sm:mt-8">
          <DashboardTransactions />
        </div>

        <div className="w-[100%] h-[1px] mt-[30%] bg-[#fff] opacity-20 my-8"></div>
        <div className="mb-[80px] mt-[20%] whitespace-nowrap">
          <Footer />
        </div>
      </div>

      {/* SEND MODAL - STEP 1: Address */}
      {showSendModal && selectedAsset && sendStep === "address" && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-end sm:items-center z-[999] p-3">
          <div className="bg-[#0F1012] rounded-xl w-full max-w-md p-5 sm:p-6 shadow-xl border border-[#2D2D2D]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-lg">Send {selectedAsset.name}</h2>
              <button onClick={closeSendModal} className="text-gray-300 hover:text-white text-xl">✕</button>
            </div>
            <div className="bg-[#1A1B1E] p-4 rounded-lg flex justify-between items-center mb-4 border border-[#2A2B2F]">
              <div className="flex items-center gap-2">
                <Image src={selectedAsset.icon} width={24} height={24} alt="icon" />
                <div>
                  <p className="text-gray-300 text-sm">Wallet Balance</p>
                  <p className="text-white font-semibold text-sm">{getAssetBalance(selectedAsset.symbol)} {selectedAsset.symbol}</p>
                </div>
              </div>
              <Image src={Barrow} alt="down" width={20} height={20} />
            </div>
            <input className="w-full bg-[#1A1B1E] p-4 rounded-lg text-white text-sm border border-[#2A2B2F] mb-4" placeholder="Name or Address" value={receiverAddress} onChange={(e) => setReceiverAddress(e.target.value)} />
            <div className="bg-[#1A1B1E] p-4 rounded-lg border border-[#4DF2BE]/30 text-xs text-gray-300 mb-6">
              Only send {selectedAsset.symbol} to a {selectedAsset.symbol}-compatible wallet address. Using the wrong address may lead to permanent loss.
            </div>
            <button onClick={handleAddressContinue} disabled={!receiverAddress.trim()} className={`w-full font-bold text-sm py-3 rounded-lg ${receiverAddress.trim() ? "bg-[#4DF2BE] text-black cursor-pointer" : "bg-[#2D2D2D] text-gray-500 cursor-not-allowed"}`}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* SEND MODAL - STEP 2: Amount */}
      {showSendModal && selectedAsset && sendStep === "amount" && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm flex justify-center items-end sm:items-center z-[999] p-3">
          <div className="bg-[#0F1012] rounded-xl w-full max-w-md p-5 sm:p-6 shadow-xl border border-[#2D2D2D]">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-lg">Send {selectedAsset.name}</h2>
              <button onClick={closeSendModal} className="text-gray-300 hover:text-white text-xl">✕</button>
            </div>
            <div className="bg-[#1A1B1E] rounded-xl p-4 mb-4 shadow-md">
              <div className="flex items-center gap-2">
                <Image src={selectedAsset.icon} width={32} height={32} alt="coin" />
                <div>
                  <p className="text-sm font-medium">{selectedAsset.name}</p>
                  <p className="text-xs text-gray-400">{getAssetBalance(selectedAsset.symbol)} {selectedAsset.symbol}</p>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">To:</p>
                <div className="bg-[#141518] rounded-lg px-3 py-2 flex justify-between items-center mt-1">
                  <span className="text-sm truncate">{receiverAddress}</span>
                  <button onClick={() => setSendStep("address")} className="text-xs text-green-400 whitespace-nowrap ml-2">Edit</button>
                </div>
              </div>
            </div>
            <div className="bg-[#1A1B1E] rounded-xl p-4 mt-2 shadow-md">
              <p className="text-gray-400 text-sm">You are sending</p>
              <input type="text" placeholder={`0 ${selectedAsset.symbol}`} value={sendAmount} onChange={(e) => setSendAmount(e.target.value)} className="bg-transparent border-none text-3xl outline-none w-full mt-2 font-semibold text-white" />
              <div className="flex gap-2 mt-4 flex-wrap">
                {["10%", "25%", "50%", "75%", "100%", "Max"].map((x) => (
                  <button key={x} onClick={() => handleQuickAmount(x)} className="px-3 py-1 bg-[#141518] rounded-full text-sm text-gray-300 hover:bg-[#2D2D2D]">{x}</button>
                ))}
              </div>
            </div>
            <button onClick={handleAmountContinue} disabled={!sendAmount.trim() || parseFloat(sendAmount) <= 0} className={`w-full font-bold text-sm py-3 rounded-lg mt-6 ${sendAmount.trim() && parseFloat(sendAmount) > 0 ? "bg-[#4DF2BE] text-black cursor-pointer" : "bg-[#2D2D2D] text-gray-500 cursor-not-allowed"}`}>
              Continue
            </button>
          </div>
        </div>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-end md:justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeReviewModal} />
          <div className="relative w-full max-w-md bg-gradient-to-b from-[#111215] to-[#0A0B0D] rounded-2xl border border-[#2A2B2E] max-h-[85vh] overflow-y-auto shadow-2xl shadow-black/40 transform transition-all duration-300 ease-out md:animate-slideInCenter">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-[#4DF2BE] to-transparent rounded-b-full" />
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-[#4DF2BE]/30 rounded-tl-2xl" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-[#4DF2BE]/30 rounded-tr-2xl" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-[#4DF2BE]/30 rounded-bl-2xl" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-[#4DF2BE]/30 rounded-br-2xl" />
            <button onClick={closeReviewModal} className="absolute right-4 top-4 text-gray-400 hover:text-white z-10 bg-[#1A1B1E] p-1.5 rounded-full">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <div className="p-6 border-b border-[#1F1F1F]">
              <h2 className="text-center text-xl font-semibold text-white">Review Transaction</h2>
            </div>
            <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#1A1B1E] to-[#2D2D2D] flex items-center justify-center border border-[#3A3A3A]">
                  <Image src={selectedAsset.icon} alt={selectedAsset.name} width={40} height={40} className="w-10 h-10" />
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">{sendAmount} {selectedAsset.symbol}</p>
                  <p className="text-sm text-gray-400 mt-1">≈ ${getAmountInUSD().toFixed(2)}</p>
                </div>
              </div>
              <div className="bg-[#1A1B1E] rounded-xl overflow-hidden border border-[#2A2A2A]">
                <div className="p-4 border-b border-[#2A2A2A]">
                  <p className="text-sm text-gray-400 mb-1">From</p>
                  <p className="text-white font-medium">Your Wallet</p>
                </div>
                <div className="p-4 border-b border-[#2A2A2A]">
                  <p className="text-sm text-gray-400 mb-1">To</p>
                  <p className="text-white font-medium break-all">{receiverAddress.substring(0, 16)}...{receiverAddress.substring(receiverAddress.length - 8)}</p>
                </div>
                <div className="p-4 border-b border-[#2A2A2A]">
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-400">Amount</span><span className="text-white font-semibold">{sendAmount} {selectedAsset.symbol}</span></div>
                </div>
                <div className="p-4 border-b border-[#2A2A2A]">
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-400">Network Fee</span><span className="text-white font-semibold">{networkFee.toFixed(8)} {selectedAsset.symbol}</span></div>
                  <p className="text-xs text-gray-500 mt-1 text-right">≈ ${getFeeInUSD().toFixed(2)}</p>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-center"><span className="text-sm text-gray-400">Total</span><span className="text-lg font-bold text-white">{(parseFloat(sendAmount) + networkFee).toFixed(8)} {selectedAsset.symbol}</span></div>
                  <p className="text-xs text-gray-500 mt-1 text-right">≈ ${(getAmountInUSD() + getFeeInUSD()).toFixed(2)}</p>
                </div>
              </div>
              <div className="bg-[#1A1B1E]/50 border border-[#2A2B2F] rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                  <p className="text-xs text-gray-300">Please review all details carefully. Once confirmed, this transaction cannot be reversed.</p>
                </div>
              </div>
            </div>
            <div className="p-6 pt-4 border-t border-[#1F1F1F]">
              <button onClick={closeReviewModal} className="w-full bg-[#2D2D2D] text-white py-3 rounded-lg font-semibold mb-3 hover:bg-[#3A3A3A] transition-colors">Cancel</button>
              <button onClick={handleConfirmSend} disabled={isSending} className={`w-full ${isSending ? "bg-[#2D2D2D] cursor-not-allowed" : "bg-gradient-to-r from-[#4DF2BE] to-[#3DD8A5] hover:from-[#3DD8A5] hover:to-[#4DF2BE]"} text-[#0F1012] py-3 rounded-lg font-bold transition-all duration-300 flex items-center justify-center`}>
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Processing...
                  </>
                ) : "Confirm & Send"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS MODAL */}
      {success && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-4">
          <div className="relative w-full max-w-sm bg-gradient-to-b from-[#111214] to-[#0A0B0D] rounded-2xl p-6 text-center animate-scaleIn border border-[#2A2B2E] shadow-2xl shadow-black/40">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="absolute inset-0 w-14 h-14 rounded-full bg-[#4DF2BE] animate-ping opacity-20"></div>
                <div className="relative w-14 h-14 rounded-full bg-gradient-to-br from-[#4DF2BE] to-[#3DD8A5] flex items-center justify-center shadow-lg">
                  <svg className="w-6 h-6 text-[#0F1012]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
              </div>
            </div>
            <h2 className="text-lg font-bold mb-2 text-white">Sent Successfully!</h2>
            <p className="text-sm text-gray-400 mb-6">
              {sendAmount} {selectedAsset?.symbol} was successfully sent to <br />
              <span className="break-all text-gray-300 font-medium mt-1 inline-block">{receiverAddress.substring(0, 12)}...{receiverAddress.substring(receiverAddress.length - 8)}</span>
            </p>
            {transactionHash && (
              <div className="mb-4 p-3 bg-[#1A1B1E] rounded-lg border border-[#2A2B2E]">
                <p className="text-xs text-gray-400 mb-1">Transaction Hash</p>
                <p className="text-xs text-[#4DF2BE] font-mono break-all">{transactionHash.substring(0, 16)}...{transactionHash.substring(transactionHash.length - 16)}</p>
              </div>
            )}
            <div className="space-y-3">
              <button onClick={() => { setSuccess(false); setShowTxDetails(true); }} className="w-full bg-gradient-to-r from-[#2D2D2D] to-[#3A3A3A] text-[#4DF2BE] font-medium py-3 rounded-lg hover:from-[#3A3A3A] hover:to-[#2D2D2D] transition-all duration-300">View Transaction Details</button>
              <button onClick={() => setSuccess(false)} className="w-full bg-[#1A1B1E] py-3 rounded-lg text-sm hover:bg-[#2A2B2E] transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* TX DETAILS MODAL */}
      {showTxDetails && recentTransaction && (
        <div className="fixed inset-0 z-[70] bg-black/70 flex justify-center px-4">
          <div className="w-full max-w-sm bg-[#0F1012] rounded-t-2xl mt-auto animate-slideUp">
            <div className="flex items-center justify-between p-4 border-b border-[#2A2B2F]">
              <button onClick={() => setShowTxDetails(false)} className="text-gray-400">←</button>
              <h2 className="text-sm font-semibold">Transaction Details</h2>
              <div className="w-4" />
            </div>
            <div className="p-4 space-y-4">
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto mb-2 rounded-full ${getCurrencyColor(recentTransaction.currency)} flex items-center justify-center text-white font-bold`}>
                  {getCurrencyIcon(recentTransaction.currency)}
                </div>
                <p className="text-lg font-semibold">{recentTransaction.amount}</p>
                <p className="text-sm text-gray-400">≈ ${recentTransaction.usdValue.toFixed(2)}</p>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between bg-[#1A1B1E] p-3 rounded-lg"><span className="text-gray-400">Transaction ID</span><span className="text-white">{recentTransaction.id}</span></div>
                <div className="flex justify-between bg-[#1A1B1E] p-3 rounded-lg"><span className="text-gray-400">From</span><span className="text-white">{clientUser?.username || "You"} ({formatShortAddress(currentWallet?.address || "")})</span></div>
                <div className="flex justify-between bg-[#1A1B1E] p-3 rounded-lg"><span className="text-gray-400">To</span><span className="text-white">{formatShortAddress(recentTransaction.receiverAddress)}</span></div>
                <div className="flex justify-between bg-[#1A1B1E] p-3 rounded-lg"><span className="text-gray-400">Network</span><span className="text-white">{recentTransaction.currency} Network</span></div>
                <div className="flex justify-between bg-[#1A1B1E] p-3 rounded-lg"><span className="text-gray-400">Network Fee</span><span className="text-white">{recentTransaction.networkFee}</span></div>
                <div className="flex justify-between bg-[#1A1B1E] p-3 rounded-lg"><span className="text-gray-400">Status</span><span className="text-[#4DF2BE] font-medium">{recentTransaction.status}</span></div>
                <div className="flex justify-between bg-[#1A1B1E] p-3 rounded-lg"><span className="text-gray-400">Date</span><span className="text-white">{recentTransaction.date}</span></div>
              </div>
              <div className="flex gap-2 bg-[#1A1B1E] border-l-4 border-yellow-400 p-3 rounded-lg text-xs text-gray-300">
                <span>⚠</span><p>Transactions are irreversible once confirmed.</p>
              </div>
              <button onClick={() => navigator.clipboard.writeText(transactionHash || recentTransaction.id).then(() => alert('Transaction ID copied!'))} className="w-full bg-[#1A1B1E] py-3 rounded-full text-sm hover:bg-[#2A2B2E] transition-colors">
                Copy Transaction ID
              </button>
              <button onClick={() => setShowTxDetails(false)} className="w-full text-sm text-gray-400 py-2 hover:text-white transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* RECEIVE MODAL */}
      {showReceiveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1012] rounded-[20px] max-w-md w-full max-h-[85vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <h2 className="text-[14px] sm:text-[16px] font-[700] text-[#FCFCFC]">Receive {currentCoin}</h2>
                <Image src={Times} alt="close" width={28} height={28} className="cursor-pointer w-7 h-7 sm:w-8 sm:h-8" onClick={closeReceiveModal} />
              </div>
              <div className="mb-4 sm:mb-6">
                <p className="text-[16px] sm:text-[18px] font-[700] text-[#FCFCFC] mb-2">Your {currentCoin} Address</p>
                <p className="text-[12px] sm:text-[14px] font-[400] text-[#DBDBDB]">Use this address to deposit <strong>{currentCoin}</strong> to your Evolve2p wallet.</p>
              </div>
              <div className="flex justify-center mb-4 sm:mb-6">
                <Suspense fallback={<div className="w-[180px] h-[180px] bg-[#2D2D2D] rounded" />}>
                  <QRCodeCanvas value={currentWallet?.address || ""} size={180} bgColor="#3A3A3A" fgColor="#FFFFFF" level="H" includeMargin />
                </Suspense>
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
                  <strong className="text-[12px] sm:text-[14px] font-[500] text-[#FCFCFC]">{new Date().toLocaleString()}</strong>
                </div>
              </div>
              <div className="bg-[#2D2D2D] border-l-4 border-[#FFC051] p-3 sm:p-4 mb-4 sm:mb-6">
                <div className="flex space-x-2 sm:space-x-3">
                  <Image src={Yellow_i} alt="info" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] sm:text-[14px] font-[400] text-[#DBDBDB]">
                    Make sure to only send {currentCoin} through the selected network: {currentCoin === "USDC" ? "BSC" : currentCoin === "USDT" ? "TRON" : currentCoin}. Sending incompatible cryptocurrencies or sending through a different network may result in irreversible loss.
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-3 sm:space-y-0">
                <button onClick={handleCopyAddress} className="flex-1 bg-[#2D2D2D] text-[#FCFCFC] py-2 sm:py-3 rounded-full font-[700] text-[12px] sm:text-[14px] flex items-center justify-center hover:bg-[#3A3A3A]">
                  {copied ? "Copied!" : (currentWallet?.address ? `${currentWallet.address.substring(0, 6)}...${currentWallet.address.substring(currentWallet.address.length - 4)}` : "Generating address...")}
                  <Image src={Copy} alt="copy" width={14} height={14} className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </button>
                <button className="flex-1 bg-[#2D2D2D] text-[#4DF2BE] py-2 sm:py-3 rounded-full font-[700] text-[12px] sm:text-[14px] flex items-center justify-center hover:bg-[#3A3A3A]">
                  Share
                  <Image src={Share} alt="share" width={14} height={14} className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VERIFICATION MODAL */}
      {showVerifyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#0F1012] rounded-xl p-4 sm:p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h2 className="text-sm sm:text-[16px] font-bold text-[#FCFCFC]">Complete Your Verification First</h2>
              <Image src={Times} alt="close" width={28} height={28} className="cursor-pointer w-7 h-7 sm:w-8 sm:h-8" onClick={toggleVerifyModal} />
            </div>
            <p className="text-[#DBDBDB] text-xs sm:text-[14px] mb-3 sm:mb-4">
              To perform this action, you need to verify your identity. This helps keep Evolve2p secure for everyone and aligns with global compliance regulations.
            </p>
            <ul className="text-xs sm:text-[14px] text-[#DBDBDB] mb-3 sm:mb-4 space-y-2">
              <li className="flex items-center gap-2"><Image src={checklistInactive} alt="checklist" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" /> Generate wallet address</li>
              <li className="flex items-center gap-2"><Image src={checklistInactive} alt="checklist" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" /> Access Buy/Sell offers</li>
              <li className="flex items-center gap-2"><Image src={checklistInactive} alt="checklist" width={14} height={14} className="w-3 h-3 sm:w-4 sm:h-4" /> Send and receive crypto safely</li>
            </ul>
            <button onClick={() => router.push("/Signups/KYC")} className="w-full bg-[#4DF2BE] text-[#0F1012] py-2 sm:py-3 rounded-full font-bold text-xs sm:text-[14px] mt-3 sm:mt-4">
              Verify My Account
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes slideInCenter { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
        @keyframes slideInRight { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @media (max-width: 768px) { .md\\:animate-slideInCenter { animation: slideInRight 0.3s ease-out; } }
        @media (min-width: 769px) { .md\\:animate-slideInCenter { animation: slideInCenter 0.3s ease-out; } }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
        .animate-slideUp { animation: slideUp 0.3s ease-out; }
      `}</style>
    </main>
  );
};

export default Dashboard;