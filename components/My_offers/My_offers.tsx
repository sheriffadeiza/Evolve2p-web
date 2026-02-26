// components/MyOffers/MyOffers.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Timer from "../../public/Assets/Evolve2p_timer/elements.svg";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import EditIcon from "../../public/Assets/Evolve2p_editoffer/P2P Marketplace/pencil-edit-02.svg";
import DeleteIcon from "../../public/Assets/Evolve2p_deleteoffer/P2P Marketplace/delete-03.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import Barrow from "../../public/Assets/Evolve2p_Barrow/arrow-down-01.svg";
import { API_BASE_URL } from "@/config";

interface Offer {
  id?: string;
  _id?: string;
  crypto: string;
  type: string;
  margin: number;
  minLimit: number;
  maxLimit: number;
  paymentMethod: any;
  createdAt: string;
  time?: string;
  user?: {
    username?: string;
    _id?: string;
  };
  currency?: string;
  fiatCurrency?: string;
  basePrice?: number;
  finalPrice?: number;
  status?: string;
  terms?: string;
  instructions?: string;
  paymentTime?: string;
}

interface UserData {
  accessToken?: string;
  token?: string;
  username?: string;
  email?: string;
  user?: {
    username?: string;
    _id?: string;
  };
  userData?: {
    username?: string;
    _id?: string;
    accessToken?: string;
    token?: string;
  };
  _id?: string;
}

interface MyOffersProps {
  initialTab?: "ALL" | "BUY" | "SELL";
}

