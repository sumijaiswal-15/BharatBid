/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  MOCK_TENDERS, 
  MOCK_BIDDERS, 
  MOCK_COMPLIANCE_RULES, 
  MOCK_AUDIT_EVENTS,
  MOCK_ATTENTION_ITEMS,
  DEMO_OFFICER_USER,
  DEMO_BIDDER_USER
} from './data/mockData';
import { 
  Tender, 
  Bidder, 
  ComplianceRule, 
  AuditEvent, 
  VerificationItem, 
  StatusType,
  OfficerAttentionItem,
  AuthUser
} from './types';

// Components
import { PublicWebsite } from './components/PublicWebsite';
import { AuthModal } from './components/AuthModal';
import { BidderPortalView } from './components/BidderPortalView';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TenderToRulesView } from './components/TenderToRulesView';
import { BidderWorkspaceView } from './components/BidderWorkspaceView';
import { EvidenceDrawer } from './components/EvidenceDrawer';
import { ConsistencyView } from './components/ConsistencyView';
import { DocumentIntegrityView } from './components/DocumentIntegrityView';
import { BidBehaviourView } from './components/BidBehaviourView';
import { ConflictCheckView } from './components/ConflictCheckView';
import { RiskCenterView } from './components/RiskCenterView';
import { HumanDecisionView } from './components/HumanDecisionView';
import { AuditTrailView } from './components/AuditTrailView';
import { ComplianceReportView } from './components/ComplianceReportView';
import { ClarificationModal } from './components/ClarificationModal';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { Sparkles } from 'lucide-react';

