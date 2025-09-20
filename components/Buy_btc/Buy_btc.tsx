"use client";

import { useState } from "react";
import Nav from "../../components/NAV/Nav";
import Image from "next/image";
import Vector from "../../public/Assets/Evolve2p_vector/vector.svg";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import Less_than from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import Divider from "../../public/Assets/Evolve2p_divider/Divider.svg";
import Thumbs from "../../public/Assets/Evolve2p_thumbs/elements.svg";
import Timer from "../../public/Assets/Evolve2p_timer/elements.svg";
import Dminus from "../../public/Assets/Evolve2p_Dminus/Divider.svg";
import Verified from "../../public/Assets/Evolve2p_verified/Makretplace/elements.svg";
import UPa from "../../public/Assets/Evolve2p_upA/Makretplace/elements.svg";
import CircY from "../../public/Assets/Evolve2p_circY/Makretplace/elements.svg";
import Dols from "../../public/Assets/Evolve2p_Dols/Makretplace/elements.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import Arrow_great from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";

const BuyBTC = () => {
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSellerOpen, setIsSellerOpen] = useState(false);

  const toggleSeller = () => setIsSellerOpen((prev) => !prev);

  const tabs = [
    { key: "offers", label: "Active offers" },
    { key: "feedbacks", label: "Feedbacks" },
  ];

  const [activeTab, setActiveTab] = useState("offers");

  // Handle USD input → calculate BTC
  const handlePayChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPay(value);

    const usd = parseFloat(value);
    if (!isNaN(usd)) {
      setReceive((usd / BTC_PRICE).toFixed(8)); // 8 decimal places
    } else {
      setReceive("");
    }
  };

  // Handle BTC input → calculate USD
  const handleReceiveChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setReceive(value);

    const btc = parseFloat(value);
    if (!isNaN(btc)) {
      setPay((btc * BTC_PRICE).toFixed(2)); // 2 decimal places
    } else {
      setPay("");
    }
  };

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex items-center ml-[15px] gap-[10px] text-[16px] font-[500] text-[#FFFFFF]">
          <Image src={Less_than} alt="lessthan" />
          <p> Buy BTC</p>
        </div>
        {/* general_div */}
        <div className="flex gap-[25px] mt-[20px] ml-[100px]">
          {/* left_div */}
          <div className="flex flex-col">
            {/* first container left */}
            <div
              className="w-[498px] h-[219px] bg-[#222222] rounded-[12px]"
              style={{ padding: "12px 16px" }}
            >
              <div
                className="flex items-center  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                style={{ padding: "3px 2px" }}
              >
                <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">
                  CB
                </p>
                <Image src={Vector} alt="vector" className="mt-[20px]" />
                <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">
                  CryptoBoss
                </p>

                <Image
                  src={Mark_green}
                  alt="mark"
                  className="ml-[10px] w-[12.541px] h-[12.541px]"
                />
                <p>
                  <Image
                    onClick={() => setIsSellerOpen(true)}
                    src={Arrow_great}
                    alt="greater"
                    className="ml-[10px] w-[12.541px] h-[12.541px]"
                  />
                </p>

                <div
                  className={`
    fixed inset-0 z-50 top-[200px]   flex justify-end
    transition-opacity  duration-300
    ${
      isSellerOpen
        ? "opacity-100 pointer-events-auto  bg-black/70"
        : "opacity-0 pointer-events-none bg-black/0"
    }
  `}
                >
                  <div
                    className={`fixed top-[150px] left-[700px]  h-full w-[560px] bg-[#0F1012] rounded-[12px] text-white shadow-lg z-50 transform transition-transform duration-500 ${
                      isSellerOpen ? "translate-x-0" : "translate-x-full"
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center  justify-between  p-[20px_32px_16px_32px]">
                      <p className="text-[16px] text-[#FFFFFF] font-[700]">
                        Seller details
                      </p>
                      <Image
                        src={Times}
                        alt="Close"
                        width={32}
                        height={32}
                        className="cursor-pointer"
                        onClick={toggleSeller}
                      />
                    </div>

                    {/* Content */}
                    <div className="bg-[#1A1A1A]   p-[20px_32px_16px_32px]   max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#DBDBDB] scrollbar-track-[#2D2D2D] p-6 space-y-6">
                      {/* Header Profile Section */}
                      <div className="flex items-center justify-between">
                        <div
                          className="flex items-center  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                          style={{ padding: "3px 2px" }}
                        >
                          <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">
                            CB
                          </p>
                          <Image
                            src={Vector}
                            alt="vector"
                            className="mt-[20px]"
                          />
                          <div className="flex flex-col items-center justify-center">
                            <p className="text-[14px] mt-[20px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">
                              CryptoBoss
                            </p>
                            <p className="text-[14px] mt-[-15px] ml-[-15px] font-[500] text-[#C7C7C7]">
                              Online{" "}
                            </p>
                          </div>

                          <Image
                            src={Mark_green}
                            alt="mark"
                            className="ml-[10px] w-[12.541px] h-[12.541px]"
                          />
                        </div>
                        <button className="w-[76px] h-[40px] rounded-full p-[10px_16px_10px_16px] border-[1px] border-[#2D2D2D] text-[#4DF2BE] text-[14px] font-[700] bg-[#2D2D2D] text-[14px] font-[600]">
                          Follow
                        </button>
                      </div>

                      {/* Badges */}
                      <div className="flex w-[496px] h-[24px] mt-[20px] gap-[20px] flex-wrap">
                        {["Email", "SMS", "ID Verification", "Address"].map(
                          (item, i) => (
                            <span
                              key={i}
                              className="  text-[14px] font-[500] text-[#DBDBDB] rounded-full"
                            >
                              <Image
                                src={Verified}
                                alt="ver"
                                className="mr-[5px]"
                              />
                              {item}
                            </span>
                          )
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between  gap-[20px] mt-[20px]  text-[13px]">
                        <div className="flex flex-col w-[160px] h-[60px] bg-[#2D2D2D] p-[8px_12px_8px_12px]  items-center rounded-[8px]">
                          <p className="text-[16px] font-[500] text-[#FFFFFF]">
                            1,542
                          </p>
                          <p className="text-[14px] font-[500] text-[#C7C7C7] mt-[-10px]">
                            Trades Completed
                          </p>
                        </div>
                        <div className="flex flex-col w-[160px] h-[60px] bg-[#2D2D2D] p-[8px_12px_8px_12px]  items-center rounded-[8px]">
                          <p className="text-[16px] font-[500] text-[#FFFFFF]">
                            100%{" "}
                          </p>
                          <p className="text-[14px] font-[500] text-[#C7C7C7] mt-[-10px]">
                            Completion Rate
                          </p>
                        </div>
                        <div className="flex flex-col w-[160px] h-[60px] bg-[#2D2D2D] p-[8px_12px_8px_12px]  items-center rounded-[8px]">
                          <p className="text-[16px] font-[500] text-[#FFFFFF]">
                            2 min{" "}
                          </p>
                          <p className="text-[14px] font-[500] text-[#C7C7C7] mt-[-10px]">
                            Avg. Release Time
                          </p>
                        </div>
                      </div>

                      <div className="w-[480px] h-[1px] mt-[20px] bg-[#2D2D2D]"></div>

                      {/* Trade Info */}
                      <div className=" mt-[10px] p-4 rounded-lg space-y-2">
                        <p className="font-[700] text-[16px] text-[#C7C7C7]">
                          Trade Info
                        </p>
                        <div className=" flex flex-col gap-[5px] w-[490px] ">
                          <div className="flex items-center  h-[36px] bg-[#2D2D2D] justify-between rounded-t-[12px] p-[8px_12px_8px_12px]">
                            <p className="text-[14px] font-[500] text-[#DBDBDB]">
                              Total Trades
                            </p>
                            <p className="text-[14px] font-[500] text-[#FFFFFF]">
                              3484
                            </p>
                          </div>
                          <div className="flex items-center  h-[36px] bg-[#2D2D2D] justify-between  p-[8px_12px_8px_12px]">
                            <div className="flex items-center gap-[10px]">
                              <Image
                                src={BTC}
                                alt="btc"
                                className="w-[23.997px] h-[24px]"
                              />
                              <p className="text-[14px] font-[500] text-[#DBDBDB]">
                                Trade volume
                              </p>
                            </div>
                            <p className="text-[14px] font-[500] text-[#FFFFFF]">
                              10 BTC
                            </p>
                          </div>

                          <div className="flex items-center  h-[36px] bg-[#2D2D2D] justify-between  p-[8px_12px_8px_12px]">
                            <div className="flex items-center gap-[10px]">
                              <Image
                                src={ETH}
                                alt="eth"
                                className="w-[23.997px] h-[24px]"
                              />
                              <p className="text-[14px] font-[500] text-[#DBDBDB]">
                                Trade volume
                              </p>
                            </div>
                            <p className="text-[14px] font-[500] text-[#FFFFFF]">
                              0 ETH
                            </p>
                          </div>

                          <div className="flex items-center  h-[36px] bg-[#2D2D2D] justify-between  p-[8px_12px_8px_12px]">
                            <div className="flex items-center gap-[10px]">
                              <Image
                                src={USDT}
                                alt="usdt"
                                className="w-[23.997px] h-[24px]"
                              />
                              <p className="text-[14px] font-[500] text-[#DBDBDB]">
                                Trade volume
                              </p>
                            </div>
                            <p className="text-[14px] font-[500] text-[#FFFFFF]">
                              0 USDT
                            </p>
                          </div>

                          <div className="flex items-center  h-[36px] bg-[#2D2D2D] justify-between  p-[8px_12px_8px_12px]">
                            <div className="flex items-center gap-[10px]">
                              <Image
                                src={USDC}
                                alt="usdc"
                                className="w-[23.997px] h-[24px]"
                              />
                              <p className="text-[14px] font-[500] text-[#DBDBDB]">
                                Trade volume{" "}
                              </p>
                            </div>
                            <p className="text-[14px] font-[500] text-[#FFFFFF]">
                              0 USDC
                            </p>
                          </div>

                          <div className="flex items-center  h-[36px] bg-[#2D2D2D] justify-between rounded-b-[12px]  p-[8px_12px_8px_12px]">
                            <p className="text-[14px] font-[500] text-[#DBDBDB]">
                              Time limit{" "}
                            </p>
                            <p className="text-[14px] font-[500] text-[#FFFFFF]">
                              30 min
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="w-[480px] h-[1px] mt-[20px] bg-[#2D2D2D]"></div>

                      {/* Payment Methods */}
                      <div>
                        <p className="font-[500] text-[14px] text-[#C7C7C7]  mb-2">
                          Payment Methods
                        </p>
                        <div className="flex  flex-wrap text-[14px] font-[500] p-[2px_10px] text-[#DBDBDB] gap-[10px]">
                          {[
                            "Bank Transfer",
                            "PayPal",
                            "Skrill",
                            "Mobile Money",
                            "Gift Cards",
                          ].map((method, i) => (
                            <span
                              key={i}
                              className={`flex items-center gap-[10px] justify-center  bg-[#3A3A3A]  rounded-[16px] text-[12px]
                      ${
                        method === "Bank Transfer"
                          ? "w-[126px] h-[24px]"
                          : method === "PayPal"
                          ? "w-[80px] h-[24px]"
                          : method === "Skrill"
                          ? "w-[70px] h-[24px]"
                          : method === "Mobile Money"
                          ? "w-[127px] h-[24px]"
                          : method === "Gift Cards"
                          ? "w-[104px] h-[24px]"
                          : "w-[120px] h-[34px]"
                      }

                   `}
                            >
                              <Image src={Verified} alt="ver" />
                              {method}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="w-[480px] h-[1px] mt-[20px] bg-[#2D2D2D]"></div>

                      {/* Info */}

                      <p className="font-[700] text-[#C7C7C7] text-[16px]">
                        Info
                      </p>
                      <div className=" w-[496px] p-4 space-y-[5px]">
                        <div className="flex items-center justify-between bg-[#2D2D2D]  rounded-[8px]  h-[36px] p-[8px_12px] ">
                          <p className="text-[14px] text-[#DBDBDB] font-[500]">
                            Joined
                          </p>
                          <p className="text-[14px] text-[#FFFFFF] font-[500]">
                            Feb 27, 2025
                          </p>
                        </div>
                        <div className="flex items-center justify-between bg-[#2D2D2D]  rounded-[8px]  h-[36px] p-[8px_12px] ">
                          <p className="text-[14px] text-[#DBDBDB] font-[500]">
                            Location
                          </p>
                          <p className="text-[14px] text-[#FFFFFF] font-[500]">
                            Nigeria
                          </p>
                        </div>
                      </div>

                      <div className="w-[480px] h-[1px] mt-[20px] bg-[#2D2D2D]"></div>

                      {/* Feedback */}
                      <div className="w-[496px]   mt-[10px]">
                        <div className="flex flex-col bg-[#2D2D2D] p-[12px] rounded-[8px]">
                          {/* Title */}
                          <p className="font-[500] text-[14px] text-[#DBDBDB] mb-2">
                            Feedback Score
                          </p>

                          {/* Score & Stats */}
                          <div className="flex items-center justify-between">
                            {/* Main score */}
                            <p className="text-[28px] font-[700] text-[#4DF2BE]">
                              99.87%{" "}
                              <span className="text-[14px] font-[500] text-[#4DAAF2]">
                                (3788)
                              </span>
                            </p>

                            {/* Stats */}
                            <div className="flex text-[14px] font-[500] gap-[15px]">
                              <p className=" text-[#C7C7C7]">Positive</p>
                              <p className="text-[#1ECB84]">3784</p>
                              <p className="text-[#FE857D]">3784</p>
                              <p className="text-[#C7C7C7]">Negative</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="w-[480px] h-[1px] mt-[20px] bg-[#2D2D2D]"></div>
                      {/* Tabs */}
                      <div className="flex bg-[#2D2D2D] rounded-[56px] mt-[20px] mb-[30px]  w-[244px] h-[48px] p-[4px] items-center justify-between">
                        {tabs.map((tab) => {
                          const isActive = activeTab === tab.key;

                          return (
                            <div
                              key={tab.key}
                              onClick={() => setActiveTab(tab.key)}
                              className={`flex items-center justify-center rounded-[56px] text-[16px] transition no-underline
              ${
                isActive
                  ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500]"
                  : "bg-transparent text-[#DBDBDB] font-[400]"
              } w-[110px] h-[40px]`}
                              style={{
                                minWidth: "90px",
                                minHeight: "40px",
                                cursor: "pointer",
                              }}
                            >
                              {tab.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* second line in first container */}
              <div className="flex items-center text-[#C7C7C7]  text-[14px] font-[500] gap-[5px]">
                <p>100 orders</p>
                <Image
                  src={Divider}
                  alt="divider"
                  className="w-[1px]  h-[12px]"
                />
                <p>100.00% completion</p>
                <Image
                  src={Divider}
                  alt="divider"
                  className="w-[1px]  h-[12px]"
                />
                <Image
                  src={Thumbs}
                  alt="thunbs"
                  className="w-[12px] h-[12px]"
                />
                <p>99.99</p>
                <Image src={Divider} alt="divider" />
                <Image src={Timer} alt="timer" />
                <p>15 min</p>
              </div>
              <div className="text-[14px] font-[700] text-[#DBDBDB]  space-x-[20px]">
                1 USD = 0.0000098 BTC
              </div>

              <div className="flex gap-[5px] mt-[-5px] text-[14px] font-[500] text-[#C7C7C7]">
                <p>Available:</p>

                <p>
                  50,000 <span>BTC</span>
                </p>
              </div>

              <div className="flex items-center mt-[-20px] text-[#C7C7C7] text-[14px] font-[500]  gap-[5px]">
                <p> Order limit:</p>

                <p>
                  200.00 <span>BTC</span>
                </p>
                <Image src={Dminus} alt="minus" />
                <p>
                  200.00 <span>BTC</span>
                </p>
              </div>

              <div className="flex items-center gap-[10px]">
                <div
                  className="flex items-center gap-[15px] bg-[#3A3A3A] w-[124px] h-[24px] rounded-[16px]"
                  style={{ padding: "2px 10px" }}
                >
                  <Image src={Verified} alt="ver" />
                  <p className="text-[#DBDBDB] text-[14px] font-[500]">
                    {" "}
                    Email Verified
                  </p>
                </div>

                <div
                  className="flex items-center gap-[15px] bg-[#3A3A3A] w-[124px] h-[24px] rounded-[16px]"
                  style={{ padding: "2px 10px" }}
                >
                  <Image src={Verified} alt="ver" />
                  <p className="text-[#DBDBDB] text-[14px] font-[500]">
                    {" "}
                    Phone Verified
                  </p>
                </div>

                <div
                  className="flex items-center gap-[15px] bg-[#3A3A3A] w-[103px] h-[24px] rounded-[16px]"
                  style={{ padding: "2px 10px" }}
                >
                  <Image src={Verified} alt="ver" />
                  <p className="text-[#DBDBDB] text-[14px] font-[500]">
                    {" "}
                    ID Verified
                  </p>
                </div>
              </div>

              <div className="text-[14px] font-[500] mt-[15px] text-[#C7C7C7]">
                Feedbacks(21)
              </div>
            </div>

            <div
              className=" bg-[#2D2D2D] mt-[20px] rounded-[12px]"
              style={{ padding: "12px 16px" }}
            >
              <div>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setIsTermsOpen(!isTermsOpen)}
                >
                  <p className="text-[14px] font-[700] text-[#FFFFFF]">
                    {" "}
                    Offer Terms (please read carefully){" "}
                  </p>
                  <Image
                    src={UPa}
                    alt="up"
                    className={`transition-transform duration-300 ${
                      isTermsOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>

                {isTermsOpen && (
                  <ul className="text-[#DBDBDB] text-[14px] space-y-[5px] font-[500]">
                    <li>Only first-party payments.</li>
                    <li>Bank-to-bank transfers only</li>
                    <li>May request extra KYC</li>
                  </ul>
                )}
              </div>
            </div>
          </div>
          {/* right_div */}

          <div className="flex flex-col gap-[8px]">
            {/*each container of div */}
            <div>
              {/* first container */}
              <div
                className="w-[498px] h-[68px] bg-[#222222] rounded-[8px] "
                style={{ padding: "12px 16px" }}
              >
                <div className="flex items-center gap-[20px]">
                  <Image src={CircY} alt="circ" />
                  <div className="flex flex-col">
                    <p className="text-[16px] font-[500]  text-[#DBDBDB]">
                      1 BTC <span className="ml-[10px]">= </span>{" "}
                      <span className="ml-[10px]"> $48,000 </span>
                    </p>
                    <p className="text-[14px] mt-[-10px] font-[500]  text-[#C7C7C7]">
                      {" "}
                      Processing fee <span className="ml-[10px]">= </span>{" "}
                      <span className="text-[#DBDBDB] ml-[10px]">
                        {" "}
                        0.0005 BTC{" "}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* second_container */}
            <div
              className="w-[498px] h-[135px] bg-[#222222] rounded-[12px]"
              style={{ padding: "12px 16px" }}
            >
              <div>
                <div className="text-[#C7C7C7] text-[14px] font-[500]">
                  You pay
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[5px]">
                    <p className="text-[#FFFFFF] text-[28px] font-[700] ">
                      0.00{" "}
                    </p>
                    <span className="text-[#C7C7C7] font-[400] text-[28px] mt-[4px]  w-[9px] h-[38px]">
                      |
                    </span>{" "}
                  </div>

                  <div className="flex items-center bg-[#2D2D2D] gap-[10px] w-[78px] h-[32px] rounded-full">
                    <Image src={Dols} alt="dols" />
                    <p className="text-[#DBDBDB] text-[14px] font-[700]">
                      {" "}
                      USD{" "}
                    </p>
                  </div>
                </div>
                <div className="text-[14px] font-[500] text-[#C7C7C7]">
                  1 USD ={" "}
                  <span className="text-[#DBDBDB]">0.0.0000123 BTC </span>
                </div>
              </div>
            </div>
            <div
              className="w-[498px] h-[103px] bg-[#222222] rounded-[12px]"
              style={{ padding: "12px 16px" }}
            >
              <div>
                <div className="text-[#C7C7C7] text-[14px] font-[500]">
                  You pay
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-[5px]">
                    <p className="text-[#FFFFFF] text-[28px] font-[700] ">
                      0.00{" "}
                    </p>
                    <span className="text-[#C7C7C7] font-[400] text-[28px] mt-[4px]  w-[9px] h-[38px]">
                      |
                    </span>{" "}
                  </div>

                  <div className="flex items-center bg-[#2D2D2D] gap-[10px] w-[78px] h-[32px] rounded-full">
                    <Image
                      src={BTC}
                      alt="dols"
                      className="w-[23.997px] h-[24px]"
                    />
                    <p className="text-[#DBDBDB] text-[14px] font-[700]">
                      {" "}
                      USD{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[5px]">
              <div className=" flex items-center justify-between w-[498px] h-[40px] bg-[#2D2D2D] p-[8px_16px] rounded-t-[12px]">
                <p className="text-[16px] font-[400] text-[#DBDBDB]">Limit</p>
                <p className="text-[16px] font-[500] text-[#FFFFFF]">
                  {" "}
                  $10 - $148500{" "}
                </p>
              </div>

              <div className=" flex items-center justify-between w-[498px] h-[40px] bg-[#2D2D2D] p-[8px_16px] border-l-2 border-l-[#FFFA66]">
                <p className="text-[16px] font-[400] text-[#DBDBDB]">Payment</p>
                <p className="text-[16px] font-[500] text-[#FFFFFF]">
                  {" "}
                  Bank Transfers{" "}
                </p>
              </div>

              <div className=" flex items-center justify-between w-[498px] h-[40px] bg-[#2D2D2D] p-[8px_16px] rounded-b-[12px]">
                <p className="text-[16px] font-[400] text-[#DBDBDB]">
                  Time limit
                </p>
                <p className="text-[16px] font-[500] text-[#FFFFFF]">
                  {" "}
                  30 min{" "}
                </p>
              </div>
            </div>
            <div className=" items-center justfy-center mt-[20px] ml-[40px]">
              <button className=" flex items-center justify-center w-[458px] h-[48px]  border-2 border-[#4DF2BE] rounded-full bg-[#4DF2BE]">
                Buy BTC
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default BuyBTC;
                                                                                                                                                                                                