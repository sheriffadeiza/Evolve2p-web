// Context/provider.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface Notification {
  id: string;
  type: 'NEW_TRADE_REQUEST' | 'TRADE_ACCEPTED' | 'PAYMENT_SENT' | 'SYSTEM';
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
  sendNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  checkForNewNotifications: () => void;
  saveTradeToLocalStorage: (trade: any) => any;
  getTradesFromLocalStorage: () => Record<string, any>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATION_STORAGE_KEY = 'evolve2p_notifications';
const TRADES_STORAGE_KEY = 'evolve2p_trades';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user from localStorage
  const getCurrentUserFromStorage = useCallback(() => {
    try {
      const userData = localStorage.getItem('UserData');
      if (userData) {
        const parsed = JSON.parse(userData);
        const userId = parsed.id || parsed._id || parsed.userId;
        setCurrentUserId(userId);
        return userId;
      }
    } catch (error) {
      console.error('Error getting user from storage:', error);
    }
    return null;
  }, []);

  // Initialize storage
  const initializeStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    
    if (!localStorage.getItem(NOTIFICATION_STORAGE_KEY)) {
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(TRADES_STORAGE_KEY)) {
      localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify({}));
    }
  }, []);

  // Load notifications for current user
  const loadNotifications = useCallback(() => {
    const userId = getCurrentUserFromStorage();
    if (!userId) return;

    try {
      const allNotifications = JSON.parse(
        localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
      );

      const userNotifications: Notification[] = allNotifications[userId] || [];
      
      const parsedNotifications = userNotifications.map(notif => ({
        ...notif,
        createdAt: new Date(notif.createdAt),
        id: notif.id || Date.now().toString() + Math.random().toString(36).substr(2, 9)
      }));

      setNotifications(parsedNotifications);
      setUnreadCount(parsedNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [getCurrentUserFromStorage]);

  // Initialize
  useEffect(() => {
    initializeStorage();
    loadNotifications();
    
    // Check for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [initializeStorage, loadNotifications]);

  // Listen for storage changes
  useEffect(() => {
    const handleStorageChange = () => {
      loadNotifications();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadNotifications]);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Send notification to another user
  const sendNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => {
    try {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        createdAt: new Date(),
        read: false
      };

      // Save notification in recipient's storage
      const allNotifications = JSON.parse(
        localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
      );

      const recipientNotifications = allNotifications[notification.recipientId] || [];
      recipientNotifications.unshift(newNotification);
      
      // Keep only last 100 notifications
      if (recipientNotifications.length > 100) {
        recipientNotifications.pop();
      }

      allNotifications[notification.recipientId] = recipientNotifications;
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(allNotifications));

      // Trigger browser notification if recipient is current user
      if (currentUserId === notification.recipientId) {
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('New Trade Request', {
            body: notification.message,
            icon: '/favicon.ico',
            tag: 'trade-notification'
          });
        }
      }

      // Also update current user's notifications if recipient is current user
      if (currentUserId === notification.recipientId) {
        setNotifications(prev => [newNotification, ...prev]);
        setUnreadCount(prev => prev + 1);
      }

      console.log("✅ Notification sent successfully:", newNotification);
      return true;
    } catch (error) {
      console.error("❌ Error sending notification:", error);
      return false;
    }
  }, [currentUserId]);

  // Save trade to localStorage
  const saveTradeToLocalStorage = useCallback((trade: any) => {
    try {
      const trades = JSON.parse(localStorage.getItem(TRADES_STORAGE_KEY) || '{}');
      const tradeId = trade.id || trade._id || `trade_${Date.now()}`;
      
      const enhancedTrade = {
        ...trade,
        id: tradeId,
        createdAt: new Date().toISOString(),
        status: 'PENDING',
        updatedAt: new Date().toISOString()
      };

      trades[tradeId] = enhancedTrade;
      localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify(trades));
      
      console.log("💾 Trade saved to localStorage:", enhancedTrade);
      return enhancedTrade;
    } catch (error) {
      console.error("❌ Error saving trade to localStorage:", error);
      return null;
    }
  }, []);

  // Get trades from localStorage
  const getTradesFromLocalStorage = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem(TRADES_STORAGE_KEY) || '{}');
    } catch (error) {
      console.error("❌ Error getting trades from localStorage:", error);
      return {};
    }
  }, []);

  // Mark notification as read
  const markAsRead = useCallback((notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );

    setUnreadCount(prev => Math.max(0, prev - 1));

    // Update in localStorage
    const updatedNotifications = notifications.map(notif =>
      notif.id === notificationId ? { ...notif, read: true } : notif
    );

    if (currentUserId) {
      const allNotifications = JSON.parse(
        localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
      );
      allNotifications[currentUserId] = updatedNotifications;
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(allNotifications));
    }
  }, [notifications, currentUserId]);

  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);

    if (currentUserId) {
      const allNotifications = JSON.parse(
        localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
      );
      allNotifications[currentUserId] = updatedNotifications;
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(allNotifications));
    }
  }, [notifications, currentUserId]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);

    if (currentUserId) {
      const allNotifications = JSON.parse(
        localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
      );
      allNotifications[currentUserId] = [];
      localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(allNotifications));
    }
  }, [currentUserId]);

  const checkForNewNotifications = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        sendNotification,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        checkForNewNotifications,
        saveTradeToLocalStorage,
        getTradesFromLocalStorage,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};