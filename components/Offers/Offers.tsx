"use client";

import { useState, useEffect } from "react";
import Nav from "../NAV/Nav";
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
import Dols from "../../public/Assets/Evolve2p_Dols/Makretplace/elements.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import ETH from "../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg";
import USDT from "../../public/Assets/Evolve2p_USDT/Tether (USDT).svg";
import USDC from "../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg";
import Arrow_great from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
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

  const toggleSeller = () => setIsSellerOpen((prev) => !prev);
  const [payAmount, setPayAmount] = useState<string>("");
  const [receiveAmount, setReceiveAmount] = useState<string>("0.00");

  // New currency service state
  const [selectedCurrencyData, setSelectedCurrencyData] = useState<CurrencyOption | null>(null);
  const [loadingCurrencies, setLoadingCurrencies] = useState<boolean>(true);

  const tabs = [
    { key: "offers", label: "Active offers" },
    { key: "feedbacks", label: "Feedbacks" },
  ];

  const [activeTab, setActiveTab] = useState("offers");

  // Helper function to safely render values
  const renderSafeValue = (value: any): string => {
    if (value === null || value === undefined) return "N/A";
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (typeof value === 'object' && value.name) return value.name;
    if (typeof value === 'object') return "Object";
    return String(value);
  };

  // Helper function to format currency
  const formatCurrency = (amount: number | undefined | null, currencyCode: string = currency): string => {
    if (amount === undefined || amount === null || isNaN(amount)) {
      return 'Loading...';
    }
    
    // Get currency symbol from selectedCurrencyData
    const symbol = selectedCurrencyData?.symbol || '$';
    
    // Format the amount
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

  // Check if pay amount is valid (not empty, greater than 0, and within limits)
  const isPayAmountValid = () => {
    if (!payAmount || payAmount.trim() === "") return false;
    const amount = parseFloat(payAmount);
    
    // Check if amount is a valid number and greater than 0
    if (isNaN(amount) || amount <= 0) return false;
    
    // Check if amount is within the offer limits
    if (offer && offer.minLimit && offer.maxLimit) {
      return amount >= offer.minLimit && amount <= offer.maxLimit;
    }
    
    return true; // If no limits are set, allow any valid amount
  };

  // Get validation error message
  const getValidationError = () => {
    if (!payAmount || payAmount.trim() === "") return "";
    
    const amount = parseFloat(payAmount);
    if (isNaN(amount)) return "Please enter a valid number";
    if (amount <= 0) return "Amount must be greater than 0";
    
    if (offer && offer.minLimit && offer.maxLimit) {
      if (amount < offer.minLimit) {
        return `Minimum amount is ${formatCurrency(offer.minLimit)}`;
      }
      if (amount > offer.maxLimit) {
        return `Maximum amount is ${formatCurrency(offer.maxLimit)}`;
      }
    }
    
    return "";
  };

  // Check if current user is the seller
  const isCurrentUserSeller = () => {
    if (!clientUser || !offer || !offer.user) return false;
    
    const sellerUser = offer.user;
    const currentUserId = clientUser.id || clientUser._id;
    const sellerId = sellerUser.id || sellerUser._id;
    
    // Compare by ID if available
    if (currentUserId && sellerId) {
      return currentUserId === sellerId;
    }
    
    // Fallback: compare by email or username
    const currentUserEmail = clientUser.email;
    const sellerEmail = sellerUser.email;
    
    if (currentUserEmail && sellerEmail) {
      return currentUserEmail === sellerEmail;
    }
    
    const currentUsername = clientUser.username;
    const sellerUsername = sellerUser.username;
    
    if (currentUsername && sellerUsername) {
      return currentUsername === sellerUsername;
    }
    
    return false;
  };

  // Enhanced validation before trade creation
  const validateTradeData = () => {
    if (!offer?.id) {
      return "Invalid offer ID";
    }
    
    // Check if offer ID is a valid UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(offer.id)) {
      return "Invalid offer ID format (must be UUID)";
    }
    
    const amountFiat = parseFloat(payAmount);
    const amountCrypto = parseFloat(receiveAmount);
    
    if (isNaN(amountFiat) || amountFiat <= 0) {
      return "Invalid fiat amount";
    }
    
    if (isNaN(amountCrypto) || amountCrypto <= 0) {
      return "Invalid crypto amount";
    }
    
    // Check against offer limits with tolerance for floating point
    if (offer.minLimit && amountFiat < (offer.minLimit - 0.01)) {
      return `Amount below minimum limit of ${formatCurrency(offer.minLimit)}`;
    }
    
    if (offer.maxLimit && amountFiat > (offer.maxLimit + 0.01)) {
      return `Amount above maximum limit of ${formatCurrency(offer.maxLimit)}`;
    }
    
    // Check if tradePrice is available
    if (!tradePrice) {
      return "Trade price not available";
    }
    
    return null;
  };

  // FIXED: Create trade function with tradePrice from offer data
  const createTrade = async () => {
    console.log("🎯 Starting trade creation...");
    
    if (!isPayAmountValid() || !offer || !clientUser) {
      console.error("❌ Validation failed:", { 
        isPayAmountValid: isPayAmountValid(), 
        offer: !!offer, 
        clientUser: !!clientUser 
      });
      return null;
    }

    try {
      setIsCreatingTrade(true);
      
      const userDataRaw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
      let token = "";

      if (userDataRaw) {
        try {
          const userData = JSON.parse(userDataRaw);
          token = userData?.accessToken || userData?.token;
          console.log("🔑 Token available:", !!token);
          console.log("👤 User ID:", userData?.id || userData?._id);
        } catch (e) {
          console.error("❌ Error parsing user data:", e);
        }
      }

      const headers: any = { 
        "Content-Type": "application/json",
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Prepare trade data with CORRECT field names
      const amountFiat = parseFloat(payAmount);
      const amountCrypto = parseFloat(receiveAmount);

      console.log("🔍 Detailed amount analysis:", {
        payAmount,
        receiveAmount,
        amountFiat,
        amountCrypto,
        tradePriceFromOffer: tradePrice,
        fixedPrice: fixedPrice,
        isFiatValid: !isNaN(amountFiat) && amountFiat > 0,
        isCryptoValid: !isNaN(amountCrypto) && amountCrypto > 0,
      });

      // Validate the amounts more strictly
      if (isNaN(amountFiat) || isNaN(amountCrypto) || amountFiat <= 0 || amountCrypto <= 0) {
        throw new Error(`Invalid amount values: Fiat=${amountFiat}, Crypto=${amountCrypto}`);
      }

      // Check if tradePrice is available
      if (!tradePrice || tradePrice <= 0) {
        throw new Error("Trade price not available from offer");
      }

      // FIXED: Use the correct field names expected by your API including tradePrice
      const tradeData = {
        offerId: offer.id,
        amountFiat: amountFiat,
        amountCrypto: amountCrypto,
        tradePrice: tradePrice, // This is the totalPrice from offer API
        currency: currency,
        cryptoType: offer.crypto,
        paymentMethod: offer.paymentMethod,
        // Additional fields that might be needed
        pricePerUnit: fixedPrice, // Price per 1 crypto unit
        margin: offer.margin || 0,
        fiatCurrency: currency,
        paymentTimeLimit: offer.paymentTime || "30 minutes"
      };

      console.log("🔄 Creating trade with data structure including tradePrice:", {
        tradeData,
        offerDetails: {
          id: offer.id,
          type: offer.type,
          crypto: offer.crypto,
          minLimit: offer.minLimit,
          maxLimit: offer.maxLimit,
          tradePrice: tradePrice,
          pricePerUnit: fixedPrice
        }
      });

      console.log("📤 Sending request to:", "https://evolve2p-backend.onrender.com/api/create-trade");
      
      const response = await fetch(
        "https://evolve2p-backend.onrender.com/api/create-trade",
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(tradeData),
        }
      );

      console.log("📡 Response status:", response.status);
      console.log("📡 Response ok:", response.ok);
      
      if (!response.ok) {
        let errorMessage = `Trade creation failed with status ${response.status}`;
        let errorDetails = null;
        
        try {
          const errorData = await response.text();
          console.error("❌ Raw error response:", errorData);
          
          try {
            const parsedError = JSON.parse(errorData);
            errorDetails = parsedError;
            errorMessage = parsedError.message || parsedError.error || errorMessage;
            console.error("❌ Parsed error details:", parsedError);
            
            // Provide more specific error messages
            if (response.status === 400) {
              errorMessage = "Bad request - check the data format";
            } else if (response.status === 401) {
              errorMessage = "Unauthorized - please login again";
            } else if (response.status === 404) {
              errorMessage = "Offer not found";
            } else if (response.status === 422) {
              errorMessage = "Validation error - check amount limits";
            }
          } catch (parseError) {
            console.error("❌ Error response is not JSON:", errorData);
            errorMessage = errorData || errorMessage;
          }
        } catch (e) {
          console.error("❌ Could not read error response");
        }
        
        throw new Error(errorMessage);
      }

      const result = await response.json();
      console.log("✅ Trade created successfully:", result);

      if (result.success && result.data) {
        return result.data; // Return the trade data
      } else if (result.trade) {
        return result.trade; // Alternative response format
      } else {
        throw new Error(result.message || "Failed to create trade - no trade data returned");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.error("❌ Error creating trade:", error.message);
        console.error("❌ Error stack:", error.stack);
      } else {
        console.error("❌ Unknown error creating trade:", error);
      }
      throw error;
    } finally {
      setIsCreatingTrade(false);
    }
  };

  // Get button text based on opposite logic
  const getButtonText = () => {
    if (isCreatingTrade) {
      return "Creating Trade...";
    }
    
    const isSeller = isCurrentUserSeller();
    
    if (isSeller) {
      // Current user is the offer creator - show original offer type
      return `${offer.type} ${offer.crypto}`;
    } else {
      // Current user is NOT the offer creator - show OPPOSITE type
      // If offer type is BUY (creator wants to buy), show SELL (user can sell to them)
      // If offer type is SELL (creator wants to sell), show BUY (user can buy from them)
      const oppositeType = offer.type?.toUpperCase() === 'BUY' ? 'SELL' : 'BUY';
      return `${oppositeType} ${offer.crypto}`;
    }
  };

  // Handle buy/sell button click with trade creation and routing logic
  const handleTradeAction = async () => {
    if (!isPayAmountValid()) {
      alert("Please enter a valid amount");
      return;
    }
    
    const validationError = validateTradeData();
    if (validationError) {
      alert(`Validation error: ${validationError}`);
      return;
    }
    
    console.log("🎯 Starting trade creation process...");
    
    try {
      const trade = await createTrade();
      
      if (trade) {
        console.log("🚀 Trade created, navigating...", trade);
        const isSeller = isCurrentUserSeller();
        
        // FIXED: Use the correct trade ID field
        const tradeId = trade.id || trade._id;
        
        if (!tradeId) {
          throw new Error("No trade ID returned from API");
        }
        
        if (isSeller) {
          router.push(`/prc_sell?tradeId=${tradeId}&offerId=${offer.id}&currency=${currency}&payAmount=${payAmount}`);
        } else {
          if (offer.type?.toUpperCase() === 'SELL') {
            router.push(`/prc_buy?tradeId=${tradeId}&offerId=${offer.id}&currency=${currency}&payAmount=${payAmount}`);
          } else {
            router.push(`/prc_sell?tradeId=${tradeId}&offerId=${offer.id}&currency=${currency}&payAmount=${payAmount}`);
          }
        }
      }
    } catch (error) {
      console.error("💥 Failed to create trade:", error);
      if (error instanceof Error) {
        alert(`Failed to create trade: ${error.message}\n\nPlease check the console for detailed error information.`);
      } else {
        alert(`Failed to create trade: Unknown error occurred.\n\nPlease check the console for detailed error information.`);
      }
    }
  };

  // Get user role indicator text
  const getUserRoleText = () => {
    if (!clientUser || !offer.user) return "";
    
    const isSeller = isCurrentUserSeller();
    const offerType = offer.type?.toUpperCase();
    
    if (isSeller) {
      return "You are the owner of this offer";
    } else {
      if (offerType === 'SELL') {
        return "You are buying from this seller";
      } else {
        return "You are selling to this buyer";
      }
    }
  };

  // FIXED: Format payment terms for display
  const formatPaymentTerms = (terms: string): string[] => {
    if (!terms) return [];
    
    // Split by newlines or commas and filter out empty strings
    return terms
      .split(/[\n,]/)
      .map(term => term.trim())
      .filter(term => term.length > 0)
      .map(term => term.startsWith('•') ? term : `• ${term}`);
  };

  // Test function to check API requirements (call this in console)
  const testTradeCreation = async () => {
    console.log("🧪 Testing trade creation API...");
    
    const testData = {
      offerId: offer?.id,
      amountFiat: 100,
      amountCrypto: 0.002,
      tradePrice: tradePrice || 100, // Use the actual tradePrice from offer
      currency: currency,
      cryptoType: offer?.crypto,
      paymentMethod: offer?.paymentMethod
    };
    
    console.log("Test data with tradePrice:", testData);
    
    try {
      const userDataRaw = localStorage.getItem("UserData");
      if (!userDataRaw) {
        console.error("No user data found in localStorage");
        return;
      }
      
      const userData = JSON.parse(userDataRaw);
      const token = userData?.accessToken || userData?.token;
      
      const response = await fetch("https://evolve2p-backend.onrender.com/api/create-trade", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(testData)
      });
      
      console.log("Test response status:", response.status);
      const result = await response.json();
      console.log("Test response:", result);
      
    } catch (error) {
      console.error("Test error:", error);
    }
  };

  // Make it available globally for testing
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).testTradeCreation = testTradeCreation;
      (window as any).debugOffer = () => {
        console.log("🔍 Debug Offer:", offer);
        console.log("🔍 Debug Client User:", clientUser);
        console.log("🔍 Debug Amounts:", { payAmount, receiveAmount });
        console.log("🔍 Debug Trade Price:", tradePrice);
        console.log("🔍 Debug Fixed Price:", fixedPrice);
        console.log("🔍 Debug Payment Terms:", offer?.paymentTerms);
      };
    }
  }, [offer, clientUser, payAmount, receiveAmount, tradePrice, fixedPrice]);

  // Fixed: Proper null handling for localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const raw = localStorage.getItem("UserData");
    if (!raw) {
      console.log("❌ No UserData found in localStorage");
      return;
    }
    
    try {
      const parsed = JSON.parse(raw);
      const resolved = parsed.userData ?? parsed;
      setClientUser(resolved);
      console.log("👤 Client user set:", resolved);
    } catch (e) {
      console.error("❌ Error setting client user:", e);
      setClientUser(null);
    }
  }, []);

  // Load currency data from country currency service
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
          || null;
        
        setSelectedCurrencyData(currencyData);
        setCurrency(currencyData?.code || 'USD');
        
      } catch (error) {
        console.error('Error loading currency data:', error);
        setSelectedCurrencyData(null);
      } finally {
        setLoadingCurrencies(false);
      }
    };

    loadCurrencyData();
  }, [searchParams]);

  // Update receive amount when pay amount changes
  useEffect(() => {
    if (fixedPrice && payAmount && !isNaN(parseFloat(payAmount))) {
      const amount = parseFloat(payAmount);
      const calculatedReceive = (amount / fixedPrice).toFixed(8);
      setReceiveAmount(calculatedReceive);
    } else {
      setReceiveAmount("0.00");
    }
  }, [payAmount, fixedPrice]);

  // Get offer ID from URL parameters and fetch specific offer
  useEffect(() => {
    const fetchOffer = async () => {
      const offerId = params.id;

      if (!offerId) {
        console.error("No offer ID found in URL parameters");
        return;
      }

      setLoadingOffer(true);
      try {
        const userDataRaw = typeof window !== "undefined" ? localStorage.getItem("UserData") : null;
        let token = "";

        if (userDataRaw) {
          try {
            const userData = JSON.parse(userDataRaw);
            token = userData?.accessToken || userData?.token;
          } catch (e) {
            console.error("Error parsing user data");
          }
        }

        const headers: any = { "Content-Type": "application/json" };
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        console.log("🔄 Fetching offer with ID:", offerId);
        console.log("💰 Using currency:", currency);

        const res = await fetch(
          `https://evolve2p-backend.onrender.com/api/get-offer/${offerId}`,
          {
            method: "GET",
            headers: headers,
          }
        );

        if (!res.ok) {
          throw new Error(`API request failed with status ${res.status}`);
        }

        const data = await res.json();
        console.log("📊 Offer API response:", data);

        let offerData = null;

        if (data.data) {
          offerData = data.data;
        } else if (data.offer) {
          offerData = data.offer;
        } else if (data.id) {
          offerData = data;
        } else {
          throw new Error("No offer data found in response");
        }

        // Get ALL prices from API response
        let pricePerUnit: number | null = null;
        let totalTradePrice: number | null = null;

        // Get price per unit (price for 1 crypto)
        if (offerData.price) {
          pricePerUnit = offerData.price;
          console.log("💰 Using price per unit from API:", pricePerUnit);
        } else if (offerData.basePrice) {
          pricePerUnit = offerData.basePrice;
          console.log("💰 Using basePrice per unit from API:", pricePerUnit);
        }

        // Get total trade price (totalPrice from marketplace)
        if (offerData.totalPrice) {
          totalTradePrice = offerData.totalPrice;
          console.log("💰 Using totalPrice from API:", totalTradePrice);
        } else if (offerData.tradePrice) {
          totalTradePrice = offerData.tradePrice;
          console.log("💰 Using tradePrice from API:", totalTradePrice);
        } else if (offerData.finalPrice) {
          totalTradePrice = offerData.finalPrice;
          console.log("💰 Using finalPrice from API:", totalTradePrice);
        }

        // If pricePerUnit is not available but totalTradePrice is, we can calculate it
        if (!pricePerUnit && totalTradePrice && offerData.cryptoAmount) {
          pricePerUnit = totalTradePrice / offerData.cryptoAmount;
          console.log("🧮 Calculated price per unit from total:", pricePerUnit);
        }

        // Set the prices
        setFixedPrice(pricePerUnit);
        setTradePrice(totalTradePrice);

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
          paymentTerms: offerData.paymentTerms || "",
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
        });

        console.log("✅ Final offer object:", {
          currency: offerData.currency || currency,
          crypto: offerData.crypto || "BTC",
          pricePerUnit: pricePerUnit,
          totalTradePrice: totalTradePrice,
          type: offerData.type,
          id: offerData.id || offerId,
          minLimit: offerData.minLimit,
          maxLimit: offerData.maxLimit
        });

      } catch (error) {
        console.error("❌ Error fetching offer:", error);
        setOffer(null);
      } finally {
        setLoadingOffer(false);
      }
    };

    if (currency && !loadingCurrencies) {
      fetchOffer();
    }
  }, [params.id, clientUser, currency, loadingCurrencies]);

  if (loadingOffer || loadingCurrencies) {
    return (
      <main className="min-h-screen bg-[#0F1012] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-xl">Loading offer details...</div>
          <div className="text-sm text-gray-400 mt-2">Please wait while we fetch the offer</div>
        </div>
      </main>
    );
  }

  if (!offer) {
    return (
      <main className="min-h-screen bg-[#0F1012] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-xl">Offer not found</div>
          <div className="text-sm text-gray-400 mt-2">
            The offer may have been removed or is unavailable
          </div>
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
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://flagcdn.com/w320/us.png';
                }}
              />
            )}
            <span className="text-[#8F8F8F]">Selected Currency:</span>
            <span className="text-[#4DF2BE] font-semibold">
              {selectedCurrencyData?.code} - {selectedCurrencyData?.name}
            </span>
            <span className="text-[#C7C7C7]">
              Symbol: {selectedCurrencyData?.symbol}
            </span>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Section */}
          <div className="flex-1">
            {/* Seller Info Container */}
            <div className="bg-[#222222] rounded-xl p-4 lg:p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center bg-[#4A4A4A] w-6 h-6 rounded-full p-1">
                  {(() => {
                    const sellerUser = offer.user || clientUser;
                    const rawName = sellerUser?.username || sellerUser?.email || "Seller";
                    const uname = typeof rawName === "string" ? rawName : String(rawName);
                    const displayName = uname.startsWith("@") ? uname : `@${uname}`;
                    const initial = uname.charAt(0).toUpperCase();

                    return (
                      <>
                        <p className="text-xs font-bold text-[#8F8F8F] ml-1">
                          {initial}
                        </p>
                        <Image src={Vector} alt="vector" className="ml-1 w-2 h-2" />
                      </>
                    );
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
                <Image
                  onClick={() => setIsSellerOpen(true)}
                  src={Arrow_great}
                  alt="greater"
                  className="w-3 h-3 cursor-pointer"
                />
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
                1 {offer.crypto} = {fixedPrice ? formatCurrency(fixedPrice) : 'Loading...'}
              </div>

              {/* Trade Price Display */}
              {tradePrice && (
                <div className="text-sm font-medium text-[#C7C7C7] mb-4">
                  Trade Price: <span className="text-[#4DF2BE] font-bold">
                    {formatCurrency(tradePrice)}
                  </span>
                </div>
              )}

              {/* Order limit */}
              <div className="flex flex-wrap items-center text-[#C7C7C7] text-sm gap-2 mb-4">
                <p>Order limit:</p>
                <p>
                  {formatCurrency(offer.minLimit)}
                </p>
                <Image src={Dminus} alt="minus" className="w-3 h-3" />
                <p>
                  {formatCurrency(offer.maxLimit)}
                </p>
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

              <div className="text-sm font-medium text-[#C7C7C7]">
                Feedbacks(21)
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
                    className={`transition-transform duration-300 ${isTermsOpen ? "rotate-180" : "rotate-0"
                      } w-4 h-4`}
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
                    {selectedCurrencyData && (
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
                <div className="text-sm font-medium text-[#C7C7C7]">
                  1 {currency} = <span className="text-[#DBDBDB]">
                    {fixedPrice ? (1 / fixedPrice).toFixed(8) : "0.00000000"} {offer.crypto}
                  </span>
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
                  {formatCurrency(offer.minLimit)} - {formatCurrency(offer.maxLimit)}
                </p>
              </div>

              <div className="flex items-center justify-between w-full h-12 bg-[#2D2D2D] px-4 border-l-2 border-l-[#FFFA66]">
                <p className="text-sm lg:text-base font-normal text-[#DBDBDB]">Payment</p>
                <p className="text-sm lg:text-base font-medium text-white">
                  {renderSafeValue(offer.paymentMethod)}
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

            {/* Validation message */}
            {payAmount !== "" && (
              <div className={`text-center mt-3 text-sm ${
                isPayAmountValid() ? "text-[#4DF2BE]" : "text-[#FF6B6B]"
              }`}>
                {isPayAmountValid() 
                  ? "Amount is within limits ✓" 
                  : getValidationError()
                }
              </div>
            )}

            {/* User role indicator */}
            {clientUser && offer.user && (
              <div className="text-center mt-2 text-xs text-[#8F8F8F]">
                {getUserRoleText()}
              </div>
            )}

            {/* Trade Price Info */}
            {tradePrice && (
              <div className="text-center mt-4 text-xs text-[#8F8F8F]">
                Trade Price: {formatCurrency(tradePrice)}
              </div>
            )}

          </div>
        </div>

        {/* Seller Details Modal */}
        {isSellerOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-[#0F1012] rounded-xl w-full max-w-lg lg:max-w-2xl max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-4 lg:p-6">
                <p className="text-base lg:text-lg font-bold text-white">
                  Seller details
                </p>
                <Image
                  src={Times}
                  alt="Close"
                  width={24}
                  height={24}
                  className="cursor-pointer w-6 h-6 lg:w-8 lg:h-8"
                  onClick={toggleSeller}
                />
              </div>

              <div className="bg-[#1A1A1A] p-4 lg:p-6 max-h-[60vh] overflow-y-auto space-y-4 lg:space-y-6">
                {/* Header Profile Section */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex items-center bg-[#4A4A4A] w-6 h-6 rounded-full p-1 mr-3">
                      {(() => {
                        const sellerUser = offer.user || clientUser;
                        const rawName = sellerUser?.username || sellerUser?.email || "Seller";
                        const uname = typeof rawName === "string" ? rawName : String(rawName);
                        const initial = uname.charAt(0).toUpperCase();
                        return (
                          <p className="text-xs font-bold text-[#8F8F8F] ml-1">
                            {initial}
                          </p>
                        );
                      })()}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-sm lg:text-base text-white font-medium whitespace-nowrap">
                        {(() => {
                          const sellerUser = offer.user || clientUser;
                          const rawName = sellerUser?.username || sellerUser?.email || "Seller";
                          const uname = typeof rawName === "string" ? rawName : String(rawName);
                          return uname.startsWith("@") ? uname : `@${uname}`;
                        })()}
                      </p>
                      <p className="text-sm font-medium text-[#C7C7C7]">
                        Online
                      </p>
                    </div>
                    <Image src={Mark_green} alt="mark" className="ml-2 w-3 h-3" />
                  </div>
                  <button className="w-20 h-10 rounded-full border border-[#2D2D2D] text-[#4DF2BE] text-sm font-bold bg-[#2D2D2D]">
                    Follow
                  </button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-3">
                  {["Email", "SMS", "ID Verification", "Address"].map(
                    (item, i) => (
                      <span
                        key={i}
                        className="text-sm font-medium text-[#DBDBDB] flex items-center"
                      >
                        <Image
                          src={Verified}
                          alt="ver"
                          className="mr-1 w-3 h-3"
                        />
                        {item}
                      </span>
                    )
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col bg-[#2D2D2D] p-3 items-center rounded-lg">
                    <p className="text-base font-medium text-white">
                      {offer.ordersCompleted}
                    </p>
                    <p className="text-sm font-medium text-[#C7C7C7]">
                      Trades Completed
                    </p>
                  </div>
                  <div className="flex flex-col bg-[#2D2D2D] p-3 items-center rounded-lg">
                    <p className="text-base font-medium text-white">
                      {offer.completionRate}%
                    </p>
                    <p className="text-sm font-medium text-[#C7C7C7]">
                      Completion Rate
                    </p>
                  </div>
                  <div className="flex flex-col bg-[#2D2D2D] p-3 items-center rounded-lg">
                    <p className="text-base font-medium text-white">
                      {offer.avgReleaseTime}
                    </p>
                    <p className="text-sm font-medium text-[#C7C7C7]">
                      Avg. Release Time
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-[#2D2D2D]"></div>

                {/* Payment Methods */}
                <div>
                  <p className="font-medium text-sm text-[#C7C7C7] mb-3">
                    Payment Methods
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[
                      renderSafeValue(offer.paymentMethod),
                      "PayPal",
                      "Skrill",
                      "Mobile Money",
                      "Gift Cards",
                    ].map((method, i) => (
                      <span
                        key={i}
                        className="flex items-center gap-2 justify-center bg-[#3A3A3A] rounded-2xl text-xs px-3 py-2"
                      >
                        <Image src={Verified} alt="ver" className="w-3 h-3" />
                        {method}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="w-full h-px bg-[#2D2D2D]"></div>

                {/* Info */}
                <p className="font-bold text-[#C7C7C7] text-base">
                  Info
                </p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between bg-[#2D2D2D] rounded-lg h-10 px-3">
                    <p className="text-sm text-[#DBDBDB] font-medium">
                      Joined
                    </p>
                    <p className="text-sm text-white font-medium">
                      {offer.createdAt ? new Date(offer.createdAt).toLocaleDateString() : "N/A"}
                    </p>
                  </div>
                  <div className="flex items-center justify-between bg-[#2D2D2D] rounded-lg h-10 px-3">
                    <p className="text-sm text-[#DBDBDB] font-medium">
                      Location
                    </p>
                    <p className="text-sm text-white font-medium">
                      Nigeria
                    </p>
                  </div>
                </div>

                <div className="w-full h-px bg-[#2D2D2D]"></div>

                {/* Tabs */}
                <div className="flex bg-[#2D2D2D] rounded-[56px] w-full max-w-xs h-12 p-1 items-center justify-between mx-auto">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab.key;

                    return (
                      <div
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className={`flex items-center justify-center rounded-[56px] text-sm transition no-underline cursor-pointer
                          ${isActive
                            ? "bg-[#4A4A4A] text-white font-medium"
                            : "bg-transparent text-[#DBDBDB] font-normal"
                          } w-28 h-10`}
                      >
                        {tab.label}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="w-[100%] h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
        <div className="mb-[80px] mt-[10%]">
          <Footer />
        </div>
      </div>
    </main>
  );                                                     
};

export default Offers;