'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/context/LoginContext';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user } = useLogin();

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        // Check for token in localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

        if (!token) {
          console.log('No authentication token found, redirecting to login');
          setError('Please login first');
          setTimeout(() => router.push('/Logins/login'), 1500);
          return;
        }

        // Check for user data
        const userData = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
        if (!userData) {
          console.log('No user data found, redirecting to login');
          setError('User data not found. Please login again.');
          setTimeout(() => router.push('/Logins/login'), 1500);
          return;
        }

        console.log('User authenticated, loading dashboard');

        // Simulate loading user data
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      } catch (e) {
        console.error('Error accessing localStorage:', e);
        setError('Unable to access authentication data. Please try again.');
        setTimeout(() => router.push('/Logins/login'), 2000);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
      router.push('/Logins/login');
    } catch (e) {
      console.error('Error during logout:', e);
      setError('Error during logout. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1012] text-white">
        <div className="loader"></div>
        <p className="mt-4">Loading your dashboard...</p>
        <style jsx>{`
          .loader {
            width: 40px;
            height: 40px;
            border: 5px solid #333333;
            border-top-color: #4DF2BE;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F1012] text-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-[#F5918A]">Authentication Error</h1>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => router.push('/Logins/login')}
            className="bg-[#4DF2BE] text-[#0F1012] px-6 py-2 rounded-full"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012] text-white">
      {/* Header */}
      <header className="bg-[#1A1A1C] p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#4DF2BE]">Evolve2p Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user?.email || 'User'}</span>
          <button
            onClick={handleLogout}
            className="bg-[#333333] hover:bg-[#444444] px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-[#1A1A1C] rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Welcome to Your Dashboard</h2>
            <p className="text-[#8F8F8F] mb-4">
              This is a placeholder dashboard. In a real application, you would see your account information,
              trading options, and other features here.
            </p>
            <div className="bg-[#2A2A2C] p-4 rounded">
              <p className="text-sm text-[#4DF2BE]">
                You have successfully logged in with your security PIN and completed the authentication process.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#1A1A1C] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Account Summary</h3>
              <p className="text-[#8F8F8F]">Your account details would appear here.</p>
            </div>
            <div className="bg-[#1A1A1C] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-3">Recent Activity</h3>
              <p className="text-[#8F8F8F]">Your recent transactions would appear here.</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#1A1A1C] p-4 text-center text-[#8F8F8F]">
        <p>© 2023 Evolve2p. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Dashboard;
