"use client";

import React, { useEffect, useState } from "react";
import Nav from "../NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Footer from "../../components/Footer/Footer";

const Notifications: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState(false);
  const [transactionEmail, setTransactionEmail] = useState(false);
  const [pushNotification, setPushNotification] = useState(false);

  // ✅ Load from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("userData");
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          const noti = parsed?.notifications || {};
          setLoginEmail(!!noti.login);
          setTransactionEmail(!!noti.transaction);
          setPushNotification(!!noti.push);
        } catch (error) {
          console.error("Error parsing userData:", error);
        }
      }
    }
  }, []);

  // ✅ Save updates
  const updateUserData = (updated: {
    login?: boolean;
    transaction?: boolean;
    push?: boolean;
  }) => {
    const storedUser = localStorage.getItem("userData");
    if (!storedUser) return;
    const parsed = JSON.parse(storedUser);
    parsed.notifications = {
      ...parsed.notifications,
      ...updated,
    };
    localStorage.setItem("userData", JSON.stringify(parsed));
  };

  // ✅ Enable browser push notifications
  const handlePushToggle = async () => {
    if (!pushNotification) {
      if (!("Notification" in window)) {
        alert("This browser does not support desktop notifications.");
        return;
      }
      if (Notification.permission !== "granted") {
        await Notification.requestPermission();
      }
      if (Notification.permission === "granted") {
        new Notification("Push notifications enabled!");
        setPushNotification(true);
        updateUserData({ push: true });
      }
    } else {
      setPushNotification(false);
      updateUserData({ push: false });
    }
  };

  // 🔘 Reusable Toggle Component
  const Toggle = ({
    enabled,
    onToggle,
  }: {
    enabled: boolean;
    onToggle: () => void;
  }) => (
    <div
      onClick={onToggle}
      className={`w-11 h-6 md:w-[44px] md:h-[24px] rounded-full p-[2px] flex items-center cursor-pointer transition-colors duration-300 ${
        enabled ? "bg-[#4DF2BE]" : "bg-[#3A3A3A]"
      }`}
    >
      <div
        className={`w-4 h-4 md:w-[18px] md:h-[18px] rounded-full transition-transform duration-300 ${
          enabled ? "translate-x-5 md:translate-x-[20px] bg-[#000]" : "translate-x-0 bg-[#fff]"
        }`}
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0F1012] text-white p-4 sm:p-6 md:pr-[10px] md:mt-[30px] md:pl-[30px] lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6 mt-4 md:mt-[20px] md:mr-[40px]">
          <Settings />

          {/* Right Section */}
          <div className="w-full lg:w-[809px] min-h-[865px] bg-[#1A1A1A] gap-4 md:gap-[20px] p-4 sm:p-6 md:p-[24px_64px] rounded-lg md:rounded-none">
            <p className="text-xl sm:text-2xl md:text-[24px] font-[700] text-[#FFFFFF]">Notification</p>

            <div className="p-4 sm:p-5 md:p-[20px] mt-6 md:mt-[50px]">
              {/* LOGIN ALERTS */}
              <p className="text-sm md:text-[14px] font-[500] text-[#DBDBDB]">Login Alerts</p>
              <div className="flex items-center justify-between p-3 md:p-[12px] rounded-lg md:rounded-[8px] w-full max-w-[414px] h-12 md:h-[48px] bg-[#2D2D2D] mt-2">
                <p className="text-xs md:text-[12px] font-[500] text-[#DBDBDB]">Email</p>
                <Toggle
                  enabled={loginEmail}
                  onToggle={() => {
                    const newState = !loginEmail;
                    setLoginEmail(newState);
                    updateUserData({ login: newState });
                  }}
                />
              </div>

              <div className="w-full max-w-[430px] h-[1px] bg-[#3A3A3A] mt-8 md:mt-[50px]" />

              {/* TRANSACTION ALERTS */}
              <div className="mt-5 md:mt-[20px] space-y-3 md:space-y-[10px]">
                <p className="text-sm md:text-[14px] font-[500] text-[#DBDBDB]">
                  Transaction Alerts
                </p>
                <div className="flex items-center justify-between p-3 md:p-[12px] rounded-lg md:rounded-[8px] w-full max-w-[414px] h-12 md:h-[48px] bg-[#2D2D2D]">
                  <p className="text-xs md:text-[12px] font-[500] text-[#DBDBDB]">Email</p>
                  <Toggle
                    enabled={transactionEmail}
                    onToggle={() => {
                      const newState = !transactionEmail;
                      setTransactionEmail(newState);
                      updateUserData({ transaction: newState });
                    }}
                  />
                </div>

                {/* PUSH NOTIFICATION */}
                <div className="flex items-center justify-between p-3 md:p-[12px] rounded-lg md:rounded-[8px] w-full max-w-[414px] h-12 md:h-[48px] bg-[#2D2D2D]">
                  <p className="text-xs md:text-[12px] font-[500] text-[#DBDBDB]">
                    Push notification
                  </p>
                  <Toggle
                    enabled={pushNotification}
                    onToggle={handlePushToggle}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full h-[1px] bg-[#fff] mt-8 md:mt-[10%] opacity-20 my-6 md:my-8" />
        <div className="mb-8 md:mb-[80px] mt-8 md:mt-[30%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Notifications;