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
  originalTradeId?: string;
  createdAt?: string;
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

// Format date to readable string
const formatDateTime = (dateString: string | Date | undefined): string => {
  if (!dateString) return 'Unknown date';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    const now = new Date();
    
    // If today, show time only
    if (date.toDateString() === now.toDateString()) {
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // If yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Show full date and time
    return date.toLocaleDateString([], { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
    }) + `, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } catch (error) {
    return 'Invalid date';
  }
};

// Get date header for grouping notifications by date
const getDateHeader = (dateString: string | Date | undefined): string => {
  if (!dateString) return 'Older';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    
    if (isNaN(date.getTime())) return 'Older';
    
    // Today
    if (date.toDateString() === now.toDateString()) {
      return 'Today';
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // This week (last 7 days)
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    }
    
    // This year
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'long', day: 'numeric' });
    }
    
    // Older
    return date.toLocaleDateString([], { year: 'numeric', month: 'long', day: 'numeric' });
  } catch (error) {
    return 'Older';
  }
};

// Group notifications by date
const groupNotificationsByDate = (notifications: Notification[]): Record<string, Notification[]> => {
  const groups: Record<string, Notification[]> = {};
  
  notifications.forEach(notification => {
    const dateHeader = getDateHeader(notification.createdAt);
    
    if (!groups[dateHeader]) {
      groups[dateHeader] = [];
    }
    
    groups[dateHeader].push(notification);
  });
  
  // Sort groups in chronological order (Today -> Yesterday -> Weekdays -> Older dates)
  const sortedGroups: Record<string, Notification[]> = {};
  const order = ['Today', 'Yesterday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  
  // Add ordered groups first
  order.forEach(day => {
    if (groups[day]) {
      sortedGroups[day] = groups[day];
    }
  });
  
  // Add remaining groups (sorted dates)
  Object.keys(groups)
    .filter(day => !order.includes(day))
    .sort((a, b) => {
      // Try to parse as dates for comparison
      try {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateB.getTime() - dateA.getTime(); // Most recent first
      } catch {
        return a.localeCompare(b);
      }
    })
    .forEach(day => {
      sortedGroups[day] = groups[day];
    });
  
  return sortedGroups;
};

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

// Get trade ID safely
const getTradeId = (trade: Trade | null | undefined): string | null => {
  if (!trade) return null;
  
  if (trade.id) return trade.id;
  if (trade.tradeId) return trade.tradeId;
  if (trade._id) return trade._id;
  
  return null;
};

// Get redirect page - buyer goes to buyer page, seller goes to seller page
const getRedirectPage = (
  trade: Trade, 
  currentUserId: string,
  userData: any
): string => {
  const tradeId = getTradeId(trade);
  if (!tradeId) return '/trades';
  
  const buyerId = safeToString(trade.buyerId || trade.buyer);
  const sellerId = safeToString(trade.sellerId || trade.seller);
  
  console.log('Redirect Logic:', {
    currentUserId,
    buyerId,
    sellerId,
    tradeId,
    userIsBuyer: buyerId === currentUserId,
    userIsSeller: sellerId === currentUserId
  });
  
  // Buyer goes to buyer page
  if (buyerId === currentUserId) {
    return `/prc_buy?tradeId=${tradeId}`; // Buyer goes to buyer page
  }
  
  // Seller goes to seller page
  if (sellerId === currentUserId) {
    return `/prc_sell?tradeId=${tradeId}`; // Seller goes to seller page
  }
  
  // Fallback: check userData trades arrays
  if (userData) {
    const userTradesAsBuyer = Array.isArray(userData.tradesAsBuyer) ? userData.tradesAsBuyer : [];
    const userTradesAsSeller = Array.isArray(userData.tradesAsSeller) ? userData.tradesAsSeller : [];
    
    // Check if trade exists in user's tradesAsBuyer
    const isBuyer = userTradesAsBuyer.some((t: any) => {
      const tId = getTradeId(t);
      return tId === tradeId;
    });
    
    if (isBuyer) {
      return `/prc_buy?tradeId=${tradeId}`; // Buyer goes to buyer page
    }
    
    // Check if trade exists in user's tradesAsSeller
    const isSeller = userTradesAsSeller.some((t: any) => {
      const tId = getTradeId(t);
      return tId === tradeId;
    });
    
    if (isSeller) {
      return `/prc_sell?tradeId=${tradeId}`; // Seller goes to seller page
    }
  }
  
  // Default fallback to buyer page
  return `/prc_buy?tradeId=${tradeId}`;
};

// Fix notification text - REMOVED the text swapping since we're not swapping pages anymore
const fixNotificationText = (text: string, userRole: 'buyer' | 'seller' | 'unknown'): string => {
  // No text modification needed since buyer stays on buyer page and seller stays on seller page
  return text || '';
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
              
              // Get notification creation time
              const notificationTime = n.createdAt || n.timestamp || n.date || n.timeAgo;
              const formattedTime = formatDateTime(notificationTime);
              const timeAgo = safeToString(n.timeAgo) || formattedTime;
              
              // Get trade ID safely
              const tradeId = matchedTrade ? getTradeId(matchedTrade) : null;
              
              return {
                id: safeToString(n.id) || `notif-${index}-${Date.now()}`,
                title: safeToString(n.title),
                message: safeToString(n.message),
                timeAgo: timeAgo,
                type: n.type ? safeToString(n.type) : undefined,
                tradeId: tradeId || undefined,
                metadata: n.metadata,
                isRead: n.isRead || false,
                matchedTrade: matchedTrade || undefined,
                userRole: userRole,
                originalTradeId: n.tradeId || n.metadata?.tradeId,
                createdAt: notificationTime // Store the creation time for grouping
              };
            });
            
            // Sort notifications by date (most recent first) - FIXED: Added proper types
            const sortedNotifications = enhancedNotifications.sort((a: Notification, b: Notification) => {
              try {
                const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return dateB - dateA; // Most recent first
              } catch {
                return 0;
              }
            });
            
            setNotifications(sortedNotifications);
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

  const getCurrentUserId = useCallback((): string | null => {
    return userData?.id || userData?.userId || userData?._id || null;
  }, [userData]);

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
      // Try to find any pending trade for this user
      const userPendingTrades = allTrades.filter(t => 
        t.status === 'pending' && 
        (safeToString(t.buyerId || t.buyer) === currentUserId || 
         safeToString(t.sellerId || t.seller) === currentUserId)
      );
      
      if (userPendingTrades.length > 0) {
        const latestPendingTrade = userPendingTrades.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0];
        
        const redirectUrl = getRedirectPage(latestPendingTrade, currentUserId || '', userData);
        markNotificationAsRead(notification.id);
        router.push(redirectUrl);
        return;
      }
      
      alert("No related trade found. Please check your trades page.");
      return;
    }

    // Use the dynamic trade ID from the matched trade
    const redirectUrl = getRedirectPage(trade, currentUserId || '', userData);
    markNotificationAsRead(notification.id);
    router.push(redirectUrl);
  }, [router, markNotificationAsRead, allTrades, getCurrentUserId, userData]);

  const filterButtons: { label: string; value: FilterType }[] = [
    { label: "All", value: "all" },
    { label: "Trades", value: "trades" },
    { label: "Wallet", value: "wallet" },
    { label: "Others", value: "others" },
  ];

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

  // Group notifications by date
  const groupedNotifications = groupNotificationsByDate(filteredNotifications);

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

        {/* Notification List with Date Grouping */}
        {filteredNotifications.length > 0 && (
          <div className="flex flex-col gap-6">
            {Object.entries(groupedNotifications).map(([dateHeader, dateNotifications]) => (
              <div key={dateHeader} className="space-y-4">
                {/* Date Header */}
                <div className="sticky top-0 z-10 bg-[#0F1012] py-2">
                  <p className="text-sm font-medium text-gray-400">{dateHeader}</p>
                </div>
                
                {/* Notifications for this date */}
                <div className="space-y-4">
                  {dateNotifications.map((notification, index) => {
                    const trade = notification.matchedTrade;
                    const userRole = notification.userRole || 'unknown';
                    const tradeId = getTradeId(trade);
                    
                    // Determine button text based on user role
                    let buttonText = 'View Trade';
                    if (userRole === 'buyer') {
                      buttonText = 'Go to Buyer Page';
                    } else if (userRole === 'seller') {
                      buttonText = 'Go to Seller Page';
                    }
                    
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
                                <span className="text-[10px] px-2 py-0.5 bg-blue-500/10 text-blue-300 rounded">
                                  {userRole.toUpperCase()}
                                </span>
                              </div>
                            )}
                            
                            {/* Show if no trade matched */}
                            {!trade && notification.originalTradeId && (
                              <div className="mt-2">
                                <span className="text-[10px] px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded">
                                  ⚠ Using original trade ID
                                </span>
                                <span className="text-[8px] px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded truncate max-w-[80px] ml-2">
                                  ID: {notification.originalTradeId.substring(0, Math.min(8, notification.originalTradeId.length))}...
                                </span>
                              </div>
                            )}
                            
                            {/* Show detailed timestamp */}
                            <div className="flex justify-between items-center mt-2">
                              <p className="text-[10px] sm:text-xs text-gray-500">
                                {formatDateTime(notification.createdAt)}
                              </p>
                              <span className="text-[10px] text-gray-600">
                                {notification.timeAgo}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="w-[100%] h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
              
        <div className="mb-[80px] whitespace-nowrap mt-[10%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Bell_Notify;