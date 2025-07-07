"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLogin } from "@/context/LoginContext";
import Image from "next/image";
import Logo from "../../public/Assets/Evolve2p_logods/Dashboard/Logo.svg";
import Bell from "../../public/Assets/Evolve2p_bell/elements.svg";
import Profile from "../../public/Assets/Evolve2p_profile/Dashboard/elements.svg";
import Parrow from "../../public/Assets/Evolve2p_pArrow/elements.svg";
import icon_i from "../../public/Assets/Evolve2p_i/Dashboard/elements.svg";
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
import Eclipse from "../../public/Assets/Evolve2p_eclpise9/Ellipse 9.svg";
import Buy from "../../public/Assets/Evolve2p_Buy/elements.svg";
import Larrow from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Sell from "../../public/Assets/Evolve2p_Sell/elements.svg";
import Offer from "../../public/Assets/Evolve2p_Offer/elements.svg";
import Limit from "../../public/Assets/Evolve2p_Limit/elements.svg";
import Set from "../../public/Assets/Evolve2p_Set/elements.svg";
import Refer from "../../public/Assets/Evolve2p_Refer/elements.svg";
import G19 from "../../public/Assets/Evolve2p_group19/Group 19.svg";
const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const { user } = useLogin();

  // Debug: log user and username
  console.log("Dashboard user:", user);
  console.log("Dashboard username:", user?.username);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;
        const userData =
          typeof window !== "undefined" ? localStorage.getItem("user") : null;

        if (!token || !userData) {
          setError("Please login first");
          setTimeout(() => router.push("/Logins/login"), 1500);
          return;
        }

        setTimeout(() => setLoading(false), 1000);
      } catch (e) {
        console.error("Error accessing localStorage:", e);
        setError("Unable to access authentication data. Please try again.");
        setTimeout(() => router.push("/Logins/login"), 2000);
      }
    };

    checkAuth();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1012] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-[#F5918A]">
            Authentication Error
          </h1>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => router.push("/Logins/login")}
            className="bg-[#4DF2BE] text-[#0F1012] px-6 py-2 rounded-full"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <nav className="flex">
          <div className=" mt-[8px] ">
            <Image src={Logo} alt="logo" />
          </div>
          <ul className="flex space-x-[40px] text-[#FFFFFF] list-none mb-[25px]">
            <li>Dashboard</li>
            <li>Wallet</li>
            <li>Marketplace</li>
            <li>Trade history</li>
            <li>Support</li>
          </ul>
          <div className="flex items-center space-x-[10px] ml-auto mr-[20px]">
            <div
              className="w-[30px] h-[25px] justify-center flex items-center bg-transparent mt-[10px] mr-[20px] mb-[10px] relative border rounded-full"
              style={{ borderColor: "#2D2D2D", borderWidth: "1px" }}
            >
              <Image src={Bell} alt="bell" />
              <span className="absolute text-[white] text-[10px] -top-[1.5px] -right-[-1.5px] w-[10px] h-[12px] bg-[red] font-[500] rounded-full text-xs flex items-center justify-center text-white">
                0
              </span>
            </div>
            <div
              className="flex w-[40px] h-[25px] items-center bg-transparent mt-[10px]  pr-[5px] space-x-[15px] mr-[20px]  mb-[15px] border rounded-full"
              style={{ borderColor: "#2D2D2D", borderWidth: "1px" }}
            >
              <Image src={Profile} alt="itsprofile" />
              <Image src={Parrow} alt="itsprofile" />
            </div>
          </div>
        </nav>

        {/* Header */}
        <div className="flex space-x-[5px]  text-[24px] font-[500] items-center mb-6">
          <p className="text-[#8F8F8F]">Hello,</p>
          <p className="text-[#FCFCFC]">
            {user?.username
              ? user.username.startsWith("@")
                ? user.username
                : `@${user.username}`
              : "User"}
          </p>
        </div>

        <div
          className="flex pl-[15px] bg-[#342827] h-[68px] w-[1224px]  items-center gap-2 mb-6 "
          style={{
            borderLeft: "2px solid var(--Text---text-danger, #FE857D)",
            borderRadius: "0px 12px 12px 0px",
          }}
        >
          <Image src={icon_i} alt="i" sizes="24px" />
          <p className="text-[14px] ml-[20px] font-[500px] text-[#FCFCFC]">
            Complete KYC and enjoy access to all features available on the app.
          </p>
          <button className="text-[14px] w-[127px] h-[33px]  text-center ml-[25px] text-[#4DF2BE] font-[700] bg-[#2D2D2D] border border-[#222] rounded-full">
            Complete KYC
          </button>
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

        {/* Assets & Todo */}
        <div className="flex">
          {/* left_side */}
          <div>
            <div className="flex items-center justify-between mt-[30px] w-[913px]   rounded-[12px]">
              <p className="text-[16px] font-[500] text-[#8F8F8F]">My Assets</p>
              <div className="flex items-center space-x-[10px]">
                <p className="text-[14px] font-[700] text-[#FCFCFC]">See all</p>{" "}
                <Image src={R_arrow} alt="rarrow" />
              </div>
            </div>

            <div className="flex ml-[70px] space-x-[21%] text-[#8F8F8F] text-[14px] font-[400]">
              <p>Currency</p>
              <p>Balance</p>
              <p className="ml-[-78px]">In USD</p>
            </div>

            <div className="w-[913px] h-[64px] ">
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
                  <p className="text-[16px] font-[700] text-[#FCFCFC]">
                    Bitcoin
                  </p>
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
                  <p className="text-[12px] font-[500] ml-[-23px] text-[#DBDBDB] ">
                    $
                    <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                      0.00
                    </span>
                  </p>
                </div>

                <div className="flex ml-[20%] space-x-[10px]">
                  <div
                    className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Send}
                      alt="send"
                      className=" w-[16px] ml-[15px] h-[16px]"
                    />
                    <p className="text-[#DBDBDB] text-[14px] font-[500]">
                      Send
                    </p>
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
                    <p className="text-[14px] font-[500] text-[#DBDBDB]">
                      Swap
                    </p>
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
                  <p className="text-[12px] font-[500] ml-[-23px] text-[#DBDBDB] ">
                    $
                    <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                      0.00
                    </span>
                  </p>
                </div>

                <div className="flex ml-[20%] space-x-[10px]">
                  <div
                    className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Send}
                      alt="send"
                      className=" w-[16px] ml-[15px] h-[16px]"
                    />
                    <p className="text-[#DBDBDB] text-[14px] font-[500]">
                      Send
                    </p>
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
                    <p className="text-[14px] font-[500] text-[#DBDBDB]">
                      Swap
                    </p>
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
                  <p className="text-[12px] font-[500] ml-[-30px] text-[#DBDBDB] ">
                    $
                    <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                      0.00
                    </span>
                  </p>
                </div>

                <div className="flex ml-[20%] space-x-[10px]">
                  <div
                    className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Send}
                      alt="send"
                      className=" w-[16px] ml-[15px] h-[16px]"
                    />
                    <p className="text-[#DBDBDB] text-[14px] font-[500]">
                      Send
                    </p>
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
                    <p className="text-[14px] font-[500] text-[#DBDBDB]">
                      Swap
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex mt-[10px] bg-[#222222] rounded-[12px]"
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
                  <p className="text-[12px] font-[500] ml-[-30px] text-[#DBDBDB] ">
                    $
                    <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                      0.00
                    </span>
                  </p>
                </div>

                <div className="flex ml-[20%] space-x-[10px]">
                  <div
                    className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Send}
                      alt="send"
                      className=" w-[16px] ml-[15px] h-[16px]"
                    />
                    <p className="text-[#DBDBDB] text-[14px] font-[500]">
                      Send
                    </p>
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
                    <p className="text-[14px] font-[500] text-[#DBDBDB]">
                      Swap
                    </p>
                  </div>
                </div>
                
              </div>
            </div>
           <div className="w-[913px] h-[722px]">
  <div className="flex items-center justify-between mt-[40%] w-[900px] h-[24px] rounded-[12px]">
    <p className="text-[16px] font-[500] text-[#8F8F8F]">Transactions</p>
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
</div>
</div>

          

          {/* right_side */}
          <div className="flex flex-col space-y-[10px] ml-[20px] mt-[40px] pr-[25px]">
            <p className="text-[16px] font-[500]  text-[#8F8F8F]">Todo list</p>
            <div className="flex items-center w-[291px] h-[72px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Buy}
                  alt="buy"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px]">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[-2px]">
                  Buy Crypto
                </p>
                <small className="text-[12px] text-[#DBDBDB] mt-[5px] font-[400]">
                  Start a new buy order
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[85px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
            <div className="flex items-center w-[291px] h-[72px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Sell}
                  alt="sell"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px]">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[-2px]">
                  Sell Crypto
                </p>
                <small className="text-[12px] text-[#DBDBDB] mt-[5px] font-[400]">
                  Start a new sell order
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[85px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
            <div className="flex items-center w-[291px] h-[72px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Offer}
                  alt="offer"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px]">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[-2px]">
                  Post an Offer
                </p>
                <small className="text-[12px] text-[#DBDBDB] mt-[5px] font-[400]">
                  Create your P2P offer
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[85px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
            <div className="flex items-center w-[291px] h-[80px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Limit}
                  alt="limit"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px] ">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[5px] whitespace-nowrap ">
                  Increase Buy/Sell Limits
                </p>
                <small
                  className="text-[12px] text-[#DBDBDB] font-[400] leading-tight"
                  style={{
                    maxWidth: "180px",
                    display: "block",
                    wordBreak: "break-word",
                  }}
                >
                  Unlock higher trading limits by
                  upgrading verification.
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[10px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
            <div className="flex items-center w-[291px] h-[80px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Set}
                  alt="set"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px] ">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[5px] whitespace-nowrap ">
                 Set Up 2FA
                </p>
                <small
                  className="text-[12px] text-[#DBDBDB] font-[400] leading-tight"
                  style={{
                    maxWidth: "180px",
                    display: "block",
                    wordBreak: "break-word",
                  }}
                >
                  Secure your account with two-factor authentication.
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[10px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
            <div className="flex items-center w-[291px] h-[80px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Refer}
                  alt="refer"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px] ">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[5px] whitespace-nowrap ">
                Refer & Earn
                </p>
                <small
                  className="text-[12px] text-[#DBDBDB] font-[400] leading-tight"
                  style={{
                    maxWidth: "180px",
                    display: "block",
                    wordBreak: "break-word",
                  }}
                >
                  Invite friends and earn rewards on every trade.
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[10px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
          </div>
          
        </div>

        
        {/* Footer */}
        <div className="mt-6 text-center text-sm mt-[50%] text-gray-400">
          <p>Your 10 most recent transactions will appear here</p>
        </div>
        <div className="mt-10 text-center text-xs text-gray-600">
          <p>Features • Help • Privacy Policy • Terms of Service</p>
          <p>© 2025 Evolve2p. All rights reserved.</p>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
