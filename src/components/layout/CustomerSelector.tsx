import React, { useState, useRef, useEffect } from 'react';
import { useCustomer } from '../../context/CustomerContext';
import { RiskLevel } from '../../types/financial';
import { ChevronDown, Check, ShieldAlert, ShieldCheck, AlertTriangle } from 'lucide-react';

interface Props {
  variant?: 'sidebar' | 'header' | 'modal';
}

export const CustomerSelector: React.FC<Props> = ({ variant = 'sidebar' }) => {
  const { customers, selectedCustomerId, setSelectedCustomerId, selectedCustomer } = useCustomer();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBadgeStyle = (level: RiskLevel) => {
    switch (level) {
      case 'HEALTHY':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'WATCH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'AT_RISK':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'HIGH_RISK':
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const getStatusIcon = (level: RiskLevel) => {
    switch (level) {
      case 'HEALTHY':
        return <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />;
      case 'WATCH':
        return <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />;
      case 'AT_RISK':
        return <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />;
      case 'HIGH_RISK':
        return <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />;
    }
  };

  const formatLevel = (level: RiskLevel) => {
    switch (level) {
      case 'HEALTHY':
        return 'Healthy';
      case 'WATCH':
        return 'Watch';
      case 'AT_RISK':
        return 'At Risk';
      case 'HIGH_RISK':
        return 'High Distress';
    }
  };

  return (
    <div className="relative" ref={dropdownRef} id="customer-selector-container">
      {variant === 'sidebar' ? (
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5 px-1 flex items-center justify-between">
            <span>Demo Persona</span>
            <span className="text-[10px] lowercase text-slate-400 font-normal">switch view</span>
          </div>
          <button
            type="button"
            id="sidebar-customer-toggle-btn"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 hover:bg-slate-50/60 transition-all text-left group"
          >
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-xs text-indigo-700 shrink-0">
                {selectedCustomer?.name?.charAt(0) ?? "?"}
              </div>
              <div className="truncate">
                <div className="text-xs font-semibold text-slate-900 truncate flex items-center gap-1.5">
                  <span>{selectedCustomer?.name ?? "No Customer Available"}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">{selectedCustomer?.id ?? "N/A"}</div>
              </div>
            </div>
            <div className="flex items-center space-x-1.5 shrink-0 pl-1">
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${getBadgeStyle(selectedCustomer?.riskLevel || 'HEALTHY')}`}>
                {formatLevel(selectedCustomer?.riskLevel || 'HEALTHY')}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform" />
            </div>
          </button>
        </div>
      ) : (
        <button
          type="button"
          id="header-customer-toggle-btn"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:border-indigo-300 shadow-xs hover:bg-slate-50/80 transition-all"
        >
          <div className="w-6 h-6 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center text-xs font-bold text-indigo-700">
            {selectedCustomer?.name?.charAt(0) ?? "?"}
          </div>
          <div className="text-left hidden sm:block">
            <span className="text-xs font-semibold text-slate-800">{selectedCustomer?.name ?? "No Customer Available"}</span>
            <span className="text-[10px] text-slate-400 block -mt-0.5">{selectedCustomer?.id ?? "N/A"}</span>
          </div>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${getBadgeStyle(selectedCustomer?.riskLevel || 'HEALTHY')}`}>
            {getStatusIcon(selectedCustomer?.riskLevel || 'HEALTHY')}
            <span>{formatLevel(selectedCustomer?.riskLevel || 'HEALTHY')}</span>
          </span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      )}

      {isOpen && (
        <div className="absolute z-50 bottom-full mb-2 left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
            Select Hackathon Persona
          </div>
          <div className="py-1">
            {customers.map((customer) => {
              const isSelected = customer.id === selectedCustomerId;
              return (
                <button
                  key={customer.id}
                  id={`select-customer-${customer.id}`}
                  type="button"
                  onClick={() => {
                    setSelectedCustomerId(customer.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-slate-50 transition-colors ${
                    isSelected ? 'bg-indigo-50/50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-semibold text-slate-700">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
                        <span>{customer.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                      <div className="text-[11px] text-slate-500">{customer.occupation}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0 ${getBadgeStyle(customer.riskLevel)}`}>
                    {formatLevel(customer.riskLevel)}
                  </span>
                </button>
              );
            })}
          </div>
          <div className="px-3 py-1.5 border-t border-slate-100 bg-slate-50/80 rounded-b-xl text-[11px] text-slate-500">
            Demo tip: <strong>Customer 003</strong> has the canonical ₹9,400 gap in 18 days.
          </div>
        </div>
      )}
    </div>
  );
};
