"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "@/config";

const Resetpbd = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // 1. Check if email exists (success means user exists)
      const checkRes = await fetch(
        `${API_BASE_URL}/api/check-email-exist`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!checkRes.ok) {
        const checkData = await checkRes.json();
        throw new Error(
          checkData.detail || checkData.message || "Email does not exist."
        );
      }

      // 2. Send OTP to email
      const otpRes = await fetch(
        `${API_BASE_URL}/api/send-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      if (!otpRes.ok) {
        const otpData = await otpRes.json();
        throw new Error(
          otpData.detail || otpData.message || "Failed to send OTP."
        );
      }

      // 3. Redirect to verification page
      localStorage.setItem("reset_email", email);
      router.push("/Logins/Lverify");
    } catch (err: any) {
      setError(err.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm w-full text-center  flex flex-col justify-center items-center">
      <div>
        <h1 className="text-[24px] font-[700] text-[#FCFCFC]">
          Reset Your Password
        </h1>
        <p className="text-[16px] font-[400]  text-[#8F8F8F] mt-1 ml-2' whitespace-wrap">
          Enter your registered email, and we'll send you a reset code.
        </p>
      </div>

      <form onSubmit={handleReset} className="space-y-4 w-full px-2">
        <div>
          <label
            htmlFor="email"
            className="block ml-[-88%] mt-[30px] text-[#8F8F8F] text-[14px] font-[500] mb-1"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-[100%] h-[56px] mt-[10px] pl-[10px]  px-4 py-2 rounded-[10px] bg-[#1F1F1F] border border-[#2E2E2E] text-[#FCFCFC] font-[500] text-[14px] focus:outline-none focus:ring-2 focus:ring-[#2DE3A3]"
            placeholder="Enter your email address"
            disabled={loading}
          />
        </div>

        {error && (
          <div className="text-[#F5918A] text-[14px] font-[500] mt-2">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={!email || loading}
          className={`w-[100%] h-[56px] py-2 mt-[60px] mb-4 border-none justify-center rounded-[100px] text-[14px] font-[700] transition ${
            email && !loading
              ? "bg-[#4DF2BE] text-[#0F1012] hover:opacity-90"
              : "bg-[#4DF2BE]/50 text-[#0F1012]/50 cursor-not-allowed"
          }`}
        >
          {loading ? "Processing..." : "Reset Password"}
        </button>
      </form>

      <p className="text-center  w-full text-[14px] font[400] text-[#DBDBDB]">
        Remembered password?{" "}
        <Link
          href="/login"
          className="text-[#FCFCFC] no-underline ml-[20px] font-[700] hover:underline"
        >
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Resetpbd;
