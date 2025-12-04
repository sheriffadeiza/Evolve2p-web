"use client";
import React, { useRef, useState, useEffect } from "react";
import Nav from "../NAV/Nav";
import Settings from "../../components/Settings/Settings";
import Image from "next/image";
import ShieldKey from "../../public/Assets/Evolve2p_Secapp/Profile/elements.svg";
import Arrow_great from "../../public/Assets/Evolve2p_Larrow/arrow-right-01.svg";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import { QRCodeCanvas } from "qrcode.react";
import Copy from "../../public/Assets/Evolve2p_code/elements.svg";
import ModalC from "../../public/Assets/Evolve2p_modalC/elements.png";
import Footer from "../../components/Footer/Footer";

const SetupTwoFA: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [secretKey, setSecretKey] = useState("");
  const [code, setCode] = useState(""); // holds combined 6-digit code string
  const [loading, setLoading] = useState(false);
  const [loadingSecret, setLoadingSecret] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // refs for the 6 input boxes - properly typed
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const toggleModal1 = () => setShowModal((prev) => !prev);
  const toggleModal2 = () => setShowVerifyModal((prev) => !prev);
  const toggleModal3 = () => setShowSuccessModal((prev) => !prev);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  // Generate secret from API
  const generateSecret = async () => {
    setLoadingSecret(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        "https://evolve2p-backend.onrender.com/api/generate-secrete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok && data.secret) {
        setSecretKey(data.secret);
      } else {
        setError(data.message || "Failed to generate secret key.");
      }
    } catch (err) {
      setError("Something went wrong while generating secret.");
      console.error(err);
    } finally {
      setLoadingSecret(false);
    }
  };

  // Copy secret key
  const handleCopy = () => {
    navigator.clipboard.writeText(secretKey || "");
  };

  // Verify secret (send 6-digit token in body as "token", Bearer header set)
  const verifySecret = async () => {
    if (!token) {
      setError("Token is required.");
      return;
    }
    if (code.length !== 6) {
      setError("Token must be 6 digits.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch(
        "https://evolve2p-backend.onrender.com/api/verify-secrete",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ token: code }), // server expects token (6 digits) in body
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess("✅ Two-factor authentication enabled successfully!");
        // clear code inputs
        setCode("");
        setTimeout(() => {
          setShowVerifyModal(false);
          setShowSuccessModal(true);
        }, 900);
      } else {
        setError(data?.message || "The 2FA code you entered is invalid. Please check your authentication app and try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Error verifying code.");
    } finally {
      setLoading(false);
    }
  };

  // helper: split code string into array of length 6 (pads with "")
  const codeArray = Array.from({ length: 6 }, (_, i) => (code[i] ? code[i] : ""));

  // When verifying modal opens, focus first input
  useEffect(() => {
    if (showVerifyModal) {
      setTimeout(() => {
        inputsRef.current[0]?.focus();
      }, 50);
    }
  }, [showVerifyModal]);

  // Proper ref callback function
  const setInputRef = (index: number) => (el: HTMLInputElement | null) => {
    inputsRef.current[index] = el;
  };

  // handle individual input change: auto-advance
  const handleDigitChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, ""); // keep digits only
    if (!val && code[index]) {
      // user cleared current box by typing non-digit; update code
      const newCode = code.split("");
      newCode[index] = "";
      setCode(newCode.join("").slice(0, 6));
      return;
    }
    if (val) {
      // Only take the last digit entered (in case of multi-char)
      const digit = val.slice(-1);
      const newCodeArr = code.split("");
      // ensure array has 6 items
      while (newCodeArr.length < 6) newCodeArr.push("");
      newCodeArr[index] = digit;
      const newCodeStr = newCodeArr.join("").slice(0, 6);
      setCode(newCodeStr);
      // move focus to next input
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    }
  };

  // handle key down for backspace navigation
  const handleKeyDown = (index: number) => (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      e.preventDefault(); // manage behavior manually
      const newCodeArr = code.split("");
      // if current has a digit, clear it and stay
      if (newCodeArr[index]) {
        newCodeArr[index] = "";
        setCode(newCodeArr.join("").slice(0, 6));
        inputsRef.current[index]?.focus();
        return;
      }
      // else move to previous and clear it
      if (index > 0) {
        newCodeArr[index - 1] = "";
        setCode(newCodeArr.join("").slice(0, 6));
        inputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft") {
      if (index > 0) inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight") {
      if (index < 5) inputsRef.current[index + 1]?.focus();
    }
  };

  // handle paste into any of the boxes - if 6-digit pasted, fill all
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const paste = e.clipboardData.getData("text").trim();
    const digits = paste.replace(/\D/g, "");
    if (digits.length >= 6) {
      const six = digits.slice(0, 6);
      setCode(six);
      // focus last box
      setTimeout(() => inputsRef.current[5]?.focus(), 50);
    } else if (digits.length > 0) {
      // insert as many digits as provided starting from focused input
      const active = document.activeElement as HTMLInputElement | null;
      const idx = inputsRef.current.findIndex((el) => el === active);
      const arr = code.split("");
      while (arr.length < 6) arr.push("");
      let pointer = idx >= 0 ? idx : 0;
      for (let i = 0; i < digits.length && pointer < 6; i++, pointer++) {
        arr[pointer] = digits[i];
      }
      setCode(arr.join("").slice(0, 6));
      setTimeout(() => {
        const nextFocus = Math.min(pointer, 5);
        inputsRef.current[nextFocus]?.focus();
      }, 50);
    }
    e.preventDefault();
  };

  return (
    <main className="min-h-screen bg-[#0F1012] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        <Nav />

        <div className="flex flex-col lg:flex-row gap-6 mt-6">
          {/* Settings Sidebar */}
          <div className="lg:w-64">
            <Settings />
          </div>

          {/* Main Content */}
          <div className="flex-1 bg-[#1A1A1A] rounded-xl p-4 lg:p-6">
            <p className="text-xl lg:text-2xl font-bold text-white mb-4">
              Two Factor Authentication
            </p>

            <div className="flex flex-col p-4 lg:p-6">
              <p className="text-lg lg:text-xl font-bold text-white mb-6">
                Choose Your 2FA Method
              </p>

              <p className="text-sm lg:text-base text-[#C7C7C7] font-normal">
                Select how you want to receive your verification codes.
              </p>
            </div>

            <div className="space-y-4 p-4">
              {/* Security App Option */}
              <div
                onClick={() => {
                  setShowModal(true);
                  generateSecret();
                }}
                className="flex justify-between w-full p-4 items-center bg-[#222222] rounded-lg cursor-pointer hover:bg-[#2E2E2E] transition border border-transparent hover:border-[#3A3A3A]"
              >
                <div className="flex items-center gap-4">
                  <Image src={ShieldKey} alt="icon" className="w-5 h-5 lg:w-6 lg:h-6" />
                  <div className="flex flex-col">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className="text-base lg:text-lg font-semibold text-white">
                        Security App
                      </p>
                      <div className="flex items-center justify-center w-fit px-3 h-6 bg-[#23303C] rounded-2xl">
                        <p className="text-[#66B9FF] font-medium text-xs">
                          Recommended
                        </p>
                      </div>
                    </div>
                    <p className="text-xs lg:text-sm font-medium text-[#DBDBDB] mt-1">
                      Use an authenticator app like Authy or Google Authenticator.
                    </p>
                  </div>
                </div>
                <Image src={Arrow_great} alt="arrowgreat" className="w-4 h-4 lg:w-5 lg:h-5" />
              </div>
            </div>
          </div>
        </div>

         <div className="w-[100%]  h-[1px] bg-[#fff] mt-[50%] opacity-20 my-8"></div>
        
                <div className=" mb-[80px] mt-[10%] ">
                  <Footer />
                </div>
      </div>

      {/* ====================== MODAL 1: GENERATE SECRET ====================== */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-4 lg:p-8 w-full max-w-lg lg:max-w-2xl max-h-[90vh] overflow-y-auto relative shadow-xl border border-[#2E2E2E]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg lg:text-xl font-bold text-white">
                Enable 2FA
              </h2>
              <Image
                src={Times}
                alt="close"
                className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer hover:opacity-70 transition"
                onClick={toggleModal1}
              />
            </div>

            <div className="mb-4">
              <p className="text-xl lg:text-2xl font-bold text-white">
                Enable security app
              </p>
            </div>

            <p className="text-[#C7C7C7] text-sm lg:text-base mb-6">
              To enable 2FA, you will have to install an authenticator app on
              your phone and scan the QR code below to add Evolve2P.
            </p>

            {loadingSecret ? (
              <div className="flex justify-center my-8">
                <p className="text-[#C7C7C7] text-sm lg:text-base animate-pulse">
                  Generating secret key...
                </p>
              </div>
            ) : secretKey ? (
              <>
                {/* QR Code */}
                <div className="flex justify-center my-6">
                  <QRCodeCanvas
                    value={`otpauth://totp/Evolve2P?secret=${secretKey}&issuer=Evolve2P`}
                    size={180}
                    className="w-40 h-40 lg:w-52 lg:h-52"
                    bgColor="#3A3A3A"
                    fgColor="#FFFFFF"
                    level="H"
                    includeMargin
                  />
                </div>

                <p className="text-sm lg:text-base font-medium text-[#DBDBDB] mb-3">
                  Can't scan the QR code? Configure your app with this key
                </p>

                {/* Secret Key */}
                <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#222222] rounded-lg p-4 mb-6">
                  <span className="text-white text-sm lg:text-base font-medium break-all flex-1 text-center sm:text-left">
                    {secretKey}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 w-full sm:w-auto px-4 h-10 bg-[#2D2D2D] rounded-full border-none text-[#4DF2BE] text-sm font-semibold hover:bg-[#3A3A3A] transition"
                  >
                    <Image src={Copy} alt="copy" className="w-4 h-4" />
                    Copy
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setShowVerifyModal(true);
                    setCode("");
                    setError("");
                    setSuccess("");
                  }}
                  className="w-full h-12 bg-[#4DF2BE] border-none rounded-full text-black font-semibold hover:bg-[#3fe0ad] transition text-sm lg:text-base"
                >
                  Continue
                </button>
              </>
            ) : (
              <p className="text-red-500 text-center text-sm lg:text-base">Failed to load secret.</p>
            )}
          </div>
        </div>
      )}

      {/* ====================== MODAL 2: VERIFY 6-DIGIT CODE ====================== */}
      {showVerifyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-4 lg:p-8 w-full max-w-lg lg:max-w-2xl relative shadow-xl border border-[#2E2E2E]">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <p className="text-lg lg:text-xl font-bold text-white">
                Enable security app
              </p>
              <Image
                src={Times}
                alt="close"
                className="w-6 h-6 lg:w-8 lg:h-8 cursor-pointer hover:opacity-70 transition"
                onClick={toggleModal2}
              />
            </div>

            <h2 className="text-xl lg:text-2xl text-white font-bold mb-3 text-center">
              Enter Your 6-Digit Code
            </h2>
            <p className="text-[#C7C7C7] text-sm lg:text-base mb-6 text-center">
              Enter the code from your security app to complete setup.
            </p>

            {/* Code Inputs */}
            <div className="flex justify-center gap-2 lg:gap-3 mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <React.Fragment key={i}>
                  <input
                    ref={setInputRef(i)} 
                    maxLength={1}
                    type="text"
                    inputMode="numeric"
                    value={codeArray[i] || ""}
                    onChange={handleDigitChange(i)}
                    onKeyDown={handleKeyDown(i)}
                    onPaste={handlePaste}
                    className="w-12 h-12 lg:w-14 lg:h-14 text-center bg-[#222222] border-2 border-transparent rounded-lg text-base lg:text-lg font-medium text-white focus:outline-none focus:border-[#00735A] focus:ring-2 focus:ring-[#00735A] transition"
                  />
                  {i === 2 && (
                    <span className="text-[#C7C7C7] text-xl lg:text-2xl font-bold mx-1 lg:mx-2 flex items-center">
                      -
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Messages */}
            {error && (
              <p className="text-red-400 text-sm lg:text-base text-center mb-4">{error}</p>
            )}
            {success && (
              <p className="text-green-400 text-sm lg:text-base text-center mb-4">
                {success}
              </p>
            )}

            <button
              onClick={verifySecret}
              disabled={loading}
              className="w-full h-12 bg-[#00735A] border-none rounded-full font-semibold text-white hover:bg-[#009067] transition flex items-center justify-center text-sm lg:text-base disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="loader w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Verify & Enable"
              )}
            </button>
          </div>
        </div>
      )}

      {/* ====================== MODAL 3: SUCCESS ====================== */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
          <div className="bg-[#1A1A1A] rounded-2xl p-6 lg:p-8 w-full max-w-md text-center relative shadow-xl border border-[#2E2E2E]">
            <Image
              src={ModalC}
              alt="success"
              className="w-16 h-16 lg:w-20 lg:h-20 mx-auto mb-4"
            />
            <h2 className="text-xl lg:text-2xl font-bold mb-3 text-white">
              Two-Factor Authentication Enabled!
            </h2>
            <p className="text-[#C7C7C7] text-sm lg:text-base mb-6">
              Your account is now protected with two-factor authentication.
            </p>
            <button
              onClick={toggleModal3}
              className="w-full max-w-xs h-12 bg-[#4DF2BE] border-none rounded-full text-black font-semibold hover:bg-[#3fe0ad] transition text-sm lg:text-base mx-auto"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============= Custom Loader Styles ============= */}
      <style jsx global>{`
        .loader {
          width: 24px;
          height: 24px;
          border: 2px solid #ffffff;
          border-top: 2px solid transparent;
          border-radius: 50%;
          animation: spin 1s linear infinite;
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
    </main>
  );
};

export default SetupTwoFA;