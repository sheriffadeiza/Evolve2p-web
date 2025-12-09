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
    userId?: string;
    _id?: string;
    trades?: any[];
    tradesAsBuyer?: any[];
    tradesAsSeller?: any[];
    tradeHistory?: any[];
    wallets?: any[];
    [key: string]: any;
  };
  [key: string]: any;
}

interface Trade {
  id: string;
  tradeId?: string;
  _id?: string;
  type: "buy" | "sell";
  sellerId?: string;
  seller?: string;
  buyerId?: string;
  buyer?: string;
  amount: number;
  price: number;
  status: string;
  currency?: string;
  paymentMethod?: string;
  counterpart?: string;
  createdAt: string;
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
  originalTrade?: Trade;
  isSample?: boolean;
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
  if (currency === 'BTC' || currency === 'ETH') {
    return `${amount.toFixed(6)} ${currency}`;
  }
  if (currency === 'USD' || currency === 'USDT' || currency === 'USDC') {
    return `$${amount.toFixed(2)}`;
  }
  return `${amount} ${currency}`;
};

const getStatusDisplay = (status: string) => {
  const statusLower = status.toLowerCase();
  
  if (statusLower.includes('complete') || statusLower === 'completed') {
    return {
      text: 'Completed',
      bgColor: 'bg-[#4DF2BE33]',
      textColor: 'text-[#4DF2BE]'
    };
  }
  
  if (statusLower.includes('pending')) {
    return {
      text: 'Pending',
      bgColor: 'bg-[#F59E0B33]',
      textColor: 'text-[#F59E0B]'
    };
  }
  
  if (statusLower.includes('processing') || statusLower.includes('in_progress')) {
    return {
      text: 'Processing',
      bgColor: 'bg-[#3B82F633]',
      textColor: 'text-[#3B82F6]'
    };
  }
  
  if (statusLower.includes('escrow') || statusLower.includes('in escrow')) {
    return {
      text: 'In Escrow',
      bgColor: 'bg-[#392D46]',
      textColor: 'text-[#CCA0FA]'
    };
  }
  
  if (statusLower.includes('dispute') || statusLower === 'disputed') {
    return {
      text: 'In Dispute',
      bgColor: 'bg-[#342827]',
      textColor: 'text-[#FE857D]'
    };
  }
  
  if (statusLower.includes('awaiting') || statusLower.includes('release')) {
    return {
      text: 'Awaiting Release',
      bgColor: 'bg-[#10B98133]',
      textColor: 'text-[#10B981]'
    };
  }
  
  if (statusLower.includes('cancel') || statusLower === 'cancelled') {
    return {
      text: 'Canceled',
      bgColor: 'bg-[#EF444433]',
      textColor: 'text-[#EF4444]'
    };
  }
  
  if (statusLower.includes('inreview') || statusLower === 'in_review') {
    return {
      text: 'In Review',
      bgColor: 'bg-[#8B5CF633]',
      textColor: 'text-[#8B5CF6]'
    };
  }
  
  return {
    text: status.charAt(0).toUpperCase() + status.slice(1),
    bgColor: 'bg-[#6B728033]',
    textColor: 'text-[#D1D5DB]'
  };
};

// Sample data for testing/demo purposes
const getSampleTrades = (): FormattedTrade[] => {
  const sampleActive = [
    {
      type: "Buy BTC",
      method: "Bank Transfer",
      youPay: "$500.00",
      youReceive: "0.012345 BTC",
      counterpart: "@CryptoTrader",
      date: formatDate(new Date().toISOString()),
      status: "Pending",
      isSample: true
    },
    {
      type: "Sell ETH",
      method: "Credit Card",
      youPay: "0.5 ETH",
      youReceive: "$1,500.00",
      counterpart: "@ETHBuyer",
      date: formatDate(new Date(Date.now() - 86400000).toISOString()), // Yesterday
      status: "In Review",
      isSample: true
    }
  ];

  const sampleCompleted = [
    {
      type: "Buy USDT",
      method: "PayPal",
      youPay: "$100.00",
      youReceive: "100 USDT",
      counterpart: "@CoinExpert",
      date: formatDate(new Date(Date.now() - 172800000).toISOString()), // 2 days ago
      status: "Completed",
      isSample: true
    }
  ];

  return [...sampleActive, ...sampleCompleted];
};

