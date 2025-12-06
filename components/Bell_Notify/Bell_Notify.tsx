// components/Bell_Notify.tsx
"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Less_than from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import ArrowRight from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import notificationService, { NotificationData } from "../../utils/notificationService";

const NOTIFICATION_CONFIG: Record<string, { 
  title: string; 
  icon: string; 
  color: string; 
  borderColor: string; 
  bgColor: string;
}> = {
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
    bgColor: "#352E21"
  },
  PAYMENT_RECEIVED: {
    title: "Payment Received",
    icon: "💸",
    color: "#FFC051",
    borderColor: "#FFC051",
    bgColor: "#352E21"
  },
  TRADE_DECLINED: {
    title: "Trade Declined",
    icon: "❌",
    color: "#FE857D",
    borderColor: "#FE857D",
    bgColor: "#342827"
  },
  TRADE_CANCELLED: {
    title: "Trade Cancelled",
    icon: "⛔",
    color: "#FE857D",
    borderColor: "#FE857D",
    bgColor: "#342827"
  },
  DISPUTE_OPENED: {
    title: "Dispute Opened",
    icon: "⚖️",
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

const DEFAULT_CONFIG = {
  title: "Notification",
  icon: "🔔",
  color: "#4DF2BE",
  borderColor: "#4DF2BE",
  bgColor: "#2D2D2D"
};

const Bell_Notify: React.FC = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'trade'>('all');
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Load notifications
  const loadNotifications = useCallback(() => {
    setLoading(true);
    try {
      const allNotifications = notificationService.getNotifications();
      setNotifications(allNotifications);
      setUnreadCount(notificationService.getUnreadCount());
      setLastUpdate(Date.now());
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark notification as read
  const handleMarkAsRead = useCallback((notificationId: string) => {
    notificationService.markAsRead(notificationId);
    loadNotifications();
  }, [loadNotifications]);

  // Mark all as read
  const handleMarkAllAsRead = useCallback(() => {
    notificationService.markAllAsRead();
    loadNotifications();
  }, [loadNotifications]);

  // Clear all notifications
  const handleClearAllNotifications = useCallback(() => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      notificationService.clearAllNotifications();
      loadNotifications();
    }
  }, [loadNotifications]);

  // Handle notification click
  const handleNotificationClick = useCallback((notification: NotificationData) => {
    // Mark as read
    if (!notification.read) {
      handleMarkAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.tradeId) {
      // Get current user to determine if they're buyer or seller
      const userData = localStorage.getItem('UserData');
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          const user = parsed.userData || parsed.data || parsed.user || parsed;
          const userId = user.id || user._id || user.userId;
          
          if (notification.type === 'NEW_TRADE_REQUEST') {
            // If user is initiator, go to seller page, else buyer page
            if (userId === notification.initiatorId) {
              router.push(`/prc_sell?tradeId=${notification.tradeId}`);
            } else {
              router.push(`/prc_buy?tradeId=${notification.tradeId}`);
            }
          } else if (notification.type === 'PAYMENT_SENT') {
            // Seller receives payment sent notification
            router.push(`/prc_sell?tradeId=${notification.tradeId}`);
          } else if (notification.type === 'TRADE_COMPLETED') {
            // Buyer receives trade completed notification
            router.push(`/prc_buy?tradeId=${notification.tradeId}`);
          } else if (notification.type === 'DISPUTE_OPENED') {
            // Both parties go to their respective trade pages
            if (userId === notification.initiatorId) {
              router.push(`/prc_sell?tradeId=${notification.tradeId}`);
            } else {
              router.push(`/prc_buy?tradeId=${notification.tradeId}`);
            }
          }
        } catch (error) {
          console.error('Error parsing user data:', error);
          router.push(`/prc_buy?tradeId=${notification.tradeId}`);
        }
      }
    } else if (notification.offerId) {
      router.push(`/offer/${notification.offerId}`);
    }
  }, [router, handleMarkAsRead]);

  // Format time
  const formatTime = useCallback((dateString: string): string => {
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
  }, []);

  // Get filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter(notification => {
      if (activeFilter === 'unread') return !notification.read;
      if (activeFilter === 'trade') {
        return [
          'NEW_TRADE_REQUEST', 
          'PAYMENT_SENT', 
          'TRADE_COMPLETED', 
          'TRADE_CANCELLED',
          'DISPUTE_OPENED'
        ].includes(notification.type);
      }
      return true;
    });
  }, [notifications, activeFilter]);

  // Get unread trade count
  const unreadTradeCount = useMemo(() => {
    return notifications.filter(n => 
      !n.read && [
        'NEW_TRADE_REQUEST',
        'PAYMENT_SENT',
        'TRADE_COMPLETED',
        'TRADE_CANCELLED',
        'DISPUTE_OPENED'
      ].includes(n.type)
    ).length;
  }, [notifications]);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();

    // Listen for storage events (updates from other tabs)
    const handleStorageChange = () => {
      loadNotifications();
    };

    // Listen for custom notification events
    const handleNotificationUpdate = () => {
      loadNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('notification-updated', handleNotificationUpdate);
    window.addEventListener('bell-notification-update', handleNotificationUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notification-updated', handleNotificationUpdate);
      window.removeEventListener('bell-notification-update', handleNotificationUpdate);
    };
  }, [loadNotifications]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [loadNotifications]);

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
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-[#1B362B] text-[#1ECB84] rounded-lg text-sm font-medium hover:bg-[#1A4030] transition-colors flex items-center gap-2"
            >
              <span className="text-lg">✅</span>
              Mark All as Read
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAllNotifications}
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
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => {
              const config = NOTIFICATION_CONFIG[notification.type] || DEFAULT_CONFIG;
              const isUnread = !notification.read;
              
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-[#222222] rounded-xl p-4 cursor-pointer hover:bg-[#2A2A2A] transition-all duration-200 border-l-4 ${
                    isUnread ? 'bg-[#1A1A1A] shadow-lg' : 'opacity-80'
                  }`}
                  style={{ borderLeftColor: config.borderColor }}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isUnread ? 'bg-[#2D2D2D]' : 'bg-[#3A3A3A]'
                    }`}>
                      <span className="text-2xl" style={{ color: config.color }}>
                        {config.icon}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <p className="font-bold text-white text-sm">
                              {config.title}
                            </p>
                            {isUnread && (
                              <span className="w-2 h-2 bg-[#4DF2BE] rounded-full flex-shrink-0"></span>
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed ${isUnread ? 'text-white' : 'text-[#C7C7C7]'}`}>
                            {notification.message}
                          </p>
                          {notification.initiatorUsername && (
                            <p className="text-xs text-[#8F8F8F] mt-1">
                              From: {notification.initiatorUsername}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <span className="text-xs text-[#8F8F8F] whitespace-nowrap">
                            {formatTime(notification.createdAt)}
                          </span>
                          {isUnread && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-xs text-[#4DF2BE] hover:text-[#3DD2A5] transition-colors"
                            >
                              Mark read
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Trade Details */}
                      {(notification.type === 'NEW_TRADE_REQUEST' || 
                        notification.type === 'PAYMENT_SENT' ||
                        notification.type === 'TRADE_COMPLETED') && 
                        notification.amountFiat && notification.amountCrypto && (
                        <div className="mt-4 p-3 bg-[#2D2D2D] rounded-lg border border-[#3A3A3A]">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-[#C7C7C7] mb-1">Amount</p>
                              <p className="text-white font-medium text-sm">
                                {notification.amountFiat?.toLocaleString()} {notification.currency}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-[#C7C7C7] mb-1">Crypto</p>
                              <p className="text-[#4DF2BE] font-medium text-sm">
                                {notification.amountCrypto} {notification.crypto}
                              </p>
                            </div>
                          </div>
                          {notification.tradeId && (
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-[#4DF2BE] font-medium">
                                  View Trade
                                </span>
                                <Image src={ArrowRight} alt="arrow" width={12} height={12} />
                              </div>
                            </div>
                          )}
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

        {/* Stats Footer */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 p-4 bg-[#222222] rounded-lg border border-[#2D2D2D]">
            <div className="flex flex-wrap items-center justify-between text-sm text-[#C7C7C7]">
              <div className="flex items-center gap-6">
                <span>Total: <span className="text-[#4DF2BE] font-medium">{notifications.length}</span></span>
                <span>Unread: <span className="text-[#1ECB84] font-medium">{unreadCount}</span></span>
                <span>Trade Notifications: <span className="text-[#FFC051] font-medium">{unreadTradeCount}</span></span>
              </div>
              <span className="text-xs text-[#8F8F8F]">
                Updated: {new Date(lastUpdate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Bell_Notify;