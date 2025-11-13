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
      className={`w-[44px] h-[24px] rounded-full p-[2px] flex items-center cursor-pointer transition-colors duration-300 ${
        enabled ? "bg-[#4DF2BE]" : "bg-[#3A3A3A]"
      }`}
    >
      <div
        className={`w-[18px] h-[18px] rounded-full transition-transform duration-300 ${
          enabled ? "translate-x-[20px] bg-[#000]" : "translate-x-0 bg-[#fff]"
        }`}
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex items-center mt-[20px] mr-[40px]">
          <Settings />

          {/* Right Section */}
          <div className="w-[809px] h-[865px] bg-[#1A1A1A] gap-[20px] p-[24px_64px]">
            <p className="text-[24px] font-[700] text-[#FFFFFF]">Notification</p>

            <div className="h-[279px] p-[20px] mt-[50px]">
              {/* LOGIN ALERTS */}
              <p className="text-[14px] font-[500] text-[#DBDBDB]">Login Alerts</p>
              <div className="flex items-center justify-between p-[12px] rounded-[8px] w-[414px] h-[48px] bg-[#2D2D2D]">
                <p className="text-[12px] font-[500] text-[#DBDBDB]">Email</p>
                <Toggle
                  enabled={loginEmail}
                  onToggle={() => {
                    const newState = !loginEmail;
                    setLoginEmail(newState);
                    updateUserData({ login: newState });
                  }}
                />
              </div>

              <div className="w-[430px] h-[1px] bg-[#3A3A3A] mt-[50px]" />

              {/* TRANSACTION ALERTS */}
              <div className="mt-[20px] space-y-[10px]">
                <p className="text-[14px] font-[500] text-[#DBDBDB]">
                  Transaction Alerts
                </p>
                <div className="flex items-center justify-between p-[12px] rounded-[8px] w-[414px] h-[48px] bg-[#2D2D2D]">
                  <p className="text-[12px] font-[500] text-[#DBDBDB]">Email</p>
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
                <div className="flex items-center justify-between p-[12px] rounded-[8px] w-[414px] h-[48px] bg-[#2D2D2D]">
                  <p className="text-[12px] font-[500] text-[#DBDBDB]">
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

        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8" />
        <div className="mb-[80px] mt-[30%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Notifications;