import React from 'react';
import { X, User, Mail, Phone, Calendar, ShieldCheck, TrendingUp, Briefcase, Target, Award } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UserProfileModal: React.FC = () => {
  const { activeAccountModal, closeAccountModal, user } = useAuth();

  if (activeAccountModal !== 'profile' || !user) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-profile-title"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden my-8 transform transition-all">
        {/* Top gradient header */}
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 px-6 pt-6 pb-12 text-white relative">
          <button
            type="button"
            onClick={closeAccountModal}
            className="absolute top-4 right-4 p-1.5 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-colors focus:outline-hidden"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-2 text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">
            <User className="w-3.5 h-3.5" />
            <span>Digital Twin Identity</span>
          </div>
          <h2 id="user-profile-title" className="text-xl font-bold tracking-tight">
            Customer Profile
          </h2>
          <p className="text-xs text-indigo-100">
            Authenticated financial digital twin details & verification status
          </p>
        </div>

        {/* Floating Avatar */}
        <div className="px-6 -mt-8 relative z-10 flex items-end justify-between">
          <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-2xl font-black shadow-lg border-4 border-white ring-1 ring-slate-200">
            {user.avatarLetter}
          </div>
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-amber-500 mr-1.5 animate-pulse" />
            <span>Status: {user.healthStatus}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 pt-4 space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 leading-tight">{user.name}</h3>
            <p className="text-xs text-slate-400 font-mono mt-0.5">Account {user.accountNumber}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Email Address</span>
              </div>
              <p className="text-xs font-bold text-slate-800 truncate">{user.email}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                <Phone className="w-3.5 h-3.5" />
                <span>Mobile</span>
              </div>
              <p className="text-xs font-bold text-slate-800">{user.mobileNumber || '+91 98765 43210'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date of Birth</span>
              </div>
              <p className="text-xs font-bold text-slate-800">{user.dob || '15 Jul 1992'}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center space-x-2 text-slate-400 text-xs mb-1">
                <Briefcase className="w-3.5 h-3.5" />
                <span>Employment</span>
              </div>
              <p className="text-xs font-bold text-slate-800 truncate">{user.employmentType || 'Salaried'}</p>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-purple-50/70 border border-purple-100">
            <div className="flex items-center space-x-2 text-purple-700 text-xs font-semibold mb-1">
              <Target className="w-3.5 h-3.5" />
              <span>Primary Financial Priority</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{user.primaryGoal || 'Build Emergency Fund'}</p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Income Range: <span className="font-semibold text-slate-700">{user.monthlyIncomeRange || '₹40,000 - ₹75,000'}</span>
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-medium">KYC Compliant Tier 1</span>
            </div>
            <span>Joined: {user.joinedDate || 'Active'}</span>
          </div>

          <button
            type="button"
            onClick={closeAccountModal}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
