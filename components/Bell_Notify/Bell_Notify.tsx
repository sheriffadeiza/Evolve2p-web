"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Nav from "../NAV/Nav";
import Footer from "../Footer/Footer";

interface Notification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type?: string;
  tradeId?: string;
}

type FilterType = "all" | "trades" | "wallet" | "others";

const Bell_Notify = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");

  useEffect(() => {
    try {
      const raw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const userData = parsed.userData;

      if (userData && Array.isArray(userData.notifications)) {
        setNotifications(userData.notifications);
      }
    } catch (err) {
      console.error("Error loading notifications", err);
    }
  }, []);

  // CRITICAL FUNCTION: Determine where to redirect based on notification content
  const handleViewNotification = useCallback((notification: Notification) => {
    console.log("Viewing notification:", notification);
    
    const tradeId = notification.tradeId;
    
    if (!tradeId) {
      console.error("No trade ID in notification");
      alert("Cannot open trade: Missing trade ID");
      return;
    }

    // Extract user role from notification message
    const message = notification.message.toLowerCase();
    const title = notification.title.toLowerCase();
    
    // LOGIC: Determine if current user is buyer or seller for this trade
    if (message.includes("buy") || message.includes("buyer") || 
        title.includes("buy") || title.includes("buyer")) {
      // If notification mentions "buy", the OTHER PARTY (who receives this notification) is the SELLER
      console.log(`Redirecting SELLER to /prc_sell?tradeId=${tradeId}`);
      router.push(`/prc_sell?tradeId=${tradeId}`);
    } 
    else if (message.includes("sell") || message.includes("seller") || 
             title.includes("sell") || title.includes("seller")) {
      // If notification mentions "sell", the OTHER PARTY (who receives this notification) is the BUYER
      console.log(`Redirecting BUYER to /prc_buy?tradeId=${tradeId}`);
      router.push(`/prc_buy?tradeId=${tradeId}`);
    }
    else if (notification.type === "NEW_TRADE_REQUEST") {
      // For new trade requests, the recipient is typically the SELLER
      console.log(`NEW_TRADE_REQUEST: Redirecting SELLER to /prc_sell?tradeId=${tradeId}`);
      router.push(`/prc_sell?tradeId=${tradeId}`);
    }
    else if (notification.type === "TRADE_ACCEPTED") {
      // For trade accepted, the recipient is typically the BUYER
      console.log(`TRADE_ACCEPTED: Redirecting BUYER to /prc_buy?tradeId=${tradeId}`);
      router.push(`/prc_buy?tradeId=${tradeId}`);
    }
    else {
      // Default to buyer page as fallback
      console.log(`Default: Redirecting to /prc_buy?tradeId=${tradeId}`);
      router.push(`/prc_buy?tradeId=${tradeId}`);
    }
  }, [router]);

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Trades", value: "trades" },
    { label: "Wallet", value: "wallet" },
    { label: "Others", value: "others" },
  ];

  // Mark notification as read
  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    
    // Update localStorage
    const raw = localStorage.getItem("UserData");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.userData && Array.isArray(parsed.userData.notifications)) {
          parsed.userData.notifications = parsed.userData.notifications.filter(
            (n: Notification) => n.id !== notificationId
          );
          localStorage.setItem("UserData", JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("Error updating notifications:", e);
      }
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(() => {
    setNotifications([]);
    
    // Update localStorage
    const raw = localStorage.getItem("UserData");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (parsed.userData) {
          parsed.userData.notifications = [];
          localStorage.setItem("UserData", JSON.stringify(parsed));
        }
      } catch (e) {
        console.error("Error clearing notifications:", e);
      }
    }
  }, []);

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === "all") return true;
    if (activeFilter === "trades") {
      return notification.type?.includes("TRADE") || 
             notification.title.toLowerCase().includes("trade") ||
             notification.message.toLowerCase().includes("trade") ||
             !!notification.tradeId;
    }
    if (activeFilter === "wallet") {
      return notification.type?.includes("WALLET") || 
             notification.title.toLowerCase().includes("wallet") ||
             notification.message.toLowerCase().includes("deposit") ||
             notification.message.toLowerCase().includes("withdraw");
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
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-[#1A1B1E] p-4 sm:p-5 rounded-xl shadow-md border border-[#2A2B2F] hover:border-[#3A3B3F] transition-colors duration-200"
            >
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-[#4DF2BE] rounded-full mt-1" />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-sm sm:text-base truncate">
                      {notification.title}
                    </p>
                    {notification.tradeId && (
                      <span className="text-[10px] bg-[#2A2B2F] text-gray-400 px-2 py-1 rounded ml-2">
                        Trade
                      </span>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] sm:text-xs text-gray-500">
                      {notification.timeAgo}
                    </p>
                    {notification.tradeId && (
                      <span className="text-[10px] text-gray-400">
                        ID: {notification.tradeId.slice(0, 8)}...
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => handleViewNotification(notification)}
                  className="text-[#4DF2BE] text-xs sm:text-sm font-medium hover:underline whitespace-nowrap hover:text-[#3DD2A5] transition-colors duration-200 px-3 py-1 bg-[#2A2B2F] rounded-lg hover:bg-[#3A3B3F]"
                >
                  View Trade
                </button>
              </div>
              
              {/* Dismiss button */}
              <div className="flex justify-end mt-3 pt-3 border-t border-[#2A2B2F]">
                <button
                  onClick={() => markNotificationAsRead(notification.id)}
                  className="text-xs text-gray-400 hover:text-white px-3 py-1 hover:bg-[#2A2B2F] rounded transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Divider & Footer */}
        <div className="w-[100%] h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
                
                <div className="mb-[80px] whitespace-nowrap mt-[10%]">
                  <Footer />
                </div>
      </div>
    </main>
  );
};

export default Bell_Notify;