"use client";

import React, { useState } from "react";
import Nav from "../../components/NAV/Nav";
import Image from "next/image";
import Parrow from "../../public/Assets/Evolve2p_pArrow/elements.svg";
import SlashH from "../../public/Assets/Evolve2p_viewslash/view-off-slash.png";
import Send from "../../public/Assets/Evolve2p_send/Dashboard/elements.svg";
import Barrow from "../../public/Assets/Evolve2p_Barrow/arrow-down-01.svg";
import Rarrowd from "../../public/Assets/Evolve2p_Rarrowd/arrow-down-right-01.svg";
import Swap from "../../public/Assets/Evolve2p_Swap/elements.svg";
import R_arrow from "../../public/Assets/Evolve2p_R/arrow-right-02.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import G19 from "../../public/Assets/Evolve2p_group19/Group 19.svg";
import Points from "../../public/Assets/Evolve2p_threep/Wallet/elements.svg";
import Footer from "../Footer/Footer";

const Wallet = () => {
  const [activeTab, setActiveTab] = useState("Balance");
  const tabs = ["Balance", "Transactions", "Swap"];

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex bg-[#2D2D2D] rounded-[56px] mt-8 w-[296px] h-[48px] p-1 items-center justify-between">
          {tabs.map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center justify-center rounded-[56px] text-[16px] transition
                ${
                  activeTab === tab
                    ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500] w-[90px] h-[40px]"
                    : "bg-transparent text-[#DBDBDB] font-[400] w-[90px] h-[40px]"
                }
              `}
              style={{ minWidth: "90px", minHeight: "40px" }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* Balance Cards */}
        <div className="flex md:flex-row justify-between pr-[30px] mt-[5px]">
          {/*left_side */}
          <div
            className="flex flex-col justify-between mt-[30px] w-[706px] h-[188px]  bg-[#222222] rounded-[12px]"
            style={{ padding: "24px 20px" }}
          >
            <div className="flex items-center  mt-[5px] gap-2 mb-6  space-x-[10px]">
              <p className="text-[16px] font-[400] text-[#DBDBDB]">
                Available Balance
              </p>
              <Image
                src={SlashH}
                alt="slash"
                sizes="20"
                className="text-[#DBDBDB]"
              />
            </div>
            <div className="flex  space-x-[10px] mt-[-35px]">
              <p className="text-[36px] font-[700] text-[#FCFCFC]">
                <span className="text-[28px]">$</span>0
              </p>
              <div className="flex items-center  mt-[40px] w-[82px] h-[36px] ml-[5px] bg-[#2D2D2D]  font-[700] text-[16px] rounded-full">
                <p className="text-[14px] font-[700] ml-[20px]  text-[#DBDBDB]">
                  USD
                </p>
                <Image
                  src={Parrow}
                  alt="arrow"
                  sizes="16px"
                  className="ml-[10px] text-[#8F8F8F]"
                />
              </div>
            </div>
            <div
              className="flex items-center space-x-[10px] ml-[40%] mt-[10px]"
              style={{ padding: "10px 16px" }}
            >
              <div className="flex w-[122px] h-[40px]  items-center bg-[#2D2D2D] text-[#4DF2BE] space-x-[5px] ml-[5px] mt-4 rounded-full">
                <Image src={Send} alt="send" className="ml-[10px]" />
                <p className="px-4 py-1 ml-[5px]   rounded-full font-[700] text-[14px] ml-2">
                  Send
                </p>
                <Image
                  src={Barrow}
                  alt="arrow"
                  sizes="20px"
                  className="ml-[10px]"
                />
              </div>
              <div className="flex w-[122px] h-[40px]  items-center bg-[#2D2D2D] text-[#4DF2BE] space-x-[10px]  mt-4 rounded-full">
                <Image src={Rarrowd} alt="Rd" className="ml-[10px]" />
                <p className="px-4 py-1    rounded-full font-[700] text-[14px] ml-2">
                  Receive
                </p>
                <Image
                  src={Barrow}
                  alt="arrow"
                  sizes="20px"
                  className="mr-[20px]"
                />
              </div>
              <div className="flex w-[122px] h-[40px]  items-center bg-[#2D2D2D] text-[#4DF2BE] space-x-[10px] mt-4 rounded-full">
                <Image src={Swap} alt="swap" className="ml-[10px]" />
                <p className="px-4 py-1 ml-[5px]   rounded-full font-[700] text-[14px] ml-2">
                  Swap
                </p>
                <Image
                  src={Barrow}
                  alt="arrow"
                  sizes="20px"
                  className="ml-[5px]"
                />
              </div>
            </div>
          </div>
          {/*right_side */}
          <div
            className="flex flex-col justify-between  mt-[30px] w-[498px] h-[188px] ml-[15px] bg-[#222222] rounded-[12px]"
            style={{ padding: "24px 20px" }}
          >
            <div>
              <p className="text-[16px] font-[400] text-[#DBDBDB]">
                Daily Limit
              </p>
              <p className="text-[18px] font-[500] text-[#FCFCFC]">$14850000</p>

              <div className="w-[458px] h-[8px] bg-[#4A4A4A]  rounded-[4px]">
                <div className="w-[8px] h-[8px] bg-[#4DF2BE] rounded-full"></div>

                <div className="flex space-x-[43%] text-[14px]  font-[400] text-[#DBDBDB]">
                  <p>$14850000 remaining</p>
                  <p>Refreshes in 10minutes</p>
                </div>

                <div className="w-[122px] h-[36px] ml-[73%] text-[14px] font-[700] bg-[#2D2D2D]  text-[#FCFCFC] px-4 py-2 rounded-full mt-[10px]">
                  <p className="" style={{ padding: "8px 14px" }}>
                    Increase Limit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* left_side */}
        <div>
          <div className="flex items-center justify-between mt-[50px] w-[1224px] h-[64px]  rounded-[12px]">
            <p className="text-[16px] font-[500] text-[#8F8F8F]">My Assets</p>
            <div className="flex items-center  space-x-[10px]">
              <p className="text-[14px] font-[700] ml-[20px] text-[#FCFCFC]">
                See all
              </p>{" "}
              <Image src={R_arrow} alt="rarrow" />
            </div>
          </div>

          <div className="flex ml-[100px] space-x-[21%] text-[#8F8F8F] text-[14px] font-[400]">
            <p>Currency</p>
            <p className="ml-[-100px]">Balance</p>
            <p className="ml-[10px]">In USD</p>
          </div>

          <div className="w-[1224px] h-[64px] space-x-[-40px] ">
            <div
              className="flex bg-[#222222] rounded-[12px]"
              style={{ padding: "12px 20px" }}
            >
              <Image
                src={BTC}
                alt="bitcoin"
                className="w-[39.995px] h-[40px] mt-[15px] ml-[16px]"
              />
              <div className=" ml-[20px] gap-[-10px]">
                <p className="text-[16px] font-[700] text-[#FCFCFC]">Bitcoin</p>
                <p className="flex items-center mt-[-15px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                  1 USD
                  <span className="ml-[2px]">=</span>
                  <span className="ml-[2px]">0.0000098 BTC</span>
                </p>
              </div>
              <div className="flex ml-[65px] mt-[15px] space-x-[270%] ">
                <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                  0{" "}
                  <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                    BTC
                  </span>
                </p>
                <p className="text-[12px] font-[500] ml-[23px] text-[#DBDBDB] ">
                  $
                  <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                    0.00
                  </span>
                </p>
              </div>

              <div className="flex ml-[33%] space-x-[10px]">
                <div
                  className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Send}
                    alt="send"
                    className=" w-[16px] ml-[15px] h-[16px]"
                  />
                  <p className="text-[#DBDBDB] text-[14px] font-[500]">Send</p>
                </div>

                <div
                  className="flex space-x-[5px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Rarrowd}
                    alt="arrow"
                    className="w-[16px] h-[16px] ml-[15px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">
                    Receive
                  </p>
                </div>

                <div
                  className="flex space-x-[5px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Swap}
                    alt="swap"
                    className="w-[16px] h-[16px] ml-[15px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">Swap</p>
                </div>
                <div className="flex items-center justify-center w-[44px] h-[36px] bg-[#2D2D2D] mt-[20px] ml-[15px] rounded-full">
                  <Image
                    src={Points}
                    alt="point"
                    className="w-[13px] h-[13px] text-[#FFFFFF]"
                  />
                </div>
              </div>
            </div>
            <div
              className="flex bg-[#222222] mt-[10px] rounded-[12px]"
              style={{ padding: "12px 20px" }}
            >
              <Image
                src={ETH}
                alt="eth"
                className="w-[39.995px] h-[40px] mt-[15px] ml-[16px]"
              />
              <div className=" ml-[20px] gap-[-10px]">
                <p className="text-[16px] font-[700] text-[#FCFCFC]">
                  Ethereum
                </p>
                <p className="flex items-center mt-[-15px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                  1 USD
                  <span className="ml-[2px]">=</span>
                  <span className="ml-[2px]">0.0000098 BTC</span>
                </p>{" "}
              </div>
              <div className="flex ml-[65px] mt-[15px] space-x-[270%] ">
                <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                  0{" "}
                  <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                    ETH
                  </span>
                </p>
                <p className="text-[12px] font-[500] ml-[23px] text-[#DBDBDB] ">
                  $
                  <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                    0.00
                  </span>
                </p>
              </div>

              <div className="flex ml-[33%] space-x-[10px]">
                <div
                  className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Send}
                    alt="send"
                    className=" w-[16px] ml-[15px] h-[16px]"
                  />
                  <p className="text-[#DBDBDB] text-[14px] font-[500]">Send</p>
                </div>

                <div
                  className="flex space-x-[5px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Rarrowd}
                    alt="arrow"
                    className="w-[16px] h-[16px] ml-[15px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">
                    Receive
                  </p>
                </div>

                <div
                  className="flex space-x-[5px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Swap}
                    alt="swap"
                    className="w-[16px] h-[16px] ml-[15px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">Swap</p>
                </div>
                 <div className="flex items-center justify-center w-[44px] h-[36px] bg-[#2D2D2D] mt-[20px] ml-[15px] rounded-full">
                  <Image
                    src={Points}
                    alt="point"
                    className="w-[13px] h-[13px] text-[#FFFFFF]"
                  />
                </div>
              </div>
            </div>
            <div
              className="flex bg-[#222222] mt-[10px] rounded-[12px]"
              style={{ padding: "12px 20px" }}
            >
              <Image
                src={USDC}
                alt="usdc"
                className="w-[39.995px] h-[40px] mt-[15px] ml-[16px]"
              />
              <div className=" ml-[20px] gap-[-10px]">
                <p className="text-[16px] font-[700] text-[#FCFCFC]">USDC</p>
                <p className="flex items-center mt-[-15px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                  1 USD
                  <span className="ml-[2px]">=</span>
                  <span className="ml-[2px]">0.0000098 BTC</span>
                </p>
              </div>
              <div className="flex ml-[60px] mt-[15px] space-x-[270%] ">
                <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                  0{" "}
                  <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                    USDC
                  </span>
                </p>
                <p className="text-[12px] font-[500] ml-[16px] text-[#DBDBDB] ">
                  $
                  <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                    0.00
                  </span>
                </p>
              </div>

              <div className="flex ml-[33%] space-x-[10px]">
                <div
                  className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Send}
                    alt="send"
                    className=" w-[16px] ml-[15px] h-[16px]"
                  />
                  <p className="text-[#DBDBDB] text-[14px] font-[500]">Send</p>
                </div>

                <div
                  className="flex space-x-[5px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Rarrowd}
                    alt="arrow"
                    className="w-[16px] h-[16px] ml-[15px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">
                    Receive
                  </p>
                </div>

                <div
                  className="flex space-x-[5px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Swap}
                    alt="swap"
                    className="w-[16px] h-[16px] ml-[15px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">Swap</p>
                </div>
                 <div className="flex items-center justify-center w-[44px] h-[36px] bg-[#2D2D2D] mt-[20px] ml-[15px] rounded-full">
                  <Image
                    src={Points}
                    alt="point"
                    className="w-[13px] h-[13px] text-[#FFFFFF]"
                  />
                </div>
              </div>
            </div>
            <div
              className="flex w-[1224px] mt-[10px] bg-[#222222] rounded-[12px]"
              style={{ padding: "12px 20px" }}
            >
              <Image
                src={USDT}
                alt="bitcoin"
                className="w-[39.995px] h-[40px] mt-[15px] ml-[16px]"
              />
              <div className=" ml-[20px] gap-[-10px]">
                <p className="text-[16px] font-[700] text-[#FCFCFC]">USDT</p>
                <p className="flex items-center mt-[-15px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                  1 USD
                  <span className="ml-[2px]">=</span>
                  <span className="ml-[2px]">0.0000098 BTC</span>
                </p>
              </div>
              <div className="flex ml-[60px] mt-[15px] space-x-[270%] ">
                <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                  0{" "}
                  <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                    USDT
                  </span>
                </p>
                <p className="text-[12px] font-[500] ml-[17px] text-[#DBDBDB] ">
                  $
                  <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                    0.00
                  </span>
                </p>
              </div>

              <div className="flex ml-[33%] space-x-[10px]">
                <div
                  className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Send}
                    alt="send"
                    className=" w-[16px] ml-[15px] h-[16px]"
                  />
                  <p className="text-[#DBDBDB] text-[14px] font-[500]">Send</p>
                </div>

                <div
                  className="flex space-x-[5px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Rarrowd}
                    alt="arrow"
                    className="w-[16px] h-[16px] ml-[15px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">
                    Receive
                  </p>
                </div>

                <div
                  className="flex space-x-[5px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Swap}
                    alt="swap"
                    className="w-[16px] h-[16px] ml-[15px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">Swap</p>
                </div>
                 <div className="flex items-center justify-center w-[44px] h-[36px] bg-[#2D2D2D] mt-[20px] ml-[15px] rounded-full">
                  <Image
                    src={Points}
                    alt="point"
                    className="w-[13px] h-[13px] text-[#FFFFFF]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-[1224px] h-[338px]">
            <div className="flex items-center justify-between mt-[30%] w-[1184px] h-[36px] rounded-[12px]">
              <p className="text-[16px] font-[500] text-[#8F8F8F]">
                Transactions
              </p>
              <div className="flex-1 flex flex-col items-center  mt-[30%] justify-center">
                <Image src={G19} alt="group19" />
                <p className="text-[14px] font-[400] text-[#8F8F8F] mt-2">
                  Your 10 most recent transactions will appear here
                </p>
              </div>
              <div className="flex items-center space-x-[10px]">
                <p className="text-[14px] font-[700] text-[#FCFCFC]">See all</p>
                <Image src={R_arrow} alt="rarrow" />
              </div>
            </div>
            <div className="w-[117.2%] ml-[-10%] h-[1px] bg-[#fff] mt-[40%] opacity-20 my-8"></div>
          </div>
        </div>
        <div className=" mb-[80px] mt-[40%] ">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Wallet;
