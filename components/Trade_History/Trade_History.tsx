'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Nav from '../../components/NAV/Nav';
import Footer from '../../components/Footer/Footer';

import BTC from '../../public/Assets/Evolve2p_BTC/Bitcoin (BTC).svg';
import ETH from '../../public/Assets/Evolve2p_ETH/Ethereum (ETH).svg';
import USDC from '../../public/Assets/Evolve2p_USDC/USD Coin (USDC).svg';
import USDT from '../../public/Assets/Evolve2p_USDT/Tether (USDT).svg';
import G19 from '../../public/Assets/Evolve2p_group19/Group 19.svg';

interface Trade {
  id?: string;
  tradeId?: string;
  _id?: string;
  type?: 'buy' | 'sell';
  sellerId?: string;
  seller?: any;
  buyerId?: string;
  buyer?: any;
  amountCrypto?: number;
  amountFiat?: number;
  price?: number;
  cryptoAmount?: number;
  fiatAmount?: number;
  currency?: string;
  cryptoCurrency?: string;
  fiatCurrency?: string;
  status: string;
  paymentMethod?: any; // can be string or object
  counterpart?: string;
  offerId?: string;
  createdAt: string;
  updatedAt?: string;
  completedAt?: string;
  paidAt?: string;
  expiresAt?: string;
  tradePrice?: number;
  offer?: any;
  [key: string]: any;
}

interface UserData {
  userData?: {
    id?: string;
    email?: string;
    phone?: string;
    username?: string;
    country?: string;
    name?: string;
    kycVerified?: boolean;
    emailVerified?: boolean;
    preferedCurrency?: string;
    DOB?: string;
    is2faEnabled?: boolean;
    authType?: string | null;
    pushToken?: string;
    role?: string;
    createdAt?: string;
    status?: string;
    wallets?: any[];
    transactions?: any[];
    swaps?: any[];
    trades?: Trade[];
    tradesAsSeller?: Trade[];
    tradesAsBuyer?: Trade[];
    notifications?: any[];
    trustedBy?: any[];
    [key: string]: any;
  };
  accessToken?: string;
  email?: string;
  username?: string;
  phone?: string;
  verified?: boolean;
  country?: {
    name: string;
    code: string;
    dial_code: string;
  };
  dayOfBirth?: string;
  [key: string]: any;
}

// Icon mapping
const cryptoIcons: Record<string, any> = { BTC, ETH, USDC, USDT };

const getTradeIcon = (cryptoCurrency: string = ''): any => {
  if (!cryptoCurrency) return null;
  return cryptoIcons[cryptoCurrency.toUpperCase()] || null;
};

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown Date';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'Unknown Date';
  }
};

const formatCurrency = (amount: number | undefined, currency: string): string => {
  if (amount === undefined || amount === null) return 'Unknown';
  if (currency === 'BTC' || currency === 'ETH') return `${amount.toFixed(6)} ${currency}`;
  if (currency === 'USDT' || currency === 'USDC') return `${amount.toFixed(2)} ${currency}`;
  if (currency === 'USD') return `$${amount.toFixed(2)}`;
  if (currency === 'NGN') return `₦${amount.toFixed(2)}`;
  if (currency === 'EUR') return `€${amount.toFixed(2)}`;
  if (currency === 'GBP') return `£${amount.toFixed(2)}`;
  return `${amount.toFixed(2)} ${currency}`;
};

