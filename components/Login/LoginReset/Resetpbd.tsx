'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      alert('Please enter your email.');
      return;
    }

    // Simulate sending reset email, then navigate
    console.log(`Reset link sent to: ${email}`);
    router.push('/Lverify'); // change this to your target route
  };

  return (
    <div className="max-w-sm w-full text-center ml-[-100px]">
      <div>
        <h1 className="text-[24px] font-[700] text-[#FCFCFC]">Reset Your Password</h1>
        <p className="text-[16px] font-[400] ml-[14%] text-[#8F8F8F] mt-1">
          Enter your registered email, and we’ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="block ml-[-180px] mt-[30px] text-[#8F8F8F] text-[14px] font-[500] mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[380px] h-[56px] mt-[10px] pl-[10px] ml-[15%] px-4 py-2 rounded-[10px] bg-[#1F1F1F] border border-[#2E2E2E] text-[#FCFCFC] font-[500] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2DE3A3]"
            placeholder="Enter your email address"
          />
        </div>

        <button
          type="submit"
          disabled={!email}
          className={`w-[380px] h-[56px] py-2 mt-[60px] ml-[15%] border-none justify-center rounded-[100px] text-[14px] font-[700] transition ${
            email ? 'bg-[#4DF2BE] text-[#0F1012] hover:opacity-90' : 'bg-[#4DF2BE]/50 text-[#0F1012]/50 cursor-not-allowed'
          }`}
        >
          Reset password
        </button>
      </form>

      <p className="text-center ml-[15%] text-[14px] font[400] text-[#DBDBDB]">
        Remembered password?{' '}
        <Link
          href="/login"
          className="text-[#FCFCFC] no-underline ml-[20px] font-[700] hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
}
