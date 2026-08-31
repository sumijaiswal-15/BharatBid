import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  AlertOctagon, 
  Sparkles, 
  ExternalLink, 
  Layers, 
  FileStack, 
  TrendingUp, 
  Gavel, 
  Filter, 
  Search, 
  ChevronRight, 
  Info,
  Building2,
  Send,
  Eye,
  FileCheck2
} from 'lucide-react';
import { Bidder, VerificationItem, StatusType, Tender } from '../types';

interface BidderWorkspaceViewProps {
  currentTender: Tender;
  currentBidder: Bidder;
  allBidders: Bidder[];
  onSelectBidder: (bidder: Bidder) => void;
  onOpenEvidenceDrawer: (item: VerificationItem) => void;
  onNavigate: (view: string) => void;
  onOpenClarificationModal: (item: VerificationItem) => void;
}

export const BidderWorkspaceView: React.FC<BidderWorkspaceViewProps> = ({
  currentTender,
  currentBidder,
  allBidders,
  onSelectBidder,
  onOpenEvidenceDrawer,
  onNavigate,
  onOpenClarificationModal: _onOpenClarificationModal
}) => {
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'VERIFIED' | 'REVIEW' | 'CRITICAL'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const items = currentBidder?.verificationItems || [];
  const filteredItems = items.filter(item => {
    if (statusFilter === 'VERIFIED' && item.status !== 'VERIFIED') return false;
    if (statusFilter === 'REVIEW' && item.status !== 'REVIEW') return false;
    if (statusFilter === 'CRITICAL' && item.status !== 'CRITICAL') return false;
    if (categoryFilter !== 'ALL' && item.category !== categoryFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        item.requirement?.toLowerCase().includes(q) ||
        item.evidence?.toLowerCase().includes(q) ||
        item.source?.toLowerCase().includes(q) ||
        item.tenderClauseRef?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const isLowRisk = currentBidder.riskLevel === 'LOW';
  const isMediumRisk = currentBidder.riskLevel === 'MEDIUM';
  const isHighRisk = currentBidder.riskLevel === 'HIGH';

  // SVG Gauge calculations for semi-circular/circular compliance meter
  const score = currentBidder.complianceScore;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Bidder Selection Header */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-500">
              <span>TENDER: <strong className="text-slate-800 font-bold">{currentTender.tenderNumber}</strong></span>
              <span>•</span>
              <span>{currentTender.category}</span>
            </div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {currentBidder.name}
              </h1>
              <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded font-mono font-semibold border border-slate-200">
                {currentBidder.category}
              </span>
            </div>
            <div className="text-xs text-slate-500 font-mono flex flex-wrap items-center gap-3">
              <span>CIN: <strong className="text-slate-700">{currentBidder.cin}</strong></span>
              <span>•</span>
              <span>GSTIN: <strong className="text-slate-700">{currentBidder.gstin}</strong></span>
              <span>•</span>
              <span>PAN: <strong className="text-slate-700">{currentBidder.pan}</strong></span>
            </div>
          </div>

          {/* Bidder Switcher Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold uppercase text-slate-400 font-mono mr-1">Switch Bidder:</span>
            {allBidders.map(b => (
              <button
                key={b.id}
                onClick={() => onSelectBidder(b)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 ${
                  currentBidder.id === b.id
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300'
                }`}
              >
                <span>{b.name.split(' ')[0]}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono ${
                  b.riskLevel === 'LOW' ? 'bg-emerald-200 text-emerald-900' :
                  b.riskLevel === 'MEDIUM' ? 'bg-amber-200 text-amber-900' :
                  'bg-red-200 text-red-900'
                }`}>
                  {b.complianceScore}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* HERO SECTION: Large Compliance Score & Health Radar Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Compliance Gauge & Summary Badges */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Composite Verification Index
              </div>
              <h2 className="text-base font-bold text-slate-900">
                COMPLIANCE SCORE
              </h2>
            </div>
            <span className={`text-xs font-extrabold uppercase px-2.5 py-1 rounded tracking-wider ${
              isLowRisk ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              isMediumRisk ? 'bg-amber-100 text-amber-800 border border-amber-300' :
              'bg-red-100 text-red-800 border border-red-300'
            }`}>
              {currentBidder.riskLevel} RISK
            </span>
          </div>

          {/* Circular Compliance Meter */}
          <div className="flex items-center justify-center py-2">
            <div className="relative flex items-center justify-center">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke="#e2e8f0"
                  strokeWidth="12"
                  fill="transparent"
                />
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  stroke={isLowRisk ? '#059669' : isMediumRisk ? '#d97706' : '#dc2626'}
                  strokeWidth="12"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000 ease-out"
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight leading-none">
                  {score}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mt-0.5">
                  out of 100
                </span>
              </div>
            </div>
          </div>

          {/* 3 Summary Badges */}
          <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-100">
            <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
              <div className="text-lg font-extrabold text-emerald-700 font-mono leading-none">
                {currentBidder.summary.passed}
              </div>
              <div className="text-[10px] font-bold text-emerald-800 uppercase mt-1">Passed</div>
            </div>

            <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
              <div className="text-lg font-extrabold text-amber-700 font-mono leading-none">
                {currentBidder.summary.reviewRequired}
              </div>
              <div className="text-[10px] font-bold text-amber-800 uppercase mt-1">Review</div>
            </div>

            <div className="p-2 rounded-lg bg-red-50 border border-red-200">
              <div className="text-lg font-extrabold text-red-700 font-mono leading-none">
                {currentBidder.summary.failed}
              </div>
              <div className="text-[10px] font-bold text-red-800 uppercase mt-1">Failed</div>
            </div>
          </div>

          <div className="text-[10.5px] text-slate-500 text-center italic">
            « Score is a decision-support indicator, not an automatic qualification decision. »
          </div>
        </div>

        {/* Right 2 Cols: Compliance Health by Category & AI Recommendation */}
        <div className="lg:col-span-2 space-y-4">
          {/* AI Recommendation Banner */}
          <div className="p-5 rounded-xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white border border-slate-800 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-amber-400 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider">
                    BHARATBID AI RECOMMENDATION
                  </span>
                  <span className="text-xs font-bold text-amber-300 uppercase">
                    {currentBidder.summary.reviewRequired > 0 ? 'REVIEW REQUIRED' : 'QUALIFIED'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-100 mt-1">
                  “Bidder appears substantially compliant, but {currentBidder.summary.reviewRequired} requirements require officer review before a final qualification decision.”
                </h3>
              </div>

              <button
                onClick={() => onNavigate('human-decision')}
                className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-lg shadow transition shrink-0 self-start sm:self-center"
              >
                <Gavel className="w-3.5 h-3.5" />
                <span>Officer Decision Center</span>
              </button>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center gap-4 text-xs">
              <span className="text-emerald-400 font-medium">✓ {currentBidder.summary.passed} Requirements Verified</span>
              <span className="text-amber-400 font-medium">⚠ {currentBidder.summary.reviewRequired} Requirements Flagged for Officer</span>
              <span className="text-red-400 font-medium">✕ {currentBidder.summary.failed} Requirements Non-Compliant</span>
            </div>
          </div>

          {/* Compliance Health Breakdown by Category */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                Category Compliance Health
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                Weights calibrated per CPSE procurement guidelines
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {[
                { label: 'Statutory Compliance', data: currentBidder.categoryScores.statutory, color: 'bg-emerald-500' },
                { label: 'Financial Compliance', data: currentBidder.categoryScores.financial, color: 'bg-blue-600' },
                { label: 'Technical Specifications', data: currentBidder.categoryScores.technical, color: 'bg-purple-600' },
                { label: 'Document Integrity', data: currentBidder.categoryScores.documentIntegrity, color: 'bg-amber-500' },
                { label: 'Tender-Specific Rules', data: currentBidder.categoryScores.tenderSpecific, color: 'bg-indigo-500' },
                { label: 'Behavioural Risk Index', data: currentBidder.categoryScores.behaviouralRisk, color: 'bg-slate-600' }
              ].map((cat, idx) => {
                const pct = Math.round((cat.data.score / cat.data.max) * 100);
                return (
                  <div key={idx} className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                    <div className="flex items-center justify-between mb-1.5 font-semibold text-slate-800">
                      <span>{cat.label}</span>
                      <span className="font-mono text-slate-900 font-bold">
                        {cat.data.score}/{cat.data.max} <span className="text-[10px] text-slate-400">({pct}%)</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full ${cat.color} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK INTELLIGENCE JUMP BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          onClick={() => onNavigate('consistency')}
          className="p-3.5 rounded-xl bg-white border border-amber-200 hover:border-amber-400 hover:bg-amber-50/40 text-left transition flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-800">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-amber-900">
                Address Inconsistency
              </div>
              <div className="text-[11px] text-slate-500">GST vs Udyam vs PAN Diff</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-700" />
        </button>

        <button
          onClick={() => onNavigate('duplicate-docs')}
          className="p-3.5 rounded-xl bg-white border border-red-200 hover:border-red-400 hover:bg-red-50/40 text-left transition flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-red-100 text-red-800">
              <FileStack className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-red-900">
                Duplicate Document Check
              </div>
              <div className="text-[11px] text-slate-500">96% Match with XYZ Solutions</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-red-700" />
        </button>

        <button
          onClick={() => onNavigate('bid-behaviour')}
          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-purple-400 hover:bg-purple-50/40 text-left transition flex items-center justify-between group shadow-sm"
        >
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-800">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 group-hover:text-purple-900">
                Bid Behaviour Intelligence
              </div>
              <div className="text-[11px] text-slate-500">Withdrawal Rate 28.0% Flag</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700" />
        </button>
      </div>

      {/* EVIDENCE-FIRST VERIFICATION TABLE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table Header & Controls */}
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-700 font-mono">
                Evidence-First Architecture
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Tender Requirement Verification Table
            </h2>
            <p className="text-xs text-slate-500">
              Click any row to open the full right-side AI Evidence Drawer with audit logs & primary source payloads.
            </p>
          </div>

          {/* Filter Status Chips */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                statusFilter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({currentBidder.verificationItems.length})
            </button>
            <button
              onClick={() => setStatusFilter('VERIFIED')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 ${
                statusFilter === 'VERIFIED'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Verified</span>
            </button>
            <button
              onClick={() => setStatusFilter('REVIEW')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 ${
                statusFilter === 'REVIEW'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <AlertTriangle className="w-3 h-3" />
              <span>Review ({currentBidder.summary.reviewRequired})</span>
            </button>
            <button
              onClick={() => setStatusFilter('CRITICAL')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition flex items-center space-x-1 ${
                statusFilter === 'CRITICAL'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-red-50 text-red-800 hover:bg-red-100 border border-red-200'
              }`}
            >
              <AlertOctagon className="w-3 h-3" />
              <span>Critical</span>
            </button>
          </div>
        </div>

        {/* Search Subbar */}
        <div className="px-6 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search requirement name, evidence text, or source..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <span className="text-[11px] text-slate-500 font-mono">
            Showing {filteredItems.length} verified conditions
          </span>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 uppercase font-mono text-[11px] border-b border-slate-200">
              <tr>
                <th className="px-5 py-3.5">Requirement & Clause</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-5 py-3.5">Verified Evidence</th>
                <th className="px-4 py-3.5">Source & Type</th>
                <th className="px-4 py-3.5">AI Confidence</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredItems.map((item) => {
                const isVerified = item.status === 'VERIFIED';
                const isReview = item.status === 'REVIEW';
                const isCritical = item.status === 'CRITICAL';

                return (
                  <tr
                    key={item.id}
                    onClick={() => onOpenEvidenceDrawer(item)}
                    className={`hover:bg-blue-50/40 transition cursor-pointer ${
                      isReview ? 'bg-amber-50/15' : isCritical ? 'bg-red-50/20' : ''
                    }`}
                  >
                    {/* Requirement */}
                    <td className="px-5 py-4 max-w-xs">
                      <div className="font-bold text-slate-900 text-xs">
                        {item.requirement}
                      </div>
                      <div className="text-[11px] text-blue-700 font-mono mt-0.5">
                        {item.tenderClauseRef}
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      {isVerified && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[11px] border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Verified</span>
                        </span>
                      )}
                      {isReview && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 font-bold text-[11px] border border-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                          <span>Review</span>
                        </span>
                      )}
                      {isCritical && (
                        <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-md bg-red-100 text-red-800 font-bold text-[11px] border border-red-300">
                          <AlertOctagon className="w-3.5 h-3.5 text-red-700" />
                          <span>Critical</span>
                        </span>
                      )}
                    </td>

                    {/* Evidence Snippet */}
                    <td className="px-5 py-4 max-w-md">
                      <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed">
                        {item.evidence}
                      </p>
                      {item.flagReason && (
                        <div className="text-[11px] text-amber-800 font-medium mt-1 flex items-center">
                          <AlertTriangle className="w-3 h-3 mr-1 shrink-0 text-amber-600" />
                          <span>{item.flagReason}</span>
                        </div>
                      )}
                    </td>

                    {/* Source & Type */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800 text-xs flex items-center">
                        <ShieldCheck className="w-3.5 h-3.5 text-blue-600 mr-1 shrink-0" />
                        <span>{item.source}</span>
                      </div>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono mt-0.5 inline-block">
                        {item.sourceType}
                      </span>
                    </td>

                    {/* Confidence Meter */}
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <div className="w-12 bg-slate-200 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${
                              item.confidence >= 90 ? 'bg-emerald-600' :
                              item.confidence >= 75 ? 'bg-amber-500' : 'bg-red-600'
                            }`}
                            style={{ width: `${item.confidence}%` }}
                          ></div>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-800">
                          {item.confidence}%
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenEvidenceDrawer(item)}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold border border-slate-300 flex items-center space-x-1 ml-auto"
                      >
                        <Eye className="w-3 h-3 text-slate-600" />
                        <span>Evidence →</span>
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
