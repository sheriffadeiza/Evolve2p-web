"use client";

import { useState } from "react";
import Image from "next/image";
import Arrow from "../../../public/Assets/Icons/arrow.svg";
import { useRouter } from "next/navigation";

const UPDATE_PHONE_URL = "https://evolve2p-backend.onrender.com/api/update-user"; 
// ✅ Change ONLY if backend says different

const UpdatePhone = () => {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    setErrorMsg("");
    setLoading(true);

    try {
      const response = await fetch(UPDATE_PHONE_URL, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const isJson = response.headers
        .get("content-type")
        ?.includes("application/json");

      const data = isJson ? await response.json() : { message: "Server returned HTML" };

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update phone");
      }

      router.push("/profile");
    } catch (error: any) {
      setErrorMsg(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen px-5 py-7 bg-white flex flex-col">
      {/* Back / Edit Profile */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => router.back()}
      >
        <Image src={Arrow} alt="arrow" />
        <p className="text-[14px] font-[700]">Edit Profile</p>
      </div>

      <h2 className="mt-6 text-[20px] font-[700]">Update Phone Number</h2>

      {/* Input */}
      <div className="mt-6">
        <label className="text-sm text-gray-600">Phone Number</label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          type="tel"
          placeholder="+234 801 234 5678"
          className="mt-2 w-full border border-gray-300 rounded-lg px-4 py-3 text-[15px] outline-none"
        />
      </div>

      {/* Error */}
      {errorMsg && (
        <p className="text-red-600 text-sm mt-2">{errorMsg}</p>
      )}

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="mt-auto bg-black text-white rounded-lg py-3 text-[15px] font-[600] disabled:opacity-50"
      >
        {loading ? "Updating..." : "Save Changes"}
      </button>
    </div>
  );
}


export default UpdatePhone