"use client";

import { useState, useEffect } from "react";
import Nav from "../NAV/Nav";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import Less_than from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import Divider from "../../public/Assets/Evolve2p_divider/Divider.svg";
import Thumbs from "../../public/Assets/Evolve2p_thumbs/elements.svg";
import Timer from "../../public/Assets/Evolve2p_timer/elements.svg";
import Dminus from "../../public/Assets/Evolve2p_Dminus/Divider.svg";
import Verified from "../../public/Assets/Evolve2p_verified/Makretplace/elements.svg";
import UPa from "../../public/Assets/Evolve2p_upA/Makretplace/elements.svg";
import CircY from "../../public/Assets/Evolve2p_circY/Makretplace/elements.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import Arrow_great from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import { API_BASE_URL } from "@/config";
import Footer from "../Footer/Footer";
import { countryCurrencyService, CurrencyOption } from "../../utils/countryCurrencyService";

const Offers = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [clientUser, setClientUser] = useState<any>(null);
  const [offer, setOffer] = useState<any>(null);
  const [loadingOffer, setLoadingOffer] = useState(false);
  const [fixedPrice, setFixedPrice] = useState<number | null>(null);
  const [tradePrice, setTradePrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState<string>("USD");
  const [isCreatingTrade, setIsCreatingTrade] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const toggleSeller = () => setIsSellerOpen((prev) => !prev);
  const [payAmount, setPayAmount] = useState<string>("");
  const [receiveAmount, setReceiveAmount] = useState<string>("0.00");

  const [selectedCurrencyData, setSelectedCurrencyData] = useState<CurrencyOption | null>(null);
  const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);

  const tabs = [
    { key: "offers", label: "Active offers" },
    { key: "feedbacks", label: "Feedbacks" },
  ];
  const [activeTab, setActiveTab] = useState("offers");

  // Reset follow status when offer changes (different user)
  useEffect(() => {
    setIsFollowing(false);
  }, [offer?.user?.id]);

  // Follow toggle handler
  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    alert(isFollowing ? 'Unfollowed' : 'Followed');
  };

  // Helper to extract payment details from the offer
  const extractPaymentDetails = (offerData: any) => {
    if (!offerData?.paymentMethod) return null;
    const pm = offerData.paymentMethod;
    if (pm.details) return pm.details;
    if (pm.bank_name || pm.account_number || pm.account_name) return pm;
    if (pm.bankName || pm.accountNumber || pm.accountName) return pm;
    return null;
  };

  // Short display for the payment method (type name only)
  const renderPaymentMethod = (paymentMethod: any): string => {
    if (!paymentMethod) return "N/A";
    if (typeof paymentMethod === 'string') return paymentMethod;
    if (paymentMethod.name) return paymentMethod.name;
    if (paymentMethod.type?.name) return paymentMethod.type.name;
    return "N/A";
  };

  const formatCurrency = (amount: number | undefined | null, currencyCode: string = currency): string => {
    if (amount === undefined || amount === null || isNaN(amount)) return 'Loading...';
    const symbol = selectedCurrencyData?.symbol || '$';
    if (amount < 0.01 && amount > 0) return `${symbol}${amount.toFixed(8)}`;
    if (amount < 1) return `${symbol}${amount.toFixed(4)}`;
    return `${symbol}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  const isPayAmountValid = () => {
    if (!payAmount || payAmount.trim() === "") return false;
    const amount = parseFloat(payAmount);
    if (isNaN(amount) || amount <= 0) return false;
    if (offer && offer.minLimit && offer.maxLimit) {
      return amount >= offer.minLimit && amount <= offer.maxLimit;
    }
    return true;
  };

  const getValidationError = () => {
    if (!payAmount || payAmount.trim() === "") return "";
    const amount = parseFloat(payAmount);
    if (isNaN(amount)) return "Please enter a valid number";
    if (amount <= 0) return "Amount must be greater than 0";
    if (offer && offer.minLimit && offer.maxLimit) {
      if (amount < offer.minLimit) return `Minimum amount is ${formatCurrency(offer.minLimit)}`;
      if (amount > offer.maxLimit) return `Maximum amount is ${formatCurrency(offer.maxLimit)}`;
    }
    return "";
  };

  const isCurrentUserSeller = () => {
    if (!clientUser || !offer || !offer.user) return false;
    const sellerUser = offer.user;
    const currentUserId = clientUser.id || clientUser._id;
    const sellerId = sellerUser.id || sellerUser._id;
    if (currentUserId && sellerId) return currentUserId === sellerId;
    const currentUserEmail = clientUser.email;
    const sellerEmail = sellerUser.email;
    if (currentUserEmail && sellerEmail) return currentUserEmail === sellerEmail;
    const currentUsername = clientUser.username;
    const sellerUsername = sellerUser.username;
    if (currentUsername && sellerUsername) return currentUsername === sellerUsername;
    return false;
  };

  const validateTradeData = () => {
    if (!offer?.id) return "Invalid offer ID";
    const amountFiat = parseFloat(payAmount);
    const amountCrypto = parseFloat(receiveAmount);
    if (isNaN(amountFiat) || amountFiat <= 0) return "Invalid fiat amount";
    if (isNaN(amountCrypto) || amountCrypto <= 0) return "Invalid crypto amount";
    if (offer.minLimit && amountFiat < offer.minLimit - 0.01) return `Amount below minimum limit of ${formatCurrency(offer.minLimit)}`;
    if (offer.maxLimit && amountFiat > offer.maxLimit + 0.01) return `Amount above maximum limit of ${formatCurrency(offer.maxLimit)}`;
    if (!tradePrice) return "Trade price not available";
    return null;
  };

  // Robust trade creation with flexible response parsing
  const createTrade = async () => {
    if (!isPayAmountValid() || !offer || !clientUser) return null;
    try {
      setIsCreatingTrade(true);
      const userDataRaw = localStorage.getItem("UserData");
      let token = "";
      if (userDataRaw) {
        try {
          const userData = JSON.parse(userDataRaw);
          token = userData?.accessToken || userData?.token;
        } catch (e) { /* ignore */ }
      }
      const headers: any = { "Content-Type": "application/json" };
      if (token) headers.Authorization = `Bearer ${token}`;

      const amountFiat = parseFloat(payAmount);
      const amountCrypto = parseFloat(receiveAmount);
      if (isNaN(amountFiat) || isNaN(amountCrypto) || amountFiat <= 0 || amountCrypto <= 0) {
        throw new Error("Invalid amount");
      }
      if (!tradePrice || tradePrice <= 0) throw new Error("Trade price not available");

      const tradeData = {
        offerId: offer.id,
        amountFiat,
        amountCrypto,
        tradePrice,
        currency,
        cryptoType: offer.crypto,
        paymentMethod: offer.paymentMethod,
        pricePerUnit: fixedPrice,
        margin: offer.margin || 0,
        fiatCurrency: currency,
        paymentTimeLimit: offer.paymentTime || "30 minutes"
      };

      const response = await fetch(`${API_BASE_URL}/api/create-trade`, {
        method: "POST",
        headers,
        body: JSON.stringify(tradeData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Trade creation failed: ${errorText}`);
      }

      const result = await response.json();

      // Try to extract the trade object from various possible response structures
      if (result.id) return result; // response is the trade object itself
      if (result.data && result.data.id) return result.data; // wrapped in data
      if (result.trade && result.trade.id) return result.trade; // wrapped in trade
      if (result.success && result.data) return result.data; // { success: true, data: trade }
      if (result.success && result.trade) return result.trade; // { success: true, trade: trade }

      // If we can't find a valid trade object, throw an error
      throw new Error("Invalid trade response format");
    } catch (error) {
      console.error("Trade creation error:", error);
      throw error;
    } finally {
      setIsCreatingTrade(false);
    }
  };

  const getButtonText = () => {
    if (isCreatingTrade) return "Creating Trade...";
    const isSeller = isCurrentUserSeller();
    if (isSeller) return `${offer.type} ${offer.crypto}`;
    const oppositeType = offer.type?.toUpperCase() === 'BUY' ? 'SELL' : 'BUY';
    return `${oppositeType} ${offer.crypto}`;
  };

  const handleTradeAction = async () => {
    if (!isFollowing) {
      alert("You must follow this user to start a trade.");
      return;
    }
    if (!isPayAmountValid()) {
      alert("Please enter a valid amount");
      return;
    }
    const validationError = validateTradeData();
    if (validationError) {
      alert(`Validation error: ${validationError}`);
      return;
    }
    try {
      const trade = await createTrade();
      if (!trade) {
        alert("Trade creation failed: No trade data returned.");
        return;
      }
      const tradeId = trade.id || trade._id;
      if (!tradeId) {
        alert("Trade creation failed: No trade ID returned.");
        return;
      }
      const isSeller = isCurrentUserSeller();
      if (isSeller) {
        router.push(`/prc_sell?tradeId=${tradeId}&offerId=${offer.id}&currency=${currency}&payAmount=${payAmount}`);
      } else {
        if (offer.type?.toUpperCase() === 'SELL') {
          router.push(`/prc_buy?tradeId=${tradeId}&offerId=${offer.id}&currency=${currency}&payAmount=${payAmount}`);
        } else {
          router.push(`/prc_sell?tradeId=${tradeId}&offerId=${offer.id}&currency=${currency}&payAmount=${payAmount}`);
        }
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to create trade");
    }
  };

  const getUserRoleText = () => {
    if (!clientUser || !offer.user) return "";
    const isSeller = isCurrentUserSeller();
    const offerType = offer.type?.toUpperCase();
    if (isSeller) return "You are the owner of this offer";
    return offerType === 'SELL' ? "You are buying from this seller" : "You are selling to this buyer";
  };

  const formatPaymentTerms = (terms: string): string[] => {
    if (!terms) return [];
    return terms.split(/[\n,]/).map(t => t.trim()).filter(t => t.length > 0).map(t => t.startsWith('•') ? t : `• ${t}`);
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  // Load user
  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem("UserData");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setClientUser(parsed.userData ?? parsed);
    } catch (e) { /* ignore */ }
  }, []);

  // Load currency
  useEffect(() => {
    const loadCurrencyData = async () => {
      setLoadingCurrencies(true);
      try {
        await countryCurrencyService.initialize();
        const urlCurrency = searchParams?.get('currency');
        const savedCurrency = localStorage.getItem('selectedCurrency');
        const currencyCode = urlCurrency || savedCurrency || 'USD';
        const currencyData = countryCurrencyService.getCurrencyByCode(currencyCode) ||
          countryCurrencyService.getCurrencyByCode('USD') || null;
        setSelectedCurrencyData(currencyData);
        setCurrency(currencyData?.code || 'USD');
      } catch (error) {
        console.error('Error loading currency:', error);
        setSelectedCurrencyData(null);
      } finally {
        setLoadingCurrencies(false);
      }
    };
    loadCurrencyData();
  }, [searchParams]);

  // Update receive amount
  useEffect(() => {
    if (fixedPrice && payAmount && !isNaN(parseFloat(payAmount))) {
      const amount = parseFloat(payAmount);
      setReceiveAmount((amount / fixedPrice).toFixed(8));
    } else {
      setReceiveAmount("0.00");
    }
  }, [payAmount, fixedPrice]);

  // Fetch offer
  useEffect(() => {
    const fetchOffer = async () => {
      const offerId = params.id;
      if (!offerId) return;
      setLoadingOffer(true);
      try {
        const userDataRaw = localStorage.getItem("UserData");
        let token = "";
        if (userDataRaw) {
          try {
            const userData = JSON.parse(userDataRaw);
            token = userData?.accessToken || userData?.token;
          } catch (e) { /* ignore */ }
        }
        const headers: any = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const res = await fetch(`${API_BASE_URL}/api/get-offer/${offerId}`, { headers });
        if (!res.ok) throw new Error(`API request failed`);
``
        const data = await res.json();
        let offerData = data.data || data.offer || data;
        if (!offerData.id) throw new Error("No offer data");

        let pricePerUnit = offerData.price || offerData.basePrice || null;
        let totalTradePrice = offerData.totalPrice || offerData.tradePrice || offerData.finalPrice || null;
        if (!pricePerUnit && totalTradePrice && offerData.cryptoAmount) {
          pricePerUnit = totalTradePrice / offerData.cryptoAmount;
        }

        setFixedPrice(pricePerUnit);
        setTradePrice(totalTradePrice);
        setPaymentDetails(extractPaymentDetails(offerData));

        const terms = offerData.terms || offerData.paymentTerms || "";

        setOffer({
          id: offerData.id || offerId,
          crypto: offerData.crypto || "BTC",
          currency: offerData.currency || currency,
          margin: offerData.margin || 0,
          minLimit: offerData.minLimit || 0,
          maxLimit: offerData.maxLimit || 0,
          status: offerData.status || "ACTIVE",
          time: offerData.time || "30 minutes",
          createdAt: offerData.createdAt || "",
          paymentMethod: offerData.paymentMethod || "Bank Transfer",
          paymentTerms: terms,
          paymentTime: offerData.paymentTime || "30 minutes",
          type: offerData.type || "SELL",
          completionRate: offerData.completionRate || 100,
          ordersCompleted: offerData.ordersCompleted || 100,
          rating: offerData.rating || 99.99,
          avgReleaseTime: offerData.avgReleaseTime || "15 min",
          price: pricePerUnit,
          tradePrice: totalTradePrice,
          processingFee: offerData.processingFee || 0.0005,
          user: offerData.user || clientUser,
          location: offerData.user?.location || "Nigeria",
        });
      } catch (error) {
        console.error("Error fetching offer:", error);
        setOffer(null);
      } finally {
        setLoadingOffer(false);
      }
    };

    if (currency && !loadingCurrencies) fetchOffer();
  }, [params.id, clientUser, currency, loadingCurrencies]);

  if (loadingOffer || loadingCurrencies) {
    return (
      <main className="min-h-screen bg-[#0F1012] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-xl">Loading offer details...</div>
          <div className="text-sm text-gray-400 mt-2">Please wait</div>
        </div>
      </main>
    );
  }

  if (!offer) {
    return (
      <main className="min-h-screen bg-[#0F1012] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-xl">Offer not found</div>
          <button
            onClick={() => router.push('/market_place')}
            className="mt-4 px-6 py-2 bg-[#4DF2BE] text-[#0F1012] rounded-full font-semibold"
          >
            Back to Marketplace
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Nav />

        {/* Back Button */}
        <div className="flex items-center mt-[20px] gap-2 text-sm lg:text-base font-medium text-white cursor-pointer mb-4 lg:mb-6"
          onClick={() => router.push('/market_place')}>
          <Image src={Less_than} alt="lessthan" className="w-4 h-4" />
          <p>Back to Marketplace</p>
        </div>

        {/* Currency Display */}
        <div className="p-3 bg-[#222222] rounded-lg mb-6">
          <div className="flex flex-wrap items-center gap-2 text-xs lg:text-sm">
            {selectedCurrencyData && (
              <img
                src={selectedCurrencyData.flag}
                alt={`${selectedCurrencyData.country} flag`}
                className="w-4 h-3 rounded object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://flagcdn.com/w320/us.png'; }}
              />
            )}
            <span className="text-[#8F8F8F]">Selected Currency:</span>
            <span className="text-[#4DF2BE] font-semibold">
              {selectedCurrencyData?.code} - {selectedCurrencyData?.name}
            </span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1">
            {/* Seller Info */}
            <div className="bg-[#222222] rounded-xl p-4 lg:p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center bg-[#4A4A4A] w-6 h-6 rounded-full p-1">
                  {(() => {
                    const sellerUser = offer.user || clientUser;
                    const rawName = sellerUser?.username || sellerUser?.email || "Seller";
                    const uname = typeof rawName === "string" ? rawName : String(rawName);
                    const initial = uname.charAt(0).toUpperCase();
                    return <p className="text-xs font-bold text-[#8F8F8F] ml-1">{initial}</p>;
                  })()}
                </div>
                <p className="text-sm lg:text-base text-white font-medium whitespace-nowrap">
                  {(() => {
                    const sellerUser = offer.user || clientUser;
                    const rawName = sellerUser?.username || sellerUser?.email || "Seller";
                    const uname = typeof rawName === "string" ? rawName : String(rawName);
                    return uname.startsWith("@") ? uname : `@${uname}`;
                  })()}
                </p>
                <Image src={Mark_green} alt="mark" className="w-3 h-3" />
                <Image onClick={toggleSeller} src={Arrow_great} alt="greater" className="w-3 h-3 cursor-pointer" />
              </div>

              <div className="flex flex-wrap items-center text-[#C7C7C7] text-xs lg:text-sm font-medium gap-2 mb-4">
                <p>{offer.ordersCompleted} orders</p>
                <Image src={Divider} alt="divider" className="w-px h-3" />
                <p>{offer.completionRate}% completion</p>
                <Image src={Divider} alt="divider" className="w-px h-3" />
                <Image src={Thumbs} alt="thumbs" className="w-3 h-3" />
                <p>{offer.rating}</p>
                <Image src={Divider} alt="divider" className="w-px h-3" />
                <Image src={Timer} alt="timer" className="w-3 h-3" />
                <p>{offer.avgReleaseTime}</p>
              </div>

              <div className="text-sm lg:text-base font-bold text-[#DBDBDB] mb-3">
                1 {offer.crypto} = {fixedPrice ? formatCurrency(fixedPrice) : 'Loading...'}
              </div>

              {tradePrice && (
                <div className="text-sm font-medium text-[#C7C7C7] mb-4">
                  Trade Price: <span className="text-[#4DF2BE] font-bold">{formatCurrency(tradePrice)}</span>
                </div>
              )}

              <div className="flex flex-wrap items-center text-[#C7C7C7] text-sm gap-2 mb-4">
                <p>Order limit:</p>
                <p>{formatCurrency(offer.minLimit)}</p>
                <Image src={Dminus} alt="minus" className="w-3 h-3" />
                <p>{formatCurrency(offer.maxLimit)}</p>
              </div>

              {/* Dynamic verification badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {offer.user?.emailVerified !== undefined && (
                  <div className="flex items-center gap-2 bg-[#3A3A3A] px-3 py-1 rounded-2xl">
                    <Image src={Verified} alt="ver" className="w-3 h-3" />
                    <p className="text-[#DBDBDB] text-xs font-medium">
                      {offer.user.emailVerified ? "Email Verified" : "Email Not Verified"}
                    </p>
                  </div>
                )}
                {offer.user?.idVerified !== undefined && (
                  <div className="flex items-center gap-2 bg-[#3A3A3A] px-3 py-1 rounded-2xl">
                    <Image src={Verified} alt="ver" className="w-3 h-3" />
                    <p className="text-[#DBDBDB] text-xs font-medium">
                      {offer.user.idVerified ? "ID Verified" : "ID Not Verified"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Offer Terms Section */}
            <div className="bg-[#2D2D2D] rounded-xl p-4 lg:p-6">
              <div>
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setIsTermsOpen(!isTermsOpen)}
                >
                  <p className="text-sm lg:text-base font-bold text-white">
                    Offer Terms (please read carefully)
                  </p>
                  <Image
                    src={UPa}
                    alt="up"
                    className={`transition-transform duration-300 ${isTermsOpen ? "rotate-180" : "rotate-0"} w-4 h-4`}
                  />
                </div>

                {isTermsOpen && (
                  <div className="mt-3">
                    {offer.paymentTerms ? (
                      <ul className="text-[#DBDBDB] text-sm space-y-2 font-medium">
                        {formatPaymentTerms(offer.paymentTerms).map((term, index) => (
                          <li key={index}>{term}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-[#DBDBDB] text-sm font-medium">
                        No specific terms provided by the seller.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex-1 max-w-lg lg:max-w-none">
            {/* Price Summary */}
            <div className="bg-[#222222] rounded-lg p-4 mb-4">
              <div className="flex items-center gap-3">
                <Image src={CircY} alt="circ" className="w-6 h-6" />
                <div className="flex flex-col">
                  <p className="text-sm lg:text-base font-medium text-[#DBDBDB]">
                    1 {offer.crypto} = {fixedPrice ? formatCurrency(fixedPrice) : 'Loading...'}
                  </p>
                  {tradePrice && (
                    <p className="text-xs lg:text-sm font-medium text-[#4DF2BE] mt-1">
                      Total Trade Price: {formatCurrency(tradePrice)}
                    </p>
                  )}
                  <p className="text-xs lg:text-sm font-medium text-[#C7C7C7] mt-1">
                    Processing fee = {offer.processingFee} {offer.crypto}
                  </p>
                </div>
              </div>
            </div>

            {/* You Pay */}
            <div className="bg-[#222222] rounded-xl p-4 mb-4">
              <div>
                <div className="text-[#C7C7C7] text-sm font-medium mb-3">You pay</div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={payAmount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        if (value.split('.').length <= 2) setPayAmount(value);
                      }}
                      className="text-white text-xl lg:text-2xl font-bold bg-transparent border-none outline-none w-32 lg:w-48"
                      placeholder="0.00"
                    />
                    <span className="text-[#C7C7C7] font-normal text-xl lg:text-2xl">|</span>
                  </div>
                  <div className="flex items-center bg-[#2D2D2D] gap-2 px-3 py-1 rounded-full">
                    {selectedCurrencyData && (
                      <img src={selectedCurrencyData.flag} alt={`${selectedCurrencyData.country} flag`} className="w-4 h-3 rounded object-cover" />
                    )}
                    <p className="text-[#DBDBDB] text-sm font-bold">{selectedCurrencyData?.code || currency}</p>
                  </div>
                </div>
                <div className="text-sm font-medium text-[#C7C7C7]">
                  1 {currency} = <span className="text-[#DBDBDB]">
                    {fixedPrice ? (1 / fixedPrice).toFixed(8) : "0.00000000"} {offer.crypto}
                  </span>
                </div>
              </div>
            </div>

            {/* You Receive */}
            <div className="bg-[#222222] rounded-xl p-4 mb-4">
              <div>
                <div className="text-[#C7C7C7] text-sm font-medium mb-3">You Receive</div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-xl lg:text-2xl font-bold">{receiveAmount}</p>
                    <span className="text-[#C7C7C7] font-normal text-xl lg:text-2xl">|</span>
                  </div>
                  <div className="flex items-center bg-[#2D2D2D] gap-2 px-3 py-1 rounded-full">
                    <Image
                      src={offer.crypto === "BTC" ? BTC : offer.crypto === "ETH" ? ETH : offer.crypto === "USDT" ? USDT : offer.crypto === "USDC" ? USDC : BTC}
                      alt="crypto"
                      className="w-6 h-6"
                    />
                    <p className="text-[#DBDBDB] text-sm font-bold">{offer.crypto}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Limit and Payment Info */}
            <div className="flex flex-col gap-px mb-6">
              <div className="flex items-center justify-between w-full h-12 bg-[#2D2D2D] px-4 rounded-t-lg">
                <p className="text-sm lg:text-base font-normal text-[#DBDBDB]">Limit</p>
                <p className="text-sm lg:text-base font-medium text-white">
                  {formatCurrency(offer.minLimit)} - {formatCurrency(offer.maxLimit)}
                </p>
              </div>

              {/* Payment line – short display */}
              <div className="flex items-center justify-between w-full h-12 bg-[#2D2D2D] px-4 border-l-2 border-l-[#FFFA66]">
                <p className="text-sm lg:text-base font-normal text-[#DBDBDB]">Payment</p>
                <p className="text-sm lg:text-base font-medium text-white">
                  {renderPaymentMethod(offer.paymentMethod)}
                </p>
              </div>

              {/* Payment details – only shown to counterparty */}
              {paymentDetails && !isCurrentUserSeller() && (
                <div className="mt-2 p-3 bg-[#2D2D2D] rounded-lg border border-[#3A3A3A]">
                  <p className="text-xs font-semibold text-[#8F8F8F] uppercase mb-2">
                    {offer.type?.toUpperCase() === 'SELL' ? "Seller's Payment Details" : "Buyer's Payment Details"}
                  </p>
                  {Object.entries(paymentDetails).map(([key, value]) => {
                    if (!value || key === 'id' || key === '_id' || key === 'typeId' || key === 'userId') return null;
                    return (
                      <div key={key} className="flex justify-between text-sm py-1">
                        <span className="text-[#DBDBDB] capitalize">{key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:</span>
                        <span className="text-white font-medium">{String(value)}</span>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Placeholder for counterparty when details missing */}
              {!paymentDetails && !isCurrentUserSeller() && (
                <div className="mt-2 p-3 bg-[#2D2D2D] rounded-lg border border-[#3A3A3A] opacity-60">
                  <p className="text-xs text-[#8F8F8F] italic">
                    Payment details will appear here after you start the trade.
                  </p>
                </div>
              )}

              <div className="flex items-center justify-between w-full h-12 bg-[#2D2D2D] px-4 rounded-b-lg">
                <p className="text-sm lg:text-base font-normal text-[#DBDBDB]">Time limit</p>
                <p className="text-sm lg:text-base font-medium text-white">{offer.paymentTime}</p>
              </div>
            </div>

            {/* Buy/Sell Button */}
            <div className="flex justify-center">
              <button
                className={`flex items-center justify-center w-full lg:w-80 h-12 border-2 rounded-full font-bold text-sm lg:text-base transition-all duration-200 ${
                  isPayAmountValid() && !isCreatingTrade
                    ? "border-[#4DF2BE] bg-[#4DF2BE] text-[#0F1012] cursor-pointer hover:bg-[#3DE0A8]"
                    : "border-[#4A4A4A] bg-[#2D2D2D] text-[#8F8F8F] cursor-not-allowed"
                }`}
                onClick={handleTradeAction}
                disabled={!isPayAmountValid() || isCreatingTrade}
              >
                {getButtonText()}
              </button>
            </div>

            {payAmount !== "" && (
              <div className={`text-center mt-3 text-sm ${isPayAmountValid() ? "text-[#4DF2BE]" : "text-[#FF6B6B]"}`}>
                {isPayAmountValid() ? "Amount is within limits ✓" : getValidationError()}
              </div>
            )}

            {clientUser && offer.user && (
              <div className="text-center mt-2 text-xs text-[#8F8F8F]">{getUserRoleText()}</div>
            )}

            {tradePrice && (
              <div className="text-center mt-4 text-xs text-[#8F8F8F]">Trade Price: {formatCurrency(tradePrice)}</div>
            )}
          </div>
        </div>

        {/* User Details Modal */}
        {isSellerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[#0F1012] rounded-xl w-full max-w-lg lg:max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 lg:p-6">
                <p className="text-base lg:text-lg font-bold text-white">
                  {offer.type?.toUpperCase() === 'SELL' ? 'Seller' : 'Buyer'} details
                </p>
                <Image src={Times} alt="Close" width={24} height={24} className="cursor-pointer w-6 h-6 lg:w-8 lg:h-8" onClick={toggleSeller} />
              </div>

              <div className="bg-[#1A1A1A] p-4 lg:p-6 max-h-[60vh] overflow-y-auto space-y-4 lg:space-y-6">
                {/* Header Profile Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center bg-[#4A4A4A] w-6 h-6 rounded-full p-1 mr-3">
                      <p className="text-xs font-bold text-[#8F8F8F] ml-1">
                        {(offer.user?.username || offer.user?.email || "User").charAt(0).toUpperCase()}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm lg:text-base text-white font-medium whitespace-nowrap">
                        @{offer.user?.username || offer.user?.email || "User"}
                      </p>
                      <p className="text-sm font-medium text-[#C7C7C7]">Online</p>
                    </div>
                    <Image src={Mark_green} alt="mark" className="ml-2 w-3 h-3" />
                  </div>
                  <button
                    onClick={handleFollowToggle}
                    className={`w-20 h-10 rounded-full border text-sm font-bold transition-colors ${
                      isFollowing
                        ? 'bg-[#4DF2BE] text-[#0F1012] border-[#4DF2BE] hover:bg-[#3DD2A5]'
                        : 'bg-[#2D2D2D] text-[#4DF2BE] border-[#2D2D2D] hover:bg-[#3A3A3A]'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>

                {/* Badges – only email and ID verification */}
                <div className="flex flex-wrap gap-3">
                  {offer.user?.emailVerified !== undefined && (
                    <span className="text-sm font-medium text-[#DBDBDB] flex items-center">
                      <Image src={Verified} alt="ver" className="mr-1 w-3 h-3" />
                      {offer.user.emailVerified ? "Email Verified" : "Email Not Verified"}
                    </span>
                  )}
                  {offer.user?.idVerified !== undefined && (
                    <span className="text-sm font-medium text-[#DBDBDB] flex items-center">
                      <Image src={Verified} alt="ver" className="mr-1 w-3 h-3" />
                      {offer.user.idVerified ? "ID Verified" : "ID Not Verified"}
                    </span>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col bg-[#2D2D2D] p-3 items-center rounded-lg">
                    <p className="text-base font-medium text-white">{offer.ordersCompleted}</p>
                    <p className="text-sm font-medium text-[#C7C7C7]">Trades Completed</p>
                  </div>
                  <div className="flex flex-col bg-[#2D2D2D] p-3 items-center rounded-lg">
                    <p className="text-base font-medium text-white">{offer.completionRate}%</p>
                    <p className="text-sm font-medium text-[#C7C7C7]">Completion Rate</p>
                  </div>
                  <div className="flex flex-col bg-[#2D2D2D] p-3 items-center rounded-lg">
                    <p className="text-base font-medium text-white">{offer.avgReleaseTime}</p>
                    <p className="text-sm font-medium text-[#C7C7C7]">Avg. Release Time</p>
                  </div>
                </div>

                <div className="w-full h-px bg-[#2D2D2D]"></div>

                {/* Info */}
                <p className="font-bold text-[#C7C7C7] text-base">Info</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-[#2D2D2D] rounded-lg h-10 px-3">
                    <p className="text-sm text-[#DBDBDB] font-medium">Joined</p>
                    <p className="text-sm text-white font-medium">
                      {formatDate(offer.user?.createdAt || offer.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center justify-between bg-[#2D2D2D] rounded-lg h-10 px-3">
                    <p className="text-sm text-[#DBDBDB] font-medium">Location</p>
                    <p className="text-sm text-white font-medium">{offer.location || "Nigeria"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-[100%] h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        <div className="mb-[80px] mt-[10%]"><Footer /></div>
      </div>
    </main>
  );
};

export default Offers;