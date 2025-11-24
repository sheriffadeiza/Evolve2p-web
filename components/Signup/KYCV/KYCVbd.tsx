"use client";

import React, { useState, useEffect } from "react";
import Head from "next/head";
import Evolve_ee from "../../../public/Assets/Evolve_ee/Clip path group.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Times from "../../../public/Assets/Evolve2p_times/Icon container.png";

const KYCVbd = () => {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null); // ✅ localStorage user state
  const router = useRouter();

  // ✅ Load user from localStorage only on client
  useEffect(() => {
    try {
      const stored = localStorage.getItem("UserData");
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch (err) {
      console.error("Failed to parse UserData from localStorage", err);
    }
  }, []);

  const handleVerifyClick = async () => {
    setLoading(true);
    try {
      if (!user) {
        console.log("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await fetch(
        "https://evolve2p-backend.onrender.com/api/kyc-get-link",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.accessToken}`,
          },
        }
      );

      const data = await res.json();
      console.log(data);

      if (data.inquiry_id) {
        const personaLink = `https://withpersona.com/verify?inquiry-id=${data.inquiry_id}&redirect-uri=http://evolve2p-91v6inm68-sheriffadeizas-projects.vercel.app/Loader`;
        window.location.href = personaLink;
        return;
      }

      if (data.link) {
        window.location.href = data.link;
        return;
      }

      console.log("Backend error:", data);
      setLoading(false);
    } catch (err) {
      console.log("Network error:", err);
      setLoading(false);
    }
  };

  const handleVerifyLater = () => {
    router.push("/Logins/login");
  };

  const handleModalBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setShowModal(false);
  };

  const toggleModal = () => setShowModal((prev) => !prev);

  // ✅ Optional: Show loader while waiting for localStorage to load
  if (user === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1012] text-white">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Head>
        <title className="text-green-500">Verify Identity | Evolve2p</title>
      </Head>
      <div className="w-full lg:mx-0 ">
        <div className="min-h-screen flex items-center justify-center bg-[#0F1012] text-white px-4 mx-auto p-8 max-w-sm">
          <div className="absolute top-[250px] left-[15%] sm:left-[28%] md:left-[30%] lg:left-[15%]">
            <Image
              src={Evolve_ee}
              alt="Evolve2p Logo"
              width={138.728}
              height={33.045}
            />
          </div>

          {/* Main Content */}
          <div className="max-w-md w-full lg:ml-[80px] space-y-6 flex flex-col justify-center border-0 border-white">
            <h1 className="text-[24px] mt-[25%] text-[#ffffff] font-[700]">
              Verify Your Identity
            </h1>
            <p className="text-[16px] font-[400] text-[#8F8F8F] w-full">
              For security and compliance, we need to verify your identity{" "}
              <br /> before you can start trading.
            </p>

            {/* Info Cards */}
            <div className="bg-[#2D2D2D] w-full lg:w-[100%] h-[14vh] p-[5px] pl-[15px] rounded-[8px]">
              <p className="font-[500] text-[14px] text-[#FCFCFC]">
                Required for regulation
              </p>
              <p className="text-[#DBDBDB] mt-[8px] text-[12px] font-[400]">
                We are required to verify your identity.
              </p>
            </div>

            <div className="bg-[#2D2D2D] mt-[20px] w-full lg:w-[100%] h-[14vh] pt-[5px] pb-[10px] pl-[15px] rounded-[8px]">
              <p className="font-[500] text-[14px] text-[#FCFCFC]">
                We value your privacy
              </p>
              <p className="text-[#DBDBDB] mt-[8px] text-[12px] font-[400]">
                This helps us protect your Evolve2p account. See{" "}
                <span className="text-[#4DF2BE] underline cursor-pointer">
                  privacy policy.
                </span>
              </p>
            </div>

            {/* Modal Trigger */}
            <p
              className="text-[#4DF2BE] text-[14px] font-[700] ml-[30px] cursor-pointer hover:underline"
              onClick={toggleModal}
            >
              How does this work?
            </p>

            {/* Buttons */}
            <div className="space-y-3 mt-[60px]">
              <div className="relative">
                <button
                  className="w-full lg:w-[430px] h-[48px] text-[#222222] py-3 bg-[#4DF2BE]   text-[14px] font-[700] border-none rounded-[100px] transition-colors flex items-center justify-center"
                  onClick={handleVerifyClick}
                  disabled={loading}
                >
                  {loading ? (
                    "Getting link..."
                  ) : (
                    <>
                      Verify with
                      <div className="ml-[5px]  flex items-center">
                        <svg
                          width="138.728"
                          height="33.045"
                          viewBox="0 0 72 20"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.337787 14.1653H9.70548C9.85825 14.1654 10.0047 14.2354 10.1128 14.3599C10.2208 14.4844 10.2815 14.6533 10.2815 14.8295V15.7065C10.2815 15.8827 10.2207 16.0515 10.1127 16.1761C10.0047 16.3006 9.85824 16.3706 9.70548 16.3707H0.337669C0.184946 16.3706 0.0385055 16.3006 -0.0694857 16.1761C-0.177477 16.0516 -0.238187 15.8828 -0.238281 15.7067V14.8296C-0.238187 14.6535 -0.177468 14.4846 -0.0694583 14.36C0.0385517 14.2355 0.185022 14.1654 0.337787 14.1653Z"
                            fill="#2f2f2f"
                          />
                          <text
                            x="12"
                            y="15"
                            className="font-poppins text-[#2D2D2D]"
                            fill="currentColor"
                            fontWeight="700"
                            fontSize="14"
                          >
                            Persona
                          </text>
                        </svg>
                      </div>
                    </>
                  )}
                </button>
              </div>

              <button
                className=" w-full lg:w-[430px] h-[48px] mt-[30px] py-3 font-[700] bg-[#2D2D2D] text-[#FCFCFC] text-[14px] border-none rounded-[100px] transition-colors flex items-center justify-center"
                onClick={handleVerifyLater}
              >
                Verify Later
              </button>
            </div>
          </div>

          {/* Modal */}
          {showModal && (
            <div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000] border-2 border-red-500"
              onClick={handleModalBackgroundClick}
            >
              <div
                className="bg-[#000] lg:ml-[50px] pl-[20px] pr-[20px] h-[100%] mt-[-10%] lg:mt-[-4%]  rounded-lg p-6 max-w-md w-full lg:w-[50%] mx-4 border-0 border-white overflow-y-scroll border-b-2 border-b-gray-500"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-[#FFFFFF] mt-[45px] text-[16px] font-[700]">
                  Identity Verification
                  <Image
                    src={Times}
                    alt={"times"}
                    width={20}
                    height={20}
                    className="absolute top-4 ml-[28%] cursor-pointer "
                    onClick={toggleModal}
                  />
                </div>
                <div className="flex justify-between rerelative top-[20px] mt-[10px] items-center mb-4 ">
                  <h2 className="text-[20px]  font-[700] text-[#FFFFFF]">
                    How verifying your identity works
                  </h2>
                </div>
                <div className=" mt-[30px]">
                  <p className="text-[#8F8F8F] mb-4">
                    To verify your identity, Portions will ask you to scan a
                    government-level ID (Passport, Driver’s License or National
                    ID).
                  </p>

                  <p className="text-[#8F8F8F] mb-4 font-[500]">
                    For security and compliance, Evolve2p will receive:
                  </p>

                  <ul className="list-disc pl-5 text-[#8F8F8F] mb-4 space-y-2">
                    <li>Verification Status (Approved or Rejected)</li>
                    <li>Your Full Legal Name</li>
                    <li>Your Date of Birth</li>
                    <li>City & Country of Issuance</li>
                    <li>ID Type & Issuing Authority</li>
                    <li>
                      A Secure, Reliable Copy of Your ID (No sensitive details
                      are shared)
                    </li>
                  </ul>
                </div>
                <p className="text-[#8F8F8F] mb-4">
                  This process ensures a safe and trusted trading experience for
                  all users.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default KYCVbd;
