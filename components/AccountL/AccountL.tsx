'use client';
import Nav from "../NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Image from "next/image"; 
import Aup from "../../public/Assets/Evolve2p_upA/Makretplace/elements.svg";
import checklistActive from "../../public/Assets/Evolve2p_checklist2/checklist-active.svg";
import checklistinActive from "../../public/Assets/Evolve2p_checklist2/checklist-inactive.svg";
import Redx from "../../public/Assets/Evolve2p_redx/Profile/elements.svg";
import Arrow_great from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Arrow_d from "../../public/Assets/Evolve2p_arrowd/arrow-down-01.png";
import Footer from "../../components/Footer/Footer";



import React from 'react';



const AccountL: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
          <div className="max-w-7xl mx-auto">
            
            <Nav />
            
                   <div className="flex  items-center mt-[20px]  mr-[40px] ">
                    <div className="mt-[-90%]">
                       <Settings />
                     </div>
         
                    


                          {/* Right side */} 
                          
          <div className="w-[809px]  mt-[20px]   bg-[#1A1A1A] gap-[20px] p-[24px_64px]">
      <h1 className="text-[24px] font-[700] text-[#FFFFFF] mb-6">Account Level</h1>
 
 
      <div className="w-[681px]  bg-[#0F1012] space-y-6 p-[16px_0_40px_0] ">
       
          <div className=" h-[120px] p-[24px_20px_8px_20px]">
            <p className="text-[24px] font-[700] text-[#FFFFFF]">Upgrade Account</p>
            <p className="text-[16px] font-[400] text-[#C7C7C7]">Complete these verification steps to secure your account and unlock full platform features.</p>
          </div>

    <div className=" w-[641px] p-[12px_12px_20px_12px] ">
          <div className="  bg-[#1A1A1A] rounded-[12px] p-[12px]">
              <div className="flex items-center justify-between h-[56px]  p-[12px]">
                 <div className="flex items-center gap-[10px]">
                    <p className="text-[16px] font-[700] text-[#FFFFFF]">Tier 1</p>

                    <div className=" flex items-center justify-center w-[67px] h-[24px] bg-[#392D46] p-[2px_10px] text-[14px] text-[#CCA0FA]  font-[500] rounded-[16px]">
                               Current
                    </div>
                 </div>
                 <p className="flex items-center p-[6.4px] w-[32px] h-[32px] ">
                 <Image src={Aup} alt="aup" className="w-[11.25px] h-[6.25px]"/>
                 </p>
              </div>

               <div className=" p-[12px_12px_20px_12px] ">
            <p className="text-[#FFFFFF]">Verifications</p>
            
            
            <div className="flex items-center h-[52px] bg-[#2D2D2D] p-[12px] border-b-[1px] border-[#1A1A1A] rounded-t-[8px]">
                <div className="flex items-center gap-[10px]">
                    <Image src={checklistActive} alt="checkactive"/>
                    <p className="text-[14px] font-[700] text-[#FFFFFF]">Email Verification</p>
                </div>
          </div>

            <div className="flex items-center justify-between border-b-[1px] border-[#1A1A1A] h-[52px] bg-[#2D2D2D] p-[12px] ">
                <div className="flex items-center gap-[10px]">
                    <Image src={Redx} alt="redx"/>
                    <p className="text-[14px] font-[700] text-[#FFFFFF]">Phone Verification</p>
                </div>
                <div className=" flex items-center w-[24px] h-[24px]">
                <Image src={Arrow_great} alt="arrowg" className="w-[14px] h-[14px]"/>
                </div>
          </div>

            <div className="flex items-center justify-between  h-[52px] bg-[#2D2D2D] p-[12px] ">
                <div className="flex items-center gap-[10px]">
                    <Image src={Redx} alt="redx"/>
                    <p className="text-[14px] font-[700] text-[#FFFFFF]">ID Verification</p>
                </div>
                <div className=" flex items-center w-[24px] h-[24px]">
                <Image src={Arrow_great} alt="arrowg" className="w-[14px] h-[14px]"/>
                </div>
          </div>
           <div className="flex flex-col text-[14px] font-[500]  mt-[10px]">
           <p className="text-[14px] font-[500] text-[#C7C7C7]">Unlocked Features</p>
             
             <div className="flex items-center gap-[10px]">
                <Image src={checklistinActive} alt="checkinactive"/>
               <p className="text-[#DBDBDB] ">Wallet Address (Receive crypto externally)</p> 
             </div>

             <div className="flex items-center gap-[10px]">
                <Image src={checklistinActive} alt="checkinactive"/>
               <p className="text-[#DBDBDB] ">Buy and Sell up to $10,000 USD</p> 
             </div>
             
             <div className="flex items-center gap-[10px]">
                <Image src={checklistinActive} alt="checkinactive"/>
               <p className="text-[#DBDBDB]">Convert one crypto to another (Swap)</p> 
             </div>

           <div className="flex items-center gap-[10px]">
            <Image src={checklistinActive} alt="checkinactive"/>
              <p className="text-[#DBDBDB]">Send and Trade any supported crypto</p> 
            </div>         

           </div>
            
           
          </div>
          </div>
          
         <div className=" mt-[10px] h-[1px] bg-[#3A3A3A]">

         </div>
          </div>



          {/* Tier 2 */}
    <div className=" w-[641px] p-[12px_12px_20px_12px] ">
          <div className="  bg-[#1A1A1A] rounded-[12px] p-[12px]">
              <div className="flex items-center justify-between h-[56px]  p-[12px]">
                 <div className="flex items-center gap-[10px]">
                    <p className="text-[16px] font-[700] text-[#FFFFFF]">Tier 2</p>

                    <div className=" flex items-center justify-center w-[65px] h-[24px] bg-[#3A3A3A] p-[2px_10px] text-[14px] text-[#DBDBDB]  font-[500] rounded-[16px]">
                               Upgrade
                    </div>
                 </div>
                 <p className="flex items-center p-[6.4px] w-[32px] h-[32px] ">
                 <Image src={Arrow_d} alt="arrowd" className="w-[20px] h-[20px]"/>
                 </p>
              </div>

               <div className=" p-[12px_12px_20px_12px] ">
            <p className="text-[#FFFFFF]">Verifications</p>
            
            
            <div className="flex items-center justify-between  h-[52px] bg-[#2D2D2D] p-[12px] ">
                <div className="flex items-center gap-[10px]">
                    <Image src={Redx} alt="redx"/>
                    <div className="flex flex-col ">
                    <p className="text-[14px] font-[700] text-[#FFFFFF]">Address Verification</p>
                    <p className="text-[12px] mt-[-10px] font-[500] text-[#DBDBDB]">Utility bill, bank statement, or other proof of residence</p>
                </div>
                </div>
                <div className=" flex items-center w-[24px] h-[24px]">
                <Image src={Arrow_great} alt="arrowg" className="w-[14px] h-[14px]"/>
                </div>
          </div>

          

          
           <div className="flex flex-col text-[14px] font-[500]  mt-[10px]">
           <p className="text-[14px] font-[500] text-[#C7C7C7]">Unlocked Features</p>
             
             <div className="flex items-center gap-[10px]">
                <Image src={checklistinActive} alt="checkinactive"/>
               <p className="text-[#DBDBDB] ">Sell up to $50,000 USD per trade</p> 
             </div>

             <div className="flex items-center gap-[10px]">
                <Image src={checklistinActive} alt="checkinactive"/>
               <p className="text-[#DBDBDB] ">Unlimited total trades and crypto sends</p> 
             </div>
             
             <div className="flex items-center gap-[10px]">
                <Image src={checklistinActive} alt="checkinactive"/>
               <p className="text-[#DBDBDB]">Suitable for power users, vendors, and large traders</p> 
             </div>

           <div className="flex items-center gap-[10px]">
            <Image src={checklistinActive} alt="checkinactive"/>
              <p className="text-[#DBDBDB]">Recommended if you frequently sell large volumes.</p> 
            </div>         

           </div>
            
           
          </div>
          </div>
           <div className=" mt-[10px] h-[1px] bg-[#3A3A3A]">

         </div>
          </div>

          {/* Tier 3 */}
    <div className=" w-[641px] p-[12px_12px_20px_12px] ">
          <div className="  bg-[#1A1A1A] rounded-[12px] p-[12px]">
              <div className="flex items-center justify-between h-[56px]  p-[12px]">
                 <div className="flex items-center gap-[10px]">
                    <p className="text-[16px] font-[700] text-[#FFFFFF]">Tier 3</p>

                    <div className=" flex items-center justify-center w-[101px] h-[24px] bg-[#23303C] p-[2px_10px] text-[14px] text-[#66B9FF]  font-[500] rounded-[16px]">
                               Coming soon
                    </div>
                 </div>
                 <p className="flex items-center p-[6.4px] w-[32px] h-[32px] ">
                 <Image src={Arrow_d} alt="arrowd" className="w-[20px] h-[20px]"/>
                 </p>
              </div>

               <div className=" p-[12px_12px_20px_12px] ">
            <p className="text-[#FFFFFF]">Verifications</p>
            
            
            <div className="flex items-center justify-between  h-[52px] bg-[#2D2D2D] p-[12px] ">
                <div className="flex items-center gap-[10px]">
                    <Image src={Redx} alt="redx"/>
                    <div className="flex flex-col ">
                    <p className="text-[14px] font-[700] text-[#FFFFFF]">Video Verification</p>
                    <p className="text-[12px] mt-[-10px] font-[500] text-[#DBDBDB]">Live face verification call with agent)</p>
                </div>
                </div>
                <div className=" flex items-center w-[24px] h-[24px]">
                <Image src={Arrow_great} alt="arrowg" className="w-[14px] h-[14px]"/>
                </div>
          </div>

          

          
           <div className="flex flex-col text-[14px] font-[500]  mt-[10px]">
           <p className="text-[14px] font-[500] text-[#C7C7C7]">Unlocked Features</p>
             
             <div className="flex items-center gap-[10px]">
                <Image src={checklistinActive} alt="checkinactive"/>
               <p className="text-[#DBDBDB] ">All features from Tier 1 & 2</p> 
             </div>

             <div className="flex items-center gap-[10px]">
                <Image src={checklistinActive} alt="checkinactive"/>
               <p className="text-[#DBDBDB] ">Higher trade limits (based on region/user type)</p> 
             </div>
             
             <div className="flex items-center gap-[10px]">
                <Image src={checklistinActive} alt="checkinactive"/>
               <p className="text-[#DBDBDB]">Enhanced fraud protection</p> 
             </div>

           <div className="flex items-center gap-[10px]">
            <Image src={checklistinActive} alt="checkinactive"/>
              <p className="text-[#DBDBDB]">Priority Support Access (Optional)</p> 
            </div>         

           </div>
            
           
          </div>
          </div>
          
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
};

export default AccountL;
