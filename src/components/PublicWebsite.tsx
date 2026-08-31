import React from 'react';
import { 
  ShieldCheck, 
  Building2, 
  Sparkles,
  Lock,
  ChevronRight,
  FileCheck,
  CheckCircle2
} from 'lucide-react';
import { Tender } from '../types';

interface PublicWebsiteProps {
  tenders: Tender[];
  onOpenLogin: (role: 'OFFICER' | 'BIDDER') => void;
  onSelectTender: (tender: Tender) => void;
  onOpenAIAssistant?: () => void;
}

export const PublicWebsite: React.FC<PublicWebsiteProps> = ({
  tenders: _tenders,
  onOpenLogin,
  onSelectTender: _onSelectTender,
  onOpenAIAssistant
}) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col justify-between">
      {/* Top Government Strip */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-6xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-3">
            <div className="flex space-x-0.5">
              <span className="w-2.5 h-2 bg-[#FF9933] inline-block rounded-xs"></span>
              <span className="w-2.5 h-2 bg-white inline-block rounded-xs"></span>
              <span className="w-2.5 h-2 bg-[#138808] inline-block rounded-xs"></span>
            </div>
            <span className="font-semibold text-slate-200">भारत सरकार | Government of India</span>
            <span className="hidden sm:inline text-slate-500">•</span>
            <span className="hidden sm:inline text-slate-400">e-Procurement Gateway</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <a 
              href="tel:1800111999" 
              className="hover:text-amber-400 transition flex items-center space-x-1"
            >
              <span>Toll Free:</span>
              <strong className="text-slate-200 hover:text-amber-400 underline">1800-111-999</strong>
            </a>
            <span className="hidden md:inline">|</span>
            <span className="text-amber-400 font-mono">26 Aug 2026 IST</span>
          </div>
        </div>
      </div>

      {/* Main Website Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-blue-950 flex items-center justify-center text-amber-400 font-black shadow-sm border border-slate-800">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
            </div>
            <span className="text-xl font-black tracking-tight text-slate-900 font-serif">BharatBid</span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {onOpenAIAssistant && (
              <button
                onClick={onOpenAIAssistant}
                className="flex items-center space-x-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 px-3 py-2 rounded-lg transition shadow-xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Guides</span>
              </button>
            )}

            <button
              id="btn-nav-bidder-login"
              onClick={() => onOpenLogin('BIDDER')}
              className="flex items-center space-x-1.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 sm:px-4 py-2 rounded-lg border border-slate-300 transition cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-slate-600" />
              <span>Bidder Login</span>
            </button>

            <button
              id="btn-nav-officer-login"
              onClick={() => onOpenLogin('OFFICER')}
              className="flex items-center space-x-1.5 text-xs font-bold text-white bg-blue-900 hover:bg-blue-950 px-3.5 sm:px-4 py-2 rounded-lg shadow-sm border border-blue-800 transition cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>Officer Portal</span>
            </button>
          </div>
        </div>
      </header>

      {/* Clean Hero & Login Access Section */}
      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-12 w-full flex-1 flex flex-col justify-center items-center">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 text-blue-900 px-3 py-1 rounded-full text-xs font-semibold mb-3 font-mono">
            <FileCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>GFR 2017 & CVC Guidelines Compliant</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-serif tracking-tight">
            Central Public Procurement Gateway
          </h1>
          <p className="mt-2 text-sm text-slate-600">
            Automated statutory verification with GSTN, MCA21, CBDT PAN, and Udyam MSME.
          </p>
        </div>

        {/* Clean Portal Entry Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full max-w-3xl">
          {/* Card 1: Officer Portal */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-blue-500 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Procurement Committee Portal</h2>
              <p className="text-xs text-slate-500 mt-1">
                Evaluate tender bids, review live registry cross-matches, and sign decisions with Digital Signature Certificate (DSC).
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Role: CPO / Committee</span>
              <button
                id="btn-card-officer-login"
                onClick={() => onOpenLogin('OFFICER')}
                className="bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              >
                <span>Officer Login</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Card 2: Bidder Portal */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:border-amber-500 hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-900">Bidder / Vendor Self-Service</h2>
              <p className="text-xs text-slate-500 mt-1">
                Track submitted bids, check compliance status, and submit responses to official clarification queries.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">Role: Registered Vendor</span>
              <button
                id="btn-card-bidder-login"
                onClick={() => onOpenLogin('BIDDER')}
                className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center space-x-1.5 transition cursor-pointer shadow-xs"
              >
                <span>Bidder Login</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Clean Trust Indicators */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500">
          <span className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
            Direct API Verification
          </span>
          <span className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
            PKI & SHA-256 Digital Signatures
          </span>
          <span className="flex items-center">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 mr-1.5" />
            256-bit Immutable Audit Trails
          </span>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-8 text-center text-xs text-slate-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 BharatBid • National Informatics Centre & Ministry of Finance</span>
          <div className="flex items-center space-x-4">
            <button onClick={() => alert('e-Procurement Privacy Policy')} className="hover:text-slate-800 cursor-pointer">Privacy Policy</button>
            <span>•</span>
            <button onClick={() => alert('Terms of Service & GFR Compliance')} className="hover:text-slate-800 cursor-pointer">Terms of Service</button>
            <span>•</span>
            <a href="tel:1800111999" className="hover:text-slate-800 cursor-pointer">Helpdesk: 1800-111-999</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
