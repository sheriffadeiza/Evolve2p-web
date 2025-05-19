// pages/verify.tsx
import React from 'react';
import Head from 'next/head';

const Verify = () => {
  return (
    <>
      <Head>
        <title>Verify Identity | Evolve2p</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
        <div className="max-w-md w-full space-y-6 text-center">
          <h1 className="text-3xl font-semibold">Verify Your Identity</h1>
          <p className="text-sm text-gray-400">
            For security and compliance, we need to verify your identity before you can start trading.
          </p>

          <div className="bg-gray-800 p-4 rounded-md text-left">
            <p className="font-medium text-sm">Required for regulations</p>
            <p className="text-gray-400 text-sm">We are required to verify your identity.</p>
          </div>

          <div className="bg-gray-800 p-4 rounded-md text-left">
            <p className="font-medium text-sm">We value your privacy</p>
            <p className="text-gray-400 text-sm">
              This helps us protect your Evolve2p account. See <a href="#" className="text-green-400 underline">privacy policy</a>.
            </p>
          </div>

          <p className="text-green-400 text-sm">How does this works?</p>

          <button className="w-full py-3 bg-green-400 hover:bg-green-500 text-black rounded-md font-semibold transition">
            Verify with <span className="ml-1">🔷 persona</span>
          </button>
          <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-md font-semibold transition">
            Verify Later
          </button>
        </div>
      </div>
    </>
  );
};

export default Verify;
