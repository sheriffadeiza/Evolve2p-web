"use client";

import Image from "next/image";
import Link from "next/link";
import { useTransaction } from "@/app/useTransaction/useTransaction";
import { formatHashOrAddress } from "@/utils";

// Icons
import BuyIcon from "../../public/Assets/Evolve2p_BuyT/arrow-down-right-01.svg";
import SwapIcon from "../../public/Assets/Evolve2p_SwapT/elements.svg";
import SellIcon from "../../public/Assets/Evolve2p_SellT/arrow-up-right-01.svg";
import SendIcon from "../../public/Assets/Evolve2p_SellT/arrow-up-right-01.svg";
import EscrowIcon from "../../public/Assets/Evolve2p_EscrowedT/elements.svg";
import processingIcon from "../../public/Assets/Evolve2p_ProcT/elements.svg";
import completedIcon from "../../public/Assets/Evolve2p_CompT/elements.svg";
import failedIcon from "../../public/Assets/Evolve2p_FailedT/elements.svg";
import escrowIcon from "../../public/Assets/Evolve2p_EscrowT/elements.svg";
import cancelledIcon from "../../public/Assets/Evolve2p_CanclT/elements.svg";
import expiredIcon from "../../public/Assets/Evolve2p_ExpT/elements.svg";

// Placeholder images
import G19 from "../../public/Assets/Evolve2p_group19/Group 19.svg";
import R_arrow from "../../public/Assets/Evolve2p_R/arrow-right-02.svg";

// Constants
const STATUS_CONFIG = {
  Processing: { 
    color: "bg-[#23303C] text-[#66B9FF]", 
    icon: processingIcon 
  },
  Completed: { 
    color: "bg-[#1B362B] text-[#4DF2BE]", 
    icon: completedIcon 
  },
  Failed: { 
    color: "bg-[#342827] text-[#FE857D]", 
    icon: failedIcon 
  },
  "In Escrow": { 
    color: "bg-[#392D46] text-[#CCA0FA]", 
    icon: escrowIcon 
  },
  Cancelled: { 
    color: "bg-[#3A3A3A] text-[#DBDBDB]", 
    icon: cancelledIcon 
  },
  Expired: { 
    color: "bg-[#3A3A3A] text-[#DBDBDB]", 
    icon: expiredIcon 
  },
} as const;

const TYPE_ICONS = {
  Buy: BuyIcon,
  Swap: SwapIcon,
  Escrowed: EscrowIcon,
  Sell: SellIcon,
  Send: SendIcon,
} as const;

const TABLE_HEADERS = [
  "Type",
  "Amount", 
  "fromAddress",
  "toAddress",
  "Status",
  "Date"
];

const WalletTransactions = () => {
  const { filteredTransactions, loading } = useTransaction();
  
  if (loading) {
    return (
      <div className="w-full h-[722px] flex items-center justify-center">
        <p className="text-[#C7C7C7] text-sm">Loading transactions...</p>
      </div>
    );
  }

  const recentTransactions = filteredTransactions.slice(0, 10);

  return (
    <div className="w-full h-[722px]">
      {/* Header */}
      <div className="flex items-center justify-between w-full max-w-[1224px] h-[338px] rounded-[12px]">
        <p className="text-[16px] font-[500] text-[#8F8F8F]">Transactions</p>
        <div className="flex items-center space-x-[10px]">
          <Link 
            href="/transactions" 
            className="flex items-center hover:opacity-80 transition-opacity"
          >
            <p className="text-[14px] font-[700] text-[#FCFCFC]">See all</p>
            <Image src={R_arrow} alt="right arrow" className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Transaction List */}
      {recentTransactions.length > 0 ? (
        <div className="w-full mt-[30px] overflow-x-auto">
          <table className="w-full text-sm min-w-[800px]">
            <thead>
              <tr className="text-[#C7C7C7] text-[14px] font-[500]">
                {TABLE_HEADERS.map((header) => (
                  <th 
                    key={header} 
                    className="text-left py-2 pl-4 first:pl-6 last:pr-6"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((transaction, index) => (
                <TransactionRow 
                  key={`${transaction.id || index}-${transaction.createdAt}`}
                  transaction={transaction}
                />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

// Transaction Row Component
const TransactionRow = ({ transaction }: { transaction: any }) => {
  const statusConfig = STATUS_CONFIG[transaction.status as keyof typeof STATUS_CONFIG] || 
    { color: "bg-gray-800 text-gray-400", icon: completedIcon };
  
  const typeIcon = TYPE_ICONS[transaction.type as keyof typeof TYPE_ICONS] || BuyIcon;

  return (
    <tr className="border-b text-[#DBDBDB] font-[500] text-[16px] bg-[#222222] hover:bg-[#2A2A2A] transition-colors">
      {/* Type */}
      <td className="flex items-center p-[10px_12px] gap-[20px] pl-6">
        <div className="flex items-center justify-center w-[20px] h-[20px] bg-[#0F1012] p-[5.6px] rounded-full">
          <Image
            src={typeIcon}
            alt={transaction.type}
            width={16}
            height={16}
            className="min-w-[16px]"
          />
        </div>
        <span className="whitespace-nowrap">{transaction.type}</span>
      </td>

      {/* Amount */}
      <td className="py-3 pl-4 whitespace-nowrap">
        {transaction.amount}
      </td>

      {/* From Address */}
      <td className="py-3 pl-4 font-mono text-sm">
        {formatHashOrAddress(transaction.fromAddress)}
      </td>

      {/* To Address */}
      <td className="py-3 pl-4 font-mono text-sm">
        {formatHashOrAddress(transaction.toAddress) || "-"}
      </td>

      {/* Status */}
      <td className="py-3 pl-4">
        <span
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium w-fit ${statusConfig.color}`}
        >
          <Image
            src={statusConfig.icon}
            alt={transaction.status}
            width={14}
            height={14}
            className="min-w-[14px]"
          />
          {transaction.status}
        </span>
      </td>

      {/* Date */}
      <td className="py-3 pl-4 pr-6 whitespace-nowrap">
        {transaction.createdAt ? 
          new Date(transaction.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          }) : 
          "-"
        }
      </td>
    </tr>
  );
};

// Empty State Component
const EmptyState = () => (
  <div className="flex-1 flex flex-col items-center justify-center mt-[5%]">
    <Image 
      src={G19} 
      alt="No transactions" 
      className="mb-4"
    />
    <p className="text-[14px] font-[400] text-[#8F8F8F] text-center">
      Your 10 most recent transactions will appear here
    </p>
  </div>
);

export default WalletTransactions;