'use client';
import React,  {useState} from 'react';
import { useRouter } from 'next/navigation';

const SignupForm = () => {

    const router = useRouter();
    const [email, setEmail] = useState('');
   const [error, setError] = useState('');
   
    const handleContinue = () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address');
        return;
      }
  
      setError('');

        router.push('/Password');
    }

    return (
      <div className=" pl-[100px] pt-[30px]">
        <div className="flex flex-col  gap-2 max-w-md">
          <h1 className="text-[24px] font-[700]  text-[#FCFCFC]">Create account</h1>
          <p className="text-[16px] font-[400] mt-[-10px] text-[#8F8F8F]">Enter your email to start trading securely.</p>
         <label className="text-[14px] mt-[10px] font-[500] text-[#8F8F8F] ">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            className="p-3 rounded w-[80%] bg-[#222222] text-[14px] font-[500] pt-2 pr-2 pb-2 pl-[10px] h-[56px] rounded-[5px] text-[#FCFCFC] border-none focus:outline-none"
          />
          {error && <p className="text-[#FCFCFC] text-[14px] font-[500] mt-1">{error}</p>}
          <button className="p-3 w-[80%] mt-[8%] bg-[#4DF2BE] cursor-pointer text-[#0F1012] h-[56px] rounded-[100px]  border border-brand-green "  onClick={handleContinue}>
            Continue
          </button>
          <div className="flex flex-col items-center ml-[-20%] gap-4">
          <p className="text-14px  font-[400] text-[#DBDBDB] ">
            Already have an account? <a href="/login" className="text-[#FCFCFC] ml-[20px] text-[14px] font-[700] no-underline hover:underline">Log in</a>
          </p>
          <small className="text-[16px] leading-6 mt-[50px]  font-[400] text-[#8F8F8F]">
            By creating an account you are agreeing to <br /> our 
            <a href="/terms" className="text-[#DBDBDB] ml-[5px] no-underline hover:underline">Terms & Conditions</a> and
            <a href="/privacy" className="text-[#DBDBDB] ml-[5px] no-underline hover:underline">Privacy Policy</a>.
          </small>
          </div>
        </div>
      </div>
    );
  };
  
  export default SignupForm;