import React from 'react';
import { 
  LayoutDashboard, 
  Sparkles, 
  Users, 
  Layers, 
  FileStack, 
  TrendingUp, 
  UserCheck, 
  ShieldAlert, 
  Gavel, 
  History, 
  FileText,
  AlertCircle,
  FileCheck,
  BookOpen
} from 'lucide-react';

import { Bidder } from '../types';

interface SidebarProps {
  activeView?: string;
  currentView?: string;
  onNavigate: (view: string) => void;
  criticalCount?: number;
  reviewCount?: number;
  currentBidder?: Bidder;
  onOpenAIAssistant?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  currentView,
  onNavigate,
  criticalCount = 0,
  reviewCount = 0,
  currentBidder: _currentBidder,
  onOpenAIAssistant
}) => {
  const currentActiveView = activeView || currentView || 'dashboard';

  const navItems = [
    {
      group: 'PRIMARY COMMAND',
      items: [
        {
          id: 'dashboard',
          label: 'Command Center',
          icon: LayoutDashboard,
          badge: null
        },
        {
          id: 'queue',
          label: 'Attention Queue',
          icon: AlertCircle,
          badge: {
            text: `${criticalCount + reviewCount}`,
            color: criticalCount > 0 ? 'bg-red-500 text-white' : 'bg-amber-500 text-slate-950'
          }
        },
        {
          id: 'tender-rules',
          label: 'Tender-to-Rules AI',
          icon: Sparkles,
          badge: { text: 'Rules', color: 'bg-indigo-900 text-indigo-300' }
        },
        {
          id: 'bidder-workspace',
          label: 'Bidder Workspace',
          icon: Users,
          badge: null
        }
      ]
    },
    {
      group: 'INTELLIGENCE ENGINES',
      items: [
        {
          id: 'consistency',
          label: 'Consistency Matrix',
          icon: Layers,
          badge: { text: 'Cross-Match', color: 'bg-amber-900/60 text-amber-300' }
        },
        {
          id: 'duplicate-docs',
          label: 'Document Integrity',
          icon: FileStack,
          badge: { text: '96% Match', color: 'bg-red-900/70 text-red-300' }
        },
        {
          id: 'bid-behaviour',
          label: 'Bid Behaviour',
          icon: TrendingUp,
          badge: null
        },
        {
          id: 'conflict-check',
          label: 'Conflict & Relations',
          icon: UserCheck,
          badge: null
        },
        {
          id: 'risk-center',
          label: 'Risk Intelligence',
          icon: ShieldAlert,
          badge: null
        }
      ]
    },
    {
      group: 'DECISION & GOVERNANCE',
      items: [
        {
          id: 'human-decision',
          label: 'Officer Decision',
          icon: Gavel,
          badge: { text: 'DSC Ready', color: 'bg-emerald-900 text-emerald-300' }
        },
        {
          id: 'audit-trail',
          label: 'Audit Trail',
          icon: History,
          badge: null
        },
        {
          id: 'compliance-report',
          label: 'Final Report',
          icon: FileText,
          badge: null
        }
      ]
    }
  ];

  return (
    <aside className="w-60 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col shrink-0 min-h-[calc(100vh-60px)] select-none">
      {/* AI Assistant Quick Guide Button */}
      {onOpenAIAssistant && (
        <div className="p-3 pb-1">
          <button
            onClick={onOpenAIAssistant}
            className="w-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs py-2 px-3 rounded-lg shadow-sm flex items-center justify-between transition"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-slate-950" />
              <span>AI Evaluation Guides</span>
            </div>
            <span className="text-[10px] bg-slate-950 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
              OPEN
            </span>
          </button>
        </div>
      )}

      {/* Navigation Groups */}
      <div className="flex-1 py-3 px-3 space-y-4 overflow-y-auto">
        {navItems.map((group, gIdx) => (
          <div key={gIdx} className="space-y-1">
            <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">
              {group.group}
            </div>
            <div className="space-y-0.5 mt-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentActiveView === item.id || 
                  (item.id === 'bidder-workspace' && currentActiveView === 'workspace');
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-medium rounded-lg transition-colors group ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm font-semibold'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/70 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0">
                      <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                        isActive ? 'text-blue-400' : 'text-slate-400 group-hover:text-slate-200'
                      }`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-medium shrink-0 ml-1.5 ${item.badge.color}`}>
                        {item.badge.text}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Simplified Footer Note */}
      <div className="p-3 bg-slate-950/80 border-t border-slate-800/90 text-xs">
        <div className="flex items-center space-x-1.5 text-slate-400 text-[11px]">
          <FileCheck className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span>GFR 2017 & CVC Compliant</span>
        </div>
      </div>
    </aside>
  );
};
