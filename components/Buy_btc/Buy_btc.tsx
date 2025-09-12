"use client";

import { useState } from "react";
import Nav from "../../components/NAV/Nav";
import Image from "next/image";
import Vector from "../../public/Assets/Evolve2p_vector/vector.svg";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import Less_than from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg"
import Divider from "../../public/Assets/Evolve2p_divider/Divider.svg";
import Thumbs from "../../public/Assets/Evolve2p_thumbs/elements.svg";
import Timer from "../../public/Assets/Evolve2p_timer/elements.svg";
import Dminus from "../../public/Assets/Evolve2p_Dminus/Divider.svg";
import Verified from "../../public/Assets/Evolve2p_verified/Makretplace/elements.svg"
import UPa from "../../public/Assets/Evolve2p_upA/Makretplace/elements.svg";
import CircY from "../../public/Assets/Evolve2p_circY/Makretplace/elements.svg";
import Dols from "../../public/Assets/Evolve2p_Dols/Makretplace/elements.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";



const BuyBTC = () =>  {
  // Exchange rate
  const BTC_PRICE = 48000; // 1 BTC = $48,000

  const [pay, setPay] = useState<string>(""); // USD
  const [receive, setReceive] = useState<string>(""); // BTC

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
          <Image src={Less_than} alt="lessthan"/>
         <p> Buy BTC</p>
          </div>
        {/* general_div */}
       <div className= "flex gap-[25px] mt-[20px] ml-[100px]">

        {/* left_div */}
        <div className="flex flex-col">
            {/* first container left */}
           <div className="w-[498px] h-[219px] bg-[#222222] rounded-[12px]"
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
                </div>
               {/* second line in first container */}
                <div className= "flex items-center text-[#C7C7C7]  text-[14px] font-[500] gap-[5px]">
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
                        <p>
                    Available:
                  </p>

                  <p >
                    50,000{" "}
                    <span>
                      BTC
                    </span>
                  </p>
                      </div>

                      <div className="flex items-center mt-[-20px] text-[#C7C7C7] text-[14px] font-[500]  gap-[5px]">
                         <p >
                    {" "}
                    Order limit:
                  </p>

                  <p >
                    200.00{" "}
                    <span >
                      BTC
                    </span>
                  </p>
                  <Image src={Dminus} alt="minus"  />
                  <p >
                    200.00{" "}
                    <span >
                      BTC
                    </span>
                  </p>
                       </div>

                       <div className="flex items-center gap-[10px]">
                        <div className="flex items-center gap-[15px] bg-[#3A3A3A] w-[124px] h-[24px] rounded-[16px]"
                        style={{padding: "2px 10px"}}
                        >
                       <Image src={Verified}  alt="ver"/>
                       <p className="text-[#DBDBDB] text-[14px] font-[500]"> Email Verified</p>
                       </div>

                        <div className="flex items-center gap-[15px] bg-[#3A3A3A] w-[124px] h-[24px] rounded-[16px]"
                        style={{padding: "2px 10px"}}
                        >
                       <Image src={Verified}  alt="ver"/>
                       <p className="text-[#DBDBDB] text-[14px] font-[500]"> Phone Verified</p>
                       </div>

                        <div className="flex items-center gap-[15px] bg-[#3A3A3A] w-[103px] h-[24px] rounded-[16px]"
                        style={{padding: "2px 10px"}}
                        >
                       <Image src={Verified}  alt="ver"/>
                       <p className="text-[#DBDBDB] text-[14px] font-[500]"> ID Verified</p>
                       </div>

                        </div>

                <div className="text-[14px] font-[500] mt-[15px] text-[#C7C7C7]">
                  Feedbacks(21)
                  </div>
            </div>

            <div className="w-[498px] h-[128px] bg-[#2D2D2D] mt-[20px] rounded-[12px]"
            style={{ padding: "12px 16px" }}
            >
               <div>
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-[700] text-[#FFFFFF]"> Offer Terms (please read carefully) </p>
                  <Image src={UPa} alt="up"/>
                  </div> 

                  <ul className="text-[#DBDBDB] text-[14px] space-y-[5px] font-[500]">
                    <li>Only first-party payments.</li>
                    <li>Bank-to-bank transfers only</li>
                    <li>May request extra KYC</li>
                    </ul>
                </div>
            </div>

        </div>
            {/* right_div */}

            <div className="flex flex-col gap-[8px]" >

              {/*each container of div */}
                <div >
                   {/* first container */}
                  <div className="w-[498px] h-[68px] bg-[#222222] rounded-[8px] "
                  style={{padding:"12px 16px"}}
                  >
                     <div className="flex items-center gap-[20px]">
                      <Image src={CircY} alt="circ"/>
                      <div className="flex flex-col">
                        <p className="text-[16px] font-[500]  text-[#DBDBDB]">1 BTC <span className="ml-[10px]">= </span> <span className="ml-[10px]"> $48,000 </span></p>
                        <p className="text-[14px] mt-[-10px] font-[500]  text-[#C7C7C7]"> Processing fee  <span className="ml-[10px]">= </span> <span className="text-[#DBDBDB] ml-[10px]"> 0.0005 BTC  </span></p>                          
                      </div>
                      </div>
                    </div>

                  </div>
                  {/* second_container */}
                  <div className="w-[498px] h-[135px] bg-[#222222] rounded-[12px]"
                  style={{padding:"12px 16px"}}
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
                    <Image src={Dols} alt="dols"/>
                   <p className="text-[#DBDBDB] text-[14px] font-[700]"> USD </p>
                    </div>
                            </div>
                            <div className="text-[14px] font-[500] text-[#C7C7C7]">
                              1 USD = <span className="text-[#DBDBDB]">0.0.0000123 BTC </span>
                              </div>
                      </div>

                       </div>
                        <div className="w-[498px] h-[103px] bg-[#222222] rounded-[12px]"
                  style={{padding:"12px 16px"}}
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
                    <Image src={BTC} alt="dols" className="w-[23.997px] h-[24px]"/>
                   <p className="text-[#DBDBDB] text-[14px] font-[700]"> USD </p>
                    </div>
                  </div>
                  </div>
                  </div>
                  <div className="flex flex-col gap-[5px]">
                       <div className=" flex items-center justify-between w-[498px] h-[40px] bg-[#2D2D2D] p-[8px_16px] rounded-t-[12px]">
                             <p className="text-[16px] font-[400] text-[#DBDBDB]">Limit</p>
                             <p className="text-[16px] font-[500] text-[#FFFFFF]"> $10 - $148500 </p>
                        </div>

                       <div className=" flex items-center justify-between w-[498px] h-[40px] bg-[#2D2D2D] p-[8px_16px] border-l-2 border-l-[#FFFA66]">
                             <p className="text-[16px] font-[400] text-[#DBDBDB]">Payment</p>
                             <p className="text-[16px] font-[500] text-[#FFFFFF]"> Bank Transfers </p>
                        </div>

                        <div className=" flex items-center justify-between w-[498px] h-[40px] bg-[#2D2D2D] p-[8px_16px] rounded-b-[12px]">
                             <p className="text-[16px] font-[400] text-[#DBDBDB]">Time limit</p>
                             <p className="text-[16px] font-[500] text-[#FFFFFF]"> 30 min </p>
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
}
 


export default BuyBTC    