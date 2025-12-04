'use client';
import Nav from "../NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Image from "next/image"; 
import React, {useState} from 'react'
import Footer from "../../components/Footer/Footer";

const TransLim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"withdrawal" | "deposit">("withdrawal");

  const tabs = [
    { label: "Withdrawal", key: "withdrawal" },
    { label: "Deposit", key: "deposit" },
  ];

  return (
    <main className="min-h-screen bg-[#0F1012] text-white p-4 sm:p-6 md:pr-[10px] md:mt-[30px] md:pl-[30px] lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />
        
        <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6 mt-4 md:mt-[20px] md:mr-[40px]">
          <Settings />

          {/* Right Section */}
          <div className="w-full lg:w-[809px] min-h-[865px] bg-[#1A1A1A] gap-4 md:gap-[20px] p-4 sm:p-6 md:p-[24px_64px] rounded-lg md:rounded-none">
            <p className="text-xl sm:text-2xl md:text-[24px] font-[700] text-[#FFFFFF]">Transaction Limits</p>

            {/* Tabs (Pill style) */}
            <div className="mt-4 md:mt-[20px] p-2 md:p-[10px_20px]">
              <div className="flex bg-[#2D2D2D] rounded-[56px] mt-4 w-full max-w-[296px] h-12 md:h-[48px] items-center justify-between">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <div
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as "withdrawal" | "deposit")}
                      className={`flex items-center justify-center rounded-[56px] text-sm md:text-[16px] transition-all no-underline cursor-pointer
                        ${
                          isActive
                            ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500]"
                            : "bg-transparent text-[#DBDBDB] font-[400]"
                        } w-1/2 h-10 md:h-[40px]`}
                    >
                      {tab.label}
                    </div>
                  );
                })}
              </div> 

              {activeTab === "withdrawal" ? (
                <div className="mt-4 md:mt-[10px]">
                  <h3 className="text-lg sm:text-xl md:text-[20px] font-[700] text-[#FFFFFF] mt-6 md:mt-[40px]">Withdrawal Limits</h3>
                  <p className="text-sm md:text-[16px] font-[400] text-[#C7C7C7] mb-6">
                    Limits for sending money from balances to any recipient
                  </p>

                  {/* Daily Limit */}
                  <div className="w-full max-w-[641px] h-auto min-h-[82px] bg-[#222222] rounded-lg md:rounded-[8px] p-3 md:p-[12px] mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs sm:text-sm md:text-[14px] font-[500] text-[#FFFFFF]">
                        Daily Limit: <span>$148,500</span>
                      </p>
                    </div>

                    <div className="w-full h-2 bg-[#4A4A4A] rounded-[4px] overflow-hidden">
                      <div className="w-2 h-2 bg-[#4DF2BE] rounded-full"></div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mt-3 md:mt-[10px] text-xs md:text-[13px] text-[#B5B5B5] gap-2">
                      <span>$1,485,000 remaining</span>
                      <span>Refreshes in 10 minutes</span>
                    </div>
                  </div>

                  {/* Monthly Limit */}
                  <div className="w-full max-w-[641px] h-auto min-h-[82px] mt-4 md:mt-[20px] bg-[#222222] rounded-lg md:rounded-[8px] p-3 md:p-[12px] mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs sm:text-sm md:text-[14px] font-[500] text-[#FFFFFF]">
                        Monthly Limit: <span>$1,485,000</span>
                      </p>
                    </div>

                    <div className="w-full h-2 bg-[#4A4A4A] rounded-[4px] overflow-hidden">
                      <div className="w-2 h-2 bg-[#4DF2BE] rounded-full"></div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mt-3 md:mt-[10px] text-xs md:text-[13px] text-[#B5B5B5] gap-2">
                      <span>$1,485,000 remaining</span>
                      <span>Refreshes in 10 minutes</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 md:mt-[10px]">
                  <h3 className="text-lg sm:text-xl md:text-[20px] font-[700] text-[#FFFFFF] mt-6 md:mt-[40px]">Deposit Limits</h3>
                  <p className="text-sm md:text-[16px] font-[400] text-[#C7C7C7] mb-6">
                    Limits for making payments into balances
                  </p>

                  {/* Daily Limit */}
                  <div className="w-full max-w-[641px] h-auto min-h-[82px] bg-[#222222] rounded-lg md:rounded-[8px] p-3 md:p-[12px] mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs sm:text-sm md:text-[14px] font-[500] text-[#FFFFFF]">
                        Daily Limit: <span>$250,000</span>
                      </p>
                    </div>
                  
                    <div className="w-full h-2 bg-[#4A4A4A] rounded-[4px] overflow-hidden">
                      <div className="w-2 h-2 bg-[#4DF2BE] rounded-full"></div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mt-3 md:mt-[10px] text-xs md:text-[13px] text-[#B5B5B5] gap-2">
                      <span>$2,000,000 remaining</span>
                      <span>Refreshes in 10 minutes</span>
                    </div>
                  </div>

                  {/* Monthly Limit */}
                  <div className="w-full max-w-[641px] h-auto min-h-[82px] mt-4 md:mt-[20px] bg-[#222222] rounded-lg md:rounded-[8px] p-3 md:p-[12px] mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs sm:text-sm md:text-[14px] font-[500] text-[#FFFFFF]">
                        Monthly Limit: <span>$3,000,000</span>
                      </p>
                    </div>
                    
                    <div className="w-full h-2 bg-[#4A4A4A] rounded-[4px] overflow-hidden">
                      <div className="w-2 h-2 bg-[#4DF2BE] rounded-full"></div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mt-3 md:mt-[10px] text-xs md:text-[13px] text-[#B5B5B5] gap-2">
                      <span>$3,000,000 remaining</span>
                      <span>Refreshes in 10 minutes</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

         <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] mt-[10%] ">
                  <Footer />
                </div>
      </div>
    </main>
  )
}

export default TransLim