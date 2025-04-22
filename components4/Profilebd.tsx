'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import nigeriaFlag from '../public/Assets/Evolve2p_flag/flags.png';
import arrow_down from '../public/Assets/Evolve2p_arrowd/arrow-down-01.png';

const Profilebd = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [phone, setPhone] = useState('');
  const [usernameStatus, setUsernameStatus] = useState('');
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateUsername = (name) => {
    if (name.trim() === '') {
      setUsernameStatus('');
      setIsValidUsername(false);
      return;
    }

    setUsernameStatus('checking');
    
    setTimeout(() => {
      const isValid = name.length >= 4 && 
                     !['admin', 'user', 'test', 'davidO1'].includes(name.toLowerCase());
      
      if (isValid) {
        setUsernameStatus('valid');
        setIsValidUsername(true);
      } else {
        setUsernameStatus('invalid');
        setIsValidUsername(false);
      }
    }, 800);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      validateUsername(username);
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const allFieldsValid = () => {
    return isValidUsername && phone.trim() !== '' && country.trim() !== '';
  };

  const handleContinue = async () => {
    if (!allFieldsValid()) return;
    
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      router.push('/Secpin');
    } catch (error) {
      console.error('Error during submission:', error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-8 py-16 ml-[100px] gap-2 w-full max-w-[400px] text-white">
      <h1 className="text-[24px] text-[#FCFCFC] font-[700]">Complete Your Profile</h1>
      <p className="text-[16px] font-[400] mt-[-5px] text-[#8F8F8F] mb-6">This helps personalize your experience.</p>

      {/* Username Input */}
      <div className="mt-[20px]">
        <label className="text-[14px] mt-2 font-[500] text-[#8F8F8F]">Username</label>
        <div className={`relative w-[370px] rounded-t-[10px] ${
          usernameStatus === 'invalid' ? 'border border-[#F5918A]' : 'border border-[#2E2E2E]'
        }`}>
          <span className='text-[#DBDBDB] absolute ml-[10px] mt-[18px]'>@</span>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className={`w-[343] h-[56px] text-[#FCFCFC] rounded-t-[10px] px-4 py-3 bg-[#222222] border-none pl-[25px] focus:outline-none ${
              usernameStatus === 'invalid' ? 'border-[#F5918A]' : ''
            }`}
            required
          />
        </div>
        <div className={`w-[350px] h-[30px] pl-[20px] flex items-center px-4 bg-[#222222] rounded-b-[10px] ${
          usernameStatus === 'invalid' ? 'border border-[#F5918A] border-t-0' : 'border border-[#2E2E2E] border-t-0'
        }`}>
          {usernameStatus === 'checking' && (
            <span className="text-[12px] font-[400] text-[#8F8F8F]">Checking username...</span>
          )}
          {usernameStatus === 'valid' && (
            <span className="text-[12px] font-[400] text-[#1ECB84]">Username available</span>
          )}
          {usernameStatus === 'invalid' && (
            <span className="text-[12px] font-[400] text-[#F5918A]">Username not available</span>
          )}
          {usernameStatus === '' && username.trim() === '' && (
            <span className="text-[12px] font-[400] text-[#8F8F8F]">Enter a username</span>
          )}
        </div>
      </div>

      {/* Country Dropdown */}
      <div className="mt-[20px]">
        <label className="text-[14px] font-[500] text-[#8F8F8F] mb-2 block">Country</label>
        <div className="relative w-[350px]">
          <div className="absolute left-4 top-1/2 mt-[5px] ml-[10px] -translate-y-1/2 flex items-center pointer-events-none">
            <Image 
              src={nigeriaFlag}
              alt="Nigeria flag"
              width={20}
              height={20}
              className="rounded-sm"
            />
          </div>
          <select
            className="w-[370px] h-[56px] bg-[#222222] mt-[10px] pl-[35px] pr-12 border border-[#2E2E2E] rounded-[10px] text-[14px] font-[500] text-[#FCFCFC] appearance-none"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          >
            <option value="">Select Country</option>
            <option value="Nigeria">Nigeria</option>
            <option value="Ghana">Ghana</option>
            <option value="Kenya">Kenya</option>
          </select>
          <div className="absolute text-[#DBDBDB] right-[-20px] top-[40px] -translate-y-1/2 pointer-events-none">
            <Image 
              src={arrow_down}
              alt="Select arrow"
              width={20}
              height={20}
            />
          </div>
        </div>
      </div>

      {/* Phone Number Input */}
      <label className="text-[14px] mt-[30px] font-[500] text-[#8F8F8F] mb-2">Phone number</label>
      <div className={`flex items-center pl-[10px] w-[360px] mt-[10px] bg-[#222222] border rounded-[10px] ${
        phone.trim() === '' ? 'border-[#F5918A]' : 'border-[#2E2E2E]'
      }`}>
        <span className="text-[#DBDBDB] w-[51px] h-[24px] pt-[5px] text-center text-[14px] font-[500] bg-[#3A3A3A] px-4 py-4 rounded-[100px]">
          +234
        </span>
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="flex-1 h-[56px] bg-transparent border-none outline-none text-[#FCFCFC] pl-4"
          placeholder="Phone number"
          required
        />
      </div>

      {/* Continue Button with Spinner */}
      <button 
        onClick={handleContinue}
        className={`w-[370px] h-[48px] border-[#4DF2BE] bg-[#2DE3A3] text-[#0F1012] text-[14px] font-[700] mt-[40px] py-3 rounded-full font-medium hover:opacity-90 transition ${
          !allFieldsValid() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!allFieldsValid() || isLoading}
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="loader"></div>
          </div>
        ) : 'Continue'}
        
        <style jsx>{`
          .loader {
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #0F1012;
            animation: spin 1s ease-in-out infinite;
          }
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </button>
    </div>
  );
};

export default Profilebd;