import React from 'react';
import Nav from '../../components/NAV/Nav';
import Settings from '../../components/Settings/Settings';
import PaymentMethods from '../../components/Paymeth/Paymeth';
import Footer from '../../components/Footer/Footer';

export default function PaymentMethodsPage() {
  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Nav />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Settings Sidebar */}
          <div className="lg:w-[300px]">
            <Settings />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#1A1A1A] rounded-xl p-4 lg:p-6">
            <PaymentMethods />
          </div>
        </div>

        {/* Divider and Footer */}
        <div className="w-full h-[1px] bg-[#fff] mt-[20%] opacity-20 my-8"></div>
        <div className="mb-[80px] whitespace-nowrap mt-[10%]">
          <Footer />
        </div>
      </div>
    </main>
  );
}