import React from 'react';
import { 
  ShieldCheck, 
  Bell, 
  Building2, 
  LogOut,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { Tender, AuthUser } from '../types';

interface NavbarProps {
  currentTender: Tender;
  allTenders?: Tender[];
  onSelectTender: (tender: Tender) => void;
  activeView?: string;
  onNavigate?: (view: string) => void;
  currentUser?: AuthUser;
  onLogout?: () => void;
  onSwitchToBidder?: () => void;
  attentionCount?: number;
  onOpenAIAssistant?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTender,
  allTenders = [],
  onSelectTender,
  activeView: _activeView,
  onNavigate,
  currentUser,
  onLogout,
  onSwitchToBidder,
  attentionCount = 4,
  onOpenAIAssistant
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      {/* Top Government Strip */}
      <div className="bg-slate-950 px-4 sm:px-8 py-1.5 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate ? onNavigate('public-website') : undefined}
            className="flex items-center space-x-1.5 font-medium tracking-wide text-slate-300 hover:text-white transition cursor-pointer"
            title="Return to Public Procurement Gateway"
          >
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-semibold text-slate-200 underline decoration-slate-600">Government of India</span>
            <span className="text-slate-600">|</span>
            <span className="text-[11px] text-slate-400">CPCL Procurement</span>
          </button>
          <button 
            onClick={() => alert('Compliant with General Financial Rules (GFR) 2017 & CVC Guidelines for Public Procurement.')}
            className="hidden md:inline-block text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded border border-slate-700 transition cursor-pointer"
            title="Click to view GFR 2017 Mandate Details"
          >
            GFR 2017 Verified ⓘ
          </button>
        </div>
        <div className="flex items-center space-x-4 text-[11px]">
          <button 
            onClick={() => onNavigate ? onNavigate('dashboard') : undefined}
            className="hidden sm:flex items-center text-emerald-400 hover:text-emerald-300 font-mono transition cursor-pointer"
            title="View Live Registry Gateways"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1" />
            Live Registries: GSTN • MCA21 • CBDT • Udyam
          </button>
          <button 
            onClick={() => alert('NTP Synchronized Time: 26 Aug 2026 IST (Indian Standard Time)')}
            className="text-slate-400 hover:text-amber-400 font-mono transition cursor-pointer"
          >
            26 Aug 2026 IST
          </button>
        </div>
      </div>

      {/* Main Bar */}
      <div className="px-4 sm:px-8 py-2.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer" 
          onClick={() => onNavigate ? onNavigate('dashboard') : undefined}
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-blue-950 border border-blue-800 shadow-inner text-amber-400 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-lg font-black tracking-tight text-white font-serif">
                Bharat<span className="text-amber-400">Bid</span>
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-900 text-blue-200 border border-blue-700">
                OFFICER
              </span>
            </div>
          </div>
        </div>

        {/* Tender Selector Dropdown */}
        <div className="hidden lg:flex items-center bg-slate-800/90 border border-slate-700 rounded-lg px-3 py-1.5 text-xs max-w-md">
          <Building2 className="w-4 h-4 text-amber-400 mr-2 shrink-0" />
          <div className="truncate mr-2">
            <div className="font-medium text-slate-200 truncate">
              {currentTender.tenderNumber} • {currentTender.estimatedValue}
            </div>
          </div>
          <select 
            value={currentTender.id}
            onChange={(e) => {
              const selected = allTenders.find(t => t.id === e.target.value);
              if (selected) onSelectTender(selected);
            }}
            className="bg-slate-900 text-slate-200 text-xs border border-slate-700 rounded px-2 py-1 focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            {allTenders.map(t => (
              <option key={t.id} value={t.id}>
                {t.tenderNumber} - {t.title.substring(0, 32)}...
              </option>
            ))}
          </select>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center space-x-2.5">
          {/* AI Assistant & Guides Button */}
          {onOpenAIAssistant && (
            <button
              id="btn-nav-ai-assistant"
              onClick={onOpenAIAssistant}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300 hover:from-amber-400 hover:to-amber-400 px-3.5 py-1.5 rounded-lg shadow-sm transition transform hover:scale-[1.02]"
              title="Open AI Procurement Assistant & Guides"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>AI Guides</span>
            </button>
          )}

          {/* Attention Queue Alert Badge */}
          <button
            id="btn-attention-queue-nav"
            onClick={() => onNavigate ? onNavigate('dashboard') : undefined}
            className="relative p-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-300 transition"
            title="Attention Queue"
          >
            <Bell className="w-4 h-4" />
            {attentionCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[10px] font-bold text-white">
                {attentionCount}
              </span>
            )}
          </button>

          {/* Switch to Bidder Portal Button */}
          {onSwitchToBidder && (
            <button
              onClick={onSwitchToBidder}
              className="hidden sm:flex items-center space-x-1 text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-700 transition"
              title="Test Vendor Portal experience as ABC Technologies"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Vendor View</span>
            </button>
          )}

          {/* Officer Profile Badge & Logout */}
          <div className="flex items-center space-x-3 pl-2.5 border-l border-slate-700">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-slate-200">
                {currentUser?.name?.split(',')[0] || 'Rajesh Kumar'}
              </div>
              <div className="text-[10px] text-slate-400">
                Chief Procurement Officer
              </div>
            </div>

            {onLogout && (
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 text-xs text-rose-300 hover:text-rose-200 bg-rose-950/40 hover:bg-rose-950/70 border border-rose-800/60 px-2 py-1.5 rounded-lg transition"
                title="Log Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
