"use client";

import React, { useState } from "react";
import Nav from "../NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Footer from "../../components/Footer/Footer";


const Notifications: React.FC = () => {
  const [loginEmail, setLoginEmail] = useState(true);
  const [transactionEmail, setTransactionEmail] = useState(true);
  const [pushNotification, setPushNotification] = useState(false);

  const Toggle = ({
    enabled,
    onToggle,
  }: {
    enabled: boolean;
    onToggle: () => void;
  }) => {
    return (
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
  };

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex  items-center mt-[20px]  mr-[40px] ">
          <Settings />

          {/*right*/}
          
          <div className="w-[809px] h-[865px]    bg-[#1A1A1A] gap-[20px] p-[24px_64px]">
            <p className="text-[24px] font-[700] text-[#FFFFFF]">
              Notification
            </p>

            <div className="  h-[279px] p-[20px] mt-[50px] ">
              <p className="text-[14px] font-[500] text-[#DBDBDB]">
                Login Alerts
              </p>

              <div className="flex items-center w-[414px] justify-between p-[12px] rounded-[8px] w-[414px] h-[48px] bg-[#2D2D2D] ">
                <p className="text-[12px] font-[500] text-[#DBDBDB]">Email</p>

                <div className="space-y-[10px] mb-6">
                  {/* Dark mode toggle row */}
                  <div>
                    <Toggle
                      enabled={loginEmail}
                      onToggle={() => setLoginEmail(!loginEmail)}
                    />
                  </div>
                </div>
              </div>

              <div className=" w-[430px] h-[1px] bg-[#3A3A3A]  mt-[50px]"></div>

              <div className="mt-[20px] space-y-[10px]">
                <p className="text-[14px]  font-[500] text-[#DBDBDB]">
                  Transaction Alerts
                </p>

                <div className="flex items-center justify-between p-[12px] rounded-[8px] w-[414px] h-[48px] bg-[#2D2D2D] ">
                  <p className="text-[12px] font-[500] text-[#DBDBDB]">Email</p>

                  <div className="space-y-[10px] mb-6">
                    <div>
                      <Toggle
                        enabled={loginEmail}
                        onToggle={() => setLoginEmail(!loginEmail)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-[12px] rounded-[8px] w-[414px] h-[48px] bg-[#2D2D2D] ">
                  <p className="text-[12px] font-[500] text-[#DBDBDB]">
                    Push notification
                  </p>

                  <div className="space-y-[10px] mb-6">
                    <div>
                      <Toggle
                        enabled={pushNotification}
                        onToggle={() => setPushNotification(!pushNotification)}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
         <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>
                
                        <div className=" mb-[80px] mt-[30%] ">
                          <Footer />
                        </div>
      </div>
    </main>
  );
};

export default Notifications;
