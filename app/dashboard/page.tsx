'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ email?: string } | null>(null);
  
  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      // Redirect to login if not authenticated
      router.push('/Logins/login');
      return;
    }
    
    try {
      setUser(JSON.parse(userData));
    } catch (e) {
      console.error('Error parsing user data:', e);
      router.push('/Logins/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1012] text-white">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1012] text-white">
      <header className="bg-[#1A1B1E] p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#4DF2BE]">Evolve2p Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-[#DBDBDB]">{user.email}</span>
            <button 
              onClick={handleLogout}
              className="bg-[#333] hover:bg-[#444] px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        <div className="bg-[#1A1B1E] rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4 text-[#4DF2BE]">Welcome to Your Dashboard</h2>
          <p className="text-[#DBDBDB] mb-4">
            You have successfully logged in to your account. This is a placeholder dashboard.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Dashboard Cards */}
          <div className="bg-[#1A1B1E] rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">Account Overview</h3>
            <p className="text-[#8F8F8F]">View your account details and settings</p>
          </div>
          
          <div className="bg-[#1A1B1E] rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">Transactions</h3>
            <p className="text-[#8F8F8F]">View your recent transactions</p>
          </div>
          
          <div className="bg-[#1A1B1E] rounded-lg p-6">
            <h3 className="text-lg font-bold mb-2">Security</h3>
            <p className="text-[#8F8F8F]">Manage your security settings</p>
          </div>
        </div>
      </main>

      <footer className="bg-[#1A1B1E] p-4 mt-auto">
        <div className="container mx-auto text-center text-[#8F8F8F]">
          <p>© 2023 Evolve2p. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