const getStatusDisplay = (status: string) => {
  const upper = status?.toUpperCase() || '';
  if (upper.includes('COMPLETE') || upper === 'COMPLETED') {
    return { text: 'Completed', bgColor: 'bg-[#4DF2BE33]', textColor: 'text-[#4DF2BE]' };
  }
  if (upper.includes('PAID')) {
    return { text: 'Paid', bgColor: 'bg-[#10B98133]', textColor: 'text-[#10B981]' };
  }
  if (upper.includes('PENDING')) {
    return { text: 'Pending', bgColor: 'bg-[#F59E0B33]', textColor: 'text-[#F59E0B]' };
  }
  if (upper.includes('PROCESSING') || upper.includes('IN_PROGRESS')) {
    return { text: 'Processing', bgColor: 'bg-[#3B82F633]', textColor: 'text-[#3B82F6]' };
  }
  if (upper.includes('ESCROW') || upper.includes('IN_ESCROW')) {
    return { text: 'In Escrow', bgColor: 'bg-[#392D46]', textColor: 'text-[#CCA0FA]' };
  }
  if (upper.includes('DISPUTE') || upper === 'DISPUTED') {
    return { text: 'In Dispute', bgColor: 'bg-[#342827]', textColor: 'text-[#FE857D]' };
  }
  if (upper.includes('AWAITING') || upper.includes('RELEASE')) {
    return { text: 'Awaiting Release', bgColor: 'bg-[#10B98133]', textColor: 'text-[#10B981]' };
  }
  if (upper.includes('CANCEL') || upper === 'CANCELLED') {
    return { text: 'Canceled', bgColor: 'bg-[#EF444433]', textColor: 'text-[#EF4444]' };
  }
  if (upper.includes('EXPIRED') || upper === 'EXPIRED') {
    return { text: 'Expired', bgColor: 'bg-[#6B728033]', textColor: 'text-[#D1D5DB]' };
  }
  return {
    text: status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown',
    bgColor: 'bg-[#6B728033]',
    textColor: 'text-[#D1D5DB]',
  };
};

const isTradeCompleted = (status: string): boolean => {
  const upper = status?.toUpperCase() || '';
  return (
    upper.includes('COMPLETE') ||
    upper === 'COMPLETED' ||
    upper === 'FINISHED' ||
    upper === 'DONE' ||
    upper === 'RELEASED' ||
    upper === 'SETTLED'
  );
};

