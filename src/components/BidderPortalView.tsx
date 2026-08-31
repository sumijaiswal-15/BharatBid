import React, { useState } from 'react';
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Send, 
  Paperclip, 
  ShieldCheck, 
  Download, 
  FileCheck, 
  ExternalLink,
  ChevronRight,
  Info,
  Check,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { Tender, Bidder, AuthUser } from '../types';

interface BidderPortalViewProps {
  currentTender: Tender;
  currentBidder: Bidder;
  currentUser: AuthUser;
  onLogout: () => void;
  onSwitchToOfficer: () => void;
  onOpenAIAssistant?: () => void;
}

export const BidderPortalView: React.FC<BidderPortalViewProps> = ({
  currentTender,
  currentBidder,
  currentUser,
  onLogout,
  onSwitchToOfficer,
  onOpenAIAssistant
}) => {
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'CLARIFICATIONS' | 'DOCUMENTS' | 'COMPLIANCE'>('CLARIFICATIONS');

  // Clarification state
  const [clarifications, setClarifications] = useState([
    {
      id: 'clarif-101',
      subject: 'Discrepancy in Registered Office Address across Statutory Registrations',
      clauseRef: 'Clause 2.4.1 (Statutory Compliance)',
      officerQuery: 'During automated multi-registry verification, the communication address in your Bid Submission Form (B-12, Sector 62, Noida) differs from the MCA21 registered office (C-44, Okhla Phase II, New Delhi) and the GSTIN principal place of business (Ghaziabad, UP). Kindly submit an official explanation along with lease deed / utility bill.',
      raisedDate: '25 Aug 2026, 11:00 AM IST',
      deadline: '27 Aug 2026, 05:00 PM IST',
      status: 'PENDING_RESPONSE' as 'PENDING_RESPONSE' | 'SUBMITTED',
      responseText: '',
      attachedFile: ''
    },
    {
      id: 'clarif-102',
      subject: 'OEM Authorization Letter Verification (Manufacturer Serial Reference)',
      clauseRef: 'Clause 4.2.8 (Manufacturer Authorization)',
      officerQuery: 'Kindly furnish a direct confirmation or manufacturer declaration from Siemens Energy India confirming authorization Ref: SGS/IND/2026/AUTH-8812 was issued for this CPCL tender.',
      raisedDate: '25 Aug 2026, 11:30 AM IST',
      deadline: '28 Aug 2026, 02:00 PM IST',
      status: 'PENDING_RESPONSE' as 'PENDING_RESPONSE' | 'SUBMITTED',
      responseText: '',
      attachedFile: ''
    }
  ]);

  const [selectedClarifId, setSelectedClarifId] = useState<string>('clarif-101');
  const [replyText, setReplyText] = useState('');
  const [selectedAttachment, setSelectedAttachment] = useState('Noida_Office_Lease_Agreement_2026.pdf');
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [submissionSuccessMsg, setSubmissionSuccessMsg] = useState<string | null>(null);

  const selectedClarif = clarifications.find(c => c.id === selectedClarifId) || clarifications[0];

  const handleSubmitResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSubmittingReply(true);
    setTimeout(() => {
      setClarifications(prev => prev.map(c => {
        if (c.id === selectedClarifId) {
          return {
            ...c,
            status: 'SUBMITTED',
            responseText: replyText,
            attachedFile: selectedAttachment
          };
        }
        return c;
      }));
      setIsSubmittingReply(false);
      setSubmissionSuccessMsg(`Response to query #${selectedClarifId} submitted successfully to the CPCL Tender Committee.`);
      setReplyText('');
    }, 600);
  };

  const pendingCount = clarifications.filter(c => c.status === 'PENDING_RESPONSE').length;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans">
      {/* Top Government Strip */}
      <div className="bg-slate-950 text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-200">भारत सरकार | Government of India</span>
            <span className="text-slate-500">•</span>
            <span className="text-slate-400">Vendor Self-Service & Bid Tracking Portal</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px] text-slate-400">
            <span>Logged in as: <strong className="text-amber-400">{currentUser.name}</strong></span>
            <span>|</span>
            <button 
              onClick={onLogout}
              className="text-rose-400 hover:text-rose-300 font-bold"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>

      {/* Bidder Portal Top Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-slate-900 text-sm">{currentUser.name}</span>
                <span className="text-[10px] bg-amber-100 text-amber-900 border border-amber-300 font-bold px-1.5 py-0.2 rounded font-mono">
                  {currentUser.vendorCode || 'VEN-2026-9041'}
                </span>
                <span className="text-[10px] bg-emerald-100 text-emerald-900 font-bold px-1.5 py-0.2 rounded">
                  MSME VERIFIED
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-mono">
                GSTIN: {currentUser.gstin || '07AABCA1234F1Z5'} • CIN: {currentUser.cin || 'U72200DL2018PTC334567'}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onOpenAIAssistant && (
              <button
                onClick={onOpenAIAssistant}
                className="flex items-center space-x-1 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-500 px-3 py-1.5 rounded-lg transition shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Guides</span>
              </button>
            )}
            <button
              onClick={onSwitchToOfficer}
              className="text-xs bg-blue-900 hover:bg-blue-950 text-white font-bold px-3 py-1.5 rounded-lg transition flex items-center space-x-1"
            >
              <span>Switch to Officer Evaluation View</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onLogout}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-300 transition"
            >
              Portal Home
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-6 w-full flex-1">
        {/* Active Tender Banner */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                  {currentTender.tenderNumber}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  <span>STAGE 2: TECHNICAL EVALUATION IN PROGRESS</span>
                </span>
              </div>
              <h1 className="text-base font-bold text-slate-900 mt-1.5">
                {currentTender.title}
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Issuing Authority: <strong className="text-slate-700">{currentTender.issuingAuthority}</strong>
              </p>
            </div>

            <div className="flex items-center space-x-4 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
              <div className="text-right">
                <span className="text-[11px] text-slate-400 font-medium block">EMD Status</span>
                <span className="text-xs font-bold text-emerald-700 flex items-center justify-end space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>e-BG Verified ({currentTender.emdAmount})</span>
                </span>
              </div>
              <div className="text-right pl-4 border-l border-slate-200">
                <span className="text-[11px] text-slate-400 font-medium block">Techno-Commercial Match</span>
                <span className="text-base font-black text-slate-900 font-mono">86 / 100</span>
              </div>
            </div>
          </div>

          {/* Navigation Sub-Tabs */}
          <div className="flex space-x-2 mt-5 pt-4 border-t border-slate-200">
            <button
              onClick={() => setActiveTab('CLARIFICATIONS')}
              className={`flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-lg transition ${
                activeTab === 'CLARIFICATIONS'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>Officer Clarifications ({pendingCount} Action Required)</span>
            </button>

            <button
              onClick={() => setActiveTab('COMPLIANCE')}
              className={`flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-lg transition ${
                activeTab === 'COMPLIANCE'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>My Compliance Checklist</span>
            </button>

            <button
              onClick={() => setActiveTab('DOCUMENTS')}
              className={`flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-lg transition ${
                activeTab === 'DOCUMENTS'
                  ? 'bg-blue-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Submitted Documents Vault</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Officer Clarification Response Desk */}
        {activeTab === 'CLARIFICATIONS' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Query Selection List */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Deficiency & Clarification Notices
              </h3>

              {clarifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    setSelectedClarifId(item.id);
                    setSubmissionSuccessMsg(null);
                  }}
                  className={`p-4 rounded-xl border transition cursor-pointer ${
                    selectedClarifId === item.id
                      ? 'bg-blue-50/70 border-blue-400 shadow-xs'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-blue-900 bg-white border border-blue-200 px-1.5 py-0.5 rounded">
                      {item.clauseRef}
                    </span>
                    {item.status === 'PENDING_RESPONSE' ? (
                      <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Action Required</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center space-x-1">
                        <Check className="w-3 h-3" />
                        <span>Submitted</span>
                      </span>
                    )}
                  </div>

                  <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-2">
                    {item.subject}
                  </h4>

                  <div className="mt-2 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Issued: {item.raisedDate.split(',')[0]}</span>
                    <span className="text-rose-700 font-semibold">Due: {item.deadline.split(',')[0]}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Right: Response Editor */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              {submissionSuccessMsg && (
                <div className="mb-4 bg-emerald-50 border border-emerald-300 rounded-xl p-3.5 text-xs text-emerald-900 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Clarification Recorded & Transmitted</strong>
                    <p className="mt-0.5">{submissionSuccessMsg}</p>
                  </div>
                </div>
              )}

              <div className="border-b border-slate-200 pb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold text-blue-900 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                    Query Reference: {selectedClarif.clauseRef}
                  </span>
                  <span className="text-[10px] font-bold text-slate-500">
                    Deadline: {selectedClarif.deadline}
                  </span>
                </div>

                <h2 className="text-sm font-bold text-slate-900 mt-2">
                  {selectedClarif.subject}
                </h2>
              </div>

              {/* Official Query Box */}
              <div className="mt-4 bg-slate-50 rounded-xl p-4 border border-slate-200 text-xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                  Procurement Committee Query:
                </span>
                <p className="text-slate-800 leading-relaxed">
                  "{selectedClarif.officerQuery}"
                </p>
              </div>

              {/* Response Form */}
              {selectedClarif.status === 'PENDING_RESPONSE' ? (
                <form onSubmit={handleSubmitResponse} className="mt-5 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-800">
                        Official Bidder Explanation / Reply Note
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (selectedClarif.id === 'clarif-101') {
                            setReplyText('We clarify that B-12, Sector 62, Noida is our dedicated Northern Regional Engineering & SCADA Operations Office where project personnel are stationed, whereas C-44 Okhla Phase II is our registered office under MCA21 records. All entities belong to ABC Technologies Pvt. Ltd. (PAN: AABCA1234F). Notarized lease agreement and utility bill attached.');
                          } else {
                            setReplyText('Attached is direct written authorization from Siemens Energy India (Ref: SIEMENS/IND/2026/CPCL-042) confirming project-specific authorization for 400kV GIS supply.');
                          }
                        }}
                        className="text-[11px] text-blue-700 hover:text-blue-900 font-bold"
                      >
                        Auto-Fill Response
                      </button>
                    </div>
                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your official explanation to the tender committee..."
                      className="w-full text-xs p-3 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 focus:bg-white focus:border-blue-700 outline-none leading-relaxed"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 mb-1">
                      Attach Supporting Evidence Document (PDF / Notarized Proof)
                    </label>
                    <div className="flex items-center space-x-2">
                      <select
                        value={selectedAttachment}
                        onChange={(e) => setSelectedAttachment(e.target.value)}
                        className="text-xs bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-800 flex-1 outline-none font-medium"
                      >
                        <option value="Noida_Office_Lease_Agreement_2026.pdf">Noida_Office_Lease_Agreement_2026.pdf (Signed & Notarized)</option>
                        <option value="MCA_Form_INC22_RegisteredOffice.pdf">MCA_Form_INC22_RegisteredOffice.pdf</option>
                        <option value="Siemens_OEM_Letter_Confirmation.pdf">Siemens_OEM_Letter_Confirmation.pdf</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmittingReply}
                      className="w-full bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs py-3 rounded-xl shadow-md transition flex items-center justify-center space-x-2"
                    >
                      {isSubmittingReply ? (
                        <span>Transmitting to Committee...</span>
                      ) : (
                        <>
                          <Send className="w-4 h-4 text-amber-400" />
                          <span>Submit Official Clarification to Committee</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs">
                  <div className="flex items-center space-x-2 text-emerald-900 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your Response Has Been Submitted</span>
                  </div>
                  <p className="mt-2 text-emerald-800 leading-relaxed">
                    "{selectedClarif.responseText || 'Explanation provided with supporting documents.'}"
                  </p>
                  <div className="mt-3 pt-2 border-t border-emerald-200 text-[11px] text-emerald-700 flex items-center justify-between">
                    <span>Attached: <strong className="font-mono">{selectedClarif.attachedFile || 'Supporting_Doc.pdf'}</strong></span>
                    <span>Status: Transmitted to Committee</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Compliance Checklist */}
        {activeTab === 'COMPLIANCE' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Real-time Qualification Checklist for {currentBidder.name}
            </h3>

            <div className="space-y-3">
              {currentBidder.verificationItems.slice(0, 6).map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-900">{item.requirement}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-white border border-slate-200 px-1.5 py-0.2 rounded">
                        {item.tenderClauseRef}
                      </span>
                    </div>
                    <p className="text-slate-600 text-[11px]">{item.evidence}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {item.status === 'VERIFIED' && (
                      <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    )}
                    {item.status === 'REVIEW' && (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-1 rounded flex items-center space-x-1">
                        <AlertTriangle className="w-3.5 h-3.5" />
                        <span>Clarification Requested</span>
                      </span>
                    )}
                    {item.status === 'CRITICAL' && (
                      <span className="text-[11px] font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded flex items-center space-x-1">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>Deficiency Found</span>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Uploaded Documents Vault */}
        {activeTab === 'DOCUMENTS' && (
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-4">
              Submitted Bid Documents & Cryptographic Hashes
            </h3>

            <div className="space-y-3 text-xs">
              {[
                { name: 'Technical_Bid_Cover_Form.pdf', size: '2.4 MB', hash: 'SHA256: 8a4f91...2c0e', status: 'VERIFIED' },
                { name: 'CA_Certified_Turnover_Certificate.pdf', size: '1.1 MB', hash: 'SHA256: e3b0c4...4298', status: 'VERIFIED' },
                { name: 'OEM_Authorization_Siemens.pdf', size: '1.8 MB', hash: 'SHA256: 4f89d1...aa19', status: 'CLARIFICATION_PENDING' },
                { name: 'Make_In_India_Class1_Affidavit.pdf', size: '940 KB', hash: 'SHA256: 198fc2...551b', status: 'VERIFIED' },
                { name: 'EMD_Bank_Guarantee_eBG_3.69Cr.pdf', size: '3.2 MB', hash: 'SHA256: 991da4...cc20', status: 'VERIFIED' }
              ].map((doc, idx) => (
                <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-blue-900" />
                    <div>
                      <strong className="block text-slate-900">{doc.name}</strong>
                      <span className="text-[11px] text-slate-500 font-mono">{doc.size} • {doc.hash}</span>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded ${
                    doc.status === 'VERIFIED'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {doc.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
