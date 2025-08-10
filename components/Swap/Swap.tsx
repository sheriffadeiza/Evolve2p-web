"use client";

import React, { useState } from "react";
import Nav from "../../components/NAV/Nav";
import TabsNav from "../TabsNav/TabsNav";
import Image from "next/image";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import Arrow from "../../public/Assets/Evolve2p_arrowd/arrow-down-01.png";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import Swapicon from "../../public/Assets/Evolve2p_swapicon/elements.svg";
import I_icon from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import Rotate from "../../public/Assets/Evolve2p_rotate/elements.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import Footer from "../../components/Footer/Footer";

const Swap: React.FC = () => {
  const [isSwapModal, setIsSwapModal] = useState(false);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [IsSecpinModal, setIsSecpinModal] = useState(false);
  const [SecDropdownOpen, setSecDropdownOpen] = useState(false);
  const [SecDropdownOpenTwo, setSecDropdownOpenTwo] = useState(false);

  const [selectedCoin, setSelectedCoin] = useState({
    name: "BTC",
    icon: BTC,
  });

  const [selectedCoinTwo, setSelectedCoinTwo] = useState({
    name: "ETH",
    icon: ETH,
  });
 

  const closeSwapModal = () => setIsSwapModal(false);
  const closeSecpinModal = () => setIsSecpinModal(false);

  const toggleSecDropdown = () => {
    setSecDropdownOpen((prev) => !prev);
  };

  const toggleSecDropdownTwo = () => {
    setSecDropdownOpenTwo((prev) => !prev);
  };

  const handlePinChange = (value: string, index: number) => {
    if (value.length > 1) return;
    const newPin = [...pin];
    newPin[index] = value;
    setPin(newPin);
  };

  const coins = [
    { name: "BTC", icon: BTC },
    { name: "ETH", icon: ETH },
    { name: "USDT", icon: USDT },
    { name: "USDC", icon: USDC },
  ];

  const coins2 = [
    { name: "BTC", icon: BTC },
    { name: "ETH", icon: ETH },
    { name: "USDT", icon: USDT },
    { name: "USDC", icon: USDC },
  ];

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex bg-[#2D2D2D] rounded-[56px] mt-8 w-[296px] h-[48px] p-1 items-center justify-between">
          <TabsNav />
        </div>

        <div className="w-[1224px] h-[463px] bg-[#1A1A1A] mt-[20px] rounded-[12px] p-[32px] ">
          {IsSecpinModal && (
            <div className="fixed inset-0 bg-black top-[100px] left-[30%] bg-opacity-50 flex items-center justify-center z-[1100]">
              <div className="bg-[#1A1A1A] rounded-[12px] w-[560px] h-[352px] p-[24px]">
                <div className="flex justify-between items-center">
                  <p className="text-[16px] font-[700] text-[#FFFFFF]">
                    Enter security PIN
                  </p>
                  <Image
                    src={Times}
                    alt={"times"}
                    width={20}
                    height={20}
                    className="absolute top-[20px] w-[32px] h-[32px] mt-[15px]  ml-[85%] cursor-pointer"
                    onClick={closeSecpinModal}
                  />{" "}
                </div>

                <p className="text-center text-[#C7C7C7] text-[16px] font-[400] mt-[50px]">
                  Your PIN helps you log in faster and approve transactions
                  securely.
                </p>

                <div className="flex justify-center space-x-[10px] mt-[50px]">
                  {pin.map((digit, index) => (
                    <input
                      key={index}
                      type="password"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinChange(e.target.value, index)}
                      className="w-[111px] h-[56px] bg-[#222222] border-none  text-center text-[28px] font-[700] text-[#FCFCFC] p-[8px] rounded-[8px] outline-none"
                    />
                  ))}
                </div>

                <p className="text-center text-[#FFFFFF] text-[14px] font-[700] mt-[50px] cursor-pointer">
                  Forgot PIN
                </p>
              </div>
            </div>
          )}
          ;
          {isSwapModal && (
            <div
              className={`fixed inset-0 bg-black bg-opacity-50 top-[30px] left-[28%] flex items-center justify-center ${
                IsSecpinModal ? "opacity-30 pointer-events-none" : "opacity-100"
              } z-[1000]`}
            >
              <div className="bg-[#1A1A1A]  rounded-[12px] w-[560px] max-h-[85vh] p-[24px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#DBDBDB] scrollbar-track-[#2D2D2D]">
                <div className="flex  items-center justify-between">
                  <p className="text-[16px] font-[700] text-[#FFFFFF]">
                    Confirm Swap
                  </p>
                  <Image
                    src={Times}
                    alt={"times"}
                    width={20}
                    height={20}
                    className="absolute top-[20px] w-[32px] h-[32px] mt-[15px]  ml-[85%] cursor-pointer"
                    onClick={closeSwapModal}
                  />
                </div>

                <p className="text-center text-[#8F8F8F] text-[16px] font-[500] mt-[30px]">
                  Review the above before confirming <br /> Once made, your
                  transaction is irreversible.
                </p>

                <div className="flex justify-center items-center   mt-[30px]">
                  <Image
                    src={BTC}
                    alt="BTC"
                    className="w-[57.594px] ml-[-55px] h-[ 57.6px]"
                  />
                  <Image
                    src={ETH}
                    alt="ETH"
                    className="w-[ 57.6px] ml-[-18px] h-[ 57.6px]"
                  />
                </div>

                <div className="mt-6">
                  <p className="text-center text-[#FFFFFF] font-[700] text-[20px] rounded-[4px] py-[8px]">
                    Confirm swap of BTC to ETH
                  </p>
                </div>

                <div className="mt-[40px] space-y-3">
                  {[
                    { label: "You are swapping", value: "0.010 BTC" },
                    { label: "You will receive", value: "0.250 ETH (≈ $410)" },
                    { label: "Exchange Rate", value: "1 BTC = 25 ETH" },
                    { label: "Network Fee", value: "0.0001 BTC (≈ $4.80)" },
                    { label: "Total Cost", value: "0.0101 BTC (≈ $485)" },
                    { label: "Estimated Time", value: "< 2 minutes" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center w-[496px] h-[44px] text-[14px] mb-[5px] font-[400] text-[#DBDBDB] bg-[#222222] p-[12px] rounded-[6px]"
                    >
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-[25px] mt-[30px]">
                  <button
                    onClick={closeSwapModal}
                    className="w-[242px] h-[48px] border-none bg-[#2D2D2D] rounded-full text-[#FFFFFF] text-[14px] font-[700]"
                  >
                    Cancel
                  </button>
                  <button
                    className="w-[242px] h-[48px] bg-[#4DF2BE] rounded-full text-[14px] text-[#0F1012] font-[700]"
                    style={{ border: "1px solid #4DF2BE" }}
                    onClick={() => setIsSecpinModal(true)}
                  >
                    Confirm Swap
                  </button>
                </div>
              </div>
            </div>
          )}
          <div>
            <p className="text-[24px] font-[700] text-[#FCFCFC]">Swap Crypto</p>
          </div>
          {/*general div l & r*/}
          <div className="flex items-center space-x-[10px]">
            {/*div left*/}
            <div
              className="w-[556px] h-[139px] bg-[#222222]  rounded-[12px] flex flex-col justify-between"
              style={{ padding: "12px 32px 24px 16px" }}
            >
              <div className="w-[508px] h-[20px]">
                <p className="text-[14px] text-[#8F8F8F] font-[400]">
                  You are swapping
                </p>
              </div>

              <div className="flex items-center justify-between ">
                <div className=" flex text-[28px]  ">
                  <p className="text-[#FCFCFC] ">
                    0{" "}
                    <span className="text-[#8F8F8F] font-[400] w-[9px] h-[38px]">
                      |
                    </span>{" "}
                  </p>
                </div>
                {/*where dropdown one */}
                <div className="w-[96px] h-[32px] flex items-center space-x-[10px]  justify-center bg-[#2D2D2D] rounded-full ">
                  <Image
                    src={selectedCoin.icon}
                    alt={selectedCoin.name}
                    className="w-[23.997px] h-[24px] ml-[-25px]"
                  />
                  <p className="text-[14px] font-[700] text-[#DBDBDB]">
                    {selectedCoin.name}
                  </p>
                  <Image
                    src={Arrow}
                    alt="arrow_down"
                    className="text-[#8F8F8F] w-[16px] h-[16px]"
                    onClick={toggleSecDropdown}
                  />
                </div>

                {SecDropdownOpen && (
                  <div className="absolute top-[60%] left-[35%]  w-[250px]  bg-[#222222] rounded-[16px] shadow-lg z-[1500] p-8 space-y-4">
                    {coins.map((coin) => (
                      <div
                        key={coin.name}
                        onClick={() => {
                          setSelectedCoin(coin);
                          setSecDropdownOpen(false);
                        }}
                        className="flex items-center justify-between cursor-pointer hover:bg-[#2D2D2D] px-4 py-2 rounded-[12px]"
                      >
                        <div className="flex items-center pl-[20px]  space-x-[10px]">
                          <Image
                            src={coin.icon}
                            alt={coin.name}
                            width={19.998}
                            height={20}
                          />
                          <p className="text-[16px] font-[500] text-[#FFFFFF]">
                            {coin.name}
                          </p>
                        </div>
                        {/* Selection Indicator */}
                        <div
                          className={`w-[20px] h-[20px] mr-[10px] rounded-full border-2 ${
                            selectedCoin.name === coin.name
                              ? "border-[#4DF2BE] bg-[#4DF2BE]"
                              : "border-[#8F8F8F]"
                          } flex items-center justify-center`}
                        >
                          {selectedCoin.name === coin.name && (
                            <div className="w-[10px] h-[10px]  rounded-full bg-[#0F1012]"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="w-[115px] h-[28px] whitespace-nowrap flex items-center justify-center text-[14px] font-[400] bg-[#2D2D2D] text-[#8F8F8F] rounded-full">
                  Min: 0.0001276
                </div>

                <div className="flex items-center">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    Balance:{" "}
                  </p>{" "}
                  <span className="text-[14px] font-[500] text-[#FCFCFC]">
                    0.90 BTC
                  </span>
                </div>
              </div>
            </div>

            {/* Swap Icon */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10">
              <div className="w-[40px] h-[40px] rounded-[48px] border-[4px] border-[#0F1012] bg-[#4DF2BE] flex items-center justify-center p-2">
                <Image
                  src={Swapicon}
                  alt="swap"
                  width={21}
                  height={21}
                  className="w-[21px] h-[21px]"
                  style={{ color: "#0F1012" }}
                />
              </div>
            </div>

            {/*div right*/}
            <div
              className="w-[556px] h-[139px] bg-[#222222]  rounded-[12px] flex flex-col justify-between"
              style={{ padding: "12px 16px 24px 32px" }}
            >
              <div className="w-[508px] h-[20px]">
                <p className="text-[14px] text-[#8F8F8F] font-[400]">
                  You will receive
                </p>
              </div>

              <div className="flex items-center justify-between ">
                <div className=" flex text-[28px]  ">
                  <p className="text-[#FCFCFC] ">
                    0{" "}
                    <span className="text-[#8F8F8F] font-[400] w-[9px] h-[38px]">
                      |
                    </span>{" "}
                  </p>
                </div>

                {/*where dropdown two */}

              <div className="w-[96px] h-[32px] flex items-center space-x-[10px]  justify-center bg-[#2D2D2D] rounded-full ">
                  <Image
                    src={selectedCoinTwo.icon}
                    alt={selectedCoinTwo.name}
                    className="w-[23.997px] h-[24px] ml-[-25px]"
                  />
                  <p className="text-[14px] font-[700] text-[#DBDBDB]">
                    {selectedCoinTwo.name}
                  </p>
                  <Image
                    src={Arrow}
                    alt="arrow_down"
                    className="text-[#8F8F8F] w-[16px] h-[16px]"
                    onClick={toggleSecDropdownTwo}
                  />
                </div>

                {SecDropdownOpenTwo && (
                  <div className="absolute top-[60%] left-[80%]  w-[250px]  bg-[#222222] rounded-[16px] shadow-lg z-[1500] p-8 space-y-4">
                    {coins2.map((coin) => (
                      <div
                        key={coin.name}
                        onClick={() => {
                          setSelectedCoinTwo(coin);
                          setSecDropdownOpenTwo(false);
                        }}
                        className="flex items-center justify-between cursor-pointer hover:bg-[#2D2D2D] px-4 py-2 rounded-[12px]"
                      >
                        <div className="flex items-center pl-[20px]  space-x-[10px]">
                          <Image
                            src={coin.icon}
                            alt={coin.name}
                            width={19.998}
                            height={20}
                          />
                          <p className="text-[16px] font-[500] text-[#FFFFFF]">
                            {coin.name}
                          </p>
                        </div>
                        {/* Selection Indicator */}
                        <div
                          className={`w-[20px] h-[20px] mr-[10px] rounded-full border-2 ${
                            selectedCoinTwo.name === coin.name
                              ? "border-[#4DF2BE] bg-[#4DF2BE]"
                              : "border-[#8F8F8F]"
                          } flex items-center justify-center`}
                        >
                          {selectedCoinTwo.name === coin.name && (
                            <div className="w-[10px] h-[10px]  rounded-full bg-[#0F1012]"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="w-[38px] h-[28px] whitespace-nowrap flex items-center justify-center text-[14px] font-[500] bg-[#2D2D2D] text-[#FCFCFC] rounded-full">
                  <p>
                    $ <span>0</span>
                  </p>
                </div>

                <div className="flex items-center">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    Balance:{" "}
                  </p>{" "}
                  <span className="text-[14px] font-[500] text-[#FCFCFC]">
                    0.00 ETH
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div
            className="w-[1190px] h-[56px] flex items-center  mt-[20px] bg-[#2D2D2D] space-x-[10px]"
            style={{
              borderRadius: "0 12px 12px 0",
              borderLeft: "2px solid #FFC051",
              padding: "16px 16px 16px 8px",
            }}
          >
            <Image src={I_icon} alt="iicon" />
            <p className="text-[14px] font-[400] text-[#DBDBDB]">
              The exchange rate includes all fees from Evolv2p and our hedging
              counterparty
            </p>
          </div>
          <div className="w-[1190] h-[68px] flex items-center  mt-[20px] bg-[#222222] rounded-[8px] p-[12px] space-x-[10px]">
            <Image src={Rotate} alt="rotate" />

            <div className="flex flex-col ">
              <div className="flex items-center space-x-[10px]  text-[16px] font-[500]">
                <p className=" text-[#DBDBDB]">1 BTC </p>{" "}
                <small className="text-[#8F8F8F]">=</small>{" "}
                <span className="text-[#DBDBDB]">25 ETH</span>
              </div>

              <div className="flex items-center mt-[-20px]">
                <p className="text-[14px] font-[400] text-[#8F8F8F]">
                  Refreshening in{" "}
                  <span className="text-[#FFC051] font-[500]">14 Seconds</span>
                </p>
              </div>
            </div>

            <div
              className="w-[105px] h-[44px] flex  items-center justify-center rounded-full bg-[#4DF2BE] ml-auto"
              style={{ border: "1px solid  #4DF2BE" }}
            >
              <p
                className="text-[14px] font-[700] text-[#0F1012]"
                onClick={() => setIsSwapModal(true)}
              >
                Swap now
              </p>
            </div>
          </div>
        </div>

        <div className=" mb-[80px] mt-[40%] ">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Swap;
