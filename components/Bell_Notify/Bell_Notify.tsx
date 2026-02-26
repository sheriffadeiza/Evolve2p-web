"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import Nav from "../NAV/Nav";
import Footer from "../Footer/Footer";

interface Notification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  type?: string;
  isRead?: boolean;
  createdAt?: string;
}

// Safe string conversion
const safeToString = (value: any): string => {
  if (typeof value === 'string') return value;
  if (value === null || value === undefined) return '';
  if (typeof value === 'number' || typeof value === 'boolean') return String(value);
  return String(value);
};

// Format notification time
const formatNotificationTime = (dateString: string | Date | undefined): string => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const notifDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (notifDate.getTime() === today.getTime()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (notifDate.getTime() === yesterday.getTime()) {
      return `Yesterday, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 7) {
      return `${date.toLocaleDateString([], { weekday: 'short' })}, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return '';
  }
};

// Get date header for grouping
const getDateHeader = (dateString: string | Date | undefined): string => {
  if (!dateString) return 'Older';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Older';
    const now = new Date();
    if (date.toDateString() === now.toDateString()) return 'Today';
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return date.toLocaleDateString([], { weekday: 'long' });
    return date.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
  } catch {
    return 'Older';
  }
};

const groupNotificationsByDate = (notifications: Notification[]): Record<string, Notification[]> => {
  const groups: Record<string, Notification[]> = {};
  notifications.forEach(n => {
    const header = getDateHeader(n.createdAt);
    if (!groups[header]) groups[header] = [];
    groups[header].push(n);
  });
  return groups;
};

// Safe localStorage reader
const getUserData = () => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem("UserData");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Skeleton component
const NotificationSkeleton = () => (
  <div className="bg-[#1A1B1E] p-4 sm:p-5 rounded-xl shadow-md border border-[#2A2B2F] opacity-60">
    <div className="flex items-start gap-3">
      <div className="w-3 h-3 rounded-full mt-1 bg-gray-500" />
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div className="w-32 h-5 bg-gray-700 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="w-16 h-5 bg-gray-700 rounded animate-pulse" />
            <div className="w-5 h-5 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
        <div className="w-full h-4 bg-gray-700 rounded animate-pulse mt-2" />
        <div className="mt-2 flex gap-2">
          <div className="w-12 h-4 bg-gray-700 rounded animate-pulse" />
          <div className="w-12 h-4 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="mt-2 w-16 h-3 bg-gray-700 rounded animate-pulse" />
      </div>
    </div>
  </div>
);

const Bell_Notify = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [hydrated, setHydrated] = useState(false);

  // Load user data once on mount
  useEffect(() => {
    const data = getUserData();
    if (!data) {
      setHydrated(true);
      return;
    }

    const user = data.userData || data;

    if (Array.isArray(user.notifications)) {
      const enhanced = user.notifications.map((n: any, index: number) => {
        const createdAt = n.createdAt || n.timestamp || n.date || n.timeAgo;
        return {
          id: safeToString(n.id) || `notif-${index}-${Date.now()}`,
          title: safeToString(n.title),
          message: safeToString(n.message),
          timeAgo: formatNotificationTime(createdAt),
          type: n.type ? safeToString(n.type) : undefined,
          isRead: n.isRead || false,
          createdAt,
        };
      });

      enhanced.sort((a: Notification, b: Notification) => 
        new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
      );
      setNotifications(enhanced);
    }
    setHydrated(true);
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    setNotifications(prev => prev.map(n => (n.id === notificationId ? { ...n, isRead: true } : n)));
    const data = getUserData();
    if (data?.userData?.notifications) {
      data.userData.notifications = data.userData.notifications.map((n: any) =>
        safeToString(n.id) === notificationId ? { ...n, isRead: true } : n
      );
      localStorage.setItem("UserData", JSON.stringify(data));
    }
  }, []);

  const dismissNotification = useCallback((notificationId: string) => {
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
    const data = getUserData();
    if (data?.userData?.notifications) {
      data.userData.notifications = data.userData.notifications.filter(
        (n: any) => safeToString(n.id) !== notificationId
      );
      localStorage.setItem("UserData", JSON.stringify(data));
    }
  }, []);

  const groupedNotifications = useMemo(() => groupNotificationsByDate(notifications), [notifications]);
  const unreadCount = useMemo(() => notifications.filter(n => !n.isRead).length, [notifications]);

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Nav />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hydrated ? (
          // Full page skeleton
          <>
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-full bg-[#1A1B1E] animate-pulse" />
              <div className="w-48 h-8 bg-gray-700 rounded animate-pulse" />
            </div>
            <div className="flex flex-col gap-6">
              {[1, 2, 3].map(i => <NotificationSkeleton key={i} />)}
            </div>
          </>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
              <button
                onClick={() => router.back()}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A1B1E] hover:bg-[#2A2B2E] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <h1 className="text-2xl sm:text-3xl font-bold">Notifications</h1>
            </div>

            {/* Empty state */}
            {notifications.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#1A1B1E] flex items-center justify-center">
                  <span className="text-2xl">🔔</span>
                </div>
                <p className="text-gray-400 text-lg mb-2">No notifications yet</p>
                <p className="text-gray-500 text-sm">Notifications will appear here when you have updates</p>
              </div>
            )}

            {/* Notification list – only individual dismiss */}
            {notifications.length > 0 && (
              <div className="flex flex-col gap-6">
                {Object.entries(groupedNotifications).map(([dateHeader, dateNotifications]) => (
                  <div key={dateHeader} className="space-y-4">
                    <div className="sticky top-0 z-10 bg-[#0F1012] py-2">
                      <p className="text-sm font-medium text-gray-400">{dateHeader}</p>
                    </div>
                    <div className="space-y-4">
                      {dateNotifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`bg-[#1A1B1E] p-4 sm:p-5 rounded-xl shadow-md border transition-colors duration-200 ${
                            notification.isRead
                              ? 'border-[#2A2B2F] opacity-70'
                              : 'border-[#4DF2BE] border-opacity-30'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className={`w-3 h-3 rounded-full mt-1 ${notification.isRead ? 'bg-gray-500' : 'bg-[#4DF2BE]'}`} />
                            <div className="flex-1">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold text-sm sm:text-base">
                                    {notification.title}
                                    {notification.isRead && <span className="ml-2 text-xs text-gray-500">(read)</span>}
                                  </p>
                                </div>
                                <button
                                  onClick={() => dismissNotification(notification.id)}
                                  className="text-gray-400 text-xs hover:text-red-400 transition-colors"
                                  title="Dismiss"
                                >
                                  ×
                                </button>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mt-1 whitespace-pre-wrap">
                                {notification.message}
                              </p>
                              <div className="mt-2">
                                <p className="text-[10px] sm:text-xs text-gray-500">{notification.timeAgo}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-[50%] ml-[30%] h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8" />
      <div className="mb-[80px] p-[50px] mt-[10%]">
        <Footer />
      </div>
    </main>
  );
};

export default Bell_Notify;