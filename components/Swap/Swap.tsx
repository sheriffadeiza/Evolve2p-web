import React from "react";
import Nav from "../../components/NAV/Nav";
import TabsNav from "../TabsNav/TabsNav";
import Image from "next/image";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import Arrow from "../../public/Assets/Evolve2p_arrowd/arrow-down-01.png";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import Swapicon from "../../public/Assets/Evolve2p_swapicon/elements.svg";
import I_icon from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import Rotate from "../../public/Assets/Evolve2p_rotate/elements.svg";
import Footer from "../../components/Footer/Footer";

const Swap = () => {
  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex bg-[#2D2D2D] rounded-[56px] mt-8 w-[296px] h-[48px] p-1 items-center justify-between">
          <TabsNav />
        </div>

        <div className="w-[1224px] h-[463px] bg-[#1A1A1A] mt-[20px] rounded-[12px] p-[32px]">
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

                <div className="w-[96px] h-[32px] flex items-center space-x-[10px]  justify-center bg-[#2D2D2D] rounded-full ">
                  <Image
                    src={BTC}
                    alt="btc"
                    className="w-[23.997px] h-[24px] ml-[-25px]"
                  />
                  <p className="text-[14px] font-[700] text-[#DBDBDB]">BTC</p>
                  <Image
                    src={Arrow}
                    alt="arrow_down"
                    className="text-[#8F8F8F] w-[16px] h-[16px]"
                  />
                </div>
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

                <div className="w-[96px] h-[32px] flex items-center space-x-[10px]  justify-center bg-[#2D2D2D] rounded-full ">
                  <Image
                    src={ETH}
                    alt="btc"
                    className="w-[23.997px] h-[24px] ml-[-25px]"
                  />
                  <p className="text-[14px] font-[700] text-[#DBDBDB]">ETH</p>
                  <Image
                    src={Arrow}
                    alt="arrow_down"
                    className="text-[#8F8F8F] w-[16px] h-[16px]"
                  />
                </div>
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

          <div
            className="w-[1190] h-[68px] flex items-center  mt-[20px] bg-[#222222] rounded-[8px] p-[12px] space-x-[10px]"
            
          >

            <Image src={Rotate} alt="rotate"/>

            <div className="flex flex-col ">
              <div className="flex items-center space-x-[10px]  text-[16px] font-[500]">
                 <p className=" text-[#DBDBDB]">1 BTC </p> <small className="text-[#8F8F8F]">=</small> <span className="text-[#DBDBDB]">25 ETH</span>
                 </div>

                 <div className="flex items-center mt-[-20px]">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">Refreshening in <span className="text-[#FFC051] font-[500]">14 Seconds</span></p>
                 </div>
            </div>

            <div className="w-[105px] h-[44px] flex  items-center justify-center rounded-full bg-[#4DF2BE] ml-auto"
            style={{border: '1px solid  #4DF2BE', padding: '10px 18px'

}}
            >
              <p className="text-[14px] font-[700] text-[#0F1012]">Swap now</p>
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
