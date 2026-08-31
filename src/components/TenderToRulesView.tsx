import React, { useState } from 'react';
import { 
  Sparkles, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  ArrowRight, 
  Code2, 
  Edit3, 
  Check, 
  X, 
  Sliders, 
  ShieldCheck,
  RefreshCw,
  Eye,
  Building2,
  ChevronDown
} from 'lucide-react';
import { Tender, TenderClause } from '../types';

interface TenderToRulesViewProps {
  currentTender: Tender;
  onNavigate: (view: string) => void;
}

export const TenderToRulesView: React.FC<TenderToRulesViewProps> = ({
  currentTender,
  onNavigate
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(7); // 0 to 7
  const [selectedClause, setSelectedClause] = useState<TenderClause>(currentTender.clauses[0]);
  const [ruleApprovedList, setRuleApprovedList] = useState<Record<string, boolean>>({
    'rule-turnover': true,
    'rule-gst': true,
    'rule-oem': true,
    'rule-blacklist': true,
    'rule-local-content': true,
    'rule-past-exp': true,
    'rule-emd': true
  });
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');
  const [showLogicMap, setShowLogicMap] = useState<Record<string, boolean>>({ 'rule-turnover': true });

  const scanStepsList = [
    'Reading tender clauses (142 pages parsed)',
    'Identifying eligibility conditions & qualifying thresholds',
    'Detecting mandatory document declarations & formats',
    'Extracting financial turnover, solvency & net-worth formulas',
    'Identifying technical specifications & experience requirements',
    'Mapping national verification sources (GSTN, MCA21, EPFO, CPPP, CVC)',
    'Creating machine-readable deterministic compliance rules'
  ];

  const handleTriggerReScan = () => {
    setIsScanning(true);
    setScanStep(0);
    const interval = setInterval(() => {
      setScanStep((prev) => {
        if (prev >= 6) {
          clearInterval(interval);
          setIsScanning(false);
          return 7;
        }
        return prev + 1;
      });
    }, 450);
  };

  const handleApproveAll = () => {
    const updated: Record<string, boolean> = {};
    currentTender.clauses.forEach((c) => {
      updated[c.extractedRule.id] = true;
    });
    setRuleApprovedList(updated);
  };

  const filteredClauses = currentTender.clauses.filter((c) => {
    if (activeCategoryFilter === 'ALL') return true;
    return c.extractedRule.category === activeCategoryFilter;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Tender-to-Rules Rule Engine
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Extracted machine-verifiable rules mapped to statutory registries and NIT conditions.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <button
              id="btn-trigger-scan"
              onClick={handleTriggerReScan}
              disabled={isScanning}
              className="flex items-center space-x-2 bg-indigo-900 hover:bg-indigo-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Processing...' : 'Re-Run Rule Extraction'}</span>
            </button>
            <button
              onClick={() => onNavigate('bidder-workspace')}
              className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition cursor-pointer"
            >
              <span>Execute Verification</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Tender Document Source & AI Progress Experience */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-indigo-950 border border-indigo-700/50 text-indigo-300">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="text-xs text-indigo-400 font-mono font-semibold">
                DOCUMENT INGESTED: NIT_{currentTender.tenderNumber.replace(/\//g, '_')}.PDF
              </div>
              <h2 className="text-base font-bold text-slate-100">
                {currentTender.title}
              </h2>
              <div className="text-xs text-slate-400">
                Issued by: <span className="text-slate-200">{currentTender.issuingAuthority}</span> • Est. Value: <span className="text-amber-400 font-mono font-bold">{currentTender.estimatedValue}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800 text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>AI Parser Model: BharatBid-ClauseLLM-v2 (Grounding: Strict)</span>
          </div>
        </div>

        {/* Progress Sequence Animation */}
        <div className="mt-5 space-y-2">
          <div className="text-xs font-bold tracking-wider text-slate-300 uppercase flex items-center justify-between">
            <span className="flex items-center">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 mr-1.5" />
              BharatBid AI is understanding this tender
            </span>
            <span className="text-[11px] text-indigo-400 font-mono">
              {isScanning ? `${Math.min(100, Math.round((scanStep / 6) * 100))}% Completed` : '100% Ingested'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 pt-2">
            {scanStepsList.map((step, idx) => {
              const isDone = !isScanning || idx < scanStep;
              const isCurrent = isScanning && idx === scanStep;

              return (
                <div 
                  key={idx}
                  className={`p-2.5 rounded-lg border text-xs flex items-start space-x-2 transition ${
                    isDone 
                      ? 'bg-slate-800/80 border-slate-700 text-slate-200' 
                      : isCurrent 
                      ? 'bg-indigo-950 border-indigo-500 text-indigo-200 animate-pulse' 
                      : 'bg-slate-950/40 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                    ) : (
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700 inline-block"></span>
                    )}
                  </div>
                  <span className="text-[11px] leading-snug">{step}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 34 Compliance Rules Generated Breakdown */}
        <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xl font-extrabold text-white font-mono flex items-center">
              <span className="text-amber-400 mr-2">34</span> COMPLIANCE RULES GENERATED
            </div>
            <p className="text-xs text-slate-400">
              All rules ready for officer validation before executing automated registry cross-matching.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-2.5 py-1 rounded bg-blue-950 text-blue-300 border border-blue-800 font-mono">
              9 Statutory
            </span>
            <span className="px-2.5 py-1 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 font-mono">
              7 Financial
            </span>
            <span className="px-2.5 py-1 rounded bg-purple-950 text-purple-300 border border-purple-800 font-mono">
              8 Technical
            </span>
            <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800 font-mono">
              6 Tender-Specific
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              4 Document Reqs
            </span>
          </div>
        </div>
      </div>

      {/* NATURAL LANGUAGE → RULE CARD SIDE-BY-SIDE */}
      <div className="bg-white border border-indigo-200 rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-indigo-800 text-indigo-200 text-[10px] font-extrabold uppercase tracking-wider font-mono">
                Clause Extraction
              </span>
              <span className="text-xs font-bold tracking-wider text-indigo-200 uppercase">
                Natural Language → Deterministic Compliance Logic
              </span>
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Live Clause to Structured Rule Transformation
            </h3>
          </div>
          <div className="text-xs text-indigo-200">
            Selected: <span className="font-bold text-white font-mono">{selectedClause.clauseNumber}</span>
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-slate-50/50">
          {/* Left: Original Tender Clause */}
          <div className="bg-white border border-slate-300 rounded-xl p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-slate-500" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600 font-mono">
                  Original Tender Clause
                </span>
              </div>
              <span className="text-xs font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                {selectedClause.clauseNumber}
              </span>
            </div>

            <div className="text-xs font-semibold text-slate-500">
              Section: {selectedClause.sectionTitle}
            </div>

            <blockquote className="p-4 rounded-lg bg-amber-50/60 border-l-4 border-amber-500 text-sm text-slate-800 italic leading-relaxed">
              "{selectedClause.originalText}"
            </blockquote>

            <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2">
              <span>Source: Tender NIT Section III (Eligibility Criteria)</span>
              <span className="text-indigo-700 font-medium">Auto-parsed by NLP Parser</span>
            </div>
          </div>

          {/* Right: AI-Generated Structured Rule */}
          <div className="bg-white border border-indigo-200 rounded-xl p-5 shadow-sm space-y-3.5 bg-gradient-to-br from-white to-indigo-50/20">
            <div className="flex items-center justify-between pb-2 border-b border-indigo-100">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span className="text-xs font-extrabold uppercase tracking-wider text-indigo-900 font-mono">
                  AI-Generated Structured Rule
                </span>
              </div>
              <span className="text-xs font-extrabold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded border border-emerald-300">
                Confidence: {selectedClause.extractedRule.confidenceScore}%
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Requirement</div>
                <div className="font-bold text-slate-900 mt-0.5">{selectedClause.extractedRule.requirement}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Threshold</div>
                <div className="font-bold text-indigo-700 font-mono mt-0.5">{selectedClause.extractedRule.threshold}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Evaluation Period</div>
                <div className="font-medium text-slate-800 mt-0.5">{selectedClause.extractedRule.evaluationPeriod || 'Current Submission'}</div>
              </div>

              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Rule Classification</div>
                <div className="font-bold text-red-600 mt-0.5">{selectedClause.extractedRule.isMandatory ? 'Mandatory (Non-Waivable)' : 'Optional / Preferred'}</div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-white border border-slate-200 text-xs">
              <div className="text-[10px] uppercase font-bold text-slate-400 font-mono">Verification Source</div>
              <div className="font-semibold text-slate-800 mt-0.5">{selectedClause.extractedRule.verificationSource}</div>
            </div>

            {/* Rule Logic Formula View */}
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-mono text-slate-500 font-bold uppercase">Machine-Executable Rule Logic</span>
                <button
                  onClick={() => setShowLogicMap(prev => ({ ...prev, [selectedClause.extractedRule.id]: !prev[selectedClause.extractedRule.id] }))}
                  className="text-indigo-600 hover:text-indigo-800 font-medium text-[10px]"
                >
                  {showLogicMap[selectedClause.extractedRule.id] ? 'Hide Logic' : 'View Rule Logic'}
                </button>
              </div>
              
              {showLogicMap[selectedClause.extractedRule.id] && (
                <div className="p-2.5 rounded bg-slate-900 text-emerald-400 font-mono text-xs border border-slate-800 overflow-x-auto">
                  <code>{selectedClause.extractedRule.ruleLogic}</code>
                </div>
              )}
            </div>

            {/* Officer Action Bar for this Rule */}
            <div className="pt-2 flex items-center justify-between border-t border-indigo-100 text-xs">
              <span className="text-slate-500 font-medium">Status: Approved by Officer</span>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => alert(`Editing rule '${selectedClause.extractedRule.requirement}'. Officer can customize thresholds.`)}
                  className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-medium border border-slate-300 flex items-center space-x-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit Rule</span>
                </button>
                <button
                  onClick={() => {
                    setRuleApprovedList(prev => ({
                      ...prev,
                      [selectedClause.extractedRule.id]: !prev[selectedClause.extractedRule.id]
                    }));
                  }}
                  className={`px-3 py-1 rounded font-bold transition flex items-center space-x-1 ${
                    ruleApprovedList[selectedClause.extractedRule.id]
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  <Check className="w-3 h-3" />
                  <span>{ruleApprovedList[selectedClause.extractedRule.id] ? 'Rule Approved' : 'Approve'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RULE CONFIRMATION & GOVERNANCE TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Review & Approve AI-Generated Requirements
            </h3>
            <p className="text-xs text-slate-500">
              Human-in-the-loop validation: The Procurement Officer reviews every rule definition before bidder evaluations commence.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              id="btn-approve-all-rules"
              onClick={handleApproveAll}
              className="flex items-center space-x-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Approve All Rules ({currentTender.clauses.length})</span>
            </button>
          </div>
        </div>

        {/* Category Filter Chips */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center space-x-2 text-xs overflow-x-auto">
          <span className="text-[11px] font-bold uppercase text-slate-500 mr-2 font-mono">Category:</span>
          {['ALL', 'STATUTORY', 'FINANCIAL', 'TECHNICAL', 'TENDER_SPECIFIC'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategoryFilter(cat)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                activeCategoryFilter === cat
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {cat.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Requirements Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3">Clause & Requirement</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Threshold / Condition</th>
                <th className="px-4 py-3">Mandatory</th>
                <th className="px-4 py-3">Verification Source</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-5 py-3 text-right">Officer Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredClauses.map((clause) => {
                const rule = clause.extractedRule;
                const isSelected = selectedClause.id === clause.id;
                const isApproved = ruleApprovedList[rule.id];

                return (
                  <tr 
                    key={clause.id}
                    onClick={() => setSelectedClause(clause)}
                    className={`hover:bg-slate-50 transition cursor-pointer ${
                      isSelected ? 'bg-indigo-50/60 font-medium' : ''
                    }`}
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-bold text-slate-900">{rule.requirement}</div>
                      <div className="text-[11px] text-slate-500 font-mono">{clause.clauseNumber} • {clause.sectionTitle}</div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono text-[10px]">
                        {rule.category}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-mono text-slate-800 font-semibold">
                      {rule.threshold}
                    </td>
                    <td className="px-4 py-3.5">
                      {rule.isMandatory ? (
                        <span className="text-[10px] font-bold uppercase text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.5 rounded">
                          Mandatory
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                          Optional
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 font-mono text-[11px]">
                      {rule.verificationSource}
                    </td>
                    <td className="px-4 py-3.5">
                      {isApproved ? (
                        <span className="inline-flex items-center text-emerald-700 font-semibold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-amber-700 font-medium text-[11px]">
                          Pending Review
                        </span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-right space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setSelectedClause(clause)}
                        className="px-2 py-1 text-[11px] font-semibold text-blue-700 hover:bg-blue-50 rounded border border-blue-200"
                      >
                        Inspect
                      </button>
                      <button
                        onClick={() => {
                          setRuleApprovedList(prev => ({ ...prev, [rule.id]: !prev[rule.id] }));
                        }}
                        className={`px-2.5 py-1 text-[11px] font-bold rounded ${
                          isApproved
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-emerald-600 text-white hover:bg-emerald-700'
                        }`}
                      >
                        {isApproved ? 'Undo' : 'Approve'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
