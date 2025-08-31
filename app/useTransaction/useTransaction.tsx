"use client";

import { useState, useEffect } from "react";

export const useTransaction = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const storedUserData = localStorage.getItem("UserData");

  if (!storedUserData) {
    console.error("UserData missing in localStorage");
    setLoading(false);
    return;
  }

  let token = "";
  try {
    const parsedUser = JSON.parse(storedUserData);
    token = parsedUser?.accessToken || "";
  } catch (err) {
    console.error("Failed to parse UserData:", err);
  }

  if (!token) {
    console.error("No token found in UserData");
    setLoading(false);
    return;
  }

  async function fetchTransactions() {
    try {
      const res = await fetch(
        "https://evolve2p-backend.onrender.com/api/get-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ only token
          },
        }
      );

      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }

      const data = await res.json();
      console.log("✅ User fetched:", data);

      const userTransactions = data.transactions || [];
      setTransactions(userTransactions);
      setFilteredTransactions(userTransactions);
    } catch (err) {
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(false);
    }
  }

  fetchTransactions();
}, []);


  // 🔍 Search filtering
  useEffect(() => {
    const results = transactions.filter((transaction) =>
      transaction.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.asset?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.counterparty?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.date?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTransactions(results);
  }, [searchTerm, transactions]);

  return {
    transactions,
    filteredTransactions,
    searchTerm,
    setSearchTerm,
    loading,
  };
};

export default useTransaction;