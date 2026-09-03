import React, { useState, useRef, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { useAuth } from '../../context/AuthContext';
import {
  Bell,
  Menu,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  Eye,
  LogIn,
  User,
  BarChart2,
  Settings,
  Shield,
  LogOut,
  ChevronDown,
  Check,
  Users,
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
    customers,
    selectedCustomerId,
    setSelectedCustomerId,
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
    logout,
    openProfileModal,
    openSecurityModal,
  } = useAuth();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showPersonaSubmenu, setShowPersonaSubmenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeAlertCount = activeAlerts.filter((a) => !a.dismissed).length;
  const totalAlertCount = unreadCount + activeAlertCount;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setShowUserDropdown(false);
        setShowPersonaSubmenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      {/* Left: Mobile menu toggle + Logo + Headings */}
      <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
        <button
          type="button"
          id="open-mobile-menu-btn"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden cursor-pointer shrink-0 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="w-8 h-8 rounded-xl overflow-hidden border border-slate-200/80 p-0.5 bg-white shrink-0 lg:hidden shadow-2xs">
          <img src={logoImg} alt="CashTwin" className="w-full h-full object-contain" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center space-x-2">
            <h1 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight font-sans truncate">
              {title}
            </h1>
            <span className="hidden md:inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 shrink-0">
              Live Resilience Monitor
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium truncate hidden xs:block">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right: Exactly 4 cleanly aligned controls */}
      <div className="flex items-center space-x-1.5 sm:space-x-2.5 shrink-0">
        {/* 1. Monitor / Eye icon */}
        <button
          type="button"
          id="quick-accessibility-toggle-btn"
          onClick={() =>
            updateAccessibility({
              highContrast: !accessibility.highContrast,
              largerText: !accessibility.largerText,
            })
          }
          className={`h-9 w-9 sm:w-auto sm:px-2.5 rounded-xl border transition-all flex items-center justify-center space-x-1.5 cursor-pointer shrink-0 ${
            accessibility.highContrast || accessibility.largerText
              ? 'bg-indigo-600 text-white border-indigo-700 font-bold shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200 bg-white'
          }`}
          title="Monitor / Accessibility Mode (High Contrast & Large Text)"
          aria-label="Toggle Monitor and Accessibility Mode"
        >
          <Eye className="w-4 h-4" />
          <span className="hidden lg:inline text-xs font-semibold">
            {accessibility.highContrast ? 'Monitor ON' : 'Monitor'}
          </span>
        </button>

        {/* 2. Alerts / Notification icon with badge */}
        <div className="relative shrink-0" ref={notifRef}>
          <button
            type="button"
            id="notifications-toggle-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              if (!showNotifications) {
                markNotificationsAsRead();
              }
            }}
            className={`relative h-9 w-9 rounded-xl border transition-all flex items-center justify-center cursor-pointer ${
              showNotifications
                ? 'bg-slate-100 text-slate-900 border-slate-300'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border-slate-200 bg-white'
            }`}
            title="Early Warnings & Notifications"
            aria-label="View early warnings and notifications"
          >
            <Bell className="w-4 h-4" />
            {totalAlertCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-4.5 px-1 rounded-full bg-rose-600 text-[9px] font-mono font-bold text-white flex items-center justify-center border-2 border-white shadow-2xs">
                {totalAlertCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Distress Alerts & Warnings</h4>
                  <p className="text-[10px] text-slate-400">
                    Early intervention signals for {selectedCustomer?.name ?? 'Customer'}
                  </p>
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
                <Link
                  to="/alert-center"
                  onClick={() => setShowNotifications(false)}
                  className="text-indigo-600 font-bold hover:underline"
                >
                  View All Alerts →
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* 3. Mitra AI assistant button */}
        <button
          type="button"
          id="header-mitra-trigger-btn"
          onClick={() => setIsMitraOpen(true)}
          className="h-9 px-2.5 sm:px-3 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 border border-indigo-200 transition-all flex items-center space-x-1.5 cursor-pointer shadow-2xs shrink-0"
          title="Open Bachat Mitra AI Financial Co-Pilot"
        >
          <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
          <span className="text-xs font-bold hidden sm:inline">Mitra AI</span>
        </button>

        {/* 4. ONE user profile avatar with name and dropdown */}
        {!isAuthenticated ? (
          <button
            type="button"
            id="header-sign-in-btn"
            onClick={openSignIn}
            className="h-9 inline-flex items-center space-x-1.5 px-3 rounded-xl text-xs font-semibold text-purple-700 bg-white hover:bg-purple-50 border border-purple-400 transition-all cursor-pointer shadow-2xs shrink-0"
          >
            <LogIn className="w-3.5 h-3.5 text-purple-600 shrink-0" />
            <span>Sign In</span>
          </button>
        ) : (
          <div className="relative shrink-0" ref={userMenuRef}>
            <button
              type="button"
              id="header-user-menu-btn"
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="h-9 flex items-center space-x-2 p-1 sm:px-2 rounded-xl hover:bg-slate-100/90 border border-slate-200 bg-white transition-all cursor-pointer text-left shadow-2xs"
              aria-expanded={showUserDropdown}
              aria-label="User profile and account menu"
            >
              {/* Circular [R] Profile Avatar */}
              <div className="relative shrink-0">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-purple-100">
                  {user?.avatarLetter ?? 'R'}
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1.5 ring-white" />
              </div>

              {/* User text details */}
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-none truncate max-w-[100px]">
                  {user?.name ?? 'Rahul Verma'}
                </div>
                <div className="text-[10px] font-medium text-slate-500 flex items-center space-x-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
                  <span>{user?.healthStatus ?? 'Watch'}</span>
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-100 overflow-hidden">
                {/* User Summary Header */}
                <div className="px-4 py-3 bg-gradient-to-br from-purple-50/70 to-indigo-50/40 border-b border-slate-100">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-purple-700 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
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
                    <User className="w-4 h-4 text-purple-600 shrink-0" />
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
                    <BarChart2 className="w-4 h-4 text-indigo-600 shrink-0" />
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
                    <Settings className="w-4 h-4 text-slate-500 shrink-0" />
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
                    <Shield className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Security</span>
                  </button>

                  {/* 👥 Switch Persona (Collapsible sub-option) */}
                  <button
                    type="button"
                    onClick={() => setShowPersonaSubmenu(!showPersonaSubmenu)}
                    className="w-full px-4 py-2 text-xs font-semibold text-slate-700 hover:text-purple-700 hover:bg-purple-50/70 flex items-center justify-between transition-colors cursor-pointer"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Users className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Switch Persona</span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${showPersonaSubmenu ? 'rotate-180' : ''}`} />
                  </button>

                  {showPersonaSubmenu && (
                    <div className="bg-slate-50/80 px-2 py-1.5 border-y border-slate-100 space-y-0.5">
                      {customers.map((cust) => {
                        const isSelected = cust.id === selectedCustomerId;
                        return (
                          <button
                            key={cust.id}
                            type="button"
                            onClick={() => {
                              setSelectedCustomerId(cust.id);
                              setShowUserDropdown(false);
                              setShowPersonaSubmenu(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              isSelected
                                ? 'bg-indigo-100/70 text-indigo-900 font-bold'
                                : 'text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            <span className="truncate">{cust.name}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600 shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  )}
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
                    <LogOut className="w-4 h-4 text-rose-500 shrink-0" />
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
