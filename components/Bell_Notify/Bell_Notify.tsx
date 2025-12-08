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

// Get status display properties (color, label) based on actual trade status
const getStatusDisplay = (status: string) => {
  const statusLower = status.toLowerCase();
  
  // Check for completed status
  if (statusLower.includes('complete') || statusLower.includes('completed') || 
      statusLower.includes('finished') || statusLower.includes('done') || 
      statusLower.includes('released') || statusLower.includes('disbursed')) {
    return {
      label: status.toUpperCase(),
      bgColor: 'bg-green-500/20',
      textColor: 'text-green-400',
      borderColor: 'border-green-500/30'
    };
  }
  
  // Check for cancelled status
  if (statusLower.includes('cancel') || statusLower.includes('failed') || 
      statusLower.includes('rejected') || statusLower.includes('refunded')) {
    return {
      label: status.toUpperCase(),
      bgColor: 'bg-red-500/20',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/30'
    };
  }
  
  // Check for disputed status
  if (statusLower.includes('dispute')) {
    return {
      label: status.toUpperCase(),
      bgColor: 'bg-yellow-500/20',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/30'
    };
  }
  
  // Check for pending/in review status (buyer side)
  if (statusLower.includes('pending') || statusLower.includes('awaiting') || 
      statusLower === 'pending') {
    return {
      label: 'PENDING',
      bgColor: 'bg-blue-500/20',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/30'
    };
  }
  
  // Check for in review status
  if (statusLower.includes('review') || statusLower === 'inreview' || 
      statusLower === 'in_review') {
    return {
      label: 'IN REVIEW',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/30'
    };
  }
  
  // Check for seller awaiting payment status
  if (statusLower.includes('awaiting_payment') || statusLower === 'awaiting') {
    return {
      label: 'AWAITING PAYMENT',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400',
      borderColor: 'border-orange-500/30'
    };
  }
  
  // Default for unknown/other statuses
  return {
    label: status.toUpperCase(),
    bgColor: 'bg-gray-500/20',
    textColor: 'text-gray-300',
    borderColor: 'border-gray-500/30'
  };
};

