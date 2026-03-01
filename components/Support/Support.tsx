"use client";

import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "@/config";
// Import your existing Nav and Footer components – adjust the paths as needed
import Nav from "../../components/NAV/Nav";
import Footer from "../../components/Footer/Footer";

const Supportbd: React.FC = () => {
  const [supportEmail, setSupportEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSupportEmail = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/admin/settings`);
        if (!res.ok) throw new Error("Failed to load settings");
        const data = await res.json();
        // Assuming the endpoint returns an object with a supportEmail field
        setSupportEmail(data.supportEmail || "support@evolve2p.com");
      } catch (err) {
        setError("Could not load support information.");
        // Fallback email in case of error
        setSupportEmail("support@evolve2p.com");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSupportEmail();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <Nav />
     
      <main className="flex-grow flex items-center justify-center mt-[170px] ">
        <div className="w-full max-w-md mx-auto p-4  text-white text-center">
          <h1 className="text-2xl text-[#FCFCFC] font-bold mb-4">
            Evolve2p Support
          </h1>
          <p className="text-base font-normal text-[#8F8F8F] mb-2">
            For any questions or assistance, please contact us at:
          </p>

          {isLoading ? (
            <div className="flex justify-center my-4">
              <div className="loader"></div>
            </div>
          ) : (
            <a
              href={`mailto:${supportEmail}`}
              className="text-[#4DF2BE] text-lg font-semibold underline hover:text-[#3dd0a3] transition-colors break-all"
            >
              {supportEmail}
            </a>
          )}

          {error && <p className="text-[#F5918A] text-sm mt-2">{error}</p>}

          <p className="text-sm font-normal text-[#8F8F8F] mt-4">
            Tap the email above to send us a message.
          </p>
        </div>
      </main>
       <div className="w-full h-[1px] bg-[#fff] mt-[20%] md:mt-[30%] opacity-20 my-8" />
      <div className="mb-[80px] whitespace-nowrap mt-[10%]">
        <Footer />
      </div>
      </div>
    </div>
  );
};

export default Supportbd;