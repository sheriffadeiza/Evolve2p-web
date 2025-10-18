"use client";
import React from "react";
import Nav from "../NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Image from "next/image";
import ShieldKey from "../../public/Assets/Evolve2p_Secapp/Profile/elements.svg";
import Arrow_great from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Sms from "../../public/Assets/Evolve2p_sms/Profile/elements.svg";
import Footer from "../../components/Footer/Footer";

const SetupTwoFA: React.FC = () => {
  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex items-start mt-[20px] mr-[40px]">
          {/* Left Sidebar */}
          <Settings />

          {/* Right Content */}
          <div className="w-[809px] h-[865px] bg-[#1A1A1A] p-[24px_64px] rounded-[10px]">
            <p className="text-[24px] font-[700] text-[#FFFFFF] mb-[10px]">
              Two Factor Authentication
            </p>

            <div className="flex flex-col p-[24px_20px]">
              <p className="text-[20px]  font-[700] text-[#FFFFFF] mb-[40px]">
                Choose Your 2FA Method
              </p>

              <p className="text-[16px] mt-[-30px] text-[#C7C7C7] font-[400]">
                Select how you want to receive your verification codes.
              </p>
            </div>

            <div className="space-y-[20px] p-[0px_20px]">
              {/* Option 1 */}
              <div className="flex justify-between w-[641px] h-[64px] p-[12px] items-center bg-[#222222] p-[20px] rounded-[8px] cursor-pointer hover:bg-[#2E2E2E] transition">
                <div className="flex items-center gap-[16px]">
                  <Image src={ShieldKey} alt="icon" width={16} height={16} />
                  <div className="flex flex-col ">
                    <div className="flex items-center gap-[10px]">
                      <p className="text-[16px] font-[600] text-[#FFFFFF]">
                        Security App
                      </p>
                      <div className="flex items-center justify-center w-[98px] h-[22px] bg-[#23303C] rounded-[16px] p-[2px_8px]">
                        <p className="text-[#66B9FF] font-[500] text-[12px]">
                          Recommended
                        </p>
                      </div>
                    </div>

                    <p className="text-[12px] mt-[-5px] font-[500] text-[#DBDBDB]">
                      Use an authenticator app like Authy or Google
                      Authenticator.
                    </p>
                  </div>
                </div>
                <Image src={Arrow_great} alt="arrowgreat" />
              </div>

              {/* Option 2 */}
              <div className="flex justify-between w-[641px] h-[64px] p-[12px] items-center bg-[#222222] p-[20px] rounded-[8px] cursor-pointer hover:bg-[#2E2E2E] transition">
                <div className="flex items-center gap-[16px]">
                  <Image src={Sms} alt="icon" width={16} height={16} />
                  <div className="flex flex-col ">
                    <p className="text-[16px] font-[600] text-[#FFFFFF]">
                      SMS Authentication{" "}
                    </p>

                    <p className="text-[12px] mt-[-5px] font-[500] text-[#DBDBDB]">
                     Receive codes via text message.
                    </p>
                  </div>
                </div>
                <Image src={Arrow_great} alt="arrowgreat" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>

        {/* Footer */}
        <div className="mb-[80px] mt-[30%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default SetupTwoFA;