const Trade_History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [activeTrades, setActiveTrades] = useState<FormattedTrade[]>([]);
  const [completedTrades, setCompletedTrades] = useState<FormattedTrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [showSampleData, setShowSampleData] = useState(false);

  useEffect(() => {
    const loadUserData = () => {
      try {
        console.log("🔍 Loading UserData from localStorage...");
        
        // Get userData from localStorage with proper checks
        const userDataRaw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
        if (!userDataRaw) {
          console.log("❌ No UserData found in localStorage");
          setLoading(false);
          // Show sample data for demo
          const sampleTrades = getSampleTrades();
          const active = sampleTrades.filter(t => t.status !== "Completed");
          const completed = sampleTrades.filter(t => t.status === "Completed");
          setActiveTrades(active);
          setCompletedTrades(completed);
          setShowSampleData(true);
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
        console.log("🔥 USERDATA OBJECT:", userDataObj);
        console.log("🔥 Available keys in userDataObj:", Object.keys(userDataObj));
        console.log("📊 tradesAsBuyer:", userDataObj.tradesAsBuyer);
        console.log("📊 tradesAsSeller:", userDataObj.tradesAsSeller);
        
        // Extract all trades from userData
        const allTrades: Trade[] = [];
        
        // Check for tradesAsBuyer (most common)
        if (Array.isArray(userDataObj.tradesAsBuyer) && userDataObj.tradesAsBuyer.length > 0) {
          console.log(`✅ Found ${userDataObj.tradesAsBuyer.length} trades in tradesAsBuyer`);
          userDataObj.tradesAsBuyer.forEach((trade: any, index: number) => {
            allTrades.push({
              ...trade,
              type: 'buy' as const
            });
          });
        }
        
        // Check for tradesAsSeller
        if (Array.isArray(userDataObj.tradesAsSeller) && userDataObj.tradesAsSeller.length > 0) {
          console.log(`✅ Found ${userDataObj.tradesAsSeller.length} trades in tradesAsSeller`);
          userDataObj.tradesAsSeller.forEach((trade: any, index: number) => {
            allTrades.push({
              ...trade,
              type: 'sell' as const
            });
          });
        }
        
        // Check for direct trades array
        if (Array.isArray(userDataObj.trades) && userDataObj.trades.length > 0) {
          console.log(`✅ Found ${userDataObj.trades.length} trades in trades array`);
          allTrades.push(...userDataObj.trades);
        }
        
        console.log("📈 Total trades loaded from userData:", allTrades.length);
        
        // Process and format trades
        const formattedActive: FormattedTrade[] = [];
        const formattedCompleted: FormattedTrade[] = [];
        
        if (allTrades.length > 0) {
          // Process real trades
          allTrades.forEach((trade) => {
            // Determine if trade is completed
            const status = trade.status?.toLowerCase() || 'pending';
            const isCompleted = status.includes('complete') || 
                               status === 'completed' ||
                               status === 'released' ||
                               status === 'finished' ||
                               status === 'done';
            
            // Determine trade type display
            const currency = trade.currency || 'BTC';
            const tradeType = trade.type === 'buy' ? `Buy ${currency}` : `Sell ${currency}`;
            
            // Determine what user pays and receives
            let youPay = '';
            let youReceive = '';
            
            if (trade.type === 'buy') {
              // Buyer pays USD, receives crypto
              const cryptoAmount = trade.amount / (trade.price || 1);
              youPay = formatAmount(trade.amount, 'USD');
              youReceive = formatAmount(cryptoAmount, currency);
            } else {
              // Seller pays crypto, receives USD
              const usdAmount = trade.amount * (trade.price || 1);
              youPay = formatAmount(trade.amount, currency);
              youReceive = formatAmount(usdAmount, 'USD');
            }
            
            // Get counterpart
            let counterpart = 'Unknown User';
            if (trade.type === 'buy' && (trade.seller || trade.sellerId)) {
              counterpart = `@${trade.seller || trade.sellerId}`;
            } else if (trade.type === 'sell' && (trade.buyer || trade.buyerId)) {
              counterpart = `@${trade.buyer || trade.buyerId}`;
            }
            
            // Get payment method
            const method = trade.paymentMethod || 'Bank Transfer';
            
            const formattedTrade: FormattedTrade = {
              type: tradeType,
              method: method,
              youPay,
              youReceive,
              counterpart,
              date: formatDate(trade.createdAt),
              status: getStatusDisplay(trade.status || 'pending').text,
              originalTrade: trade,
              isSample: false
            };
            
            if (isCompleted) {
              formattedCompleted.push(formattedTrade);
            } else {
              formattedActive.push(formattedTrade);
            }
          });
          
          setShowSampleData(false);
        } else {
          console.log("⚠ No real trades found. Showing sample data for demo.");
          // Show sample data for demo
          const sampleTrades = getSampleTrades();
          const active = sampleTrades.filter(t => t.status !== "Completed");
          const completed = sampleTrades.filter(t => t.status === "Completed");
          setActiveTrades(active);
          setCompletedTrades(completed);
          setShowSampleData(true);
        }
        
        console.log("✅ Active trades count:", formattedActive.length);
        console.log("✅ Completed trades count:", formattedCompleted.length);
        
        // Sort by date (most recent first)
        formattedActive.sort((a, b) => {
          try {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          } catch {
            return 0;
          }
        });
        
        formattedCompleted.sort((a, b) => {
          try {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
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
    if (trade.isSample) {
      alert("This is sample data. Create a real trade to use this feature.");
      return;
    }
    
    const tradeId = trade.originalTrade?.id || trade.originalTrade?.tradeId || trade.originalTrade?._id;
    if (!tradeId) {
      alert("No trade ID found");
      return;
    }
    
    // Determine which page to redirect to based on user role in the trade
    const userId = userData?.userData?.id || userData?.userData?.userId || userData?.userData?._id;
    const buyerId = trade.originalTrade?.buyerId || trade.originalTrade?.buyer;
    const sellerId = trade.originalTrade?.sellerId || trade.originalTrade?.seller;
    
    if (userId && buyerId === userId) {
      // User is buyer
      window.location.href = `/prc_buy?tradeId=${tradeId}`;
    } else if (userId && sellerId === userId) {
      // User is seller
      window.location.href = `/prc_sell?tradeId=${tradeId}`;
    } else {
      // Default to buyer page
      window.location.href = `/prc_buy?tradeId=${tradeId}`;
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
              <p className="font-semibold">Trade History Status</p>
              <p>Found {activeTrades.length} active trades and {completedTrades.length} completed trades</p>
              <p className="text-xs text-gray-400 mt-1">
                {showSampleData ? "Showing sample data (no real trades found)" : "Showing real user trades"}
              </p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs"
            >
              Refresh Data
            </button>
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

        {/* Show warning if using sample data */}
        {showSampleData && (
          <div className="mb-4 p-3 bg-yellow-900/30 border border-yellow-700 rounded">
            <p className="text-yellow-300 font-medium">Demo Mode</p>
            <p className="text-yellow-200 text-sm">No real trades found in your account. Showing sample data for demonstration.</p>
            <p className="text-yellow-200 text-xs mt-1">
              Create a trade on the platform to see your real trade history here.
            </p>
          </div>
        )}

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
                  You don't have any active trades yet. <br />
                  Start trading on the platform to see your trade history here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-[#1A1A1A] p-6 rounded-[12px] shadow-lg w-full max-w-[1224px]">
                {showSampleData && (
                  <div className="mb-4 p-2 bg-gray-800 rounded text-sm text-center">
                    <span className="text-yellow-300">⚠ Sample Data</span>
                  </div>
                )}
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
                      const statusDisplay = getStatusDisplay(trade.status || 'pending');
                      return (
                        <tr
                          key={index}
                          className={`h-[64px] border-[#2D2D2D] text-[16px] font-[500] text-[#DBDBDB] hover:bg-[#242424] transition ${
                            trade.isSample ? 'opacity-80' : ''
                          }`}
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
                              className={`bg-[#2D2D2D] w-[61px] h-[36px] border-none text-[#FFFFFF] px-4 py-1 rounded-full text-[13px] hover:opacity-80 transition ${
                                trade.isSample ? 'cursor-not-allowed opacity-70' : ''
                              }`}
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
                  You haven't completed any trades yet. <br />
                  Complete your first trade to see it here.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-[#1A1A1A] p-6 rounded-[12px] shadow-lg w-full max-w-[1224px]">
                {showSampleData && (
                  <div className="mb-4 p-2 bg-gray-800 rounded text-sm text-center">
                    <span className="text-yellow-300">⚠ Sample Data</span>
                  </div>
                )}
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
                        className={`h-[64px] border-[#2D2D2D] text-[16px] font-[500] text-[#DBDBDB] hover:bg-[#242424] transition ${
                          trade.isSample ? 'opacity-80' : ''
                        }`}
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
                            className={`bg-[#2D2D2D] w-[61px] h-[36px] border-none text-[#FFFFFF] px-4 py-1 rounded-full text-[13px] hover:opacity-80 transition ${
                              trade.isSample ? 'cursor-not-allowed opacity-70' : ''
                            }`}
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