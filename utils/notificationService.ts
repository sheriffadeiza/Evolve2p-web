// utils/notificationService.ts
"use client";

export interface NotificationData {
  id: string;
  type: "NEW_TRADE_REQUEST" | "PAYMENT_SENT" | "PAYMENT_RECEIVED" | "TRADE_ACCEPTED" | 
         "TRADE_DECLINED" | "TRADE_COMPLETED" | "TRADE_CANCELLED" | "DISPUTE_OPENED" | "SYSTEM";
  tradeId?: string;
  offerId?: string;
  initiatorId: string;
  initiatorUsername: string;
  recipientId: string;
  recipientUsername: string;
  amountFiat?: number;
  amountCrypto?: number;
  currency?: string;
  crypto?: string;
  message: string;
  createdAt: string;
  read: boolean;
}

const notificationService = {
  // Generate unique ID
  generateId: (): string => {
    return `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Get current user from localStorage
  getCurrentUser: (): { id: string; username: string } | null => {
    if (typeof window === 'undefined') return null;
    
    try {
      const userData = localStorage.getItem('UserData');
      if (!userData) return null;
      
      const parsed = JSON.parse(userData);
      const user = parsed.userData || parsed.data || parsed.user || parsed;
      
      return {
        id: user.id || user._id || user.userId || '',
        username: user.username || user.email || user.name || 'User'
      };
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },

  // Get all notifications for current user
  getNotifications: (): NotificationData[] => {
    if (typeof window === 'undefined') return [];
    
    try {
      const userData = localStorage.getItem('UserData');
      if (!userData) return [];
      
      const parsed = JSON.parse(userData);
      
      // Check all possible locations for notifications
      let notifications: any[] = [];
      
      if (parsed.userData?.notifications && Array.isArray(parsed.userData.notifications)) {
        notifications = parsed.userData.notifications;
      } else if (parsed.notifications && Array.isArray(parsed.notifications)) {
        notifications = parsed.notifications;
      } else if (parsed.user?.notifications && Array.isArray(parsed.user.notifications)) {
        notifications = parsed.user.notifications;
      }
      
      // Sort by date (newest first)
      return notifications.sort((a: NotificationData, b: NotificationData) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  // Get unread count
  getUnreadCount: (): number => {
    const notifications = notificationService.getNotifications();
    return notifications.filter(notif => !notif.read).length;
  },

  // Add a notification
  addNotification: (notification: Omit<NotificationData, 'id' | 'createdAt' | 'read'>): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const userData = localStorage.getItem('UserData');
      if (!userData) return;
      
      const parsed = JSON.parse(userData);
      const updatedData = { ...parsed };
      
      // Create full notification object
      const fullNotification: NotificationData = {
        ...notification,
        id: notificationService.generateId(),
        createdAt: new Date().toISOString(),
        read: false
      };
      
      // Cache the initiator username
      const userCache = localStorage.getItem('userCache') || '{}';
      const cache = JSON.parse(userCache);
      cache[notification.initiatorId] = { 
        id: notification.initiatorId, 
        username: notification.initiatorUsername 
      };
      localStorage.setItem('userCache', JSON.stringify(cache));
      
      // Initialize notifications array if it doesn't exist
      if (updatedData.userData) {
        if (!updatedData.userData.notifications) {
          updatedData.userData.notifications = [];
        }
        // Add to beginning of array (newest first)
        updatedData.userData.notifications.unshift(fullNotification);
        // Keep only last 100 notifications
        if (updatedData.userData.notifications.length > 100) {
          updatedData.userData.notifications = updatedData.userData.notifications.slice(0, 100);
        }
      } else {
        if (!updatedData.notifications) {
          updatedData.notifications = [];
        }
        updatedData.notifications.unshift(fullNotification);
        if (updatedData.notifications.length > 100) {
          updatedData.notifications = updatedData.notifications.slice(0, 100);
        }
      }
      
      // Save back to localStorage
      localStorage.setItem('UserData', JSON.stringify(updatedData));
      
      // Trigger events for other components to update
      notificationService.triggerUpdateEvents(fullNotification);
      
    } catch (error) {
      console.error('Error adding notification:', error);
    }
  },

  // Mark notification as read
  markAsRead: (notificationId: string): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const userData = localStorage.getItem('UserData');
      if (!userData) return;
      
      const parsed = JSON.parse(userData);
      const updatedData = { ...parsed };
      
      let found = false;
      
      // Mark as read in userData.notifications
      if (updatedData.userData?.notifications) {
        updatedData.userData.notifications = updatedData.userData.notifications.map((notif: any) => {
          if (notif.id === notificationId) {
            found = true;
            return { ...notif, read: true };
          }
          return notif;
        });
      }
      
      // Also check in root notifications
      if (!found && updatedData.notifications) {
        updatedData.notifications = updatedData.notifications.map((notif: any) => {
          if (notif.id === notificationId) {
            return { ...notif, read: true };
          }
          return notif;
        });
      }
      
      // Also check in user.notifications
      if (!found && updatedData.user?.notifications) {
        updatedData.user.notifications = updatedData.user.notifications.map((notif: any) => {
          if (notif.id === notificationId) {
            return { ...notif, read: true };
          }
          return notif;
        });
      }
      
      // Save back to localStorage
      localStorage.setItem('UserData', JSON.stringify(updatedData));
      
      // Trigger update events
      notificationService.triggerUpdateEvents();
      
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  },

  // Mark all notifications as read
  markAllAsRead: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const userData = localStorage.getItem('UserData');
      if (!userData) return;
      
      const parsed = JSON.parse(userData);
      const updatedData = { ...parsed };
      
      // Mark all as read in userData.notifications
      if (updatedData.userData?.notifications) {
        updatedData.userData.notifications = updatedData.userData.notifications.map((notif: any) => ({
          ...notif,
          read: true
        }));
      }
      
      // Also mark all in root notifications
      if (updatedData.notifications) {
        updatedData.notifications = updatedData.notifications.map((notif: any) => ({
          ...notif,
          read: true
        }));
      }
      
      // Also mark all in user.notifications
      if (updatedData.user?.notifications) {
        updatedData.user.notifications = updatedData.user.notifications.map((notif: any) => ({
          ...notif,
          read: true
        }));
      }
      
      // Save back to localStorage
      localStorage.setItem('UserData', JSON.stringify(updatedData));
      
      // Trigger update events
      notificationService.triggerUpdateEvents();
      
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  },

  // Clear all notifications
  clearAllNotifications: (): void => {
    if (typeof window === 'undefined') return;
    
    try {
      const userData = localStorage.getItem('UserData');
      if (!userData) return;
      
      const parsed = JSON.parse(userData);
      const updatedData = { ...parsed };
      
      // Clear all notification arrays
      if (updatedData.userData) {
        updatedData.userData.notifications = [];
      }
      if (updatedData.notifications) {
        updatedData.notifications = [];
      }
      if (updatedData.user) {
        updatedData.user.notifications = [];
      }
      
      // Save back to localStorage
      localStorage.setItem('UserData', JSON.stringify(updatedData));
      
      // Trigger update events
      notificationService.triggerUpdateEvents();
      
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  },

  // Helper to create trade-related notifications
  createTradeNotification: (
    recipientId: string,
    recipientUsername: string,
    type: NotificationData['type'],
    tradeId?: string,
    amountFiat?: number,
    amountCrypto?: number,
    currency?: string,
    crypto?: string,
    customMessage?: string
  ): void => {
    const currentUser = notificationService.getCurrentUser();
    if (!currentUser) return;
    
    let message = '';
    
    switch (type) {
      case 'NEW_TRADE_REQUEST':
        message = customMessage || `New trade request for ${amountFiat} ${currency}`;
        break;
      case 'PAYMENT_SENT':
        message = customMessage || `Payment sent for ${amountCrypto} ${crypto}`;
        break;
      case 'TRADE_COMPLETED':
        message = customMessage || `Trade completed for ${amountCrypto} ${crypto}`;
        break;
      case 'TRADE_CANCELLED':
        message = customMessage || `Trade cancelled for ${amountCrypto} ${crypto}`;
        break;
      case 'DISPUTE_OPENED':
        message = customMessage || `Dispute opened for trade`;
        break;
      case 'SYSTEM':
        message = customMessage || 'System notification';
        break;
      default:
        message = customMessage || 'Trade notification';
    }
    
    notificationService.addNotification({
      type,
      tradeId,
      initiatorId: currentUser.id,
      initiatorUsername: currentUser.username,
      recipientId,
      recipientUsername,
      amountFiat,
      amountCrypto,
      currency,
      crypto,
      message
    });
  },

  // Create a notification (simple wrapper)
  createNotification: (
    data: Omit<NotificationData, 'id' | 'createdAt' | 'read'>
  ): void => {
    notificationService.addNotification(data);
  },

  // Trigger update events for other components
  triggerUpdateEvents: (notification?: NotificationData): void => {
    if (typeof window === 'undefined') return;
    
    // Dispatch storage event (works across tabs)
    window.dispatchEvent(new Event('storage'));
    
    // Dispatch custom event for real-time updates
    window.dispatchEvent(new CustomEvent('notification-updated', {
      detail: { notification, timestamp: Date.now() }
    }));
    
    // Dispatch event for bell notification updates
    window.dispatchEvent(new CustomEvent('bell-notification-update', {
      detail: { 
        unreadCount: notificationService.getUnreadCount(),
        notification 
      }
    }));
  }
};

export default notificationService;