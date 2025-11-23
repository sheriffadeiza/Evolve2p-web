"use client";

import React, { useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Arrow_d from "../../public/Assets/Evolve2p_arrowd/arrow-down-01.png";
import Globe from "../../public/Assets/Evolve2p_globe/Makretplace/elements.svg";
import Funnel from "../../public/Assets/Evolve2p_funnel/elements.svg";
import Vector from "../../public/Assets/Evolve2p_vector/vector.svg";
import Repeat from "../../public/Assets/Evolve2p_Repeat/repeat.svg";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import Divider from "../../public/Assets/Evolve2p_divider/Divider.svg";
import Thumbs from "../../public/Assets/Evolve2p_thumbs/elements.svg";
import Timer from "../../public/Assets/Evolve2p_timer/elements.svg";
import Dminus from "../../public/Assets/Evolve2p_Dminus/Divider.svg";
import Dyellow from "../../public/Assets/Evolve2p_Dyellow/Divider.svg";
import Dpurple from "../../public/Assets/Evolve2p_Dpurple/Divider.svg";
import Dpink from "../../public/Assets/Evolve2p_Dpink/Divider.svg";
import Dgreen from "../../public/Assets/Evolve2p_Dgreen/Divider.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import Footer from "../../components/Footer/Footer";

const Market_place: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Buy");
  const tabs = ["Buy", "Sell"];
  const [isMarketDropdownOpen, setIsMarketDropdownOpen] = useState(false);
  const [selectedCoin, setSelectedCoin] = useState({ name: "BTC", icon: BTC });
  const [isAmountOpen, setIsAmountOpen] = useState(false);
  const [minAmount, setMinAmount] = useState<number | string>("");
  const [maxAmount, setMaxAmount] = useState<number | string>("");
const [isPaymentOpen, setIsPaymentOpen] = useState(false);
const [selectedMethod, setSelectedMethod] = useState<string>("Payment Method");
const [loadingMethods, setLoadingMethods] = useState(false);
const [errorMethods, setErrorMethods] = useState("");
  const [selected2Method, setSelected2Method] =
    useState<string>("Payment Method");
  const [isFunnelOpen, setIsFunnelOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string | number>("Bank Transfer");
  const [payment2Method, setPayment2Method] = useState("Bank Transfer");
  const [isPayment2Open, setIsPayment2Open] = useState(false);
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false);
  const [currency, setCurrency] = useState("USD");
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [region, setRegion] = useState("All Regions");

  const router = useRouter();
  const [adTypes, setAdTypes] = useState({
    tradeableOnly: true,
    verifiedOnly: true,
    noVerification: false,
  });
  const [sortBy, setSortBy] = useState("Best Rate");

  // Offer creation & display
  const [offers, setOffers] = useState<any[]>([]);
  const [loadingOffers, setLoadingOffers] = useState(false);
  const [errorOffers, setErrorOffers] = useState("");

  const toggleMarketDropdown = () => {
    setIsMarketDropdownOpen((prev) => !prev);
  };

  const toggleFunnel = () => setIsFunnelOpen((prev) => !prev);

  const handleApply = () => {
    console.log("Min:", minAmount, "Max:", maxAmount);
    setIsAmountOpen(false); // close after applying
  };

  const coins = [
    { name: "BTC", icon: BTC },
    { name: "ETH", icon: ETH },
    { name: "USDT", icon: USDT },
    { name: "USDC", icon: USDC },
  ];

  const [methods, setMethods] = useState<{ id: string | number; name: string }[]>([
    { id: "bank", name: "Bank Transfer" },
    { id: "paypal", name: "PayPal" },
    { id: "card", name: "Credit Card" },
    { id: "crypto", name: "Cryptocurrency Wallet" },
    { id: "mobile", name: "Mobile Payment App" },
  ]);

  const methods2 = [
    "Bank Transfer",
    "PayPal",
    "Credit Card",
    "Cryptocurrency Wallet",
    "Mobile Payment App",
  ];

  const currencies = ["USD", "NGN", "BTC", "ETH"];

  const regions = [
    "All Regions",
    "United States",
    "Nigeria",
    "Brazil",
    "Ethiopia",
    "Germany",
  ];

  const sortOptions = [
    "Best Rate",
    "Highest Volume",
    "Completion Rate",
    "Rating",
  ];

  const Toggle = ({
    enabled,
    onToggle,
  }: {
    enabled: boolean;
    onToggle: () => void;
  }) => {
    return (
      <div
        onClick={onToggle}
        className={`w-[40px] h-[20px] rounded-full p-[2px] flex items-center  cursor-pointer transition-colors duration-300
        
          ${enabled ? "bg-[#4DF2BE]" : "bg-[#8F8F8F]"}`}
      >
        <div
          className={`w-[15px] h-[15px] rounded-full transition-transform duration-300
    ${enabled ? "translate-x-[25px] bg-[#000]" : "translate-x-0 bg-[#fff]"}
  `}
<<<<<<< HEAD
  />
=======
        />
>>>>>>> 3adad660a7379524ab0ad414e8ee1ccd452b24b0
      </div>
    );
  };



   


  

useEffect(() => {
    const normalizeMethods = (arr: any[]) =>
      arr.map((m, i) =>
        typeof m === "string" ? { id: i, name: m } : { id: m.id ?? i, name: m.name ?? String(m) }
      );

    const fetchPaymentMethods = async () => {
      setLoadingMethods(true);
      setErrorMethods("");

      try {
        const res = await fetch("https://evolve2p-backend.onrender.com/api/get-payment-methods", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) throw new Error("Failed to load payment methods");
        const data = await res.json();

        console.log("💳 Payment Methods API Response:", data);

        // Handle multiple possible formats and normalize to {id,name} objects
        if (Array.isArray(data)) {
          setMethods(normalizeMethods(data));
        } else if (Array.isArray(data.methods)) {
          setMethods(normalizeMethods(data.methods));
        } else if (Array.isArray(data.data)) {
          setMethods(normalizeMethods(data.data));
        } else if (typeof data === "object" && data !== null) {
          // Try to extract string values or object entries
          const values = Object.values(data).filter((v) => typeof v === "string");
          if (values.length > 0) setMethods(values.map((v, i) => ({ id: i, name: v })));
          else {
            const entries = Object.entries(data).map(([k, v]) => ({ id: k, name: typeof v === "string" ? v : String(v) }));
            if (entries.length > 0) setMethods(entries);
            else setErrorMethods("Unexpected response format");
          }
        } else {
          setErrorMethods("Unexpected response format");
        }
      } catch (error: any) {
        console.error("❌ Error fetching payment methods:", error);
        setErrorMethods(error.message || "Error fetching methods");
      } finally {
        setLoadingMethods(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  // 🧹 Reset all fields
  const handleReset = () => {
    setMinAmount("");
    setMaxAmount("");
    setPaymentMethod("Bank Transfer");
    setCurrency("USD");
    setSelectedCoin({ name: "BTC", icon: BTC });
  };

  // 🚀 Create Offer
 // ...existing code...
  const handleCreateOffer = async () => {
    if (!minAmount || !maxAmount) {
      setErrorOffers("Please fill in both min and max limits.");
      return;
    }

    setLoadingOffers(true);
    setErrorOffers("");

    try {
      // get token from localStorage
      const userDataRaw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
      if (!userDataRaw) throw new Error("No userData in localStorage");
      let userData;
      try {
        userData = JSON.parse(userDataRaw);
      } catch (e) {
        throw new Error("Invalid userData in localStorage");
      }

      const token = userData?.accessToken || userData?.token;
      if (!token) throw new Error("No access token found");

      // Ensure we send payment method id if available
      let pmToSend: string | number = paymentMethod;
      if (!pmToSend || typeof pmToSend === "string") {
        // try to resolve id from methods array when paymentMethod is name or default
        const matched = methods.find((m) => String(m.name) === String(selectedMethod) || String(m.id) === String(paymentMethod));
        if (matched) pmToSend = matched.id;
      }

      const payload = {
        type: activeTab?.toLowerCase(),
        crypto: selectedCoin?.name,
        currency,
        margin: 2.5,
        paymentMethod: pmToSend, // send id when available
        minLimit: Number(minAmount),
        maxLimit: Number(maxAmount),
        paymentTerms: "Send only from your verified bank account.",
        paymentTime: "30 minutes",
      };

      

      const response = await fetch("https://evolve2p-backend.onrender.com/api/create-offer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      // try to read response body for debugging
      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : null;
      } catch {
        data = text;
      }

      if (!response.ok) {
        console.error("Create offer failed:", response.status, data);
        throw new Error(data?.message || data || `Server error ${response.status}`);
      }

      

      console.log("Create offer success:", data);
      setOffers((prev) => [...prev, data.offer || data]);
    } catch (err: any) {
      console.error("Error in handleCreateOffer:", err);
      setErrorOffers(err.message || "Error creating offer");
    } finally {
      setLoadingOffers(false);
    }
  };

  const [clientUser, setClientUser] = useState<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("UserData");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      // stored shape may be { userData: {...} } or the user object directly
      setClientUser(parsed.userData ?? parsed);
    } catch (e) {
      console.error("Failed parsing UserData from localStorage", e);
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex  space-x-[10px] mt-[35px] ">
          {/*left_div  */}
          <div className="bg-[#222222]  pl-[30px] pt-[20px] w-[395px] h-[498.79999]">
            <h2 className="text-[24px] text-[#FCFCFC] font-[700]">
              Create an Offer
            </h2>
            <p className="text-[#DBDBDB] text-[14px] font-[400] w-[355px] h-[40px] ">
              Let us know your trading needs, and we’ll assist you in narrowing
              down the offers in the P2P marketplace.
            </p>

            <div className="space-y-2">
              <label className="block text-[14px] font-[500] text-[#8F8F8F]">
                I want to
              </label>
              <div
  className="w-[355px] h-[43.2px] mt-[10px] bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
  onClick={() => setActiveTab(activeTab === "Buy" ? "Sell" : "Buy")}
>
  <span className="text-[#FCFCFC] pl-[15px] text-[14px] font-[500]">
    {activeTab}
  </span>
  <Image
    src={Arrow_d}
    alt="arrow"
    className={`text-[#DBDBDB] mr-[15px] transition-transform duration-200 ${
      activeTab === "Sell" ? "rotate-180" : ""
    }`}
  />
</div>
            <div className="relative">
  <div
    className="w-[355px] h-[43.2px] mt-[10px] bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
    onClick={() => setIsMarketDropdownOpen(!isMarketDropdownOpen)}
  >
    <span className="flex items-center pl-[15px] text-[#FCFCFC] text-[14px] font-[500]">
      <Image
        src={selectedCoin.icon}
        alt={selectedCoin.name}
        className="w-[19.998px] h-[20px]"
      />
      <p className="ml-[5px]">{selectedCoin.name}</p>
    </span>
    <Image
      src={Arrow_d}
      alt="arrow"
      className={`text-[#DBDBDB] mr-[15px] transition-transform duration-200 ${
        isMarketDropdownOpen ? "rotate-180" : ""
      }`}
    />
  </div>

  {/* Dropdown */}
  {isMarketDropdownOpen && (
    <div
      className="absolute w-[355px] bg-[#222222] rounded-[12px] mt-2 shadow-lg p-[8px] z-50"
      style={{ border: "1px solid #2D2D2D" }}
    >
      {coins.map((coin, index) => (
        <div
          key={index}
          className="flex items-center py-2 px-2 cursor-pointer hover:text-emerald-400"
          onClick={() => {
            setSelectedCoin(coin);
            setIsMarketDropdownOpen(false);
          }}
        >
          <Image
            src={coin.icon}
            alt={coin.name}
            className="w-[20px] h-[20px]"
          />
          <p className="ml-[10px] text-[#FFFFFF] text-[14px] font-[500]">
            {coin.name}
          </p>
        </div>
      ))}
    </div>
  )}
</div>
            </div>
            <div className="w-[355px] h-[1px] bg-[#8F8F8F] mt-[20px]"></div>

            <div className="space-y-2 mt-[15px]">
              <label className="block text-[14px] font-[500] text-[#8F8F8F]">
                My payment currency and method is
              </label>

             <div className="relative">
  <div
    className="w-[355px] h-[43.2px] mt-[10px] bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
  >
    <span className="text-[#FCFCFC] pl-[15px] text-[14px] font-[500]">
      {currency}
    </span>
    <Image
      src={Arrow_d}
      alt="arrow"
      className={`text-[#DBDBDB] mr-[15px] transition-transform duration-200 ${
        isCurrencyOpen ? "rotate-180" : ""
      }`}
    />
  </div>

  {/* Dropdown */}
  {isCurrencyOpen && (
    <div
      className="absolute w-[355px] bg-[#222222] rounded-[12px] mt-2 shadow-lg p-[8px] z-50"
      style={{ border: "1px solid #2D2D2D" }}
    >
      {currencies.map((curr, index) => (
        <p
          key={index}
          className="text-[#FFFFFF] text-[14px] font-[500] py-2 px-2 cursor-pointer hover:text-emerald-400"
          onClick={() => {
            setCurrency(curr);
            setIsCurrencyOpen(false);
          }}
        >
          {curr}
        </p>
      ))}
    </div>
  )}
  </div>

             
  <div
    className="w-[355px] h-[43.2px] mt-[10px] bg-[#2D2D2D] flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer"
    onClick={() => setIsRegionOpen(!isRegionOpen)}
  >
    <span className="flex items-center pl-[15px] text-[#FCFCFC] text-[14px] font-[500]">
      <Image
        src={Globe}
        alt="region"
        className="w-[19.998px] h-[20px]"
      />
      <p className="ml-[5px]">{region}</p>
    </span>
    <Image
      src={Arrow_d}
      alt="arrow"
      className={`text-[#DBDBDB] mr-[15px] transition-transform duration-200 ${
        isRegionOpen ? "rotate-180" : ""
      }`}
    />
  </div>

  {/* Dropdown */}
  {isRegionOpen && (
    <div
      className="absolute w-[355px] bg-[#222222] rounded-[12px] mt-2 shadow-lg p-[8px] z-50"
      style={{ border: "1px solid #2D2D2D" }}
    >
      {regions.map((reg, index) => (
        <p
          key={index}
          className="text-[#FFFFFF] text-[14px] font-[500] py-2 px-2 cursor-pointer hover:text-emerald-400"
          onClick={() => {
            setRegion(reg);
            setIsRegionOpen(false);
          }}
        >
          {reg}
        </p>
      ))}
    </div>
  )}
</div>
            

             <div className="flex mt-[20px] w-[355px] items-center space-x-[10px] mt-4">
          <button
          className="bg-[#2D2D2D] flex items-center justify-center border-none w-[77px] h-[48px]  text-[#FFFFFF] px-[12px] py-[20px] text-[14px] rounded-full font-[700]"
            onClick={handleReset}
          >
            Reset
          </button>
          <button
            className="bg-[#4DF2BE] text-[#0F1012] text-[14px] font-[700] px-6 py-2 rounded-full w-[266px] h-[48px]"
            style={{ border: "1px solid #4DF2BE" }}
            onClick={handleCreateOffer}
          >
            {loadingOffers ? "Creating..." : "Create Offer"}
          </button>
        </div>


          
          
          </div>

         
          {/*right_div  */}
          {/*right_div  */}
          <div className="flex items-center w-[141px] h-[36px] space-x-[15px]">
            <div className="flex  bg-[#2D2D2D] rounded-[56px] items-center">
              {tabs.map((tab) => (
                <div
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center justify-center text-[16px] w-[68px] h-[32px] rounded-[40px] cursor-pointer
                        ${
                          activeTab === tab
                            ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500]"
                            : "bg-[#2D2D2D]  text-[#DBDBDB] font-[400]"
                        }
                        
                        `}
                  style={{ minWidth: "68px", minHeight: "32px" }}
                >
                  {tab}
                </div>
              ))}
            </div>

            {/*drop_down coins */}
            <div
              className=" flex items-center  ml-[50px] w-[115px] h-[40px] space-x-[20px] bg-[#2D2D2D] rounded-full 
           "
              style={{ padding: "5px 10px" }}
            >
              <div className="ml-[10px] flex items-center space-x-[15px]">
                <Image
                  src={selectedCoin.icon}
                  alt={selectedCoin.name}
                  className="w-[19.998px] h-[20px]"
                />
                <p className="text-[14px] font-[400] text-[#FCFCFC] ">
                  {selectedCoin.name}
                </p>
                <Image
                  src={Arrow_d}
                  alt="arrow"
                  className="w-[20px] h-[20px] text-[#8F8F8F] "
                  onClick={toggleMarketDropdown}
                />
              </div>

              {isMarketDropdownOpen && (
                <div className="absolute w-[250px] bg-[#222222] top-[200px] rounded-[16px] shadow-lg z-[1500] p-8 space-y-4">
                  {coins.map((coin) => (
                    <div
                      key={coin.name}
                      onClick={() => {
                        setSelectedCoin(coin);
                        setIsMarketDropdownOpen(false);
                      }}
                      className="flex items-center justify-between cursor-pointer hover:bg-[#2D2D2D] px-4 py-2 rounded-[12px]"
                    >
                      <div className="flex items-center pl-[20px] space-x-[10px]">
                        <Image
                          src={coin.icon}
                          alt={coin.name}
                          className="w-[19.998px] h-[20px]"
                        />

                        <p className="text-[16px] font-[500] text-[#FFFFFF]">
                          {coin.name}
                        </p>
                      </div>

                      {/*selection indicator */}

                      <div
                        className={`w-[20px] h-[20px] mr-[10px] rounded-full border-2 ${
                          selectedCoin.name === coin.name
                            ? "border-[#4DF2BE] bg-[#4DF2BE]"
                            : "border-[#8F8F8F]"
                        } flex items-center justify-center`}
                      >
                        {selectedCoin.name === coin.name && (
                          <div className="w-[10px] h-[10px]  rounded-full bg-[#0F1012]"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div
              className=" flex    w-[146px] h-[40px] whitespace-nowrap space-x-[20px] bg-[#2D2D2D] rounded-full 
           "
              style={{ padding: "5px 10px" }}
              onClick={() => setIsAmountOpen(!isAmountOpen)}
            >
              <div className="ml-[20px] flex  items-center space-x-[15px]">
                <p className="text-[14px] font-[400] text-[#FCFCFC] ">
                  Amount NGN
                </p>
                <Image
                  src={Arrow_d}
                  alt="arrow"
                  className={`w-[20px] h-[20px] text-[#8F8F8F] transition-transform duration-200 ${
                    isAmountOpen ? "rotate-180" : ""
                  }`}
                />
              </div>
            </div>

            {/* Dropdown */}
            {isAmountOpen && (
              <div
                className="absolute  w-[320px] h-[50%] top-[200px] pl-[20px] left-[700px] rounded-[12px] bg-[#222222] p-6 shadow-xl z-50"
                style={{ border: "1px solid #2D2D2D" }}
              >
                <h3 className="text-[#FFFFFF] text-[16px] font-[500] mb-4">
                  Filter by Amount
                </h3>

                {/* Minimum Amount */}
                <label className="block text-gray-300 mt-[15px] text-[#C7C7C7] text-[14px] font-[500] mb-2">
                  Minimum Amount
                </label>
                <div className="flex items-center text-white rounded-xl px-3 py-2 mb-4">
                  <span className="text-[#FFFFFF] z-[10] text-[14px] font-[500] mt-[10px] pl-[10px] absolute">
                    $
                  </span>
                  <input
                    type="number"
                    value={minAmount}
                    onChange={(e) => setMinAmount(e.target.value)}
                    placeholder="5,000"
                    className="bg-[#2D2D2D] border-none  pl-[25px] relative outline-none w-[280px] h-[42px] mt-[10px] text-[#C7C7C7] text-[14px] font-[400] rounded-[8px]"
                    style={{ padding: "12px, 8px, 12px, 16px" }}
                  />
                </div>

                {/* Maximum Amount */}
                <label className="block text-gray-300 mt-[15px] text-[#C7C7C7] text-[14px] font-[500] mb-2">
                  Maximum Amount
                </label>
                <div className="flex items-center text-white rounded-xl px-3 py-2 mb-4">
                  <span className="text-[#FFFFFF] z-[10] text-[14px] font-[500] mt-[10px] pl-[10px] absolute">
                    $
                  </span>
                  <input
                    type="number"
                    value={maxAmount}
                    onChange={(e) => setMaxAmount(e.target.value)}
                    placeholder="500,000"
                    className=" bg-[#2D2D2D] border-none  pl-[25px] relative outline-none w-[280px] h-[42px] mt-[10px] text-[#C7C7C7] text-[14px] font-[400] rounded-[8px]"
                    style={{ padding: "12px, 8px, 12px, 16px" }}
                  />
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-[30px]  mt-[50px]">
                  <button
                    onClick={handleReset}
                    className="bg-[#2D2D2D] flex items-center justify-center border-none w-[77px] h-[48px]  text-[#FFFFFF] px-[12px] py-[20px] text-[14px] rounded-full font-[700]"
                  >
                    Reset
                  </button>
                  <button
                    onClick={handleApply}
                    className="bg-[#2D2D2D] flex items-center border-none justify-center w-[191px] h-[48px] hover:bg-emerald-700 text-[#4DF2BE] text-[14px] px-[12px] py-[20px] rounded-full font-[700]"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}

             <div
        className="flex items-center w-auto h-[40px] space-x-[20px] bg-[#2D2D2D] rounded-full"
        style={{ padding: "5px 10px" }}
        onClick={() => {
          setIsPaymentOpen(!isPaymentOpen);
          setIsPayment2Open(false);
        }}
      >
        <div className="ml-[15px] flex items-center space-x-[15px]">
          <p className="text-[14px] font-[400] text-[#FCFCFC] whitespace-nowrap">
            {loadingMethods ? "Loading..." : selectedMethod}
          </p>
          <Image
            src={Arrow_d}
            alt="arrow"
            className={`w-[20px] h-[20px] text-[#8F8F8F] transition-transform duration-200 ${
              isPaymentOpen ? "rotate-180" : ""
            }`}
          />
        </div>
      </div>

      {isPaymentOpen && (
        <div
          className="absolute left-[950px] top-[195px] w-[228px] h-[216px] bg-[#222222] rounded-[12px] shadow-lg p-[8px] z-50"
          style={{ border: "1px solid #2D2D2D" }}
        >

       {errorMethods ? (
            <p className="text-red-400 text-center text-sm">{errorMethods}</p>
          ) : methods.length > 0 ? (
            methods.map((method) => (
              <p
                key={method.id}
                className="text-[#FFFFFF] text-[16px] font-[500] py-2 cursor-pointer hover:text-emerald-400"
                onClick={() => {
                  setSelectedMethod(method.name);
                  setPaymentMethod(method.id);
                  setIsPaymentOpen(false);
                }}
              >
                {method.name}
              </p>
            ))
          ) : (
            <p className="text-[#aaa] text-center text-sm">No methods found</p>
          )}
        </div>
      )}
 
            {/* Funnel button */}
            <div
              onClick={() => setIsFunnelOpen(true)}
              className="w-[28px] h-[28px] mt-[5px] flex items-center bg-[#2D2D2D] space-x-[15px] rounded-full p-[8px] relative cursor-pointer"
              style={{ border: "1px solid #2D2D2D" }}
            >
              <Image
                src={Funnel}
                alt="funnel"
                className="w-[22.75px] h-[22.75px] text-[#8F8F8F] ml-[2px]"
              />
              <Image
                src={Vector}
                alt="vector"
                className="w-[12px] h-[12px] ml-[18px] mt-[-23px] absolute"
              />
            </div>

            {/* Modal (always mounted; animated open/close) */}
            <div
              className={`
    fixed inset-0 z-50 top-[200px]  left-[850px] flex justify-end
    transition-opacity  duration-300
    ${
      isFunnelOpen
        ? "opacity-100 pointer-events-auto  bg-black/70"
        : "opacity-0 pointer-events-none bg-black/0"
    }
  `}
              onClick={toggleFunnel} /* click backdrop to close */
              aria-hidden={!isFunnelOpen}
            >
              <div
                className={`
      bg-[#0F1012] w-[400px] max-h-[65vh]  pl-[25px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#DBDBDB] scrollbar-track-[#2D2D2D]   rounded-[12px] shadow-xl
      transform transition-transform duration-300 ease-in-out
      ${isFunnelOpen ? "translate-x-0" : "translate-x-full"}
    `}
                onClick={(e) =>
                  e.stopPropagation()
                } /* don't close when clicking inside */
              >
                <p>
                  {" "}
                  <Image
                    src={Times}
                    alt={"times"}
                    width={20}
                    height={20}
                    className="absolute top-[20px] w-[32px] h-[32px]  ml-[80%] cursor-pointer"
                    onClick={toggleFunnel}
                  />
                </p>
                <h2 className="text-[16px] mt-[80px] text-[#FFFFFF] font-[700] mb-6">
                  More Filter
                </h2>
                {/* Payment Method */}
                <div className="w-[370px] mt-[30px]">
                  {/* Label */}
                  <label className="block text-[14px] font-[500] text-[#C7C7C7] mb-2">
                    Payment Method
                  </label>

                  {/* Selected field */}
                  <div
                    onClick={() => setIsPayment2Open(!isPayment2Open)}
                    className="w-[360px] h-[43.2px] flex items-center justify-between mt-[10px] text-[#FFFFFF] p-[8px] rounded-md bg-[#2D2D2D]  cursor-pointer text-[14px] font-[500] relative"
                    style={{ padding: "5px 5px 5px 10px" }}
                  >
                    {selected2Method}

                    {/* Custom Arrow */}
                    <Image
                      src={Arrow_d}
                      alt="arrow"
                      className={`w-[20px] h-[20px] transition-transform duration-300 ${
                        isPayment2Open ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>

                  {/* Dropdown Menu */}
                  {isPayment2Open && (
                    <div className="mt-2 bg-[#2D2D2D] w-[229px] p-[8px] space-y-[10px]  shadow-lg overflow-hidden">
                      {methods2.map((method) => (
                        <div
                          key={method}
                          onClick={() => {
                            setSelected2Method(method);
                            setIsPayment2Open(false);
                          }}
                          className={`px-4 py-3 cursor-pointer text-[16px] font-[500] 
                ${
                  payment2Method === method
                    ? "text-[#FFFFFF]"
                    : "text-[#C7C7C7]"
                }
                hover:bg-[#3A3A3A]`}
                        >
                          {method}
                        </div>
                      ))}
                    </div>
                  )}
                  {/* Currency */}
                  <label className="block text-[14px] mt-[30px] font-[500] text-[#C7C7C7] mb-2">
                    Currency
                  </label>
                  <div
                    onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
                    className="w-[360px] h-[43.2px] flex items-center  justify-between mt-[10px] rounded-md bg-[#2D2D2D] text-[#FFFFFf] cursor-pointer text-[14px] font-[500]"
                    style={{ padding: "5px 5px 5px 10px" }}
                  >
                    {currency}
                    <Image
                      src={Arrow_d}
                      alt="arrow"
                      className={`w-[20px] h-[20px] transition-transform duration-300 ${
                        isCurrencyOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </div>

                  {/* Dropdown menu */}
                  {isCurrencyOpen && (
                    <div className="mt-2 bg-[#2D2D2D] p-[8px] w-[229px] space-y-[10px] shadow-lg overflow-hidden ">
                      {currencies.map((cur) => (
                        <div
                          key={cur}
                          onClick={() => {
                            setCurrency(cur);
                            setIsCurrencyOpen(false);
                          }}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer text-[16px] font-[500]
          ${currency === cur ? "text-[#FFFFFF]" : "text-[#C7C7C7]"}
          hover:bg-[#3A3A3A]`}
                        >
                          <span>{cur}</span>

                          {/* Indicator */}
                          <span
                            className={`relative inline-flex items-center justify-center rounded-full
            ${
              currency === cur
                ? "w-[20px] h-[20px] bg-[#4DF2BE]"
                : "w-[20px] h-[20px] border-2 border-[#8F8F8F] bg-transparent"
            }`}
                          >
                            {currency === cur && (
                              <span className="block w-[10px] h-[10px] rounded-full bg-[#0F1012]" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                .{/* Country/Region */}
                <div className="w-[370px] mt-[30px]">
                  {/* Label */}
                  <label className="block text-[14px] font-[500] text-[#C7C7C7] mb-2">
                    Country/Region
                  </label>

                  {/* Selected button */}
                  <div
                    onClick={() => setIsRegionOpen(!isRegionOpen)}
                    className="w-[360px] h-[43.2px] mt-[10px] p-[8px] text-[#FFFFFF] flex items-center justify-between px-3 rounded-md bg-[#2D2D2D] text-white cursor-pointer text-[14px] font-[500]"
                  >
                    <span className="flex items-center  text-[#FCFCFC] text-[14px] font-[500]">
                      <Image
                        src={Globe}
                        alt="bitcoin"
                        className="w-[19.998px] h-[20px]  "
                      />
                      <p className="ml-[5px]"> {region} </p>
                    </span>
                    <Image
                      src={Arrow_d}
                      alt="arrow"
                      className={`w-[20px] h-[20px] transition-transform duration-300 ${
                        isCurrencyOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />{" "}
                  </div>

                  {/* Dropdown menu */}
                  {isRegionOpen && (
                    <div className="mt-2 bg-[#2D2D2D] p-[8px] w-[229px] space-y-[15px] shadow-lg overflow-hidden ">
                      {regions.map((reg) => (
                        <div
                          key={reg}
                          onClick={() => {
                            setRegion(reg);
                            setIsRegionOpen(false);
                          }}
                          className={`flex items-center justify-between px-4 py-3 cursor-pointer text-[16px] font-[500]
                ${region === reg ? "text-[#FFFFFF]" : "text-[#C7C7C7]"}
                hover:bg-[#3A3A3A]`}
                        >
                          <span>{reg}</span>

                          {/* Radio-like indicator */}
                          <span
                            className={`relative inline-flex items-center justify-center rounded-full
                  ${
                    region === reg
                      ? "w-[24px] h-[24px] bg-[#4DF2BE]"
                      : "w-[24px] h-[24px] border-2 border-[#8F8F8F] bg-transparent"
                  }`}
                          >
                            {region === reg && (
                              <span className="block w-[10px] h-[10px] rounded-full bg-[#1E1E1E]" />
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {/* Ad Types */}
                <div className="w-[370px] mt-[30px] text-white">
                  {/* Ad Types */}
                  <label className="block text-[14px] font-[500] text-[#C7C7C7] mb-2">
                    Ad Types
                  </label>
                  <div className="space-y-[10px] mb-6">
                    {/* Tradeable Ads only */}
                    <div className="flex items-center w-[360px] text-[#FFFFFF] p-[12px]  h-[44px] mt-[10px] justify-between bg-[#2D2D2D] px-4 py-3 rounded-[8px]">
                      <span className="text-[14px] font-[500]">
                        Tradeable Ads only
                      </span>
                      <Toggle
                        enabled={adTypes.tradeableOnly}
                        onToggle={() =>
                          setAdTypes({
                            ...adTypes,
                            tradeableOnly: !adTypes.tradeableOnly,
                          })
                        }
                      />
                    </div>

                    {/* Verified Traders Ads Only */}
                    <div className="flex items-center w-[360px] text-[#FFFFFF] p-[12px] h-[44px] mt-[10px]  justify-between bg-[#2D2D2D] px-4 py-3 rounded-[8px]">
                      <span className="text-[14px] font-[500]">
                        Verified Traders Ads Only
                      </span>
                      <Toggle
                        enabled={adTypes.verifiedOnly}
                        onToggle={() =>
                          setAdTypes({
                            ...adTypes,
                            verifiedOnly: !adTypes.verifiedOnly,
                          })
                        }
                      />
                    </div>

                    {/* Ads with no verification required */}
                    <div className="flex items-center w-[360px] text-[#FFFFFF] p-[12px] h-[44px] mt-[10px] justify-between bg-[#2D2D2D] px-4 py-3 rounded-[8px]">
                      <span className="text-[14px] font-[500]">
                        Ads with no verification required
                      </span>
                      <Toggle
                        enabled={adTypes.noVerification}
                        onToggle={() =>
                          setAdTypes({
                            ...adTypes,
                            noVerification: !adTypes.noVerification,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
                <label className="block text-[14px] mt-[15px] font-[500] text-[#C7C7C7] mb-2">
                  Sort by
                </label>
                <div className="space-y-[10px]">
                  {sortOptions.map((option) => (
                    <div
                      key={option}
                      onClick={() => setSortBy(option)}
                      className={`flex items-center w-[360px] h-[44px] justify-between mt-[10px] p-[12px] px-4 py-3 cursor-pointer rounded-[8px] bg-[#2D2D2D]
              ${sortBy === option ? "text-[#FFFFFF]" : "text-[#C7C7C7]"}`}
                    >
                      <span className="text-[14px] font-[500]">{option}</span>

                      {/* Custom Radio */}
                      <span
                        className={`w-[20px] h-[20px] flex items-center justify-center rounded-full border 
                ${
                  sortBy === option
                    ? "border-[#4DF2BE] bg-[#4DF2BE]"
                    : "border-[#8F8F8F]"
                }`}
                      >
                        {sortBy === option && (
                          <span className="w-[10px] h-[10px] bg-[#0F1012] rounded-full"></span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Action Buttons */}
                <div className="flex ml-[40%] space-x-[10px] text-[14px] font-[700] mt-[20px] mb-[20px]">
                  <button
                    onClick={toggleFunnel}
                    className=" w-[87px] h-[48px] border-none py-2 rounded-full bg-[#2D2D2D] text-[#FFFFFF] font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      console.log({
                        paymentMethod,
                        currency,
                        region,
                        adTypes,
                        sortBy,
                      });
                      toggleFunnel();
                    }}
                    className="w-[118px] h-[48px] py-2 rounded-full bg-[#2D2D2D] border-none  text-[#4DF2BE] font-semibold"
                  >
                    Apply Filter
                  </button>
                </div>
              </div>
            </div>

            <div
              className=" w-[28px] h-[28px] mt-[5px]  flex items-center  bg-[#2D2D2D] space-x-[15px] rounded-full p-[8px] "
              style={{ border: "1px solid #2D2D2D" }}
            >
              <Image
                src={Repeat}
                alt="repeat"
                className="w-[ 22.75px] h-[ 22.75px] text-[#8F8F8F] ml-[2px] "
              />
            </div>
          </div>
          <div className="flex flex-col space-y-[10px] ml-[-140px] mt-[30px]">
            <div className="flex  mt-[20px] text-[14px] text-[#8F8F8F] font-[400]">
              <p className="w-[228px] h-[20px] ">Seller</p>
              <p className="w-[194px] h-[20px] ml-[10px]">Offer Details</p>
              <p className="w-[261px] h-[20px]">Limits & Payment</p>
            </div>

           {/* --- OFFERS DISPLAY --- */}
      <div className="flex flex-col items-center mt-12 space-y-6">
        {loadingOffers && <p className="text-[#fff]">Loading offers...</p>}
        {errorOffers && <p className="text-[#fff]">{errorOffers}</p>}

        {!loadingOffers &&
          !errorOffers &&
          offers.map((offer, i) => (
            <div
              key={i}
              className="flex bg-[#222222] mt-[10px] ml-[-15px] p-[12px] w-[830px] h-[100px] rounded-[12px]"
            >
              {/* Seller info */}
                <div className="flex  flex-col">
                <div className="flex items-center   w-fit px-[8px] py-[4px] rounded-full">
                  {/*
                    Prefer offer.user.username (server). Fallback to local UserData.
                    Show initial and display username with leading @ if missing.
                  */}
                  {(() => {
                    const rawName =
                      offer?.user?.username ||
                      clientUser?.username ||
                      clientUser?.user?.username ||
                      clientUser?.email ||
                      "User";
                    const username = typeof rawName === "string" ? rawName : String(rawName);
                    const displayName = username ? (username.startsWith("@") ? username : `@${username}`) : "User";
                    const initial = (username && username.length > 0) ? username[0] : "U";
                    return (
                      <>
                        <p className="flex items-center justify-center  rounded-full text-[12px] w-[24px] h-[24px] bg-[#4A4A4A] font-[700] text-[#C7C7C7]">
                          {initial}
                        </p>
                        <p className="ml-[8px] text-[14px] text-[#FCFCFC] font-[500] whitespace-nowrap">
                          {displayName}
                        </p>
                      </>
                    );
                     })()}
                  <Image src={Mark_green} alt="mark" className="ml-[8px] w-[12px] h-[12px]" />
                </div>
                
                <div className="flex text-[14px]  ml-[10px] font-[400] text-[#8F8F8F] space-x-[10px] mt-[5px]">
                  <p className="whitespace-nowrap">Type: {offer.type}</p>
                  <Image src={Divider} alt="divider" className="w-[1px] h-[12px] mt-[15px]" />
                  <div className="flex items-center space-x-[5px]">
                  <Image src={Thumbs} alt="thumbs" className="w-[12px] h-[12px]" />
                  <p className="whitespace-nowrap">Margin: {offer.margin}%</p>
                  </div>
                  <div className="flex items-center space-x-[5px]">
                  <Image src={Timer} alt="timer"  />
                  <p className="whitespace-nowrap">{offer.time}</p> 
                  </div>
                </div>
               
              </div>

              {/* Price section */}
              <div className="flex flex-col ml-[30px] mt-[25px]">
                <p className="text-[12px] whitespace-nowrap mt-[15px] ml-[50%] font-[500] text-[#C7C7C7]">
                 Currency: {offer.currency}{" "}
                </p>
                <div className="flex items-center mt-[-20px] ml-[50%]">
                <p className="text-[14px] ] font-[400] text-[#8F8F8F]">
                  Min: ${offer.minLimit} 
                </p>
                <Image src={Divider} alt="divider" className="w-[1px] h-[12px] mx-[10px]" /> 
                  <p className="text-[14px]  font-[400] text-[#8F8F8F]">
                    Max: ${offer.maxLimit}
                 </p>
               
                </div>
              </div>

              {/* Payment Info */}
              <div className="flex flex-col ml-[30px] mt-[25px]">
                <div className="flex flex-col text-[14px] mt-[15px] ml-[80%] text-[#8F8F8F]">
                  Payment: <p className="text-[#4DF2BE] whitespace-nowrap">{selectedMethod}</p>
                </div>
                <p className=" flex text-[12px] mt-[-70px]  ml-[250%] font-[500] text-[#DBDBDB]">
                 PaymentTerms: {offer.terms}
                </p>
              </div>
    
              {/* Action button */}
             <div className="w-[78px] h-[28px] mt-[60px] ml-[30%] whitespace-nowrap">
                <button
<<<<<<< HEAD
                  className="bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
=======
                  onClick={() => router.push("/buy_btc")}
                  className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
>>>>>>> 3adad660a7379524ab0ad414e8ee1ccd452b24b0
                  style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
                   onClick={() => String(offer.type || "").toLowerCase() === "buy" 
                  ? router.push("/buy_btc")
                  : router.push("/sell_btc")
                  }
                >
                  {String(offer.type || "").toLowerCase() === "buy" ? "Buy" : "Sell"} {offer.crypto}
                 
                </button>
              </div>
            </div>
          ))}
              {/*div for flex in first container*/}{" "}
            </div>

<<<<<<< HEAD
=======
            {/* second container */}
            <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
              <div className="flex mt-[-10px] flex-col">
                <div
                  className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                  style={{ padding: "3px 2px" }}
                >
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">
                    JS
                  </p>
                  <Image src={Vector} alt="vector" className="mt-[20px]" />
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">
                    Jane Smith
                  </p>

                  <Image
                    src={Mark_green}
                    alt="mark"
                    className="ml-[10px] w-[12.541px] h-[12.541px]"
                  />
                </div>
                <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                  <p>150 orders</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  <p>98.75% completion</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  {/*second*/}{" "}
                </div>
                <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                  <Image
                    src={Thumbs}
                    alt="thunbs"
                    className="w-[12px] h-[12px]"
                  />
                  <p>98.00</p>
                  <Image src={Divider} alt="divider" className="mt-[-10px]" />
                  <Image src={Timer} alt="timer" />
                  <p>10 min</p>
                  {/*3rd */}{" "}
                </div>
                {/*div for flex col of a container first row*/}{" "}
              </div>
              <div className="flex mt-[-10px] flex-col ml-[30px]  ">
                <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[12px] font-[500] text-[#FCFCFC]">
                    USD{" "}
                    <span className="text-[18px] font-[700] text-[#FCFCFC]">
                      125,500.00
                    </span>
                  </p>
                </div>
                <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">
                  1 USD = 0.0000120 BTC
                </p>
                {/*div for second column flex-col*/}{" "}
              </div>
              <div className="flex flex-col mt-[-10px] ml-[30px]  ">
                <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    Available:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    30,000{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    {" "}
                    Order limit:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    250.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                  <Image src={Dminus} alt="minus" className="mt-[20px]" />
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    250.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>
                <div className="flex ml-[20px] mt-[-5px]">
                  <Image src={Dpurple} alt="dpurple" className="w-[2px]" />
                  <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">
                    Credit Cards
                  </p>
                </div>

                {/*div for flex col in third column */}
              </div>
              <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
                <button
                  onClick={() => router.push("/buy_btc")}
                  className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
                  style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
                >
                  Buy BTC
                </button>
              </div>
              {/*div for flex in second container*/}{" "}
            </div>

            {/*third container*/}
            <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
              <div className="flex mt-[-10px] flex-col">
                <div
                  className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                  style={{ padding: "3px 2px" }}
                >
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">
                    AJ
                  </p>
                  <Image src={Vector} alt="vector" className="mt-[20px]" />
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">
                    Alice Johnson
                  </p>

                  <Image
                    src={Mark_green}
                    alt="mark"
                    className="ml-[10px] w-[12.541px] h-[12.541px]"
                  />
                </div>
                <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                  <p>80 orders</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  <p>100.00% completion</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  {/*second*/}{" "}
                </div>
                <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                  <Image
                    src={Thumbs}
                    alt="thunbs"
                    className="w-[12px] h-[12px]"
                  />
                  <p>100.00</p>
                  <Image src={Divider} alt="divider" className="mt-[-10px]" />
                  <Image src={Timer} alt="timer" />
                  <p>5 min</p>
                  {/*3rd */}{" "}
                </div>
                {/*div for flex col of a container first row*/}{" "}
              </div>
              <div className="flex mt-[-10px] flex-col ml-[30px]  ">
                <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[12px] font-[500] text-[#FCFCFC]">
                    USD{" "}
                    <span className="text-[18px] font-[700] text-[#FCFCFC]">
                      78,000.00
                    </span>
                  </p>
                </div>
                <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">
                  1 USD = 0.0000085 BTC
                </p>
                {/*div for second column flex-col*/}{" "}
              </div>
              <div className="flex flex-col mt-[-10px] ml-[30px]  ">
                <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    Available:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    40,000{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    {" "}
                    Order limit:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    180.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                  <Image src={Dminus} alt="minus" className="mt-[20px]" />
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    180.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>
                <div className="flex ml-[20px] mt-[-5px]">
                  <Image src={Dpink} alt="dpink" className="w-[2px]" />
                  <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">
                    Wire Transfers
                  </p>
                </div>

                {/*div for flex col in third column */}
              </div>
              <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
                <button
                  onClick={() => router.push("/buy_btc")}
                  className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
                  style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
                >
                  Buy BTC
                </button>
              </div>
              {/*div for flex in third container*/}{" "}
            </div>

            {/*fourth container*/}
            <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
              <div className="flex mt-[-10px] flex-col">
                <div
                  className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                  style={{ padding: "3px 2px" }}
                >
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">
                    BB
                  </p>
                  <Image src={Vector} alt="vector" className="mt-[20px]" />
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">
                    Bob Brown
                  </p>

                  <Image
                    src={Mark_green}
                    alt="mark"
                    className="ml-[10px] w-[12.541px] h-[12.541px]"
                  />
                </div>
                <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                  <p>200 orders</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  <p>95.00% completion</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  {/*second*/}{" "}
                </div>
                <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                  <Image
                    src={Thumbs}
                    alt="thunbs"
                    className="w-[12px] h-[12px]"
                  />
                  <p>95.50</p>
                  <Image src={Divider} alt="divider" className="mt-[-10px]" />
                  <Image src={Timer} alt="timer" />
                  <p>20 min</p>
                  {/*3rd */}{" "}
                </div>
                {/*div for flex col of a container first row*/}{" "}
              </div>
              <div className="flex mt-[-10px] flex-col ml-[30px]  ">
                <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[12px] font-[500] text-[#FCFCFC]">
                    USD{" "}
                    <span className="text-[18px] font-[700] text-[#FCFCFC]">
                      200,000.00
                    </span>
                  </p>
                </div>
                <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">
                  1 USD = 0.0000145 BTC
                </p>
                {/*div for second column flex-col*/}{" "}
              </div>
              <div className="flex flex-col mt-[-10px] ml-[30px]  ">
                <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    Available:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    20,000{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    {" "}
                    Order limit:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    300.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                  <Image src={Dminus} alt="minus" className="mt-[20px]" />
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    300.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>
                <div className="flex ml-[20px] mt-[-5px]">
                  <Image src={Dpink} alt="dpink" className="w-[2px]" />
                  <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">
                    Wire Transfers
                  </p>
                </div>

                {/*div for flex col in third column */}
              </div>
              <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
                <button
                  onClick={() => router.push("/buy_btc")}
                  className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
                  style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
                >
                  Buy BTC
                </button>
              </div>
              {/*div for flex in fourth container*/}{" "}
            </div>

            {/*fifth container*/}
            <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
              <div className="flex mt-[-10px] flex-col">
                <div
                  className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                  style={{ padding: "3px 2px" }}
                >
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">
                    CG
                  </p>
                  <Image src={Vector} alt="vector" className="mt-[20px]" />
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">
                    Charlie Green
                  </p>

                  <Image
                    src={Mark_green}
                    alt="mark"
                    className="ml-[10px] w-[12.541px] h-[12.541px]"
                  />
                </div>
                <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                  <p>120 orders</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  <p>99.50% completion</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  {/*second*/}{" "}
                </div>
                <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                  <Image
                    src={Thumbs}
                    alt="thunbs"
                    className="w-[12px] h-[12px]"
                  />
                  <p>99.00</p>
                  <Image src={Divider} alt="divider" className="mt-[-10px]" />
                  <Image src={Timer} alt="timer" />
                  <p>12 min</p>
                  {/*3rd */}{" "}
                </div>
                {/*div for flex col of a container first row*/}{" "}
              </div>
              <div className="flex mt-[-10px] flex-col ml-[30px]  ">
                <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[12px] font-[500] text-[#FCFCFC]">
                    USD{" "}
                    <span className="text-[18px] font-[700] text-[#FCFCFC]">
                      95,000.00
                    </span>
                  </p>
                </div>
                <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">
                  1 USD = 0.0000110 BTC
                </p>
                {/*div for second column flex-col*/}{" "}
              </div>
              <div className="flex flex-col mt-[-10px] ml-[30px]  ">
                <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    Available:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    25,000{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    {" "}
                    Order limit:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    220.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                  <Image src={Dminus} alt="minus" className="mt-[20px]" />
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    220.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>
                <div className="flex ml-[20px] mt-[-5px]">
                  <Image src={Dgreen} alt="dgreen" className="w-[2px]" />
                  <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">
                    Mobile Payments
                  </p>
                </div>

                {/*div for flex col in third column */}
              </div>
              <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
                <button
                  onClick={() => router.push("/buy_btc")}
                  className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
                  style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
                >
                  Buy BTC
                </button>
              </div>
              {/*div for flex in  fifth container*/}{" "}
            </div>

            {/*sixth container */}
            <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
              <div className="flex mt-[-10px] flex-col">
                <div
                  className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                  style={{ padding: "3px 2px" }}
                >
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">
                    DM
                  </p>
                  <Image src={Vector} alt="vector" className="mt-[20px]" />
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">
                    David Miller
                  </p>

                  <Image
                    src={Mark_green}
                    alt="mark"
                    className="ml-[10px] w-[12.541px] h-[12.541px]"
                  />
                </div>
                <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                  <p>90 orders</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  <p>97.25% completion</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  {/*second*/}{" "}
                </div>
                <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                  <Image
                    src={Thumbs}
                    alt="thunbs"
                    className="w-[12px] h-[12px]"
                  />
                  <p>97.50</p>
                  <Image src={Divider} alt="divider" className="mt-[-10px]" />
                  <Image src={Timer} alt="timer" />
                  <p>8 min</p>
                  {/*3rd */}{" "}
                </div>
                {/*div for flex col of a container first row*/}{" "}
              </div>
              <div className="flex mt-[-10px] flex-col ml-[30px]  ">
                <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[12px] font-[500] text-[#FCFCFC]">
                    USD{" "}
                    <span className="text-[18px] font-[700] text-[#FCFCFC]">
                      85,500.00
                    </span>
                  </p>
                </div>
                <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">
                  1 USD = 0.0000090 BTC
                </p>
                {/*div for second column flex-col*/}{" "}
              </div>
              <div className="flex flex-col mt-[-10px] ml-[30px]  ">
                <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    Available:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    35,000{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    {" "}
                    Order limit:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    190.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                  <Image src={Dminus} alt="minus" className="mt-[20px]" />
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    190.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>
                <div className="flex ml-[20px] mt-[-5px]">
                  <Image src={Dyellow} alt="dyellow" className="w-[2px]" />
                  <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">
                    PayPal
                  </p>
                </div>

                {/*div for flex col in third column */}
              </div>
              <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
                <button
                  onClick={() => router.push("/buy_btc")}
                  className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
                  style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
                >
                  Buy BTC
                </button>
              </div>
              {/*div for flex in  sixth container*/}{" "}
            </div>

            {/*seventh container */}
            <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
              <div className="flex mt-[-10px] flex-col">
                <div
                  className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                  style={{ padding: "3px 2px" }}
                >
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">
                    EM
                  </p>
                  <Image src={Vector} alt="vector" className="mt-[20px]" />
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">
                    Emily Davis
                  </p>

                  <Image
                    src={Mark_green}
                    alt="mark"
                    className="ml-[10px] w-[12.541px] h-[12.541px]"
                  />
                </div>
                <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                  <p>110 orders</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  <p>100.00% completion</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  {/*second*/}{" "}
                </div>
                <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                  <Image
                    src={Thumbs}
                    alt="thunbs"
                    className="w-[12px] h-[12px]"
                  />
                  <p>100.00</p>
                  <Image src={Divider} alt="divider" className="mt-[-10px]" />
                  <Image src={Timer} alt="timer" />
                  <p>7 min</p>
                  {/*3rd */}{" "}
                </div>
                {/*div for flex col of a container first row*/}{" "}
              </div>
              <div className="flex mt-[-10px] flex-col ml-[30px]  ">
                <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[12px] font-[500] text-[#FCFCFC]">
                    USD{" "}
                    <span className="text-[18px] font-[700] text-[#FCFCFC]">
                      88,000.00
                    </span>
                  </p>
                </div>
                <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">
                  1 USD = 0.0000102 BTC
                </p>
                {/*div for second column flex-col*/}{" "}
              </div>
              <div className="flex flex-col mt-[-10px] ml-[30px]  ">
                <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    Available:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    45,000{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    {" "}
                    Order limit:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    210.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                  <Image src={Dminus} alt="minus" className="mt-[20px]" />
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    210.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>
                <div className="flex ml-[20px] mt-[-5px]">
                  <Image src={Dyellow} alt="dyellow" className="w-[2px]" />
                  <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">
                    Bank Transfers
                  </p>
                </div>

                {/*div for flex col in third column */}
              </div>
              <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
                <button
                  onClick={() => router.push("/buy_btc")}
                  className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
                  style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
                >
                  Buy BTC
                </button>
              </div>
              {/*div for flex in  seventh container*/}{" "}
            </div>

            {/*eigth container */}

            <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
              <div className="flex mt-[-10px] flex-col">
                <div
                  className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                  style={{ padding: "3px 2px" }}
                >
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">
                    GH
                  </p>
                  <Image src={Vector} alt="vector" className="mt-[20px]" />
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">
                    Grace Hall
                  </p>

                  <Image
                    src={Mark_green}
                    alt="mark"
                    className="ml-[10px] w-[12.541px] h-[12.541px]"
                  />
                </div>
                <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                  <p>130 orders</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  <p>96.50% completion</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  {/*second*/}{" "}
                </div>
                <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                  <Image
                    src={Thumbs}
                    alt="thunbs"
                    className="w-[12px] h-[12px]"
                  />
                  <p>96.00</p>
                  <Image src={Divider} alt="divider" className="mt-[-10px]" />
                  <Image src={Timer} alt="timer" />
                  <p>11 min</p>
                  {/*3rd */}{" "}
                </div>
                {/*div for flex col of a container first row*/}{" "}
              </div>
              <div className="flex mt-[-10px] flex-col ml-[30px]  ">
                <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[12px] font-[500] text-[#FCFCFC]">
                    USD{" "}
                    <span className="text-[18px] font-[700] text-[#FCFCFC]">
                      92,000.00
                    </span>
                  </p>
                </div>
                <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">
                  1 USD = 0.0000115 BTC
                </p>
                {/*div for second column flex-col*/}{" "}
              </div>
              <div className="flex flex-col mt-[-10px] ml-[30px]  ">
                <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    Available:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    50,000{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    {" "}
                    Order limit:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    230.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                  <Image src={Dminus} alt="minus" className="mt-[20px]" />
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    230.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>
                <div className="flex ml-[20px] mt-[-5px]">
                  <Image src={Dpurple} alt="dpurple" className="w-[2px]" />
                  <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">
                    Credit Cards
                  </p>
                </div>

                {/*div for flex col in third column */}
              </div>
              <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
                <button
                  onClick={() => router.push("/buy_btc")}
                  className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
                  style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
                >
                  Buy BTC
                </button>
              </div>
              {/*div for flex in  eight container*/}{" "}
            </div>

            {/*ninth container */}
            <div className="flex bg-[#222222]  ml-[-15px] p-[12px] w-[809px] h-[100px] rounded-[12px]">
              <div className="flex mt-[-10px] flex-col">
                <div
                  className="flex items-center mt-[20px]  bg-[#4A4A4A] w-[24px] h-[24px]  rounded-full"
                  style={{ padding: "3px 2px" }}
                >
                  <p className="text-[10px] ml-[5px]  font-[700] text-[#8F8F8F] ">
                    IH
                  </p>
                  <Image src={Vector} alt="vector" className="mt-[20px]" />
                  <p className="text-[14px] ml-[10px] text-[#FCFCFC] font-[500] whitespace-nowrap">
                    Isaac Hunter
                  </p>

                  <Image
                    src={Mark_green}
                    alt="mark"
                    className="ml-[10px] w-[12.541px] h-[12.541px]"
                  />
                </div>
                <div className="flex  text-[14px] font-[400] text-[#8F8F8F]  space-x-[10px] whitespace-nowrap">
                  <p>140 orders</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  <p>99.00% completion</p>
                  <Image
                    src={Divider}
                    alt="divider"
                    className="w-[1px] mt-[10px] h-[12px]"
                  />
                  {/*second*/}{" "}
                </div>
                <div className="flex items-center text-[14px] font-[400]  text-[#8F8F8F] mt-[-20px] ml-[5px] space-x-[10px]">
                  <Image
                    src={Thumbs}
                    alt="thunbs"
                    className="w-[12px] h-[12px]"
                  />
                  <p>99.50</p>
                  <Image src={Divider} alt="divider" className="mt-[-10px]" />
                  <Image src={Timer} alt="timer" />
                  <p>9 min</p>
                  {/*3rd */}{" "}
                </div>
                {/*div for flex col of a container first row*/}{" "}
              </div>
              <div className="flex mt-[-10px] flex-col ml-[30px]  ">
                <div className="flex      mt-[50px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[12px] font-[500] text-[#FCFCFC]">
                    USD{" "}
                    <span className="text-[18px] font-[700] text-[#FCFCFC]">
                      102,500.00
                    </span>
                  </p>
                </div>
                <p className="text-[14px] font-[400] mt-[-5px]    text-[#8F8F8F]  space-x-[20px]">
                  1 USD = 0.0000125 BTC
                </p>
                {/*div for second column flex-col*/}{" "}
              </div>
              <div className="flex flex-col mt-[-10px] ml-[30px]  ">
                <div className="flex  ml-[20px] mt-[25px] space-x-[10px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    Available:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    55,000{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>

                <div className="flex  space-x-[5px] ml-[20px] mt-[-20px] whitespace-nowrap">
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    {" "}
                    Order limit:
                  </p>

                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    240.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                  <Image src={Dminus} alt="minus" className="mt-[20px]" />
                  <p className="text-[14px] font-[400] text-[#8F8F8F]">
                    240.00{" "}
                    <span className="text-[14px] font-[400] text-[#8F8F8F]">
                      BTC
                    </span>
                  </p>
                </div>
                <div className="flex ml-[20px] mt-[-5px]">
                  <Image src={Dgreen} alt="dgreen" className="w-[2px]" />
                  <p className="text-[12px] font-[500] ml-[5px] mt-[3px] text-[#DBDBDB]">
                    Mobile Payments
                  </p>
                </div>

                {/*div for flex col in third column */}
              </div>
              <div className="w-[78px] h-[28px] whitespace-nowrap mt-[60px] ml-[55px]">
                <button
                  onClick={() => router.push("/buy_btc")}
                  className=" bg-[#4DF2BE] text-[14px] text-[#0F1012] font-[700] rounded-full"
                  style={{ border: "1px solid #4DF2BE", padding: "8px 10px" }}
                >
                  Buy BTC
                </button>
              </div>
              {/*div for flex in  ninth container*/}{" "}
            </div>

>>>>>>> 3adad660a7379524ab0ad414e8ee1ccd452b24b0
            {/* div of flex-col of container in new line */}
          </div>
          {/*left and right div*/}{" "}
        </div>
        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>

        <div className=" mb-[80px] mt-[30%] ">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Market_place;