const MyOffers: React.FC<MyOffersProps> = ({ initialTab = "ALL" }) => {
  const [activeTab, setActiveTab] = useState<"ALL" | "BUY" | "SELL">(initialTab);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [filteredOffers, setFilteredOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [initialLoading, setInitialLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [clientUser, setClientUser] = useState<UserData | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // User's saved payment methods (detailed)
  const [userPaymentMethods, setUserPaymentMethods] = useState<any[]>([]);
  const [loadingUserMethods, setLoadingUserMethods] = useState<boolean>(false);
  const [errorUserMethods, setErrorUserMethods] = useState<string>("");

  // Edit modal state
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<Offer>>({});
  const [editLoading, setEditLoading] = useState<boolean>(false);
  const [editTimeLimit, setEditTimeLimit] = useState("30 minutes");
  const [editTimeLimitOpen, setEditTimeLimitOpen] = useState(false);
  const timeOptions = ["15 minutes", "30 minutes", "45 minutes", "1 hour"];

  const router = useRouter();

  // Tabs
  const tabs = ["ALL", "BUY", "SELL"];

  // Crypto options
  const cryptoOptions = [
    { name: "BTC", icon: "Bitcoin" },
    { name: "ETH", icon: "Ethereum" },
    { name: "USDT", icon: "Tether" },
    { name: "USDC", icon: "USD Coin" },
  ];

  // Helper: format date
  const formatDate = (dateString: string): string => {
    if (!dateString) return "Unknown date";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid date";
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  // Helper function to get auth token
  const getToken = (): string | null => authToken;

  // Helper function to get user ID
  const getUserId = (): string | null => {
    if (!clientUser) return null;
    if (clientUser.user?._id) return clientUser.user._id;
    if (clientUser.userData?._id) return clientUser.userData._id;
    if (clientUser._id) return clientUser._id;
    return null;
  };

  // Helper function to get username
  const getUsername = (): string => {
    if (!clientUser) return "User";
    const username = clientUser.username ||
                    clientUser.user?.username ||
                    clientUser.userData?.username ||
                    clientUser.email ||
                    "User";
    return typeof username === "string" ? username : String(username);
  };

  // Helper to get offer's fiat currency
  const getOfferFiatCurrency = (offer: Offer): string => {
    return offer.fiatCurrency || offer.currency || "USD";
  };

  // Format currency
  const formatCurrency = (amount: number | undefined | null, currencyCode: string = "USD"): string => {
    if (amount === undefined || amount === null) return 'N/A';
    const symbol = currencyCode === "USD" ? "$" :
                  currencyCode === "EUR" ? "€" :
                  currencyCode === "GBP" ? "£" :
                  currencyCode === "NGN" ? "₦" :
                  currencyCode === "BRL" ? "R$" : "$";
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

  // Calculate offer price
  const calculateOfferPrice = (offer: Offer): string => {
    const offerFiatCurrency = getOfferFiatCurrency(offer);
    if (offer.finalPrice !== undefined && offer.finalPrice !== null && offer.finalPrice > 0) {
      return formatCurrency(offer.finalPrice, offerFiatCurrency);
    }
    if (offer.basePrice !== undefined && offer.basePrice !== null && offer.basePrice > 0 && offer.margin !== undefined) {
      const isBuyOffer = offer.type?.toUpperCase() === 'BUY';
      let calculatedPrice;
      if (isBuyOffer) {
        calculatedPrice = offer.basePrice * (1 - (offer.margin / 100));
      } else {
        calculatedPrice = offer.basePrice * (1 + (offer.margin / 100));
      }
      return formatCurrency(calculatedPrice, offerFiatCurrency);
    }
    return 'Price N/A';
  };

  // Format limits
  const formatLimits = (offer: Offer): string => {
    const offerFiatCurrency = getOfferFiatCurrency(offer);
    const min = formatCurrency(offer.minLimit, offerFiatCurrency);
    const max = formatCurrency(offer.maxLimit, offerFiatCurrency);
    return `${min} – ${max}`;
  };

  // Get trading pair
  const getTradingPair = (offer: Offer): string => {
    const offerFiatCurrency = getOfferFiatCurrency(offer);
    return `${offer.crypto}/${offerFiatCurrency}`;
  };

  // Get user initial for avatar
  const getUserInitial = (): string => {
    const username = getUsername();
    if (username && username.length > 0) {
      return username.startsWith("@") ? username.charAt(1).toUpperCase() : username.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Helper to display payment method in dropdown
  const getMethodDisplay = (method: any): string => {
    if (!method) return "Unknown";
    const typeName = method.type?.name || "Payment Method";
    const details = method.details || {};
    const firstField = Object.values(details)[0];
    return firstField ? `${typeName} - ${firstField}` : typeName;
  };

  // Fetch user's saved payment methods (detailed)
  const fetchUserPaymentMethods = async () => {
    const token = getToken();
    if (!token) return;

    setLoadingUserMethods(true);
    setErrorUserMethods("");
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/get-user-payment-methods`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load your payment methods");
      setUserPaymentMethods(data.data || []);
      console.log("✅ User payment methods loaded:", data.data);
    } catch (err: any) {
      console.error("❌ Error fetching user payment methods:", err);
      setErrorUserMethods(err.message);
    } finally {
      setLoadingUserMethods(false);
    }
  };

  // Load user data from localStorage and extract token
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("UserData");
      if (!raw) {
        setError("Please log in to view your offers");
        setInitialLoading(false);
        return;
      }
      const parsed: UserData = JSON.parse(raw);
      const token = parsed.accessToken || parsed.token || (parsed.userData?.accessToken) || (parsed.userData?.token);
      setAuthToken(token || null);
      setClientUser(parsed.userData ?? parsed);
    } catch (e) {
      console.error("Failed parsing UserData from localStorage", e);
      setError("Failed to load user data");
    } finally {
      setInitialLoading(false);
    }
  }, []);

  // Fetch user payment methods when token is available
  useEffect(() => {
    if (authToken) {
      fetchUserPaymentMethods();
    }
  }, [authToken]);

  // Fetch user's offers
  const fetchMyOffers = async () => {
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/get-offers`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const text = await response.text();
      let data;
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        console.error("❌ Failed to parse JSON:", e);
        data = {};
      }

      if (!response.ok) throw new Error(data?.message || `Server error ${response.status}`);

      let allOffers: Offer[] = [];
      if (Array.isArray(data)) allOffers = data;
      else if (Array.isArray(data.data)) allOffers = data.data;
      else if (Array.isArray(data.offers)) allOffers = data.offers;
      else if (data.data && Array.isArray(data.data.offers)) allOffers = data.data.offers;

      const userId = getUserId();
      if (!userId) {
        setOffers(allOffers);
      } else {
        const myOffers = allOffers.filter((offer: Offer) => {
          const offerUserId = offer.user?._id || (offer.user as any)?.id;
          return offerUserId === userId;
        });
        setOffers(myOffers);
      }
    } catch (err: any) {
      console.error("❌ Error fetching offers:", err);
      setError(err.message || "Failed to fetch offers");
    } finally {
      setLoading(false);
    }
  };

  // Filter offers based on active tab
  useEffect(() => {
    if (offers.length === 0) {
      setFilteredOffers([]);
      return;
    }
    let filtered = [...offers];
    if (activeTab === "BUY") {
      filtered = offers.filter(offer => offer.type?.toUpperCase() === "BUY");
    } else if (activeTab === "SELL") {
      filtered = offers.filter(offer => offer.type?.toUpperCase() === "SELL");
    }
    setFilteredOffers(filtered);
  }, [activeTab, offers]);

  // Fetch offers when token is available
  useEffect(() => {
    if (authToken) fetchMyOffers();
  }, [authToken]);

  // Handle delete offer – using PUT and { id: offerId }
  const handleDeleteOffer = async (offerId: string) => {
    if (!offerId) {
      setError("Invalid offer ID");
      return;
    }
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      console.log(`🗑️ Deleting offer: ${offerId}`);
      const response = await fetch(
        `${API_BASE_URL}/api/delete-offer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: offerId }),
        }
      );

      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        const text = await response.text();
        console.error("❌ Non-JSON response:", text);
        throw new Error(`Server returned ${response.status}: ${text.substring(0, 100)}`);
      }

      if (!response.ok) {
        throw new Error(data?.message || `Server error ${response.status}`);
      }

      setSuccessMessage("Offer deleted successfully");
      setOffers(prev => prev.filter(offer => (offer.id || offer._id) !== offerId));
      setDeleteConfirm(null);
    } catch (err: any) {
      console.error("❌ Error deleting offer:", err);
      setError(err.message || "Failed to delete offer");
    } finally {
      setLoading(false);
    }
  };

  // Handle edit click – open modal with offer data
  const handleEditClick = (offer: Offer) => {
    setEditingOffer(offer);
    let paymentMethodId = "";
    if (offer.paymentMethod) {
      if (typeof offer.paymentMethod === 'string') {
        paymentMethodId = offer.paymentMethod;
      } else if (typeof offer.paymentMethod === 'object') {
        paymentMethodId = offer.paymentMethod.id || offer.paymentMethod._id || offer.paymentMethod.name || "";
      }
    }
    setEditFormData({
      crypto: offer.crypto,
      type: offer.type,
      margin: offer.margin,
      minLimit: offer.minLimit,
      maxLimit: offer.maxLimit,
      currency: offer.currency || offer.fiatCurrency || "USD",
      paymentMethod: paymentMethodId,
      terms: offer.terms || "",
      instructions: offer.instructions || "",
    });
    setEditTimeLimit(offer.paymentTime || "30 minutes");
  };

  // Handle edit form changes
  const handleEditFormChange = (field: string, value: any) => {
    setEditFormData(prev => ({ ...prev, [field]: value }));
  };

  // Handle update offer – mirrors the creation process
  const handleUpdateOffer = async () => {
    if (!editingOffer || !editingOffer.id && !editingOffer._id) {
      setError("No offer selected for editing");
      return;
    }
    const offerId = editingOffer.id || editingOffer._id;
    const token = getToken();
    if (!token) {
      setError("Authentication token not found");
      return;
    }
    // Validate
    if (!editFormData.crypto) { setError("Cryptocurrency is required"); return; }
    if (!editFormData.type) { setError("Offer type is required"); return; }
    // Convert type to lowercase before sending (backend expects 'buy' or 'sell')
    const typeLower = editFormData.type?.toLowerCase();
    if (typeLower !== 'buy' && typeLower !== 'sell') {
      setError("Type must be 'buy' or 'sell'");
      return;
    }
    if (editFormData.margin === undefined || editFormData.margin < -100 || editFormData.margin > 100) {
      setError("Margin must be between -100 and 100"); return;
    }
    if (!editFormData.minLimit || editFormData.minLimit <= 0) {
      setError("Minimum limit must be greater than 0"); return;
    }
    if (!editFormData.maxLimit || editFormData.maxLimit <= editFormData.minLimit) {
      setError("Maximum limit must be greater than minimum limit"); return;
    }
    if (!editFormData.paymentMethod) {
      setError("Payment method is required"); return;
    }

    setEditLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const payload = {
        offerId,
        crypto: editFormData.crypto,
        type: typeLower, // send lowercase
        margin: editFormData.margin,
        minLimit: editFormData.minLimit,
        maxLimit: editFormData.maxLimit,
        currency: editFormData.currency || "USD",
        paymentMethod: editFormData.paymentMethod,
        terms: editFormData.terms || "",
        instructions: editFormData.instructions || "",
        paymentTime: editTimeLimit,
      };

      const response = await fetch(
        `${API_BASE_URL}/api/update-offer`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || `Server error ${response.status}`);

      setSuccessMessage("Offer updated successfully");
      // Update the offer in the list
      setOffers(prev => prev.map(offer =>
        (offer.id || offer._id) === offerId
          ? { ...offer, ...editFormData, paymentTime: editTimeLimit }
          : offer
      ));
      setEditingOffer(null);
    } catch (err: any) {
      console.error("❌ Error updating offer:", err);
      setError(err.message || "Failed to update offer");
    } finally {
      setEditLoading(false);
    }
  };

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Loading states
  if (initialLoading) {
    return (
      <div className="bg-[#1F1F1F] rounded-xl p-8 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DF2BE] mx-auto"></div>
        <p className="text-[#aaa] mt-4">Loading your profile...</p>
      </div>
    );
  }

  if (!clientUser) {
    return (
      <div className="bg-[#1F1F1F] rounded-xl p-8 text-center">
        <p className="text-[#aaa] mb-4">Please log in to view your offers</p>
        <button
          onClick={() => router.push("/login")}
          className="bg-[#4DF2BE] text-[#0F1012] font-bold px-6 py-2 rounded-full hover:bg-[#3DD2A5] transition-colors"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#1F1F1F] rounded-xl p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="text-2xl font-bold text-[#FCFCFC]">My Offers</h2>
        <button
          onClick={() => router.push("/market_place/post_ad")}
          className="bg-[#4DF2BE] text-[#0F1012] text-sm font-bold px-6 py-3 rounded-full hover:bg-[#3DD2A5] transition-colors"
        >
          + Create New Offer
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-[#2D2D2D] rounded-[56px] items-center w-fit mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as "ALL" | "BUY" | "SELL")}
            className={`px-6 py-2 rounded-[40px] text-sm font-medium transition-colors
              ${activeTab === tab
                ? "bg-[#4A4A4A] text-[#FCFCFC]"
                : "text-[#DBDBDB] hover:text-[#FCFCFC]"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Messages */}
      {error && !loading && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
          <p className="text-green-400 text-sm">{successMessage}</p>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div className="mb-4 p-4 bg-[#2D2D2D] rounded-lg border border-red-500/30">
          <p className="text-white text-sm mb-3">Are you sure you want to delete this offer?</p>
          <div className="flex gap-3">
            <button
              onClick={() => handleDeleteOffer(deleteConfirm)}
              className="bg-red-500 text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-red-600 transition-colors"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Yes, Delete"}
            </button>
            <button
              onClick={() => setDeleteConfirm(null)}
              className="bg-[#3A3A3A] text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-[#4A4A4A] transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Edit Offer Modal */}
      {editingOffer && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1F1F1F] rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-[#FCFCFC]">Edit Offer</h3>
              <button
                onClick={() => setEditingOffer(null)}
                className="w-6 h-6 rounded-full bg-[#2D2D2D] flex items-center justify-center hover:bg-[#3A3A3A] transition-colors"
              >
                <Image src={Times} alt="close" width={16} height={16} className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Cryptocurrency */}
              <div>
                <label className="block text-sm font-medium text-[#8F8F8F] mb-1">Cryptocurrency</label>
                <select
                  value={editFormData.crypto || ""}
                  onChange={(e) => handleEditFormChange("crypto", e.target.value)}
                  className="w-full bg-[#2D2D2D] text-[#FCFCFC] px-4 py-3 rounded-lg border border-[#3A3A3A] focus:outline-none focus:border-[#4DF2BE]"
                >
                  <option value="">Select Cryptocurrency</option>
                  {cryptoOptions.map((crypto) => (
                    <option key={crypto.name} value={crypto.name}>{crypto.name}</option>
                  ))}
                </select>
              </div>

              {/* Offer Type */}
              <div>
                <label className="block text-sm font-medium text-[#8F8F8F] mb-1">Offer Type</label>
                <select
                  value={editFormData.type || ""}
                  onChange={(e) => handleEditFormChange("type", e.target.value)}
                  className="w-full bg-[#2D2D2D] text-[#FCFCFC] px-4 py-3 rounded-lg border border-[#3A3A3A] focus:outline-none focus:border-[#4DF2BE]"
                >
                  <option value="">Select Type</option>
                  <option value="BUY">Buy</option>
                  <option value="SELL">Sell</option>
                </select>
              </div>

              {/* Margin */}
              <div>
                <label className="block text-sm font-medium text-[#8F8F8F] mb-1">Margin (%)</label>
                <input
                  type="number"
                  value={editFormData.margin || ""}
                  onChange={(e) => handleEditFormChange("margin", parseFloat(e.target.value))}
                  className="w-full bg-[#2D2D2D] text-[#FCFCFC] px-4 py-3 rounded-lg border border-[#3A3A3A] focus:outline-none focus:border-[#4DF2BE]"
                  placeholder="Enter margin percentage"
                  min="-100" max="100" step="0.1"
                />
                <p className="text-xs text-[#8F8F8F] mt-1">Positive for premium, negative for discount</p>
              </div>

              {/* Min Limit */}
              <div>
                <label className="block text-sm font-medium text-[#8F8F8F] mb-1">Minimum Limit</label>
                <input
                  type="number"
                  value={editFormData.minLimit || ""}
                  onChange={(e) => handleEditFormChange("minLimit", parseFloat(e.target.value))}
                  className="w-full bg-[#2D2D2D] text-[#FCFCFC] px-4 py-3 rounded-lg border border-[#3A3A3A] focus:outline-none focus:border-[#4DF2BE]"
                  placeholder="Enter minimum limit" min="0" step="0.01"
                />
              </div>

              {/* Max Limit */}
              <div>
                <label className="block text-sm font-medium text-[#8F8F8F] mb-1">Maximum Limit</label>
                <input
                  type="number"
                  value={editFormData.maxLimit || ""}
                  onChange={(e) => handleEditFormChange("maxLimit", parseFloat(e.target.value))}
                  className="w-full bg-[#2D2D2D] text-[#FCFCFC] px-4 py-3 rounded-lg border border-[#3A3A3A] focus:outline-none focus:border-[#4DF2BE]"
                  placeholder="Enter maximum limit" min="0" step="0.01"
                />
              </div>

              {/* Fiat Currency */}
              <div>
                <label className="block text-sm font-medium text-[#8F8F8F] mb-1">Fiat Currency</label>
                <select
                  value={editFormData.currency || "USD"}
                  onChange={(e) => handleEditFormChange("currency", e.target.value)}
                  className="w-full bg-[#2D2D2D] text-[#FCFCFC] px-4 py-3 rounded-lg border border-[#3A3A3A] focus:outline-none focus:border-[#4DF2BE]"
                >
                  <option value="USD">USD - US Dollar</option>
                  <option value="EUR">EUR - Euro</option>
                  <option value="GBP">GBP - British Pound</option>
                  <option value="NGN">NGN - Nigerian Naira</option>
                  <option value="BRL">BRL - Brazilian Real</option>
                </select>
              </div>

              {/* Payment Method - using user's saved methods */}
              <div>
                <label className="block text-sm font-medium text-[#8F8F8F] mb-1">Payment Method</label>
                <select
                  value={editFormData.paymentMethod as string || ""}
                  onChange={(e) => handleEditFormChange("paymentMethod", e.target.value)}
                  className="w-full bg-[#2D2D2D] text-[#FCFCFC] px-4 py-3 rounded-lg border border-[#3A3A3A] focus:outline-none focus:border-[#4DF2BE]"
                  disabled={loadingUserMethods}
                >
                  <option value="">
                    {loadingUserMethods ? "Loading your payment methods..." : "Select Payment Method"}
                  </option>
                  {userPaymentMethods.map((method) => {
                    const methodId = method.id || method._id;
                    return (
                      <option key={methodId} value={methodId}>
                        {getMethodDisplay(method)}
                      </option>
                    );
                  })}
                </select>
                {errorUserMethods && (
                  <p className="text-xs text-red-400 mt-1">{errorUserMethods}</p>
                )}
              </div>

              {/* Payment Time Limit */}
              <div className="relative">
                <label className="block text-sm font-medium text-[#8F8F8F] mb-2">Payment Time Limit</label>
                <div
                  className="w-full h-11 bg-[#2D2D2D] flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer"
                  onClick={() => setEditTimeLimitOpen(!editTimeLimitOpen)}
                >
                  <p className="text-[#FCFCFC] text-sm font-medium">{editTimeLimit}</p>
                  <Image src={Barrow} alt="arrow-down" className={`w-3.5 transition-transform duration-200 ${editTimeLimitOpen ? "rotate-180" : ""}`} />
                </div>
                {editTimeLimitOpen && (
                  <div className="absolute top-12 w-full bg-[#3A3A3A] rounded-lg shadow-lg z-50">
                    {timeOptions.map((time, index) => (
                      <div
                        key={index}
                        className="py-3 px-4 cursor-pointer hover:bg-[#4A4A4A] text-[#DBDBDB] text-sm"
                        onClick={() => {
                          setEditTimeLimit(time);
                          setEditTimeLimitOpen(false);
                        }}
                      >
                        {time}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="block text-sm font-bold text-[#DBDBDB] mb-2">Terms (Optional)</label>
                <p className="text-[#8F8F8F] text-sm mb-3">
                  Set clear instructions and an automatic greeting to enhance your trading experience. Terms will be displayed to the counterparty.
                </p>
                <textarea
                  value={editFormData.terms || ""}
                  onChange={(e) => handleEditFormChange("terms", e.target.value)}
                  maxLength={500}
                  placeholder="Enter your trading terms and conditions..."
                  className="w-full h-32 p-3 bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg text-white outline-none focus:border-[#4DF2BE] transition-colors resize-none"
                />
                <div className="flex justify-between text-xs text-[#8F8F8F] mt-1">
                  <span>Terms will be displayed to the counterparty</span>
                  <span>{editFormData.terms?.length || 0}/500</span>
                </div>
              </div>

              {/* Instructions */}
              <div>
                <label className="block text-sm font-bold text-[#DBDBDB] mb-2">Instructions (Optional)</label>
                <p className="text-[#8F8F8F] text-sm mb-3">
                  This message will be sent automatically when someone starts a trade with you.
                </p>
                <textarea
                  value={editFormData.instructions || ""}
                  onChange={(e) => handleEditFormChange("instructions", e.target.value)}
                  maxLength={500}
                  placeholder="Enter your automatic reply message..."
                  className="w-full h-24 p-3 bg-[#3A3A3A] border border-[#4A4A4A] rounded-lg text-white outline-none focus:border-[#4DF2BE] transition-colors resize-none"
                />
                <div className="flex justify-between text-xs text-[#8F8F8F] mt-1">
                  <span>Automatic greeting message</span>
                  <span>{editFormData.instructions?.length || 0}/500</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingOffer(null)}
                className="flex-1 bg-[#2D2D2D] text-white font-bold px-6 py-3 rounded-full hover:bg-[#3A3A3A] transition-colors"
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateOffer}
                className="flex-1 bg-[#4DF2BE] text-[#0F1012] font-bold px-6 py-3 rounded-full hover:bg-[#3DD2A5] transition-colors disabled:opacity-50 flex items-center justify-center"
                disabled={editLoading}
              >
                {editLoading ? (
                  <div className="w-5 h-5 border-2 border-[#0F1012] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Update Offer"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Offers Grid */}
      {loading && offers.length === 0 ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DF2BE] mx-auto"></div>
          <p className="text-[#aaa] mt-4">Loading your offers...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#aaa] text-lg">No {activeTab !== "ALL" ? activeTab.toLowerCase() : ""} offers found</p>
          <p className="text-[#8F8F8F] text-sm mt-2">
            {activeTab === "ALL"
              ? "You haven't created any offers yet"
              : `You don't have any ${activeTab.toLowerCase()} offers`}
          </p>
          <button
            onClick={() => router.push("/market_place/post_ad")}
            className="mt-4 bg-[#4DF2BE] text-[#0F1012] font-bold px-6 py-2 rounded-full hover:bg-[#3DD2A5] transition-colors"
          >
            Create Your First Offer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredOffers.map((offer) => {
            const offerId = offer.id || offer._id;
            const username = getUsername();
            const initial = getUserInitial();
            const tradingPair = getTradingPair(offer);
            const offerPrice = calculateOfferPrice(offer);
            const limits = formatLimits(offer);

            return (
              <div
                key={offerId}
                className="bg-[#2D2D2D] rounded-xl p-4 hover:border hover:border-[#4DF2BE] transition-colors duration-200"
              >
                {/* User Info */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <div className="flex items-center justify-center rounded-full text-xs w-8 h-8 bg-[#4A4A4A] font-bold text-[#C7C7C7]">
                      {initial}
                    </div>
                    <p className="ml-2 text-sm text-white font-medium">
                      {username.startsWith("@") ? username : `@${username}`}
                    </p>
                    <Image src={Mark_green} alt="verified" className="ml-2 w-3 h-3" />
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    offer.type?.toUpperCase() === "SELL"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-blue-500/20 text-blue-400"
                  }`}>
                    {offer.type}
                  </span>
                </div>

                {/* Trading Pair */}
                <div className="mb-3">
                  <p className="text-sm text-[#C7C7C7] font-medium">{tradingPair}</p>
                </div>

                {/* Price and Limits */}
                <div className="space-y-2 mb-3">
                  <div className="flex justify-between">
                    <span className="text-xs text-[#8F8F8F]">Price:</span>
                    <span className="text-base font-bold text-[#4DF2BE]">{offerPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#8F8F8F]">Margin:</span>
                    <span className="text-sm text-[#4DF2BE]">{offer.margin}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-[#8F8F8F]">Limits:</span>
                    <span className="text-sm text-white">{limits}</span>
                  </div>
                </div>

                {/* Created At */}
                <div className="flex items-center mb-4">
                  <span className="text-xs text-[#8F8F8F]">Created:</span>
                  <span className="text-[#4DF2BE] text-xs font-medium ml-1">
                    {formatDate(offer.createdAt)}
                  </span>
                </div>

                {/* Time and Action Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Image src={Timer} alt="timer" className="w-4 h-4 mr-1" />
                    <p className="text-xs text-[#8F8F8F]">{offer.time || "30 min"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditClick(offer)}
                      className="bg-[#3A3A3A] p-2 rounded-full hover:bg-[#4A4A4A] transition-colors"
                      title="Edit Offer"
                      disabled={loading}
                    >
                      <Image src={EditIcon} alt="Edit" width={16} height={16} className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(offerId || null)}
                      className="bg-[#3A3A3A] p-2 rounded-full hover:bg-red-500/20 transition-colors"
                      title="Delete Offer"
                      disabled={loading}
                    >
                      <Image src={DeleteIcon} alt="Delete" width={16} height={16} className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Refresh Button */}
      {offers.length > 0 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={fetchMyOffers}
            className="text-[#8F8F8F] text-sm hover:text-[#4DF2BE] transition-colors flex items-center gap-2"
            disabled={loading}
          >
            <svg
              className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {loading ? "Refreshing..." : "Refresh Offers"}
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOffers;