"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Less_than from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import ArrowRight from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";

interface Notification {
  id: string;
  type: "NEW_TRADE_REQUEST" | "PAYMENT_SENT" | "PAYMENT_RECEIVED" | "TRADE_ACCEPTED" | "TRADE_DECLINED" | "TRADE_COMPLETED" | "SYSTEM";
  tradeId?: string;
  offerId?: string;
  initiatorId?: string;
  initiatorUsername?: string;
  amountFiat?: number;
  amountCrypto?: number;
  currency?: string;
  crypto?: string;
  message?: string;
  recipientId?: string;
  recipientUsername?: string; // Added recipient info
  createdAt: string;
  read: boolean;
  // Added fields for better trade tracking
  isBuyer?: boolean;
  isSeller?: boolean;
  tradeStatus?: string;
}

interface NotificationConfig {
  title: string;
  icon: string;
  color: string;
  borderColor: string;
  bgColor: string;
}

type NotificationType = Notification['type'];

const NOTIFICATION_CONFIG: Record<NotificationType, NotificationConfig> = {
  NEW_TRADE_REQUEST: {
    title: "New Trade Request",
    icon: "💰",
    color: "#1ECB84",
    borderColor: "#1ECB84",
    bgColor: "#1B362B"
  },
  TRADE_ACCEPTED: {
    title: "Trade Accepted",
    icon: "✅",
    color: "#4DF2BE",
    borderColor: "#4DF2BE",
    bgColor: "#1B362B"
  },
  TRADE_COMPLETED: {
    title: "Trade Completed",
    icon: "🎉",
    color: "#4DF2BE",
    borderColor: "#4DF2BE",
    bgColor: "#1B362B"
  },
  PAYMENT_SENT: {
    title: "Payment Sent",
    icon: "💸",
    color: "#FFC051",
    borderColor: "#FFC051",
    bgColor: "#342827"
  },
  PAYMENT_RECEIVED: {
    title: "Payment Received",
    icon: "💸",
    color: "#FFC051",
    borderColor: "#FFC051",
    bgColor: "#342827"
  },
  TRADE_DECLINED: {
    title: "Trade Declined",
    icon: "❌",
    color: "#FE857D",
    borderColor: "#FE857D",
    bgColor: "#342827"
  },
  SYSTEM: {
    title: "System Notification",
    icon: "🔔",
    color: "#8B5CF6",
    borderColor: "#8B5CF6",
    bgColor: "#2D2D2D"
  }
};

const DEFAULT_CONFIG: NotificationConfig = {
  title: "Notification",
  icon: "🔔",
  color: "#4DF2BE",
  borderColor: "#4DF2BE",
  bgColor: "#2D2D2D"
};

