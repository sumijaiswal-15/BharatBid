import React, { useState } from 'react';
import { 
  Gavel, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Send, 
  UserCheck, 
  FileText, 
  Sparkles, 
  ShieldCheck, 
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { Bidder, Tender } from '../types';

interface HumanDecisionViewProps {
  currentTender: Tender;
  currentBidder: Bidder;
  onOpenClarificationModal: () => void;
  onNavigate: (view: string) => void;
  onSaveDecision: (decision: string, remarks: string) => void;
}

export const HumanDecisionView: React.FC<HumanDecisionViewProps> = ({
  currentTender,
  currentBidder,
  onOpenClarificationModal,
  onNavigate,
  onSaveDecision
}) => {
  const [selectedDecision, setSelectedDecision] = useState<string>('CONDITIONAL_QUALIFIED');
  const [officerRemarks, setOfficerRemarks] = useState<string>(
    'Technically acceptable subject to receipt and verification of OEM direct clarification regarding reference #SGS/IND/2026/AUTH-8812 and confirmation of legal service address.'
  );
  const [overrideReason, setOverrideReason] = useState<string>('OEM Certificate cross-checked with manufacturer liaison');
  const [isDecisionSubmitted, setIsDecisionSubmitted] = useState<boolean>(false);

  const digitalSignatureHash = 'SHA256: 9e4f21a88c034be891d4e021a8f9024c88e7b19a04f21054';

  const handleFinalize = () => {
    onSaveDecision(selectedDecision, officerRemarks);
    setIsDecisionSubmitted(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner with High-Visibility Governance Mandate */}
      <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-blue-300 uppercase tracking-wide">
              Human-in-the-Loop Authority
            </span>
            <h1 className="text-xl font-extrabold text-white tracking-tight mt-0.5">
              Procurement Officer Decision Center
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Every finding is evidence-backed and advisory. The final determination of qualification or disqualification rests with the Procurement Officer.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400 shrink-0">
            <div className="text-[10px] text-slate-400 uppercase">Officer in Session:</div>
            <div className="font-bold text-white text-sm">Rajesh Kumar, IRSS</div>
            <div className="text-[11px] text-slate-400">Chief Procurement Officer</div>
          </div>
        </div>
      </div>

      {/* Grid: AI Recommendation & Critical Findings Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: AI Recommendation & Scoring */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <span className="text-[10px] font-bold uppercase text-slate-400 font-mono">
              Algorithmic Synthesis
            </span>
            <h2 className="text-base font-bold text-slate-900">
              AI Recommendation
            </h2>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase text-amber-900 bg-amber-200 px-2 py-0.5 rounded font-mono">
                REVIEW REQUIRED
              </span>
              <span className="text-xs font-mono font-bold text-slate-700">
                Score: {currentBidder.complianceScore}/100
              </span>
            </div>
            <p className="text-xs text-amber-950 leading-relaxed font-sans font-medium">
              “Bidder appears substantially compliant, but 3 requirements require officer review before a final qualification decision.”
            </p>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Verified Requirements</span>
              <span className="font-bold text-emerald-700 font-mono">29 / 34</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Officer Attention Items</span>
              <span className="font-bold text-amber-700 font-mono">3 Flagged</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-slate-50 border border-slate-200">
              <span className="text-slate-600">Non-Compliant Items</span>
              <span className="font-bold text-red-700 font-mono">2 Failed</span>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Critical Findings Checklist for Officer */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Items Requiring Officer Evaluation
              </h3>
              <p className="text-xs text-slate-500">
                Review the 3 key findings below before recording your determination.
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Tender: {currentTender.tenderNumber}</span>
          </div>

          <div className="space-y-3 text-xs">
            {/* Item 1 */}
            <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/40 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>1. Mandatory OEM Authorization Duplication Fingerprint</span>
                <span className="text-amber-800 font-mono text-[10px] bg-amber-100 px-2 py-0.5 rounded">
                  72% Confidence
                </span>
              </div>
              <p className="text-slate-600">
                Submitted OEM authorization document for Siemens 400kV GIS contains 96% layout and reference number similarity with another bidder in concurrent tender.
              </p>
              <div className="pt-1 flex items-center space-x-3 text-[11px]">
                <button 
                  onClick={() => onNavigate('duplicate-docs')}
                  className="font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  View Document Diff →
                </button>
                <button 
                  onClick={onOpenClarificationModal}
                  className="font-bold text-amber-800 hover:underline cursor-pointer"
                >
                  Send OEM Verification →
                </button>
              </div>
            </div>

            {/* Item 2 */}
            <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/40 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>2. Registered Office Address Discrepancy</span>
                <span className="text-amber-800 font-mono text-[10px] bg-amber-100 px-2 py-0.5 rounded">
                  84% Confidence
                </span>
              </div>
              <p className="text-slate-600">
                Principal place registered as Noida (GSTN/MCA21) vs Ghaziabad (Udyam plant) vs New Delhi (Bid Submission Form corporate office).
              </p>
              <div className="pt-1 flex items-center space-x-3 text-[11px]">
                <button 
                  onClick={() => onNavigate('consistency')}
                  className="font-bold text-blue-700 hover:underline cursor-pointer"
                >
                  View Consistency Matrix →
                </button>
              </div>
            </div>

            {/* Item 3 */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
              <div className="flex items-center justify-between font-bold text-slate-900">
                <span>3. High Historical Bid Withdrawal Pattern (28.0%)</span>
                <span className="text-slate-700 font-mono text-[10px] bg-slate-200 px-2 py-0.5 rounded">
                  76% Confidence
                </span>
              </div>
              <p className="text-slate-600">
                Historical withdrawal rate is above baseline. Does not constitute misconduct; provided for officer situational awareness.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* HUMAN DECISION ENTRY FORM */}
      <div className="bg-white border-2 border-blue-900/40 rounded-xl p-6 shadow-md space-y-6">
        <div className="pb-3 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Record Formal Techno-Commercial Determination
            </h2>
            <p className="text-xs text-slate-500">
              The decision recorded here will be cryptographically hashed into the official Government Audit Log.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
            e-Sign Ready (NIC CCA PKI)
          </span>
        </div>

        {/* 4 Official Decision Options */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {[
            {
              id: 'QUALIFIED',
              title: 'Technically Qualified',
              desc: 'All criteria satisfied with zero pending conditions.',
              color: 'border-emerald-500 bg-emerald-50/50 text-emerald-950',
              activeColor: 'ring-2 ring-emerald-600 bg-emerald-100/60'
            },
            {
              id: 'CONDITIONAL_QUALIFIED',
              title: 'Conditionally Qualified',
              desc: 'Qualified subject to receipt of formal clarification.',
              color: 'border-blue-500 bg-blue-50/50 text-blue-950',
              activeColor: 'ring-2 ring-blue-600 bg-blue-100/60'
            },
            {
              id: 'CLARIFICATION_REQUIRED',
              title: 'Clarification Pending',
              desc: 'Decision withheld pending 48-hour bidder response.',
              color: 'border-amber-500 bg-amber-50/50 text-amber-950',
              activeColor: 'ring-2 ring-amber-600 bg-amber-100/60'
            },
            {
              id: 'DISQUALIFIED',
              title: 'Ineligible / Disqualified',
              desc: 'Fails mandatory non-waivable tender conditions.',
              color: 'border-red-500 bg-red-50/50 text-red-950',
              activeColor: 'ring-2 ring-red-600 bg-red-100/60'
            }
          ].map((opt) => (
            <label
              key={opt.id}
              onClick={() => setSelectedDecision(opt.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition flex flex-col justify-between ${
                selectedDecision === opt.id ? opt.activeColor : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-900">{opt.title}</span>
                  <input
                    type="radio"
                    name="decision"
                    checked={selectedDecision === opt.id}
                    onChange={() => setSelectedDecision(opt.id)}
                    className="accent-blue-900"
                  />
                </div>
                <p className="text-[11px] text-slate-600 leading-normal">{opt.desc}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Officer Detailed Comment & Override Justification */}
        <div className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-slate-800 block mb-1">
              Procurement Officer Findings & File Remarks (Mandatory for Committee Minutes)
            </label>
            <textarea
              rows={3}
              value={officerRemarks}
              onChange={(e) => setOfficerRemarks(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-3 text-xs text-slate-900 font-sans focus:outline-none focus:border-blue-600"
              placeholder="Enter comprehensive findings, statutory provisions applied, and committee remarks..."
            ></textarea>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1">
              AI Finding Override Justification (If modifying algorithmic risk flag)
            </label>
            <input
              type="text"
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 font-sans focus:outline-none focus:border-blue-600"
              placeholder="e.g. Primary address verified from physical lease deed submitted on file"
            />
          </div>
        </div>

        {/* Digital Signature & Final Submit Bar */}
        <div className="p-4 bg-slate-900 text-white rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <div className="flex items-center space-x-1.5 text-xs text-emerald-400 font-mono">
              <Lock className="w-3.5 h-3.5" />
              <span>Government Digital Signature Block</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Signer: Rajesh Kumar, IRSS • Token: DSC-2026-NIC-9912 • Hash: {digitalSignatureHash}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="btn-record-officer-decision"
              onClick={handleFinalize}
              className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-md transition transform active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Sign & Record Official Determination</span>
            </button>
          </div>
        </div>

        {isDecisionSubmitted && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong>Determination Recorded & Signed Successfully!</strong>
                <p className="text-[11px] text-emerald-800">
                  Logged in immutable audit trail with hash <code>{digitalSignatureHash.substring(0, 24)}...</code>
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('compliance-report')}
              className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-bold text-xs hover:bg-emerald-800 transition"
            >
              Generate Final Report →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
