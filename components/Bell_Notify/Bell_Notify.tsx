"use client";

import React, { useEffect } from "react";
import Nav from "../NAV/Nav";
import Footer from "../Footer/Footer";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/Context/provider";

const Bell_Notify: React.FC = () => {
  const router = useRouter();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
    checkForNewNotifications,
    refreshNotifications,
  } = useNotifications();

  useEffect(() => {
    // load notifications on mount (from provider/localStorage/socket)
    checkForNewNotifications();
    // keep UI in sync periodically
    const interval = setInterval(() => {
      refreshNotifications();
    }, 15000);
    return () => clearInterval(interval);
  }, [checkForNewNotifications, refreshNotifications]);

  const handleView = (n: any) => {
    if (!n) return;
    if (!n.read && n.id) markAsRead(n.id);
    // navigate to trade pages if tradeId present
    if (n.tradeId) {
      const currentRaw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
      let currentId = null;
      if (currentRaw) {
        try {
          const parsed = JSON.parse(currentRaw);
          const u = parsed.userData || parsed.data || parsed.user || parsed;
          currentId = String(u?.id || u?._id || u?.userId || parsed.id || parsed._id || "");
        } catch {}
      }
      const isInitiator = currentId && String(currentId) === String(n.initiatorId);
      router.push(isInitiator ? `/prc_sell?tradeId=${n.tradeId}` : `/prc_buy?tradeId=${n.tradeId}`);
      return;
    }

    // fallback: go to notifications page
    router.push("/tradeNotify");
  };

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Nav />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Notifications</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { refreshNotifications(); }}
              className="text-sm text-[#4DF2BE] hover:underline"
            >
              Refresh
            </button>
            <button
              onClick={() => markAllAsRead()}
              className="text-sm text-[#C7C7C7] hover:underline"
            >
              Mark all read
            </button>
            <button
              onClick={() => clearNotifications()}
              className="text-sm text-[#FE857D] hover:underline"
            >
              Clear
            </button>
          </div>
        </div>

        <p className="text-sm text-gray-400 mb-4">
          {unreadCount > 0 ? `You have ${unreadCount} unread` : "No unread notifications"}
        </p>

        {(!notifications || notifications.length === 0) ? (
          <p className="text-gray-400 text-center py-10">No notifications yet</p>
        ) : (
          <div className="flex flex-col gap-4">
            {notifications.map((n: any, i: number) => (
              <div
                key={n.id || i}
                className={`bg-[#1A1B1E] p-4 sm:p-5 rounded-xl shadow-md border ${n.read ? "border-[#2A2B2F] opacity-75" : "border-[#4DF2BE]"}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-3 h-3 rounded-full mt-1 ${n.read ? "bg-gray-500" : "bg-[#4DF2BE]"}`} />

                  <div className="flex-1">
                    <p className="font-semibold text-sm sm:text-base">
                      {n.type === "NEW_TRADE_REQUEST" ? "New Trade Request" : (n.title || n.type || "Notification")}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                      {n.message || (() => {
                        if (n.type === "NEW_TRADE_REQUEST") {
                          return `${n.initiatorUsername || "Someone"} wants to trade ${n.amountFiat || 0} ${n.currency || "USD"} for ${n.amountCrypto || 0} ${n.crypto || "BTC"}`;
                        }
                        return n.message || "";
                      })()}
                    </p>
                    <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                      {n.createdAt ? new Date(n.createdAt).toLocaleString() : "Recently"}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleView(n)}
                      className="text-[#4DF2BE] text-xs sm:text-sm font-medium hover:underline whitespace-nowrap"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="w-full h-[1px] bg-white opacity-20 mt-12 mb-10"></div>

        <div className="mb-24">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Bell_Notify;