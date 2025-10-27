"use client";

import React, { useEffect, useState } from "react";
import Nav from "../../components/NAV/Nav";
import TabsNav from "../TabsNav/TabsNav";
import Image from "next/image";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import Arrow from "../../public/Assets/Evolve2p_arrowd/arrow-down-01.png";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import Swapicon from "../../public/Assets/Evolve2p_swapicon/elements.svg";
import I_icon from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import Rotate from "../../public/Assets/Evolve2p_rotate/elements.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation";

type CoinSymbol = "BTC" | "ETH" | "USDT" | "USDC";

interface CoinInfo {
  usd: number;
  btc: number;
  eth: number;
}

interface CoinDataMap {
  [key: string]: CoinInfo;
}

/**
 * Fetches latest coin prices from CoinPaprika and returns a CoinDataMap.
 */
export async function fetchCoinData(): Promise<CoinDataMap | null> {
  const symbolToId: Record<string, string> = {
    bitcoin: "btc-bitcoin",
    ethereum: "eth-ethereum",
    tether: "usdt-tether",
    "usd-coin": "usdc-usd-coin",
  };

  try {
    // Fetch USD prices for all supported coins
    const entries = await Promise.all(
      Object.entries(symbolToId).map(async ([key, id]) => {
        const res = await fetch(`https://api.coinpaprika.com/v1/tickers/${id}`);
        const data = await res.json();
        return [key, parseFloat(data.quotes.USD.price)];
      })
    );

    const usdPrices = Object.fromEntries(entries) as Record<string, number>;
    const btcPrice = usdPrices.bitcoin;
    const ethPrice = usdPrices.ethereum;

    const formattedPrices: CoinDataMap = {};

    for (const key in usdPrices) {
      const usd = usdPrices[key];
      formattedPrices[key] = {
        usd,
        btc: parseFloat((usd / btcPrice).toFixed(8)),
        eth: parseFloat((usd / ethPrice).toFixed(8)),
      };
    }

    // Set 1 for base units
    formattedPrices.bitcoin.btc = 1;
    formattedPrices.ethereum.eth = 1;

    return formattedPrices;
  } catch (error) {
    console.error("❌ Failed to fetch coin prices:", error);
    return null;
  }
}

/**
 * Get coin data safely using a switch-case symbol mapper.
 */
export function getCoinData(
  symbol: string,
  coinData?: CoinDataMap
): CoinInfo | { error: true; message: string } {
  if (!symbol) return { error: true, message: "Symbol is required" };
  if (!coinData) return { error: true, message: "Coin data is undefined" };

  let key: string;

  switch (symbol.toUpperCase()) {
    case "BTC":
      key = "bitcoin";
      break;
    case "ETH":
      key = "ethereum";
      break;
    case "USDT":
      key = "tether";
      break;
    case "USDC":
      key = "usd-coin";
      break;
    default:
      key = symbol.toLowerCase();
  }

  const data = coinData[key];
  return data || { error: true, message: `No data found for symbol "${symbol}"` };
}

export function convertCoinValue(
  fromSymbol: string,
  toSymbol: string,
  amount: number,
  coinData?: CoinDataMap
): number | { error: true; message: string } {
  const fromData = getCoinData(fromSymbol, coinData);
  const toData = getCoinData(toSymbol, coinData);

  if ("error" in fromData) return fromData;
  if ("error" in toData) return toData;

  // Convert through USD as a base reference
  const usdValue = amount * fromData.usd;
  const converted = usdValue / toData.usd;

  return parseFloat(converted.toFixed(8));
}

