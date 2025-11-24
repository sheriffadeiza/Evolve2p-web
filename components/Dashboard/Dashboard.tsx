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
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import checklistInactive from "../../public/Assets/Evolve2p_checklist2/checklist-inactive.svg";
import { QRCodeCanvas } from "qrcode.react";
import Yellow_i from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import Copy from "../../public/Assets/Evolve2p_code/elements.svg";
import Share from "../../public/Assets/Evolve2p_share/elements.svg";
import DashboardTransactions from "@/app/dashboardTransaction/dashboardTrans";
import Footer from "../../components/Footer/Footer";

interface QRCodeBoxProps {
  value?: string;
}

interface wallet {
  id: string;
  currency: string; // "BTC", "ETH", etc
  address: string;
}

type Currency = {
  name: string;
  symbol: string;
};

const currencies: Currency[] = [
  { name: "USD", symbol: "$" },
  { name: "NGN", symbol: "₦" },
  { name: "BTC", symbol: "₿" },
  { name: "ETH", symbol: "Ξ" },
];

const conversionRates: { [key: string]: number } = {
  USD: 1,
  NGN: 1500,
  BTC: 0.000015,
  ETH: 0.00022,
};

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
  const [showBalance, setShowBalance] = useState(true);

  const [isTransOpen, setIsTransOpen] = useState(false);

  const handleVerifyClick = () => {
    router.push("/Signups/KYC");
  };

  const balance = 0; // 🔁 This is the static amount in USD

  const handleSelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsTransOpen(false);
  };

  const toggleVerifyModal = () => setShowVerifyModal(!showVerifyModal);
  const toggleHowModal = () => setShowHowModal(!showHowModal);
  const toggleDropdown = () => {
    setOpen((prev) => !prev);
  };
  const toggleReceiveDropdown = () => {
    setIsReceiveOpen((prev) => !prev);
  };

  const toggleVissibility = () => setShowBalance(!showBalance);

  const toggleTransDropdown = () => {
    setIsTransOpen((prev) => !prev);
  };

  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    currencies[0]
  );

  const convertedAmount = (
    balance * conversionRates[selectedCurrency.name]
  ).toFixed(2);

  const handleReceiveClick = (symbol: string) => {
    setCurrentCoin(symbol);
    setShowReceiveModal(true);
    setIsReceiveOpen(false);
  };

  const closeReceiveModal = () => setShowReceiveModal(false);
  // let user: any = null;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("UserData");
      if (!stored) {
        setError("Please login first");
        setTimeout(() => router.push("/Logins/login"), 1500);
        return;
      }
      if (stored) {
        setClientUser(JSON.parse(stored)?.userData);
      }
    }
  }, []);

  // console.log(currentWallet);

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     try {
  //       if (!clientUser) {
  //         setError("Please login first");
  //         setTimeout(() => router.push("/Logins/login"), 1500);
  //         return;
  //       }

  //       setTimeout(() => setLoading(false), 1000);
  //     } catch (e) {
  //       console.error("Error accessing localStorage:", e);
  //       setError("Unable to access authentication data. Please try again.");
  //       setTimeout(() => router.push("/Logins/login"), 2000);
  //     }
  //   };

  //   checkAuth();
  // }, [clientUser]);

  useEffect(() => {
    if (currentCoin !== "") {
      if (clientUser && clientUser.wallets) {
        console.log("Client User", clientUser);
        const wallet = clientUser.wallets.find(
          (w: any) =>
            String(w.currency).toUpperCase() == currentCoin?.toUpperCase()
        );
        setCurrentWallet(wallet || null); // Set to null if not found
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
    <main className="min-h-screen bg-[#0F1012]  mt-[30px] lg:pl-[30px] mx-auto text-white p-4 md:p-8 relative  ">
      <div className="max-w-7xl  mx-auto">
        <Nav />
        {/* Main Content */}
        {/* Header */}
        <div className="flex space-x-[5px]  text-[24px] font-[500] items-center mb-6 border-0 border-white">
          <p className="text-[#8F8F8F]">Hello</p>
          <p className="text-[#FCFCFC]">
            {clientUser?.username
              ? clientUser?.username.startsWith("@")
                ? clientUser?.username
                : `@${clientUser?.username}`
              : "User"}
          </p>
        </div>
         {!clientUser?.kycVerified && (
        <div
          className="flex pl-[15px] bg-[#342827] w-full h-[68px] lg:w-[100%]  items-center gap-2 mb-6 "
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
            className="text-[10px] lg:text-[14px] w-[127px] h-[33px]  text-center ml-[25px] text-[#4DF2BE] font-[700] bg-[#2D2D2D] border border-[#222] rounded-full cursor-pointer"
            onClick={toggleVerifyModal}
          >
            Complete KYC
          </button>
        </div>
      )}
        {/* Verification Modal */}
        {showVerifyModal && (
          <div
            className="overflow-y-scroll  fixed inset-0 bg-[#222222] flex items-center top-[10px]  xl:ml-[25%] md:top-[24px] md:mr-[10%] justify-center z-[1000] md:border-0 md:border-red-500 md:ml-[0%] w-[100%] "
            onClick={toggleVerifyModal}
            style={{ borderTop: "1px solid #222" }}
          >
            <div
              className="bg-[#0F1012] rounded-lg p-6 w-[560px] h-[400px] pl-[25px]  relative text-white shadow-lg border-0"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={Times}
                alt={"times"}
                width={20}
                height={20}
                className="absolute top-[48px] w-[32px] h-[32px] right-[20px] xl:ml-[80%] cursor-pointer "
                onClick={toggleVerifyModal}
              />

              <h2 className="text-[16px]  font-[700] mt-[25px] text-[#FCFCFC] mb-4 border-0 ">
                Complete Your Verification First
              </h2>
              <p className="text-[#DBDBDB] text-[16px] mt-[60px] font-[400] mb-4 border-0 border-yellow-500">
                To perform this action, you need to verify your identity. This
                helps keep Evolve2p secure for everyone and aligns with global
                compliance regulations.
              </p>
              <ul className="text-[14px] font-[400] xl:ml-[-40px] text-[#DBDBDB] mt-[50px] mb-4 space-y-[15px] list-none border-0 border-blue-500">
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
                className="text-[#4DF2BE] text-[14px]  mt-4 font-[700] cursor-pointer"
                onClick={() => {
                  toggleVerifyModal();
                  setTimeout(() => toggleHowModal(), 100);
                }}
              >
                How does this works?
              </p>

              <button
                onClick={handleVerifyClick}
                className=" w-full xl:w-[496px] h-[48px] bg-[#4DF2BE] mt-[30px]  text-[#0F1012] py-2 rounded-full font-[700] text-[14px] mb-4"
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
            className="fixed inset-0   bg-opacity-50 mt-[22%]  sm:mt-[8px] sm:ml-[24px] xl:ml-[10%] xl:top-[30%] xl:bottom-[36px] flex items-center justify-center z-[1000] border-0 ml-[18px] w-[90%] md:w-[100%] md:ml-[8px]  xl:w-[80%]"
            onClick={toggleHowModal}
          >
            <div
              className="bg-[#000] xl:ml-[50px] pl-[20px] pr-[20px] h-[70vh] xl:mt-[-10%] md:mt-[-20%] rounded-lg p-6 max-w-md  md:max-w-[130%] w-[120%] mx-4 overflow-y-scroll "
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-[#FFFFFF]    mt-[15px] text-[16px] font-[700] ">
                Identity Verifiaction
                <Image
                  src={Times}
                  alt={"times"}
                  width={20}
                  height={20}
                  className="absolute top-[84px] xl:top-[-56px] right-[50px]  cursor-pointer sm:left-[80%]"
                  onClick={toggleHowModal}
                />
              </div>
              <div className="flex justify-between mt-[20px] items-center mb-4  ">
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
        <div className="flex flex-col lg:flex-row justify-between p-0  mt-[5px]">
          {/*left_side */}
          <div
            className="flex flex-col justify-between mt-[30px] w-full lg:w-[706px] h-[188px]  bg-[#222222]  border-blue-500 border-0 rounded-[12px] lg:ml-0 xl:ml-[12px] p-[24px_8px] lg:p-[24px_20px] "
            // style={{ padding: "24px 20px" }}
          >
            <div className="flex items-center  mt-[5px] gap-2 mb-6  space-x-[10px] ">
              <p className="text-[16px] font-[400] text-[#DBDBDB]">
                Available Balance
              </p>

              <p>
                {" "}
                <Image
                  onClick={toggleVissibility}
                  src={SlashH}
                  alt="slash"
                  width={25}
                  height={25}
                  className="cursor-pointer"
                />
              </p>
            </div>
            <div className="flex justify-between lg:justify-start mt-[-22px] space-x-[10px] lg:mt-[-35px] ">
              <p className="text-[36px] font-[700] text-[#FCFCFC]">
                <span className="text-[28px]">{selectedCurrency.symbol}</span>
                {showBalance ? convertedAmount : "****"}
              </p>
              <div
                className="flex items-center  lg:mt-[40px] w-[82px] h-[36px] lg:ml-[-20px] bg-[#2D2D2D] font-[700] text-[16px] rounded-full  mt-[10px] cursor-pointer"
                onClick={toggleTransDropdown}
              >
                <p className="text-[14px] font-[700] ml-[20px]  text-[#DBDBDB]">
                  {selectedCurrency.name}
                </p>
                <Image
                  src={Parrow}
                  alt="arrow"
                  sizes="16px"
                  className="ml-[10px]  text-[#8F8F8F]"
                />
              </div>
            </div>

            {/* Dropdown */}
            {/* Currency drop down */}
            {isTransOpen && (
              <div
                className="absolute w-[181px] h-[11%] sm:h-[10%] left-[42%] space-y-[25px] top-[13%] lg:top-[20%] lg:h-[15.2%] lg:left-[64px] sm:p-[4px] p-[8px] bg-[#222] md:h-[12%] md:top-[16%] rounded-[12px] shadow-lg z-50  sm:left-[68%] sm:top-[14%] xl:h-[16%] xl:left-[10%] xl:top-[21.4%] "
                // style={{ border: "1px solid #2D2D2D" }}
              >
                {currencies.map((currency) => (
                  <div
                    key={currency.name}
                    onClick={() => handleSelect(currency)}
                    className={` flex justify-between items-center mt-[10px] px-4 py-3 cursor-pointer hover:bg-[#2D2D2D] ${
                      currency.name === selectedCurrency.name
                        ? "bg-[#2D2D2D]"
                        : ""
                    }`}
                  >
                    <span className="text-[#FCFCFC] text-[16px] font-[500]">
                      {currency.name}
                    </span>
                    <span
                      className={`w-[16px] h-[16px] rounded-full border-[2px] ${
                        currency.name === selectedCurrency.name
                          ? "border-[#4DF2BE] bg-[#4DF2BE]"
                          : "border-[#5C5C5C]"
                      }`}
                    ></span>
                  </div>
                ))}
              </div>
            )}
            {/*  */}
            <div className="flex items-center space-x-[10px] lg:ml-[13.2%] lg:w-[90%] sm:justify-end sm:gap-[8px]  sm:w-[70%] sm:ml-[30%] border-0 border-green-500 w-full xl:border-0 xl:ml-[12%]">
              <div
                className="flex justify-center w-full lg:w-[122px] h-[40px]  items-center bg-[#2D2D2D] relative text-[#4DF2BE] space-x-[5px] ml-[0px] mt-4 rounded-full  py-[0px] px-[10px] "
                // style={{ padding: "5px 10px" }}
              >
                <Image
                  src={Send}
                  alt="send"
                  className=" pl-[4px] lg:pl-0 xl:p-0"
                />
                <p className="   rounded-full font-[700] text-[14px] lg:pl-[10px] border-0">
                  Send
                </p>
                <Image
                  onClick={toggleDropdown}
                  src={Barrow}
                  alt="arrow"
                  sizes="20px"
                  className="lg:ml-[4px] ml-[4px] cursor-pointer"
                />
              </div>
              {/* account balance btns modal container overlay-modal */}
              {showReceiveModal && (
                <div className="fixed inset-0  top-[38px] w-[90%] left-[20px] sm:left-[36px]  justify-center  items-center z-50  sm:w-[90%] ">
                  <div className="bg-[#0F1012] w-full lg:w-[560px] max-h-[85vh] pb-[20px] p-4  lg:pl-[20px] rounded-[20px] lg:p-6 relative text-white overflow-y-auto scrollbar-thin scrollbar-thumb-[#DBDBDB] scrollbar-track-[#2D2D2D] ">
                    <Image
                      src={Times}
                      alt={"times"}
                      width={20}
                      height={20}
                      className="absolute top-[20px] w-[32px] h-[32px]  ml-[82%] cursor-pointer"
                      onClick={closeReceiveModal}
                    />

                    <h2 className="text-[16px]  font-[700] text-[#FCFCFC] mt-[30px] mb-2  border-0 border-sky-500">
                      Receive {currentCoin}
                    </h2>

                    <div className="mt-[50px]  w-full">
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
                    <div className="flex justify-center mt-[30px] w-full">
                      <QRCodeCanvas
                        value={currentWallet?.address || ""}
                        size={206}
                        bgColor="#3A3A3A"
                        fgColor="#FFFFFF"
                        level="H"
                        includeMargin={true}
                      />
                    </div>

                    <div className="mt-[20px]">
                      <div className="flex items-center p-[12px] justify-between bg-[#2D2D2D] w-[full] lg:w-[496px] h-[44px] rounded-[8px]">
                        <p className="text-[14px] text-[#DBDBDB] font-[400] ">
                          Network
                        </p>
                        <strong className="text-[14px] font-[500] text-[#FCFCFC]">
                          {currentCoin === "USDC" || currentCoin === "USDT"
                            ? "ERC-20"
                            : currentCoin}
                        </strong>
                      </div>
                      <div className="flex items-center mt-[20px] p-[12px] justify-between bg-[#2D2D2D] w-full lg:w-[496px] h-[44px] rounded-[8px] ">
                        <p className="text-[14px] text-[#DBDBDB] font-[400] ">
                          Created
                        </p>
                        <strong className="text-[14px] font-[500] text-[#FCFCFC]">
                          {myDate}
                        </strong>
                      </div>
                    </div>

                    <div
                      className="flex  items-start w-[full] lg:w-[496px]  lg:h-[92px] bg-[#2D2D2D] space-x-[10px] mt-[30px]"
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
                    {/* Modal divider  Section*/}
                    <div className="ml-[-30%] ">
                      <div className="w-[100%] h-[1px]  bg-[#2D2D2D] mt-[30px]"></div>
                    </div>

                    <div className="flex space-x-[15px]  w-[full]">
                      <div className=" flex items-center space-x-[10px] w-[242px] h-[48px] bg-[#2D2D2D] justify-center mt-[10px] rounded-full">
                        <p className="text-[14px] font-[700] text-[#FCFCFC] ">
                          {" "}
                          {currentWallet?.id
                            ? `${currentWallet?.address.substring(
                                0,
                                4
                              )}...${currentWallet?.address.substring(
                                currentWallet.address.length - 4
                              )}`
                            : "Generating address..."}{" "}
                        </p>
                        <div
                          onClick={() => {
                            navigator.clipboard.writeText(
                              currentWallet?.address ?? ""
                            );
                            alert("Address copied");
                          }}
                        >
                          <Image src={Copy} alt="copy " sizes="16.667" />
                        </div>
                      </div>

                      <div className=" flex items-center space-x-[10px] w-[242px] h-[48px] bg-[#2D2D2D] justify-center mt-[10px] rounded-full">
                        <p className="text-[14px] font-[700] text-[#4DF2BE]  ">
                          Share
                        </p>
                        <Image src={Share} alt="copy" />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/*Drop_down */}
              {/* send modal-open- Section */}
              {open && (
                <div className="absolute mt-[350px] p-[4px] pl-[30px] w-[251px] h-[294px] bg-[#222222] rounded-[12px] shadow-lg z-50 py-4 px-6 xl:left-[24%] md:left-[32%] md:top-[86px] xl:ml-[-4%] xl:mt-[29%] sm:left-[32%]">
                  <div className="flex flex-col space-y-[40px] text-white text-[16px] font-medium ">
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
                className="flex justify-center lg:w-[130px] h-[40px]  items-center bg-[#2D2D2D] text-[#4DF2BE] space-x-[4px] relative  mt-4 rounded-full w-full cursor-pointer   px-4 lg:p-0 xl:p-2 "
                // style={{ padding: "5px 10px" }}
              >
                <Image
                  src={Rarrowd}
                  alt="Rd"
                  className="ml-[-4px] border-2 lg:pl-0 xl:p-0"
                />
                <p className="rounded-full p-0 font-[700] text-[14px] lg:text-[14px] xl:text-[14px] ml-[-30px]  lg:pl-0">
                  Receive
                </p>
                <Image
                  onClick={toggleReceiveDropdown}
                  src={Barrow}
                  alt="arrow"
                  sizes="20px"
                  className="xl:ml-[8px] ml-[-2px] lg:ml-[-5px]"
                />
              </div>

              {/*Drop_down */}
              {/* receive modal section */}
              {isReceiveOpen && (
                <div className="absolute lg:right-[550px]  mt-[350px] p-[8px]  pl-[30px] w-[251px] h-[272px] bg-[#222222] rounded-[12px] shadow-lg z-50  xl:ml-[-10%] ">
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
                className="flex w-full lg:w-[122px] h-[40px]  items-center bg-[#2D2D2D] text-[#4DF2BE] space-x-[10px] mt-4 rounded-full  p-[5px_10px] xl:p-2 xl:space-x-[8px] cursor-pointer xl:justify-center"
                // style={{ padding: "5px 10px" }}
                onClick={() => router.push("/swap")}
              >
                <p className=" lg:p-0">
                  <Image src={Swap} alt="swap" />
                </p>
                <p className="lg:px-1  lg:py-1 ml-[4px]   rounded-full font-[700] text-[14px] ">
                  Swap
                </p>
              </div>
            </div>
          </div>
          {/*right_side */}
          <div
            className="flex flex-col justify-between border-0 mt-[30px]  w-full lg:w-[51.6%] h-[188px] xl:ml-[15px] bg-[#222222] rounded-[12px]  xl:w-[50%] "
            style={{ padding: "24px 20px" }}
          >
            <div>
              <p className="text-[16px] font-[400] text-[#DBDBDB]">
                Daily Limit
              </p>
              <p className="text-[18px] font-[500] text-[#FCFCFC] ">
                $14850000
              </p>

              <div className="w-full lg:w-[432px] xl:w-[100%] h-[8px] bg-[#4A4A4A]  rounded-[4px] mt-[4px] ">
                <div className=" w-[8px] h-[8px] bg-[#4DF2BE] rounded-full"></div>

                <div className="flex space-x-[43%] mt-[4px] text-[14px]  font-[400] text-[#DBDBDB] md:space-x-[58%]  lg:space-x-[34%]  xl:gap-[72px] sm:space-x-[50.6%]">
                  <p>$14850000 remaining</p>
                  <p>Refreshes in 10minutes</p>
                </div>

                <div className="w-[124px] h-[36px] ml-[60%] lg:ml-[72%] text-[14px] font-[500] bg-[#2D2D2D]  text-[#FCFCFC]  rounded-full mt-[10px]  sm:ml-[78%] md:ml-[82%]  xl:ml-[77.2%] ">
                  <p
                    className=" flex justify-center items-center"
                    style={{ padding: "8px 14px" }}
                  >
                    Increase Limit
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Assets & Todo */}
        <div className="flex flex-col lg:flex-row">
          {/* left_side */}
          <div>
            <div className="flex items-center justify-between mt-[30px] w-full lg:w-[913px]   rounded-[12px] p-[4px]">
              <p className="text-[16px] font-[500] text-[#8F8F8F]">My Assets</p>
              <div className="flex items-center space-x-[10px]">
                <p className="text-[14px] font-[700] text-[#FCFCFC]">See all</p>{" "}
                <Image src={R_arrow} alt="rarrow" />
              </div>
            </div>

            <div className="flex md:ml-[16px] md:space-x-[36px]  lg:ml-[70px] space-x-[22px] relative left-[14px] mb-[4px] lg:space-x-[80px] text-[#8F8F8F] text-[14px] font-[400] xl:ml-[60px]">
              <p className="pl-[25px]">Currency</p>
              <p className="pl-[75px]">Balance</p>
              <p className="pl-[15px]">In USD</p>
            </div>

            <div className=" w-full lg:w-[913px] h-[64px] flex flex-col gap-[10px] ">
              {/* First card section */}
              <div
                className="flex flex-col w-full  lg:flex-row  bg-[#222222] rounded-[12px] md:p-[8px] p-[4px]  lg:p-[12px] md:flex-row"
                // style={{ padding: "12px 12px" }}
              >
                <div className="flex gap-[8px] w-full">
                  <Image
                    src={BTC}
                    alt="bitcoin"
                    className=" w-[30px] h-[30px] lg:w-[39.995px]  lg:h-[40px] mt-[12px] lg:ml-[16px] md:w-[38px] md:h-[38px]"
                  />
                  {/* bitcon section */}
                  <div className="flex lg:gap-[14%]">
                    <div className=" lg:ml-[20px] gap-[-10px] border-0 border-blue-500 max-w-[40%]">
                      <p className="text-[16px] font-[700] text-[#FCFCFC]">
                        Bitcoin
                      </p>
                      <p className="flex items-center mt-[8px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                        1 USD
                        <span className="ml-[2px]">=</span>
                        <span className="ml-[2px]">0.0000098 BTC</span>
                      </p>
                    </div>
                    {/* balance and USD for first card*/}
                    <div className="flex justify-between  ml-[28px] md:ml-[40px] md:space-x-[48%] lg:ml-[65px] mt-[15px] space-x-[35%] lg:space-x-[270%] xl:ml-[46%] xl:space-x-[294%]">
                      <p className="flex text-[14px] font-[500] text-[#FCFCFC] border-0 border-yellow-500 relative left-[16px] xl:left-[4px]">
                        0{" "}
                        <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                          BTC
                        </span>
                      </p>
                      <p className="text-[12px] font-[500] ml-[30px] lg:ml-[-28px] text-[#DBDBDB] xl:ml-[-25px]">
                        $
                        <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                          0.00
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {/* Btn section below for card-one*/}
                <div className="flex justify-center  ml-[0%] space-x-[10px] md:border-0 p-[4px] border-green-500 sm:justify-end">
                  <div
                    className="flex space-x-[5px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Send}
                      alt="send"
                      className=" w-[16px] pl-[5px] h-[16px]"
                    />
                    <p className="text-[#DBDBDB] pl-[10px] text-[14px] font-[500] cursor-pointer">
                      Send
                    </p>
                  </div>

                  <div
                    className="flex space-x-[5px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]   rounded-full "
                    style={{ padding: "8px 14px" }}
                  >
                    <Image
                      src={Rarrowd}
                      alt="arrow"
                      className="w-[16px] h-[16px] pl-[5px]"
                    />
                    <p className="text-[14px] pl-[10px] font-[500] text-[#DBDBDB] cursor-pointer">
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
                    <p className="text-[14px] pl-[10px] font-[500] text-[#DBDBDB] cursor-pointer">
                      Swap
                    </p>
                  </div>
                </div>
              </div>
              {/* Second  Card section  */}
              <div
                className=" flex flex-col w-full  lg:flex-row  bg-[#222222] mt-[10px] rounded-[12px] md:flex-row md:p-[8px] p-[4px]  lg:p-[12px]"
                // style={{ padding: "12px 12px" }}
              >
                <div className="flex gap-[10px] w-full border-0 ">
                  <Image
                    src={ETH}
                    alt="eth"
                    className=" w-[30px] h-[30px] lg:w-[39.995px] md:w-[38px] md:h-[38px] lg:h-[40px] mt-[15px] lg:ml-[16px]"
                  />
                  {/* bitcon section */}
                  <div className="w-full sm:w-[48%] md:w-[42%] flex gap-[12%] xl:w-[47%]  xl:ml-[-8px]">
                    <div className=" lg:ml-[20px] gap-[-10px]  xl:pl-0 max-w-[40%] border-0 border-green-500 xl:relative xl:left-[6px]">
                      <p className="text-[16px] font-[700] text-[#FCFCFC]">
                        Ethereum
                      </p>
                      <p className="flex items-center mt-[8px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                        1 USD
                        <span className="ml-[2px]">=</span>
                        <span className="ml-[2px]">0.0000098 BTC</span>
                      </p>{" "}
                    </div>
                    {/* balance and USD for second card*/}
                    <div className="flex justify-between md:ml-[100px] md:space-x-[60%] ml-[18px] lg:ml-[65px] mt-[15px] space-x-[38%] lg:space-x-[270%] xl:ml-[35%] xl:space-x-[282%]">
                      <p className="flex text-[14px] font-[500] text-[#FCFCFC] relative left-[-14px] xl:left-[52px]">
                        0{" "}
                        <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                          ETH
                        </span>
                      </p>
                      <p className="text-[12px] font-[500] ml-[4px] lg:ml-[-28px] text-[#DBDBDB]  xl:ml-[-13px]">
                        $
                        <span className="text-[#FCFCFC] text-[14px] lg:ml-[5px] font-[500] relative left-[2px]">
                          0.00
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {/* Btn section below for second card*/}
                <div className="flex justify-center lg:ml-[20%] space-x-[10px] p-[4px] sm:justify-end">
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
              {/* Third Card Section */}
              <div
                className="flex flex-col w-full  lg:flex-row  bg-[#222222] rounded-[12px]  p-[4px] md:flex-row lg:p-[12px_20px] "
                // style={{ padding: "12px 20px" }}
              >
                <div className="flex gap-[6px] w-full xl:ml-[-4px]">
                  <Image
                    src={USDC}
                    alt="usdc"
                    className="w-[30px] h-[30px] lg:w-[39.995px] md:w-[38px] md:h-[38px] lg:h-[40px] mt-[15px] lg:ml-[16px] xl:ml-[10px]"
                  />
                  {/* bitcon section */}
                  <div className=" xl:ml-[-8px] flex gap-[8%] ">
                    <div className=" lg:ml-[20px] gap-[-10px] border-0 md:ml-[4px] border-yellow-500 max-w-[40%] xl:relative xl:left-[14px]">
                      <p className="text-[16px] font-[700] text-[#FCFCFC]">
                        USDC
                      </p>
                      <p className="flex items-center mt-[8px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                        1 USD
                        <span className="ml-[2px]">=</span>
                        <span className="ml-[2px]">0.0000098 BTC</span>
                      </p>
                    </div>
                    <div className="flex justify-between ml-[22px] lg:ml-[65px] mt-[15px] md:ml-[35.2px] md:space-x-[20%] space-x-[4px] lg:space-x-[270%]  xl:ml-[80px] xl:space-x-[258%]">
                      <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                        0{" "}
                        <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                          USDC
                        </span>
                      </p>
                      <p className="text-[12px] font-[500] ml-[30px] lg:ml-[-28px] text-[#DBDBDB] xl:ml-[-32px] ">
                        $
                        <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                          0.00
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {/* Btn section below for third card*/}
                <div className="flex justify-center lg:ml-[20%] space-x-[10px] p-[4px]  sm:justify-end relative xl:left-[10px]">
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
              {/* Forth Card Section */}
              <div
                className="flex flex-col w-full  md:flex-row lg:flex-row  bg-[#222222] rounded-[12px] p-[4px]  lg:p-[12px_20px]"
                // style={{ padding: "12px 20px" }}
              >
                <div className="flex gap-[10px] w-full  xl:ml-[-12px]">
                  <Image
                    src={USDT}
                    alt="bitcoin"
                    className=" w-[30px] h-[30px] md:w-[38px] md:h-[38px] lg:w-[39.995px] lg:h-[40px] mt-[15px] lg:ml-[16px]"
                  />
                  {/* bitcon section */}
                  <div className="sm:w-[50%] w-full flex gap-[14%] md:w-[42%] md:ml-[6px] xl:w-[80%] xl:ml-[-18px]  ">
                    <div className=" lg:ml-[20px] gap-[-10px]  max-w-[40%] xl:relative xl:left-[22px]">
                      <p className="text-[16px] font-[700] text-[#FCFCFC]">
                        USDT
                      </p>
                      <p className="flex items-center mt-[8px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                        1 USD
                        <span className="ml-[2px]">=</span>
                        <span className="ml-[2px]">0.0000098 BTC</span>
                      </p>
                    </div>
                    <div className="flex justify-between ml-[26px] lg:ml-[65px] mt-[15px] space-x-[8%] lg:space-x-[270%] md:ml-[82px] md:space-x-[30%]  relative left-[-18px]xl:space-x-[6%] xl:ml-[54px]">
                      <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                        0{" "}
                        <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                          USDT
                        </span>
                      </p>
                      <p className="text-[12px] font-[500] ml-[22px] lg:ml-[-28px] text-[#DBDBDB] xl:ml-[-33px]">
                        $
                        <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                          0.00
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
                {/* Btn section below*/}
                <div className="flex justify-center lg:ml-[20%] space-x-[10px]  p-[4px]  sm:justify-end border-0 relative xl:left-[12px]">
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
            <div className=" w-full lg:w-[913px] h-[722px] mt-[132%] lg:mt-[40%]  md:mt-[40%] sm:mt-[76%]">
              <DashboardTransactions />
            </div>
          </div>

          {/* right_side */}
          <div className="flex flex-col space-y-[10px] lg:ml-[20px] mt-[40px] lg:pr-[25px] xl:pr-0 xl:w-[30%] border-0 border-yellow-500">
            <p className="text-[16px] font-[500]  text-[#8F8F8F] ">Todo list</p>
            {/* todo list card on grid coloum section on SM-SIGN*/}
            <div className="border-0 flex  flex-col gap-[8px] border-blue-500 lg:flex lg:flex-col sm:grid sm:grid-cols-2 sm:gap-2 justify-items-center xl:w-full">
              {/* todo list 1st card section */}
              <div className="flex items-center w-full lg:w-[291px] h-[72px] bg-[#222222] p-[12px] rounded-[8px] border-0 border-green-500 xl:w-full ">
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
              {/* todo list 2nd card Section */}
              <div className="flex items-center h-[72px] bg-[#222222] p-[12px] rounded-[8px] border-0 border-yellow-500 w-full lg:w-[291px] xl:w-full">
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
              {/* todo list 3rd card section */}
              <div className="flex items-center lg:w-[291px] w-full h-[72px] bg-[#222222] p-[12px] rounded-[8px] border-0 border-blue-500 xl:w-full ">
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
              {/* todo list 4th card section */}
              <div className="flex items-center  h-[80px] bg-[#222222] p-[12px] rounded-[8px] border-0 border-pink-500 lg:w-[291px] w-full xl:w-full">
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
              {/* todo list 5th card section */}
              <div className="flex items-center w-full lg:w-[291px] h-[80px] bg-[#222222] p-[12px] rounded-[8px] border-0 border-white xl:w-full">
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
              {/* todo list 6th card section */}
              <div className="flex items-center lg:w-[291px] w-full h-[80px] bg-[#222222] p-[12px] rounded-[8px] border-0 border-sky-500 xl:w-full ">
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
        </div>
        <div className="mt-[20%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
