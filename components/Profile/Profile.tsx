"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Nav from "../NAV/Nav";
import { useRouter } from "next/navigation";
import Settings from "../../components/Settings/Settings";
import Yellow_i from "../../public/Assets/Evolve2p_yellowi/elements.svg";
import Callen from "../../public/Assets/Evolve2p_Callen/Profile/elements.svg";
import ArrowD from "../../public/Assets/Evolve2p_arrowd/arrow-down-01.png";
import Currency from "../../public/Assets/Evolve2p_Currency/Profile/money-04.svg";
import Barrow from "../../public/Assets/Evolve2p_Barrow/arrow-down-01.svg";
import Mode from "../../public/Assets/Evolve2p_mode/Profile/elements.svg";
import Lang from "../../public/Assets/Evolve2p_Lang/Profile/globe.svg";
import Delete from "../../public/Assets/Evolve2p_Delete/Profile/elements.svg";
import Footer from "../../components/Footer/Footer";

interface Country {
  name: string;
  code: string;
  flag: string;
  currencies: {
    [currencyCode: string]: {
      name: string;
      symbol?: string;
    };
  };
  dialCode?: string; // e.g. "+234"
}

interface CurrencyItem {
  flag: string;
  name: string;
  code: string;
  symbol?: string;
}

const Profile = () => {
  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [openCountry, setOpenCountry] = useState(false);
  const [loadingCountries, setLoadingCountries] = useState(false);
   const router = useRouter();

  // Preferred currency states
  const [currencyList, setCurrencyList] = useState<CurrencyItem[]>([]);
  const [selectedCurrency, setSelectedCurrency] = useState<CurrencyItem | null>(null);
  const [openCurrency, setOpenCurrency] = useState(false);
  const [currencySearch, setCurrencySearch] = useState("");

  // phone state
  const [phone, setPhone] = useState<string>("8100000000");

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, "0"));
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [openDate, setOpenDate] = useState(false);

  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  const languages = [
    "English",
    "Filipino",
    "Swahili",
    "Spanish",
    "French",
    "German",
    "Japanese",
    "Russian",
    "Arabic",
  ];

  const [openLang, setOpenLang] = useState(false);
  const [selectedLang, setSelectedLang] = useState("English");

  const Toggle = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => {
    return (
      <div
        onClick={onToggle}
        className={`w-[40px] h-[20px] rounded-full p-[2px] flex items-center  cursor-pointer transition-colors duration-300
          ${enabled ? "bg-[#4DF2BE]" : "bg-[#8F8F8F]"}`
        }
      >
        <div
          className={`w-[15px] h-[15px] rounded-full transition-transform duration-300
    ${enabled ? "translate-x-[25px] bg-[#000]" : "translate-x-0 bg-[#fff]"}
  `}
        />
      </div>
    );
  };

  // override prefixes for the 7 countries you confirmed
  const prefixOverrides: Record<string, string> = {
    NG: "+234",
    GH: "+233",
    KE: "+254",
    ZA: "+27",
    TZ: "+255",
    ZM: "+260",
    UG: "+256",
  };

  // fetch when component mounts: request idd for dial codes as well
  useEffect(() => {
    const fetchCountries = async () => {
      setLoadingCountries(true);
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,flags,currencies,idd"
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          const formatted: Country[] = data.map((c: any) => {
            // compute dial code: prefer prefixOverrides, else use idd.root + suffixes[0] if available
            const code: string = c.cca2;
            let dial: string | undefined = undefined;
            if (prefixOverrides[code]) {
              dial = prefixOverrides[code];
            } else if (c.idd && c.idd.root) {
              // some countries have suffixes array, take first if present
              const suffix = Array.isArray(c.idd.suffixes) && c.idd.suffixes.length > 0 ? c.idd.suffixes[0] : "";
              dial = `${c.idd.root}${suffix}`;
            }
            return {
              name: c.name?.common || "",
              code: c.cca2,
              flag: c.flags?.png || c.flags?.svg || "",
              currencies: c.currencies || {},
              dialCode: dial,
            };
          });

          formatted.sort((a, b) => a.name.localeCompare(b.name));
          setCountries(formatted);

          // Default to Nigeria if present
          const nig = formatted.find((c) => c.code === "NG");
          setSelectedCountry(nig || formatted[0] || null);

          // Build currency list dynamically from all countries
          const currencyMap: { [code: string]: CurrencyItem } = {};
          formatted.forEach((ct) => {
            for (const curCode in ct.currencies) {
              if (!currencyMap[curCode]) {
                currencyMap[curCode] = {
                  code: curCode,
                  name: ct.currencies[curCode]?.name || curCode,
                  symbol: ct.currencies[curCode]?.symbol,
                  flag: ct.flag,
                };
              }
            }
          });
          const arr = Object.values(currencyMap).sort((a, b) => a.name.localeCompare(b.name));
          setCurrencyList(arr);

          // Default currency: from Nigeria if available
          if (nig) {
            const curCodes = Object.keys(nig.currencies);
            if (curCodes.length > 0) {
              const defaultCode = curCodes[0];
              const found = currencyMap[defaultCode];
              setSelectedCurrency(found);
            } else {
              setSelectedCurrency(arr[0]);
            }
          } else {
            setSelectedCurrency(arr[0] || null);
          }
        }
      } catch (err) {
        console.error("Error fetching countries:", err);
      } finally {
        setLoadingCountries(false);
      }
    };

    fetchCountries();
  }, []);

  const filteredCurrencies = currencyList.filter((c) =>
    c.name.toLowerCase().includes(currencySearch.toLowerCase())
  );

  return (
    <main className="min-h-screen  bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />
        <div className="flex  items-center mt-[-100px] mr-[40px]">
          <Settings />

          {/* Right side */}
          <div className="w-[809px]  mt-[108px] bg-[#1A1A1A]   gap-[20px] p-[24px_64px]">
            <div className="flex w-[681px] items-center justify-between ">
              <p className="text-[24px] font-[700] text-[#FFFFFF]">Profile</p>

              <div className="flex items-center gap-[20px]">
                <div className="flex items-center justify-center w-[143px] h-[36px] text-[14px] text-[#FFFFFF] font-[700] bg-[#2D2D2D] p-[8px_14px] rounded-full">
                  Discard Changes
                </div>

                <div className="flex items-center justify-center w-[124px] h-[36px] text-[14px] text-[#0F1012] font-[700] border-[1px] border-[#4DF2BE] bg-[#4DF2BE] p-[8px_14px] rounded-full">
                  Save Changes
                </div>
              </div>
            </div>

            <form className="space-y-4 w-[681px] mt-[15px]">
              <div className="flex flex-col">
                <label className="text-[14px] font-[500] text-[#C7C7C7]">Email</label>
                <input
                  type="email"
                  className="h-[56px] bg-[#222222]  mt-1 p-[8px_8px_8px_16px] rounded-[8px] text-[14px] font-[400] border-none text-[#C7C7C7]"
                  defaultValue="davidadeyemi3@sample.com"
                />
              </div>

              <div className="flex flex-col  mt-[20px]">
                <label className="text-[14px] font-[500] text-[#C7C7C7]">Username</label>
                <div className="relative  ">
                  <span className="absolute  left-4 top-1/2 -translate-y-1/2 pl-[15px] text-[#C7C7C7]  text-[16px]">
                    @
                  </span>
                  <div className="flex items-center  ">
                    <input
                      type="text"
                      className=" w-[750px] h-[56px] bg-[#222222] p-[8px_8px_8px_40px]  mt-1  rounded-t-[8px] text-[14px] font-[400] border-none text-[#C7C7C7]"
                      defaultValue="davidd01"
                    />
                  </div>
                </div>
                <div className=" flex items-center   h-[28px] bg-[#2D2D2D] text-[12px] text-[#DBDBDB] font-[400]  p-[4px_12px] rounded-b-[8px] ">
                  Your unique Identity
                </div>
              </div>

              <div className="flex items-center  ">
                {/* phone number */}
                <div className="flex flex-col w-[330.5] ">
                  <div className="flex items-center    justify-between">
                    <p className="text-[14px] font-[500] text-[#C7C7C7]">Phone number</p>

                    <p className="text-[14px] font-[700] text-[#4DF2BE] cursor-pointer" onClick={() => router.push("/profile/updatephone")}>Verify</p>
                  </div>

                  <div className="flex items-center mt-2">
                    <div className="flex items-center relative w-[330px]">
                      <span className="flex items-center justify-center absolute w-[51px] h-[24px] bg-[#3A3A3A] left-4 top-1/2 -translate-y-1/2 ml-[10px] rounded-[16px] p-[2px_10px] text-[#DBDBDB] text-[14px] font-[500] ">
                        {selectedCountry?.dialCode || "+234"}
                      </span>
                      <input
                        type="tel"
                        inputMode="numeric"
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          setPhone(value);
                        }}
                        className="w-[220px] h-[56px] bg-[#222222] rounded-[8px] border-none p-[8px_8px_8px_100px] pr-4 text-[14px] font-[400] text-[#C7C7C7]"
                        placeholder="Phone number"
                      />
                      <span className="flex items-center absolute right-[20px] top-1/2 -translate-y-1/2 ">
                        <Image src={Yellow_i} alt="yellowi" width={24} height={24} />
                      </span>
                    </div>
                  </div>
                </div>

                {/* country */}
                <div className="flex flex-col ml-[20px] w-[330.5px]">
                  <p className="text-[14px] font-[500] text-[#C7C7C7]">Country</p>
                  <div className="flex items-center mt-2">
                    <div className="flex items-center relative w-[330px]">
                      {selectedCountry && (
                        <div
                          className="absolute left-3 flex items-center cursor-pointer"
                          onClick={() => setOpenCountry(!openCountry)}
                        >
                          <img
                            src={selectedCountry.flag}
                            alt={selectedCountry.name}
                            width={24}
                            height={16}
                            className="rounded-sm mr-2"
                          />
                        </div>
                      )}

                      <input
                        type="text"
                        readOnly
                        onClick={() => setOpenCountry(!openCountry)}
                        className="w-[220px] h-[56px] bg-[#222222] rounded-[8px] border-none p-[8px_8px_8px_100px] pr-4 text-[14px] font-[400] text-[#C7C7C7] cursor-pointer"
                        value={selectedCountry?.name || "Select country"}
                      />
                      {openCountry && (
                        <div className="absolute top-[60px] left-0 bg-[#222222] rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto z-50">
                          {loadingCountries && (
                            <div className="p-3 text-[#C7C7C7] text-[14px]">Loading...</div>
                          )}
                          {!loadingCountries &&
                            countries.map((ct) => (
                              <div
                                key={ct.code}
                                onClick={() => {
                                  setSelectedCountry(ct);
                                  setOpenCountry(false);
                                  // if the country has currencies, change default preferred currency
                                  const codes = Object.keys(ct.currencies);
                                  if (codes.length > 0) {
                                    const c0 = codes[0];
                                    const found = currencyList.find((ci) => ci.code === c0);
                                    if (found) setSelectedCurrency(found);
                                  }
                                }}
                                className="flex items-center px-3 py-2 hover:bg-[#333333] cursor-pointer"
                              >
                                <img
                                  src={ct.flag}
                                  alt={ct.name}
                                  width={20}
                                  height={14}
                                  className="rounded-sm mr-2"
                                />
                                <span className="text-[14px] text-[#C7C7C7]">
                                  {ct.name}
                                </span>
                              </div>
                            ))}
                        </div>
                      )}
                      <div className="flex items-center right-[20px] absolute top-1/2 -translate-y-1/2">
                        <Image src={ArrowD} alt="arrow-down" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative mt-[10px]">
                <label className="text-[14px] font-[500] text-[#C7C7C7] mb-1 block">
                  Date of Birth
                </label>

                {/* main input */}
                <div
                  className="relative h-[56px] bg-[#222222] rounded-[8px] border-none p-[8px_8px_8px_16px] flex items-center cursor-pointer"
                  onClick={() => setOpenDate(!openDate)}
                >
                  {/* Calendar Icon */}
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Image src={Callen} alt="calendar" width={20} height={20} />
                  </div>

                  <span className="ml-[40px] text-[#C7C7C7] text-[14px] font-[400]">
                    {day && month && year ? `${day}/${month}/${year}` : "DD/MM/YYYY"}
                  </span>

                  {/* single arrow at the far right */}
                  <div className="flex items-center right-[20px] absolute top-1/2 -translate-y-1/2">
                    <Image src={ArrowD} alt="arrow" />
                  </div>
                </div>

                {/* dropdown with three selectors */}
                {openDate && (
                  <div className="flex items-center absolute mt-[10px]  w-[705px] h-[50px] bg-[#222222] rounded-[8px] shadow-lg p-4 flex justify-between z-50">
                    {/* Day */}
                    <select
                      className=" flex items-center bg-[#222222] h-[20px] ml-[10px] text-[#C7C7C7] text-[14px] font-[400] focus:outline-none"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                    >
                      <option value="">Day</option>
                      {days.map((d) => (
                        <option key={d} value={d.toString().padStart(2, "0")}>
                          {d.toString().padStart(2, "0")}
                        </option>
                      ))}
                    </select>

                    {/* Month */}
                    <select
                      className="bg-[#222222] text-[#C7C7C7] text-[14px] font-[400] focus:outline-none"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                    >
                      <option value="">Month</option>
                      {months.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>

                    {/* Year */}
                    <select
                      className="bg-[#222222] text-[#C7C7C7] mr-[10px] text-[14px] font-[400] focus:outline-none"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value="">Year</option>
                      {years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="h-[1px] bg-[#3A3A3A] mt-[20px]" />
              <div className="mt-[50px]">
                <p className="text-[14px] font-[500] text-[#C7C7C7]">Others</p>

                <div className="space-y-[10px]">
                  <div className="relative">
                    <div className="flex items-center justify-between h-[44px] p-[8px_15px] bg-[#2D2D2D] rounded-[8px]">
                      <div className="flex items-center gap-[10px]">
                        <Image src={Currency} alt="currency" />
                        <p className="text-[14px] font-[500] text-[#DBDBDB]">
                          Preferred currency
                        </p>
                      </div>
                      <div
                        onClick={() => setOpenCurrency(!openCurrency)}
                        className="flex items-center w-[64px] h-[22px] bg-[#3A3A3A] p-[2px_8px] rounded-[16px] cursor-pointer"
                      >
                        <p className="text-[12px] font-[500] text-[#DBDBDB]">
                          {selectedCurrency?.code}
                        </p>
                        <Image src={Barrow} alt="arrow-down" className="ml-[25px] w-[15px]" />
                      </div>
                    </div>
                    {openCurrency && (
                      <div className="absolute top-[50px] right-0 bg-[#222222] rounded-[8px] shadow-lg w-[300px] max-h-[300px] overflow-y-auto z-50">
                        <div className="p-3 border-b border-[#333333]">
                          <input
                            type="text"
                            placeholder="Search currency..."
                            value={currencySearch}
                            onChange={(e) => setCurrencySearch(e.target.value)}
                            className="w-full h-[36px] px-3 bg-[#2D2D2D] text-white rounded-[8px] outline-none"
                          />
                        </div>
                        {filteredCurrencies.map((ci) => (
                          <div
                            key={ci.code}
                            onClick={() => {
                              setSelectedCurrency(ci);
                              setOpenCurrency(false);
                            }}
                            className="flex items-center justify-between px-4 py-3 hover:bg-[#333333] cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={ci.flag}
                                alt={ci.name}
                                width={24}
                                height={16}
                                className="rounded-sm"
                              />
                              <span className="text-[#DBDBDB] text-[14px]">{ci.name}</span>
                            </div>
                            <span className="text-[#B5B5B5] text-[14px] font-[500]">
                              {ci.code}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between h-[44px] p-[8px_12px] bg-[#2D2D2D] rounded-[8px]">
                    <div className="flex items-center gap-[10px] ">
                      <Image src={Mode} alt="mode" />
                      <p className="text-[14px] font-[500] text-[#DBDBDB]">Dark mode</p>
                    </div>

                    <div className="space-y-[10px] mb-6">
                      <div>
                        <Toggle
                          enabled={darkModeEnabled}
                          onToggle={() => setDarkModeEnabled(!darkModeEnabled)}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between h-[44px] p-[8px_15px] bg-[#2D2D2D] rounded-[8px]">
                    <div className="flex items-center gap-[10px] ">
                      <Image src={Lang} alt="lang" />
                      <p className="text-[14px] font-[500] text-[#DBDBDB]">App Language</p>
                    </div>

                    <div
                      onClick={() => setOpenLang(!openLang)}
                      className="flex items-center w-[64px] h-[22px] bg-[#3A3A3A] p-[2px_8px] rounded-[16px] cursor-pointer"
                    >
                      <p className="text-[12px] font-[500] text-[#DBDBDB] truncate">{selectedLang}</p>
                      <Image
                        src={Barrow}
                        alt="arrow"
                        className={`ml-[8px] w-[15px] transition-transform duration-200 ${
                          openLang ? "rotate-180" : ""
                        }`}
                      />
                    </div>

                    {/* dropdown */}
                    {openLang && (
                      <div className="absolute top-[148%] ml-[40%] mt-2 w-[200px] bg-[#222222] rounded-[8px] shadow-lg z-50">
                        <div className="py-2 max-h-[240px] overflow-y-auto">
                          {languages.map((lang) => (
                            <div
                              key={lang}
                              onClick={() => {
                                setSelectedLang(lang);
                                setOpenLang(false);
                              }}
                              className={`px-4 py-2 flex items-center justify-between cursor-pointer hover:bg-[#2D2D2D] text-[14px] font-[500] ${
                                selectedLang === lang ? "text-[#4DF2BE]" : "text-[#DBDBDB]"
                              }`}
                            >
                              {lang}
                              {selectedLang === lang && (
                                <span className="w-[10px] h-[10px] rounded-full bg-[#4DF2BE] inline-block"></span>
                              )}
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => setOpenLang(false)}
                          className="w-full py-2 text-center text-[14px] font-[500] text-[#DBDBDB] hover:bg-[#2D2D2D]"
                        >
                          Close
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </form>

            <div className="w-[681px] h-[1px] bg-[#3A3A3A] mt-[20px]" />

            <div className="w-[681px] ">
              <p className="text-[14px] font-[500] text-[#DBDBDB]">
                Deleting your account is permanent and cannot be undone. All your data, including transaction
                history and saved preferences, will be erased. You will no longer have access to your account.
              </p>

              <div className="flex items-center justify-center gap-[10px] w-[154px] h-[36px] bg-[#222222] p-[8px_14px] rounded-full mt-4">
                <Image src={Delete} alt="delete" />
                <p className="text-[14px] font-[700] text-[#FE857D]">Delete account</p>
              </div>
            </div>
          </div>
        </div>

        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>

        <div className=" mb-[80px] mt-[30%] ">
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default Profile;
