import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Layers, 
  ArrowUpRight, 
  ArrowDownRight, 
  Sparkles, 
  ChevronRight, 
  ShieldCheck, 
  AlertOctagon, 
  ArrowUpDown,
  ExternalLink,
  Users,
  Search
} from 'lucide-react';
import { Tender, OfficerAttentionItem, Bidder } from '../types';

interface DashboardViewProps {
  currentTender: Tender;
  allTenders?: Tender[];
  attentionItems?: OfficerAttentionItem[];
  bidders?: Bidder[];
  allBidders?: Bidder[];
  onSelectBidder: (bidder: Bidder) => void;
  onNavigate: (view: string) => void;
  onSelectAttentionItem?: (item: OfficerAttentionItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  currentTender,
  allTenders = [],
  attentionItems = [],
  bidders,
  allBidders = [],
  onSelectBidder,
  onNavigate,
  onSelectAttentionItem
}) => {
  const [activeQueueTab, setActiveQueueTab] = useState<'ALL' | 'CRITICAL' | 'REVIEW' | 'VERIFIED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'PRIORITY' | 'RISK' | 'DATE'>('PRIORITY');

  const [selectedGateway, setSelectedGateway] = useState<{
    name: string;
    latency: string;
    status: string;
    items: string;
    endpoint: string;
    protocol: string;
    uptime: string;
    lastPing: string;
  } | null>(null);

  const gateways = [
    { name: 'GSTN Taxpayer Registry', latency: '42ms', status: 'ONLINE', items: '1.4M Daily Lookups', endpoint: 'api.gstn.gov.in/v2.1/taxpayer/search', protocol: 'mTLS SHA-256', uptime: '99.98%', lastPing: '3s ago' },
    { name: 'MCA21 Directorship & Filings', latency: '68ms', status: 'ONLINE', items: 'DIN / AOC-4 Records', endpoint: 'mca.gov.in/api/v1/company/master', protocol: 'HTTPS / OAuth2', uptime: '99.94%', lastPing: '12s ago' },
    { name: 'Income Tax CBDT PAN Master', latency: '35ms', status: 'ONLINE', items: 'PAN-Aadhaar Linkage', endpoint: 'incometax.gov.in/pki/pan/verify', protocol: 'mTLS PKI Token', uptime: '99.99%', lastPing: '1s ago' },
    { name: 'CVC & GeM Debarment Repository', latency: '51ms', status: 'ONLINE', items: 'Central Blacklist Sync', endpoint: 'gem.gov.in/api/debarment/v3', protocol: 'HMAC-SHA512', uptime: '100.0%', lastPing: '5s ago' },
    { name: 'NeSL National e-BG Gateway', latency: '84ms', status: 'ONLINE', items: 'SFMS Bank Guarantees', endpoint: 'nesl.co.in/sfms/bg/validate', protocol: 'ISO-20022 / PKI', uptime: '99.92%', lastPing: '24s ago' },
    { name: 'CPPP Prior Contract Repository', latency: '60ms', status: 'ONLINE', items: 'Historical Work Orders', endpoint: 'eprocure.gov.in/api/v2/contracts', protocol: 'Restricted GovNet', uptime: '99.96%', lastPing: '8s ago' }
  ];

  const activeBidders = bidders || allBidders || [];
  const activeAttentionItems = attentionItems || [];

  const criticalCount = activeAttentionItems.filter(i => i.type === 'CRITICAL').length;
  const reviewCount = activeAttentionItems.filter(i => i.type === 'REVIEW').length;
  const verifiedCount = activeAttentionItems.filter(i => i.type === 'VERIFIED').length;

  // Filter & Sort attention queue items
  const filteredQueue = activeAttentionItems
    .filter(item => {
      if (activeQueueTab === 'CRITICAL' && item.type !== 'CRITICAL') return false;
      if (activeQueueTab === 'REVIEW' && item.type !== 'REVIEW') return false;
      if (activeQueueTab === 'VERIFIED' && item.type !== 'VERIFIED') return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          item.bidderName?.toLowerCase().includes(q) ||
          item.title?.toLowerCase().includes(q) ||
          item.reason?.toLowerCase().includes(q) ||
          item.requirement?.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      if (sortBy === 'PRIORITY') {
        const p: Record<string, number> = { 'CRITICAL': 1, 'REVIEW': 2, 'VERIFIED': 3 };
        return (p[a.type] || 9) - (p[b.type] || 9);
      }
      if (sortBy === 'RISK') {
        const r: Record<string, number> = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
        return (r[a.risk] || 9) - (r[b.risk] || 9);
      }
      return 0;
    });

  return (
    <div className="space-y-5 pb-12">
      {/* Top Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
              Tender Ref: {currentTender.tenderNumber}
            </span>
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-0.5">
            Procurement Officer Command Center
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {currentTender.title} • Value: {currentTender.estimatedValue}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            id="btn-upload-new-tender"
            onClick={() => onNavigate('tender-rules')}
            className="flex items-center space-x-1.5 bg-blue-900 hover:bg-blue-800 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-xs transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Extract Tender Rules</span>
          </button>
          <button
            id="btn-view-bidder-ws"
            onClick={() => onNavigate('bidder-workspace')}
            className="flex items-center space-x-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 text-xs font-semibold px-3.5 py-2 rounded-lg transition cursor-pointer"
          >
            <Users className="w-4 h-4 text-slate-600" />
            <span>Bidder Workspace ({activeBidders.length})</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Card 1: Active Tenders */}
        <button 
          id="kpi-card-active-tenders"
          onClick={() => onNavigate('tender-rules')}
          className="text-left bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-blue-400 hover:bg-blue-50/20 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="group-hover:text-blue-900 transition font-semibold text-[11px]">Active Tenders</span>
            <FileText className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1.5 font-mono group-hover:text-blue-900 transition">
            {allTenders.length || 47}
          </div>
          <div className="flex items-center text-[10px] text-emerald-600 font-medium mt-0.5">
            <ArrowUpRight className="w-3 h-3 mr-0.5" />
            <span>4 in evaluation</span>
          </div>
        </button>

        {/* Card 2: Bids Under Verification */}
        <button 
          id="kpi-card-bids-verification"
          onClick={() => onNavigate('bidder-workspace')}
          className="text-left bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-indigo-400 hover:bg-indigo-50/20 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="group-hover:text-indigo-900 transition font-semibold text-[11px]">Bids In Scope</span>
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="text-xl font-extrabold text-slate-900 mt-1.5 font-mono group-hover:text-indigo-900 transition">
            {activeBidders.length}
          </div>
          <div className="flex items-center text-[10px] text-indigo-600 font-medium mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-1"></span>
            <span>All verified</span>
          </div>
        </button>

        {/* Card 3: Critical Attention */}
        <button 
          id="kpi-card-critical-attention"
          onClick={() => setActiveQueueTab('CRITICAL')}
          className={`text-left bg-white border rounded-xl p-3.5 shadow-xs transition group cursor-pointer ${
            activeQueueTab === 'CRITICAL' 
              ? 'border-red-500 ring-2 ring-red-400 bg-red-50/70' 
              : 'border-red-200 hover:border-red-400'
          }`}
        >
          <div className="flex items-center justify-between text-red-700 text-xs font-bold">
            <span className="text-[11px]">Critical</span>
            <AlertOctagon className="w-3.5 h-3.5 text-red-600" />
          </div>
          <div className="text-xl font-extrabold text-red-600 mt-1.5 font-mono">
            {criticalCount}
          </div>
          <div className="text-[10px] text-red-600 font-semibold mt-0.5">
            Immediate Action
          </div>
        </button>

        {/* Card 4: Review Required */}
        <button 
          id="kpi-card-review-required"
          onClick={() => setActiveQueueTab('REVIEW')}
          className={`text-left bg-white border rounded-xl p-3.5 shadow-xs transition group cursor-pointer ${
            activeQueueTab === 'REVIEW' 
              ? 'border-amber-500 ring-2 ring-amber-400 bg-amber-50/70' 
              : 'border-amber-200 hover:border-amber-400'
          }`}
        >
          <div className="flex items-center justify-between text-amber-800 text-xs font-bold">
            <span className="text-[11px]">Review Required</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-extrabold text-amber-700 mt-1.5 font-mono">
            {reviewCount}
          </div>
          <div className="text-[10px] text-amber-700 font-semibold mt-0.5">
            Discrepancies
          </div>
        </button>

        {/* Card 5: Verified Bids */}
        <button 
          id="kpi-card-verified-bids"
          onClick={() => setActiveQueueTab('VERIFIED')}
          className={`text-left bg-white border rounded-xl p-3.5 shadow-xs transition group cursor-pointer ${
            activeQueueTab === 'VERIFIED' 
              ? 'border-emerald-500 ring-2 ring-emerald-400 bg-emerald-50/70' 
              : 'border-emerald-200 hover:border-emerald-400'
          }`}
        >
          <div className="flex items-center justify-between text-emerald-800 text-xs font-bold">
            <span className="text-[11px]">Verified Bids</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-xl font-extrabold text-emerald-700 mt-1.5 font-mono">
            {activeBidders.filter(b => b.riskLevel === 'LOW').length || verifiedCount}
          </div>
          <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
            Clearance ready
          </div>
        </button>

        {/* Card 6: Time Reduction */}
        <button 
          id="kpi-card-avg-time"
          onClick={() => onNavigate('audit-trail')}
          className="text-left bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs hover:border-purple-400 hover:bg-purple-50/20 transition group cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-500 text-xs font-medium">
            <span className="group-hover:text-purple-900 transition font-semibold text-[11px]">Avg Scrutiny</span>
            <Clock className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="text-xl font-extrabold text-purple-700 mt-1.5 font-mono">
            4.2h
          </div>
          <div className="flex items-center text-[10px] text-emerald-600 font-medium mt-0.5">
            <ArrowDownRight className="w-3 h-3 mr-0.5" />
            <span>↓ 68% turnaround</span>
          </div>
        </button>
      </div>

      {/* SMART OFFICER ATTENTION QUEUE */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Queue Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-900 text-white flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase font-mono">
              Priority Scrutiny Queue
            </span>
            <h2 className="text-base font-bold tracking-tight text-white">
              Action Items Requiring Officer Review ({filteredQueue.length})
            </h2>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
            <button
              onClick={() => setActiveQueueTab('ALL')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                activeQueueTab === 'ALL'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              All ({activeAttentionItems.length})
            </button>
            <button
              onClick={() => setActiveQueueTab('CRITICAL')}
              className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                activeQueueTab === 'CRITICAL'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-red-300 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1"></span>
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setActiveQueueTab('REVIEW')}
              className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                activeQueueTab === 'REVIEW'
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'text-amber-300 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1"></span>
              Review ({reviewCount})
            </button>
            <button
              onClick={() => setActiveQueueTab('VERIFIED')}
              className={`flex items-center space-x-1 px-2.5 py-1 text-xs font-semibold rounded-md transition cursor-pointer ${
                activeQueueTab === 'VERIFIED'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-300 hover:text-white'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1"></span>
              Verified ({verifiedCount})
            </button>
          </div>
        </div>

        {/* Search & Sort Subbar */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by bidder, issue, or clause..."
              className="w-full bg-white border border-slate-300 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2.5 text-slate-600">
            <span className="text-[11px] font-semibold text-slate-500 flex items-center">
              <ArrowUpDown className="w-3 h-3 mr-1 text-slate-400" /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-white border border-slate-300 rounded-md px-2 py-1 text-xs text-slate-700 focus:outline-none focus:border-blue-500"
            >
              <option value="PRIORITY">Priority (Critical First)</option>
              <option value="RISK">Risk Level (High to Low)</option>
              <option value="DATE">Verification Timestamp</option>
            </select>
          </div>
        </div>

        {/* Queue Items List */}
        <div className="divide-y divide-slate-200">
          {filteredQueue.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No attention items found matching the selected filter.
            </div>
          ) : (
            filteredQueue.map((item) => {
              const isCritical = item.type === 'CRITICAL';
              const isReview = item.type === 'REVIEW';

              return (
                <div 
                  key={item.id}
                  className={`p-4 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                    isCritical ? 'bg-red-50/15' : isReview ? 'bg-amber-50/15' : 'bg-emerald-50/10'
                  }`}
                >
                  {/* Left: Priority Indicator & Content */}
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    <div className="pt-0.5 shrink-0">
                      {isCritical && (
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-red-100 text-red-700 border border-red-300">
                          <AlertOctagon className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {isReview && (
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-amber-100 text-amber-800 border border-amber-300">
                          <AlertTriangle className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {!isCritical && !isReview && (
                        <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded tracking-wide ${
                          isCritical 
                            ? 'bg-red-600 text-white' 
                            : isReview 
                            ? 'bg-amber-500 text-slate-950 font-bold' 
                            : 'bg-emerald-600 text-white'
                        }`}>
                          {isCritical ? 'CRITICAL' : isReview ? 'REVIEW REQUIRED' : 'VERIFIED'}
                        </span>

                        <span 
                          className="text-xs font-bold text-slate-900 hover:text-blue-700 transition cursor-pointer"
                          onClick={() => {
                            const b = activeBidders.find(x => x.id === item.bidderId);
                            if (b) onSelectBidder(b);
                          }}
                        >
                          {item.bidderName}
                        </span>

                        <span className="text-[11px] text-slate-500 font-mono">
                          • {item.tenderNumber}
                        </span>

                        <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${
                          item.risk === 'HIGH' 
                            ? 'bg-red-100 text-red-800 border border-red-200' 
                            : item.risk === 'MEDIUM' 
                            ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          RISK: {item.risk}
                        </span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-900">
                        {item.title}
                      </h3>

                      <p className="text-xs text-slate-600 leading-relaxed">
                        {item.reason}
                      </p>

                      <div className="flex items-center space-x-3 text-[11px] text-slate-500 pt-0.5">
                        <span className="font-mono text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                          {item.requirement}
                        </span>
                        <span>Verified: {item.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Action CTA */}
                  <div className="flex items-center space-x-2 shrink-0 md:self-center">
                    <button
                      id={`btn-queue-action-${item.id}`}
                      onClick={() => {
                        if (onSelectAttentionItem) onSelectAttentionItem(item);
                        const b = activeBidders.find(x => x.id === item.bidderId);
                        if (b) onSelectBidder(b);
                      }}
                      className={`flex items-center space-x-1.5 text-xs font-bold px-3.5 py-1.5 rounded-lg transition shadow-xs cursor-pointer ${
                        isCritical
                          ? 'bg-red-700 hover:bg-red-800 text-white'
                          : isReview
                          ? 'bg-amber-500 hover:bg-amber-600 text-slate-950'
                          : 'bg-slate-800 hover:bg-slate-900 text-white'
                      }`}
                    >
                      <span>{item.actionLabel}</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Two Column Grid: Active Bidders in Current Tender & Connected Verification Registries */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Active Bidders in Current Tender */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                Scope: {currentTender.tenderNumber}
              </div>
              <h3 className="text-base font-bold text-slate-900">
                Bidders in Tender ({activeBidders.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigate('bidder-workspace')}
              className="text-xs text-blue-700 hover:text-blue-800 font-semibold flex items-center cursor-pointer"
            >
              Open Workspace <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5">
            {activeBidders.map((bidder) => {
              const isLowRisk = bidder.riskLevel === 'LOW';
              const isMediumRisk = bidder.riskLevel === 'MEDIUM';

              return (
                <div
                  key={bidder.id}
                  onClick={() => {
                    onSelectBidder(bidder);
                    onNavigate('bidder-workspace');
                  }}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/20 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-sm text-slate-900 group-hover:text-blue-900 transition">
                        {bidder.name}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                        {bidder.category}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 font-mono">
                      CIN: {bidder.cin} • GSTIN: {bidder.gstin}
                    </div>
                    <div className="flex items-center space-x-3 text-[11px] pt-0.5">
                      <span className="text-emerald-700 font-medium">✓ {bidder.summary.passed} Passed</span>
                      <span className="text-amber-700 font-medium">⚠ {bidder.summary.reviewRequired} Review</span>
                      <span className="text-red-700 font-medium">✕ {bidder.summary.failed} Failed</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                    <div className="flex items-center space-x-2">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-semibold text-slate-400">Score</div>
                        <div className="text-base font-extrabold text-slate-900 font-mono leading-none">
                          {bidder.complianceScore}<span className="text-xs text-slate-400">/100</span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded tracking-wider ${
                        isLowRisk 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : isMediumRisk 
                          ? 'bg-amber-100 text-amber-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {bidder.riskLevel} RISK
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Live Verification Gateways */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3.5">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 font-mono flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              Statutory Integration
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-0.5">
              Live Registry Gateways
            </h3>
          </div>

          <div className="space-y-2">
            {gateways.map((gw, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedGateway(gw)}
                className="w-full text-left p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 hover:border-blue-400 border border-slate-200 flex items-center justify-between text-xs transition group cursor-pointer"
              >
                <div>
                  <div className="font-semibold text-slate-800 group-hover:text-blue-900 flex items-center">
                    <span>{gw.name}</span>
                    <ExternalLink className="w-3 h-3 text-slate-400 ml-1 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">{gw.items}</div>
                </div>
                <div className="text-right">
                  <span className="inline-block px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                    {gw.status}
                  </span>
                  <div className="text-[10px] text-slate-400 font-mono">{gw.latency}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Gateway Details Modal */}
          {selectedGateway && (
            <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-lg w-full p-5 border border-slate-200 shadow-2xl space-y-4 animate-fadeIn">
                <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono">
                        GOVERNMENT API GATEWAY LIVE
                      </span>
                      <h3 className="text-base font-bold text-slate-900 mt-0.5 font-serif">
                        {selectedGateway.name}
                      </h3>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedGateway(null)}
                    className="text-slate-400 hover:text-slate-700 text-lg font-bold p-1 cursor-pointer"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 font-mono">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Status</span>
                      <span className="text-emerald-700 font-bold">● {selectedGateway.status}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Response Latency</span>
                      <span className="text-slate-800 font-bold">{selectedGateway.latency}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Uptime (SLA)</span>
                      <span className="text-slate-800 font-bold">{selectedGateway.uptime}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-sans">Last Heartbeat</span>
                      <span className="text-blue-700 font-bold">{selectedGateway.lastPing}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-900 text-slate-200 rounded-xl space-y-1 font-mono text-[11px]">
                    <div className="text-slate-400 text-[10px]">Secure Endpoint:</div>
                    <div className="text-emerald-400 truncate">https://{selectedGateway.endpoint}</div>
                    <div className="text-slate-400 text-[10px] pt-1">Security Standard:</div>
                    <div className="text-amber-300">{selectedGateway.protocol} • CCA Root Certificate</div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-slate-200">
                  <span className="text-[11px] text-slate-500 font-mono">Registry: NIC-G2G-SEC-01</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        alert(`Ping response from ${selectedGateway.name}: 200 OK (${selectedGateway.latency})`);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-lg border border-slate-300 transition cursor-pointer"
                    >
                      Ping Gateway
                    </button>
                    <button
                      onClick={() => setSelectedGateway(null)}
                      className="px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs rounded-lg transition cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
