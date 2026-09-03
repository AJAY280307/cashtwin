import React, { useState, useRef, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext';
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
} from 'lucide-react';
import { Link } from 'react-router-dom';

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
  } = useCustomer();
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeAlertCount = activeAlerts.filter((a) => !a.dismissed).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Left: Mobile menu toggle + Page Headings */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          type="button"
          id="open-mobile-menu-btn"
          onClick={onOpenMobileMenu}
          className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 lg:hidden"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight font-sans">
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

      {/* Right: Quick Customer Picker, Accessibility Toggle, Alert Center, Notifications, Profile */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Customer Selector in Header */}
        <CustomerSelector variant="header" />

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
          className={`p-2 rounded-lg border transition-colors flex items-center space-x-1 ${
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
          className="p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center space-x-1"
          title="Open Bachat Mitra AI Financial Co-Pilot"
        >
          <Sparkles className="w-4 h-4" />
          <span className="hidden md:inline text-[11px] font-bold">Mitra</span>
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
            className="relative p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors border border-slate-200"
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
                  <p className="text-[10px] text-slate-400">Early intervention signals for {selectedCustomer.name}</p>
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

        {/* Profile indicator */}
        <div className="hidden sm:flex items-center pl-2 border-l border-slate-200">
          <div className="text-right mr-2 hidden md:block">
            <div className="text-xs font-bold text-slate-900 leading-tight">
              {selectedCustomer.name}
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Acct {selectedCustomer.accountNumber}
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shadow-xs ring-2 ring-slate-100">
            {selectedCustomer.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
};
