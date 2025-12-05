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
        <main className="min-h-screen bg-[#0F1012] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
                <Nav />
                
                <div className="flex flex-col lg:flex-row gap-6 mt-6">
                    {/* Settings Sidebar */}
                    <div className="lg:w-[300px]">
                        <Settings />
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-[#1A1A1A] rounded-xl p-4 lg:p-8">
                        <p className="text-xl lg:text-2xl font-bold text-white mb-8">
                            Two Factor Authentication
                        </p>

                        <div className="flex flex-col items-center justify-center mt-8 lg:mt-24">
                            {/* Icon Container */}
                            <div className="flex items-center justify-center w-32 h-32 lg:w-36 lg:h-36 bg-[#222222] rounded-full border-2 border-[#222] mb-8">
                                <Image 
                                    src={TFa} 
                                    alt="2FA security icon" 
                                    className="w-16 h-16 lg:w-20 lg:h-20"
                                />
                            </div>
                         
                            {/* Content */}
                            <div className="flex flex-col items-center justify-center text-center max-w-2xl">
                                <p className="text-xl lg:text-2xl font-bold text-white mb-4">
                                    Security beyond passwords
                                </p>
                                <p className="text-sm lg:text-base font-normal text-[#C7C7C7] mb-8 leading-relaxed">
                                    Get an extra layer of protection to your account when logging in and performing transactions.
                                </p>

                                <button 
                                    onClick={() => {router.push("/tfa/setuptwofa")}}
                                    className="w-full max-w-xs lg:max-w-sm h-12 bg-[#4DF2BE] rounded-full border border-[#4DF2BE] text-sm lg:text-base font-bold text-[#0F1012] hover:bg-[#3fe0ad] transition-colors duration-200"
                                >
                                    Set up now
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] whitespace-nowrap mt-[10%] ">
                  <Footer />
                </div>
            </div>
        </main>              
    )
}

export default TwoFa