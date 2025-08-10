"use client";

import React, { useState } from "react";
import Nav from "../../components/NAV/Nav";
import Image from "next/image";
import Arrow_d from "../../public/Assets/Evolve2p_arrowd/arrow-down-01.png";
import Globe from "../../public/Assets/Evolve2p_globe/Makretplace/elements.svg";
import Funnel from "../../public/Assets/Evolve2p_funnel/elements.svg";
import Vector from "../../public/Assets/Evolve2p_vector/vector.svg";
import Repeat from "../../public/Assets/Evolve2p_Repeat/repeat.svg";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import Divider from "../../public/Assets/Evolve2p_divider/Divider.svg";
import Thumbs from "../../public/Assets/Evolve2p_thumbs/elements.svg";
import Timer from "../../public/Assets/Evolve2p_timer/elements.svg";
import Dminus from "../../public/Assets/Evolve2p_Dminus/Divider.svg";
import Dyellow from "../../public/Assets/Evolve2p_Dyellow/Divider.svg";
import Dpurple from "../../public/Assets/Evolve2p_Dpurple/Divider.svg";
import Dpink from "../../public/Assets/Evolve2p_Dpink/Divider.svg";
import Dgreen from "../../public/Assets/Evolve2p_Dgreen/Divider.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import Footer from "../../components/Footer/Footer";

