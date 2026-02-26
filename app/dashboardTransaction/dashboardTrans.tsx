"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransaction } from "@/app/useTransaction/useTransaction";

// icons
import BuyIcon from "../../public/Assets/Evolve2p_BuyT/arrow-down-right-01.svg";
import SwapIcon from "../../public/Assets/Evolve2p_SwapT/elements.svg";
import EscrowIcon from "../../public/Assets/Evolve2p_EscrowedT/elements.svg";
import SellIcon from "../../public/Assets/Evolve2p_SellT/arrow-up-right-01.svg";
import SendIcon from "../../public/Assets/Evolve2p_SellT/arrow-up-right-01.svg";
import processingIcon from "../../public/Assets/Evolve2p_ProcT/elements.svg";
import completedIcon from "../../public/Assets/Evolve2p_CompT/elements.svg";
import failedIcon from "../../public/Assets/Evolve2p_FailedT/elements.svg";
import escrowIcon from "../../public/Assets/Evolve2p_EscrowT/elements.svg";
import cancelledIcon from "../../public/Assets/Evolve2p_CanclT/elements.svg";
import expiredIcon from "../../public/Assets/Evolve2p_ExpT/elements.svg";

// placeholder images
import G19 from "../../public/Assets/Evolve2p_group19/Group 19.svg";
import R_arrow from "../../public/Assets/Evolve2p_R/arrow-right-02.svg";

const DashboardTransactions = () => {
  const { filteredTransactions, loading } = useTransaction();

  const statusColors: Record<string, string> = {
    Processing: "bg-[#23303C] text-[#66B9FF]",
    Completed: "bg-[#1B362B] text-[#4DF2BE]",
    Failed: "bg-[#342827] text-[#FE857D]",
    "In Escrow": "bg-[#392D46] text-[#CCA0FA]",
    Cancelled: "bg-[#3A3A3A] text-[#DBDBDB]",
    Expired: "bg-[#3A3A3A] text-[#DBDBDB]",
  };

  const statusIcons: Record<string, any> = {
    Processing: processingIcon,
    Completed: completedIcon,
    Failed: failedIcon,
    "In Escrow": escrowIcon,
    Cancelled: cancelledIcon,
    Expired: expiredIcon,
  };

  const typeIcons: Record<string, any> = {
    Buy: BuyIcon,
    Swap: SwapIcon,
    Escrowed: EscrowIcon,
    Sell: SellIcon,
    Send: SendIcon,
  };

  if (loading) {
    return (
      <p className="text-[#C7C7C7] text-sm mt-4">Loading transactions...</p>
    );
  }

  const recentTransactions = filteredTransactions.slice(0, 10);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex items-center justify-between w-full rounded-[12px] mb-5 sm:mb-6">
        <p className="text-[14px] sm:text-[16px] font-[500] text-[#8F8F8F]">Recent Transactions</p>
        <div className="flex items-center space-x-2 sm:space-x-[10px]">
          <Link href="/transactions" className="flex items-center hover:opacity-80">
            <p className="text-[12px] sm:text-[14px] font-[700] text-[#FCFCFC]">View All</p>
            <Image 
              src={R_arrow} 
              alt="rarrow" 
              width={14}
              height={14}
              className="ml-1 sm:ml-2 w-3 h-3 sm:w-4 sm:h-4"
            />
          </Link>
        </div>
      </div>

      {/* Transaction list */}
      {recentTransactions.length > 0 ? (
        <>
          {/* Desktop Table (hidden on mobile) */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[#C7C7C7] text-[14px] font-[500]">
                  <th className="text-left py-3 pl-4">Transaction Type</th>
                  <th className="text-left py-3 pl-4">Amount</th>
                  <th className="text-left py-3 pl-4">Transaction Status</th>
                  <th className="text-left py-3 pl-4">Transaction Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((t, i) => (
                  <tr
                    key={i}
                    className="border-b text-[#DBDBDB] font-[500] text-[16px] bg-[#222222] hover:bg-[#2A2A2A] transition-colors"
                  >
                    {/* Type */}
                    <td className="py-3 pl-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-[#0F1012] rounded-full flex-shrink-0">
                          <Image
                            src={typeIcons[t.type] || BuyIcon}
                            alt={t.type}
                            width={16}
                            height={16}
                            className="w-4 h-4"
                          />
                        </div>
                        <span className="text-[14px] truncate">{t.type}</span>
                      </div>
                    </td>

                    {/* Amount */}
                    <td className="py-3 pl-4 text-[14px]">{t.amount}</td>

                    {/* Status - Reduced width */}
                    <td className="py-3 pl-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          statusColors[t.status] || "bg-gray-800 text-gray-400"
                        }`}
                      >
                        <Image
                          src={statusIcons[t.status] || completedIcon}
                          alt={t.status}
                          width={12}
                          height={12}
                          className="w-3 h-3"
                        />
                        <span>{t.status}</span>
                      </span>
                    </td>

                    {/* Date */}
                    <td className="py-3 pl-4 text-[12px] text-[#DBDBDB] whitespace-nowrap">
                      {t.date ? new Date(t.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      }) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards (visible on mobile and tablet) */}
          <div className="lg:hidden space-y-3">
            {recentTransactions.map((t, i) => (
              <div 
                key={i}
                className="bg-[#222222] rounded-lg p-3 border border-[#333333]"
              >
                {/* Header - Shows Type and Status */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-[#0F1012] rounded-full flex-shrink-0">
                      <Image
                        src={typeIcons[t.type] || BuyIcon}
                        alt={t.type}
                        width={16}
                        height={16}
                        className="w-4 h-4"
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-bold text-[#DBDBDB] truncate">{t.type}</p>
                      <p className="text-[12px] text-[#8F8F8F] truncate">
                        {t.date ? new Date(t.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : ""}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[t.status] || "bg-gray-800 text-gray-400"
                    }`}
                  >
                    <Image
                      src={statusIcons[t.status] || completedIcon}
                      alt={t.status}
                      width={12}
                      height={12}
                      className="w-3 h-3"
                    />
                    <span className="truncate">{t.status}</span>
                  </span>
                </div>

                {/* Details - Shows Amount */}
                <div>
                  <p className="text-[12px] text-[#8F8F8F] mb-1">Transaction Amount</p>
                  <p className="text-[14px] font-[600] text-[#DBDBDB]">{t.amount}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        // 👇 placeholder if no transactions
        <div className="flex flex-col items-center justify-center py-8 sm:py-12 border-0">
          <Image 
            src={G19} 
            alt="group19" 
            width={120}
            height={120}
            className="w-20 h-20 sm:w-24 sm:h-24 mb-4"
          />
          <p className="text-[14px] font-[400] text-[#8F8F8F] text-center px-4">
            Your 10 most recent transactions will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardTransactions;