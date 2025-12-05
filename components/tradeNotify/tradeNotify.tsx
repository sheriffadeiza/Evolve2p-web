"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useNotifications } from "../../Context/provider";
import Nav from "../NAV/Nav";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "../Footer/Footer";
import Less_than from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import ArrowRight from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";

const TradeNotify = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    checkForNewNotifications,
    refreshNotifications
  } = useNotifications();
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'trade'>('all');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Load notifications on mount
  useEffect(() => {
    const loadNotifications = async () => {
      setLoading(true);
      try {
        await checkForNewNotifications();
      } catch (error) {
        console.error("Error loading notifications:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadNotifications();
    
    // Refresh notifications every 30 seconds
    const interval = setInterval(() => {
      refreshNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, [checkForNewNotifications, refreshNotifications]);

  // Filter notifications based on active filter
  const filteredNotifications = notifications.filter(notification => {
    if (activeFilter === 'unread') return !notification.read;
    if (activeFilter === 'trade') return notification.type === 'NEW_TRADE_REQUEST';
    return true;
  });

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_TRADE_REQUEST':
        return '💰';
      case 'TRADE_ACCEPTED':
        return '✅';
      case 'PAYMENT_SENT':
      case 'PAYMENT_RECEIVED':
        return '💸';
      case 'TRADE_COMPLETED':
        return '🎉';
      case 'TRADE_CANCELLED':
        return '❌';
      case 'TRADE_REJECTED':
        return '🚫';
      case 'SYSTEM':
        return '🔔';
      default:
        return '🔔';
    }
  };

  // Get icon color
  const getNotificationIconColor = (type: string) => {
    switch (type) {
      case 'NEW_TRADE_REQUEST':
        return "text-[#1ECB84]";
      case 'TRADE_ACCEPTED':
      case 'TRADE_COMPLETED':
        return "text-[#4DF2BE]";
      case 'PAYMENT_SENT':
      case 'PAYMENT_RECEIVED':
        return "text-[#FFC051]";
      case 'TRADE_CANCELLED':
      case 'TRADE_REJECTED':
        return "text-[#FE857D]";
      case 'SYSTEM':
        return "text-[#8B5CF6]";
      default:
        return "text-[#4DF2BE]";
    }
  };

  // Get border color
  const getBorderColor = (type: string) => {
    switch (type) {
      case 'NEW_TRADE_REQUEST':
        return "border-l-[#1ECB84]";
      case 'TRADE_ACCEPTED':
      case 'TRADE_COMPLETED':
        return "border-l-[#4DF2BE]";
      case 'PAYMENT_SENT':
      case 'PAYMENT_RECEIVED':
        return "border-l-[#FFC051]";
      case 'TRADE_CANCELLED':
      case 'TRADE_REJECTED':
        return "border-l-[#FE857D]";
      case 'SYSTEM':
        return "border-l-[#8B5CF6]";
      default:
        return "border-l-[#4DF2BE]";
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    try {
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (error) {
      return "Recently";
    }
  };

  // Get current user ID from localStorage
  const getCurrentUserId = useCallback((): string | null => {
    try {
      const userData = localStorage.getItem("UserData");
      if (!userData) return null;
      
      const parsed = JSON.parse(userData);
      // Extract user ID from various possible locations
      return parsed.userData?.id || parsed.id || parsed._id || parsed.userId;
    } catch (error) {
      console.error("Error getting current user ID:", error);
      return null;
    }
  }, []);

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    // Mark as read when clicked
    if (!notification.read) {
      markAsRead(notification.id);
    }
    
    // Handle navigation based on notification type
    if (notification.type === 'NEW_TRADE_REQUEST' && notification.tradeId) {
      const currentUserId = getCurrentUserId();
      
      if (currentUserId === notification.initiatorId) {
        // If current user initiated the trade, go to sell page
        router.push(`/prc_sell?tradeId=${notification.tradeId}`);
      } else {
        // If current user is the recipient, go to buy page
        router.push(`/prc_buy?tradeId=${notification.tradeId}`);
      }
    } else if (notification.tradeId) {
      // For other trade-related notifications, go to trade details
      router.push(`/trade-details?tradeId=${notification.tradeId}`);
    }
  };

  // Get notification message text
  const getNotificationMessage = (notification: any) => {
    switch (notification.type) {
      case 'NEW_TRADE_REQUEST':
        return `${notification.initiatorUsername} wants to trade ${notification.amountFiat} ${notification.currency} for ${notification.amountCrypto} ${notification.crypto}`;
      case 'TRADE_ACCEPTED':
        return `Your trade request has been accepted`;
      case 'TRADE_REJECTED':
        return `Your trade request was rejected`;
      case 'PAYMENT_SENT':
        return `Payment has been sent for your trade`;
      case 'PAYMENT_RECEIVED':
        return `Payment has been received`;
      case 'TRADE_COMPLETED':
        return `Trade has been completed successfully`;
      case 'TRADE_CANCELLED':
        return `Trade has been cancelled`;
      case 'SYSTEM':
        return notification.message || "System notification";
      default:
        return notification.message || "New notification";
    }
  };

  // Get notification title
  const getNotificationTitle = (notification: any) => {
    switch (notification.type) {
      case 'NEW_TRADE_REQUEST':
        return "New Trade Request";
      case 'TRADE_ACCEPTED':
        return "Trade Accepted";
      case 'TRADE_REJECTED':
        return "Trade Rejected";
      case 'PAYMENT_SENT':
        return "Payment Sent";
      case 'PAYMENT_RECEIVED':
        return "Payment Received";
      case 'TRADE_COMPLETED':
        return "Trade Completed";
      case 'TRADE_CANCELLED':
        return "Trade Cancelled";
      case 'SYSTEM':
        return "System Notification";
      default:
        return "Notification";
    }
  };

  // Refresh button handler
  const handleRefresh = () => {
    setLoading(true);
    refreshNotifications();
    setTimeout(() => setLoading(false), 500);
  };

  // Get unread trade requests count
  const getUnreadTradeRequestsCount = () => {
    return notifications.filter(n => !n.read && n.type === 'NEW_TRADE_REQUEST').length;
  };

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Nav />

        {/* Back Button */}
        <div className="flex items-center mt-[20px] gap-2 text-sm lg:text-base font-medium text-white cursor-pointer mb-6"
          onClick={() => router.back()}>
          <Image src={Less_than} alt="lessthan" className="w-4 h-4" />
          <p>Back</p>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Notifications</h1>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 text-sm text-[#4DF2BE] hover:text-[#3DD2A5] disabled:opacity-50"
            >
              <span className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}>
                {loading ? '⟳' : '↻'}
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
            {getUnreadTradeRequestsCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF4757] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {getUnreadTradeRequestsCount() > 9 ? '9+' : getUnreadTradeRequestsCount()}
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
              onClick={clearNotifications}
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

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4DF2BE] mb-4"></div>
            <p className="text-[#C7C7C7]">Loading notifications...</p>
          </div>
        )}

        {/* Notifications List */}
        {!loading && (
          <div className="space-y-4">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`bg-[#222222] rounded-xl p-4 cursor-pointer hover:bg-[#2A2A2A] transition-colors border-l-4 ${getBorderColor(notification.type)} ${
                    notification.read ? 'opacity-70' : 'bg-[#1A1A1A]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      notification.read ? 'bg-[#3A3A3A]' : 'bg-[#2D2D2D]'
                    }`}>
                      <span className={`text-2xl ${getNotificationIconColor(notification.type)}`}>
                        {getNotificationIcon(notification.type)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-white text-sm">
                              {getNotificationTitle(notification)}
                            </p>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-[#4DF2BE] rounded-full"></span>
                            )}
                          </div>
                          <p className={`text-sm ${notification.read ? 'text-[#C7C7C7]' : 'text-white'}`}>
                            {getNotificationMessage(notification)}
                          </p>
                        </div>
                        
                        <div className="flex flex-col items-end gap-2">
                          <span className="text-xs text-[#8F8F8F] whitespace-nowrap">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Trade Details for NEW_TRADE_REQUEST */}
                      {notification.type === 'NEW_TRADE_REQUEST' && (
                        <div className="mt-4 p-3 bg-[#2D2D2D] rounded-lg">
                          <div className="grid grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs text-[#C7C7C7] mb-1">Fiat Amount</p>
                              <p className="text-white font-medium text-sm">
                                {notification.amountFiat.toLocaleString()} {notification.currency}
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
                            <span className="text-xs text-[#C7C7C7]">
                              Click to view trade details
                            </span>
                            <button className="text-xs text-[#4DF2BE] hover:text-[#3DD2A5] font-medium flex items-center gap-1">
                              View Trade
                              <Image src={ArrowRight} alt="arrow" width={12} height={12} />
                            </button>
                          </div>
                        </div>
                      )}
                      
                      {/* Action buttons for other notification types */}
                      {notification.type !== 'NEW_TRADE_REQUEST' && notification.tradeId && (
                        <div className="mt-3 flex justify-end">
                          <button className="text-xs text-[#4DF2BE] hover:text-[#3DD2A5] font-medium flex items-center gap-1">
                            View Details
                            <Image src={ArrowRight} alt="arrow" width={12} height={12} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
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

        {/* Stats Footer */}
        {filteredNotifications.length > 0 && (
          <div className="mt-8 p-4 bg-[#222222] rounded-lg">
            <div className="flex flex-wrap items-center justify-between text-sm text-[#C7C7C7]">
              <div className="flex items-center gap-4">
                <span>Total: {notifications.length}</span>
                <span>Unread: {unreadCount}</span>
                <span>Trade Requests: {getUnreadTradeRequestsCount()}</span>
              </div>
              <button
                onClick={handleRefresh}
                className="text-[#4DF2BE] hover:text-[#3DD2A5] text-sm"
              >
                Last updated: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="w-full h-px bg-white/20 my-12"></div>
        <div className="mb-20">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default TradeNotify;