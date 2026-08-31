import React, { useState } from 'react';
import { 
  Layers, 
  AlertTriangle, 
  CheckCircle2, 
  Send, 
  FileText, 
  Sparkles, 
  Building2, 
  ShieldCheck, 
  ExternalLink, 
  Check, 
  X,
  Search,
  Eye
} from 'lucide-react';
import { Bidder, CrossDocInconsistency } from '../types';

interface ConsistencyViewProps {
  currentBidder: Bidder;
  onOpenClarificationModal: () => void;
  onNavigate: (view: string) => void;
}

export const ConsistencyView: React.FC<ConsistencyViewProps> = ({
  currentBidder,
  onOpenClarificationModal,
  onNavigate: _onNavigate
}) => {
  const [selectedInconsistency, setSelectedInconsistency] = useState<CrossDocInconsistency | null>(
    currentBidder?.crossDocInconsistencies?.[0] || null
  );

  const matrixFields = [
    {
      field: 'Company Legal Name',
      gst: { status: 'MATCH', value: 'ABC Technologies Pvt. Ltd.' },
      udyam: { status: 'MATCH', value: 'ABC Technologies Private Limited' },
      pan: { status: 'MATCH', value: 'ABC TECHNOLOGIES PRIVATE LIMITED' },
      bidForm: { status: 'MATCH', value: 'ABC Technologies Pvt. Ltd.' },
      mca21: { status: 'MATCH', value: 'ABC TECHNOLOGIES PRIVATE LIMITED' },
      isDiscrepancy: false
    },
    {
      field: 'Registered Office Address',
      gst: { status: 'MISMATCH', value: 'Sector 62, Noida, Gautam Buddha Nagar, UP 201309' },
      udyam: { status: 'MISMATCH', value: 'Plot No. 14, Site IV Industrial Area, Sahibabad, Ghaziabad, UP 201010' },
      pan: { status: 'MISMATCH', value: 'Sector 62, Noida, UP 201309' },
      bidForm: { status: 'MISMATCH', value: '804, Antriksh Bhawan, KG Marg, New Delhi 110001' },
      mca21: { status: 'MATCH', value: 'Sector 62, Noida, UP 201309' },
      isDiscrepancy: true
    },
    {
      field: 'Authorized Signatory / DIN',
      gst: { status: 'MATCH', value: 'Arvind Sharma (DIN 06894120)' },
      udyam: { status: 'MATCH', value: 'Arvind Sharma' },
      pan: { status: 'MATCH', value: 'Corporate PAN Match' },
      bidForm: { status: 'MATCH', value: 'Arvind Sharma (Managing Director)' },
      mca21: { status: 'MATCH', value: 'Arvind Sharma (Active Director)' },
      isDiscrepancy: false
    },
    {
      field: 'GSTIN / Identification',
      gst: { status: 'MATCH', value: '09AAACA1234F1Z8 (Active)' },
      udyam: { status: 'MATCH', value: 'Linked with 09AAACA1234F1Z8' },
      pan: { status: 'MATCH', value: 'PAN: AAACA1234F linked' },
      bidForm: { status: 'MATCH', value: '09AAACA1234F1Z8' },
      mca21: { status: 'MATCH', value: 'CIN: U72200DL2014PTC268491' },
      isDiscrepancy: false
    }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Consistency Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Cross-document comparisons across statutory databases, GSTN, MCA21, and bidder submissions.
            </p>
          </div>

          <button
            onClick={onOpenClarificationModal}
            className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Draft Clarification Notice</span>
          </button>
        </div>
      </div>

      {/* MATRIX COMPARISON OVERVIEW */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
              Multi-Source Cross-Verification Matrix
            </h3>
            <p className="text-xs text-slate-500">
              Comparing submitted Bid Form vs GSTN API, Udyam MSME Registry, Income Tax PAN Master, and MCA21 Master Data.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded border border-amber-300">
            1 Potential Discrepancy Flagged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Verification Field</th>
                <th className="px-4 py-3">GSTN Gateway</th>
                <th className="px-4 py-3">Udyam MSME</th>
                <th className="px-4 py-3">PAN Master</th>
                <th className="px-4 py-3">Submitted Bid Form</th>
                <th className="px-4 py-3">MCA21 Master</th>
                <th className="px-4 py-3 text-right">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {matrixFields.map((row, idx) => (
                <tr 
                  key={idx}
                  className={`transition ${row.isDiscrepancy ? 'bg-amber-50/40 font-medium' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-5 py-3.5 font-bold text-slate-900">
                    {row.field}
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-slate-800 font-sans block">{row.gst.value}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`block font-sans ${row.isDiscrepancy ? 'text-amber-900 font-bold bg-amber-100/60 px-1.5 py-0.5 rounded' : 'text-slate-800'}`}>
                      {row.udyam.value}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-slate-800 font-sans block">{row.pan.value}</span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className={`block font-sans ${row.isDiscrepancy ? 'text-amber-900 font-bold bg-amber-100/60 px-1.5 py-0.5 rounded' : 'text-slate-800'}`}>
                      {row.bidForm.value}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-slate-800 font-sans block">{row.mca21.value}</span>
                  </td>
                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    {row.isDiscrepancy ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[10px] border border-amber-300">
                        <AlertTriangle className="w-3 h-3 text-amber-600" />
                        <span>Discrepancy</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span>Match</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SIDE-BY-SIDE 3-DOCUMENT ADDRESS COMPARISON */}
      {selectedInconsistency && (
        <div className="bg-white border-2 border-amber-300 rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded bg-slate-950 text-amber-400 font-extrabold text-[10px] uppercase font-mono">
                  Cross-Verification
                </span>
                <span className="text-xs font-extrabold tracking-wider uppercase text-slate-950">
                  Side-by-Side Inconsistency Visualizer
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-950 mt-0.5">
                ⚠ Potential Inconsistency: Company Address Differs Across 3 Sources
              </h2>
            </div>

            <span className="px-3 py-1 rounded bg-slate-950 text-white font-mono font-bold text-xs shrink-0 self-start sm:self-center">
              RISK: MEDIUM
            </span>
          </div>

          <div className="p-6 space-y-6">
            {/* 3 Source Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Document 1: GST Certificate */}
              <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="font-bold text-xs text-slate-800 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-700 mr-1.5" />
                    GST Registration (GSTN)
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">API Verified</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Principal Place of Business:</div>
                  <div className="font-semibold text-slate-900 bg-amber-50 p-1.5 rounded border border-amber-200 text-amber-950">
                    Tower B, 4th Floor, Logix Cyber Park, <span className="underline font-bold text-blue-900">Sector 62, Noida</span>, UP 201309
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Match status: <strong className="text-emerald-700">Matches MCA21 & PAN</strong>
                </div>
              </div>

              {/* Document 2: Udyam Certificate */}
              <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="font-bold text-xs text-slate-800 flex items-center">
                    <Building2 className="w-3.5 h-3.5 text-purple-700 mr-1.5" />
                    Udyam Certificate (MSME)
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Registry Match</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Plant / Unit Address:</div>
                  <div className="font-semibold text-slate-900 bg-amber-50 p-1.5 rounded border border-amber-200 text-amber-950">
                    Plot No. 14, Site IV Industrial Area, <span className="underline font-bold text-purple-900">Sahibabad, Ghaziabad</span>, UP 201010
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Match status: <strong className="text-amber-700">Identified as Manufacturing Unit</strong>
                </div>
              </div>

              {/* Document 3: Bid Submission Form */}
              <div className="bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                  <div className="font-bold text-xs text-slate-800 flex items-center">
                    <FileText className="w-3.5 h-3.5 text-amber-700 mr-1.5" />
                    Bid Submission Form A-1
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Submitted PDF</span>
                </div>

                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs font-mono space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400">Declared Corporate Address:</div>
                  <div className="font-semibold text-slate-900 bg-amber-50 p-1.5 rounded border border-amber-200 text-amber-950">
                    804, Antriksh Bhawan, 22 KG Marg, <span className="underline font-bold text-amber-900">Barakhamba Road, New Delhi</span> 110001
                  </div>
                </div>

                <div className="text-[11px] text-slate-500">
                  Match status: <strong className="text-blue-700">Declared Corporate Liaison Office</strong>
                </div>
              </div>
            </div>

            {/* AI Analytical Finding & Recommendation */}
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-blue-900 uppercase font-mono">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>AI Finding & Governance Assessment</span>
              </div>
              <p className="text-blue-950 leading-relaxed">
                {selectedInconsistency.aiAnalysis}
              </p>
              <div className="p-3 rounded-lg bg-white border border-blue-200 text-slate-800">
                <strong className="text-blue-900 font-bold">Recommended Human Officer Action: </strong>
                {selectedInconsistency.recommendedAction}
              </div>
            </div>

            {/* Officer Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
              <div className="text-xs text-slate-500 font-mono">
                Status: <strong className="text-amber-800">OPEN FOR OFFICER DETERMINATION</strong>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={onOpenClarificationModal}
                  className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Request Clarification Notice</span>
                </button>
                <button
                  onClick={() => alert('Discrepancy marked as acceptable after officer review of corporate lease deed.')}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg transition"
                >
                  Accept as Valid Branch Office
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
