"use client";

import { useState, useEffect } from "react";
import Nav from "../../components/NAV/Nav";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import Vector from "../../public/Assets/Evolve2p_vector/vector.svg";
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
import Footer from "../../components/Footer/Footer";
import { countryCurrencyService, CurrencyOption } from "../../utils/countryCurrencyService";
import { useNotifications } from "../../Context/provider";

interface User {
  id?: string;
  _id?: string;
  userId?: string;
  username?: string;
  email?: string;
  name?: string;
  [key: string]: any;
}

interface Offer {
  id: string;
  crypto: string;
  currency: string;
  margin: number;
  minLimit: number;
  maxLimit: number;
  status: string;
  time: string;
  createdAt: string;
  paymentMethod: string;
  paymentTerms: string;
  paymentTime: string;
  type: string;
  completionRate: number;
  ordersCompleted: number;
  rating: number;
  avgReleaseTime: string;
  price: number | null;
  tradePrice: number | null;
  processingFee: number;
  user?: User;
  sellerId?: string;
  userId?: string;
}

// Create a default currency option that matches the CurrencyOption type
const DEFAULT_CURRENCY: CurrencyOption = {
  code: 'USD',
  symbol: '$',
  name: 'US Dollar',
  country: 'United States',
  countryCode: 'US',
  flag: 'https://flagcdn.com/w320/us.png'
};

// Helper function to safely extract string from any value
const getSafeString = (value: any): string => {
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'boolean') return String(value);
  if (value === null || value === undefined) return '';
  
  if (typeof value === 'object') {
    // If it's an object with a name property
    if (value.name && typeof value.name === 'string') {
      return value.name;
    }
    // If it's an object with a username property
    if (value.username && typeof value.username === 'string') {
      return value.username;
    }
    // If it's an object with an email property
    if (value.email && typeof value.email === 'string') {
      return value.email;
    }
    // Try to stringify if it's a simple object
    try {
      return JSON.stringify(value);
    } catch {
      return '';
    }
  }
  
  return '';
};

