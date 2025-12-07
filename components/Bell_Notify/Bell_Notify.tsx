"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Nav from "../NAV/Nav";
import Footer from "../Footer/Footer";

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
  createdAt: string;
  [key: string]: any;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type?: string;
  tradeId?: string;
  metadata?: any;
  isRead?: boolean;
  matchedTrade?: Trade;
  userRole?: 'buyer' | 'seller' | 'unknown';
}

type FilterType = "all" | "trades" | "wallet" | "others";

const safeToString = (value: any): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  if (typeof value === 'object') {
    if (value.text) return String(value.text);
    if (value.message) return String(value.message);
    if (value.title) return String(value.title);
    if (value.name) return String(value.name);
    if (value.id) return String(value.id);
    if (value.tradeId) return String(value.tradeId);
    if (value._id) return String(value._id);
    if (value.createdAt) return String(value.createdAt);
    
    try {
      const jsonStr = JSON.stringify(value);
      if (jsonStr.length > 50) return jsonStr.substring(0, 50) + '...';
      return jsonStr;
    } catch {
      return '[Object]';
    }
  }
  return String(value);
};

// Find matching trade from UserData
const findMatchingTrade = (notification: any, allTrades: Trade[], userId: string): Trade | null => {
  if (!notification || allTrades.length === 0) return null;
  
  const notificationText = (safeToString(notification.title) + ' ' + safeToString(notification.message)).toLowerCase();
  
  // First, check if notification has direct tradeId
  if (notification.metadata?.tradeId) {
    const tradeId = safeToString(notification.metadata.tradeId);
    const directMatch = allTrades.find(t => 
      safeToString(t.id) === tradeId || 
      safeToString(t.tradeId) === tradeId || 
      safeToString(t._id) === tradeId
    );
    if (directMatch) return directMatch;
  }
  
  // Try to match by content - look for amount/price in notification
  for (const trade of allTrades) {
    const tradeAmount = trade.amount;
    const tradePrice = trade.price;
    
    if (tradeAmount && notificationText.includes(tradeAmount.toString())) {
      return trade;
    }
    
    if (tradePrice && notificationText.includes(tradePrice.toString())) {
      return trade;
    }
  }
  
  // Return most recent pending trade
  const pendingTrades = allTrades.filter(t => t.status === 'pending');
  if (pendingTrades.length > 0) {
    return pendingTrades.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }
  
  // Return first trade
  return allTrades.length > 0 ? allTrades[0] : null;
};

// Get redirect page based on user role
const getRedirectPage = (
  trade: Trade, 
  currentUserId: string
): string => {
  const tradeId = safeToString(trade.id || trade.tradeId || trade._id);
  
  if (currentUserId) {
    const buyerId = safeToString(trade.buyerId || trade.buyer);
    const sellerId = safeToString(trade.sellerId || trade.seller);
    
    if (buyerId === currentUserId) {
      return `/prc_sell?tradeId=${tradeId}`; // Buyer goes to sell page
    }
    
    if (sellerId === currentUserId) {
      return `/prc_buy?tradeId=${tradeId}`; // Seller goes to buy page
    }
  }
  
  return `/prc_sell?tradeId=${tradeId}`;
};

// Fix notification text to show correct action
const fixNotificationText = (text: string, userRole: 'buyer' | 'seller' | 'unknown'): string => {
  if (userRole === 'unknown' || !text) return text || '';
  
  let fixedText = text;
  
  if (userRole === 'buyer') {
    // User is buyer -> show "sell to" in text
    // Original might be "buy from X" -> change to "sell to X"
    fixedText = fixedText
      .replace(/buy from/g, 'sell to')
      .replace(/buying from/g, 'selling to')
      .replace(/to buy/g, 'to sell')
      .replace(/want to buy/g, 'want to sell')
      .replace(/request to buy/g, 'request to sell')
      .replace(/trade request to buy/g, 'trade request to sell');
  } else if (userRole === 'seller') {
    // User is seller -> show "buy from" in text
    // Original might be "sell to X" -> change to "buy from X"
    fixedText = fixedText
      .replace(/sell to/g, 'buy from')
      .replace(/selling to/g, 'buying from')
      .replace(/to sell/g, 'to buy')
      .replace(/want to sell/g, 'want to buy')
      .replace(/request to sell/g, 'request to buy')
      .replace(/trade request to sell/g, 'trade request to buy');
  }
  
  return fixedText;
};

