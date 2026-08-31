import React, { useState } from 'react';
import { 
  FileStack, 
  AlertTriangle, 
  FileText, 
  Sparkles, 
  Send, 
  ShieldAlert, 
  ExternalLink, 
  Copy, 
  CheckCircle2, 
  Eye, 
  Info,
  ZoomIn
} from 'lucide-react';
import { Bidder, DuplicateDocItem } from '../types';

interface DocumentIntegrityViewProps {
  currentBidder: Bidder;
  onOpenClarificationModal: () => void;
  onNavigate: (view: string) => void;
}

export const DocumentIntegrityView: React.FC<DocumentIntegrityViewProps> = ({
  currentBidder,
  onOpenClarificationModal,
  onNavigate: _onNavigate
}) => {
  const [duplicateDoc, setDuplicateDoc] = useState<DuplicateDocItem | null>(
    currentBidder?.duplicateDocs?.[0] || null
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Document Integrity Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Multi-tender layout, typography, and metadata fingerprinting across public procurement submissions.
            </p>
          </div>

          <button
            onClick={onOpenClarificationModal}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Request OEM Verification</span>
          </button>
        </div>
      </div>

      {/* SIDE-BY-SIDE DUPLICATE DOCUMENT COMPARISON */}
      {duplicateDoc ? (
        <div className="bg-white border border-red-200 rounded-xl shadow-xs overflow-hidden">
          {/* Top Alert Bar */}
          <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
            <div>
              <span className="text-xs font-bold tracking-wider uppercase text-red-400">
                Cross-Bidder Fingerprint Match
              </span>
              <h2 className="text-base font-extrabold text-white mt-0.5">
                Potential Duplicate Document: OEM Authorization Letter
              </h2>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-[10px] uppercase font-bold text-red-300 font-mono">Structural Match</div>
                <div className="text-xl font-extrabold font-mono text-amber-400 leading-none">
                  {duplicateDoc.similarityScore}%
                </div>
              </div>
              <span className="px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs">
                REVIEW REQUIRED
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Side-by-side Document Previews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Document A: Current Bidder (ABC Technologies) */}
              <div className="bg-slate-50 border-2 border-blue-300 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-blue-700 font-mono bg-blue-100 px-2 py-0.5 rounded">
                      Bidder A (Current Bidder)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {duplicateDoc.bidderA.name}
                    </h3>
                  </div>
                  <div className="text-right text-[11px] font-mono text-slate-500">
                    <div>Tender: {duplicateDoc.bidderA.tenderId}</div>
                    <div>Date: {duplicateDoc.bidderA.submissionDate}</div>
                  </div>
                </div>

                {/* Document Card Visual Representation */}
                <div className="p-4 rounded-lg bg-white border border-slate-300 text-xs font-mono space-y-3 shadow-inner">
                  <div className="text-center pb-2 border-b border-slate-200 text-slate-700 font-serif font-bold text-sm">
                    SIEMENS GRID SOLUTIONS INDIA LTD.
                  </div>

                  <div className="text-slate-500 text-[11px] flex justify-between">
                    <span>Ref: <strong className="text-red-700 bg-red-50 px-1 py-0.2 rounded border border-red-200">{duplicateDoc.bidderA.refNo}</strong></span>
                    <span>Date: 14-Aug-2026</span>
                  </div>

                  <div className="p-3 bg-red-50/60 rounded border border-red-200 text-slate-800 leading-relaxed font-sans text-xs">
                    <span className="font-bold text-red-900 block mb-1">Authorization Excerpt:</span>
                    {duplicateDoc.bidderA.excerpt}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100">
                    <span>Signatory: <strong>{duplicateDoc.bidderA.authorSign}</strong></span>
                    <span className="text-emerald-700 font-bold">Doc ID: #DOC-8812-A</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>File: <strong className="text-slate-700">{duplicateDoc.bidderA.docTitle}</strong></span>
                  <span className="text-blue-700 font-medium">Verified PDF Metadata</span>
                </div>
              </div>

              {/* Document B: Concurrent Competitor (XYZ Solutions) */}
              <div className="bg-slate-50 border-2 border-red-300 rounded-xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-red-700 font-mono bg-red-100 px-2 py-0.5 rounded">
                      Bidder B (Concurrent Tender Submission)
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-1">
                      {duplicateDoc.bidderB.name}
                    </h3>
                  </div>
                  <div className="text-right text-[11px] font-mono text-slate-500">
                    <div>Tender: {duplicateDoc.bidderB.tenderId}</div>
                    <div>Date: {duplicateDoc.bidderB.submissionDate}</div>
                  </div>
                </div>

                {/* Document Card Visual Representation */}
                <div className="p-4 rounded-lg bg-white border border-slate-300 text-xs font-mono space-y-3 shadow-inner">
                  <div className="text-center pb-2 border-b border-slate-200 text-slate-700 font-serif font-bold text-sm">
                    SIEMENS GRID SOLUTIONS INDIA LTD.
                  </div>

                  <div className="text-slate-500 text-[11px] flex justify-between">
                    <span>Ref: <strong className="text-red-700 bg-red-50 px-1 py-0.2 rounded border border-red-200">{duplicateDoc.bidderB.refNo}</strong></span>
                    <span>Date: 14-Aug-2026</span>
                  </div>

                  <div className="p-3 bg-red-50/60 rounded border border-red-200 text-slate-800 leading-relaxed font-sans text-xs">
                    <span className="font-bold text-red-900 block mb-1">Authorization Excerpt:</span>
                    {duplicateDoc.bidderB.excerpt}
                  </div>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-600 border-t border-slate-100">
                    <span>Signatory: <strong>{duplicateDoc.bidderB.authorSign}</strong></span>
                    <span className="text-red-700 font-bold">Doc ID: #DOC-9941-B</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between">
                  <span>File: <strong className="text-slate-700">{duplicateDoc.bidderB.docTitle}</strong></span>
                  <span className="text-red-700 font-medium">Flagged by Central GeM Hash Depository</span>
                </div>
              </div>
            </div>

            {/* Matching Features Checklist */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
              <div className="font-bold text-slate-800 uppercase font-mono flex items-center">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 mr-1.5" />
                AI Feature Match Extraction (96% Confidence)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {duplicateDoc.matchedFeatures.map((feat, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-white border border-slate-200 text-slate-800 flex items-center space-x-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Finding & Important Government Governance Disclaimer */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2 text-xs">
              <div className="font-bold text-blue-900 uppercase font-mono">
                AI Finding & Procedural Guidance
              </div>
              <p className="text-blue-950 leading-relaxed">
                “{duplicateDoc.aiFinding}”
              </p>
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-300 text-amber-950 font-medium">
                <strong>Important Governance Rule: </strong>
                Never automatically label this as fraud or disqualify a bidder without formal verification. The OEM may have issued duplicate reference numbers, or a shared distributor may have provided standard letters. Formal confirmation with the manufacturer signatory is required.
              </div>
            </div>

            {/* Officer Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
              <div className="text-xs text-slate-500 font-mono">
                Assigned Officer: <strong className="text-slate-800">Rajesh Kumar, IRSS</strong>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={onOpenClarificationModal}
                  className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Direct Query to OEM Signatory</span>
                </button>
                <button
                  onClick={() => alert('Opening side-by-side pixel overlay and metadata header comparison tool...')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
                >
                  Deep Metadata Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            No Duplicate Documents Detected for this Bidder
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Submitted certificates, authorizations, and test reports show unique hashes with zero duplicate cross-matches in the central tender archive.
          </p>
        </div>
      )}
    </div>
  );
};
