import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  FileStack, 
  TrendingUp, 
  ChevronRight, 
  Info,
  ShieldCheck
} from 'lucide-react';
import { Bidder } from '../types';

interface RiskCenterViewProps {
  currentBidder: Bidder;
  onNavigate: (view: string) => void;
}

export const RiskCenterView: React.FC<RiskCenterViewProps> = ({
  currentBidder,
  onNavigate
}) => {
  const [selectedDriver, setSelectedDriver] = useState<string>('address');

  const [hoveredAxis, setHoveredAxis] = useState<string | null>(null);

  // 6 Risk Axes (0 to 100 risk score, where 0 is lowest risk, 100 is critical)
  const isABC = currentBidder.id === 'bidder-abc';
  const riskMetrics = [
    { id: 'compliance', label: 'Compliance Risk', value: isABC ? 20 : currentBidder.riskLevel === 'HIGH' ? 85 : 10, angle: 0, view: 'bidder-workspace', desc: 'Statutory compliance & mandatory criteria completion' },
    { id: 'document', label: 'Document Risk', value: isABC ? 75 : currentBidder.riskLevel === 'HIGH' ? 90 : 5, angle: 60, view: 'duplicate-docs', desc: 'Tampering detection, duplicate OEM references & OCR confidence' },
    { id: 'financial', label: 'Financial Risk', value: isABC ? 15 : currentBidder.riskLevel === 'HIGH' ? 70 : 8, angle: 120, view: 'bidder-workspace', desc: 'Turnover solvency and working capital ratios' },
    { id: 'behavioural', label: 'Behavioural Risk', value: isABC ? 65 : currentBidder.riskLevel === 'HIGH' ? 80 : 12, angle: 180, view: 'bid-behaviour', desc: 'Withdrawal rates, bidding clusters, and cartellization alerts' },
    { id: 'integrity', label: 'Integrity / Debarment', value: isABC ? 35 : currentBidder.riskLevel === 'HIGH' ? 95 : 0, angle: 240, view: 'conflict-check', desc: 'CVC / GeM debarment lists and director integrity' },
    { id: 'conflict', label: 'Conflict Risk', value: isABC ? 30 : currentBidder.riskLevel === 'HIGH' ? 40 : 0, angle: 300, view: 'conflict-check', desc: 'Directorship overlap, common mobile/email & address clustering' }
  ];

  // Calculate SVG Polygon coordinates for radar chart
  const center = 150;
  const maxRadius = 110;

  const points = riskMetrics.map((m, idx) => {
    const angleRad = (idx * 60 - 90) * (Math.PI / 180);
    const r = (m.value / 100) * maxRadius;
    const x = center + r * Math.cos(angleRad);
    const y = center + r * Math.sin(angleRad);
    return `${x},${y}`;
  }).join(' ');

  const gridCircles = [0.25, 0.5, 0.75, 1.0];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Risk Intelligence Center
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Multidimensional risk aggregation across statutory, technical, financial, document integrity, and behavioural vectors.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <span className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs ${
              currentBidder.riskLevel === 'LOW' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' :
              currentBidder.riskLevel === 'MEDIUM' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
              'bg-red-100 text-red-800 border border-red-300'
            }`}>
              OVERALL RISK: {currentBidder.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* RADAR VISUALIZATION & PRIMARY RISK DRIVERS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 6 Cols: Radar Chart */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col items-center justify-center space-y-4">
          <div className="w-full flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
              6-Axis Bidder Risk Radar
            </h3>
            <span className="text-xs text-slate-400 font-mono">
              Outer ring = High Risk (100)
            </span>
          </div>

          {/* SVG Radar Chart */}
          <div className="relative w-full max-w-sm flex items-center justify-center py-2">
            <svg viewBox="0 0 300 300" className="w-full h-auto overflow-visible">
              {/* Radar Grid Circles */}
              {gridCircles.map((level, i) => (
                <circle
                  key={i}
                  cx={center}
                  cy={center}
                  r={maxRadius * level}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={level === 1.0 ? 'none' : '3,3'}
                />
              ))}

              {/* Axis lines */}
              {riskMetrics.map((_, idx) => {
                const angleRad = (idx * 60 - 90) * (Math.PI / 180);
                const x = center + maxRadius * Math.cos(angleRad);
                const y = center + maxRadius * Math.sin(angleRad);
                return (
                  <line
                    key={idx}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="#cbd5e1"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Data Polygon */}
              <polygon
                points={points}
                fill={currentBidder.riskLevel === 'LOW' ? 'rgba(5, 150, 105, 0.25)' : currentBidder.riskLevel === 'MEDIUM' ? 'rgba(217, 119, 6, 0.3)' : 'rgba(220, 38, 38, 0.35)'}
                stroke={currentBidder.riskLevel === 'LOW' ? '#059669' : currentBidder.riskLevel === 'MEDIUM' ? '#d97706' : '#dc2626'}
                strokeWidth="2.5"
                className="transition-all duration-700"
              />

              {/* Data Points */}
              {riskMetrics.map((m, idx) => {
                const angleRad = (idx * 60 - 90) * (Math.PI / 180);
                const r = (m.value / 100) * maxRadius;
                const x = center + r * Math.cos(angleRad);
                const y = center + r * Math.sin(angleRad);
                return (
                  <g 
                    key={idx} 
                    className="cursor-pointer group"
                    onClick={() => onNavigate(m.view)}
                    onMouseEnter={() => setHoveredAxis(m.id)}
                    onMouseLeave={() => setHoveredAxis(null)}
                  >
                    <circle
                      cx={x}
                      cy={y}
                      r={hoveredAxis === m.id ? "7" : "4.5"}
                      fill={currentBidder.riskLevel === 'LOW' ? '#059669' : currentBidder.riskLevel === 'MEDIUM' ? '#d97706' : '#dc2626'}
                      stroke="#fff"
                      strokeWidth="2"
                      className="transition-all"
                    />
                  </g>
                );
              })}

              {/* Axis Labels */}
              {riskMetrics.map((m, idx) => {
                const angleRad = (idx * 60 - 90) * (Math.PI / 180);
                const labelRadius = maxRadius + 22;
                const x = center + labelRadius * Math.cos(angleRad);
                const y = center + labelRadius * Math.sin(angleRad);
                const isHovered = hoveredAxis === m.id;
                return (
                  <text
                    key={idx}
                    x={x}
                    y={y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    onClick={() => onNavigate(m.view)}
                    onMouseEnter={() => setHoveredAxis(m.id)}
                    onMouseLeave={() => setHoveredAxis(null)}
                    className={`text-[10px] font-sans font-bold cursor-pointer transition-all ${
                      isHovered ? 'fill-blue-900 font-extrabold underline' : 'fill-slate-700 hover:fill-blue-700'
                    }`}
                  >
                    {m.label} ({m.value})
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Interactive Axis Tooltip / Helper Card */}
          {hoveredAxis ? (
            <div className="w-full bg-blue-50 border border-blue-200 rounded-lg p-2.5 text-xs text-blue-950 flex items-center justify-between animate-fadeIn">
              <div>
                <span className="font-bold block text-[11px] uppercase text-blue-900">
                  {riskMetrics.find(m => m.id === hoveredAxis)?.label}: {riskMetrics.find(m => m.id === hoveredAxis)?.value}/100 Risk
                </span>
                <span className="text-[11px] text-blue-800">
                  {riskMetrics.find(m => m.id === hoveredAxis)?.desc}
                </span>
              </div>
              <button 
                onClick={() => {
                  const m = riskMetrics.find(item => item.id === hoveredAxis);
                  if (m) onNavigate(m.view);
                }}
                className="ml-2 shrink-0 bg-blue-900 hover:bg-blue-950 text-white font-bold text-[10px] px-2.5 py-1 rounded transition"
              >
                Inspect →
              </button>
            </div>
          ) : (
            <button
              onClick={() => alert('Evaluated dynamically against 42,000+ national CPSE procurement benchmarks (IOCL, NTPC, ONGC, BHEL, SAIL).')}
              className="text-[11px] text-slate-500 hover:text-slate-800 text-center font-mono hover:underline cursor-pointer"
            >
              Evaluated against 42,000+ national CPSE procurement benchmarks ⓘ
            </button>
          )}
        </div>

        {/* Right 6 Cols: Explainable Primary Risk Drivers */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-xl p-6 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-200 font-extrabold text-[10px] uppercase font-mono">
                Risk Attribution
              </span>
              <span className="text-xs font-bold text-slate-500 uppercase font-mono">
                Explainable Risk Decomposition
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Why is this bidder {currentBidder.riskLevel} RISK?
            </h2>
            <p className="text-xs text-slate-500">
              Click each primary driver below to open evidence and review details.
            </p>
          </div>

          {/* 3 Primary Drivers List */}
          <div className="space-y-3">
            {/* Driver 1: Address Inconsistency */}
            <div 
              onClick={() => onNavigate('consistency')}
              className={`p-4 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                selectedDriver === 'address' ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-300' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-amber-100 text-amber-800 mt-0.5">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      1. Address Inconsistency across 3 Statutory Records
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded">
                      WEIGHT: 35%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    GST (Noida) vs Udyam (Ghaziabad) vs Bid Submission Form (Delhi). Requires officer clarification to confirm legal service address.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
            </div>

            {/* Driver 2: Duplicate Document Match */}
            <div 
              onClick={() => onNavigate('duplicate-docs')}
              className="p-4 rounded-xl border bg-slate-50 border-slate-200 hover:border-red-300 hover:bg-red-50/30 transition cursor-pointer flex items-start justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-red-100 text-red-800 mt-0.5">
                  <FileStack className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      2. Duplicate Document Fingerprint (96% Similarity)
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-red-200 text-red-900 px-1.5 py-0.2 rounded">
                      WEIGHT: 40%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    OEM Authorization Letter matched identical reference #SGS/IND/2026/AUTH-8812 with XYZ Solutions in IOCL tender.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
            </div>

            {/* Driver 3: Behavioural Anomaly */}
            <div 
              onClick={() => onNavigate('bid-behaviour')}
              className="p-4 rounded-xl border bg-slate-50 border-slate-200 hover:border-purple-300 hover:bg-purple-50/30 transition cursor-pointer flex items-start justify-between gap-3"
            >
              <div className="flex items-start space-x-3">
                <div className="p-2 rounded-lg bg-purple-100 text-purple-800 mt-0.5">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-extrabold text-slate-900">
                      3. Elevated Tender Withdrawal Frequency (28.0%)
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-purple-200 text-purple-900 px-1.5 py-0.2 rounded">
                      WEIGHT: 25%
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Historical pre-opening withdrawal rate is ~6.7x higher than the CPSE baseline of 4.2%.
                  </p>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 shrink-0 mt-2" />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
            <span className="text-slate-500">Evidence traceable to verified API calls</span>
            <button
              onClick={() => onNavigate('human-decision')}
              className="font-bold text-blue-700 hover:text-blue-900 flex items-center"
            >
              Proceed to Human Decision Center →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
