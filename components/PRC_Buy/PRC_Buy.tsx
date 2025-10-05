"use client";

import React from "react";
import Image from "next/image";
import Less_than from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import Nav from "../../components/NAV/Nav";
import  Timer  from "../../public/Assets/Evolve2p_time/P2P Marketplace/elements.svg";
import Ochat from "../../public/Assets/Evolve2p_Ochat/P2P Marketplace/elements.svg";
import GreatT from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import Yellow_i from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import UPa from "../../public/Assets/Evolve2p_upA/Makretplace/elements.svg";
import Book from "../../public/Assets/Evolve2p_book/P2P Marketplace/book-open-02.svg";
import Vector from "../../public/Assets/Evolve2p_vector/vector.svg";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import Arrow_great from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Gtime from "../../public/Assets/Evolve2p_Gtime/P2P Marketplace/elements.svg";
import Message from "../../public/Assets/Evolve2p_message/P2P Marketplace/elements.svg";
import Mink from "../../public/Assets/Evolve2p_mink/P2P Marketplace/Group.svg";
import Footer from "../../components/Footer/Footer";



const PRC_Buy = () =>   {

    const [isHelpOpen, setIsHelpOpen] = React.useState(false);

    const [isTermsOpen, setIsTermsOpen] = React.useState(false);


  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex items-center ml-[15px] gap-[10px] text-[16px] font-[500] text-[#FFFFFF]">
          <Image src={Less_than} alt="lessthan" />
          <p> Buy BTC</p>
        </div>
         
         {/*General_div */}
         <div className="flex items-center gap-[20px]">
           
           {/* left_div*/}
           <div className="flex flex-col w-[602px] h-[924px] p-[24px_20px] ml-[105px]">
              <div className="flex items-center w-[562px] h-[32px] justfy-center gap-[4px]">
                
                <p className=" flex items-center justify-center gap-[8px] w-[184.66666px] border-b-[1px] border-[#4A4A4A] h-[36px] p-[4px_16px_8px_16px] text-[16px] font-[500] text-[#4DF2BE]">Pay</p>
                <p className="flex items-center justify-center gap-[8px]  w-[184.66666px] border-b-[1px] border-[#4A4A4A] h-[36px] p-[4px_16px_8px_16px] text-[16px] font-[500] text-[#5C5C5C]">In Review</p>
                <p className="flex items-center justify-center gap-[8px] w-[184.66666px] border-b-[1px] border-[#4A4A4A] h-[36px] p-[4px_16px_8px_16px] text-[16px] font-[500] text-[#5C5C5C]">Complete</p>
              </div>

              <div className="flex items-center w-[562px] h-[50px] mt-[20px] justify-between">
                <div className="flex flex-col ">
                    <p className="text-[24px] font-[400] text-[#FFFFFF] ">Order Created</p>
                    <p className="text-[12px] mt-[-20px] font-[500] text-[#C7C7C7]">Order ID: <span>E2P-2453019273001180 </span></p>
                </div>
               
                <div className=" flex items-center justify-center w-[74px] gap-[4px]  p-[2px_10px] h-[24px] bg-[#3A3A3A] rounded-[16px]">
                    <Image src={Timer} alt="time"/>
                   <p className="text-[14px] font-[500] text-[#DBDBDB]">28.46</p>
                </div>
              </div>

              <div className=" flex flex-col  mt-[20px] ">
                <p className="text-[16px] font-[400] text-[#DBDBDB]">Open chat to get payment details and pay the seller. Once done, mark as paid   <br />to continue.</p>
                <button className="w-[562px] h-[48px] flex items-center justify-center gap-[8px] bg-[#2D2D2D] p-[12px_20px] border border-none rounded-full">
                     <Image src={Ochat} alt="chat"/>
                     <p className="text-[14px] font-[700] text-[#FFFFFF]">Open Chat</p>
                     <Image src={GreatT} alt="arrow"/>
                </button>
              </div>

              <div className="mt-[20px]">
                <p className="text-[14px] font-[700] text-[#FFFFFF]">Trade Summary</p>

                 <div className="flex flex-col  gap-[2px]"> 
                <div className="w-[562px] h-[38px] flex items-center  rounded-t-[12px] justify-between bg-[#2D2D2D] p-[8px_12px]">
                      <p className="text-[14px] font-[500] text-[#DBDBDB]">Buying</p>

                      <div className="w-[62px] h-[22px] gap-[8px] flex items-center p-[2px_8px] rounded-[16px] bg-[#3A3A3A]">
                            <Image
                                src={BTC}
                                alt="btc"
                                className="w-[16px] h-[16px]"
                              />
                              <p className="text-[12px] font-[500] text-[#DBDBDB]">BTC</p>
                      </div>
                       
                </div>

                <div className="w-[562px] h-[40px] flex items-center   justify-between bg-[#2D2D2D] p-[8px_12px]">
                      <p className="text-[14px] font-[500] text-[#DBDBDB]">Fiat Amount</p>

                      <p className="text-[16px] font-[500] text-[#33A2FF]">$200.00 USD</p>
                       
                </div>

                <div className="w-[562px] h-[44px] flex items-center   justify-between bg-[#2D2D2D] p-[8px_12px]">
                      <p className="text-[14px] font-[500] text-[#DBDBDB]">Seller</p>

                      <div className="w-[133px] h-[28px] gap-[8px] flex items-center justify-center p-[8px_10px] rounded-full bg-[#3A3A3A]">
                            <p className="text-[14px] font-[700] text-[#FFFFFF]">@CryptoBos</p>
                              <Image src={GreatT} alt="arrow"/>
                      </div>
                       
                </div>

                  <div className="w-[562px] h-[36px] flex items-center   justify-between bg-[#2D2D2D] p-[8px_12px]">
                      <p className="text-[14px] font-[500] text-[#DBDBDB]">Price per 1 BTC</p>

                      <p className="text-[14px] font-[500] text-[#FFFFFF]">1 BTC = $48,000</p>
                       
                </div>

                  <div className="w-[562px] h-[40px] flex items-center   justify-between bg-[#2D2D2D] p-[8px_12px]">
                      <p className="text-[14px] font-[500] text-[#DBDBDB]">Quantity</p>

                      <p className="text-[16px] font-[500] text-[#4DF2BE]">0.00417 BTC</p>
                       
                </div>

                  <div className="w-[562px] h-[36px] flex items-center  border-l-[1px] border-l-solid border-[#FFFA66]  justify-between bg-[#2D2D2D] p-[8px_12px]">
                      <p className="text-[14px] font-[500] text-[#DBDBDB]">Payment Method</p>

                      <p className="text-[14px] font-[500] text-[#FFFFFF]">Bank Transfers</p>
                       
                </div>

                  <div className="w-[562px] h-[38px] flex items-center rounded-b-[12px]  justify-between bg-[#2D2D2D] p-[8px_12px]">
                      <p className="text-[14px] font-[500] text-[#DBDBDB]">Status</p>

                   <div className="flex items-center justify-center w-[77px] h-[22px] rounded-[16px] bg-[#352E21] p-[2px_8px] gap-[4px]">
                    <Image src={Yellow_i} alt="icon"/>
                    <p className="text-[12px] font-[500px] text-[#FFC051]">Pending</p>
                    </div>                       
                </div>

              </div>

                
              </div>

              <div
              className="w-[562px] h-[124px] bg-[#2D2D2D] mt-[20px] rounded-[12px] p-[12px_16px]"
            >
              <div>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setIsHelpOpen(!isHelpOpen)}
                >
                  <p className="text-[14px] font-[700] text-[#FFFFFF]">
                    {" "}
                    Helpful Tips{" "}
                  </p>
                  <Image
                    src={UPa}
                    alt="up"
                    className={`transition-transform duration-300 ${
                      isHelpOpen ? "rotate-180" : "rotate-0"
                    }`}
                  />
                </div>

                {isHelpOpen && (
                  <ul className="text-[#DBDBDB] text-[14px] space-y-[5px] font-[500]">
                    <li>Only pay from your personal account.</li>
                    <li>Don’t write “Bitcoin,” “Crypto,” or “Evolve2p” in your transfer note.</li>
                    <li>Complete the transfer before the timer ends.</li>
                  </ul>
                )}
              </div>
            </div>

            <div
                          className="w-[562px] h-[124px] bg-[#2D2D2D] mt-[20px] rounded-[12px] p-[12px_16px]"
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
            

               <div className="flex items-center justify-center gap-[8px] mt-[20px]">
                <Image src={Book} alt="book" />
                <p className="text-[14px] text-[#4DF2BE] font-[700]">Read our guide for buying crypto</p>
               </div>
           </div>


           {/* right_div*/}
           <div className="flex flex-col items-center">
              <div className="flex flex-col mt-[-200px] w-[394px] h-[700px]  bg-[#1A1A1A] rounded-[12px_12px_0_0]">
                   
                   <div className="flex items-center justify-between p-[24px_20px_12px_20px]">
                                <div
                                  className="flex items-center  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full p-[3px_2px]"
                                 
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

                                  <div>
                                  <p>
                                    <Image
                                      src={Arrow_great}
                                      alt="greater"
                                      className="ml-[10px] w-[24px] h-[24px]"
                                    />
                                  </p>
                            
                                 </div>
                                  </div>

                                  <div className="w-[394px] h-[1px] bg-[#3A3A3A]">

                                  </div>
                       <div className="flex flex-col p-[24px_20px] ">
                        <div className="flex items-center   justify-between">
                             <div className="flex items-center justify-center w-[79px] h-[24px] p-[2px_10px] gap-[4px] bg-[#1B362B] rounded-[16px]">
                                  <Image src={Gtime} alt="gtime"/>    
                                  <p className="text-[14px] font-[500] text-[#1ECB84]">Active</p>
                             </div>

                             <div className=" flex items-center justify-center w-[74px] h-[24px] p-[2px_10px] gap-[4px] bg-[#3A3A3A] rounded-[16px]">
                                    <Image src={Timer} alt="time"/>
                                    <p className="text-[14px] font-[500] text-[#DBDBDB]">28.46</p>
                             </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex flex-col mt-[10px]">
                                <p className="text-[12px] font-[500] text-[#DBDBDB]">FIAT AMOUNT</p>
                                <p className="text-[16px] font-[500] mt-[-10px] text-[#FFFFFF]">200.00 USD</p>
                            </div>

                           
                                <button className="w-[94px] h-[48px] p-[12px_20px] bg-[#4DF2BE] justify-center gap-[8px] rounded-full border border-[1px] border-[#4DF2BE]">
                                    Paid
                                
                            </button>

                            
                        </div>
                        <div className="w-[360px] h-[1px] bg-[#3A3A3A] ">

                                  </div>


                                  <div className="flex items-center gap-[8px] mt-[30px]">
                                    <div className="w-[137px] h-[1px] bg-[#3A3A3A]">

                                    </div>

                                    <p className="text-[16px] font-[500] text-[#DBDBDB]">Today</p>


                                    <div className="w-[137px] h-[1px] bg-[#3A3A3A]">

                                    </div>
                                  </div>

                                     <div className="flex flex-col  w-[311px]">
                                  <div className="flex items-center  justify-between">
                                    <div className=" text-[14px] font-[500] text-[#4DF2BE]">
                                        Service message
                                    </div>

                                    <p className="text-[12px] font-[500] text-[#C7C7C7]">05:33 AM</p>


                        
                                  </div>

                                  <div className="  bg-[#2D2D2D]  rounded-[8px_0px_8px_8px] gap-[8px] p-[10px_14px] border-[1px] border-[#4DF2BE]">
                                    <p className="text-[16px] font-[400] text-[#FFFFFF]">You're buying 0.00417 BTC (200.39 USD) for 200.00 USD via Bank Transfer. 
                                        The BTC is no in escrow and it's safe to make your payment. </p>

                                        <ol className="p-[10px_14px] text-[16px] font-[400] text-[#FFFFFF]">
                                            <li>
                                                When the seller is ready to start the transaction, they 'll share their bank account details in the trade chat.
                                            </li>
                                            <li>
                                                make your payment.
                                            </li>
                                            <li>
                                                mark the trade as paid and upload proof of payment.
                                            </li>
                                            <li>
                                                Wait for your trade partner to confirm your payment.
                                            </li>
                                            <li>
                                                Your trade partner will release the BTC to you.
                                            </li>
                                        </ol>
                                  </div>
                                  </div>
                        </div>
              </div>

               <div className="flex items-center relative justify-center w-[375px] h-[68px] gap-[8px]   mt-[15px]">
                  <input  className="w-[299px] h-[40px] bg-[#222222] border-none p-[8px_8px_8px_16px] text-[14px] font-[400] text-[#C7C7C7] rounded-[8px] "
                  placeholder="Type a message..."
                  />
                     
                     <div className="flex items-center justify-center ml-[60%] w-[20px] justify-end absolute">
                        <Image src={Mink} alt="mink"/>
                     </div>

                <div className="flex items-center justify-center w-[40px] h-[40px] bg-[#4DF2BE] p-[5px] rounded-[8px] ">
                    <Image src={Message} alt="message" />
                </div>
                 </div>

           </div>

         
         </div>
          

          <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] mt-[30%] ">
                  <Footer />
                </div>
      
      </div>
      
    </main>
  );
}


export default PRC_Buy;