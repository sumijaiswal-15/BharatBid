import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  ExternalLink, 
  FileText, 
  Sparkles, 
  Clock, 
  Send, 
  UserCheck, 
  Info,
  Check,
  ChevronRight,
  Database
} from 'lucide-react';
import { VerificationItem, StatusType } from '../types';

interface EvidenceDrawerProps {
  item: VerificationItem | null;
  onClose: () => void;
  onOpenClarificationModal: (item: VerificationItem) => void;
  onOverrideStatus: (item: VerificationItem, newStatus: StatusType, reason: string) => void;
}

export const EvidenceDrawer: React.FC<EvidenceDrawerProps> = ({
  item,
  onClose,
  onOpenClarificationModal,
  onOverrideStatus
}) => {
  if (!item) return null;

  const [overrideModalOpen, setOverrideModalOpen] = useState(false);
  const [overrideStatus, setOverrideStatus] = useState<StatusType>('VERIFIED');
  const [overrideReason, setOverrideReason] = useState('');
  const [overrideComment, setOverrideComment] = useState('');

  const isVerified = item.status === 'VERIFIED';
  const isReview = item.status === 'REVIEW';
  const isCritical = item.status === 'CRITICAL';

  const handleApplyOverride = () => {
    if (!overrideReason.trim()) {
      alert('Please provide a mandatory justification reason for overriding the AI assessment.');
      return;
    }
    onOverrideStatus(item, overrideStatus, `${overrideReason}: ${overrideComment}`);
    setOverrideModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex justify-end animate-fadeIn">
      <div 
        className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-y-auto animate-slideInRight"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="px-6 py-5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              isVerified ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
              isReview ? 'bg-amber-950 text-amber-400 border border-amber-800' :
              'bg-red-950 text-red-400 border border-red-800'
            }`}>
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-blue-300 font-mono">
                AI Evidence Traceability Drawer
              </div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Why did BharatBid flag this?
              </h2>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Status & Confidence Banner */}
          <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
            isVerified ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' :
            isReview ? 'bg-amber-50/80 border-amber-200 text-amber-900' :
            'bg-red-50/80 border-red-200 text-red-900'
          }`}>
            <div className="flex items-center space-x-2.5">
              {isVerified && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />}
              {isReview && <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />}
              {isCritical && <AlertOctagon className="w-5 h-5 text-red-600 shrink-0" />}
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wide">
                  {isVerified ? '✓ Verified / Requirement Satisfied' :
                   isReview ? '⚠ Review Required / Discrepancy Detected' :
                   '✕ Critical / Ineligible Finding'}
                </div>
                <div className="text-xs text-slate-600 font-medium">
                  {item.requirement}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-right">
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-500 font-mono">AI Certainty</div>
                <div className="text-base font-extrabold font-mono text-slate-900">
                  {item.confidence}%
                </div>
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center font-mono font-bold text-xs bg-white">
                {item.confidence}%
              </div>
            </div>
          </div>

          {/* Applicable Tender Rule */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase font-mono">
              <span className="flex items-center">
                <FileText className="w-3.5 h-3.5 mr-1.5 text-blue-700" />
                Applicable Tender Rule
              </span>
              <span className="text-blue-700 font-semibold">{item.tenderClauseRef}</span>
            </div>
            <div className="p-3 rounded bg-white border border-slate-200 text-xs font-mono text-slate-800">
              <code>{item.ruleLogic}</code>
            </div>
          </div>

          {/* Evidence Found Breakdown */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 uppercase font-mono flex items-center">
              <Database className="w-3.5 h-3.5 mr-1.5 text-indigo-700" />
              Evidence Found & Verified Records
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-3">
              <p className="text-xs text-slate-700 leading-relaxed font-sans">
                {item.evidence}
              </p>

              {item.evidenceSnippet && (
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-800 font-mono">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">
                    Direct Document/API Excerpt:
                  </span>
                  {item.evidenceSnippet}
                </div>
              )}

              {/* Data Points Grid */}
              {item.verifiedDataPoints && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                  {item.verifiedDataPoints.map((dp, idx) => (
                    <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200 text-xs">
                      <div className="text-[10px] text-slate-400 font-mono font-bold uppercase">{dp.label}</div>
                      <div className="font-semibold text-slate-800 flex items-center justify-between mt-0.5">
                        <span>{dp.value}</span>
                        {dp.isMatch ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Verification Source & Verification Timestamp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                Verification Source
              </div>
              <div className="font-bold text-slate-900 mt-1 flex items-center">
                <ShieldCheck className="w-4 h-4 text-blue-600 mr-1.5 shrink-0" />
                <span>{item.source}</span>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Type: <span className="font-mono text-slate-700">{item.sourceType}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              <div className="text-[10px] font-bold uppercase text-slate-400 font-mono">
                Verification Timestamp
              </div>
              <div className="font-bold text-slate-900 mt-1 flex items-center font-mono">
                <Clock className="w-4 h-4 text-purple-600 mr-1.5 shrink-0" />
                <span>{item.timestamp}</span>
              </div>
              <div className="text-[10px] text-emerald-600 mt-0.5 font-medium">
                Cryptographic Hash Verified
              </div>
            </div>
          </div>

          {/* AI Assessment & Reasoning */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-50/70 to-indigo-50/50 border border-blue-200 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-xs font-bold text-blue-900 uppercase font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Assessment & Recommendation</span>
            </div>
            <p className="text-xs text-blue-950 leading-relaxed font-sans">
              {item.aiReasoning}
            </p>
            {item.flagReason && (
              <div className="mt-2 p-2.5 rounded bg-amber-100/70 border border-amber-300 text-xs text-amber-950">
                <strong className="font-bold">Officer Action Guide: </strong> {item.flagReason}
              </div>
            )}
          </div>

          {/* Officer Overrides Log if any */}
          {item.officerOverride && (
            <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 space-y-1 text-xs">
              <div className="font-bold text-purple-900 flex items-center">
                <UserCheck className="w-4 h-4 text-purple-700 mr-1.5" />
                Officer Override on Record
              </div>
              <div className="text-slate-700">
                Status modified to <span className="font-bold text-purple-800">{item.officerOverride.newStatus}</span> by {item.officerOverride.overriddenBy}.
              </div>
              <div className="text-slate-600 font-mono text-[11px] bg-white p-2 rounded border border-purple-100 mt-1">
                Reason: {item.officerOverride.reason}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Action Footer */}
        <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onOpenClarificationModal(item)}
              className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-lg shadow-sm transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Request Clarification</span>
            </button>

            <button
              onClick={() => setOverrideModalOpen(true)}
              className="flex items-center space-x-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold px-3.5 py-2 rounded-lg transition"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Override AI Finding</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs text-slate-500 hover:text-slate-800 font-semibold px-3 py-2"
          >
            Close Drawer
          </button>
        </div>

        {/* Override Modal Sub-dialog */}
        {overrideModalOpen && (
          <div className="fixed inset-0 z-60 bg-slate-950/70 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">
                  Officer Override Justification
                </h3>
                <button onClick={() => setOverrideModalOpen(false)} className="text-slate-400 hover:text-slate-700 cursor-pointer p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="text-xs text-slate-600">
                Under Government Procurement Governance Rules, every override of an automated AI flag requires a permanent audit justification.
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">New Determination Status</label>
                  <select
                    value={overrideStatus}
                    onChange={(e) => setOverrideStatus(e.target.value as StatusType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800 font-semibold"
                  >
                    <option value="VERIFIED">VERIFIED / SATISFIED</option>
                    <option value="REVIEW">REVIEW REQUIRED</option>
                    <option value="CRITICAL">CRITICAL / NON-COMPLIANT</option>
                    <option value="NOT_APPLICABLE">NOT APPLICABLE</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Mandatory Justification Reason</label>
                  <input
                    type="text"
                    value={overrideReason}
                    onChange={(e) => setOverrideReason(e.target.value)}
                    placeholder="e.g. OEM confirmed authenticity via direct registered email on 25-Aug-2026"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Detailed File Note / Comment</label>
                  <textarea
                    rows={3}
                    value={overrideComment}
                    onChange={(e) => setOverrideComment(e.target.value)}
                    placeholder="Reference file no., committee approval date or external confirmation details..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-800"
                  ></textarea>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2">
                <button
                  onClick={() => setOverrideModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplyOverride}
                  className="px-4 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow transition"
                >
                  Record Audit Override
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