const Trade_History: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | undefined>();

  const activeTrades = useMemo(
    () =>
      allTrades
        .filter(t => !isTradeCompleted(t.status))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [allTrades]
  );

  const completedTrades = useMemo(
    () =>
      allTrades
        .filter(t => isTradeCompleted(t.status))
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [allTrades]
  );

  // Load user data on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem('UserData');
      if (!raw) {
        setLoading(false);
        return;
      }
      const parsed: UserData = JSON.parse(raw);
      const user = parsed.userData || parsed;
      setUserId(user.id);
      // Combine trades from all possible sources
      const trades: Trade[] = [
        ...(user.tradesAsBuyer || []),
        ...(user.tradesAsSeller || []),
        ...(user.trades || []),
      ];
      setAllTrades(trades);
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  const handleViewTrade = useCallback(
    (trade: Trade) => {
      const tradeId = trade.id || trade.tradeId || trade._id;
      if (!tradeId) return;

      const isBuyer = trade.buyerId === userId || trade.buyer?.id === userId;
      const isSeller = trade.sellerId === userId || trade.seller?.id === userId;

      if (isBuyer) {
        router.push(`/prc_buy?tradeId=${tradeId}`);
      } else if (isSeller) {
        router.push(`/prc_sell?tradeId=${tradeId}`);
      } else {
        // Fallback: infer from arrays
        const isBuyerFromArrays = allTrades.some(
          t => (t.id === tradeId || t.tradeId === tradeId) && t.buyerId === userId
        );
        if (isBuyerFromArrays) {
          router.push(`/prc_buy?tradeId=${tradeId}`);
        } else {
          router.push(`/prc_sell?tradeId=${tradeId}`);
        }
      }
    },
    [userId, allTrades, router]
  );

  const getTradeType = useCallback(
    (trade: Trade): string => {
      if (!trade || !userId) return 'Trade';
      if (trade.buyerId === userId || trade.buyer?.id === userId) return 'Buy';
      if (trade.sellerId === userId || trade.seller?.id === userId) return 'Sell';
      return 'Trade';
    },
    [userId]
  );

  const getCryptoCurrency = useCallback((trade: Trade): string => {
    if (!trade) return 'BTC';
    if (trade.cryptoCurrency) return trade.cryptoCurrency;
    if (trade.offer?.crypto) return trade.offer.crypto;
    if (trade.currency && /BTC|ETH|USDT|USDC/i.test(trade.currency)) return trade.currency;
    return 'BTC';
  }, []);

  const getFiatCurrency = useCallback((trade: Trade): string => {
    if (!trade) return 'USD';
    if (trade.fiatCurrency) return trade.fiatCurrency;
    if (trade.offer?.currency) return trade.offer.currency;
    if (trade.currency && !/BTC|ETH|USDT|USDC/i.test(trade.currency)) return trade.currency;
    return 'USD';
  }, []);

  // FIXED: paymentMethod can be an object – extract a string safely
  const getPaymentMethod = useCallback((trade: Trade): string => {
    if (!trade) return 'Bank Transfer';
    const pm = trade.paymentMethod;
    if (pm) {
      if (typeof pm === 'string') return pm;
      if (pm.name) return pm.name;
      if (pm.type?.name) return pm.type.name;
      // fallback to a default if it's an object without name
      return 'Payment Method';
    }
    if (trade.offer?.paymentMethod) {
      const offerPm = trade.offer.paymentMethod;
      if (typeof offerPm === 'string') return offerPm;
      if (offerPm.name) return offerPm.name;
    }
    return 'Bank Transfer';
  }, []);

  const getCounterpartName = useCallback(
    (trade: Trade): string => {
      if (!trade || !userId) return 'Unknown User';
      const isBuyer = trade.buyerId === userId || trade.buyer?.id === userId;
      const isSeller = trade.sellerId === userId || trade.seller?.id === userId;

      if (isBuyer) {
        const seller = trade.seller;
        if (!seller) return trade.sellerId ? 'Seller' : 'Unknown Seller';
        if (typeof seller === 'string') return seller;
        return seller.username || seller.name || 'Seller';
      }
      if (isSeller) {
        const buyer = trade.buyer;
        if (!buyer) return trade.buyerId ? 'Buyer' : 'Unknown Buyer';
        if (typeof buyer === 'string') return buyer;
        return buyer.username || buyer.name || 'Buyer';
      }
      return 'Unknown User';
    },
    [userId]
  );

  const getYouPay = useCallback(
    (trade: Trade): string => {
      if (!trade || !userId) return 'Unknown';
      const isBuyer = trade.buyerId === userId || trade.buyer?.id === userId;
      if (isBuyer) {
        const amount = trade.amountFiat || trade.fiatAmount || trade.price || 0;
        return formatCurrency(amount, getFiatCurrency(trade));
      } else {
        const amount = trade.amountCrypto || trade.cryptoAmount || trade.amount || 0;
        return formatCurrency(amount, getCryptoCurrency(trade));
      }
    },
    [userId, getFiatCurrency, getCryptoCurrency]
  );

  const getYouReceive = useCallback(
    (trade: Trade): string => {
      if (!trade || !userId) return 'Unknown';
      const isBuyer = trade.buyerId === userId || trade.buyer?.id === userId;
      if (isBuyer) {
        const amount = trade.amountCrypto || trade.cryptoAmount || trade.amount || 0;
        return formatCurrency(amount, getCryptoCurrency(trade));
      } else {
        const amount = trade.amountFiat || trade.fiatAmount || trade.price || 0;
        return formatCurrency(amount, getFiatCurrency(trade));
      }
    },
    [userId, getFiatCurrency, getCryptoCurrency]
  );

  const renderTradeRow = useCallback(
    (trade: Trade, index: number) => {
      const status = getStatusDisplay(trade.status || 'pending');
      const tradeType = getTradeType(trade);
      const crypto = getCryptoCurrency(trade);
      const displayType = `${tradeType} ${crypto}`;
      const counterpart = getCounterpartName(trade);
      const youPay = getYouPay(trade);
      const youReceive = getYouReceive(trade);
      const payment = getPaymentMethod(trade);
      const date = trade.createdAt ? formatDate(trade.createdAt) : 'Unknown';
      const icon = getTradeIcon(crypto);

      return (
        <tr
          key={trade.id || trade.tradeId || trade._id || index}
          className="w-auto h-[64px] border-[#2D2D2D] text-[16px] font-[500] text-[#DBDBDB] hover:bg-[#242424] transition"
        >
          <td className="py-[20px] pl-[15px] flex items-center gap-[10px]">
            {icon && <Image src={icon} alt={crypto} width={20} height={20} />}
            <span>{displayType}</span>
          </td>
          <td className="py-[12px] text-[#A3A3A3]">{payment}</td>
          <td className="py-[12px]">{youPay}</td>
          <td className="py-[12px]">{youReceive}</td>
          <td className="py-[12px] text-[#4DF2BE]">{counterpart}</td>
          <td className="py-[12px] text-[#C7C7C7]">{date}</td>
          <td>
            <span
              className={`px-3 py-[2px_8px] rounded-full text-[12px] ${status.bgColor} ${status.textColor}`}
            >
              {status.text}
            </span>
          </td>
          <td>
            <button
              onClick={() => handleViewTrade(trade)}
              className="bg-[#2D2D2D] w-[61px] h-[36px] border-none text-[#FFFFFF] px-4 py-1 rounded-full text-[13px] hover:opacity-80 transition"
            >
              View
            </button>
          </td>
        </tr>
      );
    },
    [getTradeType, getCryptoCurrency, getCounterpartName, getYouPay, getYouReceive, getPaymentMethod, handleViewTrade]
  );

  const renderMobileTradeCard = useCallback(
    (trade: Trade, index: number) => {
      const status = getStatusDisplay(trade.status || 'pending');
      const tradeType = getTradeType(trade);
      const crypto = getCryptoCurrency(trade);
      const displayType = `${tradeType} ${crypto}`;
      const counterpart = getCounterpartName(trade);
      const youPay = getYouPay(trade);
      const youReceive = getYouReceive(trade);
      const payment = getPaymentMethod(trade);
      const date = trade.createdAt ? formatDate(trade.createdAt) : 'Unknown';
      const icon = getTradeIcon(crypto);

      return (
        <div key={trade.id || trade.tradeId || trade._id || index} className="bg-[#1A1A1A] rounded-[12px] p-4 mb-4 border border-[#2D2D2D]">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-3">
              {icon && <Image src={icon} alt={crypto} width={24} height={24} />}
              <div>
                <h3 className="text-[16px] font-[500] text-white">{displayType}</h3>
                <p className="text-[12px] text-[#A3A3A3]">{date}</p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-[12px] ${status.bgColor} ${status.textColor}`}>
              {status.text}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <p className="text-[12px] text-[#A3A3A3] mb-1">You Pay</p>
              <p className="text-[14px] font-[500] text-white">{youPay}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#A3A3A3] mb-1">You Receive</p>
              <p className="text-[14px] font-[500] text-white">{youReceive}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#A3A3A3] mb-1">Payment Method</p>
              <p className="text-[14px] font-[500] text-white">{payment}</p>
            </div>
            <div>
              <p className="text-[12px] text-[#A3A3A3] mb-1">Counterparty</p>
              <p className="text-[14px] font-[500] text-[#4DF2BE]">{counterpart}</p>
            </div>
          </div>

          <button
            onClick={() => handleViewTrade(trade)}
            className="w-full bg-[#2D2D2D] h-[36px] border-none text-[#FFFFFF] px-4 py-1 rounded-full text-[13px] hover:opacity-80 transition"
          >
            View Trade Details
          </button>
        </div>
      );
    },
    [getTradeType, getCryptoCurrency, getCounterpartName, getYouPay, getYouReceive, getPaymentMethod, handleViewTrade]
  );

  const EmptyState = ({ message, subMessage }: { message: string; subMessage: string }) => (
    <div className="flex flex-col items-center justify-center w-auto h-[400px] bg-[#1A1A1A] rounded-[12px] p-6">
      <Image src={G19} alt="no trades" width={120} height={120} className="w-20 h-20 md:w-24 md:h-24" />
      <p className="text-[16px] md:text-[18px] text-[#C7C7C7] mt-4 text-center">{message}</p>
      <p className="text-[14px] text-gray-500 mt-2 text-center max-w-md">{subMessage}</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#0F1012] text-white px-4 sm:px-6 md:px-8 lg:p-[20px] xl:p-[40px]">
      <Nav />

      <div className="max-w-7xl mx-auto mt-6 md:mt-[40px]">
        {/* Tabs */}
        <div className="flex bg-[#2D2D2D] rounded-[56px] w-full max-w-[330px] h-[48px] p-1 items-center justify-between mb-6 md:mb-[30px] mx-auto">
          <div
            onClick={() => setActiveTab('active')}
            className={`flex items-center justify-center gap-2 rounded-[56px] text-[14px] md:text-[16px] transition w-[150px] h-[40px] cursor-pointer ${
              activeTab === 'active'
                ? 'bg-[#4A4A4A] text-[#FCFCFC] font-[500]'
                : 'bg-transparent text-[#DBDBDB] font-[400]'
            }`}
          >
            Active
            <span
              className={`w-[26px] h-[24px] ml-[10px] flex items-center justify-center rounded-full text-[13px] font-[600] ${
                activeTab === 'active'
                  ? 'bg-[#4DF2BE] text-[#1A1A1A]'
                  : 'bg-[#5C5C5C] text-[#C7C7C7]'
              }`}
            >
              {activeTrades.length}
            </span>
          </div>

          <div
            onClick={() => setActiveTab('completed')}
            className={`flex items-center justify-center gap-2 rounded-[56px] text-[14px] md:text-[16px] transition w-[150px] h-[40px] cursor-pointer ${
              activeTab === 'completed'
                ? 'bg-[#4A4A4A] text-[#FCFCFC] font-[500]'
                : 'bg-transparent text-[#DBDBDB] font-[400]'
            }`}
          >
            Completed
            <span
              className={`w-[26px] h-[24px] ml-[10px] flex items-center justify-center rounded-full text-[13px] font-[600] ${
                activeTab === 'completed'
                  ? 'bg-[#4DF2BE] text-[#1A1A1A]'
                  : 'bg-[#5C5C5C] text-[#C7C7C7]'
              }`}
            >
              {completedTrades.length}
            </span>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center w-auto h-[300px]">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4DF2BE] mb-4" />
              <p className="text-[#8F8F8F]">Loading trades...</p>
            </div>
          </div>
        ) : (
          <>
            {activeTab === 'active' && (
              <>
                {activeTrades.length === 0 ? (
                  <EmptyState
                    message="No Active Trades"
                    subMessage="You don't have any active trades at the moment."
                  />
                ) : (
                  <>
                    <div className="hidden md:block overflow-x-auto bg-[#1A1A1A] p-6 rounded-[12px] shadow-lg h-auto w-full">
                      <table className="min-w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[#C7C7C7] h-[35px] text-[14px] font-[500] border-b border-[#2D2D2D]">
                            <th className="pl-[10px]">Trade Type</th>
                            <th>Payment Method</th>
                            <th>You Pay</th>
                            <th>You Receive</th>
                            <th>Counterparty</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>{activeTrades.map(renderTradeRow)}</tbody>
                      </table>
                    </div>
                    <div className="md:hidden space-y-4">{activeTrades.map(renderMobileTradeCard)}</div>
                  </>
                )}
              </>
            )}

            {activeTab === 'completed' && (
              <>
                {completedTrades.length === 0 ? (
                  <EmptyState
                    message="No Completed Trades"
                    subMessage="You haven't completed any trades yet."
                  />
                ) : (
                  <>
                    <div className="hidden md:block overflow-x-auto bg-[#1A1A1A] p-6 rounded-[12px] shadow-lg h-auto w-full">
                      <table className="min-w-full text-left border-collapse">
                        <thead>
                          <tr className="text-[#C7C7C7] w-auto h-[35px] text-[14px] font-[500] border-b border-[#2D2D2D]">
                            <th className="pl-[10px]">Trade Type</th>
                            <th>Payment Method</th>
                            <th>You Pay</th>
                            <th>You Receive</th>
                            <th>Counterparty</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>{completedTrades.map(renderTradeRow)}</tbody>
                      </table>
                    </div>
                    <div className="md:hidden space-y-4">{completedTrades.map(renderMobileTradeCard)}</div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>

      <div className="w-full h-[1px] bg-[#fff] mt-[20%] md:mt-[30%] opacity-20 my-8" />
      <div className="mb-[80px] mt-[10%]">
        <Footer />
      </div>
    </main>
  );
};

export default Trade_History;