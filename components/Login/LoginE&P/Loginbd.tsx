'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import image from '../../../public/Assets/Evolve2p_viewslash/view-off-slash.png';
import { extractErrorMessage } from '@/Utils/errorHandler';
import { API_ENDPOINTS, API_ENV } from '@/config/api';

const Loginbd: React.FC = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiInfo, setApiInfo] = useState({ baseUrl: '', isLocal: false });

  // Display API environment information on component mount
  useEffect(() => {
    setApiInfo({
      baseUrl: API_ENV.apiUrl,
      isLocal: API_ENV.isLocal
    });
    console.log('API Environment:', API_ENV);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('You must provide an email and a password');
      return;
    }

    setLoading(true);

    try {
      console.log(`Attempting login with API endpoint: ${API_ENDPOINTS.LOGIN}`);

      // Define responseData at a higher scope
      let responseData: any = null;

      try {
        const response = await fetch(API_ENDPOINTS.LOGIN, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        try {
          responseData = await response.json();
        } catch (jsonError) {
          // Handle non-JSON responses
          const textResponse = await response.text();
          responseData = {
            message: textResponse || 'Server returned an invalid response format'
          };
        }

        console.log('Login response status:', response.status);

        // Check if the response indicates email verification is required
        if (response.status === 403 && responseData.email_verified === false) {
          console.log('Email not verified, redirecting to verification page');

          // Store email for verification page
          localStorage.setItem('unverified_email', email);

          // Redirect to email verification page
          router.push('/Logins/verify-email');
          return;
        }

        if (!response.ok) {
          // Use our enhanced error handler to get a user-friendly message
          throw new Error(extractErrorMessage(responseData));
        }
      } catch (fetchError) {
        // Handle network errors
        if (fetchError instanceof TypeError && fetchError.message.includes('fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        throw fetchError;
      }
      const authToken = responseData.token || responseData.accessToken;
      if (authToken) {
        // Store user data including verification status
        const userData = {
          email,
          is_verified: responseData.user?.is_verified || true,
          username: responseData.user?.username || '',
          id: responseData.user?.id || ''
        };

        localStorage.setItem('token', authToken);
        localStorage.setItem('user', JSON.stringify(userData));

        // Redirect to security PIN page
        router.push('/Logins/Lsecpin');
      } else {
        throw new Error('No authentication token received');
      }
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email first');
      return;
    }

    setLoading(true);
    try {
      console.log(`Attempting password reset with API endpoint: ${API_ENDPOINTS.FORGOT_PASSWORD}`);

      const response = await fetch(API_ENDPOINTS.FORGOT_PASSWORD, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      alert('Password reset link sent');
      setError('');
    } catch (err: unknown) {
      setError(extractErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white max-w-md ml-[100px] w-full mx-auto">
      {/* API Environment Indicator - only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <div className={`text-xs mb-4 p-2 rounded ${apiInfo.isLocal ? 'bg-blue-900' : 'bg-green-900'}`}>
          <p>API: {apiInfo.baseUrl}</p>
          <p>Environment: {apiInfo.isLocal ? 'Local Development' : 'Production'}</p>
        </div>
      )}

      <h2 className="text-[24px] font-[700] text-[#FCFCFC]">Welcome Back!</h2>
      <p className="text-[16px] font-[400] mt-[-10px] text-[#8F8F8F]">
        Log in to continue trading securely.
      </p>

      {error && (
        <div className="p-4 mb-4 text-[#F5918A] bg-[#332222] rounded w-[90%] border border-[#553333]">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
            </svg>
            <div>
              <p className="font-medium">Login Error</p>
              <p className="text-sm mt-1">{error}</p>
              {error.includes('temporarily unavailable') && (
                <p className="text-xs mt-2 text-[#8F8F8F]">Our team has been notified and is working to resolve this issue.</p>
              )}
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
