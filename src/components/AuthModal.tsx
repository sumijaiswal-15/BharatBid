import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Building2, 
  KeyRound, 
  CheckCircle2, 
  ArrowRight, 
  X,
  CreditCard,
  Mail,
  Smartphone,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { AuthUser } from '../types';
import { DEMO_OFFICER_USER, DEMO_BIDDER_USER } from '../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  initialRole?: 'OFFICER' | 'BIDDER';
  onClose: () => void;
  onLoginSuccess: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialRole = 'OFFICER',
  onClose,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'OFFICER' | 'BIDDER'>(initialRole);
  
  // Officer form state
  const [officerLoginMethod, setOfficerLoginMethod] = useState<'DSC' | 'PARICHAY' | 'EMAIL'>('DSC');
  const [officerEmail, setOfficerEmail] = useState('rajesh.kumar@cpcl.gov.in');
  const [officerPin, setOfficerPin] = useState('984211');
  const [dscTokenDetected, setDscTokenDetected] = useState(true);

  // Bidder form state
  const [bidderLoginMethod, setBidderLoginMethod] = useState<'GSTIN' | 'OTP'>('GSTIN');
  const [bidderGstin, setBidderGstin] = useState('07AABCA1234F1Z5');
  const [bidderPassword, setBidderPassword] = useState('••••••••••••');

  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleOfficerLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(DEMO_OFFICER_USER);
      onClose();
    }, 400);
  };

  const handleBidderLogin = (e?: React.FormEvent, customUser?: AuthUser) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess(customUser || DEMO_BIDDER_USER);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden border border-slate-200 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header Strip */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white font-serif">BharatBid Secure Authentication</h2>
              <p className="text-[11px] text-slate-400">Govt. of India e-Procurement Single Sign-On</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-md text-lg leading-none"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dual Login Tab Selector */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100 border-b border-slate-200">
          <button
            id="tab-login-officer"
            onClick={() => setActiveTab('OFFICER')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
              activeTab === 'OFFICER'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Procurement Officer</span>
          </button>

          <button
            id="tab-login-bidder"
            onClick={() => setActiveTab('BIDDER')}
            className={`flex items-center justify-center space-x-2 py-2.5 px-3 rounded-lg text-xs font-bold transition ${
              activeTab === 'BIDDER'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Bidder / Vendor</span>
          </button>
        </div>

        {/* Tab Content: Procurement Officer */}
        {activeTab === 'OFFICER' && (
          <div className="p-6">
            <div className="mb-4">
              <span className="text-[10px] font-bold tracking-wider text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded uppercase">
                Officer Gateway
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Sign in as Tender Evaluation Officer</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized for Tender Committee Members, Technical Evaluators, and Approving Authorities.
              </p>
            </div>

            {/* Officer Login Methods */}
            <div className="flex space-x-2 mb-4">
              <button
                type="button"
                onClick={() => setOfficerLoginMethod('DSC')}
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold border transition ${
                  officerLoginMethod === 'DSC'
                    ? 'bg-blue-50 border-blue-300 text-blue-950'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                NIC DSC Token
              </button>
              <button
                type="button"
                onClick={() => setOfficerLoginMethod('PARICHAY')}
                className={`flex-1 py-2 px-2.5 rounded-lg text-xs font-bold border transition ${
                  officerLoginMethod === 'PARICHAY'
                    ? 'bg-blue-50 border-blue-300 text-blue-950'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Parichay SSO
              </button>
            </div>

            {officerLoginMethod === 'DSC' && (
              <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-900">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-bold">Hardware DSC Token Detected</span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-1">
                  NIC CCA Class 3 Certificate: <strong className="font-mono">Rajesh Kumar (CPCL / MoP&NG)</strong>
                </p>
              </div>
            )}

            <form onSubmit={handleOfficerLogin} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Official Email ID / Parichay Username
                </label>
                <input
                  type="email"
                  value={officerEmail}
                  onChange={(e) => setOfficerEmail(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-blue-700 outline-none font-medium"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  DSC Security PIN / Token Passcode
                </label>
                <input
                  type="password"
                  value={officerPin}
                  onChange={(e) => setOfficerPin(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-blue-700 outline-none font-mono"
                  required
                />
              </div>

              {/* Fast 1-Click Demo Login Preset Button */}
              <div className="pt-2">
                <button
                  id="btn-officer-submit-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <span>Verifying DSC Certificate...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>Authenticate with DSC & Enter Officer Workspace</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab Content: Bidder / Vendor */}
        {activeTab === 'BIDDER' && (
          <div className="p-6">
            <div className="mb-4">
              <span className="text-[10px] font-bold tracking-wider text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">
                Vendor Self-Service
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">Sign in as Registered Bidder</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Access your bid submissions, view live evaluation progress, and reply to officer clarification notices.
              </p>
            </div>

            <form onSubmit={(e) => handleBidderLogin(e)} className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  GSTIN / PAN / Vendor Registration Code
                </label>
                <input
                  type="text"
                  value={bidderGstin}
                  onChange={(e) => setBidderGstin(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-blue-700 outline-none font-mono uppercase font-bold"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={bidderPassword}
                  onChange={(e) => setBidderPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:bg-white focus:border-blue-700 outline-none font-mono"
                  required
                />
              </div>

              {/* Action Button */}
              <div className="pt-2">
                <button
                  id="btn-bidder-submit-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <Building2 className="w-4 h-4 text-amber-400" />
                      <span>Sign In as ABC Technologies Pvt. Ltd.</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Bidder Selector Presets */}
            <div className="mt-4 pt-3 border-t border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Quick Profile Sign-In:
              </span>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => handleBidderLogin(undefined, DEMO_BIDDER_USER)}
                  className="text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-between cursor-pointer transition"
                >
                  <div>
                    <strong className="block text-slate-900">ABC Technologies Pvt. Ltd. (MSME)</strong>
                    <span className="text-[10px] text-slate-500 font-mono">GSTIN: 07AABCA1234F1Z5 • 1 Clarification Pending</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted NIC Session</span>
          </div>
          <span>v4.2 Gov Standards</span>
        </div>
      </div>
    </div>
  );
};
