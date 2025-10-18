'use client';
import React from 'react'
import Nav from "../NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Image from "next/image"; 
import TFa from "../../public/Assets/Evolve2p_2Fa/Profile/elements.svg"
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation"


const TwoFa: React.FC = () => {

    const router = useRouter()
  return (
   <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
          <div className="max-w-7xl mx-auto">
            
            <Nav />
            
                   <div className="flex  items-center mt-[20px]  mr-[40px] ">
                    
                       <Settings />



                         {/* Right */}
                <div className="w-[809px]  h-[865px] bg-[#1A1A1A]   gap-[20px] p-[24px_64px]">

                    <p className="text-[24px] font-[700] text-[#FFFFFF]">Two Factor Authentication</p>


                    <div className="flex flex-col items-center justify-center mt-[150px]">
                      
                      <div className="flex items-center justify-center w-[137.693px] h-[137.693px] bg-[#222222] rounded-[68.846px] border-[2px] border-[#222]">
                        <Image src={TFa} alt="2fa"/>
                        
                        </div>
                     

                     <div className="flex flex-col items-center justify-center">
                     <p className="text-[#FFFFFF] text-[24px] font-[700]">Security beyond passwords </p>
                      <p className="text-[16px] mt-[-10px] font-[400] text-[#C7C7C7]">Get an extra layer of protection to your account <br/>
                        when logging in and performing transactions.</p>

                        <button 
                        onClick={() => {router.push("/tfa/setuptwofa")}}
                        className="flex item-center justify-center mt-[20px] w-[335px] h-[48px] bg-[#4DF2BE] p-[12px_20px] rounded-full border-[1px] text-[14px] font-[700] text-[#0F1012] border-[#4DF2BE] ">

                          Set up now
                            </button>
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

  )
}

export default TwoFa
