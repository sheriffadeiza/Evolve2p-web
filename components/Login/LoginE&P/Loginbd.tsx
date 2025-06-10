'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/context/LoginContext';
import Image from 'next/image';
import image from '../../../public/Assets/Evolve2p_viewslash/view-off-slash.png';

const LOGIN_ENDPOINT = 'https://evolve2p-backend.onrender.com/api/auth/login';

const Loginbd: React.FC = () => {
  const router = useRouter();
  const { setUser } = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('You must provide an email and a password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(LOGIN_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.detail || data.message || 'Invalid email or password. Please check your credentials and try again.');
        setLoading(false);
        return;
      }

      // Always use accessToken for consistency
      let token = data.accessToken || data.access_token || data.token;
      if (!token) {
        token = localStorage.getItem('accessToken');
      } else {
        localStorage.setItem('accessToken', token);
      }

      if (token) {
        // Remove password before storing user in context and localStorage
        const userWithPassword = { ...(data.user || {}), email };
        setUser(userWithPassword);
        localStorage.setItem('user', JSON.stringify(userWithPassword));
        localStorage.setItem('loginEmail', email);

        router.push('/Logins/Lsecpin');
      } else {
        setError('No authentication token received. Please contact support.');
      }
    } catch (err: any) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }
    localStorage.setItem('reset_email', email);
    router.push('/Logins/Resetp');
  };

  return (
    <div className="text-white max-w-md ml-[100px] w-full mx-auto">
      <h2 className="text-[24px] font-[700] text-[#FCFCFC]">Welcome Back!</h2>
      <p className="text-[16px] font-[400] mt-[-10px] text-[#8F8F8F]">
        Log in to continue trading securely.
      </p>

      {error && (
        <div className="p-4 mb-4 text-[#F5918A] bg-[#332222] rounded w-[90%] border border-[#553333]">
          <div className="flex items-start">
            <div>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        <label className="text-[14px] mt-[10px] font-[500] text-[#8F8F8F]">Email</label>
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="p-3 rounded mt-[10px] w-[60%] mb-[10px] bg-[#222222] pt-2 pr-2 pb-2 pl-[10px] h-[56px] text-[#FCFCFC] border-none focus:outline-none"
            required
          />
        </div>

        <label className="block text-[14px] font-[500] text-[#8F8F8F] mb-1">Password</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="p-3 rounded mt-[10px] w-[60%] mb-[20px] bg-[#222222] pt-2 pr-2 pb-2 pl-[10px] h-[56px] text-[#DBDBDB] border-none focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute border-0 right-2 ml-[-35px] top-[48%] bg-[#222222] -translate-y-1/2 text-[#DBDBDB]"
          >
            <Image src={image} alt="Toggle password visibility" width={20} height={20} />
          </button>
        </div>

        <div
          onClick={handleForgotPassword}
          className="ml-[43%] text-[14px] font-[700] text-[#FCFCFC] hover:underline cursor-pointer"
        >
          Forgot password
        </div>

        <button
          type="submit"
          disabled={loading}
          className="p-3 w-[60%] mt-[8%] bg-[#4DF2BE] text-[#0F1012] h-[56px] rounded-[100px] border border-brand-green disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <div className="flex flex-col items-center ml-[-35%] gap-4">
        <p className="text-14px font-[400] text-[#DBDBDB]">
          Don't have an account?{' '}
          <a href="/Signups/Email" className="text-[#FCFCFC] ml-[20px] text-[14px] font-[700] no-underline hover:underline">
            Create one
          </a>
        </p>
        <small className="text-[16px] leading-6 mt-[50px] font-[400] text-[#8F8F8F]">
          By creating an account you are agreeing to <br />
          our
          <a href="/terms" className="text-[#DBDBDB] ml-[5px] no-underline hover:underline">Terms & Conditions</a> and
          <a href="/privacy" className="text-[#DBDBDB] ml-[5px] no-underline hover:underline">Privacy Policy</a>.
        </small>
      </div>
    </div>
  );
};

export default Loginbd;