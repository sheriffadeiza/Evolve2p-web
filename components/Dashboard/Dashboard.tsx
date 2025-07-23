"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Nav from "../../components/NAV/Nav";
import Parrow from "../../public/Assets/Evolve2p_pArrow/elements.svg";
import icon_i from "../../public/Assets/Evolve2p_i/Dashboard/elements.svg";
import SlashH from "../../public/Assets/Evolve2p_viewslash/view-off-slash.png";
import Send from "../../public/Assets/Evolve2p_send/Dashboard/elements.svg";
import Barrow from "../../public/Assets/Evolve2p_Barrow/arrow-down-01.svg";
import Rarrowd from "../../public/Assets/Evolve2p_Rarrowd/arrow-down-right-01.svg";
import Swap from "../../public/Assets/Evolve2p_Swap/elements.svg";
import R_arrow from "../../public/Assets/Evolve2p_R/arrow-right-02.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import Eclipse from "../../public/Assets/Evolve2p_eclpise9/Ellipse 9.svg";
import Buy from "../../public/Assets/Evolve2p_Buy/elements.svg";
import Larrow from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Sell from "../../public/Assets/Evolve2p_Sell/elements.svg";
import Offer from "../../public/Assets/Evolve2p_Offer/elements.svg";
import Limit from "../../public/Assets/Evolve2p_Limit/elements.svg";
import Set from "../../public/Assets/Evolve2p_Set/elements.svg";
import Refer from "../../public/Assets/Evolve2p_Refer/elements.svg";
import G19 from "../../public/Assets/Evolve2p_group19/Group 19.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import checklistInactive from "../../public/Assets/Evolve2p_checklist2/checklist-inactive.svg";
import { QRCodeCanvas } from "qrcode.react";
import Yellow_i from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import Copy from "../../public/Assets/Evolve2p_code/elements.svg";
import Share from "../../public/Assets/Evolve2p_share/elements.svg";
import Footer from "../Footer/Footer";

interface QRCodeBoxProps {
  value?: string;
}

interface wallet {
  id: string;
}