const Bell_Notify: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'trade'>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Get current user ID
  const getCurrentUserId = useCallback((): string | null => {
    try {
      const userData = localStorage.getItem("UserData");
      if (!userData) return null;
      
      const parsed = JSON.parse(userData);
      return parsed.userData?.id || parsed.id || parsed._id;
    } catch (error) {
      console.error("Error getting current user ID:", error);
      return null;
    }
  }, []);

  // Get current username
  const getCurrentUsername = useCallback((): string | null => {
    try {
      const userData = localStorage.getItem("UserData");
      if (!userData) return null;
      
      const parsed = JSON.parse(userData);
      return parsed.userData?.username || parsed.username || null;
    } catch (error) {
      console.error("Error getting current username:", error);
      return null;
    }
  }, []);

  // Load notifications from userData with enhanced trade info
  const loadNotifications = useCallback(() => {
    if (typeof window !== "undefined") {
      try {
        const userData = localStorage.getItem("UserData");
        if (!userData) {
          setNotifications([]);
          setUnreadCount(0);
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(userData);
        const userNotifs = parsed?.userData?.notifications || parsed?.notifications || [];
        const currentUserId = getCurrentUserId();
        const currentUsername = getCurrentUsername();
        
        // Enhance notifications with user role info
        const enhancedNotifs = userNotifs.map((n: Notification) => {
          const notification = { ...n };
          
          // For trade requests, determine if user is initiator or recipient
          if (notification.type === "NEW_TRADE_REQUEST") {
            const isInitiator = notification.initiatorId === currentUserId;
            const isRecipient = notification.recipientId === currentUserId;
            
            notification.isBuyer = !isInitiator; // Recipient is usually the buyer
            notification.isSeller = isInitiator; // Initiator is usually the seller
            
            // Ensure recipientUsername exists
            if (!notification.recipientUsername && currentUsername && isRecipient) {
              notification.recipientUsername = currentUsername;
            }
          }
          
          return notification;
        });
        
        // Sort by newest first
        const sorted = [...enhancedNotifs].sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setNotifications(sorted);
        setUnreadCount(sorted.filter((n: Notification) => !n.read).length);
        setLoading(false);
      } catch (error) {
        console.error("Error loading notifications:", error);
        setLoading(false);
      }
    }
  }, [getCurrentUserId, getCurrentUsername]);

  useEffect(() => {
    loadNotifications();

    const interval = setInterval(loadNotifications, 10000);
    
    if (typeof window !== "undefined") {
      window.addEventListener("storage", loadNotifications);
    }

    return () => {
      clearInterval(interval);
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", loadNotifications);
      }
    };
  }, [loadNotifications]);

  const updateNotifications = useCallback((updater: (notifs: Notification[]) => Notification[]) => {
    if (typeof window !== "undefined") {
      const userData = localStorage.getItem("UserData");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          const currentNotifs = parsed?.userData?.notifications || parsed?.notifications || [];
          const updated = updater(currentNotifs);

          if (parsed.userData) {
            parsed.userData.notifications = updated;
          } else {
            parsed.notifications = updated;
          }
          localStorage.setItem("UserData", JSON.stringify(parsed));

          // Sort by newest first
          const sorted = [...updated].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          setNotifications(sorted);
          setUnreadCount(sorted.filter(n => !n.read).length);
        } catch (error) {
          console.error("Error updating notifications:", error);
        }
      }
    }
  }, []);

  const markAsRead = (notificationId: string) => {
    updateNotifications(notifs => 
      notifs.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    updateNotifications(notifs => notifs.map(n => ({ ...n, read: true })));
  };

  const clearAllNotifications = () => {
    if (typeof window !== "undefined" && window.confirm("Are you sure you want to clear all notifications?")) {
      updateNotifications(() => []);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    if (notification.type === "NEW_TRADE_REQUEST" && notification.tradeId) {
      const userId = getCurrentUserId();
      
      // Determine the correct route based on user role
      let tradeRoute = "";
      
      if (notification.initiatorId === userId) {
        // User is the initiator (seller in most cases)
        tradeRoute = "/prc_sell";
      } else if (notification.recipientId === userId) {
        // User is the recipient (buyer in most cases)
        tradeRoute = "/prc_buy";
      } else {
        // Fallback to default
        tradeRoute = userId === notification.initiatorId ? "/prc_sell" : "/prc_buy";
      }
      
      router.push(`${tradeRoute}?tradeId=${notification.tradeId}`);
    }
  };

  const formatTime = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return "Recently";
    }
  };

  const getNotificationMessage = (notification: Notification): string => {
    const currentUserId = getCurrentUserId();
    const isInitiator = notification.initiatorId === currentUserId;
    
    switch (notification.type) {
      case 'NEW_TRADE_REQUEST':
        if (isInitiator) {
          return `You requested to trade ${notification.amountFiat} ${notification.currency} for ${notification.amountCrypto} ${notification.crypto} with ${notification.recipientUsername || 'a user'}`;
        } else {
          return `${notification.initiatorUsername} wants to trade ${notification.amountFiat} ${notification.currency} for ${notification.amountCrypto} ${notification.crypto} with you`;
        }
      case 'TRADE_ACCEPTED':
        return "Your trade request has been accepted";
      case 'TRADE_DECLINED':
        return "Your trade request was declined";
      case 'PAYMENT_SENT':
        return "Payment has been sent for your trade";
      case 'PAYMENT_RECEIVED':
        return "Payment has been received";
      case 'TRADE_COMPLETED':
        return "Trade has been completed successfully";
      case 'SYSTEM':
        return notification.message || "System notification";
      default:
        return notification.message || "New notification";
    }
  };

  const getTradeStatusLabel = (notification: Notification): string => {
    const currentUserId = getCurrentUserId();
    const isInitiator = notification.initiatorId === currentUserId;
    
    if (isInitiator) {
      return "Waiting for response";
    } else {
      return "Action required";
    }
  };

  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (activeFilter === 'unread') return !notification.read;
      if (activeFilter === 'trade') return notification.type === 'NEW_TRADE_REQUEST';
      return true;
    });
  }, [notifications, activeFilter]);

  const unreadTradeCount = notifications.filter(n => !n.read && n.type === 'NEW_TRADE_REQUEST').length;

  // FULL PAGE NOTIFICATIONS VIEW
  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Back Button */}
        <div
          className="flex items-center mt-5 gap-2 text-sm lg:text-base font-medium text-white cursor-pointer mb-6 hover:text-[#4DF2BE] transition-colors"
          onClick={() => router.back()}
        >
          <Image src={Less_than} alt="back" className="w-4 h-4" />
          <p>Back</p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Notifications</h1>
            <button
              onClick={loadNotifications}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-[#4DF2BE] hover:text-[#3DD2A5] disabled:opacity-50 transition-colors"
            >
              <span className={`w-4 h-4 inline-block ${loading ? 'animate-spin' : ''}`}>
                ↻
              </span>
              Refresh
            </button>
          </div>
          <p className="text-[#C7C7C7]">
            {unreadCount > 0
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up! No new notifications'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === 'all'
                ? 'bg-[#4DF2BE] text-[#0F1012]'
                : 'bg-[#2D2D2D] text-[#C7C7C7] hover:text-white'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === 'unread'
                ? 'bg-[#4DF2BE] text-[#0F1012]'
                : 'bg-[#2D2D2D] text-[#C7C7C7] hover:text-white'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setActiveFilter('trade')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap relative ${
              activeFilter === 'trade'
                ? 'bg-[#4DF2BE] text-[#0F1012]'
                : 'bg-[#2D2D2D] text-[#C7C7C7] hover:text-white'
            }`}
          >
            Trade Requests
            {unreadTradeCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF4757] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadTradeCount > 9 ? '9+' : unreadTradeCount}
              </span>
            )}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-8">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 bg-[#1B362B] text-[#1ECB84] rounded-lg text-sm font-medium hover:bg-[#1A4030] transition-colors flex items-center gap-2"
            >
              <span className="text-lg">✅</span>
              Mark All as Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={clearAllNotifications}
              className="px-4 py-2 bg-[#342827] text-[#FE857D] rounded-lg text-sm font-medium hover:bg-[#2A1F1F] transition-colors flex items-center gap-2"
            >
              <span className="text-lg">🗑️</span>
              Clear All
            </button>
          )}
          <button
            onClick={() => router.push("/market_place")}
            className="px-4 py-2 bg-[#2D2D2D] text-[#4DF2BE] rounded-lg text-sm font-medium hover:bg-[#3A3A3A] transition-colors flex items-center gap-2"
          >
            <span className="text-lg">🔍</span>
            Browse Marketplace
          </button>
        </div>

        {/* Notifications List */}
        {!loading && (
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => {
                const config = NOTIFICATION_CONFIG[notification.type] || DEFAULT_CONFIG;
                const currentUserId = getCurrentUserId();
                const isInitiator = notification.initiatorId === currentUserId;
                const isTradeRequest = notification.type === 'NEW_TRADE_REQUEST';
                
                return (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`bg-[#222222] rounded-xl p-4 cursor-pointer hover:bg-[#2A2A2A] transition-all duration-200 border-l-4 ${
                      notification.read ? 'opacity-70' : 'bg-[#1A1A1A] shadow-lg'
                    }`}
                    style={{ borderLeftColor: config?.borderColor || "#4DF2BE" }}
                  >
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.read ? 'bg-[#3A3A3A]' : 'bg-[#2D2D2D]'
                      }`}>
                        <span className="text-2xl" style={{ color: config?.color || "#4DF2BE" }}>
                          {config?.icon || "🔔"}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1 flex-wrap">
                              <p className="font-bold text-white text-sm">
                                {config?.title || "Notification"}
                              </p>
                              {isTradeRequest && (
                                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                  isInitiator 
                                    ? 'bg-[#1B362B] text-[#1ECB84]' 
                                    : 'bg-[#342827] text-[#FFC051]'
                                }`}>
                                  {isInitiator ? 'You initiated' : 'Requested'}
                                </span>
                              )}
                              {!notification.read && (
                                <span className="w-2 h-2 bg-[#4DF2BE] rounded-full flex-shrink-0"></span>
                              )}
                            </div>
                            <p className={`text-sm leading-relaxed ${notification.read ? 'text-[#C7C7C7]' : 'text-white'}`}>
                              {getNotificationMessage(notification)}
                            </p>
                          </div>

                          <div className="flex flex-col items-end gap-2 flex-shrink-0">
                            <span className="text-xs text-[#8F8F8F] whitespace-nowrap">
                              {formatTime(notification.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Trade Details */}
                        {notification.type === 'NEW_TRADE_REQUEST' && (
                          <div className="mt-4 p-3 bg-[#2D2D2D] rounded-lg border border-[#3A3A3A]">
                            <div className="grid grid-cols-2 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-[#C7C7C7] mb-1">Fiat Amount</p>
                                <p className="text-white font-medium text-sm">
                                  {notification.amountFiat?.toLocaleString()} {notification.currency}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-[#C7C7C7] mb-1">Crypto Amount</p>
                                <p className="text-[#4DF2BE] font-medium text-sm">
                                  {notification.amountCrypto} {notification.crypto}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between">
                              <div>
                                <span className="text-xs text-[#C7C7C7]">
                                  {getTradeStatusLabel(notification)}
                                </span>
                                <p className="text-xs text-[#8F8F8F] mt-1">
                                  {isInitiator ? 'Waiting for other party' : 'Your action required'}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#4DF2BE] font-medium">
                                  {isInitiator ? 'Monitor Trade' : 'Review Trade'}
                                </span>
                                <Image src={ArrowRight} alt="arrow" width={12} height={12} />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Empty State
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-[#2D2D2D] flex items-center justify-center">
                  <span className="text-4xl">🔔</span>
                </div>
                <h3 className="text-xl font-medium text-white mb-2">No notifications</h3>
                <p className="text-[#C7C7C7] max-w-md mx-auto mb-6">
                  {activeFilter === 'unread'
                    ? "You've read all your notifications"
                    : activeFilter === 'trade'
                    ? "No trade requests at the moment"
                    : "You don't have any notifications yet"}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push("/market_place")}
                    className="px-6 py-3 bg-[#4DF2BE] text-[#0F1012] font-bold rounded-full hover:bg-[#3DD2A5] transition-colors"
                  >
                    Browse Marketplace
                  </button>
                  <button
                    onClick={() => router.push("/create-offer")}
                    className="px-6 py-3 bg-[#2D2D2D] text-white font-bold rounded-full hover:bg-[#3A3A3A] transition-colors border border-[#4A4A4A]"
                  >
                    Create Offer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4DF2BE] mb-4"></div>
            <p className="text-[#C7C7C7]">Loading notifications...</p>
          </div>
        )}

        {/* Stats Footer */}
        {filteredNotifications.length > 0 && !loading && (
          <div className="mt-8 p-4 bg-[#222222] rounded-lg border border-[#2D2D2D]">
            <div className="flex flex-wrap items-center justify-between text-sm text-[#C7C7C7]">
              <div className="flex items-center gap-6">
                <span>Total: <span className="text-[#4DF2BE] font-medium">{notifications.length}</span></span>
                <span>Unread: <span className="text-[#1ECB84] font-medium">{unreadCount}</span></span>
                <span>Trade Requests: <span className="text-[#FFC051] font-medium">{unreadTradeCount}</span></span>
              </div>
              <span className="text-xs text-[#8F8F8F]">
                Updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Bell_Notify;