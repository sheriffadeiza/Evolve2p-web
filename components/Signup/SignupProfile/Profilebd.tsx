"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const BASE_URL = "https://evolve2p-backend.onrender.com/api/";

const Profilebd = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    country: "",
    countryCode: "",
    phone: "",
  });

  const [countries, setCountries] = useState<any[]>([]);
  const [countrySearch, setCountrySearch] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("");
  const [isValidUsername, setIsValidUsername] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCountries, setIsLoadingCountries] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [error, setError] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // Fetch countries
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,flags,capital"
        );
        const data = await response.json();

        const formattedCountries = data
          .map((country: any) => ({
            name: country.name.common,
            code: country.cca2,
            dialCode:
              country.cca2 === "NG"
                ? "+234"
                : country.cca2 === "US"
                ? "+1"
                : country.cca2 === "GB"
                ? "+44"
                : country.cca2 === "CA"
                ? "+1"
                : country.cca2 === "GH"
                ? "+233"
                : "+1",
          }))
          .sort((a: any, b: any) => a.name.localeCompare(b.name));

        setCountries(formattedCountries);

        const nigeria = formattedCountries.find((c: any) => c.code === "NG");
        if (nigeria) {
          setFormData((prev) => ({
            ...prev,
            country: nigeria.name,
            countryCode: nigeria.code,
          }));
        }
      } catch (error) {
        console.error("Failed to fetch countries:", error);
      } finally {
        setIsLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  // Debounce username check
  useEffect(() => {
    if (formData.username.trim() === "") {
      setUsernameStatus("");
      setIsValidUsername(false);
      return;
    }

    setUsernameStatus("checking");

    const handler = setTimeout(() => {
      const lower = formData.username.toLowerCase();
      const isValid =
        formData.username.length >= 4 &&
        !["admin", "user", "test"].includes(lower);

      if (isValid) {
        setUsernameStatus("valid");
        setIsValidUsername(true);
      } else {
        setUsernameStatus("invalid");
        setIsValidUsername(false);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [formData.username]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, username: e.target.value }));
  };

  const allFieldsValid = () => {
    return (
      isValidUsername &&
      formData.phone.trim() !== "" &&
      formData.country.trim() !== ""
    );
  };

  const handleContinueToSecurityPin = () => {
    router.push("/Signups/Secpin");
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    if (!allFieldsValid()) {
      setErrorMessage("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const currentData = localStorage.getItem("UserReg")
        ? JSON.parse(localStorage.getItem("UserReg") as string)
        : null;

      const selectedCountry = countries.find(
        (c) => c.code === formData.countryCode
      );
      const phoneNumber = selectedCountry
        ? `${selectedCountry.dialCode}${formData.phone}`
        : formData.phone;

      const UserData = {
        email: currentData?.email,
        username: formData.username,
        password: currentData?.password,
        country: formData.country,
        emailVerified: currentData?.isEmailVerified,
        phone: phoneNumber,
      };

      // Send profile data to backend with Authorization header if token exists
      const SignupResponse = await fetch(BASE_URL + "auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(UserData),
      });

      const data = await SignupResponse.json();

      if (data?.error) {
        alert(data?.message);
        return;
      }

      // Always use accessToken for consistency
      let token = data?.accessToken;

      if (token) {
        // Get user data - exactly matches login flow
        const userResponse = await fetch(BASE_URL + "get-user", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });

        const userData = await userResponse.json();

        if (userData?.success) {
          // Store data in same format as login
          localStorage.removeItem("UserReg");
          localStorage.setItem(
            "UserData",
            JSON.stringify({
              accessToken: token,
              userData: userData?.user,
            })
          );
          setShowSuccessModal(true);
          // router.push("/Signups/Secpin");
        }
      }
    } catch (error: any) {
      setError(
        error.message ||
          "An error occurred during registration. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  // --- Country Search State ---
  const [showCountrySearch, setShowCountrySearch] = useState(false);
  const [countrySearchInput, setCountrySearchInput] = useState("");

  // Filtered countries for search
  const filteredCountries = countries.filter((country) =>
    country.name.toLowerCase().includes(countrySearchInput.toLowerCase())
  );

  return (
    <div className="flex flex-col px-8 py-16 ml-[100px] gap-2 w-full max-w-[400px] text-white">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-[#222222] h-[30vh] p-6 rounded-[10px] w-[300px] text-center">
            <h3 className="text-[#4DF2BE] text-[18px] font-bold mb-2">
              Success!
            </h3>
            <p className="text-[#FCFCFC]">
              Registration completed successfully
            </p>
            <button
              onClick={handleContinueToSecurityPin}
              className="w-[250px] mt-[40px] border-none bg-[#4DF2BE] text-[#000] py-2 rounded-[100px] font-bold hover:bg-[#3dd9ab] transition"
            >
              Continue to Security Pin
            </button>
          </div>
        </div>
      )}

      <h1 className="text-[24px] text-[#FCFCFC] font-[700]">
        Complete Your Profile
      </h1>
      <p className="text-[16px] font-[400] mt-[-5px] text-[#8F8F8F] mb-6">
        This helps personalize your experience.
      </p>

      {errorMessage && (
        <div className="w-[370px] p-3 mb-4 text-[#F5918A] text-sm">
          {errorMessage}
        </div>
      )}

      {/* Username Input */}
      <div className="mt-[20px]">
        <label className="text-[14px] mt-2 font-[500] text-[#8F8F8F]">
          Username
        </label>
        <div
          className={`relative w-[388px] rounded-t-[10px] ${
            usernameStatus === "invalid"
              ? "border border-[#F5918A]"
              : "border border-[#2E2E2E]"
          }`}
        >
          <span className="text-[#DBDBDB] absolute ml-[10px] mt-[18px]">@</span>
          <input
            type="text"
            value={formData.username}
            onChange={handleUsernameChange}
            className="w-[360px] h-[56px] text-[#FCFCFC] rounded-t-[10px] px-4 py-3 bg-[#222222] border-none pl-[25px] focus:outline-none"
            required
            disabled={isLoadingCountries}
          />
        </div>
        <div
          className={`w-[368px] h-[30px] pl-[20px] flex items-center px-4 bg-[#222222] rounded-b-[10px] ${
            usernameStatus === "invalid"
              ? "border border-[#F5918A] border-t-0"
              : "border border-[#2E2E2E] border-t-0"
          }`}
        >
          {usernameStatus === "checking" && (
            <span className="text-[12px] text-[#8F8F8F]">
              Checking username...
            </span>
          )}
          {usernameStatus === "valid" && (
            <span className="text-[12px] text-[#1ECB84]">
              Username available
            </span>
          )}
          {usernameStatus === "invalid" && (
            <span className="text-[12px] text-[#F5918A]">
              {formData.username.length < 4
                ? "Minimum 4 characters"
                : "Username not available"}
            </span>
          )}
          {usernameStatus === "" && formData.username.trim() === "" && (
            <span className="text-[12px] text-[#8F8F8F]">Enter a username</span>
          )}
        </div>
      </div>

      {/* Country Dropdown */}
      <div className="mt-[20px]">
        <label className="text-[14px] font-[500] text-[#8F8F8F] mb-2 block">
          Country
        </label>
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
              <div className="relative">
                <input
                  type="text"
                  className="w-[365px] h-[56px] bg-[#222222] mt-[10px] pl-[20px] pr-12 border border-[#2E2E2E] rounded-[10px] text-[14px] font-[500] text-[#FCFCFC] focus:outline-none"
                  placeholder="Type to search country..."
                  value={countrySearch}
                  onChange={(e) => setCountrySearch(e.target.value)}
                  onFocus={() => setShowCountrySearch(true)}
                  required
                  disabled={isLoadingCountries}
                />
                {showCountrySearch && (
                  <div className="absolute top-[60px]   left-0 w-full z-20 bg-[#222222] border border-[#2E2E2E] rounded-[10px] p-2">
                    <div className="max-h-[200px] ml-[10px] overflow-y-auto">
                      {countries.filter((country) =>
                        country.name
                          .toLowerCase()
                          .includes(countrySearch.toLowerCase())
                      ).length === 0 && (
                        <div className="text-[#8F8F8F] px-2 py-1">
                          No country found
                        </div>
                      )}
                      {countries
                        .filter((country) =>
                          country.name
                            .toLowerCase()
                            .includes(countrySearch.toLowerCase())
                        )
                        .map((country) => (
                          <div
                            key={country.code}
                            className="flex items-center mb-[10px]  gap-2 px-2 py-2 cursor-pointer hover:bg-[#333] rounded"
                            onClick={() => {
                              setFormData((prev) => ({
                                ...prev,
                                country: country.name,
                                countryCode: country.code,
                              }));
                              setCountrySearch(country.name);
                              setShowCountrySearch(false);
                            }}
                          >
                            <img
                              src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                              alt={`${country.name} flag`}
                              width={20}
                              height={20}
                              className="rounded-sm"
                            />
                            <span className="text-[#FCFCFC]">
                              {country.name}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Phone Input */}
      <label className="text-[14px] mt-[30px] font-[500] text-[#8F8F8F] mb-2">
        Phone number
      </label>
      <div
        className={`flex items-center pl-[10px] w-[375px] mt-[10px] bg-[#222222] border rounded-[10px] ${
          formData.phone.trim() === "" ? "border-[#F5918A]" : "border-[#2E2E2E]"
        }`}
      >
        <span className="text-[#DBDBDB] w-[51px] h-[24px] pt-[5px] text-center text-[14px] font-[500] bg-[#3A3A3A] px-4 py-4 rounded-[100px]">
          {countries.find((c) => c.code === formData.countryCode)?.dialCode ||
            "+234"}
        </span>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => {
            const value = e.target.value.replace(/\D/g, "");
            setFormData((prev) => ({ ...prev, phone: value }));
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
          !allFieldsValid() || isLoading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!allFieldsValid() || isLoading}
      >
        {isLoading ? (
          <div className="loader-small"></div>
        ) : (
          "Complete Registration"
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
          border-top-color: #4df2be;
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