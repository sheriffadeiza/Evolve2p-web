"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import Image from "next/image";
import Less_than from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";
import Nav from "../../components/NAV/Nav";
import Timer from "../../public/Assets/Evolve2p_time/P2P Marketplace/elements.svg";
import Ochat from "../../public/Assets/Evolve2p_Ochat/P2P Marketplace/elements.svg";
import GreatT from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import BTC from "../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg";
import Yellow_i from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import UPa from "../../public/Assets/Evolve2p_upA/Makretplace/elements.svg";
import Book from "../../public/Assets/Evolve2p_book/P2P Marketplace/book-open-02.svg";
import Vector from "../../public/Assets/Evolve2p_vector/vector.svg";
import Mark_green from "../../public/Assets/Evolve2p_mark/elements.svg";
import Arrow_great from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Gtime from "../../public/Assets/Evolve2p_Gtime/P2P Marketplace/elements.svg";
import Message from "../../public/Assets/Evolve2p_message/P2P Marketplace/elements.svg";
import Mink from "../../public/Assets/Evolve2p_mink/P2P Marketplace/Group.svg";
import Footer from "../../components/Footer/Footer";
import { useRouter } from "next/navigation";
import Check from "../../public/Assets/Evolve2p_checklist/Checklist card.png";
import io, { Socket } from "socket.io-client";

interface TradeData {
  id: string;
  status: string;
  amountCrypto: number;
  cryptoType: string;
  amountFiat: number;
  fiatCurrency: string;
  buyer: { // In console, this contains SELLER data
    id: string;
    username: string;
    email?: string;
    phone?: string;
    bankDetails?: {
      bankName?: string;
      accountNumber?: string;
      accountName?: string;
    };
  };
  seller: { // In console, this contains BUYER data
    id: string;
    username: string;
    email?: string;
  };
  offer: {
    id: string;
    crypto: string;
    price: number;
    currency: string;
    paymentMethod: {
      id: string;
      name: string;
      type: string;
    };
    paymentTerms: string;
  };
  escrow: {
    id: string;
    amount: number;
    status: string;
  };
  chat: {
    id: string;
  };
  updatedAt?: string;
  createdAt?: string;
  markedPaidAt?: string;
  dispute?: {
    id: string;
    status: string;
    reason: string;
    openedAt: string;
  };
}

interface ApiResponse {
  success: boolean;
  data: TradeData;
}

interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
  type?: string;
  attachment?: string;
  sender?: {
    id: string;
    name: string;
    email?: string;
    username?: string;
  };
}

interface DisputeData {
  success: boolean;
  message: string;
  trade: {
    id: string;
    status: string;
    buyer: {
      id: string;
      username: string;
    };
    seller: {
      id: string;
      username: string;
    };
    offer: {
      id: string;
      crypto: string;
      paymentMethod: {
        id: string;
        name: string;
      };
    };
  };
}

interface CancelTradeResponse {
  success: boolean;
  message: string;
  trade: {
    id: string;
    status: string;
    amountCrypto: string;
    buyer: {
      id: string;
      username: string;
    };
    seller: {
      id: string;
      username: string;
    };
  };
}

interface ReleaseTradeResponse {
  success: boolean;
  message: string;
  trade: TradeData;
}

interface DisplayData {
  currentUser: any; // The seller (current user)
  counterparty: any; // The buyer
  currentUserRole: "seller";
  counterpartyRole: "buyer";
  buyerUsername: string; // Counterparty username
  sellerUsername: string; // Current user username
}