const Dashboard: React.FC<QRCodeBoxProps> = ({ value }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showHowModal, setShowHowModal] = useState(false);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [myDate, setMyDate] = useState("");
  const [clientUser, setClientUser] = useState<any>(null);
  const [currentWallet, setCurrentWallet] = useState<wallet | null>(null);
  const [currentCoin, setCurrentCoin] = useState("");

  const handleVerifyClick = () => {
    router.push("/Signups/KYC");
  };

  const toggleVerifyModal = () => setShowVerifyModal(!showVerifyModal);
  const toggleHowModal = () => setShowHowModal(!showHowModal);
  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };
  const toggleReceiveDropdown = () => {
    setIsReceiveOpen((prev) => !prev);
  };

  const handleReceiveClick = (symbol: string) => {
    setCurrentCoin(symbol);
    setShowReceiveModal(true);
    setIsReceiveOpen(false);
  };

  const closeReceiveModal = () => setShowReceiveModal(false);
  let user: any = null;

  if (typeof window !== "undefined") {
    const stored = localStorage.getItem("UserData");
    if (stored) {
      user = JSON.parse(stored);
    }
    console.log(user);
  }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!user) {
          setError("Please login first");
          setTimeout(() => router.push("/Logins/login"), 1500);
          return;
        }

        setTimeout(() => setLoading(false), 1000);
      } catch (e) {
        console.error("Error accessing localStorage:", e);
        setError("Unable to access authentication data. Please try again.");
        setTimeout(() => router.push("/Logins/login"), 2000);
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    setClientUser(user);
  }, []);

  useEffect(() => {
    if (currentCoin !== "") {
      if (clientUser && clientUser.wallets) {
        const wallet = clientUser.wallets.find(
          (wallet: any) => wallet.currency == currentCoin
        );
        setCurrentWallet(wallet || null); // Set to null if not found
        console.log(wallet);
      } else {
        console.warn("Client user or wallets data is not available yet.");
        setCurrentWallet(null); //set current wallet to null to avoid future errors
      }
    }
  }, [currentCoin, clientUser]);

  useEffect(() => {
    setMyDate(new Date().toLocaleString());
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1012] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-[#F5918A]">
            Authentication Error
          </h1>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => router.push("/Logins/login")}
            className="bg-[#4DF2BE] text-[#0F1012] px-6 py-2 rounded-full"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8 relative">
      <div className="max-w-7xl mx-auto">
        <Nav />

        {/* Main Content */}
        {/* Header */}
        <div className="flex space-x-[5px]  text-[24px] font-[500] items-center mb-6">
          <p className="text-[#8F8F8F]">Hello,</p>
          <p className="text-[#FCFCFC]">
            {clientUser?.userData?.username
              ? clientUser?.userData?.username.startsWith("@")
                ? clientUser?.userData?.username
                : `@${clientUser?.userData?.username}`
              : "User"}
          </p>
        </div>

        <div
          className="flex pl-[15px] bg-[#342827] h-[68px] w-[1224px]  items-center gap-2 mb-6 "
          style={{
            borderLeft: "2px solid #FE857D",
            borderRadius: "0px 12px 12px 0px",
            padding: "16px 32px 16px 8px",
          }}
        >
          <Image src={icon_i} alt="i" sizes="24px" />
          <p className="text-[14px] ml-[20px] font-[500px] text-[#FCFCFC]">
            Complete KYC and enjoy access to all features available on the app.
          </p>
          <button
            className="text-[14px] w-[127px] h-[33px]  text-center ml-[25px] text-[#4DF2BE] font-[700] bg-[#2D2D2D] border border-[#222] rounded-full"
            onClick={toggleVerifyModal}
          >
            Complete KYC
          </button>
        </div>

        {/* Verification Modal */}

        {showVerifyModal && (
          <div
            className="fixed inset-0 bg-[#222222] flex items-center top-[100px]  ml-[25%]  justify-center z-[1000]"
            onClick={toggleVerifyModal}
            style={{ borderTop: "1px solid #222" }}
          >
            <div
              className="bg-[#0F1012] rounded-lg p-6 w-[560px] h-[400px] pl-[25px]  relative text-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={Times}
                alt={"times"}
                width={20}
                height={20}
                className="absolute top-[20px] w-[32px] h-[32px]  ml-[85%] cursor-pointer"
                onClick={toggleVerifyModal}
              />

              <h2 className="text-[16px]  font-[700] mt-[25px] text-[#FCFCFC] mb-4">
                Complete Your Verification First
              </h2>
              <p className="text-[#DBDBDB] text-[16px] mt-[60px] font-[400] mb-4">
                To perform this action, you need to verify your identity. This
                helps keep Evolve2p secure for everyone and aligns with global
                compliance regulations.
              </p>
              <ul className="text-[14px] font-[400] ml-[-40px] text-[#DBDBDB] mt-[50px] mb-4 space-y-[15px] list-none">
                <li className="flex items-center  gap-2">
                  <Image
                    src={checklistInactive}
                    alt="checklist"
                    className="mr-[10px]"
                  />
                  Generate wallet address
                </li>
                <li className="flex items-center gap-2">
                  <Image
                    src={checklistInactive}
                    alt="checklist"
                    className="mr-[10px]"
                  />
                  Access Buy/Sell offers
                </li>
                <li className="flex items-center  gap-2">
                  <Image
                    src={checklistInactive}
                    alt="checklist"
                    className="mr-[10px]"
                  />
                  Send and receive crypto safely
                </li>
              </ul>

              <p
                className="text-[#4DF2BE] text-[14px]  mb-6 font-[700] cursor-pointer"
                onClick={() => {
                  toggleVerifyModal();
                  setTimeout(() => toggleHowModal(), 100);
                }}
              >
                How does this works?
              </p>

              <button
                onClick={handleVerifyClick}
                className="w-[496px] h-[48px] bg-[#4DF2BE] mt-[30px]  text-[#0F1012] py-2 rounded-full font-[700] text-[14px]"
                style={{ border: "1px solid #4DF2BE" }}
              >
                Verify My Account
              </button>
            </div>
          </div>
        )}

        {/* How It Works Modal */}
        {showHowModal && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 mt-[30%] flex items-center justify-center z-[1000]"
            onClick={toggleHowModal}
          >
            <div
              className="bg-[#000] ml-[50px] pl-[20px] pr-[20px] h-[70vh] mt-[-60%] rounded-lg p-6 max-w-md w-[50%] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[#FFFFFF]    mt-[15px] text-[16px] font-[700]">
                Identity Verifiaction
                <Image
                  src={Times}
                  alt={"times"}
                  width={20}
                  height={20}
                  className="absolute top-4 ml-[28%] cursor-pointer"
                  onClick={toggleHowModal}
                />
              </div>
              <div className="flex justify-between mt-[20px] items-center mb-4">
                <h2 className="text-[20px] font-[700]  text-[#FFFFFF]">
                  How verifying your identity works
                </h2>
              </div>

              <p className="text-[#8F8F8F] mb-4">
                To verify your identity, Portions will ask you to scan a
                government-level ID (Request, Direct) License or National ID.
              </p>

              <p className="text-[#8F8F8F] mb-4 font-[500]">
                For security and compliance, Evolve2p will receive:
              </p>

              <ul className="list-disc pl-5 text-[#8F8F8F] mb-4 space-y-2">
                <li>Verification Status (Approved or Rejected)</li>
                <li>Your Full Legal Name</li>
                <li>Your Date of Birth</li>
                <li>City & Country of Issuance</li>
                <li>ID Type & Issuing Authority</li>
                <li>
                  A Secure, Reliable Copy of Your ID (No sensitive details are
                  shared)
                </li>
              </ul>

              <p className="text-[#8F8F8F] mb-4">
                This process ensures a safe and trusted trading experience for
                all users.{" "}
              </p>
            </div>
          </div>
        )}
        {/* Balance Cards */}
        <div className="flex md:flex-row justify-between pr-[30px] mt-[5px]">
          {/*left_side */}
          <div
            className="flex flex-col justify-between mt-[30px] w-[706px] h-[188px]  bg-[#222222] rounded-[12px]"
            style={{ padding: "24px 20px" }}
          >
            <div className="flex items-center  mt-[5px] gap-2 mb-6  space-x-[10px]">
              <p className="text-[16px] font-[400] text-[#DBDBDB]">
                Available Balance
              </p>
              <Image
                src={SlashH}
                alt="slash"
                sizes="20"
                className="text-[#DBDBDB]"
              />
            </div>
            <div className="flex  space-x-[10px] mt-[-35px]">
              <p className="text-[36px] font-[700] text-[#FCFCFC]">
                <span className="text-[28px]">$</span>0
              </p>
              <div className="flex items-center  mt-[40px] w-[82px] h-[36px] ml-[5px] bg-[#2D2D2D]  font-[700] text-[16px] rounded-full">
                <p className="text-[14px] font-[700] ml-[20px]  text-[#DBDBDB]">
                  USD
                </p>
                <Image
                  src={Parrow}
                  alt="arrow"
                  sizes="16px"
                  className="ml-[10px] text-[#8F8F8F]"
                />
              </div>
            </div>
            <div className="flex items-center space-x-[10px] ml-[40%] mt-[10px]   ">
              <div
                className="flex w-[122px] h-[40px]  items-center bg-[#2D2D2D] relative text-[#4DF2BE] space-x-[5px] ml-[5px] mt-4 rounded-full"
                style={{ padding: "10px 16px" }}
              >
                <Image src={Send} alt="send" className="ml-[10px]" />
                <p className="   rounded-full font-[700] text-[14px] pl-[10px] ">
                  Send
                </p>
                <Image
                  onClick={toggleDropdown}
                  src={Barrow}
                  alt="arrow"
                  sizes="20px"
                  className="ml-[10px]"
                />
              </div>

              {showReceiveModal && (
                <div className="fixed inset-0  top-[38px]    justify-center  items-center z-50">
                  <div className="bg-[#0F1012] w-[560px] max-h-[85vh] pb-[20px]  pl-[20px] rounded-[20px] p-6 relative text-white overflow-y-auto ">
                    <Image
                      src={Times}
                      alt={"times"}
                      width={20}
                      height={20}
                      className="absolute top-[20px] w-[32px] h-[32px]  ml-[85%] cursor-pointer"
                      onClick={closeReceiveModal}
                    />
                    <h2 className="text-[16px]  font-[700] text-[#FCFCFC] mt-[30px] mb-2">
                      Receive {currentCoin}
                    </h2>

                    <div className="mt-[50px]">
                      <p className="text-[#FCFCFC] text-[18px] font-[700]">
                        Your {currentCoin} Address
                      </p>
                      <p className="text-[#DBDBDB] text-[14px] font-[400]">
                        Use this address to deposit{" "}
                        <small className="font-[700]  text-[14px]">
                          {currentCoin}
                        </small>{" "}
                        to your Evolve2p wallet.
                      </p>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center mt-[30px]">
                      <QRCodeCanvas
                        value={currentWallet?.id || ""}
                        size={206}
                        bgColor="#3A3A3A"
                        fgColor="#FFFFFF"
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    <div className="mt-[20px]">
                      <div className="flex items-center p-[12px] justify-between bg-[#2D2D2D] w-[496px] h-[44px] rounded-[8px]">
                        <p className="text-[14px] text-[#DBDBDB] font-[400] ">
                          Network
                        </p>
                        <strong className="text-[14px] font-[500] text-[#FCFCFC]">
                          {currentCoin === "USDC" || currentCoin === "USDT"
                            ? "ERC-20"
                            : currentCoin}
                        </strong>
                      </div>
                      <div className="flex items-center mt-[20px] p-[12px] justify-between bg-[#2D2D2D] w-[496px] h-[44px] rounded-[8px]">
                        <p className="text-[14px] text-[#DBDBDB] font-[400] ">
                          Created
                        </p>
                        <strong className="text-[14px] font-[500] text-[#FCFCFC]">
                          {myDate}
                        </strong>
                      </div>
                    </div>

                    <div
                      className="flex  items-start w-[496px] h-[92px] bg-[#2D2D2D] space-x-[10px] mt-[30px]"
                      style={{
                        borderRadius: "0px 12px 12px 0px",
                        borderLeft: "2px solid  #FFC051",
                        padding: "16px 16px 16px 8px",
                      }}
                    >
                      <Image
                        src={Yellow_i}
                        alt="yellow"
                        className="mt-[15px]"
                      />
                      <p className="text-[#DBDBDB] text-[14px] font-[400]">
                        Make sure to only send {currentCoin} through the
                        selected network: <br />
                        {currentCoin === "USDC" || currentCoin === "USDT"
                          ? "ERC-20"
                          : currentCoin}{" "}
                        . Sending incompatible cryptocurrencies or sending
                        through a <br />
                        different network may result in irreversible loss.
                      </p>
                    </div>
                    <div className="ml-[-30%]">
                      <div className="w-[100%] h-[1px]  bg-[#2D2D2D] mt-[30px]"></div>
                    </div>

                    <div className="flex space-x-[15px]">
                      <div className=" flex items-center space-x-[10px] w-[242px] h-[48px] bg-[#2D2D2D] justify-center mt-[10px] rounded-full">
                        <p className="text-[14px] font-[700] text-[#FCFCFC] ">
                          {" "}
                          {currentWallet?.id
                            ? `${currentWallet.id.substring(
                                0,
                                4
                              )}...${currentWallet.id.substring(
                                currentWallet.id.length - 4
                              )}`
                            : "Generating address..."}{" "}
                        </p>
                        <Image src={Copy} alt="copy " sizes="16.667" />
                      </div>

                      <div className=" flex items-center space-x-[10px] w-[242px] h-[48px] bg-[#2D2D2D] justify-center mt-[10px] rounded-full">
                        <p className="text-[14px] font-[700] text-[#4DF2BE] ">
                          Share
                        </p>
                        <Image src={Share} alt="copy" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/*Drop_down */}

              {open && (
                <div className="absolute mt-[350px] p-[8px] pl-[30px] w-[251px] h-[272px] bg-[#222222] rounded-[12px] shadow-lg z-50 py-4 px-6">
                  <div className="flex flex-col space-y-[40px] text-white text-[16px] font-medium">
                    {[
                      {
                        icon: BTC,
                        label: "Send Bitcoin",
                        width: 27.997,
                        height: 28,
                        symbol: BTC,
                      },
                      {
                        icon: ETH,
                        label: "Send Ethereum",
                        width: 28,
                        height: 28,
                        symbol: ETH,
                      },
                      {
                        icon: USDT,
                        label: "Send Tether",
                        width: 27.997,
                        height: 28,
                        symbol: USDT,
                      },
                      {
                        icon: USDC,
                        label: "Send USDC",
                        width: 28,
                        height: 28,
                        symbol: USDC,
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center cursor-pointer hover:opacity-80"
                      >
                        <div className="flex items-center space-x-[20px]">
                          <Image
                            src={item.icon}
                            alt={item.label}
                            width={item.width}
                            height={item.height}
                          />
                          <span className="font-[400] text-[#FCFCFC] text-[14px]">
                            {item.label}
                          </span>
                        </div>
                        <span>
                          <Image
                            src={Larrow}
                            alt="arrow"
                            className=" w-[24px] h-[24px] mt-[10px] pr-[20px]"
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="flex w-[130px] h-[40px] bor items-center bg-[#2D2D2D] text-[#4DF2BE] space-x-[10px] relative  mt-4 rounded-full"
                style={{ padding: "10px 16px" }}
              >
                <Image src={Rarrowd} alt="Rd" className="ml-[15px]" />
                <p className="    rounded-full font-[700] text-[14px] pl-[10px]">
                  Receive
                </p>
                <Image
                  onClick={toggleReceiveDropdown}
                  src={Barrow}
                  alt="arrow"
                  sizes="20px"
                  className=" ml-[15px]"
                />
              </div>

              {/*Drop_down */}

              {isReceiveOpen && (
                <div className="absolute right-[550px]  mt-[350px] p-[8px]  pl-[30px] w-[251px] h-[272px] bg-[#222222] rounded-[12px] shadow-lg z-50 ">
                  <div className="flex flex-col space-y-[40px]  text-white text-[16px] font-medium">
                    {[
                      {
                        icon: BTC,
                        label: "Send Bitcoin",
                        width: 27.997,
                        height: 28,
                        symbol: "BTC",
                      },
                      {
                        icon: ETH,
                        label: "Send Ethereum",
                        width: 28,
                        height: 28,
                        symbol: "ETH",
                      },
                      {
                        icon: USDT,
                        label: "Send Tether",
                        width: 27.997,
                        height: 28,
                        symbol: "USDT",
                      },
                      {
                        icon: USDC,
                        label: "Send USDC",
                        width: 28,
                        height: 28,
                        symbol: "USDC",
                      },
                    ].map((item, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between  items-center cursor-pointer hover:opacity-80"
                        onClick={() => handleReceiveClick(item.symbol)}
                      >
                        <div className="flex items-center  space-x-[20px]">
                          <Image
                            src={item.icon}
                            alt={item.label}
                            width={item.width}
                            height={item.height}
                          />
                          <span className="font-[400] text-[#FCFCFC] text-[14px]">
                            {item.label}
                          </span>
                        </div>
                        <span>
                          <Image
                            src={Larrow}
                            alt="arrow"
                            className=" w-[24px] h-[24px] mt-[10px] pr-[20px]"
                          />
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div
                className="flex w-[122px] h-[40px]  items-center bg-[#2D2D2D] text-[#4DF2BE] space-x-[10px] mt-4 rounded-full"
                style={{ padding: "10px 16px" }}
              >
                <Image src={Swap} alt="swap" className="ml-[20px]" />
                <p className="px-4 py-1 ml-[5px]   rounded-full font-[700] text-[14px]">
                  Swap
                </p>
              </div>
            </div>
          </div>
          {/*right_side */}
          <div
            className="flex flex-col justify-between  mt-[30px] w-[498px] h-[188px] ml-[15px] bg-[#222222] rounded-[12px]"
            style={{ padding: "24px 20px" }}
          >
            <div>
              <p className="text-[16px] font-[400] text-[#DBDBDB]">
                Daily Limit
              </p>
              <p className="text-[18px] font-[500] text-[#FCFCFC]">$14850000</p>

              <div className="w-[458px] h-[8px] bg-[#4A4A4A]  rounded-[4px]">
                <div className="w-[8px] h-[8px] bg-[#4DF2BE] rounded-full"></div>

                <div className="flex space-x-[43%] text-[14px]  font-[400] text-[#DBDBDB]">
                  <p>$14850000 remaining</p>
                  <p>Refreshes in 10minutes</p>
                </div>

                <div className="w-[122px] h-[36px] ml-[73%] text-[14px] font-[700] bg-[#2D2D2D]  text-[#FCFCFC] px-4 py-2 rounded-full mt-[10px]">
                  <p className="" style={{ padding: "8px 14px" }}>
                    Increase Limit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Assets & Todo */}
        <div className="flex">
          {/* left_side */}
          <div>
            <div className="flex items-center justify-between mt-[30px] w-[913px]   rounded-[12px]">
              <p className="text-[16px] font-[500] text-[#8F8F8F]">My Assets</p>
              <div className="flex items-center space-x-[10px]">
                <p className="text-[14px] font-[700] text-[#FCFCFC]">See all</p>{" "}
                <Image src={R_arrow} alt="rarrow" />
              </div>
            </div>

            <div className="flex ml-[70px] space-x-[80px] text-[#8F8F8F] text-[14px] font-[400]">
              <p className="pl-[25px]">Currency</p>
              <p className="pl-[75px]">Balance</p>
              <p className="pl-[15px]">In USD</p>
            </div>

            <div className="w-[913px] h-[64px] ">
              <div
                className="flex bg-[#222222] rounded-[12px]"
                style={{ padding: "12px 20px" }}
              >
                <Image
                  src={BTC}
                  alt="bitcoin"
                  className="w-[39.995px] h-[40px] mt-[15px] ml-[16px]"
                />
                <div className=" ml-[20px] gap-[-10px]">
                  <p className="text-[16px] font-[700] text-[#FCFCFC]">
                    Bitcoin
                  </p>
                  <p className="flex items-center mt-[-15px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                    1 USD
                    <span className="ml-[2px]">=</span>
                    <span className="ml-[2px]">0.0000098 BTC</span>
                  </p>
                </div>
                <div className="flex ml-[65px] mt-[15px] space-x-[270%] ">
                  <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                    0{" "}
                    <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                      BTC
                    </span>
                  </p>
                  <p className="text-[12px] font-[500] ml-[-23px] text-[#DBDBDB] ">
                    $
                    <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                      0.00
                    </span>
                  </p>
                </div>

                <div className="flex ml-[20%] space-x-[10px]">
                  <div
                    className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Send}
                      alt="send"
                      className=" w-[16px] pl-[5px] h-[16px]"
                    />
                    <p className="text-[#DBDBDB] pl-[10px] text-[14px] font-[500]">
                      Send
                    </p>
                  </div>

                  <div
                    className="flex space-x-[5px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Rarrowd}
                      alt="arrow"
                      className="w-[16px] h-[16px] pl-[5px]"
                    />
                    <p className="text-[14px] pl-[10px] font-[500] text-[#DBDBDB]">
                      Receive
                    </p>
                  </div>

                  <div
                    className="flex space-x-[5px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Swap}
                      alt="swap"
                      className="w-[16px] h-[16px] pl-[5px]"
                    />
                    <p className="text-[14px] pl-[10px] font-[500] text-[#DBDBDB]">
                      Swap
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex bg-[#222222] mt-[10px] rounded-[12px]"
                style={{ padding: "12px 20px" }}
              >
                <Image
                  src={ETH}
                  alt="eth"
                  className="w-[39.995px] h-[40px] mt-[15px] ml-[16px]"
                />
                <div className=" ml-[20px] gap-[-10px]">
                  <p className="text-[16px] font-[700] text-[#FCFCFC]">
                    Ethereum
                  </p>
                  <p className="flex items-center mt-[-15px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                    1 USD
                    <span className="ml-[2px]">=</span>
                    <span className="ml-[2px]">0.0000098 BTC</span>
                  </p>{" "}
                </div>
                <div className="flex ml-[65px] mt-[15px] space-x-[270%] ">
                  <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                    0{" "}
                    <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                      ETH
                    </span>
                  </p>
                  <p className="text-[12px] font-[500] ml-[-23px] text-[#DBDBDB] ">
                    $
                    <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                      0.00
                    </span>
                  </p>
                </div>

                <div className="flex ml-[20%] space-x-[10px]">
                  <div
                    className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Send}
                      alt="send"
                      className=" w-[16px] pl-[5px] h-[16px]"
                    />
                    <p className="text-[#DBDBDB] pl-[10px] text-[14px] font-[500]">
                      Send
                    </p>
                  </div>

                  <div
                    className="flex space-x-[5px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Rarrowd}
                      alt="arrow"
                      className="w-[16px] h-[16px] pl-[5px]"
                    />
                    <p className="text-[14px] pl-[10px] font-[500] text-[#DBDBDB]">
                      Receive
                    </p>
                  </div>

                  <div
                    className="flex space-x-[5px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Swap}
                      alt="swap"
                      className="w-[16px] h-[16px] pl-[5px]"
                    />
                    <p className="text-[14px] pl-[10px] font-[500] text-[#DBDBDB]">
                      Swap
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex bg-[#222222] mt-[10px] rounded-[12px]"
                style={{ padding: "12px 20px" }}
              >
                <Image
                  src={USDC}
                  alt="usdc"
                  className="w-[39.995px] h-[40px] mt-[15px] ml-[16px]"
                />
                <div className=" ml-[20px] gap-[-10px]">
                  <p className="text-[16px] font-[700] text-[#FCFCFC]">USDC</p>
                  <p className="flex items-center mt-[-15px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                    1 USD
                    <span className="ml-[2px]">=</span>
                    <span className="ml-[2px]">0.0000098 BTC</span>
                  </p>
                </div>
                <div className="flex ml-[60px] mt-[15px] space-x-[270%] ">
                  <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                    0{" "}
                    <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                      USDC
                    </span>
                  </p>
                  <p className="text-[12px] font-[500] ml-[-30px] text-[#DBDBDB] ">
                    $
                    <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                      0.00
                    </span>
                  </p>
                </div>

                <div className="flex ml-[20%] space-x-[10px]">
                  <div
                    className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Send}
                      alt="send"
                      className=" w-[16px] pl-[5px] h-[16px]"
                    />
                    <p className="text-[#DBDBDB] pl-[10px] text-[14px] font-[500]">
                      Send
                    </p>
                  </div>

                  <div
                    className="flex space-x-[5px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Rarrowd}
                      alt="arrow"
                      className="w-[16px] h-[16px] pl-[5px]"
                    />
                    <p className="text-[14px] pl-[10px] font-[500] text-[#DBDBDB]">
                      Receive
                    </p>
                  </div>

                  <div
                    className="flex space-x-[5px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Swap}
                      alt="swap"
                      className="w-[16px] h-[16px] pl-[5px]"
                    />
                    <p className="text-[14px] pl-[10px] font-[500] text-[#DBDBDB]">
                      Swap
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="flex mt-[10px] bg-[#222222] rounded-[12px]"
                style={{ padding: "12px 20px" }}
              >
                <Image
                  src={USDT}
                  alt="bitcoin"
                  className="w-[39.995px] h-[40px] mt-[15px] ml-[16px]"
                />
                <div className=" ml-[20px] gap-[-10px]">
                  <p className="text-[16px] font-[700] text-[#FCFCFC]">USDT</p>
                  <p className="flex items-center mt-[-15px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                    1 USD
                    <span className="ml-[2px]">=</span>
                    <span className="ml-[2px]">0.0000098 BTC</span>
                  </p>
                </div>
                <div className="flex ml-[60px] mt-[15px] space-x-[270%] ">
                  <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                    0{" "}
                    <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                      USDT
                    </span>
                  </p>
                  <p className="text-[12px] font-[500] ml-[-30px] text-[#DBDBDB] ">
                    $
                    <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                      0.00
                    </span>
                  </p>
                </div>

                <div className="flex ml-[20%] space-x-[10px]">
                  <div
                    className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Send}
                      alt="send"
                      className=" w-[16px] pl-[5px] h-[16px]"
                    />
                    <p className="text-[#DBDBDB] pl-[10px] text-[14px] font-[500]">
                      Send
                    </p>
                  </div>

                  <div
                    className="flex space-x-[5px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Rarrowd}
                      alt="arrow"
                      className="w-[16px] h-[16px] pl-[5px]"
                    />
                    <p className="text-[14px] pl-[10px] font-[500] text-[#DBDBDB]">
                      Receive
                    </p>
                  </div>

                  <div
                    className="flex space-x-[5px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Swap}
                      alt="swap"
                      className="w-[16px] h-[16px] pl-[5px]"
                    />
                    <p className="text-[14px] pl-[10px] font-[500] text-[#DBDBDB]">
                      Swap
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-[913px] h-[722px]">
              <div className="flex items-center justify-between mt-[40%] w-[900px] h-[24px] rounded-[12px]">
                <p className="text-[16px] font-[500] text-[#8F8F8F]">
                  Transactions
                </p>
                <div className="flex-1 flex flex-col items-center  mt-[30%] justify-center">
                  <Image src={G19} alt="group19" />
                  <p className="text-[14px] font-[400] text-[#8F8F8F] mt-2">
                    Your 10 most recent transactions will appear here
                  </p>
                </div>
                <div className="flex items-center space-x-[10px]">
                  <p className="text-[14px] font-[700] text-[#FCFCFC]">
                    See all
                  </p>
                  <Image src={R_arrow} alt="rarrow" />
                </div>
              </div>
              <div className="w-[153.8%] ml-[-10%] h-[1px] bg-[#fff] mt-[40%] opacity-20 my-8"></div>
            </div>
          </div>

          {/* right_side */}
          <div className="flex flex-col space-y-[10px] ml-[20px] mt-[40px] pr-[25px]">
            <p className="text-[16px] font-[500]  text-[#8F8F8F]">Todo list</p>
            <div className="flex items-center w-[291px] h-[72px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Buy}
                  alt="buy"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px]">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[-2px]">
                  Buy Crypto
                </p>
                <small className="text-[12px] text-[#DBDBDB] mt-[5px] font-[400]">
                  Start a new buy order
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[85px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
            <div className="flex items-center w-[291px] h-[72px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Sell}
                  alt="sell"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px]">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[-2px]">
                  Sell Crypto
                </p>
                <small className="text-[12px] text-[#DBDBDB] mt-[5px] font-[400]">
                  Start a new sell order
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[85px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
            <div className="flex items-center w-[291px] h-[72px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Offer}
                  alt="offer"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px]">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[-2px]">
                  Post an Offer
                </p>
                <small className="text-[12px] text-[#DBDBDB] mt-[5px] font-[400]">
                  Create your P2P offer
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[85px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
            <div className="flex items-center w-[291px] h-[80px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Limit}
                  alt="limit"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px] ">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[5px] whitespace-nowrap ">
                  Increase Buy/Sell Limits
                </p>
                <small
                  className="text-[12px] text-[#DBDBDB] font-[400] leading-tight"
                  style={{
                    maxWidth: "180px",
                    display: "block",
                    wordBreak: "break-word",
                  }}
                >
                  Unlock higher trading limits by upgrading verification.
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[10px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
            <div className="flex items-center w-[291px] h-[80px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Set}
                  alt="set"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px] ">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[5px] whitespace-nowrap ">
                  Set Up 2FA
                </p>
                <small
                  className="text-[12px] text-[#DBDBDB] font-[400] leading-tight"
                  style={{
                    maxWidth: "180px",
                    display: "block",
                    wordBreak: "break-word",
                  }}
                >
                  Secure your account with two-factor authentication.
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[10px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
            <div className="flex items-center w-[291px] h-[80px] bg-[#222222] p-[12px] rounded-[8px] ">
              <div className="relative mt-[10px] ml-[20px] w-[41.841px] h-[41.841px] flex items-center justify-center">
                <Image
                  src={Eclipse}
                  alt="eclipse"
                  className="w-[41.841px] h-[41.841px]"
                  style={{ width: "41.841px", height: "41.841px" }}
                />
                <Image
                  src={Refer}
                  alt="refer"
                  className="absolute top-1/2 left-1/2"
                  style={{
                    width: "21.563px",
                    height: "21.563px",
                    transform: "translate(-50%, -50%)",
                  }}
                />
              </div>

              <div className="flex flex-col justify-center ml-[16px] ">
                <p className="text-[14px] font-[500] text-[#FCFCFC] mb-[5px] whitespace-nowrap ">
                  Refer & Earn
                </p>
                <small
                  className="text-[12px] text-[#DBDBDB] font-[400] leading-tight"
                  style={{
                    maxWidth: "180px",
                    display: "block",
                    wordBreak: "break-word",
                  }}
                >
                  Invite friends and earn rewards on every trade.
                </small>
              </div>

              <Image
                src={Larrow}
                alt="arrow"
                className="ml-[10px] w-[14px] h-[14px] mt-[10px]"
              />
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </main>
  );
};

export default Dashboard;
