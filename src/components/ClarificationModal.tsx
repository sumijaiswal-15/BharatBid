import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Copy, 
  Check, 
  FileText, 
  Mail, 
  Sparkles, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { Bidder, Tender, VerificationItem } from '../types';

interface ClarificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBidder: Bidder;
  currentTender: Tender;
  item?: VerificationItem | null;
}

export const ClarificationModal: React.FC<ClarificationModalProps> = ({
  isOpen,
  onClose,
  currentBidder,
  currentTender,
  item
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [hoursDeadline, setHoursDeadline] = useState('48');

  const subject = `URGENT: Request for Clarification — Tender ${currentTender.tenderNumber} [${currentBidder.name}]`;

  const defaultBody = `To:
Authorized Signatory / Bidder Representative
${currentBidder.name}
CIN: ${currentBidder.cin} | Email: procurement-desk@${currentBidder.name.toLowerCase().replace(/[^a-z]/g, '')}.in

Subject: ${subject}

Dear Sir/Madam,

With reference to your techno-commercial bid submitted against Tender No. ${currentTender.tenderNumber} for "${currentTender.title}", the Techno-Commercial Evaluation Sub-Committee has completed initial automated multi-source verification.

During the verification of submitted documents and statutory registries, the following clarification is urgently required:

1. REQUIREMENT / CLAUSE REFERENCE:
   Clause Ref: ${item?.tenderClauseRef || 'Section IV, Clause 3.2.1'} — ${item?.requirement || 'OEM Authorization & Address Consistency'}

2. NATURE OF CLARIFICATION REQUIRED:
   ${item?.flagReason || item?.evidence || 'Discrepancy noted between registered office address in GSTN vs Udyam vs submitted Bid Form A-1. Furthermore, OEM authorization letter ref #SGS/IND/2026/AUTH-8812 requires formal manufacturer signatory confirmation.'}

3. MANDATORY SUBMISSION DEADLINE:
   You are hereby requested to upload certified documentary clarification along with original manufacturer email verification through the BharatBid portal within ${hoursDeadline} HOURS of receipt of this notice (i.e. by 28-Aug-2026, 17:00 IST).

Failure to submit the requested clarification within the stipulated timeframe may result in your bid being evaluated strictly on the basis of existing on-record documents in accordance with standard CPSE Procurement Guidelines.

Yours faithfully,

Rajesh Kumar, IRSS
Chief Procurement Officer / Tender Inviting Authority
Chennai Petroleum Corporation Limited (CPCL)
Government of India Enterprise`;

  const [letterBody, setLetterBody] = useState(defaultBody);

  const handleCopy = () => {
    navigator.clipboard.writeText(letterBody);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    setSent(true);
    setTimeout(() => {
      setSent(false);
      onClose();
      alert('Official Clarification Notice dispatched to Bidder via registered GeM / BharatBid Portal & Email gateway!');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-300 overflow-hidden flex flex-col max-h-[90vh] animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-500 text-slate-950">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                BharatBid Official Notice Generator
              </div>
              <h2 className="text-base font-bold text-white">
                Draft Official Clarification Notice
              </h2>
            </div>
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Target Bidder</label>
              <div className="font-semibold text-slate-900">{currentBidder.name}</div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Response Window</label>
              <select
                value={hoursDeadline}
                onChange={(e) => setHoursDeadline(e.target.value)}
                className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-slate-800"
              >
                <option value="24">24 Hours (Urgent Tender)</option>
                <option value="48">48 Hours (Standard CPSE)</option>
                <option value="72">72 Hours (Extended)</option>
              </select>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-800">Formal Notice Text (Auto-Drafted from AI Findings)</label>
              <span className="text-[11px] text-blue-700 font-mono flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                Govt Phrasing Pre-calibrated
              </span>
            </div>
            <textarea
              rows={12}
              value={letterBody}
              onChange={(e) => setLetterBody(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 font-mono text-xs text-slate-900 leading-relaxed focus:outline-none focus:border-blue-600 shadow-inner"
            ></textarea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied to Clipboard' : 'Copy Notice Text'}</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>

            <button
              onClick={handleSend}
              disabled={sent}
              className="flex items-center space-x-1.5 px-5 py-2 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sent ? 'Dispatching Notice...' : 'Issue Official Notice'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
