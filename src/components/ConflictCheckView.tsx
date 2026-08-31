import React from 'react';
import { 
  UserCheck, 
  AlertTriangle, 
  ShieldCheck, 
  FileText, 
  Info, 
  ExternalLink, 
  CheckCircle2, 
  Network,
  Clock
} from 'lucide-react';
import { Bidder } from '../types';

interface ConflictCheckViewProps {
  currentBidder: Bidder;
  onNavigate: (view: string) => void;
}

export const ConflictCheckView: React.FC<ConflictCheckViewProps> = ({
  currentBidder,
  onNavigate: _onNavigate
}) => {
  const conflicts = currentBidder.conflictChecks;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Conflict & Relationship Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Cross-references MCA21 DIN, directorship networks, and procurement committee disclosures.
            </p>
          </div>

          <span className="px-3 py-1 rounded bg-blue-100 text-blue-900 border border-blue-300 font-mono font-bold text-xs shrink-0 self-start sm:self-center">
            {conflicts.length} RELATIONSHIP SIGNAL
          </span>
        </div>
      </div>

      {/* Conflicts List */}
      {conflicts.length > 0 ? (
        <div className="space-y-4">
          {conflicts.map((conf) => (
            <div 
              key={conf.id}
              className="bg-white border-2 border-amber-200 rounded-xl p-6 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded font-mono">
                      Potential Relationship Detected
                    </span>
                    <h3 className="text-base font-bold text-slate-900 mt-0.5">
                      {conf.relatedEntityOrPerson}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono text-slate-500 font-semibold">
                    Confidence: {conf.confidence}%
                  </span>
                  <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs">
                    REQUIRES OFFICER VERIFICATION
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Bidding Entity</div>
                  <div className="font-bold text-slate-900 mt-1">{conf.entityName}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Associated Relationship</div>
                  <div className="font-bold text-amber-900 mt-1">{conf.role}</div>
                </div>

                <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                  <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Verification Source</div>
                  <div className="font-semibold text-slate-800 mt-1 flex items-center">
                    <ShieldCheck className="w-3.5 h-3.5 text-blue-600 mr-1" />
                    <span>{conf.source}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-1.5">
                <div className="font-bold text-amber-950 uppercase font-mono">
                  Evidence Details & Timeline
                </div>
                <p className="text-slate-800 leading-relaxed">
                  {conf.evidenceDetails}
                </p>
              </div>

              {/* Responsible Protocol Disclaimer */}
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-300 text-slate-700 text-xs flex items-start space-x-2">
                <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                <p className="text-[11px] leading-relaxed">
                  <strong className="text-slate-900 font-bold">Standard Governance Practice: </strong>
                  The system uses prudent phrasing: <em>"Potential relationship requires verification"</em>. This record triggers a standard cooling-period declaration query to ensure zero conflict of interest before technical tender opening.
                </p>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                <span className="text-slate-500 font-mono">Logged: {conf.timestamp}</span>
                <button
                  onClick={() => alert('Procurement Officer Declaration Form generated for evaluation sub-committee confirmation.')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg shadow-sm transition"
                >
                  Generate Committee Declaration Form
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">
            Zero Conflicts of Interest Detected
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Director DIN network and key managerial personnel show no common directorships or commercial associations with the tender evaluation committee.
          </p>
        </div>
      )}
    </div>
  );
};
