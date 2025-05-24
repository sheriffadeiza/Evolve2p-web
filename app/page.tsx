
import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1012] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to Evolve2p</h1>
        <p className="text-xl mb-8">Your secure trading platform</p>

        <div className="flex gap-4">
          <Link
            href="/Signups/Email"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Sign Up
          </Link>
          <Link
            href="/Logins/login"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
          {/* Alternative login link that will redirect */}
          {/*
          <Link
            href="/login"
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
          */}
        </div>
      </div>
    </div>
  );
}
