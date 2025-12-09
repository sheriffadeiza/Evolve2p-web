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

interface Trade {
  id: string;
  tradeId?: string;
  _id?: string;
  type?: "buy" | "sell";
  sellerId?: string;
  seller?: string;
  buyerId?: string;
  buyer?: string;
  amount?: number;
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
  [key: string]: any;
}

interface FormattedTrade {
  type: string;
  method: string;
  youPay: string;
  youReceive: string;
  counterpart: string;
  date: string;
  status: string;
  originalTrade: Trade;
}

const getTradeIcon = (type: string) => {
  if (type.includes("BTC") || type.includes("Bitcoin")) return BTC;
  if (type.includes("ETH") || type.includes("Ethereum")) return ETH;
  if (type.includes("USDC")) return USDC;
  if (type.includes("USDT")) return USDT;
  return null;
};

const formatDate = (dateString: string) => {
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

const formatAmount = (amount: number, currency: string = 'USD') => {
  if (!amount && amount !== 0) return "Unknown";
  
  if (currency === 'BTC' || currency === 'ETH') {
    return `${amount.toFixed(6)} ${currency}`;
  }
  if (currency === 'USD' || currency === 'USDT' || currency === 'USDC') {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount} ${currency}`;
};

const getStatusDisplay = (status: string) => {
  const statusUpper = status.toUpperCase();
  
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
    text: status.charAt(0).toUpperCase() + status.slice(1),
    bgColor: 'bg-[#6B728033]',
    textColor: 'text-[#D1D5DB]'
  };
};

// Function to determine if a trade is completed
const isTradeCompleted = (status: string): boolean => {
  const statusUpper = status.toUpperCase();
  return (
    statusUpper.includes('COMPLETE') ||
    statusUpper === 'COMPLETED' ||
    statusUpper === 'FINISHED' ||
    statusUpper === 'DONE' ||
    statusUpper === 'RELEASED'
  );
};

// Function to determine if a trade is active (all except completed)
const isTradeActive = (status: string): boolean => {
  return !isTradeCompleted(status);
};

const Trade_History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [activeTrades, setActiveTrades] = useState<FormattedTrade[]>([]);
  const [completedTrades, setCompletedTrades] = useState<FormattedTrade[]>([]);
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
        
        // Collect all trades from multiple sources
        let allTrades: Trade[] = [];
        
        // 1. From tradesAsBuyer
        if (Array.isArray(userDataObj.tradesAsBuyer)) {
          console.log(`✅ Found ${userDataObj.tradesAsBuyer.length} trades in 'tradesAsBuyer' array`);
          const buyerTrades = userDataObj.tradesAsBuyer.map((trade: Trade) => ({
            ...trade,
            userRole: 'buyer'
          }));
          allTrades = [...allTrades, ...buyerTrades];
        } else {
          console.log("ℹ️ No 'tradesAsBuyer' array found in userData");
        }
        
        // 2. From tradesAsSeller
        if (Array.isArray(userDataObj.tradesAsSeller)) {
          console.log(`✅ Found ${userDataObj.tradesAsSeller.length} trades in 'tradesAsSeller' array`);
          const sellerTrades = userDataObj.tradesAsSeller.map((trade: Trade) => ({
            ...trade,
            userRole: 'seller'
          }));
          allTrades = [...allTrades, ...sellerTrades];
        } else {
          console.log("ℹ️ No 'tradesAsSeller' array found in userData");
        }
        
        // 3. From general trades array (fallback)
        if (Array.isArray(userDataObj.trades)) {
          console.log(`✅ Found ${userDataObj.trades.length} trades in 'trades' array`);
          // Determine user role for each trade in the general array
          const generalTrades = userDataObj.trades.map((trade: Trade) => {
            const isBuyer = trade.buyerId === currentUserId;
            const isSeller = trade.sellerId === currentUserId;
            return {
              ...trade,
              userRole: isBuyer ? 'buyer' : isSeller ? 'seller' : 'unknown'
            };
          });
          allTrades = [...allTrades, ...generalTrades];
        } else {
          console.log("ℹ️ No 'trades' array found in userData");
        }
        
        // Remove duplicates based on trade id
        const uniqueTradesMap = new Map<string, Trade>();
        allTrades.forEach(trade => {
          const tradeId = trade.id || trade.tradeId || trade._id;
          if (tradeId) {
            if (!uniqueTradesMap.has(tradeId)) {
              uniqueTradesMap.set(tradeId, trade);
            } else {
              // If duplicate exists, keep the one with more complete data
              const existingTrade = uniqueTradesMap.get(tradeId)!;
              if (!existingTrade.userRole && trade.userRole) {
                uniqueTradesMap.set(tradeId, trade);
              }
            }
          }
        });
        
        const uniqueTrades = Array.from(uniqueTradesMap.values());
        
        console.log("📈 Total unique trades loaded:", uniqueTrades.length);
        console.log("📊 All unique trades:", uniqueTrades);
        
        // Process and format trades
        const formattedActive: FormattedTrade[] = [];
        const formattedCompleted: FormattedTrade[] = [];
        
        uniqueTrades.forEach((trade, index) => {
          console.log(`🔄 Processing trade ${index}:`, trade);
          
          // Determine user role in this trade
          const userRole = trade.userRole || 
                          (trade.buyerId === currentUserId ? 'buyer' : 
                           trade.sellerId === currentUserId ? 'seller' : 'unknown');
          
          console.log(`   User role: ${userRole}`);
          
          // Determine if trade is completed based on status
          const status = trade.status || 'pending';
          const isCompleted = isTradeCompleted(status);
          
          console.log(`   Status: ${status}, Is completed: ${isCompleted}`);
          
          // Determine trade type based on user role
          let tradeType = '';
          if (userRole === 'buyer') {
            tradeType = "Buy";
          } else if (userRole === 'seller') {
            tradeType = "Sell";
          } else {
            // Try to determine from the trade type field
            if (trade.type === 'buy') {
              tradeType = "Buy";
            } else if (trade.type === 'sell') {
              tradeType = "Sell";
            } else {
              tradeType = "Trade";
            }
          }
          
          // Try to determine currency - check various possible fields
          let currency = 'BTC'; // Default
          if (trade.cryptoCurrency) {
            currency = trade.cryptoCurrency;
          } else if (trade.currency) {
            currency = trade.currency;
          }
          
          tradeType += ` ${currency}`;
          
          // Determine amounts
          let cryptoAmount = trade.cryptoAmount || trade.amount || 0;
          let fiatAmount = trade.fiatAmount || trade.price || 0;
          
          // If we have offerId, we might need to fetch more details
          // For now, use placeholders if amounts are missing
          if (!cryptoAmount && !fiatAmount) {
            cryptoAmount = 0.01; // Placeholder
            fiatAmount = 500; // Placeholder
          }
          
          // Determine what user pays and receives
          let youPay = '';
          let youReceive = '';
          
          if (userRole === 'buyer') {
            // Buyer pays fiat, receives crypto
            youPay = formatAmount(fiatAmount, trade.fiatCurrency || 'USD');
            youReceive = formatAmount(cryptoAmount, currency);
          } else if (userRole === 'seller') {
            // Seller pays crypto, receives fiat
            youPay = formatAmount(cryptoAmount, currency);
            youReceive = formatAmount(fiatAmount, trade.fiatCurrency || 'USD');
          } else {
            // Fallback - try to determine from trade type
            if (trade.type === 'buy') {
              youPay = formatAmount(fiatAmount, trade.fiatCurrency || 'USD');
              youReceive = formatAmount(cryptoAmount, currency);
            } else if (trade.type === 'sell') {
              youPay = formatAmount(cryptoAmount, currency);
              youReceive = formatAmount(fiatAmount, trade.fiatCurrency || 'USD');
            } else {
              youPay = "Unknown";
              youReceive = "Unknown";
            }
          }
          
          // Get counterpart
          let counterpart = 'Unknown User';
          if (userRole === 'buyer' && trade.sellerId) {
            counterpart = `Seller ${trade.sellerId.substring(0, 8)}`;
          } else if (userRole === 'seller' && trade.buyerId) {
            counterpart = `Buyer ${trade.buyerId.substring(0, 8)}`;
          } else if (trade.seller) {
            counterpart = trade.seller;
          } else if (trade.buyer) {
            counterpart = trade.buyer;
          }
          
          // Get payment method
          const method = trade.paymentMethod || 'Bank Transfer';
          
          // Get date
          const date = trade.createdAt ? formatDate(trade.createdAt) : 'Unknown Date';
          
          const formattedTrade: FormattedTrade = {
            type: tradeType,
            method: method,
            youPay,
            youReceive,
            counterpart,
            date,
            status: getStatusDisplay(status).text,
            originalTrade: trade
          };
          
          console.log(`   Formatted trade:`, formattedTrade);
          
          if (isCompleted) {
            formattedCompleted.push(formattedTrade);
          } else {
            formattedActive.push(formattedTrade);
          }
        });
        
        console.log("✅ Active trades count:", formattedActive.length);
        console.log("✅ Completed trades count:", formattedCompleted.length);
        
        // Sort by date (most recent first)
        formattedActive.sort((a, b) => {
          try {
            return new Date(b.originalTrade.createdAt).getTime() - new Date(a.originalTrade.createdAt).getTime();
          } catch {
            return 0;
          }
        });
        
        formattedCompleted.sort((a, b) => {
          try {
            return new Date(b.originalTrade.createdAt).getTime() - new Date(a.originalTrade.createdAt).getTime();
          } catch {
            return 0;
          }
        });
        
        setActiveTrades(formattedActive);
        setCompletedTrades(formattedCompleted);
        setLoading(false);
        
      } catch (err) {
        console.error("❌ Error loading UserData", err);
        setLoading(false);
      }
    };

    loadUserData();
    
    // Reload data when window gains focus
    const handleFocus = () => {
      console.log("🔄 Window focused, reloading data...");
      loadUserData();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  const handleViewTrade = (trade: FormattedTrade) => {
    const tradeId = trade.originalTrade.id || trade.originalTrade.tradeId || trade.originalTrade._id;
    if (!tradeId) {
      alert("No trade ID found");
      return;
    }
    
    console.log("👁 Viewing trade with ID:", tradeId);
    console.log("Trade details:", trade.originalTrade);
    
    // Determine which page to redirect to based on user role in the trade
    const userId = userData?.userData?.id;
    const tradeUserRole = trade.originalTrade.userRole || 
                         (trade.originalTrade.buyerId === userId ? 'buyer' : 
                          trade.originalTrade.sellerId === userId ? 'seller' : null);
    
    console.log("User role in trade:", tradeUserRole);
    
    if (tradeUserRole === 'buyer') {
      // User is buyer
      window.location.href = `/prc_buy?tradeId=${tradeId}`;
    } else if (tradeUserRole === 'seller') {
      // User is seller
      window.location.href = `/prc_sell?tradeId=${tradeId}`;
    } else {
      // Default to buyer page or offer a choice
      const confirmResult = confirm("Unable to determine your role. Go to buyer page?");
      if (confirmResult) {
        window.location.href = `/prc_buy?tradeId=${tradeId}`;
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#0F1012] text-white p-[20px] md:p-[40px]">
      <Nav />

      <div className="max-w-7xl mx-auto mt-[40px]">
        {/* Debug info */}
        <div className="mb-4 p-3 bg-gray-800 rounded text-sm">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">Trade History</p>
              <p>Active: {activeTrades.length} | Completed: {completedTrades.length} | Total: {activeTrades.length + completedTrades.length}</p>
              <p className="text-xs text-gray-400 mt-1">
                Data loaded from tradesAsBuyer, tradesAsSeller, and trades arrays. Check console (F12) for details.
              </p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  console.log("Current userData:", userData);
                  console.log("Active trades:", activeTrades);
                  console.log("Completed trades:", completedTrades);
                  alert("Check browser console (F12) for data details");
                }}
                className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
              >
                Debug Info
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-3 py-1 bg-green-700 hover:bg-green-600 rounded text-xs"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* ======= Tabs Section ======= */}
        <div className="flex bg-[#2D2D2D] rounded-[56px] w-[330px] h-[48px] p-1 items-center justify-between mb-[30px]">
          {/* Active */}
          <div
            onClick={() => setActiveTab("active")}
            className={`flex items-center justify-center gap-2 rounded-[56px] text-[16px] transition w-[150px] h-[40px] cursor-pointer ${
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
            className={`flex items-center justify-center gap-2 rounded-[56px] text-[16px] transition w-[150px] h-[40px] cursor-pointer ${
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
              <p className="text-center text-[#8F8F8F] mt-10">Loading trades...</p>
            ) : activeTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-[#1A1A1A] rounded-[12px]">
                <Image src={G19} alt="group19" width={120} height={120} />
                <p className="text-[16px] text-[#C7C7C7] mt-[16px]">No Active Trades</p>
                <p className="text-[14px] text-gray-500 mt-2 text-center max-w-md">
                  You don't have any active trades at the moment.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-[#1A1A1A] p-6 rounded-[12px] shadow-lg w-full max-w-[1224px]">
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
                    {activeTrades.map((trade, index) => {
                      const statusDisplay = getStatusDisplay(trade.originalTrade.status || 'pending');
                      return (
                        <tr
                          key={index}
                          className="h-[64px] border-[#2D2D2D] text-[16px] font-[500] text-[#DBDBDB] hover:bg-[#242424] transition"
                        >
                          <td className="py-[20px] pl-[15px] flex items-center gap-[10px]">
                            {getTradeIcon(trade.type) && (
                              <Image
                                src={getTradeIcon(trade.type)!}
                                alt={trade.type}
                                width={20}
                                height={20}
                              />
                            )}
                            <span>{trade.type}</span>
                          </td>
                          <td className="py-[12px] text-[#A3A3A3]">{trade.method}</td>
                          <td className="py-[12px]">{trade.youPay}</td>
                          <td className="py-[12px]">{trade.youReceive}</td>
                          <td className="py-[12px] text-[#4DF2BE]">{trade.counterpart}</td>
                          <td className="py-[12px] text-[#C7C7C7]">{trade.date}</td>
                          <td>
                            <span
                              className={`px-3 p-[2px_8px] rounded-full text-[12px] ${statusDisplay.bgColor} ${statusDisplay.textColor}`}
                            >
                              {trade.status}
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
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ======= COMPLETED TAB ======= */}
        {activeTab === "completed" && (
          <>
            {loading ? (
              <p className="text-center text-[#8F8F8F] mt-10">Loading trades...</p>
            ) : completedTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-[#1A1A1A] rounded-[12px]">
                <Image src={G19} alt="group19" width={120} height={120} />
                <p className="text-[16px] text-[#C7C7C7] mt-[16px]">No Completed Trades</p>
                <p className="text-[14px] text-gray-500 mt-2 text-center max-w-md">
                  You haven't completed any trades yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-[#1A1A1A] p-6 rounded-[12px] shadow-lg w-full max-w-[1224px]">
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
                    {completedTrades.map((trade, index) => (
                      <tr
                        key={index}
                        className="h-[64px] border-[#2D2D2D] text-[16px] font-[500] text-[#DBDBDB] hover:bg-[#242424] transition"
                      >
                        <td className="py-[20px] pl-[15px] flex items-center gap-[10px]">
                          {getTradeIcon(trade.type) && (
                            <Image
                              src={getTradeIcon(trade.type)!}
                              alt={trade.type}
                              width={20}
                              height={20}
                            />
                          )}
                          <span>{trade.type}</span>
                        </td>
                        <td className="py-[12px] text-[#A3A3A3]">{trade.method}</td>
                        <td className="py-[12px]">{trade.youPay}</td>
                        <td className="py-[12px]">{trade.youReceive}</td>
                        <td className="py-[12px] text-[#4DF2BE]">{trade.counterpart}</td>
                        <td className="py-[12px] text-[#C7C7C7]">{trade.date}</td>
                        <td>
                          <span className="px-3 p-[2px_8px] bg-[#4DF2BE33] text-[#4DF2BE] rounded-full text-[12px]">
                            {trade.status}
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
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <div className="mt-16 mb-8">
        <div className="w-full h-[1px] bg-white opacity-20"></div>
      </div>
      
      <div className="mb-16">
        <Footer />
      </div>
    </main>
  );
};

export default Trade_History;