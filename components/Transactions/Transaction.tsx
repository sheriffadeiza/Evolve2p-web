"use client";
import React, { useState } from "react";
import Image from "next/image";
import { Search } from "lucide-react";
import Filter from "../../public/Assets/Evolve2p_filter/filter-horizontal.svg";
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
import Nav from "../NAV/Nav";
import { useRouter } from "next/navigation";
import { useTransaction } from "@/app/useTransaction/useTransaction";
import Footer from "../Footer/Footer";
import { formatHashOrAddress } from "@/utils";

// Constants
const TYPE_ICONS = {
  Buy: BuyIcon,
  Swap: SwapIcon,
  Sell: SellIcon,
  Sent: SendIcon,
  "Trade escrowed": EscrowIcon,
} as const;

const STATUS_CONFIG = {
  Processing: {
    color: "bg-[#23303C] text-[#66B9FF]",
    icon: processingIcon,
    width: "min-w-[94px]"
  },
  Completed: {
    color: "bg-[#1B362B] text-[#4DF2BE]", 
    icon: completedIcon,
    width: "min-w-[94px]"
  },
  Failed: {
    color: "bg-[#342827] text-[#FE857D]",
    icon: failedIcon,
    width: "min-w-[65px]"
  },
  "In Escrow": {
    color: "bg-[#392D46] text-[#CCA0FA]",
    icon: escrowIcon,
    width: "min-w-[88px]"
  },
  Cancelled: {
    color: "bg-[#3A3A3A] text-[#DBDBDB]",
    icon: cancelledIcon,
    width: "min-w-[87px]"
  },
  Expired: {
    color: "bg-[#3A3A3A] text-[#DBDBDB]",
    icon: expiredIcon,
    width: "min-w-[74px]"
  },
} as const;

