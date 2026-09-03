import React, { useState, useRef, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { useAuth } from '../../context/AuthContext';
import { CustomerSelector } from './CustomerSelector';
import {
  Bell,
  Menu,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  Eye,
  Bot,
  LogIn,
  UserPlus,
  User,
  BarChart2,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/logo.png';

interface HeaderProps {
  title: string;
  subtitle: string;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onOpenMobileMenu }) => {
  const {
    selectedCustomer,
    notifications,
    markNotificationsAsRead,
    accessibility,
    updateAccessibility,
    activeAlerts,
    setIsMitraOpen,
    setIsSettingsOpen,
  } = useCustomer();

  const {
    isAuthenticated,
    user,
    openSignIn,
    openSignUp,
    logout,
    openProfileModal,
    openSecurityModal,
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeAlertCount = activeAlerts.filter((a) => !a.dismissed).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-3 sm:px-8 py-3 flex items-center justify-between">
      {/* Left: Mobile menu toggle + Page Headings */}
      <div className="flex items-center space-x-2.5 sm:space-x-4">
        <button
          type="button"
          id="open-mobile-menu-btn"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200/80 p-0.5 bg-white shrink-0 lg:hidden shadow-2xs">
          <img src={logoImg} alt="CashTwin" className="w-full h-full object-contain" />
        </div>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight font-sans">
              {title}
            </h1>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Resilience Monitor
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium line-clamp-1 mt-0.5">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Actions, Notifications, & Authentication/User Profile */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5">
        {/* Customer Selector in Header */}
        <div className="hidden lg:block">
          <CustomerSelector variant="header" />
        </div>

        {/* Quick Accessibility Mode Toggle */}
        <button
          type="button"
          id="quick-accessibility-toggle-btn"
          onClick={() =>
            updateAccessibility({
              highContrast: !accessibility.highContrast,
              largerText: !accessibility.largerText,
            })
          }
          className={`p-2 rounded-lg border transition-colors flex items-center space-x-1 cursor-pointer ${
            accessibility.highContrast || accessibility.largerText
              ? 'bg-indigo-600 text-white border-indigo-700 font-bold'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100 border-slate-200'
          }`}
          title="Toggle High Contrast & Large Text Accessibility Mode"
          aria-label="Toggle Accessibility Mode"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden xl:inline text-[11px] font-semibold">
            {accessibility.highContrast ? 'A11y ON' : 'A11y'}
          </span>
        </button>

        {/* Direct Link to Early Warning Alert Center */}
        <Link
          to="/alert-center"
          id="header-alert-center-link"
          className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200"
          title="Financial Early Warning Center"
        >
          <AlertTriangle className="w-4 h-4 text-amber-500" />
          {activeAlertCount > 0 && (
            <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-600 text-[9px] font-mono font-bold text-white flex items-center justify-center border-2 border-white">
              {activeAlertCount}
            </span>
          )}
        </Link>

        {/* Bachat Mitra Quick Trigger */}
        <button
          type="button"
          id="header-mitra-trigger-btn"
          onClick={() => setIsMitraOpen(true)}
          className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center space-x-1 cursor-pointer"
          title="Open Bachat Mitra AI Financial Co-Pilot"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden sm:inline text-[11px] font-bold">Mitra</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            id="notifications-toggle-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) {
                markNotificationsAsRead();
              }
            }}
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200 cursor-pointer"
            aria-label="View system early warnings and notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Distress Alerts & Warnings</h4>
                  <p className="text-[10px] text-slate-400">Early intervention signals for {selectedCustomer?.name ?? 'Customer'}</p>
                </div>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                  {notifications.length} alerts
                </span>
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map((notif) => (
                  <div key={notif.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start space-x-2.5">
                      <div className="mt-0.5 shrink-0">
                        {notif.type === 'warning' ? (
                          <AlertTriangle className="w-4 h-4 text-orange-500" />
                        ) : notif.type === 'success' ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Info className="w-4 h-4 text-indigo-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-900">{notif.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{notif.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{notif.description}</p>
                        {notif.type === 'warning' && (
                          <div className="mt-1.5 flex gap-2">
                            <Link
                              to="/simulator"
                              onClick={() => setShowNotifications(false)}
                              className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 underline underline-offset-2"
                            >
                              Simulate Fix →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 text-[10px] text-slate-500 flex items-center justify-between">
                <span>Rule: Early interventions preserve credit standing</span>
                <Link to="/early-warning" onClick={() => setShowNotifications(false)} className="text-indigo-600 font-semibold hover:underline">
                  View Analysis
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* =========================================================================
            AUTHENTICATION / ACCOUNT SECTION
           ========================================================================= */}
        {!isAuthenticated ? (
          /* Logged-out state: [ Sign In ] and [ Create Account ] */
          <div className="flex items-center space-x-1.5 sm:space-x-2 pl-1 sm:pl-2 border-l border-slate-200">
            {/* SIGN IN BUTTON:
                Secondary outlined button, white/transparent background, purple border, purple text, user/login icon, smooth hover */}
            <button
              type="button"
              id="header-sign-in-btn"
              onClick={openSignIn}
              className="inline-flex items-center justify-center px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-xs font-semibold text-purple-700 bg-white hover:bg-purple-50/80 border border-purple-500/80 hover:border-purple-600 rounded-xl transition-all duration-200 cursor-pointer shadow-2xs group"
            >
              <LogIn className="w-3.5 h-3.5 mr-1 sm:mr-1.5 text-purple-600 group-hover:translate-x-0.5 transition-transform" />
              <span>Sign In</span>
            </button>

            {/* CREATE ACCOUNT BUTTON:
                Primary button, purple-to-blue gradient, white text, rounded corners, subtle glow/shadow, smooth hover, visually prominent */}
            <button
              type="button"
              id="header-create-account-btn"
              onClick={openSignUp}
              className="inline-flex items-center justify-center px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 rounded-xl shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5 mr-1 sm:mr-1.5" />
              <span>Create Account</span>
            </button>
          </div>
        ) : (
          /* Logged-in state: Rahul Verma, Financial Health: Watch, [R] Avatar + Dropdown */
          <div className="relative pl-1 sm:pl-2 border-l border-slate-200" ref={userMenuRef}>
            <button
              type="button"
              id="header-user-menu-btn"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center space-x-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl hover:bg-slate-100/90 border border-transparent hover:border-slate-200 transition-all cursor-pointer text-left"
              aria-expanded={showUserDropdown}
              aria-label="User profile and account menu"
            >
              {/* User text details */}
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {user?.name ?? 'Rahul Verma'}
                </div>
                <div className="text-[10px] font-medium text-slate-500 flex items-center justify-end space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block animate-pulse" />
                  <span>Financial Health: <strong className="text-amber-700 font-semibold">{user?.healthStatus ?? 'Watch'}</strong></span>
                </div>
              </div>

              {/* Circular [R] Profile Avatar */}
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-purple-100">
                  {user?.avatarLetter ?? 'R'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                {/* User Summary Header */}
                <div className="px-4 py-3 bg-gradient-to-br from-purple-50/70 to-indigo-50/40 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {user?.avatarLetter ?? 'R'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">
                        {user?.name ?? 'Rahul Verma'}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">
                        {user?.email ?? 'rahul.verma@cashtwin.bank'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2.5 pt-2 border-t border-purple-100/60 flex items-center justify-between text-[10px]">
                    <span className="text-slate-500 font-mono">Acct {user?.accountNumber ?? '•••• 6204'}</span>
                    <span className="px-1.5 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">
                      Health: {user?.healthStatus ?? 'Watch'}
                    </span>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="py-1">
                  {/* 👤 My Profile */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      openProfileModal();
                    }}
                    className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 flex items-center space-x-2.5 transition-colors cursor-pointer"
                  >
                    <User className="w-4 h-4 text-purple-600" />
                    <span>My Profile</span>
                  </button>

                  {/* 📊 Financial Profile */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      navigate('/financial-health');
                    }}
                    className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 flex items-center space-x-2.5 transition-colors cursor-pointer"
                  >
                    <BarChart2 className="w-4 h-4 text-indigo-600" />
                    <span>Financial Profile</span>
                  </button>

                  {/* ⚙ Settings */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      setIsSettingsOpen(true);
                    }}
                    className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 flex items-center space-x-2.5 transition-colors cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-500" />
                    <span>Settings</span>
                  </button>

                  {/* 🔒 Security */}
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      openSecurityModal();
                    }}
                    className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 flex items-center space-x-2.5 transition-colors cursor-pointer"
                  >
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Security</span>
                  </button>
                </div>

                {/* ↪ Sign Out */}
                <div className="pt-1 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserDropdown(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50/80 flex items-center space-x-2.5 transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