const Market_place: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Buy");
  const tabs = ["Buy", "Sell"];
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({ name: "BTC", icon: BTC });


  const toggleMarketDropdown = () => {
    setIsMarketDropdownOpen((prev) => !prev);
  };


   const coins = [
      { name: "BTC", icon: BTC },
      { name: "ETH", icon: ETH },
      { name: "USDT", icon: USDT },
      { name: "USDC", icon: USDC },
    ];

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />
         
        <div className="flex  space-x-[10px] mt-[35px]">
          {/*left_div  */}
          <div className="bg-[#222222]  pl-[30px] pt-[20px] w-[395px] h-[498.79999]">
            <h2 className="text-[24px] text-[#FCFCFC] font-[700]">
              Find an Offer
            </h2>
            <p className="text-[#DBDBDB] text-[14px] font-[400] w-[355px] h-[40px] ">
              Let us know your trading needs, and we’ll assist you in narrowing
              down the offers in the P2P marketplace.
            </p>

            <div className="space-y-2">
              <label className="block text-[14px] font-[500] text-[#8F8F8F]">
                I want to
              </label>
              <div className="w-[355px] h-[43.2px] mt-[10px] bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer">
                <span className="text-[#FCFCFC] pl-[15px] text-[14px] font-[500]">
                  Buy
                </span>
                <Image
                  src={Arrow_d}
                  alt="arrow"
                  className="text-[#DBDBDB] mr-[15px]"
                />
              </div>
              <div className="w-[355px] h-[43.2px] mt-[10px] bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer">
                <span className="flex items-center pl-[15px]  text-[#FCFCFC] text-[14px] font-[500]">
                  <Image
                    src={BTC}
                    alt="bitcoin"
                    className="w-[19.998px] h-[20px]  "
                  />
                  <p className="ml-[5px]"> BTC</p>
                </span>
                <Image
                  src={Arrow_d}
                  alt="arrow"
                  className="text-[#DBDBDB] mr-[15px]"
                />
              </div>
            </div>
            <div className="w-[355px] h-[1px] bg-[#8F8F8F] mt-[20px]"></div>

            <div className="space-y-2 mt-[15px]">
              <label className="block text-[14px] font-[500] text-[#8F8F8F]">
                My payment currency and method is
              </label>

              <div className="w-[355px] h-[43.2px] mt-[10px] bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer">
                <span className="text-[#FCFCFC] pl-[15px] text-[14px] font-[500]">
                  USD
                </span>
                <Image
                  src={Arrow_d}
                  alt="arrow"
                  className="text-[#DBDBDB] mr-[15px]"
                />
              </div>

              <div className="w-[355px] h-[43.2px] mt-[10px] bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer">
                <span className="flex items-center pl-[15px]  text-[#FCFCFC] text-[14px] font-[500]">
                  <Image
                    src={Globe}
                    alt="bitcoin"
                    className="w-[19.998px] h-[20px]  "
                  />
                  <p className="ml-[5px]"> All Regions</p>
                </span>
                <Image
                  src={Arrow_d}
                  alt="arrow"
                  className="text-[#DBDBDB] mr-[15px]"
                />
              </div>
            </div>

            <div className="flex w-[355px] items-center mt-[15px]  space-x-[10px] mt-4">
              <button className="bg-[#2c2c2c] text-[#FCFCFC] text-[14px] border-none  font-[700] px-6 py-2 rounded-full w-[77px] h-[48px]">
                Reset
              </button>
              <button
                className="bg-[#4DF2BE] text-[#0F1012] text-[14px] font-[700] px-6 py-2 rounded-full w-[266px] h-[48px]"
                style={{ border: "1px solid #4DF2BE" }}
              >
                Find offer
              </button>
            </div>
          </div>
          
          {/*right_div  */}
          {/*right_div  */}
            
            <div className="flex items-center w-[141px] h-[36px] space-x-[15px]">
              <div className="flex  bg-[#2D2D2D] rounded-[56px] items-center">
                {tabs.map((tab) => (
                  <div
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex items-center justify-center text-[16px] w-[68px] h-[32px] rounded-[40px] cursor-pointer
                        ${
                          activeTab === tab
                            ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500]"
                            : "bg-[#2D2D2D]  text-[#DBDBDB] font-[400]"
                        }
                        
                        `}
                    style={{ minWidth: "68px", minHeight: "32px" }}
                  >
                    {tab}
                  </div>
                ))}

                </div>

               {/*drop_down coins */}
                 <div
                className=" flex items-center  ml-[50px] w-[115px] h-[40px] space-x-[20px] bg-[#2D2D2D] rounded-full 
           "
                style={{ padding: "5px 10px" }}
              >
                <div className="ml-[10px] flex items-center space-x-[15px]">
                  <Image
                    src={selectedCoin.icon}
                  alt={selectedCoin.name}
                    className="w-[19.998px] h-[20px]"
                  />
                  <p className="text-[14px] font-[400] text-[#FCFCFC] ">{selectedCoin.name}</p>
                  <Image
                    src={Arrow_d}
                    alt="arrow"
                    className="w-[20px] h-[20px] text-[#8F8F8F] "
                    onClick={toggleMarketDropdown}
                  />
                </div>
               
               {isMarketDropdownOpen && (
                <div className="absolute w-[250px] bg-[#222222] top-[200px] rounded-[16px] shadow-lg z-[1500] p-8 space-y-4">
                      {coins.map((coin) => (

                        <div
                        key={coin.name}
                        onClick={() => {
                          setSelectedCoin(coin);
                          setIsMarketDropdownOpen(false);
                        }}
                        className="flex items-center justify-between cursor-pointer hover:bg-[#2D2D2D] px-4 py-2 rounded-[12px]"
                        >

                          <div
                          className="flex items-center pl-[20px] space-x-[10px]"
                          >
                            <Image src={coin.icon} alt={coin.name} className="w-[19.998px] h-[20px]" />

                            <p className="text-[16px] font-[500] text-[#FFFFFF]">{coin.name}</p>

                          </div>

                          {/*selection indicator */}

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
               <div
                className=" flex    w-[146px] h-[40px] whitespace-nowrap space-x-[20px] bg-[#2D2D2D] rounded-full 
           "
                style={{ padding: "5px 10px" }}
              >
                <div className="ml-[20px] flex  items-center space-x-[15px]">
                  <p className="text-[14px] font-[400] text-[#FCFCFC] ">
                    Amount NGN
                  </p>
                  <Image
                    src={Arrow_d}
                    alt="arrow"
                    className="w-[20px] h-[20px] text-[#8F8F8F] "
                      />
                </div>
              </div>
                 <div
                className=" flex items-center   w-[146px] h-[40px] space-x-[20px] bg-[#2D2D2D] rounded-full 
           "
                style={{ padding: "5px 10px" }}
              >
                <div className="ml-[15px] flex items-center space-x-[15px]">
                  <p className="text-[14px] font-[400] text-[#FCFCFC] whitespace-nowrap ">
                     Payment Method
                  </p>
                  <Image
                    src={Arrow_d}
                    alt="arrow"
                    className="w-[20px] h-[20px] text-[#8F8F8F] "
                     />
                </div>
              </div>

               <div
                className=" w-[28px] h-[28px] mt-[5px]  flex items-center  bg-[#2D2D2D] space-x-[15px] rounded-full p-[8px] realtive"
                style={{ border: "1px solid #2D2D2D" }}
              >
                <Image
                  src={Funnel}
                  alt="funnel"
                  className="w-[ 22.75px] h-[ 22.75px] text-[#8F8F8F] ml-[2px] "
                />
                <Image
                  src={Vector}
                  alt="vector"
                  className="w-[12px] h-[12px]  ml-[18px] mt-[-23px] absolute"
                />
              </div>
               <div
                className=" w-[28px] h-[28px] mt-[5px]  flex items-center  bg-[#2D2D2D] space-x-[15px] rounded-full p-[8px] "
                style={{ border: "1px solid #2D2D2D" }}
              >
                <Image
                  src={Repeat}
                  alt="repeat"
                    className="w-[ 22.75px] h-[ 22.75px] text-[#8F8F8F] ml-[2px] "
                />
              </div>
         
              

           
             
             
             </div>

             <div className="flex flex-col space-y-[10px] ml-[-140px] mt-[30px]">
                  <div className="flex  mt-[20px] text-[14px] text-[#8F8F8F] font-[400]">
              <p className="w-[228px] h-[20px] ">Seller</p>
              <p className="w-[194px] h-[20px] ml-[10px]">Offer Details</p>
              <p className="w-[261px] h-[20px]">Limits & Payment</p>
            </div>
               
                     <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
                <div className="flex mt-[-10px] flex-col">

                <div className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                style={{ padding: "3px 2px" }}>
                
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">JD</p>
                  <Image src={Vector} alt="vector" className="mt-[20px]"/> 
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">John Doe</p>

                    <Image src={Mark_green} alt="mark" className="ml-[10px] w-[12.541px] h-[12.541px]" />
                 </div>
              <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                        
                    <p>100 orders</p> 
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />
                    <p>100.00% completion</p>
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />


                {/*second*/} </div>
                  <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                    <Image src={Thumbs} alt="thunbs" className="w-[12px] h-[12px]" />
                    <p>99.99</p>
                    <Image src={Divider} alt="divider"  className="mt-[-10px]" />

                     <Image src={Timer} alt="timer"/>

                    <p>15 min</p>

           {/*3rd */}    </div>

            {/*div for flex col of a container first row*/}     </div>
            <div className="flex mt-[-10px] flex-col ml-[30px]  ">
              <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                        
                
                    <p className="text-[12px] font-[500] text-[#FCFCFC]">USD <span className="text-[18px] font-[700] text-[#FCFCFC]">102,120.30</span>
                    </p>

               </div>
              
      <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">1 USD = 0.0000098 BTC</p>

              
            
           
         {/*div for second column flex-col*/}   </div>


 <div className="flex flex-col mt-[-10px] ml-[30px]  ">
              <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]">Available:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">50,000 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]"> Order limit:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">200.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span> 
                    </p>
                    <Image src={Dminus} alt="minus" className="mt-[20px]"/>
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">200.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>
             <div className="flex ml-[20px] mt-[-5px]">

              <Image src={Dyellow} alt="dyellow" className="w-[2px]"/>
              <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">Bank Transfers</p>
              </div>
        
   {/*div for flex col in third column */}</div>
           <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
           <button className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
           style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
           >
            Buy BTC
            </button>
            </div>
       {/*div for flex in first container*/}     </div>


              {/* second container */}
            <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
                <div className="flex mt-[-10px] flex-col">

                <div className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                style={{ padding: "3px 2px" }}>
                
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">JS</p>
                  <Image src={Vector} alt="vector" className="mt-[20px]"/> 
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">Jane Smith</p>

                    <Image src={Mark_green} alt="mark" className="ml-[10px] w-[12.541px] h-[12.541px]" />
                 </div>
              <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                        
                    <p>150 orders</p> 
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />
                    <p>98.75% completion</p>
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />


                {/*second*/} </div>
                  <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                    <Image src={Thumbs} alt="thunbs" className="w-[12px] h-[12px]" />
                    <p>98.00</p>
                    <Image src={Divider} alt="divider" className="mt-[-10px]"  />

                     <Image src={Timer} alt="timer" />

                    <p>10 min</p>

           {/*3rd */}    </div>

            {/*div for flex col of a container first row*/}     </div>
            <div className="flex mt-[-10px] flex-col ml-[30px]  ">
              <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                        
                
                    <p className="text-[12px] font-[500] text-[#FCFCFC]">USD <span className="text-[18px] font-[700] text-[#FCFCFC]">125,500.00</span>
                    </p>

               </div>
              
      <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">1 USD = 0.0000120 BTC</p>

              
            
           
         {/*div for second column flex-col*/}   </div>


 <div className="flex flex-col mt-[-10px] ml-[30px]  ">
              <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]">Available:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">30,000 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]"> Order limit:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">250.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span> 
                    </p>
                    <Image src={Dminus} alt="minus" className="mt-[20px]"/>
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">250.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>
             <div className="flex ml-[20px] mt-[-5px]">

              <Image src={Dpurple} alt="dpurple" className="w-[2px]"/>
              <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">Credit Cards</p>
              </div>
        
   {/*div for flex col in third column */}</div>
           <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
           <button className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
           style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
           >
            Buy BTC
            </button>
            </div>
       {/*div for flex in second container*/}     </div>

       {/*third container*/}
        <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
                <div className="flex mt-[-10px] flex-col">

                <div className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                style={{ padding: "3px 2px" }}>
                
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">AJ</p>
                  <Image src={Vector} alt="vector" className="mt-[20px]"/> 
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">Alice Johnson</p>

                    <Image src={Mark_green} alt="mark" className="ml-[10px] w-[12.541px] h-[12.541px]" />
                 </div>
              <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                        
                    <p>80 orders</p> 
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />
                    <p>100.00% completion</p>
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />


                {/*second*/} </div>
                  <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                    <Image src={Thumbs} alt="thunbs" className="w-[12px] h-[12px]" />
                    <p>100.00</p>
                    <Image src={Divider} alt="divider" className="mt-[-10px]"  />

                     <Image src={Timer} alt="timer" />

                    <p>5 min</p>

           {/*3rd */}    </div>

            {/*div for flex col of a container first row*/}     </div>
            <div className="flex mt-[-10px] flex-col ml-[30px]  ">
              <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                        
                
                    <p className="text-[12px] font-[500] text-[#FCFCFC]">USD <span className="text-[18px] font-[700] text-[#FCFCFC]">78,000.00</span>
                    </p>

               </div>
              
      <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">1 USD = 0.0000085 BTC</p>

              
            
           
         {/*div for second column flex-col*/}   </div>


 <div className="flex flex-col mt-[-10px] ml-[30px]  ">
              <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]">Available:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">40,000 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]"> Order limit:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">180.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span> 
                    </p>
                    <Image src={Dminus} alt="minus" className="mt-[20px]"/>
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">180.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>
             <div className="flex ml-[20px] mt-[-5px]">

              <Image src={Dpink} alt="dpink" className="w-[2px]"/>
              <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">Wire Transfers</p>
              </div>
        
   {/*div for flex col in third column */}</div>
           <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
           <button className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
           style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
           >
            Buy BTC
            </button>
            </div>
       {/*div for flex in third container*/}     </div>

       {/*fourth container*/}
       <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
                <div className="flex mt-[-10px] flex-col">

                <div className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                style={{ padding: "3px 2px" }}>
                
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">BB</p>
                  <Image src={Vector} alt="vector" className="mt-[20px]"/> 
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">Bob Brown</p>

                    <Image src={Mark_green} alt="mark" className="ml-[10px] w-[12.541px] h-[12.541px]" />
                 </div>
              <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                        
                    <p>200 orders</p> 
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />
                    <p>95.00% completion</p>
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />


                {/*second*/} </div>
                  <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                    <Image src={Thumbs} alt="thunbs" className="w-[12px] h-[12px]" />
                    <p>95.50</p>
                    <Image src={Divider} alt="divider" className="mt-[-10px]"  />

                     <Image src={Timer} alt="timer" />

                    <p>20 min</p>

           {/*3rd */}    </div>

            {/*div for flex col of a container first row*/}     </div>
            <div className="flex mt-[-10px] flex-col ml-[30px]  ">
              <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                        
                
                    <p className="text-[12px] font-[500] text-[#FCFCFC]">USD <span className="text-[18px] font-[700] text-[#FCFCFC]">200,000.00</span>
                    </p>

               </div>
              
      <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">1 USD = 0.0000145 BTC</p>

              
            
           
         {/*div for second column flex-col*/}   </div>


 <div className="flex flex-col mt-[-10px] ml-[30px]  ">
              <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]">Available:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">20,000 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]"> Order limit:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">300.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span> 
                    </p>
                    <Image src={Dminus} alt="minus" className="mt-[20px]"/>
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">300.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>
             <div className="flex ml-[20px] mt-[-5px]">

              <Image src={Dpink} alt="dpink" className="w-[2px]"/>
              <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">Wire Transfers</p>
              </div>
        
   {/*div for flex col in third column */}</div>
           <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
           <button className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
           style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
           >
            Buy BTC
            </button>
            </div>
       {/*div for flex in fourth container*/}     </div>
    

    {/*fifth container*/}
       <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
                <div className="flex mt-[-10px] flex-col">

                <div className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                style={{ padding: "3px 2px" }}>
                
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">CG</p>
                  <Image src={Vector} alt="vector" className="mt-[20px]"/> 
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">Charlie Green</p>

                    <Image src={Mark_green} alt="mark" className="ml-[10px] w-[12.541px] h-[12.541px]" />
                 </div>
              <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                        
                    <p>120 orders</p> 
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />
                    <p>99.50% completion</p>
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />


                {/*second*/} </div>
                  <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                    <Image src={Thumbs} alt="thunbs" className="w-[12px] h-[12px]" />
                    <p>99.00</p>
                    <Image src={Divider} alt="divider" className="mt-[-10px]"  />

                     <Image src={Timer} alt="timer" />

                    <p>12 min</p>

           {/*3rd */}    </div>

            {/*div for flex col of a container first row*/}     </div>
            <div className="flex mt-[-10px] flex-col ml-[30px]  ">
              <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                        
                
                    <p className="text-[12px] font-[500] text-[#FCFCFC]">USD <span className="text-[18px] font-[700] text-[#FCFCFC]">95,000.00</span>
                    </p>

               </div>
              
      <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">1 USD = 0.0000110 BTC</p>

              
            
           
         {/*div for second column flex-col*/}   </div>


 <div className="flex flex-col mt-[-10px] ml-[30px]  ">
              <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]">Available:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">25,000 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]"> Order limit:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">220.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span> 
                    </p>
                    <Image src={Dminus} alt="minus" className="mt-[20px]"/>
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">220.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>
             <div className="flex ml-[20px] mt-[-5px]">

              <Image src={Dgreen} alt="dgreen" className="w-[2px]"/>
              <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">Mobile Payments</p>
              </div>
        
   {/*div for flex col in third column */}</div>
           <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
           <button className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
           style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
           >
            Buy BTC
            </button>
            </div>
       {/*div for flex in  fifth container*/}     </div>


       {/*sixth container */}
       <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
                <div className="flex mt-[-10px] flex-col">

                <div className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                style={{ padding: "3px 2px" }}>
                
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">DM</p>
                  <Image src={Vector} alt="vector" className="mt-[20px]"/> 
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">David Miller</p>

                    <Image src={Mark_green} alt="mark" className="ml-[10px] w-[12.541px] h-[12.541px]" />
                 </div>
              <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                        
                    <p>90 orders</p> 
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />
                    <p>97.25% completion</p>
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />


                {/*second*/} </div>
                  <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                    <Image src={Thumbs} alt="thunbs" className="w-[12px] h-[12px]" />
                    <p>97.50</p>
                    <Image src={Divider} alt="divider" className="mt-[-10px]"  />

                     <Image src={Timer} alt="timer" />

                    <p>8 min</p>

           {/*3rd */}    </div>

            {/*div for flex col of a container first row*/}     </div>
            <div className="flex mt-[-10px] flex-col ml-[30px]  ">
              <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                        
                
                    <p className="text-[12px] font-[500] text-[#FCFCFC]">USD <span className="text-[18px] font-[700] text-[#FCFCFC]">85,500.00</span>
                    </p>

               </div>
              
      <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">1 USD = 0.0000090 BTC</p>

              
            
           
         {/*div for second column flex-col*/}   </div>


 <div className="flex flex-col mt-[-10px] ml-[30px]  ">
              <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]">Available:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">35,000 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]"> Order limit:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">190.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span> 
                    </p>
                    <Image src={Dminus} alt="minus" className="mt-[20px]"/>
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">190.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>
             <div className="flex ml-[20px] mt-[-5px]">

              <Image src={Dyellow} alt="dyellow" className="w-[2px]"/>
              <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">PayPal</p>
              </div>
        
   {/*div for flex col in third column */}</div>
           <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
           <button className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
           style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
           >
            Buy BTC
            </button>
            </div>
       {/*div for flex in  sixth container*/}     </div>

    {/*seventh container */}
       <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
                <div className="flex mt-[-10px] flex-col">

                <div className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                style={{ padding: "3px 2px" }}>
                
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">EM</p>
                  <Image src={Vector} alt="vector" className="mt-[20px]"/> 
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">Emily Davis</p>

                    <Image src={Mark_green} alt="mark" className="ml-[10px] w-[12.541px] h-[12.541px]" />
                 </div>
              <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                        
                    <p>110 orders</p> 
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />
                    <p>100.00% completion</p>
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />


                {/*second*/} </div>
                  <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                    <Image src={Thumbs} alt="thunbs" className="w-[12px] h-[12px]" />
                    <p>100.00</p>
                    <Image src={Divider} alt="divider" className="mt-[-10px]"  />

                     <Image src={Timer} alt="timer" />

                    <p>7 min</p>

           {/*3rd */}    </div>

            {/*div for flex col of a container first row*/}     </div>
            <div className="flex mt-[-10px] flex-col ml-[30px]  ">
              <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                        
                
                    <p className="text-[12px] font-[500] text-[#FCFCFC]">USD <span className="text-[18px] font-[700] text-[#FCFCFC]">88,000.00</span>
                    </p>

               </div>
              
      <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">1 USD = 0.0000102 BTC</p>

              
            
           
         {/*div for second column flex-col*/}   </div>


 <div className="flex flex-col mt-[-10px] ml-[30px]  ">
              <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]">Available:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">45,000 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]"> Order limit:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">210.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span> 
                    </p>
                    <Image src={Dminus} alt="minus" className="mt-[20px]"/>
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">210.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>
             <div className="flex ml-[20px] mt-[-5px]">

              <Image src={Dyellow} alt="dyellow" className="w-[2px]"/>
              <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">Bank Transfers</p>
              </div>
        
   {/*div for flex col in third column */}</div>
           <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
           <button className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
           style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
           >
            Buy BTC
            </button>
            </div>
       {/*div for flex in  seventh container*/}     </div>


       {/*eigth container */}

       <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
                <div className="flex mt-[-10px] flex-col">

                <div className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                style={{ padding: "3px 2px" }}>
                
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">GH</p>
                  <Image src={Vector} alt="vector" className="mt-[20px]"/> 
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">Grace Hall</p>

                    <Image src={Mark_green} alt="mark" className="ml-[10px] w-[12.541px] h-[12.541px]" />
                 </div>
              <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                        
                    <p>130 orders</p> 
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />
                    <p>96.50% completion</p>
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />


                {/*second*/} </div>
                  <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                    <Image src={Thumbs} alt="thunbs" className="w-[12px] h-[12px]" />
                    <p>96.00</p>
                    <Image src={Divider} alt="divider" className="mt-[-10px]"  />

                     <Image src={Timer} alt="timer" />

                    <p>11 min</p>

           {/*3rd */}    </div>

            {/*div for flex col of a container first row*/}     </div>
            <div className="flex mt-[-10px] flex-col ml-[30px]  ">
              <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                        
                
                    <p className="text-[12px] font-[500] text-[#FCFCFC]">USD <span className="text-[18px] font-[700] text-[#FCFCFC]">92,000.00</span>
                    </p>

               </div>
              
      <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">1 USD = 0.0000115 BTC</p>

              
            
           
         {/*div for second column flex-col*/}   </div>


 <div className="flex flex-col mt-[-10px] ml-[30px]  ">
              <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]">Available:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">50,000 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]"> Order limit:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">230.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span> 
                    </p>
                    <Image src={Dminus} alt="minus" className="mt-[20px]"/>
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">230.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>
             <div className="flex ml-[20px] mt-[-5px]">

              <Image src={Dpurple} alt="dpurple" className="w-[2px]"/>
              <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">Credit Cards</p>
              </div>
        
   {/*div for flex col in third column */}</div>
           <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
           <button className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
           style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
           >
            Buy BTC
            </button>
            </div>
       {/*div for flex in  eight container*/}     </div>

   {/*ninth container */}
          <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
                <div className="flex mt-[-10px] flex-col">

                <div className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                style={{ padding: "3px 2px" }}>
                
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">IH</p>
                  <Image src={Vector} alt="vector" className="mt-[20px]"/> 
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">Isaac Hunter</p>

                    <Image src={Mark_green} alt="mark" className="ml-[10px] w-[12.541px] h-[12.541px]" />
                 </div>
              <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                        
                    <p>140 orders</p> 
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />
                    <p>99.00% completion</p>
                    <Image src={Divider} alt="divider" className="w-[1px] mt-[10px] h-[12px]" />


                {/*second*/} </div>
                  <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                    <Image src={Thumbs} alt="thunbs" className="w-[12px] h-[12px]" />
                    <p>99.50</p>
                    <Image src={Divider} alt="divider" className="mt-[-10px]"  />

                     <Image src={Timer} alt="timer" />

                    <p>9 min</p>

           {/*3rd */}    </div>

            {/*div for flex col of a container first row*/}     </div>
            <div className="flex mt-[-10px] flex-col ml-[30px]  ">
              <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                        
                
                    <p className="text-[12px] font-[500] text-[#FCFCFC]">USD <span className="text-[18px] font-[700] text-[#FCFCFC]">102,500.00</span>
                    </p>

               </div>
              
      <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">1 USD = 0.0000125 BTC</p>

              
            
           
         {/*div for second column flex-col*/}   </div>


 <div className="flex flex-col mt-[-10px] ml-[30px]  ">
              <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]">Available:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">55,000 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                        
                        <p className="text-[14px] font-[400] text-[#8F8F8F]"> Order limit:</p>
                
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">240.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span> 
                    </p>
                    <Image src={Dminus} alt="minus" className="mt-[20px]"/>
                    <p className="text-[14px] font-[400] text-[#8F8F8F]">240.00 <span className="text-[14px] font-[400] text-[#8F8F8F]">BTC</span>
                    </p>

               </div>
             <div className="flex ml-[20px] mt-[-5px]">

              <Image src={Dgreen} alt="dgreen" className="w-[2px]"/>
              <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">Mobile Payments</p>
              </div>
        
   {/*div for flex col in third column */}</div>
           <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
           <button className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
           style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
           >
            Buy BTC
            </button>
            </div>
       {/*div for flex in  ninth container*/}     </div>


             {/* div of flex-col of container in new line */}</div>
            

               {/*left and right div*/} </div>
            <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>


          <div className=" mb-[80px] mt-[30%] ">
                  <Footer />
                </div>
        
      </div>
    </main>
  );
};

export default Market_place;




