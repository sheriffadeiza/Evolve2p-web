import React from 'react';
import Nav from '../../components/NAV/Nav';
import Footer from '../../components/Footer/Footer';
import My_offers from '@/components/My_offers/My_offers';

const Page = () => {
  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Nav />

        <div className="mt-6">
          <My_offers />
        </div>

        <div className="w-full h-[1px] bg-[#fff] mt-[20%] opacity-20 my-8"></div>
        <div className="mb-[80px] whitespace-nowrap mt-[10%]">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Page;