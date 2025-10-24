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
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
          <div className="max-w-7xl mx-auto">
            
            <Nav />
            
                   <div className="flex  items-center mt-[20px]  mr-[40px] ">
                    
                       <Settings />



                         {/* Right */}
                <div className="w-[809px]  h-[865px] bg-[#1A1A1A]   gap-[20px] p-[24px_64px]">

                    <p className="text-[24px] font-[700] text-[#FFFFFF]">Transaction Limits</p>


                   {/* Tabs (Pill style) */}
        <div className="mt-[20px] p-[10px_20px]">
        <div className="flex bg-[#2D2D2D] rounded-[56px] mt-4 w-[296px] h-[48px]  items-center justify-between">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <div
                key={tab.key}
                onClick={() => setActiveTab(tab.key as "withdrawal" | "deposit")}
                className={`flex items-center justify-center rounded-[56px] text-[16px] transition-all no-underline
                  ${
                    isActive
                      ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500]"
                      : "bg-transparent text-[#DBDBDB] font-[400]"
                  } w-[140px] h-[40px]`}
              >
                {tab.label}
              </div>
            );
          })}
        </div> 

        {activeTab === "withdrawal" ? (
          <div className="mt-[10px]">
            <h3 className="text-[20px] font-[700] text-[#FFFFFF] mt-[40px]">Withdrawal Limits</h3>
            <p className="text-[16px] font-[400] text-[#C7C7C7] mb-6">
              Limits for sending money from balances to any recipient
            </p>

            {/* Daily Limit */}
            <div className=" w-[641px] h-[82px] bg-[#222222] rounded-[8px] p-[12px] mb-4">
              <div className="flex justify-between mb-2">
                <p className="text-[14px] font-[500] text-[#FFFFFF]">
                  Daily Limit: <span>$148,500</span>
                </p>
              </div>

               <div className="w-[617p] h-[8px] bg-[#4A4A4A] pr-[609px] rounded-[4px]">
                   <div className="w-[8px] h-[8px] bg-[#4DF2BE] rounded-full"></div>
              </div>

              <div className="flex justify-between mt-[10px] text-[13px] text-[#B5B5B5]">
                <span>$1,485,000 remaining</span>
                <span>Refreshes in 10 minutes</span>
              </div>
            </div>

            {/* Monthly Limit */}
             <div className=" w-[641px] h-[82px] mt-[20px] bg-[#222222] rounded-[8px] p-[12px] mb-4">
              <div className="flex justify-between mb-2">
                <p className="text-[14px] font-[500] text-[#FFFFFF]">
                  Monthly Limit: <span>$1,485,000</span>
                </p>
              </div>

                  <div className="w-[617p] h-[8px] bg-[#4A4A4A] pr-[609px] rounded-[4px]">
                   <div className="w-[8px] h-[8px] bg-[#4DF2BE] rounded-full"></div>
              </div>

              <div className="flex justify-between mt-[10px] text-[13px] text-[#B5B5B5]">
                <span>$1,485,000 remaining</span>
                <span>Refreshes in 10 minutes</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-[10px]">
            <h3 className="text-[20px] font-[700] text-[#FFFFFF] mt-[40px]">Deposit Limits</h3>
            <p className="text-[16px] font-[400] text-[#C7C7C7] mb-6">
             Limits for making payments into balances
            </p>

            {/* Daily Limit */}
             <div className=" w-[641px] h-[82px] bg-[#222222] rounded-[8px] p-[12px] mb-4">
              <div className="flex justify-between mb-2">
                <p className="text-[14px] font-[500] text-[#FFFFFF]">
                  Daily Limit: <span>$250,000</span>
                </p>
              </div>
             
                <div className="w-[617p] h-[8px] bg-[#4A4A4A] pr-[609px] rounded-[4px]">
                   <div className="w-[8px] h-[8px] bg-[#4DF2BE] rounded-full"></div>
              </div>

              <div className="flex justify-between mt-[10px] text-[13px] text-[#B5B5B5]">
                <span>$2,000,000 remaining</span>
                <span>Refreshes in 10 minutes</span>
              </div>
            </div>

            {/* Monthly Limit */}
              <div className=" w-[641px] h-[82px] mt-[20px] bg-[#222222] rounded-[8px] p-[12px] mb-4">
              <div className="flex justify-between mb-2">
                <p className="text-[14px] font-[500] text-[#FFFFFF]">
                  Monthly Limit: <span>$3,000,000</span>
                </p>
              </div>
                
                 <div className="w-[617p] h-[8px] bg-[#4A4A4A] pr-[609px] rounded-[4px]">
                   <div className="w-[8px] h-[8px] bg-[#4DF2BE] rounded-full"></div>
              </div>

              <div className="flex justify-between mt-[10px] text-[13px] text-[#B5B5B5]">
                <span>$3,000,000 remaining</span>
                <span>Refreshes in 10 minutes</span>
              </div>
            </div>
          </div>
        )}
        </div>

</div>
                     
         </div>

          <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>
                
                        <div className=" mb-[80px] mt-[30%] ">
                          <Footer />
                        </div>


    
         </div>

         
         </main>
  )
}

export default TransLim
