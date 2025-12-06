"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'NEW_TRADE_REQUEST' | 'TRADE_ACCEPTED' | 'TRADE_REJECTED' | 'PAYMENT_SENT' | 'PAYMENT_RECEIVED' | 'TRADE_COMPLETED' | 'TRADE_CANCELLED' | 'SYSTEM';
  tradeId: string;
  offerId: string;
  initiatorId: string;
  initiatorUsername: string;
  amountFiat: number;
  amountCrypto: number;
  currency: string;
  crypto: string;
  message: string;
  read: boolean;
  createdAt: Date;
  recipientId: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  sendNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => string | null;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  checkForNewNotifications: () => void;
  refreshNotifications: () => void;
  saveTradeToLocalStorage: (trade: any) => any;
  getTradesFromLocalStorage: () => Record<string, any>;
  getUnreadTradeRequests: () => Notification[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATION_STORAGE_KEY = 'evolve2p_notifications';
const TRADES_STORAGE_KEY = 'evolve2p_trades';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const getCurrentUserFromStorage = useCallback((): string | null => {
    try {
      if (typeof window === "undefined") return null;
      
      const userData = localStorage.getItem('UserData');
      if (!userData) return null;
      
      const parsed = JSON.parse(userData);
      
      // Try various possible ID locations
      let userId = null;
      
      if (parsed.userData?.id) userId = parsed.userData.id;
      else if (parsed.data?.id) userId = parsed.data.id;
      else if (parsed.id) userId = parsed.id;
      else if (parsed.user?.id) userId = parsed.user.id;
      else if (parsed._id) userId = parsed._id;
      else if (parsed.userId) userId = parsed.userId;
      else if (parsed.userData?._id) userId = parsed.userData._id;
      
      return userId ? String(userId).trim() : null;
    } catch (error) {
      console.error('Error getting user from storage:', error);
      return null;
    }
  }, []);

  const initializeStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    
    try {
      if (!localStorage.getItem(NOTIFICATION_STORAGE_KEY)) {
        localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify({}));
      }
      if (!localStorage.getItem(TRADES_STORAGE_KEY)) {
        localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify({}));
      }
    } catch (error) {
      console.error("Error initializing storage:", error);
    }
  }, []);

  const loadNotifications = useCallback(() => {
    try {
      const userId = getCurrentUserFromStorage();
      
      if (!userId) {
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const allNotifications = JSON.parse(
        localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
      );

      const userNotifications: any[] = allNotifications[userId] || [];
      
      const parsedNotifications = userNotifications
        .filter(notif => notif && typeof notif === 'object')
        .map(notif => ({
          id: notif.id || `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          type: notif.type || 'SYSTEM',
          tradeId: notif.tradeId || '',
          offerId: notif.offerId || '',
          initiatorId: notif.initiatorId || '',
          initiatorUsername: notif.initiatorUsername || 'Unknown User',
          amountFiat: typeof notif.amountFiat === 'number' ? notif.amountFiat : 0,
          amountCrypto: typeof notif.amountCrypto === 'number' ? notif.amountCrypto : 0,
          currency: notif.currency || 'USD',
          crypto: notif.crypto || 'BTC',
          message: notif.message || 'Notification',
          read: Boolean(notif.read),
          createdAt: notif.createdAt ? new Date(notif.createdAt) : new Date(),
          recipientId: notif.recipientId || userId
        }))
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter(n => !n.read).length);
      
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [getCurrentUserFromStorage]);

  useEffect(() => {
    initializeStorage();
    
    const userId = getCurrentUserFromStorage();
    setCurrentUserId(userId);
    
    loadNotifications();
    
    const interval = setInterval(loadNotifications, 15000);
    return () => clearInterval(interval);
  }, [initializeStorage, getCurrentUserFromStorage, loadNotifications]);

  const sendNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): string | null => {
    try {
      if (!notification.recipientId?.trim()) {
        console.error("Invalid recipient ID");
        return null;
      }

      const newNotification: Notification = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        read: false
      };

      const allNotifications = JSON.parse(
        localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
      );

      if (!allNotifications[notification.recipientId]) {
        allNotifications[notification.recipientId] = [];
      }

      const recipientNotifications = allNotifications[notification.recipientId];
      const existingIndex = recipientNotifications.findIndex(
        (n: any) => n.tradeId === notification.tradeId && n.type === notification.type
      );
      
      if (existingIndex !== -1) recipientNotifications.splice(existingIndex, 1);
      
      recipientNotifications.unshift(newNotification);
      
      if (recipientNotifications.length > 100) {
        recipientNotifications.splice(100);
      }

      allNotifications[notification.recipientId] = recipientNotifications;
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(allNotifications));

      if (currentUserId === notification.recipientId) {
        setNotifications(prev => {
          const filtered = prev.filter(n => !(n.tradeId === notification.tradeId && n.type === notification.type));
          return [newNotification, ...filtered.slice(0, 99)];
        });
        setUnreadCount(prev => prev + 1);
      }

      return newNotification.id;
    } catch (error) {
      console.error("Error sending notification:", error);
      return null;
    }
  }, [currentUserId]);

  const saveTradeToLocalStorage = useCallback((trade: any) => {
    try {
      if (typeof window === "undefined") return null;
      
      const trades = JSON.parse(localStorage.getItem(TRADES_STORAGE_KEY) || '{}');
      const tradeId = trade.id || trade._id || `trade_${Date.now()}`;
      
      const enhancedTrade = {
        ...trade,
        id: tradeId,
        createdAt: new Date().toISOString(),
        status: trade.status || 'PENDING',
        updatedAt: new Date().toISOString()
      };

      trades[tradeId] = enhancedTrade;
      localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades));
      
      return enhancedTrade;
    } catch (error) {
      console.error("Error saving trade:", error);
      return null;
    }
  }, []);

  const getTradesFromLocalStorage = useCallback(() => {
    try {
      if (typeof window === "undefined") return {};
      return JSON.parse(localStorage.getItem(TRADES_STORAGE_KEY) || '{}');
    } catch (error) {
      console.error("Error getting trades:", error);
      return {};
    }
  }, []);

  const getUnreadTradeRequests = useCallback(() => {
    return notifications.filter(notif => !notif.read && notif.type === 'NEW_TRADE_REQUEST');
  }, [notifications]);

  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setUnreadCount(0);
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
  }, []);

  const value = {
    notifications,
    unreadCount,
    sendNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    checkForNewNotifications: loadNotifications,
    refreshNotifications: loadNotifications,
    saveTradeToLocalStorage,
    getTradesFromLocalStorage,
    getUnreadTradeRequests
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    console.error("NotificationContext not found. Make sure NotificationProvider wraps your app.");
    // Return fallback functions to prevent crashes
    return {
      notifications: [],
      unreadCount: 0,
      sendNotification: () => {
        console.warn("sendNotification called without provider");
        return null;
      },
      markAsRead: () => {},
      markAllAsRead: () => {},
      clearNotifications: () => {},
      checkForNewNotifications: () => {},
      refreshNotifications: () => {},
      saveTradeToLocalStorage: (trade: any) => trade,
      getTradesFromLocalStorage: () => ({}),
      getUnreadTradeRequests: () => []
    } as NotificationContextType;
  }
  return context;
};