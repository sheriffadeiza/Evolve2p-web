"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Nav from "../NAV/Nav";
import Footer from "../Footer/Footer";

interface Trade {
  id: string;
  type: "buy" | "sell";
  sellerId?: string;
  buyerId?: string;
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
}

type FilterType = "all" | "trades" | "wallet" | "others";

// Helper to safely convert any value to string for rendering
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

const Bell_Notify = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    const loadUserData = () => {
      try {
        const raw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
        if (!raw) return;

        const parsed = JSON.parse(raw);
        setUserData(parsed.userData);

        // Load notifications
        if (parsed.userData && Array.isArray(parsed.userData.notifications)) {
          const sanitizedNotifications = parsed.userData.notifications.map((n: any) => ({
            id: safeToString(n.id),
            title: safeToString(n.title),
            message: safeToString(n.message),
            timeAgo: safeToString(n.timeAgo),
            type: n.type ? safeToString(n.type) : undefined,
            tradeId: n.tradeId ? safeToString(n.tradeId) : undefined,
            metadata: n.metadata
          }));
          setNotifications(sanitizedNotifications);
        }

        // Load trades from UserData
        if (parsed.userData && Array.isArray(parsed.userData.trades)) {
          setTrades(parsed.userData.trades);
        }
      } catch (err) {
        console.error("Error loading UserData", err);
      }
    };

    loadUserData();
  }, []);

  // Get trade details by tradeId
  const getTradeById = useCallback((tradeId: string): Trade | null => {
    return trades.find(trade => trade.id === tradeId) || null;
  }, [trades]);

  // Get current user ID
  const getCurrentUserId = useCallback((): string | null => {
    return userData?.id || null;
  }, [userData]);

  // Determine the correct page to redirect to based on user's role in trade
  const getRedirectUrl = useCallback((trade: Trade, notification: Notification): string => {
    const currentUserId = getCurrentUserId();
    if (!currentUserId) return `/prc_buy?tradeId=${trade.id}`;
    
    const message = safeToString(notification.message).toLowerCase();
    const title = safeToString(notification.title).toLowerCase();
    
    // Logic to determine if user is buyer or seller
    if (trade.buyerId === currentUserId) {
      // Current user is the buyer
      return `/prc_buy?tradeId=${trade.id}`;
    } else if (trade.sellerId === currentUserId) {
      // Current user is the seller
      return `/prc_sell?tradeId=${trade.id}`;
    } else {
      // Fallback based on notification type
      if (notification.type === "NEW_TRADE_REQUEST" || 
          message.includes("wants to buy") ||
          message.includes("buy from you") ||
          title.includes("buy request")) {
        return `/prc_sell?tradeId=${trade.id}`;
      } else {
        return `/prc_buy?tradeId=${trade.id}`;
      }
    }
  }, [getCurrentUserId]);

  // Handle viewing notification
  const handleViewNotification = useCallback((notification: Notification) => {
    console.log("Viewing notification:", notification);
    
    let tradeId = notification.tradeId;
    
    if (!tradeId && notification.metadata?.tradeId) {
      tradeId = safeToString(notification.metadata.tradeId);
    }
    
    if (!tradeId) {
      console.error("No trade ID in notification");
      alert("Cannot open trade: Missing trade ID");
      return;
    }

    // Get trade data from UserData
    const trade = getTradeById(tradeId);
    
    if (trade) {
      // If we have trade data, use it to determine the correct page
      const redirectUrl = getRedirectUrl(trade, notification);
      router.push(redirectUrl);
    } else {
      // Fallback to notification-based logic
      const message = safeToString(notification.message).toLowerCase();
      const title = safeToString(notification.title).toLowerCase();
      
      if (notification.type === "NEW_TRADE_REQUEST" || 
          message.includes("wants to buy") ||
          message.includes("buy from you") ||
          title.includes("buy request")) {
        router.push(`/prc_sell?tradeId=${tradeId}`);
      } 
      else if (notification.type === "TRADE_CREATED" ||
              message.includes("you requested to buy") ||
              message.includes("sell to you") ||
              title.includes("sell request")) {
        router.push(`/prc_buy?tradeId=${tradeId}`);
      }
      else {
        router.push(`/prc_buy?tradeId=${tradeId}`);
      }
    }
  }, [router, getTradeById, getRedirectUrl]);

  // Filter buttons
  const filterButtons: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Trades", value: "trades" },
    { label: "Wallet", value: "wallet" },
    { label: "Others", value: "others" },
  ];

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
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
      console.error("Error updating notifications:", e);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
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
      console.error("Error clearing notifications:", e);
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
             !!notification.tradeId;
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
          {notifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm text-[#4DF2BE] hover:underline hover:text-[#3DD2A5] transition-colors"
            >
              Mark all as read
            </button>
          )}
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
          {filteredNotifications.map((notification) => {
            const trade = notification.tradeId ? getTradeById(notification.tradeId) : null;
            const currentUserId = getCurrentUserId();
            const isBuyer = trade?.buyerId === currentUserId;
            const isSeller = trade?.sellerId === currentUserId;
            
            return (
              <div
                key={notification.id}
                className="bg-[#1A1B1E] p-4 sm:p-5 rounded-xl shadow-md border border-[#2A2B2F] hover:border-[#3A3B3F] transition-colors duration-200"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    trade?.status === 'completed' ? 'bg-green-500' :
                    trade?.status === 'cancelled' ? 'bg-red-500' :
                    trade?.status === 'disputed' ? 'bg-yellow-500' :
                    'bg-[#4DF2BE]'
                  }`} />

                  <div className="flex-1">
                    <p className="font-semibold text-sm sm:text-base">
                      {safeToString(notification.title)}
                    </p>
                    
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {safeToString(notification.message)}
                    </p>
                    
                    {/* Show trade details if available */}
                    {trade && (
                      <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="text-[10px] px-2 py-0.5 bg-[#2A2B2F] rounded">
                          Status: {trade.status}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-[#2A2B2F] rounded">
                          Amount: ${trade.amount}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-[#2A2B2F] rounded">
                          Price: ${trade.price}
                        </span>
                        {isBuyer && (
                          <span className="text-[10px] px-2 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                            You are Buyer
                          </span>
                        )}
                        {isSeller && (
                          <span className="text-[10px] px-2 py-0.5 bg-green-500/20 text-green-400 rounded">
                            You are Seller
                          </span>
                        )}
                      </div>
                    )}
                    
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                      {safeToString(notification.timeAgo)}
                    </p>
                  </div>

                  <button 
                    onClick={() => handleViewNotification(notification)}
                    className="text-[#4DF2BE] text-xs sm:text-sm font-medium hover:underline whitespace-nowrap hover:text-[#3DD2A5] transition-colors duration-200"
                  >
                    {trade ? "View Trade" : "View"}
                  </button>
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