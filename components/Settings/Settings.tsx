import React, {useState} from 'react'
import Image from "next/image";
import E2p_logo from "../../public/Assets/Evolve2p_E2p/Profile/Logo.svg";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import Lg_arrow from "../../public/Assets/Evolve2p_Lgarrow/Profile/arrow-right-01.svg";
import G_AccountL from "../../public/Assets/Evolve2p_G_AccountL/Profile/user-check-01.svg";
import Arrow_great from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Gbell from "../../public/Assets/Evolve2p_Gbell/Profile/elements.svg";
import Gclock from "../../public/Assets/Evolve2p_Gclock/Profile/elements.svg";
import Changep from "../../public/Assets/Evolve2p_changeP/Profile/elements.svg";
import Glocked from "../../public/Assets/Evolve2p_Glocked/Profile/locked.svg";
import Gpin from "../../public/Assets/Evolve2p_Gpin/Profile/pin-code.svg";
import Ghead from "../../public/Assets/Evolve2p_Ghead/Profile/elements.svg";
import Logout from "../../public/Assets/Evolve2p_logouticon/elements.svg";
import Switch from "../../public/Assets/Evolve2p_switch/Profile/elements.svg";


const Settings = () => {

    const [showLogoutModal, setShowLogoutModal] = useState(false);

  return (
    <div>
                {/* Left side */}
                <div className="w-[395px]  bg-[#222222] border-r-[2px] border-r-[#3A3A3A]">
                  <div className="p-[12px_20px]">
                    <p className="  text-[24px] font-[700] text-[#FFFFFF]"> Settings </p>
                  </div>
                  <div className="w-[355px] p-[12px_20px] ">
                    <div className=" flex items-center gap-[15px] h-[62px] p-[12px] bg-[#20342E] rounded-[8px] ">
                      <Image src={E2p_logo} alt="e2p" sizes="28" />
      
                      <div className="flex items-center gap-[160px]  ">
                        <div className="flex flex-col items-center">
                          <div className="flex items-center ">
                            <p className="text-[14px] font-[500] text-[#4DF2BE]">@femoskeydev</p>
                            <Image
                              src={Mark_green}
                              alt="mark"
                              className="ml-[10px] w-[12px] h-[12px]"
                            />
                          </div>
                          <p className="text-[12px] mt-[-10px] font-[500] text-[#4DF2BE]">
                            Your unique Identity
                          </p>
                        </div>
      
                        <Image src={Lg_arrow} alt="lgarrow" />
                      </div>
                    </div>
      
                    <div className="mt-[50px]">
                      <p className="text-[12px] font-[500] text-[#C7C7C7]">ACCOUNT</p>
                      <div className="w-[355px] ">
                        <div className=" h-[45px] bg-[#2D2D2D] border-b-[1px] border-b-[#3A3A3A] rounded-t-[8px] p-[8px_12px]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-[20px]">
                              <Image src={G_AccountL} alt="account" />
                              <p className="text-[14px] font-[500] text-[#DBDBDB]">Account Level</p>
                            </div>
      
                            <div className="flex items-center gap-[10px]">
                              <div className="flex items-center w-[43px] h-[22px] p-[2px_8px] bg-[#3A3A3A] rounded-[16px]">
                                <p className="text-[12px] font-[500] text-[#DBDBDB]">Tier 1</p>
                              </div>
                              <Image src={Arrow_great} alt="great" />
                            </div>
                          </div>
                        </div>
      
                        <div className=" flex items-center justify-between h-[45px] bg-[#2D2D2D] border-b-[1px] border-b-[#3A3A3A]   p-[8px_12px]">
                          <div className="flex items-center gap-[20px]">
                            <Image src={Gbell} alt="gbell" />
                            <p className="text-[14px] font-[500] text-[#DBDBDB] ">Notification</p>
                          </div>
                          <div>
                            <Image src={Arrow_great} alt="great" />
                          </div>
                        </div>
      
                        <div className=" flex items-center justify-between h-[45px] bg-[#2D2D2D] border-b-[1px] border-b-[#3A3A3A]   p-[8px_12px]">
                          <div className="flex items-center gap-[20px]">
                            <Image src={Gclock} alt="gbell" />
                            <p className="text-[14px] font-[500] text-[#DBDBDB] ">Transaction Limits</p>
                          </div>
                          <div>
                            <Image src={Arrow_great} alt="great" />
                          </div>
                        </div>
                      </div>
                    </div>
      
                    <div className="mt-[20px]">
                      <p className="text-[12px] font-[500] text-[#C7C7C7]">SECURITY </p>
                      <div className="w-[355px] ">
                        <div className=" h-[45px] bg-[#2D2D2D] border-b-[1px] border-b-[#3A3A3A] rounded-t-[8px] p-[8px_12px]">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-[20px]">
                              <Image src={Changep} alt="changep" />
                              <p className="text-[14px] font-[500] text-[#DBDBDB]">Change Password</p>
                            </div>
      
                            <div>
                              <Image src={Arrow_great} alt="great" />
                            </div>
                          </div>
                        </div>
      
                        <div className=" flex items-center justify-between h-[45px] bg-[#2D2D2D] border-b-[1px] border-b-[#3A3A3A]   p-[8px_12px]">
                          <div className="flex items-center gap-[20px]">
                            <Image src={Glocked} alt="glocked" />
                            <p className="text-[14px] font-[500] text-[#DBDBDB] ">
                              Two Factor Authentication
                            </p>
                          </div>
                          <div>
                            <Image src={Arrow_great} alt="great" />
                          </div>
                        </div>
      
                        <div className=" flex items-center justify-between h-[45px] bg-[#2D2D2D] border-b-[1px] border-b-[#3A3A3A]   p-[8px_12px]">
                          <div className="flex items-center gap-[20px]">
                            <Image src={Gpin} alt="gbell" />
                            <p className="text-[14px] font-[500] text-[#DBDBDB] ">
                              Change your Security PIN
                            </p>
                          </div>
                          <div>
                            <Image src={Arrow_great} alt="great" />
                          </div>
                        </div>
                      </div>
                    </div>
      
                    <div className="mt-[20px]">
                      <p className="text-[12px] font-[500] text-[#C7C7C7]">OTHERS </p>
      
                      <div className=" flex items-center justify-between h-[45px] bg-[#2D2D2D]  rounded-[8px]   p-[8px_12px]">
                        <div className="flex items-center gap-[20px]">
                          <Image src={Ghead} alt="ghead" />
                          <p className="text-[14px] font-[500] text-[#DBDBDB] ">Talk to support</p>
                        </div>
                        <div>
                          <Image src={Arrow_great} alt="great" />
                        </div>
                      </div>
                      <div className=" flex items-center mt-[20px] justify-between h-[62px] bg-[#2D2D2D]  rounded-[8px]   p-[8px_12px]">
                        <div className="flex items-center gap-[20px]">
                          <Image src={Logout} alt="logout" />
                          <div className=" ">
                            <p onClick={() => setShowLogoutModal(true)} className="text-[14px] cursor-pointer font-[500] text-[#FE857D] "> Logout</p>
                            <p className="text-[12px] font-[500] mt-[-10px] text-[#DBDBDB]">
                              {" "}
                              Version1.0
                            </p>
                          </div>
                        </div>
      
                           {/* Modal */}
            {showLogoutModal && (
              <div className="fixed inset-0 top-[150px] ml-[40%] flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-[#0F1012] rounded-[16px] w-[420px] h-[450px] text-center text-white shadow-lg">
                  {/* Power icon */}
                  <div className="flex items-center  h-[108px] justify-center   p-[ 36px_126px_16px_126px] ">
                   <Image src={Switch} alt="switch" className="p-[2.334px_4.667px_2.333px_4.667px] w-[56px] h-[56px] "/>
                  </div>
      
                  <div className="flex flex-col items-center   h-[152px] p-[24px_20px]">
      
                  <h2 className="text-[20px] font-[700] text-[#FFFFFF]">
                    Are you sure you want to log out?
                  </h2>
                  <p className="text-[#C7C7C7] text-[16px] font-[400] ">
                    You are about to log out of your account. Make sure you’ve saved
                    any important information before proceeding.
                  </p>
                  </div>
      
                  <div className="h-[148px] space-y-[10px] p-[8px_0_32px_0]">
                  <button
                    onClick={() => {
                      
                      setShowLogoutModal(false);
                    }}
                    className="w-[380px] h-[48px] bg-[#FE857D] text-[14px]  p-[12px_20px] border-[1px] border-[#FE857D] rounded-full text-[#0F1012] font-[700] mb-3"
                  >
                    Log out
                  </button>
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="w-[380px] h-[48px] bg-[#2D2D2D] text-[#FFFFFF] p-[12px_20px] border-none rounded-full text-[14px] font-[700]"
                  >
                    Cancel
                  </button>
                  </div>
                </div>
              </div>
            )}
      
                        <div>
                          <Image src={Arrow_great} alt="great" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
    </div>
  )
}

export default Settings
