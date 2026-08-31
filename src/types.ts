export type StatusType = 'VERIFIED' | 'REVIEW' | 'CRITICAL' | 'NOT_APPLICABLE' | 'INFO';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';
export type RequirementCategory = 
  | 'STATUTORY' 
  | 'FINANCIAL' 
  | 'TECHNICAL' 
  | 'TENDER_SPECIFIC' 
  | 'DOCUMENT_INTEGRITY' 
  | 'BEHAVIOURAL';

export interface TenderClause {
  id: string;
  clauseNumber: string;
  sectionTitle: string;
  originalText: string;
  extractedRule: ComplianceRule;
}

export interface ComplianceRule {
  id: string;
  requirement: string;
  category: RequirementCategory;
  threshold: string;
  evaluationPeriod?: string;
  isMandatory: boolean;
  verificationSource: string;
  applicability: string;
  status: 'PENDING_APPROVAL' | 'APPROVED' | 'MODIFIED' | 'EXCLUDED';
  ruleLogic: string;
  confidenceScore: number;
}

export interface VerificationItem {
  id: string;
  requirement: string;
  category: RequirementCategory;
  status: StatusType;
  evidence: string;
  evidenceSnippet?: string;
  source: string;
  sourceType: 'API_DIRECT' | 'PORTAL_RECORD' | 'SUBMITTED_DOC' | 'CROSS_MATCH' | 'GOV_REGISTRY';
  confidence: number;
  timestamp: string;
  aiReasoning: string;
  tenderClauseRef: string;
  ruleLogic: string;
  verifiedDataPoints?: { label: string; value: string; isMatch: boolean }[];
  submittedDocUrl?: string;
  flagReason?: string;
  clarificationSent?: boolean;
  officerOverride?: {
    overriddenBy: string;
    newStatus: StatusType;
    reason: string;
    comment: string;
    timestamp: string;
  };
}

export interface CrossDocInconsistency {
  id: string;
  field: string;
  risk: RiskLevel;
  sources: {
    gst: { value: string; docName: string; verifiedAt: string; match: boolean };
    udyam: { value: string; docName: string; verifiedAt: string; match: boolean };
    pan: { value: string; docName: string; verifiedAt: string; match: boolean };
    bidForm: { value: string; docName: string; verifiedAt: string; match: boolean };
    mca21?: { value: string; docName: string; verifiedAt: string; match: boolean };
  };
  finding: string;
  aiAnalysis: string;
  recommendedAction: string;
  status: 'OPEN_REVIEW' | 'CLARIFICATION_REQUESTED' | 'EXPLAINED' | 'DISMISSED';
}

export interface DuplicateDocItem {
  id: string;
  documentType: string;
  bidderA: {
    name: string;
    tenderId: string;
    docTitle: string;
    submissionDate: string;
    excerpt: string;
    authorSign: string;
    refNo: string;
  };
  bidderB: {
    name: string;
    tenderId: string;
    docTitle: string;
    submissionDate: string;
    excerpt: string;
    authorSign: string;
    refNo: string;
  };
  similarityScore: number;
  matchedFeatures: string[];
  aiFinding: string;
  status: 'REVIEW_REQUIRED' | 'VERIFIED_LEGITIMATE' | 'SUSPECT_FLAGGED';
}

export interface BidBehaviourData {
  bidderId: string;
  bidderName: string;
  totalBidsCount: number;
  participationFrequencyScore: number;
  withdrawalRate: number; // e.g. 28%
  baselineWithdrawalRate: number; // e.g. 4.2%
  tenderCategoryFocus: string[];
  historicalWins: number;
  bidPriceDispersion: string;
  anomalySignal: string;
  riskLevel: RiskLevel;
  monthlyActivity: { month: string; bids: number; withdrawals: number }[];
  cartelRiskIndicators: { indicator: string; detected: boolean; note: string }[];
}

export interface ConflictCheckItem {
  id: string;
  entityName: string;
  relatedEntityOrPerson: string;
  role: string;
  relationshipType: string;
  source: string;
  confidence: number;
  status: 'REQUIRES_VERIFICATION' | 'VERIFIED_CLEAR' | 'POTENTIAL_CONFLICT';
  evidenceDetails: string;
  timestamp: string;
}

export interface Bidder {
  id: string;
  name: string;
  cin: string;
  gstin: string;
  pan: string;
  category: 'MSME' | 'Large Enterprise' | 'Startup' | 'Public Sector';
  complianceScore: number; // 0 - 100
  riskLevel: RiskLevel;
  summary: {
    passed: number;
    failed: number;
    reviewRequired: number;
    total: number;
  };
  categoryScores: {
    statutory: { score: number; max: number };
    financial: { score: number; max: number };
    technical: { score: number; max: number };
    documentIntegrity: { score: number; max: number };
    tenderSpecific: { score: number; max: number };
    behaviouralRisk: { score: number; max: number };
  };
  verificationItems: VerificationItem[];
  crossDocInconsistencies: CrossDocInconsistency[];
  duplicateDocs: DuplicateDocItem[];
  behaviour: BidBehaviourData;
  conflictChecks: ConflictCheckItem[];
  officerDecision?: {
    status: 'NOT_DECIDED' | 'QUALIFIED' | 'CONDITIONAL_QUALIFIED' | 'DISQUALIFIED' | 'CLARIFICATION_REQUIRED';
    officerName: string;
    designation: string;
    timestamp?: string;
    remarks?: string;
    digitalSignature?: string;
  };
}

export interface Tender {
  id: string;
  tenderNumber: string;
  title: string;
  issuingAuthority: string;
  estimatedValue: string;
  emdAmount: string;
  publishDate: string;
  closingDate: string;
  category: string;
  bidsUnderVerificationCount: number;
  status: 'ACTIVE_EVALUATION' | 'PUBLISHED' | 'EVALUATION_COMPLETED' | 'AWARDED';
  clauses: TenderClause[];
  bidders: Bidder[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actor: 'BharatBid AI' | 'Procurement Officer' | 'GSTN Gateway' | 'MCA21 System' | 'ITR Service' | 'CVC Registry';
  actorRole: string;
  action: string;
  evidence: string;
  result: string;
  details: string;
  severity: 'info' | 'warn' | 'critical' | 'success';
}

export interface OfficerAttentionItem {
  id: string;
  bidderId: string;
  bidderName: string;
  tenderNumber: string;
  type: 'CRITICAL' | 'REVIEW' | 'VERIFIED';
  title: string;
  reason: string;
  risk: RiskLevel;
  requirement: string;
  date: string;
  actionLabel: string;
}

export type UserRole = 'PUBLIC' | 'OFFICER' | 'BIDDER';

export interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  designation?: string;
  organization?: string;
  department?: string;
  dscToken?: string;
  // Bidder-specific
  bidderId?: string;
  gstin?: string;
  pan?: string;
  cin?: string;
  category?: string;
  vendorCode?: string;
}

export interface BidderClarification {
  id: string;
  tenderId: string;
  tenderNumber: string;
  subject: string;
  clauseRef: string;
  officerQuery: string;
  raisedDate: string;
  deadline: string;
  status: 'PENDING_RESPONSE' | 'SUBMITTED' | 'ACCEPTED' | 'REJECTED';
  bidderResponse?: string;
  respondedAt?: string;
  attachedDocName?: string;
}

