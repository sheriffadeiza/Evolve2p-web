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
  debugUserData: () => void;
  testNotification: (recipientId?: string) => string | null;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const NOTIFICATION_STORAGE_KEY = 'evolve2p_notifications';
const TRADES_STORAGE_KEY = 'evolve2p_trades';

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Get current user from localStorage with multiple fallbacks
  const getCurrentUserFromStorage = useCallback((): string | null => {
    try {
      if (typeof window === "undefined") return null;
      
      const userData = localStorage.getItem('UserData');
      if (!userData) {
        console.warn("⚠️ No UserData found in localStorage");
        return null;
      }
      
      const parsed = JSON.parse(userData);
      console.log("📊 Parsed UserData structure for ID extraction:", {
        root: parsed,
        userData: parsed.userData,
        data: parsed.data,
        user: parsed.user
      });
      
      // Try multiple possible ID locations
      const possibleIds = [
        parsed.userData?.id,
        parsed.userData?._id,
        parsed.userData?.userId,
        parsed.data?.id,
        parsed.data?._id,
        parsed.data?.userId,
        parsed.user?.id,
        parsed.user?._id,
        parsed.user?.userId,
        parsed.id,
        parsed._id,
        parsed.userId
      ];
      
      for (const id of possibleIds) {
        if (id && typeof id === 'string' && id.trim() !== '') {
          console.log("✅ Found user ID:", id);
          return id;
        }
      }
      
      console.warn("⚠️ No valid user ID found in any location");
      return null;
      
    } catch (error) {
      console.error('❌ Error getting user from storage:', error);
      return null;
    }
  }, []);

  // Debug function to show user data structure
  const debugUserData = useCallback(() => {
    try {
      if (typeof window === "undefined") return;
      
      const userData = localStorage.getItem("UserData");
      console.log("🔍 Raw UserData from localStorage:", userData);
      if (userData) {
        const parsed = JSON.parse(userData);
        console.log("🔍 Parsed UserData structure:", {
          root: parsed,
          userData: parsed.userData,
          data: parsed.data,
          user: parsed.user,
          allKeys: Object.keys(parsed),
          userDataKeys: parsed.userData ? Object.keys(parsed.userData) : [],
          dataKeys: parsed.data ? Object.keys(parsed.data) : []
        });
      }
    } catch (e) {
      console.error("Error debugging user data:", e);
    }
  }, []);

  // Initialize storage
  const initializeStorage = useCallback(() => {
    if (typeof window === "undefined") return;
    
    try {
      if (!localStorage.getItem(NOTIFICATION_STORAGE_KEY)) {
        localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify({}));
        console.log("📁 Initialized notifications storage");
      }
      if (!localStorage.getItem(TRADES_STORAGE_KEY)) {
        localStorage.setItem(TRADES_STORAGE_KEY, JSON.stringify({}));
        console.log("📁 Initialized trades storage");
      }
    } catch (error) {
      console.error("❌ Error initializing storage:", error);
    }
  }, []);

  // Load notifications for current user
  const loadNotifications = useCallback(() => {
    try {
      const userId = getCurrentUserFromStorage();
      
      if (!userId) {
        console.log("⚠️ No user ID, skipping notification load");
        setNotifications([]);
        setUnreadCount(0);
        return;
      }

      const allNotifications = JSON.parse(
        localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
      );

      console.log("📊 All notifications in storage for user", userId, ":", allNotifications[userId] || []);

      const userNotifications: any[] = allNotifications[userId] || [];
      
      // Parse notifications with validation
      const parsedNotifications = userNotifications
        .filter(notif => notif && typeof notif === 'object')
        .map(notif => {
          // Ensure required fields exist
          const notification: Notification = {
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
          };
          return notification;
        })
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()); // Sort by newest first

      setNotifications(parsedNotifications);
      
      const unread = parsedNotifications.filter(n => !n.read).length;
      setUnreadCount(unread);
      
      console.log(`📊 Loaded ${parsedNotifications.length} notifications, ${unread} unread for user ${userId}`);
      
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [getCurrentUserFromStorage]);

  // Initialize
  useEffect(() => {
    initializeStorage();
    
    // Set current user ID
    const userId = getCurrentUserFromStorage();
    setCurrentUserId(userId);
    console.log("👤 Current user ID set to:", userId);
    
    // Load initial notifications
    loadNotifications();
    
    // Check for new notifications every 15 seconds
    const interval = setInterval(() => {
      loadNotifications();
    }, 15000);
    
    return () => clearInterval(interval);
  }, [initializeStorage, getCurrentUserFromStorage, loadNotifications]);

  // Listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === NOTIFICATION_STORAGE_KEY) {
        console.log("🔄 Storage changed, reloading notifications");
        loadNotifications();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [loadNotifications]);

  // Request notification permission on mount
  useEffect(() => {
    if (typeof window !== "undefined" && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log(`🔔 Notification permission: ${permission}`);
        });
      }
    }
  }, []);

  // Enhanced send notification function with better logging
  const sendNotification = useCallback((notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): string | null => {
    try {
      console.log("📤 Starting sendNotification with data:", notification);
      
      // Validate recipient ID
      if (!notification.recipientId || typeof notification.recipientId !== 'string' || notification.recipientId.trim() === '') {
        console.error("❌ Cannot send notification: Invalid recipient ID", notification.recipientId);
        return null;
      }

      // Validate initiator
      if (!notification.initiatorId || notification.initiatorId.trim() === '') {
        console.error("❌ Cannot send notification: Invalid initiator ID", notification.initiatorId);
        return null;
      }

      console.log("📤 Sending notification to recipient:", notification.recipientId);
      console.log("📤 Notification from initiator:", notification.initiatorId);

      const newNotification: Notification = {
        ...notification,
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        read: false
      };

      // Save notification in recipient's storage
      const allNotifications = JSON.parse(
        localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
      );

      console.log("📊 Current notification storage keys:", Object.keys(allNotifications));

      // Initialize if doesn't exist
      if (!allNotifications[notification.recipientId]) {
        allNotifications[notification.recipientId] = [];
        console.log("📝 Created new notification array for recipient:", notification.recipientId);
      }

      const recipientNotifications = allNotifications[notification.recipientId];
      
      // Remove duplicate notifications for the same trade
      const existingIndex = recipientNotifications.findIndex(
        (n: any) => n.tradeId === notification.tradeId && n.type === notification.type
      );
      
      if (existingIndex !== -1) {
        console.log("🔄 Removing duplicate notification");
        recipientNotifications.splice(existingIndex, 1);
      }
      
      recipientNotifications.unshift(newNotification);
      
      // Keep only last 100 notifications
      if (recipientNotifications.length > 100) {
        recipientNotifications.splice(100); // Remove excess from end
      }

      allNotifications[notification.recipientId] = recipientNotifications;
      
      try {
        localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(allNotifications));
        console.log("✅ Notification saved successfully for user:", notification.recipientId);
        console.log("📊 Total notifications for this user:", recipientNotifications.length);
        console.log("📋 Notification data saved:", newNotification);
      } catch (storageError) {
        console.error("❌ Storage error:", storageError);
        // Try to clear some space
        if (recipientNotifications.length > 50) {
          recipientNotifications.splice(50); // Keep only 50
          localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(allNotifications));
          console.log("🔄 Cleared old notifications to save space");
        }
      }

      // Trigger browser notification if recipient is current user
      if (currentUserId === notification.recipientId && 'Notification' in window) {
        if (Notification.permission === 'granted') {
          try {
            new Notification('New Trade Request', {
              body: notification.message,
              icon: '/favicon.ico',
              tag: notification.tradeId || 'trade-notification',
              requireInteraction: true
            });
            console.log("🔔 Browser notification shown");
          } catch (notifError) {
            console.warn("⚠️ Could not show browser notification:", notifError);
          }
        } else if (Notification.permission === 'default') {
          // Request permission if not yet asked
          Notification.requestPermission();
        }
      }

      // Update current user's notifications if recipient is current user
      if (currentUserId === notification.recipientId) {
        setNotifications(prev => {
          const filtered = prev.filter(n => !(n.tradeId === notification.tradeId && n.type === notification.type));
          return [newNotification, ...filtered.slice(0, 99)];
        });
        setUnreadCount(prev => prev + 1);
        console.log("🔄 Updated local state for current user");
      }

      // Dispatch storage event for other tabs
      window.dispatchEvent(new StorageEvent('storage', {
        key: NOTIFICATION_STORAGE_KEY,
        newValue: JSON.stringify(allNotifications)
      }));

      console.log("✅ Notification process completed successfully, ID:", newNotification.id);
      return newNotification.id;
    } catch (error) {
      console.error("❌ Error in sendNotification:", error);
      return null;
    }
  }, [currentUserId]);

  // Test notification function
  const testNotification = useCallback((recipientId?: string): string | null => {
    try {
      const userId = getCurrentUserFromStorage();
      const targetRecipientId = recipientId || userId;
      
      if (!targetRecipientId) {
        console.error("❌ No recipient ID for test notification");
        return null;
      }
      
      const testNotif = {
        type: 'NEW_TRADE_REQUEST' as const,
        tradeId: `test_${Date.now()}`,
        offerId: 'test_offer',
        initiatorId: userId || 'test_user',
        initiatorUsername: 'Test User',
        amountFiat: 100,
        amountCrypto: 0.002,
        currency: 'USD',
        crypto: 'BTC',
        message: 'This is a test notification',
        recipientId: targetRecipientId
      };
      
      console.log("🧪 Sending test notification:", testNotif);
      return sendNotification(testNotif);
    } catch (error) {
      console.error("❌ Error in testNotification:", error);
      return null;
    }
  }, [getCurrentUserFromStorage, sendNotification]);

  // Save trade to localStorage
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
      if (typeof window === "undefined") return {};
      
      return JSON.parse(localStorage.getItem(TRADES_STORAGE_KEY) || '{}');
    } catch (error) {
      console.error("❌ Error getting trades from localStorage:", error);
      return {};
    }
  }, []);

  // Get unread trade requests
  const getUnreadTradeRequests = useCallback(() => {
    return notifications.filter(notif => 
      !notif.read && 
      notif.type === 'NEW_TRADE_REQUEST'
    );
  }, [notifications]);

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
      try {
        const allNotifications = JSON.parse(
          localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
        );
        allNotifications[currentUserId] = updatedNotifications;
        localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(allNotifications));
      } catch (error) {
        console.error("❌ Error updating notification in storage:", error);
      }
    }
  }, [notifications, currentUserId]);

  const markAllAsRead = useCallback(() => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
    setUnreadCount(0);

    if (currentUserId) {
      try {
        const allNotifications = JSON.parse(
          localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
        );
        allNotifications[currentUserId] = updatedNotifications;
        localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(allNotifications));
      } catch (error) {
        console.error("❌ Error marking all as read in storage:", error);
      }
    }
  }, [notifications, currentUserId]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);

    if (currentUserId) {
      try {
        const allNotifications = JSON.parse(
          localStorage.getItem(NOTIFICATION_STORAGE_KEY) || '{}'
        );
        allNotifications[currentUserId] = [];
        localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(allNotifications));
      } catch (error) {
        console.error("❌ Error clearing notifications from storage:", error);
      }
    }
  }, [currentUserId]);

  const checkForNewNotifications = useCallback(() => {
    console.log("🔄 Manually checking for new notifications");
    loadNotifications();
  }, [loadNotifications]);

  const refreshNotifications = useCallback(() => {
    loadNotifications();
  }, [loadNotifications]);

  const value = {
    notifications,
    unreadCount,
    sendNotification,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    checkForNewNotifications,
    refreshNotifications,
    saveTradeToLocalStorage,
    getTradesFromLocalStorage,
    getUnreadTradeRequests,
    debugUserData,
    testNotification
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
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};