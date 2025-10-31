"use client";

import React, { useEffect, useState } from "react";
import Nav from "../../components/NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Footer from "../../components/Footer/Footer";
import Image from "next/image";
import Lessthan from "../../public/Assets/Evolve2p_lessthan/Makretplace/arrow-left-01.svg";

interface CountryItem {
  name: string;
  code?: string;
  dial_code: string;
  flag?: string;
}

const prefixOverrides: Record<string, string> = {
  NG: "+234",
  GH: "+233",
  KE: "+254",
  ZA: "+27",
  TZ: "+255",
  ZM: "+260",
  UG: "+256",
  US: "+1",
  GB: "+44",
};

const UpdatePhone: React.FC = () => {
  const [countries, setCountries] = useState<CountryItem[]>([]);
  const [openList, setOpenList] = useState(false);
  const [phone, setPhone] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<CountryItem>({
    name: "Nigeria",
    dial_code: "+234",
    flag: "",
    code: "NG",
  });
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,cca2,flags,idd"
        );

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          const text = await res.text();
          console.error("Expected JSON but got:", text);
          throw new Error("Country API did not return JSON");
        }

        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected format");

        const list: CountryItem[] = data
          .map((c: any) => {
            const code = c.cca2;
            const root = c?.idd?.root || "";
            const suffix = Array.isArray(c?.idd?.suffixes)
              ? c.idd.suffixes[0]
              : "";
            const defaultDial = root ? `${root}${suffix}` : undefined;
            const dial = prefixOverrides[code] || defaultDial;

            if (!dial) return null;

            return {
              name: c?.name?.common || code || "Unknown",
              code,
              flag: c?.flags?.png || c?.flags?.svg || "",
              dial_code: dial,
            };
          })
          .filter(Boolean) as CountryItem[];

        list.sort((a, b) => a.name.localeCompare(b.name));
        setCountries(list);

        const ng = list.find((x) => x.code === "NG");
        setSelectedCountry(ng || list[0]);
      } catch (err) {
        console.error("Failed to fetch countries:", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const updatePhoneNumber = async () => {
    if (!phone.trim()) {
      alert("Please enter your phone number");
      return;
    }

    const composedPhone = `${selectedCountry.dial_code}${phone}`;
    setSending(true);

    try {
      const storedUser =
        typeof window !== "undefined"
          ? localStorage.getItem("UserData")
          : null;
      const accessToken = storedUser
        ? JSON.parse(storedUser)?.accessToken
        : null;

      const res = await fetch(
        "https://evolve2p-backend.onrender.com/api/update-user",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
          },
          body: JSON.stringify({ phone: composedPhone }),
        }
      );

      const contentType = res.headers.get("content-type") || "";

      if (!res.ok) {
        const errMessage = contentType.includes("application/json")
          ? (await res.json()).message
          : await res.text();
        alert(errMessage || "Something went wrong");
        return;
      }

      // ✅ SUCCESS → SHOW MODAL
      setShowModal(true);
    } catch (error) {
      console.error(error);
      alert("Failed to update phone");
    } finally {
      setSending(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex items-start mt-[20px] mr-[40px]">
          <Settings />

          <div className="w-[809px] h-[784px] bg-[#1A1A1A] rounded-r-[8px] p-[24px_64px]">
            <div className="flex items-center justify-between mb-6">
              <div
                className="flex items-center gap-[10px] w-[126px] h-[36px] p-[8px_14px] cursor-pointer rounded-full bg-[#2D2D2D]"
                onClick={() => window.history.back()}
              >
                <Image src={Lessthan} alt="back" width={16} height={16} />
                <p className="text-[14px] font-[700] text-[#FFFFFF] ml-[5px]">
                  Edit Profile
                </p>
              </div>
            </div>

            <div className="w-[435px] h-[136px] ml-[20%] p-[24px_20px]">
              <h2 className="text-[24px] font-[700] text-[#FFFFFF] mb-2">
                Update phone number
              </h2>
              <p className="text-[16px] font-[400] text-[#C7C7C7] mb-6">
                Enter your phone number to receive a verification code <br /> and
                secure your account.
              </p>
            </div>

            <div className=" ml-[20%] p-[0_20px] rounded-[10px] p-6 max-w-[640px]">
              <label className="text-[14px] text-[#C7C7C7] font-[500]">
                Phone number
              </label>

              <div className="mt-[10px] relative">
                <div
                  className="absolute flex items-center justify-center gap-[10px] w-[80px] mt-[15px] left-[20px] z-10 bg-[#3A3A3A] px-3 py-[6px] rounded-full cursor-pointer"
                  onClick={() => setOpenList((s) => !s)}
                >
                  {selectedCountry.flag && (
                    <img
                      src={selectedCountry.flag}
                      width={20}
                      height={14}
                      className="rounded-sm"
                      alt={selectedCountry.name}
                    />
                  )}
                  <span className="text-[14px] text-[#DBDBDB] font-[500]">
                    {selectedCountry.dial_code}
                  </span>
                </div>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="810 000 0000"
                  className="flex items-center justify-center w-[220px] h-[56px] bg-[#222222] rounded-[8px] border border-[#2E2E2E] 
                  text-[14px] text-[#DBDBDB] outline-none pl-[30%]"
                />

                {openList && (
                  <div className="absolute mt-2 left-0 w-full bg-[#222222] rounded-[8px] shadow-lg max-h-[260px] overflow-y-auto z-50 border border-[#2E2E2E]">
                    {loading ? (
                      <div className="p-3 text-[#C7C7C7]">Loading...</div>
                    ) : (
                      countries.map((c) => (
                        <div
                          key={c.code}
                          onClick={() => {
                            setSelectedCountry(c);
                            setOpenList(false);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-[#2D2D2D] cursor-pointer"
                        >
                          <img
                            src={c.flag}
                            width={24}
                            height={16}
                            className="rounded-sm"
                            alt={c.name}
                          />
                          <div className="flex-1 text-[14px] text-[#DBDBDB]">
                            {c.name}
                          </div>
                          <div className="text-[14px] text-[#B5B5B5]">
                            {c.dial_code}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <button
                onClick={updatePhoneNumber}
                disabled={sending}
                className="w-[395px] h-[48px] mt-[20px] border-[1px] border-[#4DF2BE] bg-[#4DF2BE] hover:opacity-90 mt-6 rounded-full text-[#0F1012] font-[700] text-[16px]"
              >
                {sending ? "Updating..." : "Update Number"}
              </button>
            </div>
          </div>
        </div>

        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>

        <div className="mb-[80px] mt-[30%]">
          <Footer />
        </div>
      </div>

      {/* ✅ SUCCESS MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[9999]">
          <div className="bg-[#1A1A1A] w-[450px] rounded-[16px] p-[40px] text-center border border-[#333]">
            <div className="flex justify-center mb-6">
              <div className="w-[64px] h-[64px] bg-[#4DF2BE33] rounded-full flex justify-center items-center text-3xl">
                ✅
              </div>
            </div>

            <h2 className="text-[20px] font-[700] text-white mb-3">
              Phone number updated!
            </h2>

            <p className="text-[14px] text-[#C7C7C7] mb-8">
              Your phone number has been successfully Updated.
            </p>

            <button
              onClick={() => (window.location.href = "/login")}
              className="w-full h-[48px] bg-[#4DF2BE] rounded-full text-[#0F1012] font-[700] text-[16px]"
            >
              Go to log in
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default UpdatePhone;
