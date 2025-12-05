// app/notifications/page.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useNotifications } from "../../Context/provider";
import Nav from "../NAV/Nav";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Footer from "../Footer/Footer";
import Less_than from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import BellIcon from "../../public/Assets/Evolve2p_bell/elements.svg";
import CheckIcon from "../../public/Assets/Evolve2p_check/check.svg";
import ArrowRight from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";

const NotificationsPage = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    checkForNewNotifications
  } = useNotifications();
  
  const [activeFilter, setActiveFilter] = useState<'all' | 'unread' | 'trade'>('all');
  const router = useRouter();

  useEffect(() => {
    checkForNewNotifications();
  }, [checkForNewNotifications]);

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
        return '💸';
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
      case 'PAYMENT_SENT':
        return "text-[#FFC051]";
      case 'SYSTEM':
        return "text-[#4DF2BE]";
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
      case 'PAYMENT_SENT':
        return "border-l-[#FFC051]";
      case 'SYSTEM':
        return "border-l-[#4DF2BE]";
      default:
        return "border-l-[#4DF2BE]";
    }
  };

  // Format timestamp
  const formatTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  // Handle notification click
  const handleNotificationClick = (notification: any) => {
    markAsRead(notification.id);
    
    if (notification.type === 'NEW_TRADE_REQUEST' && notification.tradeId) {
      const userData = localStorage.getItem("UserData");
      if (userData) {
        const parsed = JSON.parse(userData);
        const userId = parsed.id || parsed._id;
        
        if (userId === notification.initiatorId) {
          router.push(`/prc_sell?tradeId=${notification.tradeId}`);
        } else {
          router.push(`/prc_buy?tradeId=${notification.tradeId}`);
        }
      }
    }
  };

  // Get notification message text
  const getNotificationMessage = (notification: any) => {
    switch (notification.type) {
      case 'NEW_TRADE_REQUEST':
        return `${notification.initiatorUsername} wants to trade ${notification.amountFiat} ${notification.currency} for ${notification.amountCrypto} ${notification.crypto}`;
      case 'TRADE_ACCEPTED':
        return `Your trade request has been accepted`;
      case 'PAYMENT_SENT':
        return `Payment has been sent for your trade`;
      case 'SYSTEM':
        return notification.message || "System notification";
      default:
        return notification.message;
    }
  };

  // Get notification title
  const getNotificationTitle = (notification: any) => {
    switch (notification.type) {
      case 'NEW_TRADE_REQUEST':
        return "New Trade Request";
      case 'TRADE_ACCEPTED':
        return "Trade Accepted";
      case 'PAYMENT_SENT':
        return "Payment Sent";
      case 'SYSTEM':
        return "System Notification";
      default:
        return "Notification";
    }
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
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">Notifications</h1>
          <p className="text-[#C7C7C7]">
            {unreadCount > 0 
              ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
              : 'All caught up! No new notifications'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'all'
                ? 'bg-[#4DF2BE] text-[#0F1012]'
                : 'bg-[#2D2D2D] text-[#C7C7C7] hover:text-white'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setActiveFilter('unread')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'unread'
                ? 'bg-[#4DF2BE] text-[#0F1012]'
                : 'bg-[#2D2D2D] text-[#C7C7C7] hover:text-white'
            }`}
          >
            Unread ({unreadCount})
          </button>
          <button
            onClick={() => setActiveFilter('trade')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeFilter === 'trade'
                ? 'bg-[#4DF2BE] text-[#0F1012]'
                : 'bg-[#2D2D2D] text-[#C7C7C7] hover:text-white'
            }`}
          >
            Trade Requests
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
              className="px-4 py-2 bg-[#342827] text-[#FE857D] rounded-lg text-sm font-medium hover:bg-[#2A1F1F] transition-colors"
            >
              Clear All
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className={`bg-[#222222] rounded-xl p-4 cursor-pointer hover:bg-[#2A2A2A] transition-colors border-l-4 ${getBorderColor(notification.type)} ${
                  notification.read ? 'opacity-70' : ''
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
                        <p className="font-bold text-white text-sm mb-1">
                          {getNotificationTitle(notification)}
                        </p>
                        <p className={`text-sm ${notification.read ? 'text-[#C7C7C7]' : 'text-white'}`}>
                          {getNotificationMessage(notification)}
                        </p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        {!notification.read && (
                          <div className="w-3 h-3 bg-[#4DF2BE] rounded-full flex-shrink-0"></div>
                        )}
                        <span className="text-xs text-[#8F8F8F] whitespace-nowrap">
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    {/* Trade Details for NEW_TRADE_REQUEST */}
                    {notification.type === 'NEW_TRADE_REQUEST' && (
                      <div className="mt-4 p-3 bg-[#2D2D2D] rounded-lg">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-xs text-[#C7C7C7]">Fiat Amount</p>
                            <p className="text-white font-medium">
                              {notification.amountFiat} {notification.currency}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-[#C7C7C7]">Crypto Amount</p>
                            <p className="text-[#4DF2BE] font-medium">
                              {notification.amountCrypto} {notification.crypto}
                            </p>
                          </div>
                        </div>
                        <button className="mt-3 text-xs text-[#4DF2BE] hover:text-[#3DD2A5] font-medium flex items-center gap-1">
                          View Trade Details
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
              <button
                onClick={() => router.push("/market_place")}
                className="px-6 py-3 bg-[#4DF2BE] text-[#0F1012] font-bold rounded-full hover:bg-[#3DD2A5] transition-colors"
              >
                Browse Marketplace
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="w-full h-px bg-white/20 my-12"></div>
        <div className="mb-20">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default NotificationsPage;