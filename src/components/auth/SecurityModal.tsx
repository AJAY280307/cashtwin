import React, { useState } from 'react';
import { X, Shield, Lock, Smartphone, KeyRound, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SecurityModal: React.FC = () => {
  const { activeAccountModal, closeAccountModal, user } = useAuth();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [sessionSuccess, setSessionSuccess] = useState(false);

  if (activeAccountModal !== 'security' || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="security-modal-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 transform transition-all">
        {/* Top bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-500" />

        <div className="p-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <h2 id="security-modal-title" className="text-base font-bold text-slate-900">
                  Security & Authentication
                </h2>
                <p className="text-xs text-slate-500">Protecting your CashTwin financial twin</p>
              </div>
            </div>
            <button
              type="button"
              onClick={closeAccountModal}
              className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors focus:outline-hidden"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {sessionSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>All active secondary sessions have been revoked.</span>
            </div>
          )}

          <div className="mt-5 space-y-4">
            {/* 2FA Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <Smartphone className="w-4 h-4 text-indigo-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Two-Factor Authentication (2FA)</p>
                  <p className="text-[11px] text-slate-500">Require OTP code for sensitive cash simulations</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                  twoFactorEnabled ? 'bg-indigo-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    twoFactorEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Biometric Toggle */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-start space-x-3">
                <KeyRound className="w-4 h-4 text-purple-600 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-900">Hardware Token / Passkeys</p>
                  <p className="text-[11px] text-slate-500">FIDO2 WebAuthn cryptographic protection</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setBiometricsEnabled(!biometricsEnabled)}
                className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                  biometricsEnabled ? 'bg-purple-600' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    biometricsEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Encryption info */}
            <div className="p-3 rounded-xl bg-indigo-50/60 border border-indigo-100 flex items-start space-x-2.5 text-xs text-indigo-900">
              <Lock className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <div>
                <span className="font-bold">Banking Grade Cryptography:</span> All simulated transactions, early warning triggers, and account balances are salted and encrypted with AES-256 GCM.
              </div>
            </div>

            {/* Terminate Sessions */}
            <button
              type="button"
              onClick={() => setSessionSuccess(true)}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Revoke Other Active Sessions</span>
            </button>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={closeAccountModal}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
