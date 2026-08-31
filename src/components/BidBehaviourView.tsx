import React from 'react';
import { 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Activity, 
  BarChart3, 
  Info, 
  Calendar,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { Bidder, BidBehaviourData } from '../types';

interface BidBehaviourViewProps {
  currentBidder: Bidder;
  onNavigate: (view: string) => void;
}

export const BidBehaviourView: React.FC<BidBehaviourViewProps> = ({
  currentBidder,
  onNavigate: _onNavigate
}) => {
  const behaviour: BidBehaviourData = currentBidder.behaviour;

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Bid Behaviour Intelligence
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Historical participation, withdrawal rates, and bidding cluster pattern analysis.
            </p>
          </div>

          <span className="px-3 py-1 rounded bg-amber-100 text-amber-900 border border-amber-300 font-mono font-bold text-xs shrink-0 self-start sm:self-center">
            BEHAVIOURAL RISK: {behaviour.riskLevel}
          </span>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Historical Bids Evaluated</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1">
            {behaviour.totalBidsCount}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Past 24 Months across CPSEs
          </div>
        </div>

        <div className="bg-white border border-amber-200 rounded-xl p-4 shadow-sm bg-gradient-to-br from-white to-amber-50/40">
          <div className="text-xs text-amber-800 font-bold">Observed Withdrawal Rate</div>
          <div className="text-2xl font-extrabold text-amber-700 font-mono mt-1">
            {behaviour.withdrawalRate}%
          </div>
          <div className="text-[11px] text-amber-800 font-medium mt-1">
            Baseline CPSE Avg: <strong className="font-mono">{behaviour.baselineWithdrawalRate}%</strong>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Historical Contract Wins</div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1">
            {behaviour.historicalWins} <span className="text-xs text-slate-400 font-sans">({Math.round((behaviour.historicalWins / behaviour.totalBidsCount) * 100)}% Win Rate)</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Standard competitive win ratio
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
          <div className="text-xs text-slate-500 font-medium">Bid Price Dispersion</div>
          <div className="text-base font-bold text-slate-900 mt-2 truncate">
            {behaviour.bidPriceDispersion}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Pricing pattern analysis
          </div>
        </div>
      </div>

      {/* AI Risk Signal Callout */}
      <div className="bg-white border-2 border-amber-200 rounded-xl p-5 shadow-sm space-y-3">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-extrabold uppercase font-mono">
            AI RISK SIGNAL
          </span>
          <h2 className="text-base font-bold text-slate-900">
            Unusual Tender Participation Pattern Detected
          </h2>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed font-sans">
          “{behaviour.anomalySignal}”
        </p>

        {/* Responsible Government Disclaimer */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-300 text-slate-700 text-xs flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
          <p className="text-[11px] leading-relaxed">
            <strong className="text-slate-900 font-bold">Important Responsible Governance Mandate: </strong>
            Behavioural indicators are risk signals and do NOT establish misconduct or legal culpability. They are synthesized from historical public procurement metadata to enhance officer situational awareness during techno-commercial evaluations.
          </p>
        </div>
      </div>

      {/* Visual Timeline & Monthly Participation Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Activity Bars */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
                Recent 6-Month Bidding vs Withdrawal Activity
              </h3>
              <p className="text-xs text-slate-500">
                Comparing total submissions against pre-opening withdrawals.
              </p>
            </div>
            <div className="flex items-center space-x-4 text-xs font-mono">
              <span className="flex items-center text-slate-700">
                <span className="w-3 h-3 bg-blue-700 rounded mr-1.5 inline-block"></span> Total Bids
              </span>
              <span className="flex items-center text-amber-700">
                <span className="w-3 h-3 bg-amber-500 rounded mr-1.5 inline-block"></span> Withdrawals
              </span>
            </div>
          </div>

          {/* Bar Chart Visualizer */}
          <div className="space-y-3 pt-2">
            {behaviour.monthlyActivity.map((month, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="font-semibold text-slate-700">{month.month}</span>
                  <span className="text-slate-500">
                    Bids: <strong className="text-blue-900">{month.bids}</strong> | Withdrawals: <strong className="text-amber-700">{month.withdrawals}</strong>
                  </span>
                </div>

                <div className="flex h-4 rounded-full overflow-hidden bg-slate-100">
                  <div 
                    className="bg-blue-700 transition-all duration-500" 
                    style={{ width: `${(month.bids / 12) * 100}%` }}
                    title={`Bids: ${month.bids}`}
                  ></div>
                  <div 
                    className="bg-amber-500 transition-all duration-500" 
                    style={{ width: `${(month.withdrawals / 12) * 100}%` }}
                    title={`Withdrawals: ${month.withdrawals}`}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
            <span>Historical Category Focus:</span>
            <div className="flex flex-wrap gap-1.5">
              {behaviour.tenderCategoryFocus.map((cat, i) => (
                <span key={i} className="px-2 py-0.5 rounded bg-white text-slate-700 border border-slate-200 font-mono text-[10px]">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cartel & Collusion Risk Indicators Checklist */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-3.5">
          <div className="pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase font-mono">
              Collusion Risk Indicators
            </h3>
            <p className="text-xs text-slate-500">
              Automated algorithmic checks per Competition Commission of India (CCI) procurement screening guidelines.
            </p>
          </div>

          <div className="space-y-2.5">
            {behaviour.cartelRiskIndicators.map((ind, idx) => (
              <div 
                key={idx}
                className={`p-3 rounded-lg border text-xs space-y-1 ${
                  ind.detected 
                    ? 'bg-amber-50/60 border-amber-200 text-amber-950' 
                    : 'bg-slate-50 border-slate-200 text-slate-700'
                }`}
              >
                <div className="flex items-center justify-between font-semibold">
                  <span>{ind.indicator}</span>
                  {ind.detected ? (
                    <span className="px-1.5 py-0.2 rounded bg-amber-200 text-amber-900 font-mono text-[10px] font-bold">
                      SIGNAL
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">
                      CLEAR
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  {ind.note}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