const Bell_Notify = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    const loadUserData = () => {
      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
        if (!raw) return;

        const parsed = JSON.parse(raw);
        
        if (parsed.userData) {
          setUserData(parsed.userData);
          const userId = parsed.userData.id;

          // Load trades
          const buyerTrades: Trade[] = Array.isArray(parsed.userData.tradesAsBuyer) 
            ? parsed.userData.tradesAsBuyer 
            : [];
          
          const sellerTrades: Trade[] = Array.isArray(parsed.userData.tradesAsSeller) 
            ? parsed.userData.tradesAsSeller 
            : [];
          
          const combinedTrades = [...buyerTrades, ...sellerTrades];
          setAllTrades(combinedTrades);

          // Load and match notifications
          if (Array.isArray(parsed.userData.notifications)) {
            const enhancedNotifications = parsed.userData.notifications.map((n: any, index: number) => {
              const matchedTrade = findMatchingTrade(n, combinedTrades, userId);
              
              // Determine user role
              let userRole: 'buyer' | 'seller' | 'unknown' = 'unknown';
              if (matchedTrade && userId) {
                const buyerId = safeToString(matchedTrade.buyerId || matchedTrade.buyer);
                const sellerId = safeToString(matchedTrade.sellerId || matchedTrade.seller);
                userRole = buyerId === userId ? 'buyer' : sellerId === userId ? 'seller' : 'unknown';
              }
              
              // Fix notification text
              const originalTitle = safeToString(n.title);
              const originalMessage = safeToString(n.message);
              const fixedTitle = fixNotificationText(originalTitle, userRole);
              const fixedMessage = fixNotificationText(originalMessage, userRole);
              
              console.log(`Notification ${index}:`, {
                original: originalMessage,
                fixed: fixedMessage,
                userRole,
                matchedTradeId: matchedTrade?.id
              });
              
              return {
                id: safeToString(n.id) || `notif-${index}-${Date.now()}`,
                title: fixedTitle,
                message: fixedMessage,
                timeAgo: safeToString(n.timeAgo),
                type: n.type ? safeToString(n.type) : undefined,
                tradeId: matchedTrade ? safeToString(matchedTrade.id || matchedTrade.tradeId || matchedTrade._id) : undefined,
                metadata: n.metadata,
                isRead: n.isRead || false,
                matchedTrade: matchedTrade || undefined,
                userRole: userRole
              };
            });
            
            setNotifications(enhancedNotifications);
          }
        }
      } catch (err) {
        console.error("Error loading UserData", err);
      }
    };

    loadUserData();
    
    const handleFocus = () => loadUserData();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Get current user ID
  const getCurrentUserId = useCallback((): string | null => {
    return userData?.id || userData?.userId || userData?._id || null;
  }, [userData]);

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => 
      n.id === notificationId ? { ...n, isRead: true } : n
    ));
    
    try {
      const raw = localStorage.getItem("UserData");
      if (!raw) return;
      
      const parsed = JSON.parse(raw);
      if (parsed.userData && Array.isArray(parsed.userData.notifications)) {
        parsed.userData.notifications = parsed.userData.notifications.map((n: any) => 
          safeToString(n.id) === notificationId ? { ...n, isRead: true } : n
        );
        localStorage.setItem("UserData", JSON.stringify(parsed));
        setUserData(parsed.userData);
      }
    } catch (e) {
      console.error("Error marking notification as read:", e);
    }
  }, []);

  // Handle viewing notification
  const handleViewNotification = useCallback((notification: Notification) => {
    const currentUserId = getCurrentUserId();
    const trade = notification.matchedTrade;
    
    if (!trade) {
      // Try to use any pending trade
      const pendingTrade = allTrades.find(t => t.status === 'pending');
      if (pendingTrade) {
        const redirectUrl = getRedirectPage(pendingTrade, currentUserId || '');
        markNotificationAsRead(notification.id);
        router.push(redirectUrl);
        return;
      }
      
      alert("No related trade found. Please check your trades page.");
      return;
    }

    const redirectUrl = getRedirectPage(trade, currentUserId || '');
    markNotificationAsRead(notification.id);
    router.push(redirectUrl);
  }, [router, markNotificationAsRead, allTrades, getCurrentUserId]);

  // Filter buttons
  const filterButtons: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Trades", value: "trades" },
    { label: "Wallet", value: "wallet" },
    { label: "Others", value: "others" },
  ];

  // Dismiss notification
  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    try {
      const raw = localStorage.getItem("UserData");
      if (!raw) return;
      
      const parsed = JSON.parse(raw);
      if (parsed.userData && Array.isArray(parsed.userData.notifications)) {
        parsed.userData.notifications = parsed.userData.notifications.filter(
          (n: any) => safeToString(n.id) !== notificationId
        );
        localStorage.setItem("UserData", JSON.stringify(parsed));
        setUserData(parsed.userData);
      }
    } catch (e) {
      console.error("Error dismissing notification:", e);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    
    try {
      const raw = localStorage.getItem("UserData");
      if (!raw) return;
      
      const parsed = JSON.parse(raw);
      if (parsed.userData && Array.isArray(parsed.userData.notifications)) {
        parsed.userData.notifications = parsed.userData.notifications.map((n: any) => ({
          ...n,
          isRead: true
        }));
        localStorage.setItem("UserData", JSON.stringify(parsed));
        setUserData(parsed.userData);
      }
    } catch (e) {
      console.error("Error marking all as read:", e);
    }
  }, []);

  // Dismiss all notifications
  const dismissAllNotifications = useCallback(() => {
    setNotifications([]);
    
    try {
      const raw = localStorage.getItem("UserData");
      if (!raw) return;
      
      const parsed = JSON.parse(raw);
      if (parsed.userData) {
        parsed.userData.notifications = [];
        localStorage.setItem("UserData", JSON.stringify(parsed));
        setUserData(parsed.userData);
      }
    } catch (e) {
      console.error("Error dismissing all notifications:", e);
    }
  }, []);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "all") return true;
    if (activeFilter === "trades") {
      const type = safeToString(notification.type);
      const title = safeToString(notification.title).toLowerCase();
      const message = safeToString(notification.message).toLowerCase();
      return type.includes("TRADE") || 
             title.includes("trade") ||
             message.includes("trade") ||
             !!notification.matchedTrade;
    }
    if (activeFilter === "wallet") {
      const type = safeToString(notification.type);
      const title = safeToString(notification.title).toLowerCase();
      const message = safeToString(notification.message).toLowerCase();
      return type.includes("WALLET") || 
             title.includes("wallet") ||
             message.includes("deposit") ||
             message.includes("withdraw");
    }
    return true;
  });

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Nav />
      </div>

      {/* Page Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
          <div className="flex gap-4">
            {notifications.length > 0 && (
              <>
                <button
                  onClick={markAllAsRead}
                  className="text-sm text-[#4DF2BE] hover:underline hover:text-[#3DD2A5] transition-colors"
                >
                  Mark all as read
                </button>
                <button
                  onClick={dismissAllNotifications}
                  className="text-sm text-red-400 hover:underline hover:text-red-300 transition-colors"
                >
                  Dismiss all
                </button>
              </>
            )}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-[#111214] rounded-xl p-1 mb-8 text-sm">
          {filterButtons.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setActiveFilter(value)}
              className={`py-2.5 px-1 rounded-lg font-medium transition-colors duration-200 ${
                activeFilter === value
                  ? "bg-[#4DF2BE] text-black"
                  : "text-gray-300 hover:text-white hover:bg-[#1A1B1E]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Date Label */}
        {filteredNotifications.length > 0 && (
          <p className="text-sm text-gray-400 mb-4">Today</p>
        )}

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1A1B1E] flex items-center justify-center">
              <span className="text-2xl">🔔</span>
            </div>
            <p className="text-gray-400 text-lg mb-2">No notifications yet</p>
            <p className="text-gray-500 text-sm">
              Notifications will appear here when you have updates
            </p>
          </div>
        )}

        {/* Notification List */}
        <div className="flex flex-col gap-4">
          {filteredNotifications.map((notification, index) => {
            const trade = notification.matchedTrade;
            const userRole = notification.userRole || 'unknown';
            
            // Determine redirect page and button text
            let buttonText = 'View Trade';
            
            if (userRole === 'buyer') {
              buttonText = 'Go to Sell Page';
            } else if (userRole === 'seller') {
              buttonText = 'Go to Buy Page';
            }
            
            const tradeId = trade ? safeToString(trade.id || trade.tradeId || trade._id) : null;
            
            return (
              <div
                key={notification.id || `notif-${index}`}
                className={`bg-[#1A1B1E] p-4 sm:p-5 rounded-xl shadow-md border transition-colors duration-200 ${
                  notification.isRead 
                    ? 'border-[#2A2B2F] opacity-70' 
                    : 'border-[#4DF2BE] border-opacity-30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    notification.isRead ? 'bg-gray-500' :
                    trade?.status === 'completed' ? 'bg-green-500' :
                    trade?.status === 'cancelled' ? 'bg-red-500' :
                    trade?.status === 'disputed' ? 'bg-yellow-500' :
                    'bg-[#4DF2BE]'
                  }`} />

                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-sm sm:text-base">
                          {safeToString(notification.title)}
                          {notification.isRead && (
                            <span className="ml-2 text-xs text-gray-500">(read)</span>
                          )}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleViewNotification(notification)}
                          className="text-[#4DF2BE] text-xs sm:text-sm font-medium hover:underline hover:text-[#3DD2A5] transition-colors duration-200"
                        >
                          {buttonText}
                        </button>
                        <button 
                          onClick={() => dismissNotification(notification.id)}
                          className="text-gray-400 text-xs hover:text-red-400 transition-colors"
                          title="Dismiss"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mt-1">
                      {safeToString(notification.message)}
                    </p>
                    
                    {/* Show matched trade details */}
                    {trade && (
                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-[#2A2B2F] rounded">
                          Status: {trade.status}
                        </span>
                        {trade.amount && (
                          <span className="text-[10px] px-2 py-0.5 bg-[#2A2B2F] rounded">
                            ${trade.amount}
                          </span>
                        )}
                        {tradeId && (
                          <span className="text-[8px] px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded truncate max-w-[80px]">
                            ID: {tradeId.substring(0, Math.min(8, tradeId.length))}...
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Show if no trade matched */}
                    {!trade && (
                      <div className="mt-2">
                        <span className="text-[10px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                          ⚠ No trade match
                        </span>
                      </div>
                    )}
                    
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-2">
                      {safeToString(notification.timeAgo)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="w-[100%] h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
              
        <div className="mb-[80px] whitespace-nowrap mt-[10%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Bell_Notify;