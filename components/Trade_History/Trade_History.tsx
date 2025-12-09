"use client";

import React, { useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import Footer from "../../components/Footer/Footer";
import Image from "next/image";

import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import G19 from "../../public/Assets/Evolve2p_group19/Group 19.svg";

interface Trade {
  id: string;
  tradeId?: string;
  _id?: string;
  type?: "buy" | "sell";
  sellerId?: string;
  seller?: any;
  buyerId?: string;
  buyer?: any;
  amountCrypto?: number;
  amountFiat?: number;
  price?: number;
  cryptoAmount?: number;
  fiatAmount?: number;
  currency?: string;
  cryptoCurrency?: string;
  fiatCurrency?: string;
  status: string;
  paymentMethod?: string;
  counterpart?: string;
  offerId?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  paidAt?: string;
  expiresAt?: string;
  tradePrice?: number;
  offer?: any;
  [key: string]: any;
}

interface UserData {
  userData?: {
    id?: string;
    email?: string;
    phone?: string;
    username?: string;
    country?: string;
    name?: string;
    kycVerified?: boolean;
    emailVerified?: boolean;
    preferedCurrency?: string;
    DOB?: string;
    is2faEnabled?: boolean;
    authType?: string | null;
    pushToken?: string;
    role?: string;
    createdAt?: string;
    status?: string;
    wallets?: any[];
    transactions?: any[];
    swaps?: any[];
    trades?: Trade[];
    tradesAsSeller?: Trade[];
    tradesAsBuyer?: Trade[];
    notifications?: any[];
    trustedBy?: any[];
    [key: string]: any;
  };
  accessToken?: string;
  email?: string;
  username?: string;
  phone?: string;
  verified?: boolean;
  country?: {
    name: string;
    code: string;
    dial_code: string;
  };
  dayOfBirth?: string;
  [key: string]: any;
}

const getTradeIcon = (cryptoCurrency: string = ''): any => {
  if (!cryptoCurrency) return null;
  if (cryptoCurrency.includes("BTC") || cryptoCurrency.includes("Bitcoin")) return BTC;
  if (cryptoCurrency.includes("ETH") || cryptoCurrency.includes("Ethereum")) return ETH;
  if (cryptoCurrency.includes("USDC")) return USDC;
  if (cryptoCurrency.includes("USDT")) return USDT;
  return null;
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown Date";
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (error) {
    return "Unknown Date";
  }
};

const formatAmount = (amount: number | undefined, currency: string = 'USD'): string => {
  if (amount === undefined || amount === null) return "Unknown";
  
  if (currency === 'BTC' || currency === 'ETH') {
    return `${amount.toFixed(6)} ${currency}`;
  }
  if (currency === 'USD' || currency === 'USDT' || currency === 'USDC') {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount} ${currency}`;
};

const getStatusDisplay = (status: string) => {
  const statusUpper = status?.toUpperCase() || '';
  
  if (statusUpper.includes('COMPLETE') || statusUpper === 'COMPLETED') {
    return {
      text: 'Completed',
      bgColor: 'bg-[#4DF2BE33]',
      textColor: 'text-[#4DF2BE]'
    };
  }
  
  if (statusUpper.includes('PAID')) {
    return {
      text: 'Paid',
      bgColor: 'bg-[#10B98133]',
      textColor: 'text-[#10B981]'
    };
  }
  
  if (statusUpper.includes('PENDING')) {
    return {
      text: 'Pending',
      bgColor: 'bg-[#F59E0B33]',
      textColor: 'text-[#F59E0B]'
    };
  }
  
  if (statusUpper.includes('PROCESSING') || statusUpper.includes('IN_PROGRESS')) {
    return {
      text: 'Processing',
      bgColor: 'bg-[#3B82F633]',
      textColor: 'text-[#3B82F6]'
    };
  }
  
  if (statusUpper.includes('ESCROW') || statusUpper.includes('IN_ESCROW')) {
    return {
      text: 'In Escrow',
      bgColor: 'bg-[#392D46]',
      textColor: 'text-[#CCA0FA]'
    };
  }
  
  if (statusUpper.includes('DISPUTE') || statusUpper === 'DISPUTED') {
    return {
      text: 'In Dispute',
      bgColor: 'bg-[#342827]',
      textColor: 'text-[#FE857D]'
    };
  }
  
  if (statusUpper.includes('AWAITING') || statusUpper.includes('RELEASE')) {
    return {
      text: 'Awaiting Release',
      bgColor: 'bg-[#10B98133]',
      textColor: 'text-[#10B981]'
    };
  }
  
  if (statusUpper.includes('CANCEL') || statusUpper === 'CANCELLED') {
    return {
      text: 'Canceled',
      bgColor: 'bg-[#EF444433]',
      textColor: 'text-[#EF4444]'
    };
  }
  
  if (statusUpper.includes('EXPIRED') || statusUpper === 'EXPIRED') {
    return {
      text: 'Expired',
      bgColor: 'bg-[#6B728033]',
      textColor: 'text-[#D1D5DB]'
    };
  }
  
  return {
    text: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown',
    bgColor: 'bg-[#6B728033]',
    textColor: 'text-[#D1D5DB]'
  };
};

const isTradeCompleted = (status: string): boolean => {
  const statusUpper = status?.toUpperCase() || '';
  return (
    statusUpper.includes('COMPLETE') ||
    statusUpper === 'COMPLETED' ||
    statusUpper === 'FINISHED' ||
    statusUpper === 'DONE' ||
    statusUpper === 'RELEASED' ||
    statusUpper === 'SETTLED'
  );
};

const Trade_History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [activeTrades, setActiveTrades] = useState<Trade[]>([]);
  const [completedTrades, setCompletedTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const loadUserData = () => {
      try {
        console.log("🔍 Loading UserData from localStorage...");
        
        const userDataRaw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
        if (!userDataRaw) {
          console.log("❌ No UserData found in localStorage");
          setLoading(false);
          return;
        }

        let parsedData: UserData;
        try {
          parsedData = JSON.parse(userDataRaw);
        } catch (e) {
          console.error("❌ Invalid JSON in UserData", e);
          setLoading(false);
          return;
        }

        console.log("📊 Parsed UserData:", parsedData);
        setUserData(parsedData);
        
        if (!parsedData.userData) {
          console.log("❌ No userData object found in parsed data");
          setLoading(false);
          return;
        }

        const userDataObj = parsedData.userData;
        const currentUserId = userDataObj.id;
        console.log("👤 Current User ID:", currentUserId);
        
        let allTrades: Trade[] = [];
        
        if (Array.isArray(userDataObj.tradesAsBuyer)) {
          console.log(`✅ Found ${userDataObj.tradesAsBuyer.length} trades in 'tradesAsBuyer' array`);
          allTrades = [...allTrades, ...userDataObj.tradesAsBuyer];
        }
        
        if (Array.isArray(userDataObj.tradesAsSeller)) {
          console.log(`✅ Found ${userDataObj.tradesAsSeller.length} trades in 'tradesAsSeller' array`);
          allTrades = [...allTrades, ...userDataObj.tradesAsSeller];
        }
        
        if (Array.isArray(userDataObj.trades) && allTrades.length === 0) {
          console.log(`ℹ️ Using fallback 'trades' array with ${userDataObj.trades.length} trades`);
          allTrades = [...allTrades, ...userDataObj.trades];
        }
        
        console.log("📈 Total trades loaded:", allTrades.length);
        
        const active: Trade[] = [];
        const completed: Trade[] = [];
        
        allTrades.forEach((trade) => {
          const status = trade.status || 'pending';
          if (isTradeCompleted(status)) {
            completed.push(trade);
          } else {
            active.push(trade);
          }
        });
        
        active.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        completed.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        setActiveTrades(active);
        setCompletedTrades(completed);
        setLoading(false);
        
      } catch (err) {
        console.error("❌ Error loading UserData", err);
        setLoading(false);
      }
    };

    loadUserData();
    
    const handleFocus = () => loadUserData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleViewTrade = (trade: Trade) => {
    const tradeId = trade.id || trade.tradeId || trade._id;
    if (!tradeId) {
      alert("No trade ID found");
      return;
    }
    
    const userId = userData?.userData?.id;
    let userRole = '';
    
    if (trade.buyerId === userId) {
      userRole = 'buyer';
    } else if (trade.sellerId === userId) {
      userRole = 'seller';
    } else if (trade.buyer?.id === userId) {
      userRole = 'buyer';
    } else if (trade.seller?.id === userId) {
      userRole = 'seller';
    }
    
    if (userRole === 'buyer') {
      window.location.href = `/prc_buy?tradeId=${tradeId}`;
    } else if (userRole === 'seller') {
      window.location.href = `/prc_sell?tradeId=${tradeId}`;
    } else {
      const isBuyerTrade = userData?.userData?.tradesAsBuyer?.some(t => t.id === tradeId);
      const isSellerTrade = userData?.userData?.tradesAsSeller?.some(t => t.id === tradeId);
      
      if (isBuyerTrade) {
        window.location.href = `/prc_buy?tradeId=${tradeId}`;
      } else if (isSellerTrade) {
        window.location.href = `/prc_sell?tradeId=${tradeId}`;
      } else {
        window.location.href = `/prc_buy?tradeId=${tradeId}`;
      }
    }
  };

  const getTradeType = (trade: Trade, userId?: string): string => {
    if (!trade || !userId) return "Trade";
    
    if (trade.buyerId === userId || trade.buyer?.id === userId) {
      return "Buy";
    } else if (trade.sellerId === userId || trade.seller?.id === userId) {
      return "Sell";
    }
    return "Trade";
  };

  const getCryptoCurrency = (trade: Trade): string => {
    if (!trade) return 'BTC';
    if (typeof trade.cryptoCurrency === 'string') return trade.cryptoCurrency;
    if (trade.offer?.crypto && typeof trade.offer.crypto === 'string') return trade.offer.crypto;
    return 'BTC';
  };

  const getFiatCurrency = (trade: Trade): string => {
    if (!trade) return 'USD';
    if (typeof trade.fiatCurrency === 'string') return trade.fiatCurrency;
    if (trade.offer?.currency && typeof trade.offer.currency === 'string') return trade.offer.currency;
    return 'USD';
  };

  const getPaymentMethod = (trade: Trade): string => {
    if (!trade) return 'Bank Transfer';
    if (typeof trade.paymentMethod === 'string') return trade.paymentMethod;
    if (trade.offer?.paymentMethod && typeof trade.offer.paymentMethod === 'string') return trade.offer.paymentMethod;
    return 'Bank Transfer';
  };

  const getCounterpartName = (trade: Trade, userId?: string): string => {
    if (!trade || !userId) return 'Unknown User';
    
    const isBuyer = trade.buyerId === userId || trade.buyer?.id === userId;
    const isSeller = trade.sellerId === userId || trade.seller?.id === userId;
    
    if (isBuyer) {
      // User is buyer, counterpart is seller
      const seller = trade.seller;
      if (!seller) {
        return trade.sellerId ? `Seller ${trade.sellerId.substring(0, 6)}` : 'Unknown Seller';
      }
      
      if (typeof seller === 'string') return seller;
      if (typeof seller === 'object') {
        if (typeof seller.name === 'string') return seller.name;
        if (typeof seller.username === 'string') return seller.username;
        if (seller.id && typeof seller.id === 'string') return `Seller ${seller.id.substring(0, 6)}`;
      }
      return 'Unknown Seller';
    } else if (isSeller) {
      // User is seller, counterpart is buyer
      const buyer = trade.buyer;
      if (!buyer) {
        return trade.buyerId ? `Buyer ${trade.buyerId.substring(0, 6)}` : 'Unknown Buyer';
      }
      
      if (typeof buyer === 'string') return buyer;
      if (typeof buyer === 'object') {
        if (typeof buyer.name === 'string') return buyer.name;
        if (typeof buyer.username === 'string') return buyer.username;
        if (buyer.id && typeof buyer.id === 'string') return `Buyer ${buyer.id.substring(0, 6)}`;
      }
      return 'Unknown Buyer';
    }
    
    return 'Unknown User';
  };

  const getYouPay = (trade: Trade, userId?: string): string => {
    if (!trade || !userId) return "Unknown";
    
    const isBuyer = trade.buyerId === userId || trade.buyer?.id === userId;
    
    if (isBuyer) {
      const amount = trade.amountFiat || trade.fiatAmount || trade.price || 0;
      const currency = getFiatCurrency(trade);
      return formatAmount(amount, currency);
    } else {
      const amount = trade.amountCrypto || trade.cryptoAmount || trade.amount || 0;
      const currency = getCryptoCurrency(trade);
      return formatAmount(amount, currency);
    }
  };

  const getYouReceive = (trade: Trade, userId?: string): string => {
    if (!trade || !userId) return "Unknown";
    
    const isBuyer = trade.buyerId === userId || trade.buyer?.id === userId;
    
    if (isBuyer) {
      const amount = trade.amountCrypto || trade.cryptoAmount || trade.amount || 0;
      const currency = getCryptoCurrency(trade);
      return formatAmount(amount, currency);
    } else {
      const amount = trade.amountFiat || trade.fiatAmount || trade.price || 0;
      const currency = getFiatCurrency(trade);
      return formatAmount(amount, currency);
    }
  };

  const renderTradeRow = (trade: Trade, index: number) => {
    const userId = userData?.userData?.id;
    const statusDisplay = getStatusDisplay(trade?.status || 'pending');
    const tradeType = getTradeType(trade, userId);
    const cryptoCurrency = getCryptoCurrency(trade);
    const displayType = `${tradeType} ${cryptoCurrency}`;
    const counterpartName = getCounterpartName(trade, userId);
    const youPay = getYouPay(trade, userId);
    const youReceive = getYouReceive(trade, userId);
    const paymentMethod = getPaymentMethod(trade);
    const date = trade?.createdAt ? formatDate(trade.createdAt) : 'Unknown Date';
    const tradeIcon = getTradeIcon(cryptoCurrency);
    
    return (
      <tr
        key={trade?.id || index}
        className="h-[64px] border-[#2D2D2D] text-[16px] font-[500] text-[#DBDBDB] hover:bg-[#242424] transition"
      >
        <td className="py-[20px] pl-[15px] flex items-center gap-[10px]">
          {tradeIcon && (
            <Image
              src={tradeIcon}
              alt={cryptoCurrency}
              width={20}
              height={20}
            />
          )}
          <span>{displayType}</span>
        </td>
        <td className="py-[12px] text-[#A3A3A3]">{paymentMethod}</td>
        <td className="py-[12px]">{youPay}</td>
        <td className="py-[12px]">{youReceive}</td>
        <td className="py-[12px] text-[#4DF2BE]">{counterpartName}</td>
        <td className="py-[12px] text-[#C7C7C7]">{date}</td>
        <td>
          <span
            className={`px-3 p-[2px_8px] rounded-full text-[12px] ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
          >
            {statusDisplay.text}
          </span>
        </td>
        <td>
          <button 
            onClick={() => handleViewTrade(trade)}
            className="bg-[#2D2D2D] w-[61px] h-[36px] border-none text-[#FFFFFF] px-4 py-1 rounded-full text-[13px] hover:opacity-80 transition"
          >
            View
          </button>
        </td>
      </tr>
    );
  };

  const renderMobileTradeCard = (trade: Trade, index: number) => {
    const userId = userData?.userData?.id;
    const statusDisplay = getStatusDisplay(trade?.status || 'pending');
    const tradeType = getTradeType(trade, userId);
    const cryptoCurrency = getCryptoCurrency(trade);
    const displayType = `${tradeType} ${cryptoCurrency}`;
    const counterpartName = getCounterpartName(trade, userId);
    const youPay = getYouPay(trade, userId);
    const youReceive = getYouReceive(trade, userId);
    const paymentMethod = getPaymentMethod(trade);
    const date = trade?.createdAt ? formatDate(trade.createdAt) : 'Unknown Date';
    const tradeIcon = getTradeIcon(cryptoCurrency);
    
    return (
      <div key={trade?.id || index} className="bg-[#1A1A1A] rounded-[12px] p-4 mb-4 border border-[#2D2D2D]">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-3">
            {tradeIcon && (
              <Image
                src={tradeIcon}
                alt={cryptoCurrency}
                width={24}
                height={24}
              />
            )}
            <div>
              <h3 className="text-[16px] font-[500] text-white">{displayType}</h3>
              <p className="text-[12px] text-[#A3A3A3]">{date}</p>
            </div>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[12px] ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
          >
            {statusDisplay.text}
          </span>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div>
            <p className="text-[12px] text-[#A3A3A3] mb-1">You Pay</p>
            <p className="text-[14px] font-[500] text-white">{youPay}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#A3A3A3] mb-1">You Receive</p>
            <p className="text-[14px] font-[500] text-white">{youReceive}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#A3A3A3] mb-1">Payment Method</p>
            <p className="text-[14px] font-[500] text-white">{paymentMethod}</p>
          </div>
          <div>
            <p className="text-[12px] text-[#A3A3A3] mb-1">Counterparty</p>
            <p className="text-[14px] font-[500] text-[#4DF2BE]">{counterpartName}</p>
          </div>
        </div>
        
        <button 
          onClick={() => handleViewTrade(trade)}
          className="w-full bg-[#2D2D2D] h-[36px] border-none text-[#FFFFFF] px-4 py-1 rounded-full text-[13px] hover:opacity-80 transition"
        >
          View Trade Details
        </button>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#0F1012] text-white px-4 sm:px-6 md:px-8 lg:p-[20px] xl:p-[40px]">
      <Nav />

      <div className="max-w-7xl mx-auto mt-6 md:mt-[40px]">
        {/* Debug info - Hidden on mobile */}
        <div className="mb-4 p-3 bg-gray-800 rounded text-sm hidden md:block">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
            <div>
              <p className="font-semibold">Trade History</p>
              <p className="text-sm">Active: {activeTrades.length} | Completed: {completedTrades.length} | Total: {activeTrades.length + completedTrades.length}</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-xs whitespace-nowrap"
            >
              Refresh Data
            </button>
          </div>
        </div>

        {/* Mobile Stats */}
        <div className="mb-6 md:hidden">
          <div className="bg-[#1A1A1A] rounded-[12px] p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-lg font-semibold">Trade History</h2>
              <button 
                onClick={() => window.location.reload()}
                className="px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-xs"
              >
                Refresh
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-[#2D2D2D] rounded p-2">
                <p className="text-sm text-[#C7C7C7]">Active</p>
                <p className="text-lg font-bold text-white">{activeTrades.length}</p>
              </div>
              <div className="bg-[#2D2D2D] rounded p-2">
                <p className="text-sm text-[#C7C7C7]">Completed</p>
                <p className="text-lg font-bold text-white">{completedTrades.length}</p>
              </div>
              <div className="bg-[#2D2D2D] rounded p-2">
                <p className="text-sm text-[#C7C7C7]">Total</p>
                <p className="text-lg font-bold text-white">{activeTrades.length + completedTrades.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ======= Tabs Section ======= */}
        <div className="flex bg-[#2D2D2D] rounded-[56px] w-full max-w-[330px] h-[48px] p-1 items-center justify-between mb-6 md:mb-[30px] mx-auto">
          {/* Active */}
          <div
            onClick={() => setActiveTab("active")}
            className={`flex items-center justify-center gap-2 rounded-[56px] text-[14px] md:text-[16px] transition w-[150px] h-[40px] cursor-pointer ${
              activeTab === "active"
                ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500]"
                : "bg-transparent text-[#DBDBDB] font-[400]"
            }`}
          >
            Active
            <span
              className={`w-[26px] h-[24px] ml-[10px] flex items-center justify-center rounded-full text-[13px] font-[600] ${
                activeTab === "active"
                  ? "bg-[#4DF2BE] text-[#1A1A1A]"
                  : "bg-[#5C5C5C] text-[#C7C7C7]"
              }`}
            >
              {activeTrades.length}
            </span>
          </div>

          {/* Completed */}
          <div
            onClick={() => setActiveTab("completed")}
            className={`flex items-center justify-center gap-2 rounded-[56px] text-[14px] md:text-[16px] transition w-[150px] h-[40px] cursor-pointer ${
              activeTab === "completed"
                ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500]"
                : "bg-transparent text-[#DBDBDB] font-[400]"
            }`}
          >
            Completed
            <span
              className={`w-[26px] h-[24px] ml-[10px] flex items-center justify-center rounded-full text-[13px] font-[600] ${
                activeTab === "completed"
                  ? "bg-[#4DF2BE] text-[#1A1A1A]"
                  : "bg-[#5C5C5C] text-[#C7C7C7]"
              }`}
            >
              {completedTrades.length}
            </span>
          </div>
        </div>

        {/* ======= ACTIVE TAB ======= */}
        {activeTab === "active" && (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4DF2BE] mb-4"></div>
                  <p className="text-[#8F8F8F]">Loading trades...</p>
                </div>
              </div>
            ) : activeTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-[#1A1A1A] rounded-[12px] p-6">
                <Image src={G19} alt="group19" width={120} height={120} className="w-20 h-20 md:w-24 md:h-24" />
                <p className="text-[16px] md:text-[18px] text-[#C7C7C7] mt-4 md:mt-[16px] text-center">No Active Trades</p>
                <p className="text-[14px] text-gray-500 mt-2 text-center max-w-md">
                  You don't have any active trades at the moment.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto bg-[#1A1A1A] p-6 rounded-[12px] shadow-lg w-full">
                  <table className="min-w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[#C7C7C7] h-[35px] text-[14px] font-[500] border-b border-[#2D2D2D]">
                        <th className="pl-[10px]">Trade Type</th>
                        <th>Payment Method</th>
                        <th>You Pay</th>
                        <th>You Receive</th>
                        <th>Counterparty</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeTrades.map(renderTradeRow)}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {activeTrades.map(renderMobileTradeCard)}
                </div>
              </>
            )}
          </>
        )}

        {/* ======= COMPLETED TAB ======= */}
        {activeTab === "completed" && (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-[300px]">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4DF2BE] mb-4"></div>
                  <p className="text-[#8F8F8F]">Loading trades...</p>
                </div>
              </div>
            ) : completedTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-[#1A1A1A] rounded-[12px] p-6">
                <Image src={G19} alt="group19" width={120} height={120} className="w-20 h-20 md:w-24 md:h-24" />
                <p className="text-[16px] md:text-[18px] text-[#C7C7C7] mt-4 md:mt-[16px] text-center">No Completed Trades</p>
                <p className="text-[14px] text-gray-500 mt-2 text-center max-w-md">
                  You haven't completed any trades yet.
                </p>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto bg-[#1A1A1A] p-6 rounded-[12px] shadow-lg w-full">
                  <table className="min-w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[#C7C7C7] h-[35px] text-[14px] font-[500] border-b border-[#2D2D2D]">
                        <th className="pl-[10px]">Trade Type</th>
                        <th>Payment Method</th>
                        <th>You Pay</th>
                        <th>You Receive</th>
                        <th>Counterparty</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {completedTrades.map(renderTradeRow)}
                    </tbody>
                  </table>
                </div>
                
                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {completedTrades.map(renderMobileTradeCard)}
                </div>
              </>
            )}
          </>
        )}
      </div>
      
      {/* Divider - Responsive spacing */}
         <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] mt-[10%] ">
                  <Footer />
                </div>
    </main>
  );
};

export default Trade_History;