const Offers = () => {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  
  const { sendNotification, saveTradeToLocalStorage } = useNotifications();
  
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [clientUser, setClientUser] = useState<User | null>(null);
  const [offer, setOffer] = useState<Offer | null>(null);
  const [loadingOffer, setLoadingOffer] = useState(true);
  const [fixedPrice, setFixedPrice] = useState<number | null>(null);
  const [tradePrice, setTradePrice] = useState<number | null>(null);
  const [currency, setCurrency] = useState("USD");
  const [isCreatingTrade, setIsCreatingTrade] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const [payAmount, setPayAmount] = useState("");
  const [receiveAmount, setReceiveAmount] = useState("0.00");
  const [selectedCurrencyData, setSelectedCurrencyData] = useState<CurrencyOption | null>(DEFAULT_CURRENCY);
  const [loadingCurrencies, setLoadingCurrencies] = useState(true);

  // Helper: Get username from user object
  const getUsername = (user: User | null): string => {
    if (!user) return "Unknown User";
    
    // Use getSafeString for each property
    const username = getSafeString(user.username);
    const email = getSafeString(user.email);
    const name = getSafeString(user.name);
    
    return username || email || name || "Unknown User";
  };

  // Helper: Extract seller ID from offer
  const getSellerIdFromOffer = (offer: Offer | null): string | null => {
    if (!offer) return null;
    if (offer.user?.id) return getSafeString(offer.user.id);
    if (offer.sellerId) return getSafeString(offer.sellerId);
    if (offer.userId) return getSafeString(offer.userId);
    return null;
  };

  // Helper: Get current user ID
  const getCurrentUserId = (): string | null => {
    if (!clientUser) return null;
    return getSafeString(clientUser.id) || getSafeString(clientUser._id) || getSafeString(clientUser.userId) || null;
  };

  // Helper: Get currency symbol safely
  const getCurrencySymbol = (): string => {
    if (!selectedCurrencyData) return '$';
    
    const symbol = selectedCurrencyData.symbol;
    
    // Handle different possible symbol formats
    if (typeof symbol === 'string') {
      return symbol.trim() || '$';
    } else if (symbol && typeof symbol === 'object') {
      // If symbol is an object, try to get a string representation
      try {
        return JSON.stringify(symbol);
      } catch {
        return '$';
      }
    }
    
    return '$';
  };

  // Helper: Format currency
  const formatCurrency = (amount: number | undefined | null): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return 'Loading...';
    }
    
    const symbol = getCurrencySymbol();
    
    if (amount < 0.01 && amount > 0) {
      return `${symbol}${amount.toFixed(8)}`;
    } else if (amount < 1) {
      return `${symbol}${amount.toFixed(4)}`;
    } else {
      return `${symbol}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }
  };

  // Helper: Get seller display info - COMPLETELY REWRITTEN
  const getSellerDisplayInfo = (userObj: User | undefined | null) => {
    if (!userObj || typeof userObj !== 'object') {
      return { displayName: "@Seller", initial: "S" };
    }
    
    // Check if the object itself is the problematic {id, name, createdAt} object
    console.log('User object for display:', userObj);
    
    // Extract name safely
    let nameValue = '';
    
    // First, check if userObj itself has name/username properties
    if (userObj.name && typeof userObj.name === 'string') {
      nameValue = userObj.name;
    } else if (userObj.username && typeof userObj.username === 'string') {
      nameValue = userObj.username;
    } else if (userObj.email && typeof userObj.email === 'string') {
      nameValue = userObj.email;
    } else if (typeof userObj === 'string') {
      nameValue = userObj;
    } else if (userObj && typeof userObj === 'object') {
      // Check if any property is a string
      for (const key in userObj) {
        if (typeof userObj[key] === 'string' && key !== 'id' && key !== 'createdAt') {
          nameValue = userObj[key];
          break;
        }
      }
    }
    
    // If we still don't have a name, use fallback
    if (!nameValue || nameValue.trim() === '') {
      nameValue = "Seller";
    }
    
    // Clean up the name
    const displayName = nameValue.split('@')[0]; // Remove email domain if present
    const initial = displayName.charAt(0).toUpperCase();
    const prefixedName = displayName.startsWith("@") ? displayName : `@${displayName}`;
    
    return { 
      displayName: prefixedName.length > 20 ? prefixedName.substring(0, 20) + '...' : prefixedName, 
      initial 
    };
  };

  // Check if pay amount is valid
  const isPayAmountValid = (): boolean => {
    if (!payAmount || payAmount.trim() === "") return false;
    const amount = parseFloat(payAmount);
    
    if (isNaN(amount) || amount <= 0) return false;
    
    if (offer && offer.minLimit !== undefined && offer.maxLimit !== undefined) {
      return amount >= offer.minLimit && amount <= offer.maxLimit;
    }
    
    return true;
  };

  // Create trade function
  const createTrade = async (): Promise<any> => {
    if (!isPayAmountValid() || !offer || !clientUser) {
      alert("Please enter a valid amount");
      return null;
    }

    try {
      setIsCreatingTrade(true);
      
      const userDataRaw = localStorage.getItem("UserData");
      let token = "";

      if (userDataRaw) {
        try {
          const userData = JSON.parse(userDataRaw);
          token = userData?.accessToken || userData?.token;
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }

      const amountFiat = parseFloat(payAmount);
      const amountCrypto = parseFloat(receiveAmount);

      if (isNaN(amountFiat) || isNaN(amountCrypto) || amountFiat <= 0 || amountCrypto <= 0) {
        throw new Error("Invalid amount values");
      }

      if (!tradePrice || tradePrice <= 0) {
        throw new Error("Trade price not available");
      }

      const currentUserId = getCurrentUserId();
      const sellerId = getSellerIdFromOffer(offer);

      if (!currentUserId) throw new Error("Could not determine your user ID");
      if (!sellerId) throw new Error("Could not determine seller ID");

      const tradeData = {
        offerId: offer.id,
        amountFiat: amountFiat,
        amountCrypto: amountCrypto,
        tradePrice: tradePrice,
        currency: currency,
        cryptoType: offer.crypto,
        paymentMethod: offer.paymentMethod,
        pricePerUnit: fixedPrice,
        margin: offer.margin || 0,
        fiatCurrency: currency,
        paymentTimeLimit: offer.paymentTime || "30 minutes",
        buyerId: currentUserId,
        sellerId: sellerId,
        initiatorId: currentUserId
      };

      const response = await fetch(
        "https://evolve2p-backend.onrender.com/api/create-trade",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: JSON.stringify(tradeData),
        }
      );

      if (!response.ok) {
        throw new Error(`Trade creation failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        return result.data;
      } else if (result.trade) {
        return result.trade;
      } else {
        throw new Error("No trade data returned");
      }
    } catch (error) {
      console.error("Error creating trade:", error);
      throw error;
    } finally {
      setIsCreatingTrade(false);
    }
  };

  // Handle trade action
  const handleTradeAction = async (): Promise<void> => {
    try {
      const trade = await createTrade();
      
      if (trade) {
        saveTradeToLocalStorage(trade);
        
        const currentUserId = getCurrentUserId();
        const sellerId = getSellerIdFromOffer(offer);
        
        if (currentUserId && sellerId) {
          const isSeller = currentUserId === sellerId;
          const recipientId = isSeller ? (trade.buyerId || trade.initiatorId) : sellerId;
          
          if (recipientId) {
            const notificationData = {
              type: 'NEW_TRADE_REQUEST' as const,
              tradeId: trade.id || trade._id,
              offerId: offer?.id || '',
              initiatorId: currentUserId,
              initiatorUsername: getUsername(clientUser),
              amountFiat: parseFloat(payAmount),
              amountCrypto: parseFloat(receiveAmount),
              currency: currency,
              crypto: offer?.crypto || 'BTC',
              message: `${getUsername(clientUser)} wants to ${isSeller ? 'sell' : 'buy'} ${receiveAmount} ${offer?.crypto || 'crypto'}`,
              recipientId: recipientId
            };
            
            // Await and check notification result
            const notifId = await sendNotification(notificationData);
            
            if (notifId) {
              setSuccessMessage(`Trade created! Notification sent to ${isSeller ? 'buyer' : 'seller'}.`);
              console.log('Notification sent with ID:', notifId);
            } else {
              setSuccessMessage("Trade created! (Notification may not have been delivered)");
              console.warn("Notification send returned null");
            }
          }
        } else {
          setSuccessMessage("Trade created!");
        }
        
        setShowSuccess(true);
        
        setTimeout(() => {
          const tradeId = trade.id || trade._id;
          if (tradeId) {
            const currentUserId = getCurrentUserId();
            const sellerId = getSellerIdFromOffer(offer);
            const isSeller = currentUserId === sellerId;
            
            if (isSeller) {
              router.push(`/prc_sell?tradeId=${tradeId}`);
            } else {
              router.push(`/prc_buy?tradeId=${tradeId}`);
            }
          }
        }, 2000);
      }
    } catch (error) {
      console.error("Trade creation failed:", error);
      alert(error instanceof Error ? error.message : "Unknown error occurred");
    }
  };

  // Get button text
  const getButtonText = (): string => {
    if (isCreatingTrade) return "Creating Trade...";
    
    const currentUserId = getCurrentUserId();
    const sellerId = getSellerIdFromOffer(offer);
    const isSeller = currentUserId === sellerId;
    
    if (isSeller) {
      return `${offer?.type} ${offer?.crypto}`;
    } else {
      const oppositeType = offer?.type?.toUpperCase() === 'BUY' ? 'SELL' : 'BUY';
      return `${oppositeType} ${offer?.crypto}`;
    }
  };

  // Load client user
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const raw = localStorage.getItem("UserData");
    if (!raw) {
      router.push("/login");
      return;
    }
    
    try {
      const parsed = JSON.parse(raw);
      let userData: User | null = null;
      
      if (parsed.userData) userData = parsed.userData;
      else if (parsed.data) userData = parsed.data;
      else if (parsed.user) userData = parsed.user;
      else userData = parsed;
      
      setClientUser(userData);
    } catch (e) {
      console.error("Error setting client user:", e);
      router.push("/login");
    }
  }, [router]);

  // Load currency data
  useEffect(() => {
    const loadCurrencyData = async () => {
      setLoadingCurrencies(true);
      try {
        await countryCurrencyService.initialize();
        
        const urlCurrency = searchParams?.get('currency');
        const savedCurrency = localStorage.getItem('selectedCurrency');
        const currencyCode = urlCurrency || savedCurrency || 'USD';
        
        const currencyData = countryCurrencyService.getCurrencyByCode(currencyCode) 
          || countryCurrencyService.getCurrencyByCode('USD') 
          || DEFAULT_CURRENCY;
        
        // Ensure symbol is a string
        if (currencyData && currencyData.symbol && typeof currencyData.symbol !== 'string') {
          currencyData.symbol = String(currencyData.symbol);
        }
        
        setSelectedCurrencyData(currencyData);
        setCurrency(currencyData?.code || 'USD');
        
      } catch (error) {
        console.error('Error loading currency data:', error);
        setSelectedCurrencyData(DEFAULT_CURRENCY);
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
      const calculatedReceive = (amount / fixedPrice).toFixed(8);
      setReceiveAmount(calculatedReceive);
    } else {
      setReceiveAmount("0.00");
    }
  }, [payAmount, fixedPrice]);

  // Fetch offer - FIXED to handle object in user data
  useEffect(() => {
    const fetchOffer = async () => {
      const offerId = params.id as string;

      if (!offerId) {
        console.error("No offer ID found");
        setLoadingOffer(false);
        return;
      }

      setLoadingOffer(true);
      try {
        const userDataRaw = localStorage.getItem("UserData");
        let token = "";

        if (userDataRaw) {
          try {
            const userData = JSON.parse(userDataRaw);
            token = userData?.accessToken || userData?.token;
          } catch (e) {
            console.error("Error parsing user data");
          }
        }

        const headers: Record<string, string> = { "Content-Type": "application/json" };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const res = await fetch(
          `https://evolve2p-backend.onrender.com/api/get-offer/${offerId}`,
          {
            method: "GET",
            headers: headers,
          }
        );

        if (!res.ok) {
          throw new Error(`API request failed: ${res.status}`);
        }

        const data = await res.json();
        console.log('API Response:', data); // Debug log

        let offerData: any = null;

        if (data.data) {
          offerData = data.data;
        } else if (data.offer) {
          offerData = data.offer;
        } else if (data.id) {
          offerData = data;
        } else {
          throw new Error("No offer data found");
        }

        // Debug the user object
        if (offerData.user) {
          console.log('User object from API:', offerData.user);
          console.log('Type of user.name:', typeof offerData.user?.name);
          console.log('Type of user.username:', typeof offerData.user?.username);
        }

        let pricePerUnit: number | null = null;
        let totalTradePrice: number | null = null;

        if (offerData.price) {
          pricePerUnit = parseFloat(offerData.price);
        } else if (offerData.basePrice) {
          pricePerUnit = parseFloat(offerData.basePrice);
        }

        if (offerData.totalPrice) {
          totalTradePrice = parseFloat(offerData.totalPrice);
        } else if (offerData.tradePrice) {
          totalTradePrice = parseFloat(offerData.tradePrice);
        } else if (offerData.finalPrice) {
          totalTradePrice = parseFloat(offerData.finalPrice);
        }

        if (!pricePerUnit && totalTradePrice && offerData.cryptoAmount) {
          pricePerUnit = totalTradePrice / parseFloat(offerData.cryptoAmount);
        }

        setFixedPrice(pricePerUnit);
        setTradePrice(totalTradePrice);

        // Create a safe user object
        let safeUser: User | undefined = undefined;
        if (offerData.user) {
          safeUser = {
            id: getSafeString(offerData.user.id),
            _id: getSafeString(offerData.user._id),
            userId: getSafeString(offerData.user.userId),
            username: getSafeString(offerData.user.username),
            email: getSafeString(offerData.user.email),
            name: getSafeString(offerData.user.name)
          };
          
          // If name is still an object, set it to empty string
          if (safeUser.name && typeof safeUser.name === 'object') {
            safeUser.name = '';
          }
        }

        setOffer({
          id: getSafeString(offerData.id) || offerId,
          crypto: getSafeString(offerData.crypto) || "BTC",
          currency: getSafeString(offerData.currency) || currency,
          margin: parseFloat(getSafeString(offerData.margin)) || 0,
          minLimit: parseFloat(getSafeString(offerData.minLimit)) || 0,
          maxLimit: parseFloat(getSafeString(offerData.maxLimit)) || 0,
          status: getSafeString(offerData.status) || "ACTIVE",
          time: getSafeString(offerData.time) || "30 minutes",
          createdAt: getSafeString(offerData.createdAt) || "",
          paymentMethod: getSafeString(offerData.paymentMethod) || "Bank Transfer",
          paymentTerms: getSafeString(offerData.paymentTerms) || "",
          paymentTime: getSafeString(offerData.paymentTime) || "30 minutes",
          type: getSafeString(offerData.type) || "SELL",
          completionRate: parseFloat(getSafeString(offerData.completionRate)) || 100,
          ordersCompleted: parseFloat(getSafeString(offerData.ordersCompleted)) || 100,
          rating: parseFloat(getSafeString(offerData.rating)) || 99.99,
          avgReleaseTime: getSafeString(offerData.avgReleaseTime) || "15 min",
          price: pricePerUnit,
          tradePrice: totalTradePrice,
          processingFee: parseFloat(getSafeString(offerData.processingFee)) || 0.0005,
          user: safeUser,
          sellerId: getSafeString(offerData.sellerId),
          userId: getSafeString(offerData.userId)
        });

      } catch (error) {
        console.error("Error fetching offer:", error);
        setOffer(null);
      } finally {
        setLoadingOffer(false);
      }
    };

    if (currency && !loadingCurrencies) {
      fetchOffer();
    }
  }, [params.id, currency, loadingCurrencies]);

  // Debug effect to check what's causing the error
  useEffect(() => {
    if (offer && offer.user) {
      console.log('Final offer.user object:', offer.user);
      console.log('offer.user.name value:', offer.user.name);
      console.log('Type of offer.user.name:', typeof offer.user.name);
      
      // Check each property
      Object.entries(offer.user).forEach(([key, value]) => {
        console.log(`offer.user.${key}:`, value, 'Type:', typeof value);
      });
    }
  }, [offer]);

  if (loadingOffer || loadingCurrencies) {
    return (
      <main className="min-h-screen bg-[#0F1012] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-xl">Loading offer details...</div>
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

  const sellerInfo = getSellerDisplayInfo(offer.user);
  console.log('Seller info:', sellerInfo); // Debug log

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed top-4 right-4 z-50 animate-slideIn">
          <div className="bg-[#222222] border border-[#4DF2BE] rounded-lg p-4 shadow-2xl max-w-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-[#4DF2BE]/20 rounded-full flex items-center justify-center">
                <span className="text-[#4DF2BE] font-bold">✓</span>
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">Success!</p>
                <p className="text-sm text-[#C7C7C7] mt-1">{successMessage}</p>
              </div>
              <button
                onClick={() => setShowSuccess(false)}
                className="text-[#8F8F8F] hover:text-white"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Nav />

        {/* Back Button */}
        <div className="flex items-center mt-[20px] gap-2 text-sm lg:text-base font-medium text-white cursor-pointer mb-4 lg:mb-6"
          onClick={() => router.push('/market_place')}>
          <Image src={Less_than} alt="lessthan" className="w-4 h-4" />
          <p>Back to Marketplace</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1">
            {/* Seller Info Container - FIXED to handle object */}
            <div className="bg-[#222222] rounded-xl p-4 lg:p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center bg-[#4A4A4A] w-6 h-6 rounded-full p-1">
                  <p className="text-xs font-bold text-[#8F8F8F] ml-1">
                    {sellerInfo.initial}
                  </p>
                  <Image src={Vector} alt="vector" className="ml-1 w-2 h-2" />
                </div>
                {/* SAFE RENDERING - This was causing the error */}
                <div className="text-sm lg:text-base text-white font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                  {(() => {
                      const display = sellerInfo.displayName;
                      if (typeof display === 'string') {
                        return display;
                      }
                      return '@Seller';
                    })()}
                </div>
                <Image src={Mark_green} alt="mark" className="w-3 h-3" />
              </div>

              {/* Seller Stats */}
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

              {/* Price Info */}
              <div className="text-sm lg:text-base font-bold text-[#DBDBDB] mb-3">
                1 {offer.crypto} = {fixedPrice !== null ? formatCurrency(fixedPrice) : 'Loading...'}
              </div>

              {/* Order limit */}
              <div className="flex flex-wrap items-center text-[#C7C7C7] text-sm gap-2 mb-4">
                <p>Order limit:</p>
                <p>{offer.minLimit !== undefined ? formatCurrency(offer.minLimit) : '0.00'}</p>
                <Image src={Dminus} alt="minus" className="w-3 h-3" />
                <p>{offer.maxLimit !== undefined ? formatCurrency(offer.maxLimit) : '0.00'}</p>
              </div>

              {/* Verification Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="flex items-center gap-2 bg-[#3A3A3A] px-3 py-1 rounded-2xl">
                  <Image src={Verified} alt="ver" className="w-3 h-3" />
                  <p className="text-[#DBDBDB] text-xs font-medium">Email Verified</p>
                </div>
                <div className="flex items-center gap-2 bg-[#3A3A3A] px-3 py-1 rounded-2xl">
                  <Image src={Verified} alt="ver" className="w-3 h-3" />
                  <p className="text-[#DBDBDB] text-xs font-medium">ID Verified</p>
                </div>
              </div>
            </div>

            {/* Offer Terms */}
            <div className="bg-[#2D2D2D] rounded-xl p-4 lg:p-6">
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => setIsTermsOpen(!isTermsOpen)}
              >
                <p className="text-sm lg:text-base font-bold text-white">
                  Offer Terms
                </p>
                <Image
                  src={UPa}
                  alt="up"
                  className={`transition-transform duration-300 ${isTermsOpen ? "rotate-180" : "rotate-0"} w-4 h-4`}
                />
              </div>

              {isTermsOpen && offer.paymentTerms && (
                <div className="mt-3">
                  <ul className="text-[#DBDBDB] text-sm space-y-2 font-medium">
                    {offer.paymentTerms
                      .split(/[\n,]/)
                      .map((term: string) => term.trim())
                      .filter((term: string) => term.length > 0)
                      .map((term: string, index: number) => (
                        <li key={index}>{term.startsWith('•') ? term : `• ${term}`}</li>
                      ))}
                  </ul>
                </div>
              )}
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
                    1 {offer.crypto} = {fixedPrice !== null ? formatCurrency(fixedPrice) : 'Loading...'}
                  </p>
                  {tradePrice !== null && (
                    <p className="text-xs lg:text-sm font-medium text-[#4DF2BE] mt-1">
                      Total Trade Price: {formatCurrency(tradePrice)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* You Pay Container */}
            <div className="bg-[#222222] rounded-xl p-4 mb-4">
              <div>
                <div className="text-[#C7C7C7] text-sm font-medium mb-3">
                  You pay
                </div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={payAmount}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9.]/g, '');
                        if (value.split('.').length <= 2) {
                          setPayAmount(value);
                        }
                      }}
                      className="text-white text-xl lg:text-2xl font-bold bg-transparent border-none outline-none w-32 lg:w-48"
                      placeholder="0.00"
                    />
                    <span className="text-[#C7C7C7] font-normal text-xl lg:text-2xl">|</span>
                  </div>
                  <div className="flex items-center bg-[#2D2D2D] gap-2 px-3 py-1 rounded-full">
                    {selectedCurrencyData && selectedCurrencyData.flag && (
                      <img
                        src={selectedCurrencyData.flag}
                        alt={`${selectedCurrencyData.country} flag`}
                        className="w-4 h-3 rounded object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://flagcdn.com/w320/us.png';
                        }}
                      />
                    )}
                    <p className="text-[#DBDBDB] text-sm font-bold">
                      {selectedCurrencyData?.code || currency}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* You Receive Container */}
            <div className="bg-[#222222] rounded-xl p-4 mb-4">
              <div>
                <div className="text-[#C7C7C7] text-sm font-medium mb-3">
                  You Receive
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-white text-xl lg:text-2xl font-bold">
                      {receiveAmount}
                    </p>
                    <span className="text-[#C7C7C7] font-normal text-xl lg:text-2xl">|</span>
                  </div>
                  <div className="flex items-center bg-[#2D2D2D] gap-2 px-3 py-1 rounded-full">
                    <Image
                      src={offer.crypto === "BTC" ? BTC :
                        offer.crypto === "ETH" ? ETH :
                          offer.crypto === "USDT" ? USDT :
                            offer.crypto === "USDC" ? USDC : BTC}
                      alt="crypto"
                      className="w-6 h-6"
                    />
                    <p className="text-[#DBDBDB] text-sm font-bold">
                      {offer.crypto}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Limit and Payment Info */}
            <div className="flex flex-col gap-px mb-6">
              <div className="flex items-center justify-between w-full h-12 bg-[#2D2D2D] px-4 rounded-t-lg">
                <p className="text-sm lg:text-base font-normal text-[#DBDBDB]">Limit</p>
                <p className="text-sm lg:text-base font-medium text-white">
                  {offer.minLimit !== undefined ? formatCurrency(offer.minLimit) : '0.00'} - {offer.maxLimit !== undefined ? formatCurrency(offer.maxLimit) : '0.00'}
                </p>
              </div>

              <div className="flex items-center justify-between w-full h-12 bg-[#2D2D2D] px-4 border-l-2 border-l-[#FFFA66]">
                <p className="text-sm lg:text-base font-normal text-[#DBDBDB]">Payment</p>
                <p className="text-sm lg:text-base font-medium text-white">
                  {offer.paymentMethod}
                </p>
              </div>

              <div className="flex items-center justify-between w-full h-12 bg-[#2D2D2D] px-4 rounded-b-lg">
                <p className="text-sm lg:text-base font-normal text-[#DBDBDB]">
                  Time limit
                </p>
                <p className="text-sm lg:text-base font-medium text-white">
                  {offer.paymentTime}
                </p>
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

            {/* Info Message */}
            <div className="text-center mt-4 text-xs text-[#8F8F8F]">
              {(() => {
                const currentUserId = getCurrentUserId();
                const sellerId = getSellerIdFromOffer(offer);
                const isSeller = currentUserId === sellerId;
                
                return isSeller 
                  ? "Buyers will be notified when you create a trade" 
                  : "The seller will be notified of your trade request";
              })()}
            </div>

          </div>
        </div>

        <div className="w-[100%] h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
        <div className="mb-[80px] mt-[10%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Offers;