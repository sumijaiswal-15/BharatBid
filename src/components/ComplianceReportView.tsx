import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Lock, 
  Building2,
  Clock,
  Sparkles,
  Layers,
  FileStack,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { Bidder, Tender } from '../types';

interface ComplianceReportViewProps {
  currentTender: Tender;
  currentBidder: Bidder;
  onNavigate: (view: string) => void;
}

export const ComplianceReportView: React.FC<ComplianceReportViewProps> = ({
  currentTender,
  currentBidder,
  onNavigate: _onNavigate
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Action Header (hidden in print) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 print:hidden">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Compliance & Techno-Commercial Evaluation Report
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Official evaluation dossier with direct registry cross-references.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={handlePrint}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Dossier</span>
          </button>

          <button
            onClick={() => alert('Downloading official stamped PDF report with cryptographic seal...')}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Signed PDF</span>
          </button>
        </div>
      </div>

      {/* PRINTABLE OFFICIAL GOVERNMENT REPORT DOSSIER */}
      <div className="bg-white border border-slate-300 rounded-xl p-8 shadow-sm space-y-8 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-6 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <div className="text-[11px] font-bold tracking-widest text-slate-500 uppercase font-mono">
                GOVERNMENT OF INDIA • MINISTRY OF PETROLEUM & NATURAL GAS
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                CHENNAI PETROLEUM CORPORATION LIMITED (CPCL)
              </h2>
              <div className="text-xs text-slate-600 font-medium">
                Materials & Techno-Commercial Tender Evaluation Sub-Committee
              </div>
            </div>

            <div className="text-right font-mono text-xs text-slate-600 space-y-0.5">
              <div>Ref: <strong className="text-slate-900">CPCL/TCR/2026/08-1042</strong></div>
              <div>Date: <strong className="text-slate-900">26-Aug-2026</strong></div>
              <div className="text-emerald-700 font-bold">BharatBid Stamped v2.4</div>
            </div>
          </div>

          <div className="p-3 bg-slate-100 rounded text-xs font-mono text-slate-800 grid grid-cols-2 gap-2">
            <div>
              <strong>Tender No:</strong> {currentTender.tenderNumber}
            </div>
            <div>
              <strong>Estimated Value:</strong> ₹{currentTender.estimatedValueCr} Crores
            </div>
            <div>
              <strong>Title:</strong> {currentTender.title}
            </div>
            <div>
              <strong>Bidder:</strong> {currentBidder.name}
            </div>
          </div>
        </div>

        {/* Section 1: Executive Summary */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1">
            1. Executive Evaluation Summary
          </h3>
          <div className="grid grid-cols-4 gap-3 text-center text-xs">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Compliance Index</div>
              <div className="text-xl font-black text-slate-900 font-mono mt-1">{currentBidder.complianceScore} / 100</div>
            </div>
            <div className="p-3 rounded bg-emerald-50 border border-emerald-200">
              <div className="text-[10px] uppercase font-bold text-emerald-800 font-mono">Passed Rules</div>
              <div className="text-xl font-black text-emerald-700 font-mono mt-1">{currentBidder.summary.passed}</div>
            </div>
            <div className="p-3 rounded bg-amber-50 border border-amber-200">
              <div className="text-[10px] uppercase font-bold text-amber-800 font-mono">Review Items</div>
              <div className="text-xl font-black text-amber-700 font-mono mt-1">{currentBidder.summary.reviewRequired}</div>
            </div>
            <div className="p-3 rounded bg-red-50 border border-red-200">
              <div className="text-[10px] uppercase font-bold text-red-800 font-mono">Failed Criteria</div>
              <div className="text-xl font-black text-red-700 font-mono mt-1">{currentBidder.summary.failed}</div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
            <div className="font-bold uppercase font-mono text-[11px] text-blue-900 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-500" />
              AI Automated Recommendation
            </div>
            <p className="leading-relaxed">
              « Bidder appears substantially compliant across statutory registrations (GSTN/PAN/MCA21) and audited financial net worth. However, 3 specific items require officer clarification regarding OEM authorization duplication, principal place address, and pre-bid withdrawal metrics. »
            </p>
          </div>
        </div>

        {/* Section 2: Statutory & Technical Verification Matrix */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1">
            2. Requirement Verification Breakdown
          </h3>

          <table className="w-full text-left text-xs border border-slate-200">
            <thead className="bg-slate-100 uppercase font-mono text-[10px] text-slate-700">
              <tr>
                <th className="p-2.5 border-b border-slate-200">Clause</th>
                <th className="p-2.5 border-b border-slate-200">Requirement</th>
                <th className="p-2.5 border-b border-slate-200">Status</th>
                <th className="p-2.5 border-b border-slate-200">Verified Evidence Summary</th>
                <th className="p-2.5 border-b border-slate-200">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {currentBidder.verificationItems.map((item) => (
                <tr key={item.id}>
                  <td className="p-2 font-mono text-slate-700 font-bold text-[11px] whitespace-nowrap">
                    {item.tenderClauseRef}
                  </td>
                  <td className="p-2 font-semibold text-slate-900 max-w-[160px]">
                    {item.requirement}
                  </td>
                  <td className="p-2 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${
                      item.status === 'VERIFIED' ? 'bg-emerald-100 text-emerald-800' :
                      item.status === 'REVIEW' ? 'bg-amber-100 text-amber-900' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-2 text-slate-700 text-[11px] leading-tight max-w-xs">
                    {item.evidence}
                  </td>
                  <td className="p-2 text-slate-500 font-mono text-[10px] whitespace-nowrap">
                    {item.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 3: Cross-Document & Integrity Findings */}
        <div className="space-y-3">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 font-mono border-b border-slate-200 pb-1">
            3. Discrepancy & Document Integrity Signals
          </h3>
          <div className="p-3.5 rounded bg-slate-50 border border-slate-200 text-xs space-y-2">
            <div className="flex items-center space-x-2 text-amber-800 font-bold">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Multi-Source Address Variance: GSTN/MCA21 (Noida) vs Udyam (Ghaziabad) vs Bid Form (New Delhi).</span>
            </div>
            <div className="flex items-center space-x-2 text-red-800 font-bold">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
              <span>Duplicate OEM Authorization Fingerprint: 96% structural match with concurrent bidder XYZ Solutions.</span>
            </div>
          </div>
        </div>

        {/* Section 4: Officer Final Determination & Cryptographic Signature */}
        <div className="space-y-4 pt-4 border-t-2 border-slate-900">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 font-mono">
            4. Competent Procurement Officer Final Determination
          </h3>

          <div className="p-4 rounded-lg bg-slate-100 border border-slate-300 text-xs space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-mono text-slate-500 uppercase font-bold">Official Determination:</span>
              <span className="px-3 py-1 bg-blue-900 text-white rounded font-mono font-bold text-xs">
                CONDITIONALLY QUALIFIED (PENDING CLARIFICATION)
              </span>
            </div>
            <div className="text-slate-800 leading-relaxed font-serif">
              <strong>Evaluation Remarks: </strong>
              « Bidder fulfills primary technical qualification benchmarks and turnover thresholds. Qualified provisionally subject to submission of satisfactory manufacturer verification letter for OEM authorization ref #SGS/IND/2026/AUTH-8812 within 48 hours. »
            </div>
          </div>

          {/* Signature Block */}
          <div className="grid grid-cols-2 gap-8 pt-8 text-xs font-mono">
            <div className="space-y-1">
              <div className="text-slate-400 uppercase text-[10px]">Tender Committee Member</div>
              <div className="pt-8 border-b border-slate-400 w-48"></div>
              <div className="font-bold text-slate-900">K. Sundararajan</div>
              <div className="text-slate-500 text-[11px]">DGM (Refinery Technical), CPCL</div>
            </div>

            <div className="space-y-1 text-right">
              <div className="text-slate-400 uppercase text-[10px]">Chief Procurement Officer</div>
              <div className="pt-8 border-b border-slate-400 w-48 ml-auto"></div>
              <div className="font-bold text-slate-900">Rajesh Kumar, IRSS</div>
              <div className="text-slate-500 text-[11px]">Chief Procurement Officer, CPCL</div>
              <div className="text-emerald-700 font-bold text-[10px] pt-1">
                [Digitally Signed via NIC DSC Token #9912]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
