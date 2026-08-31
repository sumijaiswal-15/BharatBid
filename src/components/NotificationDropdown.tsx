import React, { useState } from 'react';
import { 
  Bell, 
  X, 
  AlertOctagon, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  Clock, 
  ShieldAlert, 
  Check, 
  Building2, 
  ChevronRight,
  Filter,
  Trash2
} from 'lucide-react';
import { OfficerAttentionItem, Tender, Bidder } from '../types';

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  attentionItems: OfficerAttentionItem[];
  currentTender: Tender;
  allBidders: Bidder[];
  onNavigate: (view: string) => void;
  onSelectBidder?: (bidder: Bidder) => void;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onClose,
  attentionItems,
  currentTender,
  allBidders,
  onNavigate,
  onSelectBidder
}) => {
  const [filter, setFilter] = useState<'ALL' | 'CRITICAL' | 'REVIEW' | 'VERIFIED'>('ALL');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const markAllRead = () => {
    const allIds = new Set(attentionItems.map(item => item.id));
    setReadIds(allIds);
  };

  const markAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setReadIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const filteredItems = attentionItems.filter(item => {
    if (filter === 'ALL') return true;
    return item.type === filter;
  });

  const unreadCount = attentionItems.filter(i => !readIds.has(i.id)).length;
  const criticalCount = attentionItems.filter(i => i.type === 'CRITICAL').length;
  const reviewCount = attentionItems.filter(i => i.type === 'REVIEW').length;

  const handleItemClick = (item: OfficerAttentionItem) => {
    // Mark as read
    setReadIds(prev => new Set(prev).add(item.id));

    // Select bidder if available
    const matchedBidder = allBidders.find(b => b.id === item.bidderId || b.name === item.bidderName);
    if (matchedBidder && onSelectBidder) {
      onSelectBidder(matchedBidder);
    }

    // Smart navigation routing based on item title/reason
    if (item.title.toLowerCase().includes('duplicate') || item.title.toLowerCase().includes('hash') || item.title.toLowerCase().includes('similarity')) {
      onNavigate('duplicate-docs');
    } else if (item.title.toLowerCase().includes('address') || item.title.toLowerCase().includes('inconsisten') || item.title.toLowerCase().includes('mismatch')) {
      onNavigate('consistency');
    } else if (item.title.toLowerCase().includes('debarment') || item.title.toLowerCase().includes('conflict') || item.title.toLowerCase().includes('director')) {
      onNavigate('conflict-check');
    } else if (item.type === 'CRITICAL' || item.risk === 'HIGH') {
      onNavigate('human-decision');
    } else {
      onNavigate('bidder-workspace');
    }

    onClose();
  };

  return (
    <>
      {/* Invisible backdrop to dismiss when clicking outside */}
      <div 
        className="fixed inset-0 z-40" 
        onClick={onClose} 
      />

      {/* Notification Card */}
      <div 
        id="notification-popover-menu"
        className="absolute right-0 top-full mt-2 w-96 sm:w-[420px] bg-white rounded-xl shadow-2xl border border-slate-200 z-50 text-slate-900 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150"
      >
        {/* Header */}
        <div className="bg-slate-900 px-4 py-3 border-b border-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-blue-900/60 border border-blue-700 text-amber-400">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-sm tracking-tight">Alerts & Attention Queue</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold font-mono">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 font-mono">
                {currentTender.tenderNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-2 py-1 rounded border border-slate-700 transition cursor-pointer"
                title="Mark all alerts as read"
              >
                Mark read
              </button>
            )}
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 transition cursor-pointer"
              title="Close notifications"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="bg-slate-50 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                filter === 'ALL'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({attentionItems.length})
            </button>
            <button
              onClick={() => setFilter('CRITICAL')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center space-x-1 ${
                filter === 'CRITICAL'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-red-700 hover:bg-red-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400 mr-1"></span>
              Critical ({criticalCount})
            </button>
            <button
              onClick={() => setFilter('REVIEW')}
              className={`px-2 py-1 rounded-md text-[11px] font-bold transition cursor-pointer flex items-center space-x-1 ${
                filter === 'REVIEW'
                  ? 'bg-amber-500 text-slate-950 shadow-xs'
                  : 'text-amber-800 hover:bg-amber-50'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1"></span>
              Review ({reviewCount})
            </button>
          </div>

          <span className="text-[10px] text-slate-400 font-mono">
            {filteredItems.length} items
          </span>
        </div>

        {/* Notification List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
          {filteredItems.length === 0 ? (
            <div className="p-8 text-center text-slate-400">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-500 mb-2 opacity-80" />
              <p className="text-xs font-semibold text-slate-600">No alerts matching filter</p>
              <p className="text-[11px] text-slate-400 mt-0.5">All items in this category are cleared</p>
            </div>
          ) : (
            filteredItems.map(item => {
              const isRead = readIds.has(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3.5 hover:bg-slate-50 transition cursor-pointer relative group flex gap-3 ${
                    !isRead ? 'bg-blue-50/30' : 'bg-white'
                  }`}
                >
                  {/* Status Indicator Icon */}
                  <div className="shrink-0 mt-0.5">
                    {item.type === 'CRITICAL' ? (
                      <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center border border-red-200">
                        <AlertOctagon className="w-4 h-4" />
                      </div>
                    ) : item.type === 'REVIEW' ? (
                      <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center border border-amber-200">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                    ) : (
                      <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center border border-emerald-200">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="text-[11px] font-bold text-slate-900 truncate">
                        {item.bidderName}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono shrink-0">
                        {item.date.split('·')[1]?.trim() || item.date}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-blue-700 transition">
                      {item.title}
                    </h4>

                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {item.reason}
                    </p>

                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="font-mono bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded border border-slate-200">
                        {item.requirement}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => markAsRead(item.id, e)}
                          className="text-slate-400 hover:text-slate-700 p-0.5"
                          title={isRead ? 'Mark as unread' : 'Mark as read'}
                        >
                          <Check className={`w-3 h-3 ${isRead ? 'text-blue-600' : 'text-slate-400'}`} />
                        </button>
                        <span className="font-bold text-blue-700 group-hover:underline flex items-center">
                          <span>{item.actionLabel}</span>
                          <ChevronRight className="w-3 h-3 ml-0.5" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Unread indicator dot */}
                  {!isRead && (
                    <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-blue-600 ring-2 ring-white"></span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            onClick={() => {
              onNavigate('dashboard');
              onClose();
            }}
            className="font-bold text-blue-800 hover:text-blue-900 transition flex items-center space-x-1 cursor-pointer"
          >
            <span>Open Priority Scrutiny Queue</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              onNavigate('human-decision');
              onClose();
            }}
            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 transition cursor-pointer"
          >
            Decision Board →
          </button>
        </div>
      </div>
    </>
  );
};
