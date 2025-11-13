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

  // refs for the 6 input boxes
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

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
    <main className="min-h-screen bg-[#0F1012] pr-[10px] mt-[30px] pl-[30px] text-white md:p-8">
      <div className="max-w-7xl mx-auto">
        <Nav />

        <div className="flex items-start mt-[20px] mr-[40px]">
          <Settings />

          <div className="w-[809px] h-[865px] bg-[#1A1A1A] p-[24px_64px] rounded-[10px]">
            <p className="text-[24px] font-[700] text-[#FFFFFF] mb-[10px]">
              Two Factor Authentication
            </p>

            <div className="flex flex-col p-[24px_20px]">
              <p className="text-[20px]  font-[700] text-[#FFFFFF] mb-[40px]">
                Choose Your 2FA Method
              </p>

              <p className="text-[16px] mt-[-30px] text-[#C7C7C7] font-[400]">
                Select how you want to receive your verification codes.
              </p>
            </div>

            <div className="space-y-[20px] p-[0px_20px]">
              {/* Security App Option */}
              <div
                onClick={() => {
                  setShowModal(true);
                  generateSecret();
                }}
                className="flex justify-between w-[641px] h-[64px] p-[12px] items-center bg-[#222222] p-[20px] rounded-[8px] cursor-pointer hover:bg-[#2E2E2E] transition"
              >
                <div className="flex items-center gap-[16px]">
                  <Image src={ShieldKey} alt="icon" width={16} height={16} />
                  <div className="flex flex-col">
                    <div className="flex items-center gap-[10px]">
                      <p className="text-[16px] font-[600] text-[#FFFFFF]">
                        Security App
                      </p>
                      <div className="flex items-center justify-center w-[98px] h-[22px] bg-[#23303C] rounded-[16px] p-[2px_8px]">
                        <p className="text-[#66B9FF] font-[500] text-[12px]">
                          Recommended
                        </p>
                      </div>
                    </div>
                    <p className="text-[12px] mt-[-5px] font-[500] text-[#DBDBDB]">
                      Use an authenticator app like Authy or Google Authenticator.
                    </p>
                  </div>
                </div>
                <Image src={Arrow_great} alt="arrowgreat" />
              </div>
            </div>
          </div>
        </div>

        <div className="w-[106%] ml-[-5%] h-[1px] bg-[#fff] mt-[10%] opacity-20 my-8"></div>

        <div className="mb-[80px] mt-[30%]">
          <Footer />
        </div>
      </div>

      {/* ====================== MODAL 1: GENERATE SECRET ====================== */}
      {showModal && (
        <div className="fixed inset-0 top-[100px] ml-[30%] bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#1A1A1A] rounded-[16px] p-[32px] w-[560px] max-h-[65vh] overflow-y-auto scrollbar-thin scrollbar-thumb-[#DBDBDB] scrollbar-track-[#2D2D2D] relative shadow-xl border border-[#2E2E2E]">
            <div className="flex items-center ">
              <h2 className="text-[16px] font-[700] text-[#FFFFFF] mb-[8px]">
                Enable 2FA
              </h2>

              <p>
                <Image
                  src={Times}
                  alt={"times"}
                  width={10}
                  height={10}
                  className="absolute top-[35px] w-[32px] h-[32px] ml-[60%] cursor-pointer"
                  onClick={toggleModal1}
                />
              </p>
            </div>

            <div className="mt-[60px]">
              <p className="text-[24px] font-[700] text-[#FFFFFF]">
                Enable security app
              </p>
            </div>

            <p className="text-[#C7C7C7] text-[14px] mb-[24px]">
              To enable 2FA, you will have to install an authenticator app on
              your phone <br />
              and scan the QR code below to add Evolve2P.
            </p>

            {loadingSecret ? (
              <div className="flex justify-center mt-[40px] mb-[16px]">
                <p className="text-[#C7C7C7] text-[14px] animate-pulse">
                  Generating secret key...
                </p>
              </div>
            ) : secretKey ? (
              <>
                <div className="flex justify-center mt-[30px] mb-[16px]">
                  <QRCodeCanvas
                    value={`otpauth://totp/Evolve2P?secret=${secretKey}&issuer=Evolve2P`}
                    size={206}
                    bgColor="#3A3A3A"
                    fgColor="#FFFFFF"
                    level="H"
                    includeMargin
                  />
                </div>

                <p className="text-[14px] font-[500] text-[#DBDBDB] mb-[8px]">
                  Can’t scan the QR code? Configure your app with this key
                </p>

                <div className="flex items-center mt-[20px] w-[496px] h-[56px] justify-between bg-[#222222] rounded-[8px] p-[8px_8px_8px_16px] mb-[24px]">
                  <span className="text-[#FFFFFF] text-[14px] font-[500] break-all">
                    {secretKey}
                  </span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-[10px] w-[88px] h-[36px] bg-[#2D2D2D] p-[8px_14px] rounded-full border-none text-[#4DF2BE] text-[14px] font-[600]"
                  >
                    <Image src={Copy} alt="copy" />
                    Copy
                  </button>
                </div>

                <button
                  onClick={() => {
                    setShowModal(false);
                    setShowVerifyModal(true);
                    // ensure code cleared on opening verify modal
                    setCode("");
                    setError("");
                    setSuccess("");
                  }}
                  className="w-[478px] h-[48px] bg-[#4DF2BE] ml-[30px] border-none rounded-full p-[12px_20px] text-[#000] font-[600] hover:bg-[#3fe0ad] transition"
                >
                  Continue
                </button>
              </>
            ) : (
              <p className="text-red-500 text-center">Failed to load secret.</p>
            )}
          </div>
        </div>
      )}

      {/* ====================== MODAL 2: VERIFY 6-DIGIT CODE ====================== */}
      {showVerifyModal && (
        <div className="fixed inset-0 top-[80px]  ml-[500px] bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#1A1A1A] rounded-[16px] p-[32px] w-[560px] h-[450px] relative shadow-xl border border-[#2E2E2E]">
            <div className="flex items-center ">
              <p className="text-[16px] font-[700] text-[#FFFFFF]">
                Enable security app
              </p>

              <p>
                <Image
                  src={Times}
                  alt={"times"}
                  width={10}
                  height={10}
                  className="absolute top-[35px] w-[32px] h-[32px] ml-[60%] cursor-pointer"
                  onClick={toggleModal2}
                />
              </p>
            </div>

            <h2 className="text-[24px] mt-[50px] text-[#FFFFFF] font-[700] mb-[8px] text-center">
              Enter Your 6-Digit Code
            </h2>
            <p className="text-[#C7C7C7] text-[14px] mb-[24px] text-center">
              Enter the code from your security app to complete setup.
            </p>

            <div className="flex justify-center mt-[50px] space-x-[10px] mb-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <React.Fragment key={i}>
                  <input
                    ref={(el) => (inputsRef.current[i] = el)}
                    maxLength={1}
                    type="text"
                    inputMode="numeric"
                    value={codeArray[i] || ""}
                    onChange={handleDigitChange(i)}
                    onKeyDown={handleKeyDown(i)}
                    onPaste={handlePaste}
                    className="w-[66.83334px] h-[56px] p-[8px] text-center bg-[#222222] border-none rounded-[12px] text-[14px] font-[500] text-[#FFFFFF] focus:outline-none focus:ring-2 focus:ring-[#00735A]"
                  />
                  {i === 2 && (
                    <span className="text-[#C7C7C7] text-[28px] mt-[25px] font-bold mx-[6px]">
                      -
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>

            {error && (
              <p className="text-[#FFFFFF] text-sm text-center mb-3">{error}</p>
            )}
            {success && (
              <p className="text-[#FFFFFF] text-sm text-center mb-3">
                {success}
              </p>
            )}

            <button
              onClick={verifySecret}
              disabled={loading}
              className="w-[496px] ml-[30px] h-[48px] p-[12px_20px] bg-[#00735A] border-none mt-[50px] hover:bg-[#009067] rounded-full font-semibold mt-2 flex items-center justify-center"
            >
              {loading ? <div className="loader" /> : "Verify & Enable"}
            </button>
          </div>
        </div>
      )}

      {/* ====================== MODAL 3: SUCCESS ====================== */}
      {showSuccessModal && (
        <div className="fixed inset-0 top-[200px] ml-[500px] bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-[#1A1A1A] rounded-[16px] p-[32px] w-[480px] text-center relative shadow-xl border border-[#2E2E2E]">
            <Image
              src={ModalC}
              alt="success"
              width={80}
              height={80}
              className="mx-auto mb-6"
            />
            <h2 className="text-[24px] font-[700] mb-[8px] text-[#FFFFFF]">
              Two-Factor Authentication Enabled!
            </h2>
            <p className="text-[#C7C7C7] text-[14px] mb-[24px]">
              Your account is now protected with two-factor authentication.
            </p>
            <button
              onClick={toggleModal3}
              className="w-[300px] h-[48px] bg-[#4DF2BE] border-none rounded-full text-[#000] font-[600] hover:bg-[#3fe0ad] transition"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ============= Custom Loader ============= */}
      <style jsx global>{`
        .loader {
          width: 30px;
          height: 30px;
          position: relative;
        }
        .loader::after {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 70%;
          height: 70%;
          border: 5px solid #333333;
          border-top-color: #4df2be;
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
