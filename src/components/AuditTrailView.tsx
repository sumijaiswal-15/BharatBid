import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ShieldCheck, 
  Sparkles, 
  UserCheck, 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Download,
  Lock
} from 'lucide-react';
import { AuditEvent } from '../types';

interface AuditTrailViewProps {
  auditEvents: AuditEvent[];
  onNavigate: (view: string) => void;
}

export const AuditTrailView: React.FC<AuditTrailViewProps> = ({
  auditEvents,
  onNavigate: _onNavigate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [actorFilter, setActorFilter] = useState<string>('ALL');

  const events = auditEvents || [];
  const filteredEvents = events.filter(ev => {
    if (actorFilter !== 'ALL' && !ev.actor?.includes(actorFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        ev.action?.toLowerCase().includes(q) ||
        ev.actor?.toLowerCase().includes(q) ||
        ev.evidence?.toLowerCase().includes(q) ||
        ev.result?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Procurement Audit Trail
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Chronological log of AI parsing, API cross-checks, officer reviews, and formal determinations.
            </p>
          </div>

          <button
            onClick={() => alert('Exporting full cryptographic audit log as signed PDF/JSON bundle...')}
            className="flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Audit Bundle</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit trail by actor, action, evidence, or result..."
            className="w-full bg-slate-50 border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-slate-500 font-mono text-[11px]">Actor:</span>
          {['ALL', 'BharatBid AI', 'Procurement Officer', 'GSTN', 'MCA21'].map(actor => (
            <button
              key={actor}
              onClick={() => setActorFilter(actor)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition ${
                actorFilter === actor
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {actor}
            </button>
          ))}
        </div>
      </div>

      {/* Vertical Timeline */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
        <div className="relative border-l-2 border-slate-200 ml-4 pl-6 space-y-8">
          {filteredEvents.map((ev) => {
            const isAI = ev.actor.includes('AI');
            const isOfficer = ev.actor.includes('Officer');
            const isCritical = ev.severity === 'critical';
            const isWarn = ev.severity === 'warn';
            const isSuccess = ev.severity === 'success';

            return (
              <div key={ev.id} className="relative group">
                {/* Bullet Node */}
                <div className={`absolute -left-[31px] top-0.5 w-6 h-6 rounded-full border-2 border-white flex items-center justify-center shadow-xs ${
                  isCritical ? 'bg-red-600 text-white' :
                  isWarn ? 'bg-amber-500 text-slate-950' :
                  isSuccess ? 'bg-emerald-600 text-white' :
                  isOfficer ? 'bg-blue-900 text-white' :
                  'bg-indigo-600 text-white'
                }`}>
                  {isAI ? (
                    <Sparkles className="w-3 h-3" />
                  ) : isOfficer ? (
                    <UserCheck className="w-3 h-3" />
                  ) : (
                    <CheckCircle2 className="w-3 h-3" />
                  )}
                </div>

                {/* Event Card */}
                <div className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 space-y-2 transition shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900 text-xs">
                        {ev.action}
                      </span>
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.2 rounded ${
                        isAI ? 'bg-indigo-100 text-indigo-800' :
                        isOfficer ? 'bg-blue-100 text-blue-800' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        {ev.actor} ({ev.actorRole})
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-slate-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1 text-slate-400" />
                      <span>{ev.timestamp}</span>
                    </div>
                  </div>

                  <div className="text-xs text-slate-700">
                    <span className="font-semibold text-slate-800">Result: </span>
                    <span className="font-medium text-slate-900">{ev.result}</span>
                  </div>

                  <div className="p-2.5 rounded bg-white border border-slate-200 text-xs font-mono text-slate-600 space-y-0.5">
                    <div className="text-[10px] text-slate-400 font-bold uppercase">Evidence Reference:</div>
                    <div className="text-slate-800">{ev.evidence}</div>
                    <div className="text-[11px] text-slate-500 font-sans pt-1">{ev.details}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