const Swap: React.FC = () => {
  const [isSwapModal, setIsSwapModal] = useState(false);
  const [IsSecpinModal, setIsSecpinModal] = useState(false); // declared so JSX references are safe
  const [SecDropdownOpen, setSecDropdownOpen] = useState(false);
  const [SecDropdownOpenTwo, setSecDropdownOpenTwo] = useState(false);
  const [clientUser, setClientUser] = useState<any>(null);
  const [coinPrices, setCoinPrices] = useState<CoinDataMap | null>(null);
  const [fromCoinValue, setFromCoinValue] = useState<string>("");
  const [toCoinValue, setToCoinValue] = useState<string>("0");
  const [convertedValue, setConvertedValue] = useState<number>(0);
  const [isSwapping, setIsSwapping] = useState(false);

  // Refreshing/countdown states
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshCountdown, setRefreshCountdown] = useState<number>(14);

  const router = useRouter();

  const closeSwapModal = () => setIsSwapModal(false);
  const closeSecpinModal = () => setIsSecpinModal(false);

  const toggleSecDropdown = () => {
    setSecDropdownOpen((prev) => !prev);
  };

  const toggleSecDropdownTwo = () => {
    setSecDropdownOpenTwo((prev) => !prev);
  };

  // initial fetch
  useEffect(() => {
    (async () => {
      const res = await fetchCoinData();
      setCoinPrices(res);
    })();
  }, []);

  const coins = [
    { name: "BTC", icon: BTC },
    { name: "ETH", icon: ETH },
    { name: "USDT", icon: USDT },
    { name: "USDC", icon: USDC },
  ];

  const coins2 = [
    { name: "BTC", icon: BTC },
    { name: "ETH", icon: ETH },
    { name: "USDT", icon: USDT },
    { name: "USDC", icon: USDC },
  ];

  const [selectedCoin, setSelectedCoin] = useState(coins[0]);
  const [selectedCoinTwo, setSelectedCoinTwo] = useState(coins2[1]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("UserData");
      if (!stored) {
        router.push("/Logins/login");
        return;
      }
      if (stored) {
        console.log(JSON.parse(stored));
        setClientUser(JSON.parse(stored)?.userData);
      }
    }
  }, []);

  // convert when inputs / selection / prices change
  useEffect(() => {
    const value = convertCoinValue(
      selectedCoin?.name,
      selectedCoinTwo?.name,
      Number(fromCoinValue) || 0,
      coinPrices || undefined
    );

    if (typeof value === "number") {
      setConvertedValue(value);
    } else {
      setConvertedValue(0);
    }
  }, [fromCoinValue, selectedCoin, selectedCoinTwo, coinPrices]);

  // countdown effect for auto-refresh
  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCountdown((prev) => {
        if (prev <= 1) {
          // time to refresh
          handleRefresh();
          return 14; // reset
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [/* empty - run once */]);

  const handleSwap = async () => {
    if (!fromCoinValue) return;
    setIsSwapping(true);
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("UserData");
      const accessToken = JSON.parse(stored || "")?.accessToken;

      const res = await fetch("https://evolve2p-backend.onrender.com/api/swap", {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
        body: JSON.stringify({
          fromCoin: selectedCoin?.name,
          toCoin: selectedCoinTwo?.name,
          fromAmount: fromCoinValue,
        }),
        method: "POST",
      });

      const data = await res?.json();

      if (data?.error) {
        setIsSwapping(false);
        alert(data?.message);
        return;
      }

      if (data?.success) {
        setIsSwapping(false);
        setFromCoinValue("");
        setConvertedValue(0);
        alert(data?.message);
      }
    }
  };

  // swap coins in the UI (left <-> right) and swap amounts
  const swapCoins = () => {
    // swap selected coins
    setSelectedCoin((prevLeft) => {
      const prevRight = selectedCoinTwo;
      // set right to prevLeft
      setSelectedCoinTwo(prevLeft);
      return prevRight;
    });

    // swap amounts: left value becomes right and vice versa
    const leftVal = fromCoinValue; // string
    const rightVal = convertedValue ? String(convertedValue) : "";

    setFromCoinValue(rightVal);
    // set convertedValue to left numeric or 0
    setConvertedValue(Number(leftVal) || 0);
  };

  // refresh handler for Rotate icon — fetches prices and shows spinner
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetchCoinData();
      if (res) {
        setCoinPrices(res);
        // recalc using existing fromCoinValue
        const value = convertCoinValue(
          selectedCoin?.name,
          selectedCoinTwo?.name,
          Number(fromCoinValue) || 0,
          res
        );
        if (typeof value === "number") setConvertedValue(value);
      }
    } catch (err) {
      console.error("Refresh failed", err);
    } finally {
      // short delay for nicer UX
      setTimeout(() => setIsRefreshing(false), 600);
      setRefreshCountdown(14);
    }
  };

  // helper to compute and format exchange rate text: 1 LEFT = X RIGHT
  const getExchangeRateText = () => {
    if (!coinPrices) {
      // fallback to computed value: if fromCoinValue provided, show ratio
      const denom = Number(fromCoinValue) || 1;
      const rate = convertedValue && denom !== 0 ? convertedValue / denom : 0;
      return rate ? rate.toFixed(6) : "0";
    }

    // map dropdown symbol to coinPrices key
    const mapSymbolToKey = (sym: string) => {
      switch (sym.toUpperCase()) {
        case "BTC":
          return "bitcoin";
        case "ETH":
          return "ethereum";
        case "USDT":
          return "tether";
        case "USDC":
          return "usd-coin";
        default:
          return sym.toLowerCase();
      }
    };

    const leftKey = mapSymbolToKey(selectedCoin.name);
    const rightKey = mapSymbolToKey(selectedCoinTwo.name);

    const leftData = coinPrices[leftKey];
    const rightData = coinPrices[rightKey];

    if (!leftData || !rightData) return "0";

    const rate = leftData.usd / rightData.usd;
    return isFinite(rate) ? rate.toFixed(6) : "0";
  };

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex bg-[#2D2D2D] rounded-[56px] mt-8 w-[296px] h-[48px] p-1 items-center justify-between">
          <TabsNav />
        </div>

        <div className="w-[1224px] h-[463px] bg-[#1A1A1A] mt-[20px] rounded-[12px] p-[32px] ">
          {isSwapModal && (
            <div
              className={`fixed inset-0 bg-black bg-opacity-50 top-[30px] left-[28%] flex items-center justify-center ${
                IsSecpinModal ? "opacity-30 pointer-events-none" : "opacity-100"
              } z-[1000]`}
            >
              <div className="bg-[#1A1A1A]  rounded-[12px] w-[560px] max-h-[85vh] p-[24px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#DBDBDB] scrollbar-track-[#2D2D2D]">
                <div className="flex  items-center justify-between">
                  <p className="text-[16px] font-[700] text-[#FFFFFF]">
                    Confirm Swap
                  </p>
                  <Image
                    src={Times}
                    alt={"times"}
                    width={20}
                    height={20}
                    className="absolute top-[20px] w-[32px] h-[32px] mt-[15px]  ml-[85%] cursor-pointer"
                    onClick={closeSwapModal}
                  />
                </div>

                <p className="text-center text-[#8F8F8F] text-[16px] font-[500] mt-[30px]">
                  Review the above before confirming <br /> Once made, your
                  transaction is irreversible.
                </p>

                <div className="flex justify-center items-center   mt-[30px]">
                  <Image
                    src={BTC}
                    alt="BTC"
                    className="w-[57.594px] ml-[-55px] h-[ 57.6px]"
                  />
                  <Image
                    src={ETH}
                    alt="ETH"
                    className="w-[ 57.6px] ml-[-18px] h-[ 57.6px]"
                  />
                </div>

                <div className="mt-6">
                  <p className="text-center text-[#FFFFFF] font-[700] text-[20px] rounded-[4px] py-[8px]">
                    Confirm swap of {selectedCoin.name} to {selectedCoinTwo.name}
                  </p>
                </div>

                <div className="mt-[40px] space-y-3">
                  {[
                    { label: "You are swapping", value: `${fromCoinValue} ${selectedCoin.name}` },
                    { label: "You will receive", value: `${convertedValue} ${selectedCoinTwo.name}` },
                    { label: "Exchange Rate", value: `1 ${selectedCoin.name} = ${getExchangeRateText()} ${selectedCoinTwo.name}` },
                    { label: "Network Fee", value: "0.0001 BTC (≈ $4.80)" },
                    { label: "Total Cost", value: `${fromCoinValue ? String(Number(fromCoinValue) + 0.0001) : "—"} ${selectedCoin.name}` },
                    { label: "Estimated Time", value: "< 2 minutes" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between items-center w-[496px] h-[44px] text-[14px] mb-[5px] font-[400] text-[#DBDBDB] bg-[#222222] p-[12px] rounded-[6px]"
                    >
                      <span>{item.label}</span>
                      <span>{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center space-x-[25px] mt-[30px]">
                  <button
                    onClick={closeSwapModal}
                    className="w-[242px] h-[48px] border-none bg-[#2D2D2D] rounded-full text-[#FFFFFF] text-[14px] font-[700]"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isSwapping}
                    onClick={handleSwap}
                    className="w-[242px] h-[48px] bg-[#4DF2BE] rounded-full text-[14px] text-[#0F1012] font-[700]"
                    style={{ border: "1px solid #4DF2BE" }}
                  >
                    {isSwapping ? "swapping..." : "Confirm Swap"}
                  </button>
                </div>
              </div>
            </div>
          )}
          <div>
            <p className="text-[24px] font-[700] text-[#FCFCFC]">Swap Crypto</p>
          </div>
          {/*general div l & r*/}
          <div className="flex items-center space-x-[10px] relative">
            {/*div left*/}
            <div
              className="w-[556px] h-[139px] bg-[#222222]  rounded-[12px] flex flex-col justify-between"
              style={{ padding: "12px 32px 24px 16px" }}
            >
              <div className="w-[508px] h-[20px]">
                <p className="text-[14px] text-[#8F8F8F] font-[400]">You are swapping</p>
              </div>

              <div className="flex items-center justify-between ">
                <div className=" flex text-[28px]  ">
                  <div className="text-[#FCFCFC] ">
                    <input
                      value={fromCoinValue}
                      onChange={(e) => setFromCoinValue(e.target.value)}
                      placeholder="0"
                      className="bg-transparent border-none outline-none text-[30px] w-auto min-w-0 text-[#FCFCFC]"
                    />
                  </div>
                </div>
                {/*where dropdown one */}
                <div className="w-[96px] h-[32px] flex items-center space-x-[10px]  justify-center bg-[#2D2D2D] rounded-full ">
                  <Image src={selectedCoin.icon} alt={selectedCoin.name} className="w-[23.997px] h-[24px] ml-[-25px]" />
                  <p className="text-[14px] font-[700] text-[#DBDBDB]">{selectedCoin.name}</p>
                  <Image src={Arrow} alt="arrow_down" className="text-[#8F8F8F] w-[16px] h-[16px]" onClick={toggleSecDropdown} />
                </div>

                {SecDropdownOpen && (
                  <div className="absolute top-[60%] left-[35%]  w-[250px]  bg-[#222222] rounded-[16px] shadow-lg z-[1500] p-8 space-y-4">
                    {coins.map((coin) => (
                      <div
                        key={coin.name}
                        onClick={() => {
                          setSelectedCoin(coin);
                          setSecDropdownOpen(false);
                        }}
                        className="flex items-center justify-between cursor-pointer hover:bg-[#2D2D2D] px-4 py-2 rounded-[12px]"
                      >
                        <div className="flex items-center pl-[20px]  space-x-[10px]">
                          <Image src={coin.icon} alt={coin.name} width={19.998} height={20} />
                          <p className="text-[16px] font-[500] text-[#FFFFFF]">{coin.name}</p>
                        </div>
                        {/* Selection Indicator */}
                        <div
                          className={`w-[20px] h-[20px] mr-[10px] rounded-full border-2 ${
                            selectedCoin.name === coin.name ? "border-[#4DF2BE] bg-[#4DF2BE]" : "border-[#8F8F8F]"
                          } flex items-center justify-center`}
                        >
                          {selectedCoin.name === coin.name && <div className="w-[10px] h-[10px]  rounded-full bg-[#0F1012]"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="w-[115px] h-[28px] whitespace-nowrap flex items-center justify-center text-[14px] font-[400] bg-[#2D2D2D] text-[#8F8F8F] rounded-full">
                  Min: 0.0001276
                </div>

                <div className="flex items-center">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">Balance: </p>
                  <span className="text-[14px] font-[500] text-[#FCFCFC]">
                    {clientUser?.wallets?.find((w: any) => w?.currency == selectedCoin?.name)?.balance} {selectedCoin?.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Swap Icon */}
            <div className="absolute left-1/2 -translate-x-1/2 z-10">
              <div
                className="w-[40px] h-[40px] rounded-[48px] border-[4px] border-[#0F1012] bg-[#4DF2BE] flex items-center justify-center p-2 cursor-pointer"
                onClick={swapCoins}
              >
                <Image src={Swapicon} alt="swap" width={21} height={21} className="w-[21px] h-[21px]" style={{ color: "#0F1012" }} />
              </div>
            </div>

            {/*div right*/}
            <div className="w-[556px] h-[139px] bg-[#222222]  rounded-[12px] flex flex-col justify-between" style={{ padding: "12px 16px 24px 32px" }}>
              <div className="w-[508px] h-[20px]">
                <p className="text-[14px] text-[#8F8F8F] font-[400]">You will receive</p>
              </div>

              <div className="flex items-center justify-between ">
                <div className=" flex text-[28px]  ">
                  <div className="text-[#FCFCFC] ">
                    <input disabled value={String(convertedValue)} className="bg-transparent border-none outline-none text-[30px] w-auto min-w-0 text-white" />
                  </div>
                </div>

                {/*where dropdown two */}
                <div className="w-[96px] h-[32px] flex items-center space-x-[10px]  justify-center bg-[#2D2D2D] rounded-full ">
                  <Image src={selectedCoinTwo.icon} alt={selectedCoinTwo.name} className="w-[23.997px] h-[24px] ml-[-25px]" />
                  <p className="text-[14px] font-[700] text-[#DBDBDB]">{selectedCoinTwo.name}</p>
                  <Image src={Arrow} alt="arrow_down" className="text-[#8F8F8F] w-[16px] h-[16px]" onClick={toggleSecDropdownTwo} />
                </div>

                {SecDropdownOpenTwo && (
                  <div className="absolute top-[60%] left-[80%]  w-[250px]  bg-[#222222] rounded-[16px] shadow-lg z-[1500] p-8 space-y-4">
                    {coins2.map((coin) => (
                      <div
                        key={coin.name}
                        onClick={() => {
                          setSelectedCoinTwo(coin);
                          setSecDropdownOpenTwo(false);
                        }}
                        className="flex items-center justify-between cursor-pointer hover:bg-[#2D2D2D] px-4 py-2 rounded-[12px]"
                      >
                        <div className="flex items-center pl-[20px]  space-x-[10px]">
                          <Image src={coin.icon} alt={coin.name} width={19.998} height={20} />
                          <p className="text-[16px] font-[500] text-[#FFFFFF]">{coin.name}</p>
                        </div>
                        {/* Selection Indicator */}
                        <div
                          className={`w-[20px] h-[20px] mr-[10px] rounded-full border-2 ${
                            selectedCoinTwo.name === coin.name ? "border-[#4DF2BE] bg-[#4DF2BE]" : "border-[#8F8F8F]"
                          } flex items-center justify-center`}
                        >
                          {selectedCoinTwo.name === coin.name && <div className="w-[10px] h-[10px]  rounded-full bg-[#0F1012]"></div>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <div className="w-[38px] h-[28px] whitespace-nowrap flex items-center justify-center text-[14px] font-[500] bg-[#2D2D2D] text-[#FCFCFC] rounded-full">
                  <p>
                    $ <span>0</span>
                  </p>
                </div>

                <div className="flex items-center">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">Balance: </p>
                  <span className="text-[14px] font-[500] text-[#FCFCFC]">
                    {clientUser?.wallets?.find((w: any) => w?.currency == selectedCoinTwo?.name)?.balance} {selectedCoinTwo?.name}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div
            className="w-[1190px] h-[56px] flex items-center  mt-[20px] bg-[#2D2D2D] space-x-[10px]"
            style={{
              borderRadius: "0 12px 12px 0",
              borderLeft: "2px solid #FFC051",
              padding: "16px 16px 16px 8px",
            }}
          >
            <Image src={I_icon} alt="iicon" />
            <p className="text-[14px] font-[400] text-[#DBDBDB]">
              The exchange rate includes all fees from Evolv2p and our hedging counterparty
            </p>
          </div>

          <div className="w-[1190] h-[68px] flex items-center  mt-[20px] bg-[#222222] rounded-[8px] p-[12px] space-x-[10px]">
            {/* Rotate + spinner */}
            <div className="w-[28px] h-[28px] flex items-center justify-center">
              {isRefreshing ? (
                <div className="animate-spin w-6 h-6 rounded-full border-2 border-[#FFC051] border-t-transparent" />
              ) : (
                <Image src={Rotate} alt="rotate" className="cursor-pointer" onClick={handleRefresh} />
              )}
            </div>

            <div className="flex flex-col ">
              <div className="flex items-center space-x-[10px] text-[16px] font-[500]">
                <p className="text-[#DBDBDB]">1 {selectedCoin.name}</p>{" "}
                <small className="text-[#8F8F8F]">=</small>{" "}
                <span className="text-[#DBDBDB]">
                  {getExchangeRateText()} {selectedCoinTwo.name}
                </span>
              </div>

              <div className="flex items-center mt-[-20px]">
                <p className="text-[14px] font-[400] text-[#8F8F8F]">
                  Refreshening in{" "}
                  <span className="text-[#FFC051] font-[500]">{refreshCountdown} Seconds</span>
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsSwapModal(true)}
              className="w-[105px] cursor-pointer h-[44px] flex  items-center justify-center rounded-full bg-[#4DF2BE] ml-auto"
              style={{ border: "1px solid  #4DF2BE" }}
            >
              <p className="text-[14px] font-[700] text-[#0F1012]">Swap now</p>
            </button>
          </div>
        </div>

        <div className=" mb-[80px] mt-[40%] ">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Swap;
