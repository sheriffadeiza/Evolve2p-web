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
    <div className="w-full lg:w-[913px] h-[722px]  sm:mt-[4%] mt-[34%]  md:mt-[0px]">
      {/* Header */}
      <div className="flex items-center justify-between w-full lg:w-[900px] h-[24px] rounded-[12px] mb-[20px] ">
        <p className="text-[16px] font-[500] text-[#8F8F8F]">Transactions</p>
        <div className="flex items-center space-x-[10px]">
          <Link href="/transactions" className="flex items-center">
            <p className="text-[14px] font-[700] text-[#FCFCFC]">See all</p>
            <Image src={R_arrow} alt="rarrow" className="ml-2" />
          </Link>
        </div>
      </div>

      {/* Transaction list */}
      {recentTransactions.length > 0 ? (
        <table className="w-full mt-[30px] text-sm">
          <thead>
            <tr className="text-[#C7C7C7] text-[14px] font-[500]">
              <th className="text-left py-2 pl-4">Type</th>
              <th className="text-left py-2 pl-4">Amount</th>
              <th className="text-left py-2 pl-4">Asset</th>
              <th className="text-left py-2 pl-4">Counterparty</th>
              <th className="text-left py-2 pl-4">Status</th>
              <th className="text-left py-2 pl-4">Date</th>
            </tr>
          </thead>
          <tbody>
            {recentTransactions.map((t, i) => (
              <tr
                key={i}
                className="border-b text-[#DBDBDB] font-[500] text-[16px] bg-[#222222]"
              >
                {/* Type */}
                <td className="flex items-center p-[10px_12px] gap-[20px]">
                  <div className="flex items-center pl-4 w-[20px] h-[20px] bg-[#0F1012] p-[5.6px] rounded-full">
                    <Image
                      src={typeIcons[t.type] || BuyIcon}
                      alt={t.type}
                      width={16}
                      height={16}
                    />
                  </div>
                  {t.type}
                </td>

                {/* Amount */}
                <td className="py-3 pl-4">{t.amount}</td>

                {/* Asset */}
                <td className="py-3 pl-4">{t.asset}</td>

                {/* Counterparty */}
                <td className="py-3 pl-4">{t.counterparty || "-"}</td>

                {/* Status */}
                <td className="py-3 pl-4">
                  <span
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                      statusColors[t.status] || "bg-gray-800 text-gray-400"
                    }`}
                  >
                    <Image
                      src={statusIcons[t.status] || completedIcon}
                      alt={t.status}
                      width={14}
                      height={14}
                    />
                    {t.status}
                  </span>
                </td>

                {/* Date */}
                <td className="py-3 pl-4">
                  {t.date ? new Date(t.date).toDateString() : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        // 👇 placeholder if no transactions
        <div className=" flex flex-col items-center lg:mt-[15%] justify-center border-0 border-red-500">
          <Image src={G19} alt="group19" />
          <p className="text-[14px] font-[400] text-[#8F8F8F]">
            Your 10 most recent transactions will appear here
          </p>
        </div>
      )}

      {/* Divider */}
    </div>
  );
};

export default DashboardTransactions;