const PRC_Sell = () => {
  const router = useRouter();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [tradeData, setTradeData] = useState<TradeData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [messageInput, setMessageInput] = useState("");
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [offerDetails, setOfferDetails] = useState<any>(null);
  const [showDispute, setShowDispute] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);
  
  // Dispute modal state
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState("");
  const [disputeDescription, setDisputeDescription] = useState("");
  const [disputeFile, setDisputeFile] = useState<File | null>(null);
  const [submittingDispute, setSubmittingDispute] = useState(false);
  const [otherReason, setOtherReason] = useState("");
  const [showDisputeSuccessModal, setShowDisputeSuccessModal] = useState(false);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Get current user data from localStorage
  const getCurrentUser = useCallback(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('UserData');
      if (userData) {
        try {
          return JSON.parse(userData);
        } catch (e) {
          console.error("Error parsing user data:", e);
        }
      }
    }
    return null;
  }, []);

  // Get trade ID from URL parameters
  const getTradeIdFromUrl = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tradeId');
  }, []);

  const tradeId = useMemo(() => getTradeIdFromUrl() || "c1a8d7f9-3b3a-4a8a-9b8c-5d7b4e2d4c9f", [getTradeIdFromUrl]);

  // Get authentication token
  const getAuthToken = useCallback(() => {
    const user = getCurrentUser();
    return user?.accessToken || user?.token || null;
  }, [getCurrentUser]);

  // Helper function to get file icon
  const getFileIcon = useCallback((fileType: string) => {
    if (fileType.startsWith('image/')) return '🖼️';
    if (fileType.includes('pdf')) return '📄';
    if (fileType.includes('word') || fileType.includes('document')) return '📝';
    return '📎';
  }, []);

  // Get current user data
  const currentUser = useMemo(() => getCurrentUser(), [getCurrentUser]);

  // CORRECTED: Memoized display data based on reversed console data
  const displayData = useMemo((): DisplayData => {
    if (!tradeData) {
      return {
        currentUser: { username: "You" },
        counterparty: { username: "Buyer123" },
        currentUserRole: "seller",
        counterpartyRole: "buyer",
        buyerUsername: "Buyer123",
        sellerUsername: "You"
      };
    }

    // In console: buyer data contains SELLER info, seller data contains BUYER info
    const consoleBuyer = tradeData.buyer; // Contains SELLER data
    const consoleSeller = tradeData.seller; // Contains BUYER data
    
    // Since this is a seller page, the current user should be the seller
    // Check which one matches the current user ID
    if (currentUser?.id === consoleBuyer?.id) {
      // Current user is the seller (consoleBuyer contains seller data)
      return {
        currentUser: consoleBuyer,
        counterparty: consoleSeller,
        currentUserRole: "seller",
        counterpartyRole: "buyer",
        buyerUsername: consoleSeller?.username || "Buyer123",
        sellerUsername: consoleBuyer?.username || "You"
      };
    } else if (currentUser?.id === consoleSeller?.id) {
      // Current user is the seller (consoleSeller contains seller data)
      return {
        currentUser: consoleSeller,
        counterparty: consoleBuyer,
        currentUserRole: "seller",
        counterpartyRole: "buyer",
        buyerUsername: consoleBuyer?.username || "Buyer123",
        sellerUsername: consoleSeller?.username || "You"
      };
    } else {
      // Fallback: assume consoleBuyer is seller (most common case)
      return {
        currentUser: consoleBuyer,
        counterparty: consoleSeller,
        currentUserRole: "seller",
        counterpartyRole: "buyer",
        buyerUsername: consoleSeller?.username || "Buyer123",
        sellerUsername: consoleBuyer?.username || "You"
      };
    }
  }, [tradeData, currentUser]);

  // Memoize derived values
  const buyerUsername = useMemo(() => displayData.buyerUsername, [displayData]);
  const sellerUsername = useMemo(() => displayData.sellerUsername, [displayData]);
  const isCurrentUserSeller = useMemo(() => displayData.currentUserRole === "seller", [displayData]);

  // Format time as MM:SS
  const formatTime = useCallback((seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, []);

  // Check if trade is released (completed)
  const isTradeReleased = useCallback(() => {
    return tradeData?.status === "COMPLETED" || tradeData?.status === "RELEASED";
  }, [tradeData?.status]);

  // Check if trade is disputed
  const isTradeDisputed = useCallback(() => {
    return tradeData?.status === "DISPUTED" || tradeData?.dispute !== undefined;
  }, [tradeData?.status, tradeData?.dispute]);

  // Check if trade is awaiting release (buyer has marked as paid)
  const isTradeAwaitingRelease = useCallback(() => {
    return tradeData?.status === "PAID" || tradeData?.status === "IN_REVIEW";
  }, [tradeData?.status]);

  // Calculate derived values
  const fiatAmount = useMemo(() => tradeData?.amountFiat || 200.00, [tradeData]);
  const quantity = useMemo(() => tradeData?.amountCrypto || 0.00417, [tradeData]);
  const pricePerCrypto = useMemo(() => tradeData?.offer?.price || 48000, [tradeData]);
  const paymentMethod = useMemo(() => tradeData?.offer?.paymentMethod?.name || "Bank Transfer", [tradeData]);
  const fiatCurrency = useMemo(() => tradeData?.fiatCurrency || tradeData?.offer?.currency || "USD", [tradeData]);
  const cryptoType = useMemo(() => tradeData?.cryptoType || tradeData?.offer?.crypto || "BTC", [tradeData]);

  // Get service message based on trade status
  const getServiceMessage = useCallback(() => {
    const isReleased = isTradeReleased();
    const isDisputed = isTradeDisputed();
    const isAwaitingRelease = isTradeAwaitingRelease();
    
    if (isDisputed) {
      return {
        title: "Trade in Dispute",
        message: `A dispute has been opened for this trade. The ${fiatAmount.toFixed(2)} ${fiatCurrency} payment for ${quantity.toFixed(5)} ${cryptoType} is under review by Evolve2p support team.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bgColor: "bg-[#342827]",
        borderColor: "border-[#FE857D]",
        textColor: "text-[#FE857D]",
        listItems: [
          "Trade is currently under dispute",
          "Evolve2p support team is reviewing the case",
          "You will be notified of any updates in the chat",
          "Resolution typically takes 24-48 hours",
          "Please respond promptly to any support inquiries"
        ]
      };
    } else if (isReleased) {
      return {
        title: "Trade Completed",
        message: `You've successfully sold ${quantity.toFixed(5)} ${cryptoType} for ${fiatAmount.toFixed(2)} ${fiatCurrency}. The crypto has been released to the buyer and payment is complete.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bgColor: "bg-[#1B362B]",
        borderColor: "border-[#1ECB84]",
        textColor: "text-[#1ECB84]",
        listItems: [
          "Trade completed successfully",
          `${cryptoType} has been released to the buyer`,
          "You should have received the payment",
          "Transaction is now closed"
        ]
      };
    } else if (isAwaitingRelease) {
      return {
        title: "Buyer Has Marked as Paid - Awaiting Your Release",
        message: `Buyer has marked this trade as paid. Please confirm payment in your bank account before releasing ${quantity.toFixed(5)} ${cryptoType} to the buyer.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bgColor: "bg-[#1B362B]",
        borderColor: "border-[#1ECB84]",
        textColor: "text-[#1ECB84]",
        listItems: [
          "Buyer has marked the trade as paid",
          "Check your bank account for payment confirmation",
          "Once confirmed, release crypto from escrow",
          "If payment is not received, open a dispute"
        ]
      };
    } else {
      return {
        title: "Awaiting Buyer's Payment",
        message: `You're selling ${quantity.toFixed(5)} ${cryptoType} for ${fiatAmount.toFixed(2)} ${fiatCurrency} via ${paymentMethod}. Share your payment details with the buyer in the chat and wait for them to mark as paid.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bgColor: "bg-[#2D2D2D]",
        borderColor: "border-[#4DF2BE]",
        textColor: "text-white",
        listItems: [
          "Share your payment details in the trade chat",
          "Wait for the buyer to make payment and mark as paid",
          "Once buyer marks as paid, confirm payment receipt",
          "Verify payment in your bank account",
          "Release crypto from escrow to complete the trade"
        ]
      };
    }
  }, [isTradeReleased, isTradeDisputed, isTradeAwaitingRelease, fiatAmount, fiatCurrency, quantity, cryptoType, paymentMethod]);

  // Get the second service message for paid state
  const getSecondServiceMessage = useCallback(() => {
    const isReleased = isTradeReleased();
    const isDisputed = isTradeDisputed();
    const isAwaitingRelease = isTradeAwaitingRelease();
    
    if (isDisputed) {
      return {
        title: "Dispute Status",
        message: "The dispute has been submitted to Evolve2p support. A support agent will contact you shortly for additional information if needed.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bgColor: "bg-[#342827]",
        borderColor: "border-[#FE857D]",
        textColor: "text-[#FE857D]"
      };
    } else if (isReleased) {
      return {
        title: "Escrow Released",
        message: `The ${cryptoType} has been released from escrow to the buyer. The trade is now complete.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bgColor: "bg-[#1B362B]",
        borderColor: "border-[#1ECB84]",
        textColor: "text-[#1ECB84]"
      };
    } else if (isAwaitingRelease) {
      return {
        title: "Crypto in Escrow",
        message: `The ${cryptoType} is securely held in escrow by Evolve2p. It will be released to the buyer once you confirm payment receipt and release it.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        bgColor: "bg-[#1B362B]",
        borderColor: "border-[#1ECB84]",
        textColor: "text-[#1ECB84]"
      };
    }
    return null;
  }, [isTradeReleased, isTradeDisputed, isTradeAwaitingRelease, cryptoType]);

  // Handle file upload selection
  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only images (JPEG, PNG) or PDF/DOC files');
      return;
    }
    
    setSelectedFile(file);
    e.target.value = '';
  }, []);

  // Handle dispute file upload
  const handleDisputeFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB');
      return;
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please upload only images (JPEG, PNG) or PDF/DOC files');
      return;
    }
    
    setDisputeFile(file);
    e.target.value = '';
  }, []);

  // Fetch chat messages
  const fetchChatMessages = useCallback(async () => {
    if (!tradeData?.chat?.id) return;
    
    try {
      const authToken = getAuthToken();
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `https://evolve2p-backend.onrender.com/api/get-chats/${tradeData.chat.id}`,
        {
          method: 'GET',
          headers: headers,
        }
      );
      
      if (response.ok) {
        const messages = await response.json();
        
        if (Array.isArray(messages)) {
          // Sort by date (ascending = oldest first)
          const sortedMessages = messages.sort((a: any, b: any) => {
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });
          
          // Format messages with correct sender names based on display data
          const formattedMessages: ChatMessage[] = sortedMessages.map((msg: any) => {
            // Determine if sender is current user (seller) or counterparty (buyer)
            const isCurrentUser = msg.senderId === displayData.currentUser?.id;
            const senderName = isCurrentUser 
              ? displayData.sellerUsername 
              : displayData.buyerUsername;
            
            return {
              id: msg.id,
              senderId: msg.senderId,
              content: msg.content,
              type: msg.type,
              attachment: msg.attachment,
              createdAt: msg.createdAt,
              sender: {
                id: msg.sender?.id || msg.senderId,
                name: senderName,
                email: msg.sender?.email,
                role: isCurrentUser ? 'seller' : 'buyer'
              }
            };
          });
          
          setChatMessages(formattedMessages);
        }
      }
    } catch (err) {
      console.error("❌ Error fetching chat messages:", err);
    }
  }, [tradeData?.chat?.id, displayData, getAuthToken]);

  // Fetch offer details
  const fetchOfferDetails = useCallback(async (offerId: string, authToken: string | null) => {
    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(
        `https://evolve2p-backend.onrender.com/api/get-offer/${offerId}`,
        {
          method: 'GET',
          headers: headers,
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setOfferDetails(data.data || data.offer || data);
      }
    } catch (err) {
      console.error("❌ Error fetching offer details:", err);
    }
  }, []);

  // Get fallback trade data (for development only)
  const getFallbackTradeData = useCallback((): TradeData => {
    const user = getCurrentUser();
    
    return {
      id: tradeId,
      status: "PENDING", // Initial status
      amountCrypto: 0.00417,
      cryptoType: "BTC",
      amountFiat: 200.00,
      fiatCurrency: "USD",
      buyer: { // Contains SELLER data in console
        id: user?.id || "user_seller_123",
        username: user?.username || "CryptoSeller123",
        email: user?.email || "seller@example.com",
        phone: "+1234567890",
        bankDetails: {
          bankName: "Chase Bank",
          accountNumber: "****1234",
          accountName: "John Seller"
        }
      },
      seller: { // Contains BUYER data in console
        id: "user_buyer_456",
        username: "CryptoBuyer123",
        email: "buyer@example.com"
      },
      offer: {
        id: "offer_789",
        crypto: "BTC",
        price: 48000,
        currency: "USD",
        paymentMethod: {
          id: "pm_123",
          name: "Bank Transfer",
          type: "FIAT"
        },
        paymentTerms: "• Only first-party payments.\n• Bank-to-bank transfers only\n• May request extra KYC"
      },
      escrow: {
        id: "escrow_001",
        amount: 0.00417,
        status: "HELD"
      },
      chat: {
        id: "chat_001"
      },
      createdAt: new Date().toISOString()
    };
  }, [tradeId, getCurrentUser]);

  // Send message
  const handleSendMessage = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim() && !selectedFile) return;
    
    try {
      setSendingMessage(true);
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication required');
      }

      // Current user is the seller in this component
      const senderId = displayData.currentUser?.id || '';
      const senderName = sellerUsername;

      // 1. OPTIMISTIC UPDATE - Show message immediately
      const tempId = `temp_${Date.now()}`;
      const optimisticMessage: ChatMessage = {
        id: tempId,
        senderId: senderId,
        content: messageInput,
        createdAt: new Date().toISOString(),
        sender: {
          id: senderId,
          name: senderName
        }
      };

      // Add to chat immediately
      setChatMessages(prev => {
        const newMessages = [...prev, optimisticMessage];
        return newMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      
      const savedInput = messageInput;
      setMessageInput("");
      
      // 2. Prepare FormData for API
      const formData = new FormData();
      formData.append('chatId', tradeData?.chat.id || '');
      formData.append('content', savedInput);
      
      // Add attachment as binary if exists
      if (selectedFile) {
        setUploadingFile(true);
        formData.append('attachment', selectedFile);
      }

      // 3. Send to API
      const response = await fetch(
        'https://evolve2p-backend.onrender.com/api/send-chat',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${authToken}`
          },
          body: formData
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        // Remove optimistic message if API fails
        setChatMessages(prev => prev.filter(msg => msg.id !== tempId));
        throw new Error(`Failed to send: ${response.status}`);
      }

      const result = await response.json();
      
      // 4. Replace temp message with real one from API
      if (result && result.id) {
        setChatMessages(prev => prev.map(msg => 
          msg.id === tempId 
            ? {
                id: result.id,
                senderId: result.senderId,
                content: result.content,
                type: result.type || "TEXT",
                attachment: result.attachment,
                createdAt: result.createdAt || new Date().toISOString(),
                sender: {
                  id: result.sender?.id || result.senderId,
                  name: result.sender?.name || senderName
                }
              }
            : msg
        ));
      }
      
      // 5. Clear selected file
      setSelectedFile(null);
      
      // 6. Emit via Socket.IO for real-time
      if (socket && socket.connected && tradeData?.chat.id) {
        const finalMessage = result && result.id ? result : optimisticMessage;
        socket.emit('send-message', {
          chatId: tradeData.chat.id,
          message: finalMessage
        });
      }
      
    } catch (error) {
      console.error('❌ Error sending message:', error);
      if (error instanceof Error && !error.message.includes('Failed to fetch')) {
        alert(error.message);
      }
    } finally {
      setSendingMessage(false);
      setUploadingFile(false);
    }
  }, [messageInput, selectedFile, getAuthToken, displayData, sellerUsername, tradeData, socket]);

  // Release trade (seller confirms payment received)
  const handleReleaseTrade = useCallback(async () => {
    try {
      setIsReleasing(true);
      const authToken = getAuthToken();
      
      if (!authToken) {
        throw new Error('Authentication required');
      }

      const response = await fetch(
        `https://evolve2p-backend.onrender.com/api/release-trade/${tradeId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`
          }
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to release trade: ${response.status} - ${errorText}`);
      }

      const result: ReleaseTradeResponse = await response.json();
      
      if (result.success) {
        // Update trade data with the returned trade object
        setTradeData(result.trade);
        
        alert('Trade released successfully! The crypto has been sent to the buyer and the trade is complete.');
        setShowReleaseModal(false);
        
        if (socket && socket.connected) {
          socket.emit('trade-status-changed', {
            tradeId: tradeId,
            status: "COMPLETED"
          });
        }
      } else {
        throw new Error(result.message || 'Failed to release trade');
      }
      
    } catch (error) {
      console.error('❌ Error releasing trade:', error);
      alert(error instanceof Error ? error.message : 'Error releasing trade. Please try again.');
    } finally {
      setIsReleasing(false);
    }
  }, [tradeId, getAuthToken, socket]);

  // Reset dispute form
  const resetDisputeForm = useCallback(() => {
    setDisputeReason("");
    setDisputeDescription("");
    setDisputeFile(null);
    setOtherReason("");
  }, []);

  // Submit dispute
  const handleSubmitDispute = useCallback(async () => {
    // Validation
    if (!disputeReason) {
      alert("Please select a reason for the dispute.");
      return;
    }
    if (disputeReason === "other" && !otherReason.trim()) {
      alert("Please specify the reason for your dispute.");
      return;
    }

    try {
      setSubmittingDispute(true);
      const authToken = getAuthToken();

      if (!authToken) {
        throw new Error('Authentication required');
      }

      // Prepare FormData with correct field names
      const formData = new FormData();
      formData.append('tradeId', tradeId);
      formData.append('reason', disputeReason === "other" ? otherReason : disputeReason);
      
      if (disputeDescription.trim()) {
        formData.append('description', disputeDescription);
      }
      
      if (disputeFile) {
        formData.append('evidence', disputeFile);
      }

      // API call
      const response = await fetch('https://evolve2p-backend.onrender.com/api/open-dispute', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authToken}`
        },
        body: formData
      });

      const result: DisputeData = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Failed to submit dispute: ${response.status}`);
      }

      // Success handling
      if (result.success) {
        // Show success modal instead of alert
        setShowDisputeSuccessModal(true);
        
        // Update trade status
        if (tradeData) {
          setTradeData({
            ...tradeData,
            status: "DISPUTED",
            dispute: {
              id: `disp_${Date.now()}`,
              status: "OPEN",
              reason: disputeReason === "other" ? otherReason : disputeReason,
              openedAt: new Date().toISOString()
            }
          });
        }
        
        // Reset and close dispute form modal
        setShowDisputeModal(false);
        resetDisputeForm();
        setShowDispute(false);
        
        // Socket notification
        if (socket?.connected) {
          socket.emit('trade-dispute-opened', { tradeId, status: "DISPUTED" });
        }
      }

    } catch (error) {
      console.error('❌ Error submitting dispute:', error);
      alert(error instanceof Error ? error.message : 'Error submitting dispute');
    } finally {
      setSubmittingDispute(false);
    }
  }, [disputeReason, otherReason, disputeDescription, disputeFile, tradeId, getAuthToken, tradeData, socket, resetDisputeForm]);

  // Handle back to trade chat button
  const handleBackToTradeChat = useCallback(() => {
    setShowDisputeSuccessModal(false);
    // Ensure chat is open
    if (!showChat) {
      setShowChat(true);
    }
    // Scroll to bottom of chat
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
      }, 100);
    }
  }, [showChat]);

  // Calculate derived values
  const status = useMemo(() => tradeData?.status || "PENDING", [tradeData]);
  const orderId = useMemo(() => tradeData?.id ? `E2P-${tradeData.id.slice(0, 8).toUpperCase()}` : "E2P-2453019273001180", [tradeData]);
  const isDisputed = useMemo(() => isTradeDisputed(), [isTradeDisputed]);
  const isReleased = useMemo(() => isTradeReleased(), [isTradeReleased]);
  const isAwaitingRelease = useMemo(() => isTradeAwaitingRelease(), [isTradeAwaitingRelease]);

  // Format payment terms from offer
  const formatPaymentTerms = useCallback((terms: string): string[] => {
    if (!terms) return [];
    
    return terms
      .split(/[\n,]/)
      .map(term => term.trim())
      .filter(term => term.length > 0)
      .map(term => term.startsWith('•') ? term : `• ${term}`);
  }, []);

  // Get payment terms
  const paymentTerms = useMemo(() => offerDetails?.paymentTerms || tradeData?.offer?.paymentTerms || "• Only first-party payments.\n• Bank-to-bank transfers only\n• May request extra KYC", [offerDetails, tradeData]);

  // Get service message content
  const serviceMessage = useMemo(() => getServiceMessage(), [getServiceMessage]);
  const secondServiceMessage = useMemo(() => getSecondServiceMessage(), [getSecondServiceMessage]);

  // Check if release button should be shown
  const shouldShowReleaseButton = useMemo(() => 
    isAwaitingRelease && !isReleased && !isDisputed && tradeData?.status !== 'CANCELLED',
    [isAwaitingRelease, isReleased, isDisputed, tradeData?.status]
  );

  // Get dispute reason for display
  const getDisplayDisputeReason = useCallback(() => {
    if (!tradeData?.dispute?.reason) return "Payment issue";
    const reason = tradeData.dispute.reason;
    switch(reason) {
      case "payment not received":
        return "Payment not received";
      case "paid wrong amount":
        return "Paid wrong amount";
      case "received wrong payment details":
        return "Wrong payment details";
      case "transaction limit":
        return "Transaction limit issue";
      default:
        return reason;
    }
  }, [tradeData?.dispute?.reason]);

  // Get chat message text based on status
  const getChatMessageText = useCallback(() => {
    if (isDisputed) {
      return "Trade is under dispute. You can communicate with the buyer and support team in the chat.";
    } else if (isReleased) {
      return "Trade completed successfully. The crypto has been released to the buyer and payment is complete.";
    } else if (isAwaitingRelease) {
      return "Buyer has marked the trade as paid. Please confirm payment in your bank account before releasing crypto.";
    } else {
      return "Open chat to share payment details and wait for Buyer to mark as paid. Once marked as paid, confirm payment and release crypto.";
    }
  }, [isDisputed, isReleased, isAwaitingRelease]);

  // Fetch trade data
  useEffect(() => {
    const fetchTradeData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const authToken = getAuthToken();
        
        const headers: HeadersInit = {
          'Content-Type': 'application/json',
        };

        if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
        }

        console.log(`📡 Fetching trade ${tradeId}...`);
        
        const response = await fetch(
          `https://evolve2p-backend.onrender.com/api/get-trade/${tradeId}`,
          {
            method: 'GET',
            headers: headers,
          }
        );
        
        if (response.status === 401) {
          throw new Error('Unauthorized: Please login again');
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch trade: ${response.status} - ${errorText}`);
        }
        
        const apiResponse: ApiResponse = await response.json();
        
        console.log("🔍 Raw Trade Data from API:");
        console.log("API Buyer (should be seller data):", apiResponse.data?.buyer);
        console.log("API Seller (should be buyer data):", apiResponse.data?.seller);
        console.log("Current User ID:", currentUser?.id);
        
        if (apiResponse.success && apiResponse.data) {
          const trade = apiResponse.data;
          
          setTradeData(trade);
          
          if (trade.offer?.id) {
            await fetchOfferDetails(trade.offer.id, authToken);
          }
        } else {
          throw new Error('Invalid response format from server');
        }
        
      } catch (err) {
        console.error("❌ Error fetching trade data:", err);
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch trade data";
        setError(errorMessage);
        
        if (process.env.NODE_ENV === 'development') {
          console.log("🛠️ Using fallback data for development");
          setTradeData(getFallbackTradeData());
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTradeData();
  }, [tradeId, getAuthToken, currentUser, fetchOfferDetails, getFallbackTradeData]);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!tradeData?.chat?.id) return;

    const authToken = getAuthToken();
    if (!authToken) {
      console.log("No auth token for socket connection");
      return;
    }

    // Initialize socket connection
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "https://evolve2p-backend.onrender.com";
    const newSocket = io(socketUrl, {
      query: {
        token: authToken,
        chatId: tradeData.chat.id
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log("✅ Socket.IO connected");
      setIsSocketConnected(true);
      newSocket.emit('join-chat', tradeData.chat.id);
    });

    newSocket.on('disconnect', () => {
      console.log("🔌 Socket.IO disconnected");
      setIsSocketConnected(false);
    });

    newSocket.on('error', (error: any) => {
      console.error("❌ Socket.IO error:", error);
    });

    newSocket.on('new-message', (message: ChatMessage) => {
      console.log("📨 New message received via Socket.IO:", message);
      
      // Check if message already exists
      const messageExists = chatMessages.some(msg => msg.id === message.id);
      if (messageExists) return;
      
      // Determine sender display name based on display data
      const isCurrentUser = message.senderId === displayData.currentUser?.id;
      const senderName = isCurrentUser 
        ? displayData.sellerUsername 
        : displayData.buyerUsername;
      
      // Add message to chat
      setChatMessages(prev => {
        const formattedMessage = {
          ...message,
          sender: {
            id: message.senderId,
            name: senderName,
            role: isCurrentUser ? 'seller' : 'buyer'
          }
        };
        const newMessages = [...prev, formattedMessage];
        // Sort by date (ascending)
        return newMessages.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
    });

    newSocket.on('trade-updated', (updatedTrade: TradeData) => {
      console.log("🔄 Trade updated via Socket.IO:", updatedTrade);
      setTradeData(updatedTrade);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.emit('leave-chat', tradeData.chat.id);
        newSocket.disconnect();
        console.log("🧹 Socket.IO disconnected on cleanup");
      }
    };
  }, [tradeData?.chat?.id, getAuthToken, displayData, chatMessages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      setTimeout(() => {
        chatContainerRef.current!.scrollTop = chatContainerRef.current!.scrollHeight;
      }, 100);
    }
  }, [chatMessages]);

  // Active timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft]);

  // Check for dispute after 10 minutes of trade creation
  useEffect(() => {
    if (!tradeData?.createdAt) return;

    const checkDispute = () => {
      const now = new Date();
      const timeSinceCreated = now.getTime() - new Date(tradeData.createdAt!).getTime();
      const tenMinutes = 10 * 60 * 1000;
      
      if (timeSinceCreated >= tenMinutes && !isTradeDisputed() && !isTradeAwaitingRelease() && !isTradeReleased()) {
        setShowDispute(true);
      }
    };

    checkDispute();
    const interval = setInterval(checkDispute, 60000);
    
    return () => clearInterval(interval);
  }, [tradeData?.createdAt, isTradeDisputed, isTradeAwaitingRelease, isTradeReleased]);

  // Fetch chat messages when chat opens
  useEffect(() => {
    if (showChat && tradeData?.chat?.id) {
      fetchChatMessages();
    }
  }, [showChat, tradeData?.chat?.id, fetchChatMessages]);

  // Memoize the formatted payment terms
  const formattedPaymentTerms = useMemo(() => formatPaymentTerms(paymentTerms), [formatPaymentTerms, paymentTerms]);

  // Memoize trade summary data
  const tradeSummaryData = useMemo(() => [
    { label: "You are selling", value: cryptoType, isCrypto: true },
    { label: "Buyer", value: `@${buyerUsername}` },
    { label: "Amount to Receive", value: `${fiatAmount.toFixed(2)} ${fiatCurrency}`, isAmount: true },
    { label: `Price per 1 ${cryptoType}`, value: `1 ${cryptoType} = ${pricePerCrypto.toLocaleString()} ${fiatCurrency}` },
    { label: "Quantity", value: `${quantity.toFixed(5)} ${cryptoType}`, isQuantity: true },
    { label: "Payment Method", value: paymentMethod, hasBorder: true },
    { label: "Status", value: "", hasStatus: true },
    ...(isDisputed && tradeData?.dispute?.reason ? [{ label: "Dispute Reason", value: getDisplayDisputeReason(), isDispute: true }] : [])
  ], [cryptoType, buyerUsername, fiatAmount, fiatCurrency, pricePerCrypto, quantity, paymentMethod, isDisputed, tradeData?.dispute?.reason, getDisplayDisputeReason]);

  // Don't return early - always render the component structure
  const renderContent = () => {
    if (loading) {
      return (
        <div className="min-h-screen bg-[#0F1012] text-white flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4DF2BE] mx-auto mb-4"></div>
            <p>Loading trade data...</p>
          </div>
        </div>
      );
    }

    if (error && !tradeData) {
      return (
        <div className="min-h-screen bg-[#0F1012] text-white flex items-center justify-center">
          <div className="text-center text-red-400 max-w-md mx-auto">
            <p className="text-lg font-semibold mb-2">Error Loading Trade</p>
            <p className="text-sm mb-4">{error}</p>
            <div className="flex gap-4 justify-center">
              <button 
                onClick={() => router.push('/login')}
                className="px-6 py-2 bg-[#4DF2BE] text-[#0F1012] rounded-full font-bold hover:bg-[#3DD2A5] transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#3A3A3A] text-white rounded-full font-bold hover:bg-[#4A4A4A] transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <main className="min-h-screen bg-[#0F1012] text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Nav />

          {/* Back navigation */}
          <div className="flex items-center gap-3 text-base font-medium text-white mb-6 lg:mb-8 cursor-pointer" onClick={() => router.back()}>
            <Image src={Less_than} alt="lessthan" className="w-4 h-4" />
            <p>Sell {cryptoType}</p>
          </div>

          {/* Demo data warning */}
          {error && tradeData && (
            <div className="mb-4 p-4 bg-yellow-500/20 border border-yellow-500 rounded-lg">
              <div className="flex items-center justify-between">
                <p className="text-yellow-400 text-sm">
                  Using demo data. Authentication required for real data.
                </p>
                <button 
                  onClick={() => router.push('/login')}
                  className="ml-4 px-3 py-1 bg-yellow-500 text-black text-xs rounded-full hover:bg-yellow-400"
                >
                  Login
                </button>
              </div>
            </div>
          )}

          {/* Main content */}
          <div className={`flex gap-6 lg:gap-8 ${showChat ? 'flex-col xl:flex-row' : 'flex-col'}`}>
            {/* Left section - Trade Details */}
            <div className={`${showChat ? 'xl:flex-1' : 'w-full'} max-w-4xl`}>
              {/* Progress steps - SIMPLIFIED: 3 steps for seller */}
              <div className="flex items-center justify-between max-w-2xl">
                <div className="flex flex-col items-center">
                  <div className={`w-full border-b-2 ${!isAwaitingRelease && !isReleased ? 'border-[#4DF2BE]' : 'border-[#4A4A4A]'} pb-2 px-4`}>
                    <p className={`text-base font-medium ${!isAwaitingRelease && !isReleased ? 'text-[#4DF2BE]' : 'text-[#5C5C5C]'} text-center`}>
                      Awaiting 
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-full border-b-2 ${isAwaitingRelease && !isReleased ? 'border-[#4DF2BE]' : 'border-[#4A4A4A]'} pb-2 px-4`}>
                    <p className={`text-base font-medium ${isAwaitingRelease && !isReleased ? 'text-[#4DF2BE]' : 'text-[#5C5C5C]'} text-center`}>
                      Release
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className={`w-full border-b-2 ${isReleased ? 'border-[#4DF2BE]' : 'border-[#4A4A4A]'} pb-2 px-4`}>
                    <p className={`text-base font-medium ${isReleased ? 'text-[#4DF2BE]' : 'text-[#5C5C5C]'} text-center`}>
                      Complete
                    </p>
                  </div>
                </div>
              </div>

              {/* Order info */}
              <div className="mt-6 lg:mt-8 max-w-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="text-2xl font-normal text-white">
                      {isDisputed ? 'Trade in Dispute' : 
                       isReleased ? 'Trade Completed' :
                       isAwaitingRelease ? 'Awaiting Your Release' : 'Order Created'}
                    </p>
                    <p className="text-sm font-medium text-[#C7C7C7] mt-1">
                      Order ID: {orderId}
                    </p>
                    {isDisputed ? (
                      <p className="text-sm font-normal text-[#DBDBDB] mt-2">
                        This trade is currently under dispute. Evolve2p support team is reviewing the case.
                        {tradeData?.dispute?.reason && ` Reason: ${getDisplayDisputeReason()}`}
                      </p>
                    ) : isReleased ? (
                      <p className="text-sm font-normal text-[#DBDBDB] mt-2">
                        Trade completed successfully. The crypto has been released to the buyer and payment is complete.
                      </p>
                    ) : isAwaitingRelease ? (
                      <p className="text-sm font-normal text-[#DBDBDB] mt-2">
                        Buyer has marked the trade as paid. Please confirm payment in your bank account before releasing crypto.
                      </p>
                    ) : (
                      <p className="text-sm font-normal text-[#DBDBDB] mt-2">
                        Order created successfully. Share your payment details and wait for buyer to mark as paid.
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-[#3A3A3A] rounded-2xl w-[100px]">
                    <Image src={Timer} alt="time" className="w-4 h-4" />
                    <p className={`text-sm font-medium ${timeLeft < 300 ? 'text-red-400' : 'text-[#DBDBDB]'}`}>
                      {formatTime(timeLeft)}
                    </p>
                  </div>
                </div>

                {/* Chat button and escrow info */}
                <div className="mt-6 lg:mt-8 max-w-2xl">
                  <p className="text-base font-normal text-[#DBDBDB] mb-4">
                    {getChatMessageText()}
                  </p>
                  <button 
                    onClick={() => setShowChat(!showChat)}
                    className={`w-full max-w-2xl h-12 flex items-center justify-center gap-2 rounded-full transition-colors ${
                      isDisputed 
                        ? "bg-[#342827] border border-[#FE857D] cursor-pointer hover:bg-[#3D2C2C]" 
                        : isReleased || isAwaitingRelease
                        ? "bg-[#1B362B] border border-[#1ECB84] cursor-pointer hover:bg-[#1A4030]" 
                        : "bg-[#2D2D2D] hover:bg-[#3A3A3A]"
                    }`}
                  >
                    <Image src={Ochat} alt="chat" className="w-5 h-5" />
                    <p className={`text-sm font-bold ${isDisputed ? 'text-[#FE857D]' : isReleased || isAwaitingRelease ? 'text-[#1ECB84]' : 'text-white'}`}>
                      {showChat ? 'Close Chat' : 'Open Chat'}
                    </p>
                    <Image 
                      src={GreatT} 
                      alt="arrow" 
                      className={`w-5 h-5 transition-transform ${showChat ? 'rotate-180' : ''}`}
                      style={isDisputed ? { filter: 'invert(58%) sepia(19%) saturate(3785%) hue-rotate(334deg) brightness(105%) contrast(96%)' } : 
                              isReleased || isAwaitingRelease ? { filter: 'invert(58%) sepia(93%) saturate(372%) hue-rotate(100deg) brightness(94%) contrast(94%)' } : {}}
                    />
                  </button>
                </div>

                {/* Trade Summary - CORRECT: Current user is SELLER */}
                <div className="mt-6 lg:mt-8 max-w-2xl">
                  <p className="text-sm font-bold text-white mb-4">Trade Summary</p>
                  <div className="bg-[#2D2D2D] rounded-xl overflow-hidden">
                    {tradeSummaryData.map((item, index) => (
                      <div 
                        key={index} 
                        className={`flex items-center justify-between p-3 sm:p-4 ${index > 0 ? 'border-t border-[#3A3A3A]' : ''} ${item.hasBorder ? 'border-l-2 border-l-[#FFFA66]' : ''}`}
                      >
                        <p className="text-sm font-medium text-[#DBDBDB]">{item.label}</p>
                        {item.isCrypto ? (
                          <div className="flex items-center gap-2 px-2 py-1 rounded-2xl bg-[#3A3A3A]">
                            <Image src={BTC} alt="crypto" className="w-4 h-4" />
                            <p className="text-xs font-medium text-[#DBDBDB]">
                              {item.value}
                            </p>
                          </div>
                        ) : item.isAmount ? (
                          <p className="text-base font-medium text-[#33A2FF]">
                            {item.value}
                          </p>
                        ) : item.isQuantity ? (
                          <p className="text-base font-medium text-[#4DF2BE]">
                            {item.value}
                          </p>
                        ) : item.hasStatus ? (
                          <div className={`flex items-center gap-1 px-2 py-1 rounded-2xl ${
                            isDisputed ? 'bg-[#342827]' :
                            isReleased ? 'bg-[#1B362B]' : 
                            isAwaitingRelease ? 'bg-[#1B362B]' :
                            tradeData?.status === 'CANCELLED' ? 'bg-[#342827]' : 'bg-[#352E21]'
                          }`}>
                            {isDisputed ? (
                              <>
                                <svg className="w-3 h-3 text-[#FE857D]" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                </svg>
                                <p className="text-xs font-medium text-[#FE857D]">
                                  DISPUTED
                                </p>
                              </>
                            ) : isReleased ? (
                              <>
                                <Image src={Check} alt="check" className="w-3 h-3" />
                                <p className="text-xs font-medium text-[#1ECB84]">
                                  COMPLETED
                                </p>
                              </>
                            ) : isAwaitingRelease ? (
                              <>
                                <Image src={Check} alt="check" className="w-3 h-3" />
                                <p className="text-xs font-medium text-[#1ECB84]">
                                  AWAITING RELEASE
                                </p>
                              </>
                            ) : tradeData?.status === 'CANCELLED' ? (
                              <>
                                <Image src={Yellow_i} alt="cancelled" className="w-3 h-3" />
                                <p className="text-xs font-medium text-[#FE857D]">
                                  CANCELLED
                                </p>
                              </>
                            ) : (
                              <>
                                <Image src={Yellow_i} alt="icon" className="w-3 h-3" />
                                <p className="text-xs font-medium text-[#FFC051]">
                                  PENDING
                                </p>
                              </>
                            )}
                          </div>
                        ) : item.isDispute ? (
                          <p className="text-sm font-medium text-[#FE857D] text-right max-w-[200px]">
                            {item.value}
                          </p>
                        ) : (
                          <p className="text-sm font-medium text-white">
                            {item.value}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Action Buttons - SIMPLIFIED: Only Release Crypto when awaiting release */}
                  {tradeData?.status === 'CANCELLED' ? (
                    <div className="mt-6">
                      <div className="w-full max-w-2xl h-12 bg-[#342827] border border-[#FE857D] text-[#FE857D] font-bold rounded-full flex items-center justify-center gap-2">
                        <Image src={Yellow_i} alt="cancelled" className="w-5 h-5" />
                        <span>Trade Cancelled by Buyer</span>
                      </div>
                      <p className="text-center text-sm text-[#8F8F8F] mt-2">
                        The buyer cancelled this trade. Your crypto has been returned to you.
                      </p>
                      <button
                        onClick={() => router.push('/market_place')}
                        className="w-full max-w-2xl h-12 bg-[#3A3A3A] text-white font-bold rounded-full hover:bg-[#4A4A4A] transition-colors mt-4"
                      >
                        Return to Marketplace
                      </button>
                    </div>
                  ) : isDisputed ? (
                    <div className="mt-6">
                      <div className="w-full max-w-2xl h-12 bg-[#342827] border border-[#FE857D] text-[#FE857D] font-bold rounded-full flex items-center justify-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                        </svg>
                        <span>Trade in Dispute - Under Review</span>
                      </div>
                      <p className="text-center text-sm text-[#8F8F8F] mt-2">
                        The support team will contact you in the chat if additional information is needed.
                      </p>
                    </div>
                  ) : isReleased ? (
                    <div className="mt-6">
                      <div className="w-full max-w-2xl h-12 bg-[#1B362B] border border-[#1ECB84] text-[#1ECB84] font-bold rounded-full flex items-center justify-center gap-2">
                        <Image src={Check} alt="check" className="w-5 h-5" />
                        <span>Trade Completed</span>
                      </div>
                      <p className="text-center text-sm text-[#8F8F8F] mt-2">
                        The crypto has been released to the buyer and payment is complete.
                      </p>
                      <button
                        onClick={() => router.push('/market_place')}
                        className="w-full max-w-2xl h-12 bg-[#3A3A3A] text-white font-bold rounded-full hover:bg-[#4A4A4A] transition-colors mt-4"
                      >
                        Return to Marketplace
                      </button>
                    </div>
                  ) : shouldShowReleaseButton ? (
                    <div className="mt-6">
                      <button
                        onClick={() => setShowReleaseModal(true)}
                        className="w-full max-w-2xl h-12 bg-[#4DF2BE] text-[#0F1012] font-bold rounded-full hover:bg-[#3DD2A5] transition-colors flex items-center justify-center gap-2"
                      >
                        <span>Release Crypto to Buyer</span>
                      </button>
                      <p className="text-center text-sm text-[#8F8F8F] mt-2">
                        Only release after confirming payment in your bank account
                      </p>
                    </div>
                  ) : null}

                  {/* Dispute Container - Only show if not already disputed and not awaiting release */}
                  {showDispute && !isDisputed && !isReleased && !isAwaitingRelease && (
                    <div className="mt-6 p-4 bg-[#342827] rounded-lg border-l-2 border-l-[#FE857D]" style={{ maxWidth: '800px' }}>
                      <div className="flex items-start gap-3">
                        <Image src={Yellow_i} alt="alert" className="w-5 h-5 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-white mb-2">
                            Haven't received payment notification?
                          </p>
                          <p className="text-xs text-[#DBDBDB] mb-3">
                            If buyer hasn't marked as paid and you're concerned, you can open a dispute.
                          </p>
                          <button
                            onClick={() => setShowDisputeModal(true)}
                            className="px-4 py-2 bg-[#FE857D] text-white text-sm font-medium rounded-full hover:bg-[#E8746D] transition-colors"
                          >
                            Open Dispute
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Helpful Tips */}
                <div className="mt-6 lg:mt-8 max-w-2xl bg-[#2D2D2D] rounded-xl p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsHelpOpen(!isHelpOpen)}
                  >
                    <p className="text-sm font-bold text-white">Helpful Tips</p>
                    <Image
                      src={UPa}
                      alt="up"
                      className={`transition-transform duration-300 ${
                        isHelpOpen ? "rotate-180" : "rotate-0"
                      } w-5 h-5`}
                    />
                  </div>
                  {isHelpOpen && (
                    <ul className="text-[#DBDBDB] text-sm space-y-2 font-medium mt-3">
                      <li>• As a seller, you only have one button: "Release Crypto"</li>
                      <li>• Only release after buyer marks as paid AND you confirm payment</li>
                      <li>• Don't release before payment confirmation</li>
                      <li>• Only accept payments from verified accounts</li>
                      <li>• Verify payment receipt before releasing crypto</li>
                      <li>• If you encounter issues, open a dispute</li>
                      <li>• As a seller, you cannot cancel trades. Only the buyer can cancel.</li>
                    </ul>
                  )}
                </div>

                {/* Offer Terms */}
                <div className="mt-6 lg:mt-8 max-w-2xl bg-[#2D2D2D] rounded-xl p-4">
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsTermsOpen(!isTermsOpen)}
                  >
                    <p className="text-sm font-bold text-white">Offer Terms (please read carefully)</p>
                    <Image
                      src={UPa}
                      alt="up"
                      className={`transition-transform duration-300 ${
                        isTermsOpen ? "rotate-180" : "rotate-0"
                      } w-5 h-5`}
                    />
                  </div>
                  {isTermsOpen && (
                    <ul className="text-[#DBDBDB] text-sm space-y-2 font-medium mt-3">
                      {formattedPaymentTerms.map((term, index) => (
                        <li key={index}>{term}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Guide link */}
                <div className="flex items-center justify-center gap-2 mt-6 lg:mt-8">
                  <Image src={Book} alt="book" className="w-5 h-5" />
                  <p className="text-sm text-[#4DF2BE] font-bold">Read our guide for selling crypto</p>
                </div>
              </div>
            </div>

            {/* Right section - Chat (Only shows when showChat is true) */}
            {showChat && (
              <div className="xl:w-96">
                <div className="bg-[#1A1A1A] rounded-xl overflow-hidden h-full flex flex-col max-h-[600px]">
                  {/* Chat header - Shows buyer (counterparty) */}
                  <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[#3A3A3A]">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 bg-[#4A4A4A] rounded-full flex items-center justify-center">
                          <p className="text-sm font-bold text-[#8F8F8F]">
                            {buyerUsername.slice(0, 2).toUpperCase()}
                          </p>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#FCFCFC]">{buyerUsername}</p>
                        <p className="text-xs text-[#8F8F8F]">
                          Buyer • Online
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-[#3A3A3A] rounded-2xl">
                      <Image src={Timer} alt="time" className="w-4 h-4" />
                      <p className={`text-sm font-medium ${timeLeft < 300 ? 'text-red-400' : 'text-[#DBDBDB]'}`}>
                        {formatTime(timeLeft)}
                      </p>
                    </div>
                  </div>

                  {/* Chat content */}
                  <div ref={chatContainerRef} className="flex-1 p-4 sm:p-6 overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-2xl ${
                        isDisputed ? 'bg-[#342827]' : 
                        isReleased ? 'bg-[#1B362B]' : 
                        isAwaitingRelease ? 'bg-[#1B362B]' : 'bg-[#352E21]'
                      }`}>
                        <Image src={Timer} alt="gtime" className="w-4 h-4" />
                        <p className={`text-sm font-medium ${
                          isDisputed ? 'text-[#FE857D]' : 
                          isReleased ? 'text-[#1ECB84]' : 
                          isAwaitingRelease ? 'text-[#1ECB84]' : 'text-[#FFC051]'
                        }`}>
                          {isDisputed ? 'In Dispute' : 
                           isReleased ? 'Completed' : 
                           isAwaitingRelease ? 'Awaiting Release' : 'Awaiting Payment'}
                        </p>
                      </div>
                      {shouldShowReleaseButton && (
                        <button 
                          onClick={() => setShowReleaseModal(true)}
                          className="px-6 py-3 bg-[#4DF2BE] text-[#0F1012] font-medium rounded-full hover:bg-[#3DD2A5] transition-colors"
                        >
                          Release Crypto
                        </button>
                      )}
                      {isDisputed && (
                        <div className="px-6 py-3 bg-[#342827] border border-[#FE857D] text-[#FE857D] font-medium rounded-full flex items-center gap-2">
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                          </svg>
                          <span>Disputed</span>
                        </div>
                      )}
                      {isReleased && (
                        <div className="px-6 py-3 bg-[#1B362B] border border-[#1ECB84] text-[#1ECB84] font-medium rounded-full flex items-center gap-2">
                          <Image src={Check} alt="check" className="w-5 h-5" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>

                    <div className="border-t border-[#3A3A3A] my-6"></div>

                    {/* FIRST Service Message */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-[#4DF2BE] uppercase tracking-wide">
                          Evolve2p Service Message
                        </span>
                        <span className="text-xs text-[#8F8F8F]">
                          {serviceMessage.timestamp}
                        </span>
                      </div>
                      <div className={`rounded-2xl p-5 border shadow-lg ${
                        isDisputed 
                          ? 'bg-gradient-to-r from-[#342827] to-[#2A1F1F] border-[#FE857D]' 
                          : isReleased || isAwaitingRelease
                          ? 'bg-gradient-to-r from-[#1B362B] to-[#143026] border-[#1ECB84]'
                          : 'bg-gradient-to-r from-[#2D2D2D] to-[#1A1A1A] border-[#4DF2BE]'
                      }`}>
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 ${
                            isDisputed ? 'bg-[#0F1012]/30' : 
                            isReleased || isAwaitingRelease ? 'bg-[#0F1012]/30' : 'bg-[#0F1012]/30'
                          } rounded-full flex items-center justify-center flex-shrink-0`}>
                            <svg className={`w-5 h-5 ${
                              isDisputed ? 'text-[#FE857D]' : 
                              isReleased || isAwaitingRelease ? 'text-[#1ECB84]' : 'text-white'
                            }`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="text-base font-bold text-white mb-2">{serviceMessage.title}</h4>
                            <p className="text-sm text-white/90 leading-relaxed mb-4">
                              {serviceMessage.message}
                            </p>
                            
                            {/* Warning box inside service message */}
                            {!isDisputed && !isReleased && !isAwaitingRelease && (
                              <div className="mt-4 p-4 bg-[#352E21]/80 rounded-xl border border-[#FFC051]/30">
                                <div className="flex items-start gap-2">
                                  <svg className="w-4 h-4 text-[#FFC051] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                  </svg>
                                  <p className="text-sm font-medium text-[#FFC051]">
                                    As a seller, you only have "Release Crypto" button. Wait for buyer to mark as paid first.
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {isAwaitingRelease && (
                              <div className="mt-4 p-4 bg-[#352E21]/80 rounded-xl border border-[#FFC051]/30">
                                <div className="flex items-start gap-2">
                                  <svg className="w-4 h-4 text-[#FFC051] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                  </svg>
                                  <p className="text-sm font-medium text-[#FFC051]">
                                    Only release crypto after confirming payment in your bank account. Do not release based solely on buyer's claim.
                                  </p>
                                </div>
                              </div>
                            )}
                            
                            {/* Steps list */}
                            <ul className="mt-4 space-y-3">
                              {serviceMessage.listItems.map((item, index) => (
                                <li key={index} className="flex items-start gap-3">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                                    isDisputed ? 'bg-[#FE857D]/20' : 
                                    isReleased || isAwaitingRelease ? 'bg-[#1ECB84]/20' : 'bg-[#4DF2BE]/20'
                                  }`}>
                                    <span className={`text-xs font-bold ${
                                      isDisputed ? 'text-[#FE857D]' : 
                                      isReleased || isAwaitingRelease ? 'text-[#1ECB84]' : 'text-[#4DF2BE]'
                                    }`}>
                                      {index + 1}
                                    </span>
                                  </div>
                                  <span className="text-sm text-white/80">{item}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* SECOND Service Message */}
                    {secondServiceMessage && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold text-[#4DF2BE] uppercase tracking-wide">
                            {isDisputed ? 'Evolve2p Dispute Service' : 'Evolve2p Escrow Service'}
                          </span>
                          <span className="text-xs text-[#8F8F8F]">
                            {secondServiceMessage.timestamp}
                          </span>
                        </div>
                        <div className={`rounded-2xl p-5 border shadow-lg ${
                          isDisputed 
                            ? 'bg-gradient-to-r from-[#342827] to-[#2A1F1F] border-[#FE857D]' 
                            : 'bg-gradient-to-r from-[#1B362B] to-[#143026] border-[#1ECB84]'
                        }`}>
                          <div className="flex items-start gap-3">
                            <div className={`w-10 h-10 ${isDisputed ? 'bg-[#0F1012]/30' : 'bg-[#0F1012]/30'} rounded-full flex items-center justify-center flex-shrink-0`}>
                              <svg className={`w-5 h-5 ${isDisputed ? 'text-[#FE857D]' : 'text-[#1ECB84]'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                              </svg>
                            </div>
                            <div className="flex-1">
                              <h4 className="text-base font-bold text-white mb-2">{secondServiceMessage.title}</h4>
                              <p className="text-sm text-white/90 leading-relaxed">
                                {secondServiceMessage.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* SEPARATOR: Start of Seller/Buyer Chat */}
                    <div className="relative my-8">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#3A3A3A]"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="px-4 bg-[#1A1A1A] text-sm font-medium text-[#8F8F8F]">
                          Chat with @{buyerUsername} (Buyer)
                        </span>
                      </div>
                    </div>
                    
                    {/* SELLER/BUYER CHAT MESSAGES - CORRECT: Current user is SELLER */}
                    <div className="space-y-4">
                      {chatMessages.length > 0 ? (
                        chatMessages
                          .filter(msg => msg.senderId !== "system" && msg.senderId !== "service")
                          .map((message) => {
                            const isCurrentUser = message.senderId === displayData.currentUser?.id;
                            const displayName = message.sender?.name || (isCurrentUser ? sellerUsername : buyerUsername);
                            
                            return (
                              <div
                                key={message.id}
                                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                              >
                                <div className={`max-w-[85%] ${isCurrentUser ? 'ml-4' : 'mr-4'}`}>
                                  
                                  {/* Message header with name and time */}
                                  <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                    {!isCurrentUser && (
                                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#4DF2BE] to-[#33A2FF] flex items-center justify-center">
                                        <span className="text-xs font-bold text-[#0F1012]">
                                          {displayName.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    )}
                                    <span className="text-xs font-medium text-[#4DF2BE]">
                                      {isCurrentUser ? 'You (Seller)' : `@${displayName} (Buyer)`}
                                    </span>
                                    <span className="text-xs text-[#8F8F8F]">
                                      {new Date(message.createdAt).toLocaleTimeString([], { 
                                        hour: '2-digit', 
                                        minute: '2-digit' 
                                      })}
                                    </span>
                                    {isCurrentUser && (
                                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#4DF2BE] to-[#33A2FF] flex items-center justify-center">
                                        <span className="text-xs font-bold text-[#0F1012]">Y</span>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {/* Message bubble */}
                                  <div
                                    className={`rounded-2xl p-4 shadow-lg ${
                                      isCurrentUser
                                        ? 'bg-gradient-to-r from-[#4DF2BE] to-[#33A2FF] text-[#0F1012] rounded-br-none'
                                        : 'bg-[#2D2D2D] border border-[#3A3A3A] text-white rounded-bl-none'
                                    }`}
                                  >
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                                      {message.content}
                                    </p>
                                    
                                    {/* File attachment preview */}
                                    {message.attachment && (
                                      <div className="mt-3">
                                        <a
                                          href={message.attachment}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className={`inline-flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.02] ${
                                            isCurrentUser
                                              ? 'bg-[#0F1012]/20 hover:bg-[#0F1012]/30'
                                              : 'bg-[#1A1A1A] hover:bg-[#222222]'
                                          }`}
                                        >
                                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                            isCurrentUser ? 'bg-[#0F1012]/30' : 'bg-[#3A3A3A]'
                                          }`}>
                                            <span className="text-xl">
                                              {getFileIcon(message.type || "image/jpeg")}
                                            </span>
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">
                                              Attachment
                                            </p>
                                            <p className="text-xs opacity-75">
                                              {message.type === "IMAGE" ? "Image" : 
                                               message.type === "PDF" ? "PDF Document" : "File"}
                                            </p>
                                          </div>
                                          <svg className={`w-5 h-5 ${isCurrentUser ? 'text-[#0F1012]' : 'text-white'}`} 
                                               fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                                          </svg>
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      ) : (
                        <div className="text-center py-12">
                          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-[#2D2D2D] flex items-center justify-center">
                            <svg className="w-10 h-10 text-[#8F8F8F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                            </svg>
                          </div>
                          <p className="text-sm text-[#8F8F8F] mb-2">
                            No messages yet
                          </p>
                          <p className="text-xs text-[#5C5C5C]">
                            Start the conversation by sharing your payment details with the buyer
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Message input with file upload */}
                  <div className="p-4 border-t border-[#3A3A3A]">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                      <input
                        type="file"
                        id="file-upload"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        disabled={sendingMessage || uploadingFile || isDisputed}
                      />
                      
                      <div className="flex-1 relative">
                        <input
                          value={messageInput}
                          onChange={(e) => setMessageInput(e.target.value)}
                          disabled={sendingMessage || uploadingFile || isDisputed}
                          className="w-full h-12 bg-[#222222] border-none px-4 pr-12 text-sm font-normal text-[#C7C7C7] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4DF2BE] disabled:opacity-50"
                          placeholder={isDisputed ? "Chat disabled during dispute" : uploadingFile ? "Uploading file..." : "Type a message"}
                        />
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <label htmlFor="file-upload" className={`cursor-pointer ${uploadingFile || isDisputed ? 'opacity-50' : ''}`}>
                            <svg className="w-5 h-5 text-[#8F8F8F] hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                            </svg>
                          </label>
                        </div>
                      </div>
                      
                      <button 
                        type="submit"
                        disabled={sendingMessage || uploadingFile || (!messageInput.trim() && !selectedFile) || isDisputed}
                        className="w-12 h-12 bg-[#4DF2BE] flex items-center justify-center rounded-lg hover:bg-[#3DD2A5] transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-12"
                      >
                        {sendingMessage || uploadingFile ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#0F1012]"></div>
                        ) : (
                          <svg className="w-5 h-5 text-[#0F1012]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                          </svg>
                        )}
                      </button>
                    </form>
                    
                    {/* Show selected file preview */}
                    {selectedFile && !uploadingFile && (
                      <div className="mt-3 p-3 bg-[#2D2D2D] rounded-lg flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#3A3A3A] rounded-lg flex items-center justify-center">
                            <span className="text-xs text-white">
                              {getFileIcon(selectedFile.type)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm text-white truncate max-w-[200px]">
                              {selectedFile.name}
                            </p>
                            <p className="text-xs text-[#8F8F8F]">
                              {(selectedFile.size / 1024).toFixed(1)} KB
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedFile(null)}
                          className="text-red-400 hover:text-red-300"
                          disabled={sendingMessage || uploadingFile}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
         <div className="w-[100%] h-[1px] bg-[#fff]  mt-[50%] opacity-20 my-8"></div>
        
                        <div className="mb-[80px] whitespace-nowrap mt-[20%]">
                            <Footer />
                        </div>

          {/* Release Modal - SIMPLIFIED */}
          {showReleaseModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
              <div className="bg-[#0F1012] rounded-xl w-full max-w-md">
                <div className="p-6">
                  <h3 className="text-lg font-bold text-white mb-2">
                    Confirm Payment Received and Release Crypto?
                  </h3>
                  <p className="text-sm text-[#C7C7C7] mb-4">
                    This action will release {quantity.toFixed(5)} {cryptoType} from escrow to the buyer.
                    Only proceed if you have confirmed payment in your bank account.
                  </p>
                  
                  <div className="mb-6 p-4 bg-[#352E21] rounded-lg">
                    <p className="text-sm font-medium text-[#FFC051]">
                      ⚠️ Warning: Only release after confirming payment in your bank account. Do not release based solely on buyer's claim.
                    </p>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#DBDBDB]">Amount Received:</span>
                      <span className="text-base font-medium text-white">{fiatAmount.toFixed(2)} {fiatCurrency}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#DBDBDB]">Payment Method:</span>
                      <span className="text-sm font-medium text-white">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-[#DBDBDB]">Buyer:</span>
                      <span className="text-sm font-medium text-white">@{buyerUsername}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#DBDBDB]">You will release:</span>
                      <span className="text-base font-medium text-[#4DF2BE]">{quantity.toFixed(5)} {cryptoType}</span>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowReleaseModal(false)}
                      className="flex-1 h-12 bg-[#2D2D2D] text-white font-medium rounded-full hover:bg-[#3A3A3A] transition-colors"
                      disabled={isReleasing}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleReleaseTrade}
                      disabled={isReleasing}
                      className="flex-1 h-12 bg-[#4DF2BE] text-[#0F1012] font-bold rounded-full hover:bg-[#3DD2A5] transition-colors flex items-center justify-center gap-2"
                    >
                      {isReleasing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0F1012]"></div>
                          Releasing...
                        </>
                      ) : (
                        "Yes, Release Crypto"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DISPUTE MODAL - Responsive */}
          {showDisputeModal && (
            <div className="fixed inset-0 z-[60] flex items-start md:items-center justify-center bg-black/80 p-4 overflow-y-auto">
              <div className="bg-[#0F1012] rounded-xl w-full max-w-md border border-[#3A3A3A] my-auto md:my-0">
                <div className="p-4 sm:p-6">
                  {/* Modal Header */}
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg sm:text-xl font-bold text-white">Open a Dispute</h3>
                    <button 
                      onClick={() => !submittingDispute && setShowDisputeModal(false)}
                      className="text-[#8F8F8F] hover:text-white text-lg sm:text-xl"
                      disabled={submittingDispute}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Help Text */}
                  <div className="mb-4 text-xs sm:text-sm text-[#C7C7C7]">
                    <p className="mb-2">Disputes help protect you when something goes wrong during a trade.</p>
                    <p>Please provide clear details and supporting documents.</p>
                  </div>

                  {/* Reason Dropdown */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-2">
                      Reason for dispute *
                    </label>
                    <select
                      value={disputeReason}
                      onChange={(e) => {
                        setDisputeReason(e.target.value);
                        if (e.target.value !== "other") setOtherReason("");
                      }}
                      disabled={submittingDispute}
                      className="w-full h-10 bg-[#222] border border-[#444] rounded px-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DF2BE]"
                    >
                      <option value="">Select reason</option>
                      <option value="payment not received">Payment not received</option>
                      <option value="paid wrong amount">Paid wrong amount</option>
                      <option value="received wrong payment details">Wrong payment details</option>
                      <option value="transaction limit">Transaction limit</option>
                      <option value="other">Other</option>
                    </select>
                    
                    {disputeReason === "other" && (
                      <input
                        type="text"
                        value={otherReason}
                        onChange={(e) => setOtherReason(e.target.value)}
                        placeholder="Specify reason..."
                        className="w-full h-10 bg-[#222] border border-[#444] rounded px-3 text-white text-sm mt-2 focus:outline-none focus:ring-2 focus:ring-[#4DF2BE]"
                        disabled={submittingDispute}
                      />
                    )}
                  </div>

                  {/* Description */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-2">
                      Explain the issue (optional)
                    </label>
                    <textarea
                      value={disputeDescription}
                      onChange={(e) => setDisputeDescription(e.target.value)}
                      placeholder="Describe what happened..."
                      rows={3}
                      className="w-full bg-[#222] border border-[#444] rounded p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#4DF2BE]"
                      disabled={submittingDispute}
                    />
                  </div>

                  {/* File Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-white mb-2">
                      Upload evidence (optional)
                    </label>
                    <div 
                      className={`border-2 border-dashed border-[#444] rounded p-4 text-center transition-colors ${
                        submittingDispute ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:border-[#4DF2BE]'
                      }`}
                      onClick={() => !submittingDispute && document.getElementById('dispute-file')?.click()}
                    >
                      <input
                        type="file"
                        id="dispute-file"
                        className="hidden"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleDisputeFileUpload}
                        disabled={submittingDispute}
                      />
                      <svg className="w-8 h-8 mx-auto mb-2 text-[#8F8F8F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                      </svg>
                      <p className="text-sm text-white">Click to upload</p>
                      <p className="text-xs text-[#8F8F8F] mt-1">Images, PDF, DOC up to 10MB</p>
                    </div>
                    
                    {disputeFile && (
                      <div className="mt-2 p-3 bg-[#222] rounded-lg flex justify-between items-center border border-[#3A3A3A]">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#3A3A3A] rounded-lg flex items-center justify-center">
                            {disputeFile.type.startsWith('image/') ? (
                              <span className="text-lg">🖼️</span>
                            ) : disputeFile.type.includes('pdf') ? (
                              <span className="text-lg">📄</span>
                            ) : (
                              <span className="text-lg">📎</span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{disputeFile.name}</p>
                            <p className="text-xs text-[#8F8F8F]">
                              {(disputeFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                        <button 
                          onClick={() => !submittingDispute && setDisputeFile(null)}
                          className="text-red-400 hover:text-red-300 text-lg"
                          disabled={submittingDispute}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Warning Message */}
                  <div className="mb-6 p-3 bg-[#352E21] rounded-lg border-l-2 border-l-[#FFC051]">
                    <div className="flex items-start gap-2">
                      <svg className="w-5 h-5 text-[#FFC051] mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                      </svg>
                      <p className="text-sm text-[#FFC051]">
                        Once submitted, this trade will be paused and reviewed by Evolve2p's support team.
                        Resolution may take up to 24 hours.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons - Responsive */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => !submittingDispute && setShowDisputeModal(false)}
                      className="h-10 sm:h-12 px-4 bg-[#2D2D2D] text-white rounded-full hover:bg-[#3A3A3A] transition-colors font-medium text-sm sm:text-base"
                      disabled={submittingDispute}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitDispute}
                      disabled={submittingDispute || !disputeReason || (disputeReason === "other" && !otherReason)}
                      className={`h-10 sm:h-12 px-4 rounded-full font-bold text-sm sm:text-base transition-all ${
                        submittingDispute || !disputeReason || (disputeReason === "other" && !otherReason)
                          ? 'bg-[#3A3A3A] text-[#8F8F8F] cursor-not-allowed'
                          : 'bg-[#FFC051] text-[#0F1012] hover:opacity-90'
                      }`}
                    >
                      {submittingDispute ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0F1012]"></div>
                          <span>Submitting...</span>
                        </div>
                      ) : (
                        'Submit Dispute'
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DISPUTE SUCCESS MODAL - Responsive */}
          {showDisputeSuccessModal && (
            <div className="fixed inset-0 z-[70] flex items-start md:items-center justify-center bg-black/80 p-4 overflow-y-auto">
              <div className="bg-[#0F1012] rounded-xl w-full max-w-md border border-[#1ECB84] my-auto md:my-0">
                <div className="p-4 sm:p-6">
                  {/* Success Icon */}
                  <div className="flex justify-center mb-6">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#1B362B] rounded-full flex items-center justify-center border-4 border-[#1ECB84]">
                      <svg className="w-8 h-8 sm:w-10 sm:h-10 text-[#1ECB84]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>

                  {/* Success Message */}
                  <div className="text-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3">Dispute Submitted!</h3>
                    <div className="space-y-3 text-sm text-[#C7C7C7]">
                      <p>We've received your dispute.</p>
                      <p>Our support team will review your case shortly.</p>
                      <p>You can monitor updates from your trade chat.</p>
                    </div>
                  </div>

                  {/* Trade Info Box */}
                  <div className="mb-6 p-4 bg-[#1B362B] rounded-lg border border-[#1ECB84]">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#8F8F8F]">Trade ID:</span>
                      <span className="text-sm font-medium text-white">{orderId}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-[#8F8F8F]">Status:</span>
                      <span className="text-sm font-medium text-[#1ECB84]">DISPUTED</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#8F8F8F]">Buyer:</span>
                      <span className="text-sm font-medium text-white">@{buyerUsername}</span>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="mb-6 p-3 bg-[#352E21] rounded-lg border-l-2 border-l-[#FFC051]">
                    <p className="text-xs text-[#FFC051] text-center">
                      ⚠️ Please keep an eye on your chat for updates from our support team.
                    </p>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleBackToTradeChat}
                    className="w-full h-12 bg-[#4DF2BE] text-[#0F1012] font-bold rounded-full hover:bg-[#3DD2A5] transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <span>Back to Trade Chat</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  };

  // Always return the component structure
  return renderContent();
};

export default PRC_Sell;