// Format date to show only time for today, date for older
const formatNotificationTime = (dateString: string | Date | undefined): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const notificationDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    // If today, show time only (e.g., "14:30")
    if (notificationDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If yesterday
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (notificationDate.getTime() === yesterday.getTime()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // This week, show weekday and time
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return `${date.toLocaleDateString([], { weekday: 'short' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    
    // Older, show full date
    return date.toLocaleDateString([], { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return '';
  }
};

// Get date header for grouping
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
    
    // This week
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'long' });
    }
    
    // Older
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
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
  
  return groups;
};

// Find the exact matching trade
const findMatchingTrade = (notification: any, allTrades: Trade[], userId: string): Trade | null => {
  if (!notification || allTrades.length === 0) return null;
  
  console.log('Finding match for notification:', {
    notificationId: notification.id,
    notificationText: notification.title + ' ' + notification.message,
    allTradesCount: allTrades.length,
    userId
  });
  
  // 1. FIRST PRIORITY: Extract trade ID directly from notification
  let potentialTradeId: string | null = null;
  
  // Check metadata first
  if (notification.metadata?.tradeId) {
    potentialTradeId = safeToString(notification.metadata.tradeId);
  }
  // Check notification tradeId field
  else if (notification.tradeId) {
    potentialTradeId = safeToString(notification.tradeId);
  }
  // Try to extract from message/title
  else {
    const text = (safeToString(notification.title) + ' ' + safeToString(notification.message));
    // Look for patterns like "trade ID: XYZ" or "trade: XYZ"
    const tradeIdMatch = text.match(/(?:trade|id)[:\s]+([a-zA-Z0-9\-_]{6,})/i);
    if (tradeIdMatch && tradeIdMatch[1]) {
      potentialTradeId = tradeIdMatch[1];
    }
  }
  
  console.log('Extracted trade ID:', potentialTradeId);
  
  // 2. Try to match by extracted trade ID
  if (potentialTradeId) {
    const directMatch = allTrades.find(t => {
      const tId = safeToString(t.id || t.tradeId || t._id);
      return tId === potentialTradeId || tId.includes(potentialTradeId!) || potentialTradeId!.includes(tId);
    });
    
    if (directMatch) {
      console.log('Direct match found by ID:', directMatch.id);
      return directMatch;
    }
  }
  
  // 3. SECOND PRIORITY: Match by user involvement and relevant status
  if (userId) {
    // Find trades where current user is involved AND trade is in relevant status
    const userRelevantTrades = allTrades.filter(t => {
      const buyerId = safeToString(t.buyerId || t.buyer);
      const sellerId = safeToString(t.sellerId || t.seller);
      const isUserInvolved = buyerId === userId || sellerId === userId;
      
      // Check if status indicates an active/ongoing trade
      const status = t.status.toLowerCase();
      const isRelevantStatus = status.includes('pending') || 
                               status.includes('review') ||
                               status.includes('awaiting') ||
                               status.includes('active') ||
                               status.includes('processing');
      
      return isUserInvolved && isRelevantStatus;
    });
    
    if (userRelevantTrades.length === 1) {
      console.log('Found single relevant trade for user:', userRelevantTrades[0].id);
      return userRelevantTrades[0];
    }
    
    // If multiple relevant trades, return most recent
    if (userRelevantTrades.length > 0) {
      const mostRecent = userRelevantTrades.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )[0];
      console.log('Found multiple relevant trades, using most recent:', mostRecent.id);
      return mostRecent;
    }
  }
  
  // 4. THIRD PRIORITY: Match by amount mentioned in notification
  const notificationText = (safeToString(notification.title) + ' ' + safeToString(notification.message));
  const amountMatch = notificationText.match(/\$(\d+(?:\.\d{1,2})?)/) || notificationText.match(/(\d+(?:\.\d{1,2})?)\s*(?:USD|usd)/);
  
  if (amountMatch && amountMatch[1]) {
    const amount = parseFloat(amountMatch[1]);
    
    const amountMatchTrade = allTrades.find(t => {
      // Check if amounts are close (within 0.01)
      return Math.abs(t.amount - amount) < 0.01;
    });
    
    if (amountMatchTrade) {
      console.log('Matched by amount:', amount, 'found trade:', amountMatchTrade.id);
      return amountMatchTrade;
    }
  }
  
  // 5. FOURTH PRIORITY: Return most recent active trade
  const activeTrades = allTrades.filter(t => {
    const status = t.status.toLowerCase();
    return status.includes('pending') || 
           status.includes('review') ||
           status.includes('awaiting') ||
           status.includes('active');
  });
  
  if (activeTrades.length > 0) {
    const mostRecentActive = activeTrades.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    console.log('Using most recent active trade:', mostRecentActive.id);
    return mostRecentActive;
  }
  
  // 6. LAST RESORT: Return most recent trade
  if (allTrades.length > 0) {
    const mostRecent = allTrades.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
    console.log('Using most recent trade:', mostRecent.id);
    return mostRecent;
  }
  
  console.log('No match found');
  return null;
};

// Get trade ID safely
const getTradeId = (trade: Trade | null | undefined): string | null => {
  if (!trade) return null;
  
  // Return in order of preference
  return trade.id || trade.tradeId || trade._id || null;
};

// Get redirect page
const getRedirectPage = (
  trade: Trade, 
  currentUserId: string,
  userData: any
): string => {
  const tradeId = getTradeId(trade);
  if (!tradeId) {
    console.error('No trade ID found for trade:', trade);
    return '/trades';
  }
  
  const buyerId = safeToString(trade.buyerId || trade.buyer);
  const sellerId = safeToString(trade.sellerId || trade.seller);
  const currentUserIdStr = safeToString(currentUserId);
  
  console.log('🚀 REDIRECT DEBUG:', {
    tradeId,
    tradeBuyerId: buyerId,
    tradeSellerId: sellerId,
    currentUserId: currentUserIdStr,
    tradeStatus: trade.status,
    tradeType: trade.type,
    isBuyer: buyerId === currentUserIdStr,
    isSeller: sellerId === currentUserIdStr,
    fullTrade: trade
  });
  
  // Check if current user is the buyer
  if (buyerId === currentUserIdStr) {
    console.log('✅ User is BUYER, redirecting to buyer page');
    return `/prc_buy?tradeId=${tradeId}`;
  }
  
  // Check if current user is the seller
  if (sellerId === currentUserIdStr) {
    console.log('✅ User is SELLER, redirecting to seller page');
    return `/prc_sell?tradeId=${tradeId}`;
  }
  
  // Fallback logic based on trade type
  console.log('⚠ User role not clear from IDs, using fallback logic');
  
  // If trade has type field, use it
  if (trade.type === 'buy' && userData) {
    // If it's a buy trade, current user might be the seller
    const userTradesAsSeller = Array.isArray(userData.tradesAsSeller) ? userData.tradesAsSeller : [];
    const isInSellerTrades = userTradesAsSeller.some((t: any) => {
      const tId = getTradeId(t);
      return tId === tradeId;
    });
    
    if (isInSellerTrades) {
      console.log('✅ User found in seller trades, redirecting to seller page');
      return `/prc_sell?tradeId=${tradeId}`;
    }
  } else if (trade.type === 'sell' && userData) {
    // If it's a sell trade, current user might be the buyer
    const userTradesAsBuyer = Array.isArray(userData.tradesAsBuyer) ? userData.tradesAsBuyer : [];
    const isInBuyerTrades = userTradesAsBuyer.some((t: any) => {
      const tId = getTradeId(t);
      return tId === tradeId;
    });
    
    if (isInBuyerTrades) {
      console.log('✅ User found in buyer trades, redirecting to buyer page');
      return `/prc_buy?tradeId=${tradeId}`;
    }
  }
  
  // Default to buyer page
  console.log('⚠ Defaulting to buyer page');
  return `/prc_buy?tradeId=${tradeId}`;
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
          const userDataObj = parsed.userData;
          setUserData(userDataObj);
          const userId = userDataObj.id || userDataObj.userId || userDataObj._id;

          console.log('📊 Loading user data:', {
            userId,
            hasNotifications: Array.isArray(userDataObj.notifications),
            notificationCount: Array.isArray(userDataObj.notifications) ? userDataObj.notifications.length : 0
          });

          // Load trades
          const buyerTrades: Trade[] = Array.isArray(userDataObj.tradesAsBuyer) 
            ? userDataObj.tradesAsBuyer 
            : [];
          
          const sellerTrades: Trade[] = Array.isArray(userDataObj.tradesAsSeller) 
            ? userDataObj.tradesAsSeller 
            : [];
          
          const combinedTrades = [...buyerTrades, ...sellerTrades];
          
          console.log('📈 Loaded trades:', {
            buyerTrades: buyerTrades.length,
            sellerTrades: sellerTrades.length,
            combinedTrades: combinedTrades.length,
            sampleTrades: combinedTrades.slice(0, 3).map(t => ({
              id: t.id,
              tradeId: t.tradeId,
              status: t.status, // This is where the actual status comes from
              tradingStatus: (t as any).tradingStatus,
              buyerId: t.buyerId,
              sellerId: t.sellerId,
              amount: t.amount,
              type: t.type
            }))
          });
          
          setAllTrades(combinedTrades);

          // Load and match notifications
          if (Array.isArray(userDataObj.notifications)) {
            const enhancedNotifications = userDataObj.notifications.map((n: any, index: number) => {
              const matchedTrade = findMatchingTrade(n, combinedTrades, userId);
              
              // Determine user role
              let userRole: 'buyer' | 'seller' | 'unknown' = 'unknown';
              if (matchedTrade && userId) {
                const buyerId = safeToString(matchedTrade.buyerId || matchedTrade.buyer);
                const sellerId = safeToString(matchedTrade.sellerId || matchedTrade.seller);
                const currentUserId = safeToString(userId);
                
                if (buyerId === currentUserId) {
                  userRole = 'buyer';
                } else if (sellerId === currentUserId) {
                  userRole = 'seller';
                } else {
                  // Check arrays as fallback
                  const isInBuyerTrades = buyerTrades.some(t => getTradeId(t) === getTradeId(matchedTrade));
                  const isInSellerTrades = sellerTrades.some(t => getTradeId(t) === getTradeId(matchedTrade));
                  
                  if (isInBuyerTrades) userRole = 'buyer';
                  else if (isInSellerTrades) userRole = 'seller';
                }
              }
              
              // Get notification creation time
              const notificationTime = n.createdAt || n.timestamp || n.date || n.timeAgo;
              const formattedTime = formatNotificationTime(notificationTime);
              
              // Get trade ID safely
              const tradeId = matchedTrade ? getTradeId(matchedTrade) : null;
              
              // Store original trade ID from notification if available
              const originalTradeId = n.tradeId || n.metadata?.tradeId;
              
              console.log(`🔔 Notification ${index}:`, {
                title: n.title,
                message: n.message,
                matchedTradeId: tradeId,
                originalTradeId,
                userRole,
                hasMatchedTrade: !!matchedTrade,
                matchedTradeStatus: matchedTrade?.status, // Using actual status from trade object
                matchedTradeTradingStatus: matchedTrade ? (matchedTrade as any).tradingStatus : null,
                matchedTradeType: matchedTrade?.type
              });
              
              return {
                id: safeToString(n.id) || `notif-${index}-${Date.now()}`,
                title: safeToString(n.title),
                message: safeToString(n.message),
                timeAgo: formattedTime,
                type: n.type ? safeToString(n.type) : undefined,
                tradeId: tradeId || undefined,
                metadata: n.metadata,
                isRead: n.isRead || false,
                matchedTrade: matchedTrade || undefined,
                userRole: userRole,
                originalTradeId: originalTradeId ? safeToString(originalTradeId) : undefined,
                createdAt: notificationTime
              };
            });
            
            // Sort notifications by date (most recent first)
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
            console.log('✅ Loaded notifications:', sortedNotifications.length);
          }
        }
      } catch (err) {
        console.error("❌ Error loading UserData", err);
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
    
    console.log('👁 Viewing notification:', {
      notificationId: notification.id,
      notificationTitle: notification.title,
      hasMatchedTrade: !!trade,
      matchedTradeId: trade ? getTradeId(trade) : null,
      currentUserId,
      userRole: notification.userRole
    });
    
    if (!trade) {
      // Try to use original trade ID from notification
      if (notification.originalTradeId) {
        console.log('⚠ No matched trade, trying with original trade ID:', notification.originalTradeId);
        const redirectUrl = `/prc_buy?tradeId=${notification.originalTradeId}`;
        markNotificationAsRead(notification.id);
        router.push(redirectUrl);
        return;
      }
      
      alert("No related trade found. Please check your trades page.");
      return;
    }

    const redirectUrl = getRedirectPage(trade, currentUserId || '', userData);
    markNotificationAsRead(notification.id);
    console.log('➡ Redirecting to:', redirectUrl);
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
                    
                    // Get status display using actual trade status
                    const statusDisplay = trade ? getStatusDisplay(trade.status) : getStatusDisplay('unknown');
                    
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
                            statusDisplay.bgColor.replace('bg-', 'bg-').split('/')[0]
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
                                {/* Status badge using actual trade status */}
                                <span className={`text-[10px] px-2 py-0.5 rounded ${statusDisplay.bgColor} ${statusDisplay.textColor}`}>
                                  {statusDisplay.label}
                                </span>
                                
                                {/* Trade amount */}
                                {trade.amount && (
                                  <span className="text-[10px] px-2 py-0.5 bg-[#4DF2BE]/10 text-[#4DF2BE] rounded">
                                    ${trade.amount}
                                  </span>
                                )}
                                
                                {/* Trade ID */}
                                {tradeId && (
                                  <span className="text-[8px] px-2 py-0.5 bg-purple-500/10 text-purple-300 rounded truncate max-w-[80px]">
                                    ID: {tradeId.substring(0, Math.min(6, tradeId.length))}...
                                  </span>
                                )}
                                
                                {/* User role badge */}
                                <span className={`text-[10px] px-2 py-0.5 rounded ${
                                  userRole === 'buyer' ? 'bg-blue-500/10 text-blue-300' :
                                  userRole === 'seller' ? 'bg-green-500/10 text-green-300' :
                                  'bg-gray-500/10 text-gray-300'
                                }`}>
                                  {userRole.toUpperCase()}
                                </span>
                                
                                {/* Show status info */}
                                <span className="text-[8px] px-2 py-0.5 bg-gray-500/10 text-gray-400 rounded">
                                  Status: {trade.status.toUpperCase()}
                                </span>
                              </div>
                            )}
                            
                            {/* Show timestamp */}
                            <div className="mt-2">
                              <p className="text-[10px] sm:text-xs text-gray-500">
                                {notification.timeAgo}
                              </p>
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