"use client";

import React from "react";
import Nav from "../NAV/Nav";
import Footer from "../Footer/Footer";

const Bell_Notify = () => {
  const [notifications, setNotifications] = React.useState<any[]>([]);

  React.useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined"
          ? localStorage.getItem("UserData")
          : null;
      if (!raw) return;

      const parsed = JSON.parse(raw);
      const userData = parsed.userData;

      if (userData && Array.isArray(userData.notifications)) {
        setNotifications(userData.notifications);
      }
    } catch (err) {
      console.error("Error loading notifications", err);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      {/* Top Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Nav />
      </div>

      {/* Page Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-6">

        <h1 className="text-xl sm:text-2xl font-bold mb-6">Notifications</h1>

        {/* Filter Tabs */}
        <div className="grid grid-cols-4 gap-1 bg-[#111214] rounded-xl p-1 mb-6 text-xs sm:text-sm">
          <button className="py-2 rounded-lg bg-[#4DF2BE] text-black font-semibold">All</button>
          <button className="py-2 rounded-lg text-gray-300 hover:text-white">Trades</button>
          <button className="py-2 rounded-lg text-gray-300 hover:text-white">Wallet</button>
          <button className="py-2 rounded-lg text-gray-300 hover:text-white">Others</button>
        </div>

        {/* Date Label */}
        <p className="text-sm text-gray-400 mb-4">Today</p>

        {/* Empty State */}
        {notifications.length === 0 && (
          <p className="text-gray-400 text-center py-10">No notifications yet</p>
        )}

        {/* Notification List */}
        <div className="flex flex-col gap-4">
          {notifications.map((n: any, i: number) => (
            <div
              key={i}
              className="bg-[#1A1B1E] p-4 sm:p-5 rounded-xl shadow-md border border-[#2A2B2F]"
            >
              <div className="flex items-start gap-3">
                <div className="w-3 h-3 bg-[#4DF2BE] rounded-full mt-1" />

                <div className="flex-1">
                  <p className="font-semibold text-sm sm:text-base">
                    {n.title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                    {n.message}
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
                    {n.timeAgo}
                  </p>
                </div>

                <button className="text-[#4DF2BE] text-xs sm:text-sm font-medium hover:underline whitespace-nowrap">
                  View
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Divider */}
        <div className="w-full h-[1px] bg-white opacity-20 mt-[50%] mb-10"></div>

        {/* Footer */}
        <div className="mb-24 whitespace-nowrap mt-[20%]">
          <Footer />
        </div>

      </div>
    </main>
  );
};

export default Bell_Notify;
