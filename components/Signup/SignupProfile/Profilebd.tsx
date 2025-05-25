'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSignup } from '@/context/SignupContext';
import arrow_down from '../../../public/Assets/Evolve2p_arrowd/arrow-down-01.png';
import { API_ENDPOINTS } from '@/config/api';

const Profilebd = () => {
  const router = useRouter();
  const { updateSignupData, setCurrentStep } = useSignup();

  const [formData, setFormData] = useState({
    username: '',
    country: 'Nigeria',
    countryCode: 'NG',
    phone: ''
  });

  const [countries, setCountries] = useState([]);
  const [usernameStatus, setUsernameStatus] = useState('');
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        const data = await response.json();

        const formattedCountries = data.map((country) => ({
          name: country.name.common,
          code: country.cca2,
          dialCode: country.idd?.root
            ? `${country.idd.root}${country.idd.suffixes?.[0] || ''}`
            : '+1'
        })).sort((a, b) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);

        const nigeria = formattedCountries.find(c => c.code === 'NG');
        if (nigeria) {
          setFormData(prev => ({
            ...prev,
            country: nigeria.name,
            countryCode: nigeria.code
          }));
        }
      } catch (error) {
        console.error('Failed to fetch countries:', error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Debounce username check
  useEffect(() => {
    if (formData.username.trim() === '') {
      setUsernameStatus('');
      setIsValidUsername(false);
      return;
    }

    setUsernameStatus('checking');

    const handler = setTimeout(() => {
      const lower = formData.username.toLowerCase();
      const isValid =
        formData.username.length >= 4 &&
        !['admin', 'user', 'test'].includes(lower);

      if (isValid) {
        setUsernameStatus('valid');
        setIsValidUsername(true);
      } else {
        setUsernameStatus('invalid');
        setIsValidUsername(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [formData.username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, username: e.target.value }));
  };

  const allFieldsValid = () => {
    return isValidUsername && formData.phone.trim() !== '' && formData.country.trim() !== '';
  };

  const handleContinueToSecurityPin = () => {
    setShowSuccessModal(false);
    setCurrentStep('security-pin');
    router.push('/Signups/Secpin');
  };

  const handleSubmit = async () => {
    if (!allFieldsValid()) return;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const email = localStorage.getItem('userEmail') || '';
      const password = localStorage.getItem('userPassword') || '';

      if (!email || !password) {
        throw new Error('Session expired. Please start over.');
      }

      const selectedCountry = countries.find(c => c.code === formData.countryCode);
      const phoneNumber = selectedCountry ? `${selectedCountry.dialCode}${formData.phone}` : formData.phone;

      const userData = {
        email,
        username: formData.username,
        password,
        country: formData.country,
        phone: phoneNumber
      };

      // ✅ Backend API call to register the user
      const res = await fetch(API_ENDPOINTS.REGISTER, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error('Registration error response:', errorData);

        // Handle different error formats
        let errorMessage = 'Failed to register user';

        if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.email) {
          errorMessage = `Email: ${errorData.email}`;
        } else if (errorData.username) {
          errorMessage = `Username: ${errorData.username}`;
        } else if (errorData.password) {
          errorMessage = `Password: ${errorData.password}`;
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (Object.keys(errorData).length > 0) {
          // If there are field-specific errors, format them
          errorMessage = Object.entries(errorData)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
            .join('; ');
        }

        throw new Error(errorMessage);
      }

      updateSignupData(userData);
      localStorage.setItem('userProfile', JSON.stringify(userData));
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userPassword');

      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('Registration error:', error);
      setErrorMessage(error.message || 'Failed to complete registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col px-8 py-16 ml-[100px] gap-2 w-full max-w-[400px] text-white">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#222222] h-[30vh] p-6 rounded-[10px] w-[300px] text-center">
            <h3 className="text-[#4DF2BE] text-[18px] font-bold mb-2">Success!</h3>
            <p className="text-[#FCFCFC]">Registration completed successfully</p>
            <button
              onClick={handleContinueToSecurityPin}
              className="w-[250px] mt-[40px] border-none bg-[#4DF2BE] text-[#000] py-2 rounded-[100px] font-bold hover:bg-[#3dd9ab] transition"
            >
              Continue to Security Pin
            </button>
          </div>
        </div>
      )}

      <h1 className="text-[24px] text-[#FCFCFC] font-[700]">Complete Your Profile</h1>
      <p className="text-[16px] font-[400] mt-[-5px] text-[#8F8F8F] mb-6">This helps personalize your experience.</p>

      {errorMessage && (
        <div className="w-[370px] p-3 mb-4 text-[#F5918A] text-sm">
          {errorMessage}
        </div>
      )}

      {/* Username Input */}
      <div className="mt-[20px]">
        <label className="text-[14px] mt-2 font-[500] text-[#8F8F8F]">Username</label>
        <div className={`relative w-[388px] rounded-t-[10px] ${usernameStatus === 'invalid' ? 'border border-[#F5918A]' : 'border border-[#2E2E2E]'}`}>
          <span className='text-[#DBDBDB] absolute ml-[10px] mt-[18px]'>@</span>
          <input
            type="text"
            value={formData.username}
            onChange={handleUsernameChange}
            className="w-[360px] h-[56px] text-[#FCFCFC] rounded-t-[10px] px-4 py-3 bg-[#222222] border-none pl-[25px] focus:outline-none"
            required
            disabled={isLoadingCountries}
          />
        </div>
        <div className={`w-[368px] h-[30px] pl-[20px] flex items-center px-4 bg-[#222222] rounded-b-[10px] ${usernameStatus === 'invalid' ? 'border border-[#F5918A] border-t-0' : 'border border-[#2E2E2E] border-t-0'}`}>
          {usernameStatus === 'checking' && <span className="text-[12px] text-[#8F8F8F]">Checking username...</span>}
          {usernameStatus === 'valid' && <span className="text-[12px] text-[#1ECB84]">Username available</span>}
          {usernameStatus === 'invalid' && (
            <span className="text-[12px] text-[#F5918A]">
              {formData.username.length < 4 ? 'Minimum 4 characters' : 'Username not available'}
            </span>
          )}
          {usernameStatus === '' && formData.username.trim() === '' && (
            <span className="text-[12px] text-[#8F8F8F]">Enter a username</span>
          )}
        </div>
      </div>

      {/* Country Dropdown */}
      <div className="mt-[20px]">
        <label className="text-[14px] font-[500] text-[#8F8F8F] mb-2 block">Country</label>
        <div className="relative w-[350px]">
          {isLoadingCountries ? (
            <div className="w-[370px] h-[56px] bg-[#222222] mt-[10px] pl-[15px] pr-12 border border-[#2E2E2E] rounded-[10px] flex items-center">
              <span className="text-[#8F8F8F]">Loading countries...</span>
            </div>
          ) : (
            <>
              <div className="absolute left-4 top-1/2 mt-[5px] ml-[10px] -translate-y-1/2 flex items-center pointer-events-none">
                {formData.countryCode && (
                  <img
                    src={`https://flagcdn.com/w20/${formData.countryCode.toLowerCase()}.png`}
                    alt={`${formData.country} flag`}
                    width={20}
                    height={20}
                    className="rounded-sm"
                  />
                )}
              </div>
              <select
                className="w-[385px] h-[56px] bg-[#222222] mt-[10px] pl-[35px] pr-12 border border-[#2E2E2E] rounded-[10px] text-[14px] font-[500] text-[#FCFCFC] appearance-none"
                value={formData.countryCode}
                onChange={(e) => {
                  const selected = countries.find(c => c.code === e.target.value);
                  if (selected) {
                    setFormData(prev => ({
                      ...prev,
                      country: selected.name,
                      countryCode: selected.code
                    }));
                  }
                }}
                required
                disabled={isLoadingCountries}
              >
                <option value="">Select Country</option>
                {countries.map((country) => (
                  <option key={country.code} value={country.code}>
                    {country.name}
                  </option>
                ))}
              </select>
              <div className="absolute text-[#DBDBDB] right-[-20px] top-[40px] -translate-y-1/2 pointer-events-none">
                <Image
                  src={arrow_down}
                  alt="Select arrow"
                  width={20}
                  height={20}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Phone Input */}
      <label className="text-[14px] mt-[30px] font-[500] text-[#8F8F8F] mb-2">Phone number</label>
      <div className={`flex items-center pl-[10px] w-[375px] mt-[10px] bg-[#222222] border rounded-[10px] ${formData.phone.trim() === '' ? 'border-[#F5918A]' : 'border-[#2E2E2E]'}`}>
        <span className="text-[#DBDBDB] w-[51px] h-[24px] pt-[5px] text-center text-[14px] font-[500] bg-[#3A3A3A] px-4 py-4 rounded-[100px]">
          {countries.find(c => c.code === formData.countryCode)?.dialCode || '+234'}
        </span>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, '');
            setFormData(prev => ({ ...prev, phone: value }));
          }}
          className="flex-1 h-[56px] bg-transparent border-none outline-none text-[#FCFCFC] pl-4"
          placeholder="Phone number"
          required
          disabled={isLoadingCountries}
        />
      </div>

      {/* Continue Button */}
      <button
        onClick={handleSubmit}
        className={`w-[388px] h-[48px] border-none bg-[#2DE3A3] text-[#0F1012] text-[14px] font-[700] mt-[40px] py-3 rounded-full font-medium hover:opacity-90 transition flex items-center justify-center ${
          !allFieldsValid() || isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={!allFieldsValid() || isLoading}
      >
        {isLoading ? (
          <div className="loader-small"></div>
        ) : (
          'Complete Registration'
        )}
      </button>

      <style jsx global>{`
        .loader-small {
          width: 20px;
          height: 20px;
          position: relative;
        }
        .loader-small::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border: 3px solid #333333;
          border-top-color: #4DF2BE;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

export default Profilebd;
