"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Check, X } from "lucide-react";

const STORAGE_KEY = "streambro_age_verified";

export default function AgeVerification() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const verified = localStorage.getItem(STORAGE_KEY);
    if (!verified) {
      setShow(true);
    }
  }, []);

  function handleConfirm() {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  }

  function handleDeny() {
    window.location.href = "/";
  }

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop - blur but still see content behind */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-sm animate-fade-up">
        <div className="bg-gray-900 border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-red-500/10 text-center space-y-5">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 text-red-400" />
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-white">Verifikasi Umur</h2>
            <p className="text-gray-400 mt-2 text-sm leading-relaxed">
              Konten ini hanya untuk pengguna berusia <span className="text-red-400 font-semibold">18 tahun ke atas</span>. 
              Apakah kamu sudah berusia 18+?
            </p>
          </div>

          {/* Warning */}
          <div className="p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
            <p className="text-xs text-yellow-400/80">
              Dengan melanjutkan, kamu menyatakan bahwa kamu sudah cukup umur untuk mengakses konten dewasa.
            </p>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDeny}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl font-medium text-sm transition active:scale-95"
            >
              <X className="w-4 h-4" />
              Belum 18+
            </button>
            <button
              onClick={handleConfirm}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm transition active:scale-95 shadow-lg shadow-red-500/25"
            >
              <Check className="w-4 h-4" />
              Ya, Saya 18+
            </button>
          </div>

          {/* Footer note */}
          <p className="text-[10px] text-gray-600">
            Pilihan ini akan diingat di perangkat ini
          </p>
        </div>
      </div>
    </div>
  );
}