const Transaction = () => {
  const {
    filteredTransactions,
    searchTerm,
    setSearchTerm,
    loading,
    transactions,
  } = useTransaction();

  const router = useRouter();
  const [activeTab, setActiveTab] = useState("transaction");

  // Custom Tabs Component
  const CustomTabs = () => {
    const tabs = [
      { id: "balance", label: "Balance" },
      { id: "transaction", label: "Transaction" },
      { id: "swap", label: "Swap" },
    ];

    return (
      <div className="flex bg-[#2D2D2D] rounded-[56px] w-full max-w-[400px] h-[48px] p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id === "balance") {
                router.push("/wallet");
              } else if (tab.id === "transaction") {
                router.push("/wallet?tab=transaction");
              } else {
                router.push("/swap");
              }
            }}
            className={`flex-1 flex items-center justify-center rounded-[56px] text-[14px] font-[500] transition-all ${
              tab.id === activeTab
                ? "bg-[#4A4A4A] text-[#FCFCFC]"
                : "text-[#DBDBDB] hover:text-[#FCFCFC]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F1012] flex items-center justify-center">
        <p className="text-white text-lg">Loading transactions...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1012] text-white flex flex-col">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1">
        <Nav />

        {/* Tabs Navigation */}
        <div className="flex justify-center mt-8">
          <CustomTabs />
        </div>

        {/* Main Content */}
        <div className="w-full max-w-7xl mx-auto bg-[#1A1A1A] rounded-[12px] mt-8 p-4 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
            <h1 className="text-[20px] sm:text-[24px] lg:text-[28px] font-bold text-white">
              Transactions
            </h1>
            <button className="text-[14px] font-bold text-white hover:opacity-80 transition-opacity w-fit sm:w-auto text-right">
              See all
            </button>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 mb-6">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="flex items-center bg-[#3A3A3A] rounded-lg px-4 py-3 w-full max-w-[500px]">
                <Search className="w-5 h-5 text-[#DBDBDB] mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none text-[#C7C7C7] placeholder-[#8F8F8F] focus:outline-none w-full text-sm lg:text-base"
                />
              </div>
            </div>

            {/* Filter Button */}
            <button className="flex items-center justify-center bg-[#2D2D2D] px-4 py-3 space-x-2 border-none rounded-full hover:bg-[#3A3A3A] transition-colors w-fit">
              <Image src={Filter} alt="filter" width={16} height={16} />
              <span className="text-sm font-bold text-[#DBDBDB]">Filters</span>
            </button>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            {/* Desktop Table */}
            <table className="w-full hidden lg:table">
              <thead>
                <tr className="border-b border-[#333]">
                  <th className="text-left py-4 pl-4 text-[14px] font-[500] text-[#C7C7C7]">Type</th>
                  <th className="text-left py-4 pl-4 text-[14px] font-[500] text-[#C7C7C7]">Amount</th>
                  <th className="text-left py-4 pl-4 text-[14px] font-[500] text-[#C7C7C7]">To Address</th>
                  <th className="text-left py-4 pl-4 text-[14px] font-[500] text-[#C7C7C7]">From Address</th>
                  <th className="text-left py-4 pl-4 text-[14px] font-[500] text-[#C7C7C7]">txHash</th>
                  <th className="text-left py-4 pl-4 text-[14px] font-[500] text-[#C7C7C7]">Status</th>
                  <th className="text-left py-4 pl-4 text-[14px] font-[500] text-[#C7C7C7]">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map((transaction, index) => (
                    <DesktopTableRow 
                      key={transaction.id || index} 
                      transaction={transaction} 
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-[#8F8F8F]">
                      No transactions found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-3">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) => (
                  <MobileTransactionCard 
                    key={transaction.id || index} 
                    transaction={transaction} 
                  />
                ))
              ) : (
                <div className="text-center py-8 text-[#8F8F8F]">
                  No transactions found
                </div>
              )}
            </div>
          </div>
        </div>

         <div className="w-[106%] ml-[-40px] h-[1px] bg-[#fff] mt-[30%] opacity-20 my-8"></div>
      <div className="mb-[80px] whitespace-nowrap mt-[30%]">
        <Footer />
      </div>
      </div>
    </main>
  );
};

// Desktop Table Row Component
const DesktopTableRow = ({ transaction }: { transaction: any }) => {
  const statusConfig = STATUS_CONFIG[transaction.status as keyof typeof STATUS_CONFIG] || 
    { color: "bg-gray-800 text-gray-400", icon: completedIcon, width: "min-w-auto" };
  
  const typeIcon = TYPE_ICONS[transaction.type as keyof typeof TYPE_ICONS] || BuyIcon;

  return (
    <tr className="border-b border-[#333] last:border-b-0 hover:bg-[#222222] transition-colors">
      {/* Type */}
      <td className="py-4 pl-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-[#0F1012] rounded-full flex-shrink-0">
            <Image src={typeIcon} alt={transaction.type} width={16} height={16} />
          </div>
          <span className="text-[14px] font-[500] text-[#DBDBDB]">{transaction.type}</span>
        </div>
      </td>

      {/* Amount */}
      <td className="py-4 pl-4 text-[14px] text-[#DBDBDB]">
        {transaction.amount}
      </td>

      {/* To Address */}
      <td className="py-4 pl-4">
        <span className="font-mono text-[12px] text-[#DBDBDB] break-all">
          {formatHashOrAddress(transaction?.toAddress)}
        </span>
      </td>

      {/* From Address */}
      <td className="py-4 pl-4">
        <span className="font-mono text-[12px] text-[#DBDBDB] break-all">
          {formatHashOrAddress(transaction?.fromAddress) || "-"}
        </span>
      </td>

      {/* txHash */}
      <td className="py-4 pl-4">
        <span className="font-mono text-[12px] text-[#DBDBDB] break-all">
          {formatHashOrAddress(transaction?.txHash) || "-"}
        </span>
      </td>

      {/* Status */}
      <td className="py-4 pl-4">
        <span className={`inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.width}`}>
          <Image src={statusConfig.icon} alt={transaction.status} width={12} height={12} />
          {transaction.status}
        </span>
      </td>

      {/* Date */}
      <td className="py-4 pl-4 text-[12px] text-[#DBDBDB] whitespace-nowrap">
        {transaction?.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : "-"}
      </td>
    </tr>
  );
};

// Mobile Transaction Card Component
const MobileTransactionCard = ({ transaction }: { transaction: any }) => {
  const statusConfig = STATUS_CONFIG[transaction.status as keyof typeof STATUS_CONFIG] || 
    { color: "bg-gray-800 text-gray-400", icon: completedIcon, width: "min-w-auto" };
  
  const typeIcon = TYPE_ICONS[transaction.type as keyof typeof TYPE_ICONS] || BuyIcon;

  return (
    <div className="bg-[#222222] rounded-lg p-3 border border-[#333]">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 bg-[#0F1012] rounded-full flex-shrink-0">
            <Image src={typeIcon} alt={transaction.type} width={16} height={16} />
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-bold text-[#DBDBDB] truncate">{transaction.type}</p>
            <p className="text-[12px] text-[#DBDBDB] truncate">{transaction.amount}</p>
          </div>
        </div>
        <span className={`inline-flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color} ${statusConfig.width} flex-shrink-0`}>
          <Image src={statusConfig.icon} alt={transaction.status} width={12} height={12} />
          <span className="truncate">{transaction.status}</span>
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 gap-2 text-sm">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[#8F8F8F] text-xs flex-shrink-0">To:</span>
          <span className="font-mono text-[#DBDBDB] text-xs text-right break-all">
            {formatHashOrAddress(transaction?.toAddress)}
          </span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-[#8F8F8F] text-xs flex-shrink-0">From:</span>
          <span className="font-mono text-[#DBDBDB] text-xs text-right break-all">
            {formatHashOrAddress(transaction?.fromAddress) || "-"}
          </span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-[#8F8F8F] text-xs flex-shrink-0">Hash:</span>
          <span className="font-mono text-[#DBDBDB] text-xs text-right break-all">
            {formatHashOrAddress(transaction?.txHash) || "-"}
          </span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-[#8F8F8F] text-xs flex-shrink-0">Date:</span>
          <span className="text-[#DBDBDB] text-xs text-right">
            {transaction?.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : "-"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Transaction;