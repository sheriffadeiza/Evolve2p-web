'use client';
import Nav from "../NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Image from "next/image"; 
import React, {useState, useEffect} from 'react'
import Footer from "../../components/Footer/Footer";

const TransLim: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"withdrawal" | "deposit">("withdrawal");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawalLimits, setWithdrawalLimits] = useState<any>(null);
  const [depositLimits, setDepositLimits] = useState<any>(null);

  const tabs = [
    { label: "Withdrawal", key: "withdrawal" },
    { label: "Deposit", key: "deposit" },
  ];

  useEffect(() => {
    const fetchLimits = async () => {
      setLoading(true);
      setError(null);
      try {
        const userData = localStorage.getItem("UserData");
        let token = "";
        
        if (userData) {
          try {
            const parsed = JSON.parse(userData);
            token = parsed?.token || parsed?.userData?.token || "";
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }

        const [withdrawalRes, depositRes] = await Promise.all([
          fetch("https://evolve2p-backend.onrender.com/api/admin/settings/withdrawalLimit", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { "Authorization": `Bearer ${token}` })
            },
          }),
          fetch("https://evolve2p-backend.onrender.com/api/admin/settings/depositLimit", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(token && { "Authorization": `Bearer ${token}` })
            },
          })
        ]);

        if (!withdrawalRes.ok || !depositRes.ok) {
          throw new Error("Failed to fetch limits");
        }

        const withdrawalData = await withdrawalRes.json();
        const depositData = await depositRes.json();

        setWithdrawalLimits(withdrawalData);
        setDepositLimits(depositData);
      } catch (err) {
        console.error("Error fetching limits:", err);
        setError("Failed to load transaction limits. Please try again.");
        
        // Fallback data for UI demonstration
        setWithdrawalLimits({
          dailyLimit: 148500,
          dailyRemaining: 1485000,
          monthlyLimit: 1485000,
          monthlyRemaining: 1485000,
          refreshTime: "10 minutes"
        });
        
        setDepositLimits({
          dailyLimit: 250000,
          dailyRemaining: 2000000,
          monthlyLimit: 3000000,
          monthlyRemaining: 3000000,
          refreshTime: "10 minutes"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchLimits();
  }, []);

  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return "$0";
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculatePercentage = (remaining: number, total: number) => {
    if (!total || total === 0) return 0;
    const used = total - remaining;
    return Math.min((used / total) * 100, 100);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#0F1012] text-white p-4 sm:p-6 md:pr-[10px] md:mt-[30px] md:pl-[30px] lg:p-8">
        <div className="max-w-7xl mx-auto">
          <Nav />
          <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6 mt-4 md:mt-[20px] md:mr-[40px]">
            <Settings />
            <div className="w-full lg:w-[809px] min-h-[865px] bg-[#1A1A1A] gap-4 md:gap-[20px] p-4 sm:p-6 md:p-[24px_64px] rounded-lg md:rounded-none flex items-center justify-center">
              <div className="text-center">
                <div className="loader mx-auto mb-4"></div>
                <p className="text-[#C7C7C7]">Loading transaction limits...</p>
              </div>
            </div>
          </div>
        </div>
        <style jsx>{`
          .loader {
            width: 40px;
            height: 40px;
            border: 3px solid rgba(77, 242, 190, 0.3);
            border-radius: 50%;
            border-top-color: #4DF2BE;
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#0F1012] text-white p-4 sm:p-6 md:pr-[10px] md:mt-[30px] md:pl-[30px] lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />
        
        {error && (
          <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3 mb-4">
            <p className="text-yellow-200 text-sm">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-2 text-[#4DF2BE] text-sm hover:underline"
            >
              Retry
            </button>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row items-start gap-4 md:gap-6 mt-4 md:mt-[20px] md:mr-[40px]">
          <Settings />

          {/* Right Section */}
          <div className="w-full lg:w-[809px] min-h-[865px] bg-[#1A1A1A] gap-4 md:gap-[20px] p-4 sm:p-6 md:p-[24px_64px] rounded-lg md:rounded-none">
            <p className="text-xl sm:text-2xl md:text-[24px] font-[700] text-[#FFFFFF]">Transaction Limits</p>

            {/* Tabs (Pill style) */}
            <div className="mt-4 md:mt-[20px] p-2 md:p-[10px_20px]">
              <div className="flex bg-[#2D2D2D] rounded-[56px] mt-4 w-full max-w-[296px] h-12 md:h-[48px] items-center justify-between">
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.key;
                  return (
                    <div
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as "withdrawal" | "deposit")}
                      className={`flex items-center justify-center rounded-[56px] text-sm md:text-[16px] transition-all no-underline cursor-pointer
                        ${
                          isActive
                            ? "bg-[#4A4A4A] text-[#FCFCFC] font-[500]"
                            : "bg-transparent text-[#DBDBDB] font-[400]"
                        } w-1/2 h-10 md:h-[40px]`}
                    >
                      {tab.label}
                    </div>
                  );
                })}
              </div> 

              {activeTab === "withdrawal" ? (
                <div className="mt-4 md:mt-[10px]">
                  <h3 className="text-lg sm:text-xl md:text-[20px] font-[700] text-[#FFFFFF] mt-6 md:mt-[40px]">Withdrawal Limits</h3>
                  <p className="text-sm md:text-[16px] font-[400] text-[#C7C7C7] mb-6">
                    Limits for sending money from balances to any recipient
                  </p>

                  {/* Daily Limit */}
                  <div className="w-full max-w-[641px] h-auto min-h-[82px] bg-[#222222] rounded-lg md:rounded-[8px] p-3 md:p-[12px] mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs sm:text-sm md:text-[14px] font-[500] text-[#FFFFFF]">
                        Daily Limit: <span>{formatCurrency(withdrawalLimits?.dailyLimit)}</span>
                      </p>
                      <button className="text-xs sm:text-sm text-[#4DF2BE] font-[500] hover:underline">
                        Request Increase
                      </button>
                    </div>

                    <div className="w-full h-2 bg-[#4A4A4A] rounded-[4px] overflow-hidden">
                      <div 
                        className="h-2 bg-[#4DF2BE] rounded-full transition-all duration-500"
                        style={{ 
                          width: `${calculatePercentage(
                            withdrawalLimits?.dailyRemaining || 1485000, 
                            withdrawalLimits?.dailyLimit || 148500
                          )}%` 
                        }}
                      ></div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mt-3 md:mt-[10px] text-xs md:text-[13px] text-[#B5B5B5] gap-2">
                      <span>{formatCurrency(withdrawalLimits?.dailyRemaining)} remaining</span>
                      <span>Refreshes in {withdrawalLimits?.refreshTime || "10 minutes"}</span>
                    </div>
                  </div>

                  {/* Monthly Limit */}
                  <div className="w-full max-w-[641px] h-auto min-h-[82px] mt-4 md:mt-[20px] bg-[#222222] rounded-lg md:rounded-[8px] p-3 md:p-[12px] mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs sm:text-sm md:text-[14px] font-[500] text-[#FFFFFF]">
                        Monthly Limit: <span>{formatCurrency(withdrawalLimits?.monthlyLimit)}</span>
                      </p>
                      <button className="text-xs sm:text-sm text-[#4DF2BE] font-[500] hover:underline">
                        Request Increase
                      </button>
                    </div>

                    <div className="w-full h-2 bg-[#4A4A4A] rounded-[4px] overflow-hidden">
                      <div 
                        className="h-2 bg-[#4DF2BE] rounded-full transition-all duration-500"
                        style={{ 
                          width: `${calculatePercentage(
                            withdrawalLimits?.monthlyRemaining || 1485000, 
                            withdrawalLimits?.monthlyLimit || 1485000
                          )}%` 
                        }}
                      ></div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mt-3 md:mt-[10px] text-xs md:text-[13px] text-[#B5B5B5] gap-2">
                      <span>{formatCurrency(withdrawalLimits?.monthlyRemaining)} remaining</span>
                      <span>Refreshes in {withdrawalLimits?.refreshTime || "10 minutes"}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 md:mt-[10px]">
                  <h3 className="text-lg sm:text-xl md:text-[20px] font-[700] text-[#FFFFFF] mt-6 md:mt-[40px]">Deposit Limits</h3>
                  <p className="text-sm md:text-[16px] font-[400] text-[#C7C7C7] mb-6">
                    Limits for making payments into balances
                  </p>

                  {/* Daily Limit */}
                  <div className="w-full max-w-[641px] h-auto min-h-[82px] bg-[#222222] rounded-lg md:rounded-[8px] p-3 md:p-[12px] mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs sm:text-sm md:text-[14px] font-[500] text-[#FFFFFF]">
                        Daily Limit: <span>{formatCurrency(depositLimits?.dailyLimit)}</span>
                      </p>
                      <button className="text-xs sm:text-sm text-[#4DF2BE] font-[500] hover:underline">
                        Request Increase
                      </button>
                    </div>
                  
                    <div className="w-full h-2 bg-[#4A4A4A] rounded-[4px] overflow-hidden">
                      <div 
                        className="h-2 bg-[#4DF2BE] rounded-full transition-all duration-500"
                        style={{ 
                          width: `${calculatePercentage(
                            depositLimits?.dailyRemaining || 2000000, 
                            depositLimits?.dailyLimit || 250000
                          )}%` 
                        }}
                      ></div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mt-3 md:mt-[10px] text-xs md:text-[13px] text-[#B5B5B5] gap-2">
                      <span>{formatCurrency(depositLimits?.dailyRemaining)} remaining</span>
                      <span>Refreshes in {depositLimits?.refreshTime || "10 minutes"}</span>
                    </div>
                  </div>

                  {/* Monthly Limit */}
                  <div className="w-full max-w-[641px] h-auto min-h-[82px] mt-4 md:mt-[20px] bg-[#222222] rounded-lg md:rounded-[8px] p-3 md:p-[12px] mb-4">
                    <div className="flex justify-between mb-2">
                      <p className="text-xs sm:text-sm md:text-[14px] font-[500] text-[#FFFFFF]">
                        Monthly Limit: <span>{formatCurrency(depositLimits?.monthlyLimit)}</span>
                      </p>
                      <button className="text-xs sm:text-sm text-[#4DF2BE] font-[500] hover:underline">
                        Request Increase
                      </button>
                    </div>
                    
                    <div className="w-full h-2 bg-[#4A4A4A] rounded-[4px] overflow-hidden">
                      <div 
                        className="h-2 bg-[#4DF2BE] rounded-full transition-all duration-500"
                        style={{ 
                          width: `${calculatePercentage(
                            depositLimits?.monthlyRemaining || 3000000, 
                            depositLimits?.monthlyLimit || 3000000
                          )}%` 
                        }}
                      ></div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between mt-3 md:mt-[10px] text-xs md:text-[13px] text-[#B5B5B5] gap-2">
                      <span>{formatCurrency(depositLimits?.monthlyRemaining)} remaining</span>
                      <span>Refreshes in {depositLimits?.refreshTime || "10 minutes"}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

         <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] mt-[10%] ">
                  <Footer />
                </div>
      </div>
    </main>
  )
}

export default TransLim