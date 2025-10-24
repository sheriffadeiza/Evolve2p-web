"use client";

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
import { useTransaction } from "@/app/useTransaction/useTransaction";
import TabsNav from "../TabsNav/TabsNav";
import Footer from "../Footer/Footer";
import { formatHashOrAddress } from "@/utils";

const Transaction = () => {
  const {
    filteredTransactions,
    searchTerm,
    setSearchTerm,
    loading,
    transactions,
  } = useTransaction();

  console.log(transactions);

  // ✅ Map transaction types to icons
  const typeIcons: Record<string, any> = {
    Buy: BuyIcon,
    Swap: SwapIcon,
    Sell: SellIcon,
    Sent: SendIcon,
    "Trade escrowed": EscrowIcon,
  };

  // ✅ Status colors
  const statusColors: Record<string, string> = {
    Processing:
      "bg-[#23303C] w-[94px] h-[22px] gap-[5px] text-[12px] font-[500] text-[#66B9FF] p-[2px_8px]",
    Completed:
      "bg-[#1B362B] w-[94px] h-[22px] gap-[5px] text-[12px] font-[500] text-[#4DF2BE] p-[2px_8px]",
    Failed:
      "bg-[#342827] w-[65px] h-[22px] gap-[5px] text-[#FE857D] text-[12px] font-[500] p-[2px_8px]",
    "In Escrow":
      "bg-[#392D46] w-[88px] h-[22px] gap-[5px] text-[12px] font-[500] text-[#CCA0FA] p-[2px_8px]",
    Cancelled:
      "bg-[#3A3A3A] w-[87px] h-[22px] gap-[5px] text-[12px] font-[500] text-[#DBDBDB] p-[2px_8px]",
    Expired:
      "bg-[#3A3A3A] w-[74px] h-[22px] gap-[5px] text-[12px] font-[500] text-[#DBDBDB] p-[2px_8px]",
  };

  // ✅ Status icons
  const statusIcons: Record<string, any> = {
    Processing: processingIcon,
    Completed: completedIcon,
    Failed: failedIcon,
    "In Escrow": escrowIcon,
    Cancelled: cancelledIcon,
    Expired: expiredIcon,
  };

  if (loading)
    return <p className="text-[#ffffff] p-10">Loading transactions...</p>;

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex bg-[#2D2D2D] rounded-[56px] mt-8 w-[296px] h-[48px] p-1 items-center justify-between">
          <TabsNav />
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col w-[1224px] h-[650px] p-[32px] rounded-[12px] bg-[#1A1A1A] mt-[50px]">
          <div className="flex items-center justify-between font-[700] text-[#FFFFFF]">
            <p className="text-[24px]">Transactions</p>
            <p className="text-[14px]">See all</p>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div
              className="flex items-center bg-[#3A3A3A] rounded-md px-3 py-2 w-[375px] h-[40px]"
              style={{ padding: "4px 8px 4px 16px" }}
            >
              <Search className="w-[17.916px] h-[17.916px] text-[#DBDBDB] mr-2" />
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-none w-[323px] h-[18px] bg-transparent text-[#C7C7C7] focus:outline-none w-full"
              />
            </div>
            <button
              className="flex items-center bg-[#2D2D2D] w-[94px] h-[36px] space-x-[5px] border-none rounded-full"
              style={{ padding: "8px 14px" }}
            >
              <Image src={Filter} alt="filter" />
              <p className="text-[14px] text-[#DBDBDB] font-[700]">Filters</p>
            </button>
          </div>

          {/* Table */}
          <table className="w-full mt-[30px] [&_th]:pl-[20px] [&_td]:pl-[20px] text-sm">
            <thead>
              <tr className="text-[#C7C7C7] text-[14px] font-[500]">
                <th className="text-left py-2 pl-4">Type</th>
                <th className="text-left py-2 pl-4">Amount</th>
                <th className="text-left py-2 pl-4">To Address</th>
                <th className="text-left py-2 pl-4">From Address</th>
                <th className="text-left py-2 pl-4">txHash</th>
                <th className="text-left py-2 pl-4">Status</th>
                <th className="text-left py-2 pl-4">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((t, i) => (
                  <tr
                    key={i}
                    className="border-b w-[1160px] text-[#DBDBDB] font-[500] text-[16px] bg-[#222222]"
                  >
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
                    <td className="py-3 pl-4">{t.amount}</td>
                    <td className="py-3 pl-4">
                      {formatHashOrAddress(t?.toAddress)}
                    </td>
                    <td className="py-3 pl-4">
                      {formatHashOrAddress(t?.fromAddress) || "-"}
                    </td>
                    <td className="py-3 pl-4">
                      {formatHashOrAddress(t?.txHash) || "-"}
                    </td>
                    <td className="py-3 pl-4">
                      <span
                        className={`flex items-center gap-5 px-3 py-1 rounded-full text-xs font-medium ${
                          statusColors[t.status] ||
                          "bg-gray-800 text-gray-400 px-2"
                        }`}
                      >
                        <Image
                          src={statusIcons[t.status] || completedIcon}
                          alt={t.status}
                          width={14}
                          height={14}
                          className="mr-1"
                        />
                        {" " + " " + t.status}
                      </span>
                    </td>
                    <td className="py-3 pl-4">
                      {new Date(t?.createdAt).toDateString()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center pt-[20px] py-6 text-[#ffffff]"
                  >
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mb-[80px] mt-[30%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Transaction;
