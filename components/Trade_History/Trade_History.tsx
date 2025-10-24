"use client";

import React, { useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import Footer from "../../components/Footer/Footer";
import Image from "next/image";

import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import G19 from "../../public/Assets/Evolve2p_group19/Group 19.svg"; // Empty state image

const getTradeIcon = (type: string) => {
  if (type.includes("BTC")) return BTC;
  if (type.includes("ETH")) return ETH;
  if (type.includes("USDC")) return USDC;
  if (type.includes("USDT")) return USDT;
  return null;
};

const Trade_History: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [activeTrades, setActiveTrades] = useState<any[]>([]);
  const [completedTrades, setCompletedTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const fetchedActive = [
        {
          type: "Sell BTC",
          method: "Bank Transfer",
          youPay: "0.008 BTC",
          youReceive: "$300",
          counterpart: "@CryptoBuyer",
          date: "Aug 20, 2025",
          status: "Pending Acceptance",
        },
        {
          type: "Buy ETH",
          method: "Credit Card",
          youPay: "$1,500",
          youReceive: "0.5 ETH",
          counterpart: "@CryptoGuy",
          date: "Aug 21, 2025",
          status: "Processing",
        },
        {
          type: "Buy BTC",
          method: "Cash App",
          youPay: "0.005 BTC",
          youReceive: "$200",
          counterpart: "@CoinMaster",
          date: "Aug 22, 2025",
          status: "In Escrow",
        },
        {
          type: "Sell BTC",
          method: "Wire Transfer",
          youPay: "0.009 BTC",
          youReceive: "$360",
          counterpart: "@UserX",
          date: "Aug 23, 2025",
          status: "Canceled",
        },
      ];

      const fetchedCompleted = [
        {
          type: "Buy USDT",
          method: "PayPal",
          youPay: "$100",
          youReceive: "100 USDT",
          counterpart: "@CoinExpert",
          date: "Aug 22, 2025",
          status: "Completed",
        },
        {
          type: "Sell USDC",
          method: "Wire Transfer",
          youPay: "200 USDC",
          youReceive: "$400",
          counterpart: "@CryptoTrader",
          date: "Aug 23, 2025",
          status: "Completed",
        },
      ];

      setActiveTrades(fetchedActive);
      setCompletedTrades(fetchedCompleted);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <main className="min-h-screen bg-[#0F1012] text-white p-[20px] md:p-[40px]">
      <Nav />

      <div className="max-w-7xl mx-auto mt-[40px]">
        {/* ======= Tabs Section ======= */}
        <div className="flex bg-[#2D2D2D] rounded-[56px] w-[330px] h-[48px] p-1 items-center justify-between mb-[30px]">
          {/* Active */}
          <div
            onClick={() => setActiveTab("active")}
            className={`flex items-center justify-center gap-2 rounded-[56px] text-[16px] transition w-[150px] h-[40px] cursor-pointer ${
              activeTab === "active"
                ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500]"
                : "bg-transparent text-[#DBDBDB] font-[400]"
            }`}
          >
            Active
            <span
              className={`w-[26px] h-[24px] ml-[10px] flex items-center justify-center rounded-full text-[13px] font-[600] ${
                activeTab === "active"
                  ? "bg-[#4DF2BE] text-[#1A1A1A]"
                  : "bg-[#5C5C5C] text-[#C7C7C7]"
              }`}
            >
              {activeTrades.length}
            </span>
          </div>

          {/* Completed */}
          <div
            onClick={() => setActiveTab("completed")}
            className={`flex items-center justify-center gap-2 rounded-[56px] text-[16px] transition w-[150px] h-[40px] cursor-pointer ${
              activeTab === "completed"
                ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500]"
                : "bg-transparent text-[#DBDBDB] font-[400]"
            }`}
          >
            Completed
            <span
              className={`w-[26px] h-[24px] ml-[10px] flex items-center justify-center rounded-full text-[13px] font-[600] ${
                activeTab === "completed"
                  ? "bg-[#4DF2BE] text-[#1A1A1A]"
                  : "bg-[#5C5C5C] text-[#C7C7C7]"
              }`}
            >
              {completedTrades.length}
            </span>
          </div>
        </div>

        {/* ======= ACTIVE TAB ======= */}
        {activeTab === "active" && (
          <>
            {loading ? (
              <p className="text-center text-[#8F8F8F] mt-10">Loading trades...</p>
            ) : activeTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-[#1A1A1A] rounded-[12px]">
                <Image src={G19} alt="group19" width={120} height={120} />
                <p className="text-[16px] text-[#C7C7C7] mt-[16px]">No Active Trades</p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-[#1A1A1A] p-6 rounded-[12px] shadow-lg w-[1224px]">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[#C7C7C7] h-[35px] text-[14px] font-[500] border-b border-[#2D2D2D]">
                      <th className="pl-[10px]">Trade Type</th>
                      <th>Payment Method</th>
                      <th>You Pay</th>
                      <th>You Receive</th>
                      <th>Counterparty</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeTrades.map((trade, index) => (
                      <tr
                        key={index}
                        className="h-[64px] border-[#2D2D2D] text-[16px] font-[500] text-[#DBDBDB] hover:bg-[#242424] transition"
                      >
                        <td className="py-[20px] pl-[15px] flex items-center gap-[10px]">
                          {getTradeIcon(trade.type) && (
                            <Image
                              src={getTradeIcon(trade.type)!}
                              alt={trade.type}
                              width={20}
                              height={20}
                            />
                          )}
                          <span>{trade.type}</span>
                        </td>
                        <td className="py-[12px] text-[#A3A3A3]">{trade.method}</td>
                        <td className="py-[12px]">{trade.youPay}</td>
                        <td className="py-[12px]">{trade.youReceive}</td>
                        <td className="py-[12px] text-[#4DF2BE]">{trade.counterpart}</td>
                        <td className="py-[12px] text-[#C7C7C7]">{trade.date}</td>
                        <td>
                          <span
                            className={`px-3 p-[2px_8px] rounded-full text-[12px] ${
                              trade.status === "Pending Acceptance"
                                ? "bg-[#F59E0B33] text-[#F59E0B]"
                                : trade.status === "Processing"
                                ? "bg-[#3B82F633] text-[#3B82F6]"
                                : trade.status === "In Escrow"
                                ? "bg-[#392D46] text-[#CCA0FA]"
                                : trade.status === "in Dispute"
                                ? "bg-[#342827] text-[#FE857D]"
                                : trade.status === "Awaiting Release"
                                ? "bg-[#10B98133] text-[#10B981]"
                                : trade.status === "Canceled"
                                ? "bg-[#EF444433] text-[#EF4444]"
                                : "bg-[#6B728033] text-[#D1D5DB]"
                            }`}
                          >
                            {trade.status}
                          </span>
                        </td>
                        <td>
                          <button className="bg-[#2D2D2D] w-[61px] h-[36px] border-none text-[#FFFFFF] px-4 py-1 rounded-full text-[13px] hover:opacity-80 transition">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ======= COMPLETED TAB ======= */}
        {activeTab === "completed" && (
          <>
            {loading ? (
              <p className="text-center text-[#8F8F8F] mt-10">Loading trades...</p>
            ) : completedTrades.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[400px] bg-[#1A1A1A] rounded-[12px]">
                <Image src={G19} alt="group19" width={120} height={120} />
                <p className="text-[16px] text-[#C7C7C7] mt-[16px]">No Completed Trades</p>
              </div>
            ) : (
              <div className="overflow-x-auto bg-[#1A1A1A] p-6 rounded-[12px] shadow-lg w-[1224px]">
                <table className="min-w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[#C7C7C7] h-[35px] text-[14px] font-[500] border-b border-[#2D2D2D]">
                      <th className="pl-[10px]">Trade Type</th>
                      <th>Payment Method</th>
                      <th>You Pay</th>
                      <th>You Receive</th>
                      <th>Counterparty</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedTrades.map((trade, index) => (
                      <tr
                        key={index}
                        className="h-[64px] border-[#2D2D2D] text-[16px] font-[500] text-[#DBDBDB] hover:bg-[#242424] transition"
                      >
                        <td className="py-[20px] pl-[15px] flex items-center gap-[10px]">
                          {getTradeIcon(trade.type) && (
                            <Image
                              src={getTradeIcon(trade.type)!}
                              alt={trade.type}
                              width={20}
                              height={20}
                            />
                          )}
                          <span>{trade.type}</span>
                        </td>
                        <td className="py-[12px] text-[#A3A3A3]">{trade.method}</td>
                        <td className="py-[12px]">{trade.youPay}</td>
                        <td className="py-[12px]">{trade.youReceive}</td>
                        <td className="py-[12px] text-[#4DF2BE]">{trade.counterpart}</td>
                        <td className="py-[12px] text-[#C7C7C7]">{trade.date}</td>
                        <td>
                          <span className="px-3 py-[2px_8px] bg-[#4DF2BE33] text-[#4DF2BE] rounded-full text-[12px]">
                            {trade.status}
                          </span>
                        </td>
                        <td>
                          <button className="bg-[#2D2D2D] w-[61px] h-[36px] border-none text-[#FFFFFF] px-4 py-1 rounded-full text-[13px] hover:opacity-80 transition">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>
      <div className="mb-[80px] mt-[30%]">
        <Footer />
      </div>
    </main>
  );
};

export default Trade_History;
