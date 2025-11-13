"use client";

import React, { useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import Image from "next/image";
import Parrow from "../../public/Assets/Evolve2p_pArrow/elements.svg";
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
import Larrow from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Points from "../../public/Assets/Evolve2p_threep/Wallet/elements.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import { QRCodeCanvas } from "qrcode.react";
import Yellow_i from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import Copy from "../../public/Assets/Evolve2p_code/elements.svg";
import Share from "../../public/Assets/Evolve2p_share/elements.svg";
import Footer from "../Footer/Footer";
import TabsNav from "../TabsNav/TabsNav";
import { useRouter } from "next/navigation";
import WalletTransactions from "@/app/walletTransaction/walletTrans";
import { fetchCoinData, getCoinData } from "@/utils";

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

const Wallet: React.FC<QRCodeBoxProps> = ({ value }) => {
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [open, setOpen] = useState(false);
  const [isReceiveOpen, setIsReceiveOpen] = useState(false);
  const [myDate, setMyDate] = useState("");
  const [clientUser, setClientUser] = useState<any>(null);
  const [currentWallet, setCurrentWallet] = useState<wallet | null>(null);
  const [currentCoin, setCurrentCoin] = useState("");
  const [showBalance, setShowBalance] = useState(true);
  const [error, setError] = useState("");
  const [coinData, setCoinData] = useState<any>(null);
  const router = useRouter();

  const [isTransOpen, setIsTransOpen] = useState(false);

  const balance = 0; // 🔁 This is the static amount in USD

  useEffect(() => {
    (async () => {
      const res = await fetchCoinData();
      setCoinData(res);
    })();
  }, []);

  const handleSelect = (currency: Currency) => {
    setSelectedCurrency(currency);
    setIsTransOpen(false);
  };

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

  console.log(currentWallet);

  useEffect(() => {
    setMyDate(new Date().toLocaleString());
  }, []);

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex bg-[#2D2D2D] rounded-[56px] mt-8 w-[296px] h-[48px] p-1 items-center justify-between">
          <TabsNav />
        </div>

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
            <div className="flex  space-x-[10px] mt-[-35px]">
              <p className="text-[36px] font-[700] text-[#FCFCFC]">
                <span className="text-[28px]">{selectedCurrency.symbol}</span>
                {showBalance ? convertedAmount : "****"}
              </p>
              <div className="flex items-center  mt-[40px] w-[82px] h-[36px] ml-[5px] bg-[#2D2D2D]  font-[700] text-[16px] rounded-full">
                <p className="text-[14px] font-[700] ml-[20px]  text-[#DBDBDB]">
                  {selectedCurrency.name}
                </p>
                <Image
                  src={Parrow}
                  alt="arrow"
                  sizes="16px"
                  className="ml-[10px] text-[#8F8F8F]"
                  onClick={toggleTransDropdown}
                />
              </div>
            </div>

            {/* Dropdown */}
            {isTransOpen && (
              <div
                className="absolute w-[181px] h-[176px] space-y-[25px] top-[52%]  p-[8px] bg-[#222] rounded-[12px] shadow-lg z-50"
                style={{ border: "1px solid #2D2D2D" }}
              >
                {currencies.map((currency) => (
                  <div
                    key={currency.name}
                    onClick={() => handleSelect(currency)}
                    className={`flex justify-between items-center mt-[10px] px-4 py-3 cursor-pointer hover:bg-[#2D2D2D] ${
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

            <div className="flex items-center space-x-[10px] ml-[40%]    ">
              <div
                className="flex w-[122px] h-[40px]  items-center bg-[#2D2D2D] relative text-[#4DF2BE] space-x-[5px] ml-[5px] mt-4 rounded-full"
                style={{ padding: "5px 10px" }}
              >
                <Image src={Send} alt="send" className="pl-[5px]" />
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
                  <div className="bg-[#0F1012] w-[560px] max-h-[85vh] pb-[20px]  pl-[20px] rounded-[20px] p-6 relative text-white overflow-y-auto scrollbar-thin scrollbar-thumb-[#DBDBDB] scrollbar-track-[#2D2D2D] ">
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
                        <div
                          onClick={() => {
                            navigator.clipboard.writeText(
                              currentWallet?.id ?? ""
                            );
                            alert("Address copied");
                          }}
                        >
                          <Image src={Copy} alt="copy " sizes="16.667" />
                        </div>
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
                style={{ padding: "5px 10px" }}
              >
                <Image src={Rarrowd} alt="Rd" className="pl-[5px]" />
                <p className="    rounded-full font-[700] text-[14px] pl-[5px]">
                  Receive
                </p>
                <Image
                  onClick={toggleReceiveDropdown}
                  src={Barrow}
                  alt="arrow"
                  sizes="20px"
                  className=" ml-[5px]"
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
                style={{ padding: "5px 10px" }}
                onClick={() => router.push("/swap")}
              >
                <p className="pl-[10px]">
                  <Image src={Swap} alt="swap" />
                </p>
                <p className="px-4 py-1 ml-[10px]   rounded-full font-[700] text-[14px]">
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

        {/* left_side */}
        <div>
          <div className="flex items-center justify-between mt-[50px] w-[1224px] h-[64px]  rounded-[12px]">
            <p className="text-[16px] font-[500] text-[#8F8F8F]">My Assets</p>
            <div className="flex items-center  space-x-[10px]">
              <p className="text-[14px] font-[700] ml-[20px] text-[#FCFCFC]">
                See all
              </p>{" "}
              <Image src={R_arrow} alt="rarrow" />
            </div>
          </div>

          <div className="flex ml-[90px] space-x-[100px] text-[#8F8F8F] text-[14px] font-[400]">
            <div>
              <p>Currency</p>
            </div>

            <div>
              <p className="ml-[120%]">Balance</p>
            </div>

            <div>
              <p className="ml-[520%] whitespace-nowrap">In USD</p>
            </div>
          </div>

          <div className="w-[1224px] h-[64px] space-x-[-40px] ">
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
                <p className="text-[16px] font-[700] text-[#FCFCFC]">Bitcoin</p>
                <p className="flex items-center mt-[-15px] text-[14px] font-[400] text-[#8F8F8F] whitespace-nowrap">
                  1 USD
                  <span className="ml-[2px]">=</span>
                  <span className="ml-[2px]">
                    {" "}
                    {(() => {
                      const info = getCoinData("BTC", coinData || {});
                      return !("error" in info) && info.btc
                        ? `${Number(info.usd).toFixed(2)} BTC`
                        : "N/A";
                    })()}
                  </span>
                </p>
              </div>
              <div className="flex ml-[65px] mt-[15px] space-x-[100%] ">
                <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                  <span>
                    {
                      clientUser?.wallets?.find(
                        (w: any) => w?.currency == "BTC"
                      )?.balance
                    }{" "}
                  </span>
                  <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                    BTC
                  </span>
                </p>
                <p className="text-[12px] font-[500] ml-[23px] text-[#DBDBDB] ">
                  $
                  <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                    0.00
                  </span>
                </p>
              </div>

              <div className="flex ml-[33%] space-x-[10px]">
                <div
                  className="flex space-x-[15px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Send}
                    alt="send"
                    className=" w-[16px] pl-[10px] h-[16px]"
                  />
                  <p className="text-[#DBDBDB] text-[14px]  font-[500]">Send</p>
                </div>

                <div
                  className="flex space-x-[15px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Rarrowd}
                    alt="arrow"
                    className="w-[16px] h-[16px] pl-[10px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">
                    Receive
                  </p>
                </div>

                <div
                  className="flex space-x-[15px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Swap}
                    alt="swap"
                    className="w-[16px] h-[16px] pl-[10px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">Swap</p>
                </div>
                <div className="flex items-center justify-center w-[44px] h-[36px] bg-[#2D2D2D] mt-[20px] ml-[15px] rounded-full">
                  <Image
                    src={Points}
                    alt="point"
                    className="w-[13px] h-[13px] text-[#FFFFFF]"
                  />
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
                  <span className="ml-[2px]">
                    {(() => {
                      const info = getCoinData("ETH", coinData || {});
                      return !("error" in info) && info.eth
                        ? `${Number(info.usd).toFixed(2)} ETH`
                        : "N/A";
                    })()}
                  </span>
                </p>{" "}
              </div>
              <div className="flex ml-[65px] mt-[15px] space-x-[100%] ">
                <p className="flex text-[14px] font-[500] text-[#FCFCFC]">
                  <span>
                    {" "}
                    {
                      clientUser?.wallets?.find(
                        (w: any) => w?.currency == "ETH"
                      )?.balance
                    }
                  </span>
                  <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                    ETH
                  </span>
                </p>
                <p className="text-[12px] font-[500] ml-[23px] text-[#DBDBDB] ">
                  $
                  <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                    0.00
                  </span>
                </p>
              </div>

              <div className="flex ml-[33%] space-x-[10px]">
                <div
                  className="flex space-x-[15px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Send}
                    alt="send"
                    className=" w-[16px] pl-[10px] h-[16px]"
                  />
                  <p className="text-[#DBDBDB] text-[14px] font-[500]">Send</p>
                </div>

                <div
                  className="flex space-x-[15px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Rarrowd}
                    alt="arrow"
                    className="w-[16px] h-[16px] pl-[10px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">
                    Receive
                  </p>
                </div>

                <div
                  className="flex space-x-[15px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Swap}
                    alt="swap"
                    className="w-[16px] h-[16px] pl-[10px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">Swap</p>
                </div>
                <div className="flex items-center justify-center w-[44px] h-[36px] bg-[#2D2D2D] mt-[20px] ml-[15px] rounded-full">
                  <Image
                    src={Points}
                    alt="point"
                    className="w-[13px] h-[13px] text-[#FFFFFF]"
                  />
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
                  <span className="ml-[2px]">
                    {(() => {
                      const info = getCoinData("USDC", coinData || {});
                      return !("error" in info) && info.usd
                        ? `${Number(info.usd).toFixed(2)} USDC`
                        : "N/A";
                    })()}
                  </span>
                </p>
              </div>
              <div className="flex ml-[60px] mt-[15px] space-x-[100%] ">
                <p className="flex items-center text-[14px] font-[500] text-[#FCFCFC]">
                  <span>
                    {
                      clientUser?.wallets?.find(
                        (w: any) => w?.currency == "USDC"
                      )?.balance
                    }
                  </span>
                  <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                    USDC
                  </span>
                </p>
                <p className="text-[12px] font-[500] ml-[16px] text-[#DBDBDB] ">
                  $
                  <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                    0.00
                  </span>
                </p>
              </div>

              <div className="flex ml-[33%] space-x-[10px]">
                <div
                  className="flex space-x-[15px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Send}
                    alt="send"
                    className=" w-[16px] pl-[10px] h-[16px]"
                  />
                  <p className="text-[#DBDBDB] text-[14px] font-[500]">Send</p>
                </div>

                <div
                  className="flex space-x-[15px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Rarrowd}
                    alt="arrow"
                    className="w-[16px] h-[16px] pl-[10px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">
                    Receive
                  </p>
                </div>

                <div
                  className="flex space-x-[15px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Swap}
                    alt="swap"
                    className="w-[16px] h-[16px] pl-[10px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">Swap</p>
                </div>
                <div className="flex items-center justify-center w-[44px] h-[36px] bg-[#2D2D2D] mt-[20px] ml-[15px] rounded-full">
                  <Image
                    src={Points}
                    alt="point"
                    className="w-[13px] h-[13px] text-[#FFFFFF]"
                  />
                </div>
              </div>
            </div>
            <div
              className="flex w-[1224px] mt-[10px] bg-[#222222] rounded-[12px]"
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
                  <span className="ml-[2px]">
                    {(() => {
                      const info = getCoinData("USDT", coinData || {});
                      return !("error" in info) && info.usd
                        ? `${Number(info.usd).toFixed(2)} USDT`
                        : "N/A";
                    })()}
                  </span>
                </p>
              </div>
              <div className="flex ml-[60px] mt-[15px] space-x-[100%] ">
                <p className="flex items-center text-[14px] font-[500] text-[#FCFCFC]">
                  <span>
                    {
                      clientUser?.wallets?.find(
                        (w: any) => w?.currency == "USDT"
                      )?.balance
                    }{" "}
                  </span>
                  <span className="text-[12px] ml-[5px] text-[#DBDBDB] font-[500]">
                    USDT
                  </span>
                </p>
                <p className="text-[12px] font-[500] ml-[17px] text-[#DBDBDB] ">
                  $
                  <span className="text-[#FCFCFC] text-[14px] ml-[5px] font-[500]">
                    0.00
                  </span>
                </p>
              </div>

              <div className="flex ml-[33%] space-x-[10px]">
                <div
                  className="flex space-x-[15px] text-center  w-[85px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Send}
                    alt="send"
                    className=" w-[16px] pl-[10px] h-[16px]"
                  />
                  <p className="text-[#DBDBDB] text-[14px] font-[500]">Send</p>
                </div>

                <div
                  className="flex space-x-[15px] text-center  w-[101px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Rarrowd}
                    alt="arrow"
                    className="w-[16px] h-[16px] pl-[10px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">
                    Receive
                  </p>
                </div>

                <div
                  className="flex space-x-[15px] text-center  w-[87px] h-[36px] items-center bg-[#2D2D2D] mt-[10px]  rounded-full"
                  style={{ padding: "8px 14px" }}
                >
                  <Image
                    src={Swap}
                    alt="swap"
                    className="w-[16px] h-[16px] pl-[10px]"
                  />
                  <p className="text-[14px] font-[500] text-[#DBDBDB]">Swap</p>
                </div>
                <div className="flex items-center justify-center w-[44px] h-[36px] bg-[#2D2D2D] mt-[20px] ml-[15px] rounded-full">
                  <Image
                    src={Points}
                    alt="point"
                    className="w-[13px] h-[13px] text-[#FFFFFF]"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="w-[1224px] h-[338px] mt-[15%]">
            <WalletTransactions />
          </div>
        </div>
        <div className=" mb-[80px] mt-[68%] ">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Wallet;