export default function App() {
  // Authentication State (null = Public Website view)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialRole, setAuthModalInitialRole] = useState<'OFFICER' | 'BIDDER'>('OFFICER');

  // AI Assistant & Guides Drawer State
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  // Global Procurement Data State
  const [tenders, setTenders] = useState<Tender[]>(MOCK_TENDERS);
  const [currentTender, setCurrentTender] = useState<Tender>(MOCK_TENDERS[0]);
  
  const [bidders, setBidders] = useState<Bidder[]>(MOCK_BIDDERS);
  const [currentBidder, setCurrentBidder] = useState<Bidder>(MOCK_BIDDERS[0]);

  const [rules, setRules] = useState<ComplianceRule[]>(MOCK_COMPLIANCE_RULES);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(MOCK_AUDIT_EVENTS);
  const [attentionItems, setAttentionItems] = useState<OfficerAttentionItem[]>(MOCK_ATTENTION_ITEMS);

  const criticalCount = attentionItems.filter(i => i.type === 'CRITICAL').length;
  const reviewCount = attentionItems.filter(i => i.type === 'REVIEW').length;

  // Active Officer View State
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Evidence Drawer State
  const [selectedVerificationItem, setSelectedVerificationItem] = useState<VerificationItem | null>(null);

  // Clarification Modal State
  const [isClarificationModalOpen, setIsClarificationModalOpen] = useState(false);
  const [clarificationTargetItem, setClarificationTargetItem] = useState<VerificationItem | null>(null);

  // Handlers
  const handleOpenLogin = (role: 'OFFICER' | 'BIDDER') => {
    setAuthModalInitialRole(role);
    setIsAuthModalOpen(true);
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    if (user.role === 'BIDDER') {
      const matchBidder = bidders.find(b => b.id === user.bidderId) || bidders[0];
      setCurrentBidder(matchBidder);
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView('dashboard');
  };

  const handleSelectTender = (tender: Tender) => {
    setCurrentTender(tender);
  };

  const handleSelectBidder = (bidder: Bidder) => {
    setCurrentBidder(bidder);
  };

  const handleOpenEvidenceDrawer = (item: VerificationItem) => {
    setSelectedVerificationItem(item);
  };

  const handleCloseEvidenceDrawer = () => {
    setSelectedVerificationItem(null);
  };

  const handleOpenClarificationModal = (item?: VerificationItem) => {
    if (item) {
      setClarificationTargetItem(item);
    } else {
      setClarificationTargetItem(currentBidder.verificationItems.find(i => i.status === 'REVIEW') || null);
    }
    setIsClarificationModalOpen(true);
  };

  const handleCloseClarificationModal = () => {
    setIsClarificationModalOpen(false);
    setClarificationTargetItem(null);
  };

  // Officer Override Execution
  const handleOverrideStatus = (item: VerificationItem, newStatus: StatusType, reason: string) => {
    const updatedItems = currentBidder.verificationItems.map(vi => {
      if (vi.id === item.id) {
        return {
          ...vi,
          status: newStatus,
          officerOverride: {
            overriddenBy: currentUser?.name || 'Rajesh Kumar, IRSS (Chief Procurement Officer)',
            timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST',
            newStatus: newStatus,
            reason: reason
          }
        };
      }
      return vi;
    });

    const passed = updatedItems.filter(i => i.status === 'VERIFIED').length;
    const reviewRequired = updatedItems.filter(i => i.status === 'REVIEW').length;
    const failed = updatedItems.filter(i => i.status === 'CRITICAL').length;

    const updatedBidder: Bidder = {
      ...currentBidder,
      verificationItems: updatedItems,
      summary: {
        total: updatedItems.length,
        passed,
        failed,
        reviewRequired
      },
      complianceScore: Math.min(100, Math.round((passed / updatedItems.length) * 100))
    };

    setBidders(prev => prev.map(b => b.id === updatedBidder.id ? updatedBidder : b));
    setCurrentBidder(updatedBidder);
    setSelectedVerificationItem(null);

    // Cryptographic Audit Trail
    const newAuditEvent: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      action: `Officer Override: ${item.requirement}`,
      actor: 'Procurement Officer',
      actorRole: currentUser?.designation || 'Competent Authority (Rajesh Kumar)',
      result: `Status modified from ${item.status} to ${newStatus}`,
      evidence: `Justification: ${reason}`,
      details: `Rule Ref: ${item.tenderClauseRef} • Digital Signature Token DSC-2026-NIC-9912 verified`,
      severity: 'warn'
    };

    setAuditEvents(prev => [newAuditEvent, ...prev]);
  };

  const handleSaveOfficerDecision = (decision: string, remarks: string) => {
    const newAuditEvent: AuditEvent = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + ' IST',
      action: `Formal Techno-Commercial Determination Recorded: ${decision}`,
      actor: 'Procurement Officer',
      actorRole: currentUser?.designation || 'Chief Procurement Officer (Rajesh Kumar, CPCL)',
      result: `Determination: ${decision}`,
      evidence: remarks,
      details: `Bidder: ${currentBidder.name} • Tender: ${currentTender.tenderNumber} • Cryptographically sealed with NIC CCA Digital Certificate`,
      severity: 'critical'
    };

    setAuditEvents(prev => [newAuditEvent, ...prev]);
  };

  // 1. PUBLIC WEBSITE VIEW (Not logged in)
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 font-sans relative">
        <PublicWebsite 
          tenders={tenders}
          onOpenLogin={handleOpenLogin}
          onSelectTender={(t) => setCurrentTender(t)}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />

        <AuthModal 
          isOpen={isAuthModalOpen}
          initialRole={authModalInitialRole}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />

        <AIAssistantDrawer 
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          currentTender={currentTender}
          currentBidder={currentBidder}
        />
      </div>
    );
  }

  // 2. BIDDER / VENDOR PORTAL VIEW
  if (currentUser.role === 'BIDDER') {
    return (
      <div className="min-h-screen bg-slate-100 font-sans relative">
        <BidderPortalView 
          currentTender={currentTender}
          currentBidder={currentBidder}
          currentUser={currentUser}
          onLogout={handleLogout}
          onSwitchToOfficer={() => handleLoginSuccess(DEMO_OFFICER_USER)}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />

        <AIAssistantDrawer 
          isOpen={isAIAssistantOpen}
          onClose={() => setIsAIAssistantOpen(false)}
          currentTender={currentTender}
          currentBidder={currentBidder}
        />
      </div>
    );
  }

  // 3. OFFICER EVALUATION COMMAND SUITE VIEW
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col text-slate-900 font-sans antialiased selection:bg-amber-400 selection:text-slate-950 relative">
      {/* Officer Top Navigation Bar */}
      <Navbar 
        currentTender={currentTender}
        allTenders={tenders}
        onSelectTender={handleSelectTender}
        activeView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        currentUser={currentUser}
        onLogout={handleLogout}
        onSwitchToBidder={() => handleLoginSuccess(DEMO_BIDDER_USER)}
        attentionCount={criticalCount + reviewCount}
        onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
      />

      {/* Main Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar 
          activeView={currentView}
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          criticalCount={criticalCount}
          reviewCount={reviewCount}
          currentBidder={currentBidder}
          onOpenAIAssistant={() => setIsAIAssistantOpen(true)}
        />

        {/* Center Main View Canvas */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 max-w-7xl mx-auto w-full">
          {(currentView === 'dashboard' || currentView === 'queue') && (
            <DashboardView 
              currentTender={currentTender}
              allTenders={tenders}
              attentionItems={attentionItems}
              bidders={bidders}
              allBidders={bidders}
              onSelectBidder={(b) => {
                setCurrentBidder(b);
                setCurrentView('workspace');
              }}
              onNavigate={(v) => setCurrentView(v)}
              onSelectAttentionItem={(item) => {
                const b = bidders.find(x => x.id === item.bidderId);
                if (b) {
                  setCurrentBidder(b);
                  setCurrentView('workspace');
                }
              }}
            />
          )}

          {currentView === 'tender-rules' && (
            <TenderToRulesView 
              currentTender={currentTender}
              rules={rules}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {(currentView === 'workspace' || currentView === 'bidder-workspace') && (
            <BidderWorkspaceView 
              currentTender={currentTender}
              currentBidder={currentBidder}
              allBidders={bidders}
              onSelectBidder={handleSelectBidder}
              onOpenEvidenceDrawer={handleOpenEvidenceDrawer}
              onNavigate={(v) => setCurrentView(v)}
              onOpenClarificationModal={handleOpenClarificationModal}
            />
          )}

          {currentView === 'consistency' && (
            <ConsistencyView 
              currentBidder={currentBidder}
              onOpenClarificationModal={() => handleOpenClarificationModal()}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'duplicate-docs' && (
            <DocumentIntegrityView 
              currentBidder={currentBidder}
              onOpenClarificationModal={() => handleOpenClarificationModal()}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'bid-behaviour' && (
            <BidBehaviourView 
              currentBidder={currentBidder}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'conflict-check' && (
            <ConflictCheckView 
              currentBidder={currentBidder}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'risk-center' && (
            <RiskCenterView 
              currentBidder={currentBidder}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'human-decision' && (
            <HumanDecisionView 
              currentTender={currentTender}
              currentBidder={currentBidder}
              onOpenClarificationModal={() => handleOpenClarificationModal()}
              onNavigate={(v) => setCurrentView(v)}
              onSaveDecision={handleSaveOfficerDecision}
            />
          )}

          {currentView === 'audit-trail' && (
            <AuditTrailView 
              auditEvents={auditEvents}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}

          {currentView === 'compliance-report' && (
            <ComplianceReportView 
              currentTender={currentTender}
              currentBidder={currentBidder}
              onNavigate={(v) => setCurrentView(v)}
            />
          )}
        </main>
      </div>

      {/* Right AI Evidence Traceability Drawer */}
      <EvidenceDrawer 
        item={selectedVerificationItem}
        onClose={handleCloseEvidenceDrawer}
        onOpenClarificationModal={(item) => handleOpenClarificationModal(item)}
        onOverrideStatus={handleOverrideStatus}
      />

      {/* Official Clarification Notice Modal */}
      <ClarificationModal 
        isOpen={isClarificationModalOpen}
        onClose={handleCloseClarificationModal}
        currentBidder={currentBidder}
        currentTender={currentTender}
        item={clarificationTargetItem}
      />

      {/* AI Assistant & Procurement Guides Drawer */}
      <AIAssistantDrawer 
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        currentTender={currentTender}
        currentBidder={currentBidder}
      />
    </div>
  );
}
