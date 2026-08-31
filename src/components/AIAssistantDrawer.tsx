import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Send, 
  BookOpen, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ShieldCheck, 
  ChevronRight, 
  Lightbulb, 
  ArrowRight,
  ExternalLink,
  Bot,
  User,
  Copy,
  Check,
  Building2,
  Scale,
  RefreshCw
} from 'lucide-react';
import { Tender, Bidder, VerificationItem } from '../types';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentTender?: Tender;
  currentBidder?: Bidder;
  activeView?: string;
  onNavigate?: (view: string) => void;
  onOpenClarification?: (item?: VerificationItem) => void;
}

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedActions?: { label: string; view?: string; actionType?: string }[];
  guideRef?: string;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentTender,
  currentBidder,
  activeView: _activeView,
  onNavigate,
  onOpenClarification
}) => {
  const [activeTab, setActiveTab] = useState<'GUIDES' | 'CHAT' | 'CHECKLIST'>('GUIDES');
  const [selectedGuideId, setSelectedGuideId] = useState<string>('gfr-guide');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Chat state
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello Officer! I am your AI Procurement & Evaluation Assistant. I am grounded in GFR 2017, CVC Guidelines, and active tender specifications for ${currentTender?.tenderNumber || 'CPCL/EPC/2026/04'}. How can I assist your evaluation today?`,
      timestamp: 'Just now',
      suggestedActions: [
        { label: 'Evaluation Step-by-Step Guide', view: 'workspace' },
        { label: 'Check Make-in-India Norms', view: 'consistency' },
        { label: 'Review Attention Queue Flags', view: 'dashboard' }
      ]
    }
  ]);

  // Interactive Checklist State
  const [checklist, setChecklist] = useState([
    { id: 'c1', label: 'Verify Bid Security (EMD) or MSME Exemption Certificate', done: true, rule: 'GFR Rule 170' },
    { id: 'c2', label: 'Check CVC & GeM Debarment / Blacklist Status', done: true, rule: 'GFR Rule 151' },
    { id: 'c3', label: 'Cross-Verify MCA21 & GSTN Registered Addresses', done: false, rule: 'Statutory KYC' },
    { id: 'c4', label: 'Confirm Minimum Average Annual Turnover (3-Yr Balance Sheets)', done: true, rule: 'Financial Criteria' },
    { id: 'c5', label: 'Validate OEM Authorization Certificate directly with Manufacturer', done: false, rule: 'Clause 4.2.8' },
    { id: 'c6', label: 'Verify Make in India Local Content Declaration (Class-I / Class-II)', done: true, rule: 'DPIIT Order 2020' },
    { id: 'c7', label: 'Issue Clarification Notices for Flagged Discrepancies', done: false, rule: 'CVC Guideline 2023' },
    { id: 'c8', label: 'Record Techno-Commercial Determination with DSC Token', done: false, rule: 'Final Decision' },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab === 'CHAT') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, activeTab]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const quickPrompts = [
    { label: 'How to handle MCA vs GST address mismatch?', query: 'How should an officer handle an address mismatch between MCA21 registered office and GSTN communication address?' },
    { label: 'Explain GFR Rule 144(xi) Land Border', query: 'What are the mandatory compliance requirements under GFR Rule 144(xi) regarding land border sharing countries?' },
    { label: 'MSME Turnover & EMD Exemption rules', query: 'What exemptions are MSME bidders entitled to regarding EMD and past turnover experience under Indian public procurement rules?' },
    { label: 'Make in India Class-I vs Class-II thresholds', query: 'What is the minimum local content percentage required for Class-I and Class-II local suppliers under the DPIIT Public Procurement Order?' },
    { label: 'Draft Clarification Notice for OEM Auth', query: 'Draft a formal, legally compliant clarification query to a bidder requesting manufacturer confirmation for OEM authorization.' }
  ];

  const handleSendPrompt = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponse = '';
      let actions: { label: string; view?: string; actionType?: string }[] = [];

      const q = queryText.toLowerCase();

      if (q.includes('address') || q.includes('mca') || q.includes('gst')) {
        aiResponse = `**Officer Guide: Addressing Statutory Address Mismatches**\n\n1. **Standard Operating Procedure**: An address discrepancy between MCA21 (Registered Office) and GSTN (Principal Place of Business) is often legitimate due to branch/regional offices, but requires documentary reconciliation.\n2. **Action Required**: Raise a formal clarification under CVC Section 4 asking the bidder to furnish a notarized lease agreement, utility bill, or Board Resolution for the communication address.\n3. **Do Not Disqualify Arbitrarily**: GFR 2017 prohibits summary rejection for minor clerical/branch differences before giving a reasonable 48-72 hour response window.`;
        actions = [
          { label: 'Open Consistency Matrix', view: 'consistency' },
          { label: 'Draft Clarification Notice', actionType: 'clarification' }
        ];
      } else if (q.includes('land border') || q.includes('144(xi)')) {
        aiResponse = `**GFR Rule 144(xi) Compliance Guide (Order No. F.No.6/18/2019-PPD)**\n\n• **Mandatory Rule**: Any bidder from a country sharing a land border with India is eligible to bid ONLY if registered with the Competent Authority (DPIIT Registration Committee) and holds political/security clearance from MEA & MHA.\n• **Verification Check**: Review the bidder's beneficial ownership declaration. If foreign ownership exceeding 10% traces to a land-border country without DPIIT certificate, mark **CRITICAL DEFICIENCY** for disqualification.`;
        actions = [
          { label: 'View Conflict & Relations', view: 'conflict-check' },
          { label: 'Check Bidder Risk Signals', view: 'risk-center' }
        ];
      } else if (q.includes('msme') || q.includes('emd') || q.includes('turnover')) {
        aiResponse = `**MSME Procurement Policy (Public Procurement Policy Order 2012 / GFR Rule 170)**\n\n• **EMD Exemption**: Micro and Small Enterprises (MSEs) registered on Udyam Portal are **100% exempt** from Earnest Money Deposit (EMD).\n• **Prior Turnover / Experience Relaxation**: For non-critical works, procuring entities may relax prior turnover & experience criteria for MSEs, provided quality & technical capability are verified.\n• **Current Status for ${currentBidder?.name || 'ABC Technologies'}**: Verified via Udyam MSME Gateway (Valid Certificate: UDYAM-DL-03-0091244). EMD requirement of ₹3.69 Cr waived.`;
        actions = [
          { label: 'View Bidder Checklist', view: 'bidder-workspace' }
        ];
      } else if (q.includes('make in india') || q.includes('local content') || q.includes('class')) {
        aiResponse = `**Make in India (DPIIT Public Procurement Order 2020)**\n\n• **Class-I Local Supplier**: Local content ≥ 50%. Receives 20% purchase preference margin (L1 matching mechanism).\n• **Class-II Local Supplier**: Local content ≥ 20% but < 50%. Eligible to participate, but no purchase preference.\n• **Non-Local Supplier**: Local content < 20%. Excluded from domestic tenders < ₹200 Cr.\n• **Audit Verification**: ${currentBidder?.name || 'ABC Technologies'} declared **58.4% Local Content (Class-I)** backed by Statutory Auditor Certificate.`;
        actions = [
          { label: 'Inspect Make-in-India Affidavit', view: 'bidder-workspace' }
        ];
      } else if (q.includes('draft') || q.includes('oem')) {
        aiResponse = `**Draft Clarification Notice Generated**\n\n*Subject: Direct Manufacturer Confirmation for OEM Authorization (Clause 4.2.8)*\n\n"Dear Bidder, during technical scrutiny of your submission for ${currentTender?.tenderNumber || 'CPCL/EPC/2026/04'}, OEM Authorization Letter (Ref: SGS/IND/2026/AUTH-8812) could not be automatically validated. Kindly submit direct written confirmation from the principal manufacturer (Siemens Energy) confirming validity for this specific CPCL tender within 48 hours."`;
        actions = [
          { label: 'Send via Official Clarification Modal', actionType: 'clarification' }
        ];
      } else {
        aiResponse = `**AI Procurement Guidance**\n\nRegarding your query on "${queryText}":\n\n• In accordance with GFR 2017 & CPCL standard procurement manual, verify against direct statutory API data (GSTN/MCA21) before manual override.\n• If evidence is missing or ambiguous, utilize the Smart Attention Queue to issue a time-bound clarification notice.\n• All determinations must be signed using Class-3 DSC token for immutable audit compliance.`;
        actions = [
          { label: 'View Command Center', view: 'dashboard' },
          { label: 'Open Decision Desk', view: 'human-decision' }
        ];
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: actions
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const guidesList = [
    {
      id: 'gfr-guide',
      title: 'GFR 2017 & CVC Compliance Rules Cheat Sheet',
      category: 'Statutory Mandate',
      summary: 'Essential rules governing public procurement evaluation, exemptions, and anti-collusion.',
      points: [
        { label: 'GFR Rule 144(xi)', desc: 'Mandatory verification of Land Border Sharing Country restrictions and DPIIT registration.' },
        { label: 'GFR Rule 151', desc: 'Debarment of bidders for corrupt practices, code of integrity breach, or default.' },
        { label: 'GFR Rule 170', desc: 'Bid Security / EMD rules and statutory 100% exemption for Udyam registered MSEs.' },
        { label: 'Rule 153 MII', desc: 'DPIIT Public Procurement Order: Class-I (≥50% local content) gets 20% price matching preference.' },
        { label: 'CVC Circular 02/05/22', desc: 'Strict prohibition of post-bid negotiations except with lowest compliant L1 bidder.' }
      ]
    },
    {
      id: 'eval-steps',
      title: 'Standard 4-Stage Techno-Commercial Evaluation SOP',
      category: 'Evaluation Process',
      summary: 'Standard operating procedure for seamless tender evaluation without litigation risks.',
      points: [
        { label: 'Stage 1: Preliminary Scrutiny', desc: 'Verify EMD/e-BG, Power of Attorney, Bid Submission Fee, and Integrity Pact signatures.' },
        { label: 'Stage 2: Statutory & KYC Validation', desc: 'Automated cross-match of GSTIN, PAN, and MCA21 records to eliminate phantom shell companies.' },
        { label: 'Stage 3: Technical Qualification', desc: 'Scrutinize past work orders, OEM authorizations, annual turnover, and technical capacity.' },
        { label: 'Stage 4: Clarification & Decision', desc: 'Issue formal clarification notices for non-material discrepancies, then record DSC-signed determination.' }
      ]
    },
    {
      id: 'discrepancy-guide',
      title: 'Discrepancy Resolution & Clarification Protocol',
      category: 'Decision Guidance',
      summary: 'How to handle inconsistencies between submitted PDFs and government registry APIs.',
      points: [
        { label: 'Clerical vs Material Deviation', desc: 'Address differences or minor date typos are non-material (clarification permitted). Altering financial bids is strictly material (prohibited).' },
        { label: 'Audit Proof Clarification', desc: 'All queries must be formally logged in BharatBid with a 48 to 72 hour reply window and SHA-256 evidence logging.' },
        { label: 'Officer Override Protocol', desc: 'Officers may override AI risk flags only by recording written justification and digital token authentication.' }
      ]
    },
    {
      id: 'cartel-guide',
      title: 'Cartelization & Bid Rigging Warning Indicators',
      category: 'Fraud Prevention',
      summary: 'Key behavioral patterns indicating illicit coordination among bidders.',
      points: [
        { label: 'Shared Metadata & IP Submissions', desc: 'Bids uploaded from identical IP subnets, identical PDF author metadata, or identical digital signature timestamps.' },
        { label: 'Bid Rotation Patterns', desc: 'Bidders consistently winning in alternating geographic circles or rotating bid withdrawals.' },
        { label: 'Cover Bidding', desc: 'Deliberately high or non-compliant bids submitted solely to create artificial competition for a favored vendor.' }
      ]
    }
  ];

  const selectedGuide = guidesList.find(g => g.id === selectedGuideId) || guidesList[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/50 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 text-slate-900">
        {/* Assistant Header */}
        <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-950 border border-blue-700 flex items-center justify-center text-amber-400 font-bold shadow-inner">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold tracking-tight text-white font-serif">
                  AI Procurement Assistant & Guides
                </h2>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-1.5 py-0.2 rounded font-mono">
                  GFR 2017
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Evaluation Guidelines, Rule Interpretation & Decision Support
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition"
            title="Close Assistant"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="bg-slate-100 px-5 py-2 border-b border-slate-200 flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setActiveTab('GUIDES')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'GUIDES'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Procurement Guides</span>
          </button>

          <button
            onClick={() => setActiveTab('CHAT')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'CHAT'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bot className="w-3.5 h-3.5 text-amber-500" />
            <span>AI Rule Q&A Chat</span>
          </button>

          <button
            onClick={() => setActiveTab('CHECKLIST')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition ${
              activeTab === 'CHECKLIST'
                ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Evaluation Checklist ({checklist.filter(c => c.done).length}/{checklist.length})</span>
          </button>
        </div>

        {/* TAB 1: INTERACTIVE GUIDES */}
        {activeTab === 'GUIDES' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {/* Guide Picker Pills */}
            <div className="grid grid-cols-2 gap-2">
              {guidesList.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGuideId(g.id)}
                  className={`p-3 rounded-xl border text-left transition ${
                    selectedGuideId === g.id
                      ? 'bg-blue-50/80 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 font-mono">
                    {g.category}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                    {g.title}
                  </h4>
                </button>
              ))}
            </div>

            {/* Selected Guide Content */}
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
              <div className="flex items-start justify-between border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-900 px-2 py-0.5 rounded">
                    {selectedGuide.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 mt-1.5">
                    {selectedGuide.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedGuide.summary}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(selectedGuide.points.map(p => `${p.label}: ${p.desc}`).join('\n\n'), selectedGuide.id)}
                  className="text-xs text-slate-500 hover:text-slate-800 p-1.5 rounded-md hover:bg-slate-200 transition shrink-0"
                  title="Copy Guide Summary"
                >
                  {copiedId === selectedGuide.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Guide Points */}
              <div className="mt-4 space-y-3">
                {selectedGuide.points.map((pt, idx) => (
                  <div key={idx} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-xs">
                    <div className="flex items-center space-x-2">
                      <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-900 text-[11px] font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <strong className="text-xs font-bold text-slate-900">{pt.label}</strong>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 pl-7 leading-relaxed">
                      {pt.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Bar */}
            <div className="bg-blue-50/70 rounded-xl p-4 border border-blue-200 flex items-center justify-between">
              <div>
                <strong className="text-xs font-bold text-blue-950 block">Have a specific clause question?</strong>
                <span className="text-[11px] text-blue-800">Ask the AI Assistant for live clause interpretation.</span>
              </div>
              <button
                onClick={() => setActiveTab('CHAT')}
                className="bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs transition flex items-center space-x-1"
              >
                <span>Ask Question</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: AI RULE Q&A CHAT */}
        {activeTab === 'CHAT' && (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Quick Prompt Pills */}
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 overflow-x-auto shrink-0 flex items-center space-x-2 scrollbar-thin">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 font-mono">
                Quick Prompts:
              </span>
              {quickPrompts.map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendPrompt(qp.query)}
                  className="text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 px-2.5 py-1 rounded-full whitespace-nowrap transition shrink-0"
                >
                  {qp.label}
                </button>
              ))}
            </div>

            {/* Messages Thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start space-x-3 ${
                    msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      msg.sender === 'user'
                        ? 'bg-slate-800 text-white'
                        : 'bg-blue-950 text-amber-400 border border-blue-800'
                    }`}
                  >
                    {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>

                  <div
                    className={`max-w-[85%] rounded-xl p-4 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-blue-900 text-white'
                        : 'bg-slate-50 border border-slate-200 text-slate-800 shadow-xs'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>

                    {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200 flex flex-wrap gap-2">
                        {msg.suggestedActions.map((act, aIdx) => (
                          <button
                            key={aIdx}
                            onClick={() => {
                              if (act.actionType === 'clarification' && onOpenClarification) {
                                onOpenClarification();
                                onClose();
                              } else if (act.view && onNavigate) {
                                onNavigate(act.view);
                                onClose();
                              }
                            }}
                            className="bg-white hover:bg-slate-100 text-blue-900 border border-blue-300 text-[11px] font-bold px-2.5 py-1 rounded-md transition flex items-center space-x-1 shadow-xs"
                          >
                            <span>{act.label}</span>
                            <ArrowRight className="w-3 h-3 text-blue-600" />
                          </button>
                        ))}
                      </div>
                    )}

                    <div className={`text-[10px] mt-1.5 text-right font-mono ${
                      msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                    }`}>
                      {msg.timestamp}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex items-center space-x-2 text-xs text-slate-500 italic p-2 bg-slate-50 rounded-lg w-36 border border-slate-200">
                  <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />
                  <span>AI is thinking...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt(inputQuery);
              }}
              className="p-4 bg-white border-t border-slate-200 flex items-center space-x-2 shrink-0"
            >
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Ask about GFR rules, bidder anomalies, or clause interpretation..."
                className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 outline-none focus:border-blue-600 focus:bg-white transition"
              />
              <button
                type="submit"
                disabled={!inputQuery.trim()}
                className="bg-blue-900 hover:bg-blue-950 disabled:bg-slate-300 text-white font-bold p-2.5 rounded-xl transition shadow-xs"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* TAB 3: EVALUATION CHECKLIST */}
        {activeTab === 'CHECKLIST' && (
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 flex items-center justify-between">
              <div>
                <strong className="font-bold block">Officer Evaluation Progress</strong>
                <span>{checklist.filter(c => c.done).length} of {checklist.length} mandatory checkpoints completed</span>
              </div>
              <div className="text-right font-mono font-black text-lg text-emerald-800">
                {Math.round((checklist.filter(c => c.done).length / checklist.length) * 100)}%
              </div>
            </div>

            <div className="space-y-2.5">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex items-start space-x-3 ${
                    item.done
                      ? 'bg-emerald-50/40 border-emerald-300 text-slate-800'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={item.done}
                    onChange={() => {}}
                    className="mt-0.5 w-4 h-4 rounded text-blue-900 border-slate-300 focus:ring-blue-500 cursor-pointer"
                  />
                  <div className="flex-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className={`font-semibold ${item.done ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {item.label}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-1.5 py-0.2 rounded ml-2 shrink-0">
                        {item.rule}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  if (onNavigate) onNavigate('human-decision');
                  onClose();
                }}
                className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
              >
                <Scale className="w-4 h-4 text-amber-400" />
                <span>Proceed to Final Decision Desk</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
