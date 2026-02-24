"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Settings from "../../components/Settings/Settings";
import Times from "../../public/Assets/Evolve2p_times/Icon container.png";
import G19 from "../../public/Assets/Evolve2p_group19/Group 19.svg";

// ---------- Add Payment Method Modal (dynamic from API) ----------
const AddPaymentMethodModal = ({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const [paymentMethodTypes, setPaymentMethodTypes] = useState<any[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [fetchError, setFetchError] = useState("");

  const [selectedTypeId, setSelectedTypeId] = useState("");
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Fetch available payment method types when modal opens
  useEffect(() => {
    if (!isOpen) return;

    const fetchTypes = async () => {
      setLoadingTypes(true);
      setFetchError("");
      try {
        const stored = localStorage.getItem("UserData");
        const token = stored ? JSON.parse(stored)?.accessToken : null;
        if (!token) throw new Error("Not authenticated");

        const res = await fetch(
          "https://evolve2p-backend.onrender.com/api/get-payment-methods",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load payment methods");
        setPaymentMethodTypes(data.data || []);
      } catch (err: any) {
        setFetchError(err.message);
      } finally {
        setLoadingTypes(false);
      }
    };

    fetchTypes();
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedTypeId("");
      setFieldValues({});
      setSaveError("");
    }
  }, [isOpen]);

  const selectedType = paymentMethodTypes.find((t) => t.id === selectedTypeId);

  const handleFieldChange = (fieldName: string, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const allFieldsFilled = () => {
    if (!selectedType) return false;
    return selectedType.fields.every((field: string) =>
      fieldValues[field]?.trim()
    );
  };

  // ---------- SAVE API CALL ----------
  const handleSave = async () => {
    if (!selectedType || !allFieldsFilled()) return;

    setSaving(true);
    setSaveError("");

    try {
      const stored = localStorage.getItem("UserData");
      const token = stored ? JSON.parse(stored)?.accessToken : null;
      if (!token) throw new Error("Not authenticated");

      const payload = {
        typeId: selectedType.id,
        details: fieldValues,
      };

      const res = await fetch(
        "https://evolve2p-backend.onrender.com/api/create-payment-method",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Failed to save payment method");
      }

      // Notify parent to refresh the list
      onSuccess();
      onClose();
    } catch (err: any) {
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-[#1F1F1F] rounded-2xl p-6 w-full max-w-md relative shadow-xl border border-[#2E2E2E] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-[#FCFCFC]">Add Payment Method</h3>
          <button
            onClick={onClose}
            className="w-6 h-6 rounded-full bg-[#2D2D2D] flex items-center justify-center hover:bg-[#3A3A3A] transition-colors"
          >
            <Image src={Times} alt="close" width={16} height={16} className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[#8F8F8F] text-sm mb-4">
          Manage the payment methods buyers use to pay you during trades.
        </p>

        {loadingTypes && (
          <div className="text-center py-6">
            <div className="w-8 h-8 mx-auto border-2 border-[#4DF2BE] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#aaa] text-sm mt-2">Loading payment types...</p>
          </div>
        )}
        {fetchError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{fetchError}</p>
          </div>
        )}

        {!loadingTypes && !fetchError && (
          <>
            {/* Payment Type Dropdown */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#8F8F8F] mb-1">
                Payment Type
              </label>
              <select
                value={selectedTypeId}
                onChange={(e) => {
                  setSelectedTypeId(e.target.value);
                  setFieldValues({});
                }}
                className="w-full bg-[#2D2D2D] text-[#FCFCFC] px-4 py-3 rounded-lg border border-[#3A3A3A] focus:outline-none focus:border-[#4DF2BE]"
              >
                <option value="">Select payment type</option>
                {paymentMethodTypes.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Fields */}
            {selectedType && (
              <div className="space-y-4 mb-6">
                {selectedType.fields.map((field: string) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-[#8F8F8F] mb-1">
                      {field}
                    </label>
                    <input
                      type="text"
                      value={fieldValues[field] || ""}
                      onChange={(e) => handleFieldChange(field, e.target.value)}
                      placeholder={`Enter ${field.toLowerCase()}`}
                      className="w-full bg-[#2D2D2D] text-[#FCFCFC] px-4 py-3 rounded-lg border border-[#3A3A3A] focus:outline-none focus:border-[#4DF2BE]"
                    />
                  </div>
                ))}
              </div>
            )}

            {saveError && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm">{saveError}</p>
              </div>
            )}

            <div className="flex gap-3 mt-6">
              <button
                onClick={onClose}
                className="flex-1 bg-[#2D2D2D] text-white font-bold px-4 py-3 rounded-full hover:bg-[#3A3A3A] transition-colors"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!selectedType || !allFieldsFilled() || saving}
                className="flex-1 bg-[#4DF2BE] text-[#0F1012] font-bold px-4 py-3 rounded-full hover:bg-[#3DD2A5] transition-colors disabled:opacity-50 flex items-center justify-center"
              >
                {saving ? (
                  <div className="w-5 h-5 border-2 border-[#0F1012] border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  "Save Payment Method"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ---------- Success Modal ----------
const SuccessModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4">
      <div className="bg-[#1F1F1F] rounded-2xl p-6 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-[#4DF2BE] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 12L10 17L19 8"
              stroke="#0F1012"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[#FCFCFC] mb-2">Payment Method Added!</h3>
        <p className="text-[#aaa] mb-6">Your payment method has been successfully added.</p>
        <button
          onClick={onClose}
          className="w-full bg-[#4DF2BE] text-[#0F1012] font-bold px-4 py-3 rounded-full hover:bg-[#3DD2A5] transition-colors"
        >
          Done
        </button>
      </div>
    </div>
  );
};

// ---------- Main Payment Methods Component ----------
const Paymeth = () => {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch user's payment methods
  const fetchUserPaymentMethods = async () => {
    setLoading(true);
    setFetchError("");
    try {
      const stored = localStorage.getItem("UserData");
      const token = stored ? JSON.parse(stored)?.accessToken : null;
      if (!token) throw new Error("Not authenticated");

      const res = await fetch(
        "https://evolve2p-backend.onrender.com/api/get-user-payment-methods",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to load your payment methods");
      setPaymentMethods(data.data || []);
    } catch (err: any) {
      setFetchError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchUserPaymentMethods();
  }, []);

  // After adding a new method, refresh the list
  const handleAddSuccess = () => {
    fetchUserPaymentMethods();
    setShowSuccess(true);
  };

  // Helper to display method details nicely
  const renderMethodDetails = (method: any) => {
    const typeName = method.type?.name || "Unknown";
    const details = method.details || {};
    return (
      <div>
        <p className="text-white font-medium">{typeName}</p>
        {Object.entries(details).map(([key, value]) => (
          <p key={key} className="text-sm text-[#8F8F8F]">
            {key}: {String(value)}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 mt-6 lg:mt-8">
      {/* Main Content */}
      <div className="flex-1 bg-[#1A1A1A] rounded-xl p-4 lg:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <p className="text-xl lg:text-2xl font-bold text-white">Payment Methods</p>
        </div>

        <p className="text-[#8F8F8F] text-sm mb-6">
          Manage the payment method buyers use to pay you during trades.
        </p>

        {loading && (
          <div className="text-center py-12">
            <div className="w-8 h-8 mx-auto border-2 border-[#4DF2BE] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[#aaa] mt-4">Loading your payment methods...</p>
          </div>
        )}

        {!loading && fetchError && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
            <p className="text-red-400 text-sm">{fetchError}</p>
          </div>
        )}

        {!loading && !fetchError && paymentMethods.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 sm:py-12 bg-[#222222] rounded-lg">
            <Image
              src={G19}
              alt="No payment methods"
              width={120}
              height={120}
              className="w-20 h-20 sm:w-24 sm:h-24 mb-4"
            />
            <p className="text-[#aaa] text-lg mb-4">You haven’t added any payment method yet.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-[#4DF2BE] text-[#0F1012] font-bold px-6 py-3 rounded-full hover:bg-[#3DD2A5] transition-colors"
            >
              Add Payment Method
            </button>
          </div>
        ) : !loading && !fetchError && paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map((method) => (
              <div
                key={method.id}
                className="bg-[#222222] p-4 rounded-lg flex justify-between items-center"
              >
                <div>{renderMethodDetails(method)}</div>
                <button className="text-[#FE857D] text-sm hover:underline">
                  Remove
                </button>
              </div>
            ))}
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full mt-4 bg-[#2D2D2D] text-[#4DF2BE] font-bold px-6 py-3 rounded-full hover:bg-[#3A3A3A] transition-colors"
            >
              Add Payment Method
            </button>
          </div>
        ) : null}
      </div>

      {/* Modals */}
      <AddPaymentMethodModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
      <SuccessModal isOpen={showSuccess} onClose={() => setShowSuccess(false)} />
    </div>
  );
};

export default Paymeth;