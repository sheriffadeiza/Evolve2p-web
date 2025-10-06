import React from "react";
import Header from "../../../components/Signup/SignupEmail/Header";
import Lverifynav from "@/components/Login/LoginVerify/Lverifynav";
import Lverifybd from "@/components/Login/LoginVerify/Lverifybd";

const page = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F1012]">
      {/* Header Section */}
      <Header />

      {/* Main Content */}
      <div className="border-2 border-red-500">
        <Lverifynav />
        <Lverifybd />
      </div>
    </div>
  );
};

export default page;
