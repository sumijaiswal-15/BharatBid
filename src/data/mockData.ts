import { Tender, Bidder, OfficerAttentionItem, AuditEvent, ComplianceRule } from '../types';

export const INITIAL_TENDERS: Tender[] = [
  {
    id: 'tender-1',
    tenderNumber: 'CPCL/2026/PROC/1042',
    title: 'EPC of 400kV Gas Insulated Substation & Automation System at Manali Refinery Expansion',
    issuingAuthority: 'Chennai Petroleum Corporation Limited (CPCL) / MoP&NG',
    estimatedValue: '₹184.50 Cr',
    emdAmount: '₹3.69 Cr',
    publishDate: '12 Aug 2026',
    closingDate: '28 Aug 2026',
    category: 'Works & Industrial EPC',
    bidsUnderVerificationCount: 4,
    status: 'ACTIVE_EVALUATION',
    clauses: [
      {
        id: 'c-1',
        clauseNumber: 'Clause 3.1.2',
        sectionTitle: 'Financial Eligibility Criteria',
        originalText: 'The Bidder should have an average annual turnover of at least ₹10 Crore during the previous three financial years (FY 2022-23, FY 2023-24, FY 2024-25) as per audited financial statements.',
        extractedRule: {
          id: 'rule-turnover',
          requirement: 'Average Annual Turnover',
          category: 'FINANCIAL',
          threshold: '≥ ₹10 Crore',
          evaluationPeriod: 'Previous 3 financial years (FY23, FY24, FY25)',
          isMandatory: true,
          verificationSource: 'MCA21 Database & Audited ITR Records',
          applicability: 'All Primary Bidders & Lead JV Partners',
          status: 'APPROVED',
          ruleLogic: 'AVG(Turnover_FY23, Turnover_FY24, Turnover_FY25) >= 100000000 INR',
          confidenceScore: 99
        }
      },
      {
        id: 'c-2',
        clauseNumber: 'Clause 2.4.1',
        sectionTitle: 'Statutory Registration & Tax Compliance',
        originalText: 'Bidder must possess a valid Goods and Services Tax (GSTIN) registration certificate in the state of execution or undertake to obtain the same prior to contract award, along with Active PAN.',
        extractedRule: {
          id: 'rule-gst',
          requirement: 'GSTIN & PAN Active Status',
          category: 'STATUTORY',
          threshold: 'Active & Verified',
          evaluationPeriod: 'Current Active Status',
          isMandatory: true,
          verificationSource: 'GSTN API & NSDL/Income Tax Database',
          applicability: 'All Bidders',
          status: 'APPROVED',
          ruleLogic: 'GSTIN.status == "ACTIVE" && PAN.status == "VALID"',
          confidenceScore: 98
        }
      },
      {
        id: 'c-3',
        clauseNumber: 'Clause 4.2.8',
        sectionTitle: 'Manufacturer Authorization & Equipment Supply',
        originalText: 'If the bidder is not the Original Equipment Manufacturer (OEM) of the 400kV GIS modules, they must furnish a legally binding, project-specific OEM Authorization Certificate signed by the authorized signatory of the approved manufacturer.',
        extractedRule: {
          id: 'rule-oem',
          requirement: 'Mandatory OEM Authorization Certificate',
          category: 'TECHNICAL',
          threshold: 'Legally binding tender-specific OEM Certificate',
          evaluationPeriod: 'Tender Specific (Issued within 60 days of NIT)',
          isMandatory: true,
          verificationSource: 'Submitted Document Cross-Match & OEM Primary Registry',
          applicability: 'Non-OEM EPC Contractors',
          status: 'APPROVED',
          ruleLogic: 'OEM_Auth.isValid == true && OEM_Auth.isProjectSpecific == true && OEM_Auth.isDuplicate == false',
          confidenceScore: 94
        }
      },
      {
        id: 'c-4',
        clauseNumber: 'Clause 1.8.3',
        sectionTitle: 'Debarment & Integrity Pact',
        originalText: 'Bidder, its directors, partners or associated consortium members must not be debarred, blacklisted or suspended by any Central Ministry, State Government, CPSE or Autonomous Body as on bid submission deadline.',
        extractedRule: {
          id: 'rule-blacklist',
          requirement: 'Non-Debarment & Integrity Record',
          category: 'STATUTORY',
          threshold: 'Clean Record (No active ban/suspension)',
          evaluationPeriod: 'Past 3 Years & Current Date',
          isMandatory: true,
          verificationSource: 'Central Vigilance Commission (CVC) & GeM Debarment Registry',
          applicability: 'All Bidders and Key Personnel',
          status: 'APPROVED',
          ruleLogic: 'DebarmentRecord.count == 0 && CVC_List.match == false',
          confidenceScore: 96
        }
      },
      {
        id: 'c-5',
        clauseNumber: 'Clause 5.1.1',
        sectionTitle: 'Make in India / Local Content',
        originalText: 'Preference shall be accorded to Class-I Local Suppliers having local content equal to or more than 50% as defined under Public Procurement (Preference to Make in India) Order 2017.',
        extractedRule: {
          id: 'rule-local-content',
          requirement: 'Class-I Local Content Declaration',
          category: 'TENDER_SPECIFIC',
          threshold: 'Local Content ≥ 50%',
          evaluationPeriod: 'Current Tender Execution',
          isMandatory: false,
          verificationSource: 'Statutory Auditor Local Content Certificate & Bill of Quantities',
          applicability: 'Class-I / Class-II Suppliers',
          status: 'APPROVED',
          ruleLogic: 'LocalContentPercentage >= 50.0',
          confidenceScore: 92
        }
      },
      {
        id: 'c-6',
        clauseNumber: 'Clause 3.3.4',
        sectionTitle: 'Past Technical Track Record',
        originalText: 'The bidder must have successfully executed at least 2 similar 400kV or higher voltage GIS installations in the last 7 years for any Central/State Transmission Utility or CPSE.',
        extractedRule: {
          id: 'rule-past-exp',
          requirement: 'Past 400kV GIS Execution Experience',
          category: 'TECHNICAL',
          threshold: '≥ 2 Completed Projects (≥ 400kV)',
          evaluationPeriod: 'Past 7 Years',
          isMandatory: true,
          verificationSource: 'CPPP Prior Contract Database & Client Completion Certs',
          applicability: 'EPC Lead Bidder',
          status: 'APPROVED',
          ruleLogic: 'PastProjects.filter(p => p.voltage >= 400 && p.status == "COMPLETED").length >= 2',
          confidenceScore: 95
        }
      },
      {
        id: 'c-7',
        clauseNumber: 'Clause 2.9.2',
        sectionTitle: 'Earnest Money Deposit (EMD) / Bank Guarantee',
        originalText: 'Bidders must furnish Earnest Money Deposit of ₹3.69 Crore in the form of Electronic Bank Guarantee (e-BG) or claim statutory exemption with valid MSME/Udyam certificate.',
        extractedRule: {
          id: 'rule-emd',
          requirement: 'EMD Submission or Statutory Exemption',
          category: 'FINANCIAL',
          threshold: '₹3.69 Crore e-BG or Valid MSME NIC Code',
          evaluationPeriod: 'Validity ≥ 180 days',
          isMandatory: true,
          verificationSource: 'NeSL e-BG Platform & Udyam Verification API',
          applicability: 'All Bidders',
          status: 'APPROVED',
          ruleLogic: 'eBG.amount >= 36900000 || (Udyam.isValid && Udyam.allowsExemption)',
          confidenceScore: 99
        }
      }
    ],
    bidders: []
  }
];

export const MOCK_BIDDERS: Bidder[] = [
  {
    id: 'bidder-abc',
    name: 'ABC Technologies Pvt. Ltd.',
    cin: 'U72200DL2014PTC268491',
    gstin: '09AAACA1234F1Z8',
    pan: 'AAACA1234F',
    category: 'Large Enterprise',
    complianceScore: 86,
    riskLevel: 'MEDIUM',
    summary: {
      passed: 29,
      failed: 2,
      reviewRequired: 3,
      total: 34
    },
    categoryScores: {
      statutory: { score: 25, max: 25 },
      financial: { score: 20, max: 25 },
      technical: { score: 20, max: 20 },
      documentIntegrity: { score: 13, max: 15 },
      tenderSpecific: { score: 8, max: 15 },
      behaviouralRisk: { score: 10, max: 15 }
    },
    verificationItems: [
      {
        id: 'v-gst',
        requirement: 'GST Registration (Active & Compliant)',
        category: 'STATUTORY',
        status: 'VERIFIED',
        evidence: 'Active GSTIN 09AAACA1234F1Z8 verified via GSTN National Gateway.',
        evidenceSnippet: 'Legal Name: ABC Technologies Pvt. Ltd. | Reg Date: 14-Jul-2017 | Status: Active | Taxpayer Type: Regular | GSTR-3B filed up to July 2026.',
        source: 'GSTN Gateway API',
        sourceType: 'API_DIRECT',
        confidence: 98,
        timestamp: '25 Aug 2026 · 10:41 AM',
        aiReasoning: 'GSTIN is registered, currently in Active status, and filings are regular with zero default flags.',
        tenderClauseRef: 'Clause 2.4.1 (Statutory Registration)',
        ruleLogic: 'GSTIN.status == "ACTIVE"',
        verifiedDataPoints: [
          { label: 'GSTIN Status', value: 'ACTIVE', isMatch: true },
          { label: 'Filing Regularity', value: 'GSTR-1 & 3B Cleared', isMatch: true },
          { label: 'Principal Place', value: 'Sector 62, Noida, UP', isMatch: true }
        ]
      },
      {
        id: 'v-pan',
        requirement: 'Permanent Account Number (PAN) Verification',
        category: 'STATUTORY',
        status: 'VERIFIED',
        evidence: 'PAN AAACA1234F validated directly against NSDL/Income Tax Master.',
        evidenceSnippet: 'PAN Status: Valid & Linked with MCA CIN | Name: ABC TECHNOLOGIES PRIVATE LIMITED | Category: Company',
        source: 'Authorized Income Tax Source',
        sourceType: 'API_DIRECT',
        confidence: 99,
        timestamp: '25 Aug 2026 · 10:42 AM',
        aiReasoning: 'PAN entity name and legal structure match the bidding entity with 100% string similarity.',
        tenderClauseRef: 'Clause 2.4.1 (Tax Compliance)',
        ruleLogic: 'PAN.status == "VALID"',
        verifiedDataPoints: [
          { label: 'PAN Master Status', value: 'OPERATIVE / VALID', isMatch: true },
          { label: 'Aadhaar / CIN Link', value: 'VERIFIED', isMatch: true }
        ]
      },
      {
        id: 'v-turnover',
        requirement: 'Average Annual Turnover (≥ ₹10 Crore)',
        category: 'FINANCIAL',
        status: 'VERIFIED',
        evidence: 'Audited Financial Statements (MCA21 Filings & Form 3CD): FY23: ₹11.2 Cr | FY24: ₹12.4 Cr | FY25: ₹13.1 Cr | Average: ₹12.23 Cr.',
        evidenceSnippet: 'FY 2022-23: ₹11,20,45,000 | FY 2023-24: ₹12,40,10,000 | FY 2024-25: ₹13,10,00,000. UDIN: 24045678ABCD9921.',
        source: 'Verified Financial Record (MCA21 / CBDT)',
        sourceType: 'GOV_REGISTRY',
        confidence: 94,
        timestamp: '25 Aug 2026 · 10:42 AM',
        aiReasoning: 'Requirement satisfies ₹10 Cr mandatory threshold with average of ₹12.23 Cr across audited 3-year trailing period.',
        tenderClauseRef: 'Clause 3.1.2 (Financial Eligibility)',
        ruleLogic: 'AVG(Turnover_FY23..FY25) >= 10.00 Cr',
        verifiedDataPoints: [
          { label: 'FY 2022-23 Turnover', value: '₹11.20 Cr', isMatch: true },
          { label: 'FY 2023-24 Turnover', value: '₹12.40 Cr', isMatch: true },
          { label: 'FY 2024-25 Turnover', value: '₹13.10 Cr', isMatch: true },
          { label: '3-Year Average', value: '₹12.23 Cr (Threshold: ₹10.0 Cr)', isMatch: true }
        ]
      },
      {
        id: 'v-oem',
        requirement: 'Mandatory OEM Authorization Certificate',
        category: 'TECHNICAL',
        status: 'REVIEW',
        evidence: 'Submitted Authorization document dated 14-Aug-2026 from Siemens Grid Systems contains potential duplication match with another bidder in related tender.',
        evidenceSnippet: 'Ref No: SGS/IND/2026/AUTH-8812 | Project Ref: CPCL Manali GIS | Signatory: Chief Sales Officer. Flagged for 96% structural similarity with XYZ Solutions submission.',
        source: 'Submitted Document & Cross-Bidder Registry',
        sourceType: 'SUBMITTED_DOC',
        confidence: 72,
        timestamp: '25 Aug 2026 · 10:49 AM',
        flagReason: 'Potential Duplicate Document: Authorization text & formatting match another bidder submission by 96%. Verification with OEM pending.',
        aiReasoning: 'Mandatory OEM Authorization was submitted, but structural fingerprinting detected near-identical letter with identical layout and metadata to XYZ Solutions. Officer review recommended.',
        tenderClauseRef: 'Clause 4.2.8 (OEM Authorization)',
        ruleLogic: 'OEM_Auth.isProjectSpecific == true && DuplicateRisk == false',
        verifiedDataPoints: [
          { label: 'Document Provided', value: 'YES (PDF Ref #8812)', isMatch: true },
          { label: 'OEM Name', value: 'Siemens Grid Solutions', isMatch: true },
          { label: 'Duplicate Index', value: '96% Match with XYZ Solutions', isMatch: false }
        ]
      },
      {
        id: 'v-blacklist',
        requirement: 'Non-Debarment & CVC Debarred Registry Check',
        category: 'STATUTORY',
        status: 'REVIEW',
        evidence: 'No direct debarment on ABC Technologies Pvt. Ltd., however, a director (Mr. Arvind Sharma) shares DIN with an entity debarred by NHPC in 2024.',
        evidenceSnippet: 'DIN 06894120 associated with "Apex Power Infrastructures Ltd" suspended by NHPC Ltd for 12 months in Oct 2024. Active query required on applicability.',
        source: 'CVC / Central Debarment Database & MCA21 DIN Master',
        sourceType: 'GOV_REGISTRY',
        confidence: 81,
        timestamp: '25 Aug 2026 · 10:45 AM',
        flagReason: 'Director association with historically debarred entity. Tender clause requires officer determination on applicability to independent bidding entity.',
        aiReasoning: 'Direct entity check is clear. Association signal detected via common director DIN. Requires officer evaluation per DoE guidelines.',
        tenderClauseRef: 'Clause 1.8.3 (Debarment & Integrity)',
        ruleLogic: 'Entity.isDebarred == false && KeyPersons.debarmentRisk == LOW',
        verifiedDataPoints: [
          { label: 'Primary Entity Status', value: 'CLEAN / NOT DEBARRED', isMatch: true },
          { label: 'Director Association Link', value: 'DIN 06894120 flagged', isMatch: false }
        ]
      },
      {
        id: 'v-exp',
        requirement: 'Past 400kV GIS Execution Experience (≥ 2 Projects)',
        category: 'TECHNICAL',
        status: 'VERIFIED',
        evidence: 'Submitted Client Completion Certificates verified via CPPP records: 1) PGCIL Wardha 400kV GIS (₹112 Cr, 2023), 2) NTPC Ramagundam 400kV Substation (₹94 Cr, 2024).',
        evidenceSnippet: 'Contract IDs: PGCIL/WR/400GIS/2021 & NTPC/SR/EP/2022. Satisfactory Performance Certificates attached and cross-referenced with CPPP archive.',
        source: 'CPPP Contract Archive & Verified Client Certs',
        sourceType: 'GOV_REGISTRY',
        confidence: 95,
        timestamp: '25 Aug 2026 · 10:44 AM',
        aiReasoning: 'Both submitted completion certificates meet voltage (400kV), value, and 7-year recency requirements.',
        tenderClauseRef: 'Clause 3.3.4 (Technical Experience)',
        ruleLogic: 'PastProjects.count >= 2',
        verifiedDataPoints: [
          { label: 'Project 1 (PGCIL Wardha)', value: '400kV GIS Completed', isMatch: true },
          { label: 'Project 2 (NTPC Ramagundam)', value: '400kV GIS Completed', isMatch: true }
        ]
      },
      {
        id: 'v-emd',
        requirement: 'Earnest Money Deposit (EMD) / e-BG Verification',
        category: 'FINANCIAL',
        status: 'VERIFIED',
        evidence: 'e-Bank Guarantee #EBG2026SBI9941 for ₹3.69 Crore issued by State Bank of India, CAG Branch New Delhi. Verified on NeSL e-BG portal.',
        evidenceSnippet: 'e-BG Ref: NESL-BG-2026-0814-4412 | Amount: ₹3,69,00,000 | Validity: 28 Feb 2027 (184 days) | Status: Authenticated on SFMS.',
        source: 'NeSL National e-BG Gateway',
        sourceType: 'API_DIRECT',
        confidence: 99,
        timestamp: '25 Aug 2026 · 10:43 AM',
        aiReasoning: 'e-BG authentic, verified on SFMS and NeSL depository with valid claim period.',
        tenderClauseRef: 'Clause 2.9.2 (EMD Requirement)',
        ruleLogic: 'eBG.isVerified == true && eBG.amount >= 36900000',
        verifiedDataPoints: [
          { label: 'e-BG Amount', value: '₹3.69 Crore', isMatch: true },
          { label: 'Validity Period', value: '184 Days (Req: ≥180)', isMatch: true }
        ]
      },
      {
        id: 'v-mii',
        requirement: 'Make in India Local Content (≥ 50%)',
        category: 'TENDER_SPECIFIC',
        status: 'VERIFIED',
        evidence: 'Statutory Auditor Certificate submitted certifying 78.4% local value addition in accordance with DPIIT Order.',
        evidenceSnippet: 'Auditor: M/s Singhal & Associates (FRN 012456N) | UDIN: 24045678AAAA1029 | Declared Local Content: 78.4%.',
        source: 'Auditor Certificate & MCA UDIN Verify',
        sourceType: 'SUBMITTED_DOC',
        confidence: 91,
        timestamp: '25 Aug 2026 · 10:46 AM',
        aiReasoning: 'Class-I Local Supplier status established with verified UDIN from chartered accountant.',
        tenderClauseRef: 'Clause 5.1.1 (Make in India Preference)',
        ruleLogic: 'LocalContentPercentage >= 50.0',
        verifiedDataPoints: [
          { label: 'Local Content %', value: '78.4% (Class-I)', isMatch: true },
          { label: 'Auditor UDIN', value: 'VERIFIED ON ICAI', isMatch: true }
        ]
      },
      {
        id: 'v-solvency',
        requirement: 'Financial Solvency Certificate (≥ ₹50 Crore)',
        category: 'FINANCIAL',
        status: 'VERIFIED',
        evidence: 'Bank Solvency Certificate from State Bank of India for ₹60.00 Crore dated 02-Aug-2026.',
        evidenceSnippet: 'SBI CAG Branch | Solvency Reference: SBI/CAG/SOLV/2026/891 | Value: ₹60,00,00,000 | Certified sound and solvent.',
        source: 'Bank Confirmation Letter & SFMS',
        sourceType: 'API_DIRECT',
        confidence: 93,
        timestamp: '25 Aug 2026 · 10:47 AM',
        aiReasoning: 'Solvency threshold satisfied with ₹60 Cr certified against ₹50 Cr requirement.',
        tenderClauseRef: 'Clause 3.2.1 (Financial Standing)',
        ruleLogic: 'SolvencyAmount >= 500000000',
        verifiedDataPoints: [
          { label: 'Certified Solvency', value: '₹60.00 Cr (Req: ₹50 Cr)', isMatch: true }
        ]
      },
      {
        id: 'v-iso',
        requirement: 'Quality & Environmental Certifications (ISO 9001, 14001)',
        category: 'TECHNICAL',
        status: 'VERIFIED',
        evidence: 'ISO 9001:2015 & ISO 14001:2015 certificates issued by TUV SUD (Accredited by NABCB).',
        evidenceSnippet: 'Cert Numbers: 99 100 18942 & 99 104 04128 | Valid through: 14-Dec-2027.',
        source: 'NABCB National Accreditation Registry',
        sourceType: 'GOV_REGISTRY',
        confidence: 97,
        timestamp: '25 Aug 2026 · 10:47 AM',
        aiReasoning: 'Certificates active in central accreditation repository.',
        tenderClauseRef: 'Clause 4.5.1 (Quality Standards)',
        ruleLogic: 'ISO.isAccredited == true',
        verifiedDataPoints: [
          { label: 'ISO 9001:2015', value: 'ACTIVE (NABCB)', isMatch: true },
          { label: 'ISO 14001:2015', value: 'ACTIVE (NABCB)', isMatch: true }
        ]
      },
      {
        id: 'v-address',
        requirement: 'Registered Office Address Consistency',
        category: 'STATUTORY',
        status: 'REVIEW',
        evidence: 'Discrepancy detected across 4 submitted and authorized government sources.',
        evidenceSnippet: 'GSTN: Sector 62 Noida | Udyam: Plot 14 Ghaziabad | PAN: Sector 62 Noida | Bid Form: Barakhamba Road New Delhi.',
        source: 'Cross-Document Intelligence Engine',
        sourceType: 'CROSS_MATCH',
        confidence: 84,
        timestamp: '25 Aug 2026 · 10:47 AM',
        flagReason: 'Address mismatch between statutory records and bid submission form.',
        aiReasoning: 'Company operates across NCR with different branch registrations. Clarification recommended to confirm principal place of business.',
        tenderClauseRef: 'Clause 2.1.3 (Bidder Information)',
        ruleLogic: 'Address.isCrossConsistent == true',
        verifiedDataPoints: [
          { label: 'GST Record', value: 'Noida, UP', isMatch: true },
          { label: 'Udyam Record', value: 'Ghaziabad, UP', isMatch: false },
          { label: 'Bid Submission Form', value: 'New Delhi', isMatch: false }
        ]
      },
      {
        id: 'v-behave',
        requirement: 'Bid Submission Behaviour & Non-Collusion Standard',
        category: 'BEHAVIOURAL',
        status: 'REVIEW',
        evidence: 'Historical bid withdrawal rate is 28.0%, which is significantly higher than the public procurement baseline of 4.2%.',
        evidenceSnippet: 'Participation frequency: 42 tenders in 24 months | 12 withdrawals prior to technical opening | 3 co-bids with XYZ Solutions.',
        source: 'BharatBid Behavioural Intelligence Engine',
        sourceType: 'CROSS_MATCH',
        confidence: 76,
        timestamp: '25 Aug 2026 · 10:48 AM',
        flagReason: 'High historical withdrawal pattern requires officer situational awareness.',
        aiReasoning: 'Behavioural risk signal. Does NOT constitute established misconduct. Provided for officer contextual evaluation.',
        tenderClauseRef: 'Clause 1.9.4 (Integrity & Fair Competition)',
        ruleLogic: 'WithdrawalRate <= Baseline * 3',
        verifiedDataPoints: [
          { label: 'Observed Withdrawal Rate', value: '28.0%', isMatch: false },
          { label: 'Baseline Average', value: '4.2%', isMatch: true }
        ]
      }
    ],
    crossDocInconsistencies: [
      {
        id: 'incon-1',
        field: 'Registered Office Address',
        risk: 'MEDIUM',
        sources: {
          gst: {
            value: 'Tower B, 4th Floor, Logix Cyber Park, Sector 62, Noida, Gautam Buddha Nagar, UP 201309',
            docName: 'GST Registration Certificate (GSTN API)',
            verifiedAt: '25 Aug 2026 · 10:41 AM',
            match: true
          },
          udyam: {
            value: 'Plot No. 14, Site IV Industrial Area, Sahibabad, Ghaziabad, UP 201010',
            docName: 'Udyam Registration Certificate (MSME API)',
            verifiedAt: '25 Aug 2026 · 10:42 AM',
            match: false
          },
          pan: {
            value: 'Tower B, Sector 62, Noida, Gautam Buddha Nagar, UP 201309',
            docName: 'Income Tax Entity Database',
            verifiedAt: '25 Aug 2026 · 10:42 AM',
            match: true
          },
          bidForm: {
            value: '804, Antriksh Bhawan, 22 Kasturba Gandhi Marg, Barakhamba Road, New Delhi 110001',
            docName: 'Submitted Bid Submission Form A-1',
            verifiedAt: '25 Aug 2026 · 10:40 AM',
            match: false
          },
          mca21: {
            value: 'Tower B, Sector 62, Noida, UP 201309',
            docName: 'MCA21 Company Master Data',
            verifiedAt: '25 Aug 2026 · 10:41 AM',
            match: true
          }
        },
        finding: 'Potential Inconsistency: Company address differs across 3 verified sources (Noida vs Ghaziabad vs New Delhi).',
        aiAnalysis: 'MCA21 and GST records align on Noida (Principal Place). Udyam indicates a manufacturing plant in Ghaziabad, while the Bid Form lists a corporate liaison office in Delhi. This is common for growing EPC contractors, but official clarification should confirm the legal service address.',
        recommendedAction: 'Issue standard clarification notice asking bidder to confirm legal communication address and specify branch/plant roles.',
        status: 'OPEN_REVIEW'
      }
    ],
    duplicateDocs: [
      {
        id: 'dup-1',
        documentType: 'OEM Authorization Letter',
        bidderA: {
          name: 'ABC Technologies Pvt. Ltd.',
          tenderId: 'CPCL/2026/PROC/1042',
          docTitle: 'OEM_Auth_Siemens_ABC.pdf',
          submissionDate: '24 Aug 2026 · 04:12 PM',
          excerpt: 'We hereby authorize M/s ABC Technologies Pvt. Ltd. to quote and supply 400kV SF6 Gas Insulated Switchgear conforming to Technical Specifications of CPCL Manali Project Ref #CPCL/2026/PROC/1042.',
          authorSign: 'K. Venkatesh (VP Power Distribution, Siemens India)',
          refNo: 'SGS/IND/2026/AUTH-8812'
        },
        bidderB: {
          name: 'XYZ Solutions Ltd. (Bidder in IOCL Grid Tender)',
          tenderId: 'IOCL/2026/GRID/0882',
          docTitle: 'OEM_Auth_Siemens_XYZ.pdf',
          submissionDate: '19 Aug 2026 · 02:45 PM',
          excerpt: 'We hereby authorize M/s XYZ Solutions Ltd. to quote and supply 400kV SF6 Gas Insulated Switchgear conforming to Technical Specifications of CPCL Manali Project Ref #CPCL/2026/PROC/1042.',
          authorSign: 'K. Venkatesh (VP Power Distribution, Siemens India)',
          refNo: 'SGS/IND/2026/AUTH-8812'
        },
        similarityScore: 96,
        matchedFeatures: [
          'Identical Document Reference Number: SGS/IND/2026/AUTH-8812',
          'Identical Project Reference incorrectly cited in XYZ tender',
          'Exact digital signature pixel match & metadata author signature',
          'Matching typography kerning and watermarking artifacts'
        ],
        aiFinding: 'The submitted OEM Authorization documents across two competing bids contain identical layout, authorization reference number, and typographical structure with 96% similarity.',
        status: 'REVIEW_REQUIRED'
      }
    ],
    behaviour: {
      bidderId: 'bidder-abc',
      bidderName: 'ABC Technologies Pvt. Ltd.',
      totalBidsCount: 42,
      participationFrequencyScore: 88,
      withdrawalRate: 28.0,
      baselineWithdrawalRate: 4.2,
      tenderCategoryFocus: ['High Voltage EPC', 'Refinery Electrification', 'Substation Automation'],
      historicalWins: 11,
      bidPriceDispersion: 'Narrow (Within ±2.1% of L2 in 6 instances)',
      anomalySignal: 'Elevated tender withdrawal frequency (28% vs 4.2% category average) and co-bidding clustering with XYZ Solutions.',
      riskLevel: 'MEDIUM',
      monthlyActivity: [
        { month: 'Mar 2026', bids: 6, withdrawals: 2 },
        { month: 'Apr 2026', bids: 8, withdrawals: 3 },
        { month: 'May 2026', bids: 7, withdrawals: 1 },
        { month: 'Jun 2026', bids: 9, withdrawals: 3 },
        { month: 'Jul 2026', bids: 5, withdrawals: 1 },
        { month: 'Aug 2026', bids: 7, withdrawals: 2 }
      ],
      cartelRiskIndicators: [
        { indicator: 'High Pre-Opening Withdrawal Rate', detected: true, note: '28.0% historical withdrawals vs 4.2% CPSE norm' },
        { indicator: 'Frequent Dual Bidding with Same Sub-tier', detected: true, note: 'Co-participated in 8 recent CPSE tenders alongside XYZ Solutions' },
        { indicator: 'Identical Pricing Pattern on Line Items', detected: false, note: 'Unit rates show distinct itemized costing' },
        { indicator: 'Sequential Win Rotation', detected: false, note: 'No statistically significant rotational pattern found' }
      ]
    },
    conflictChecks: [
      {
        id: 'conf-1',
        entityName: 'ABC Technologies Pvt. Ltd.',
        relatedEntityOrPerson: 'Er. R. Sundaram (External Technical Consultant, CPCL Evaluation Sub-Committee)',
        role: 'Former Independent Director (Resigned 2023)',
        relationshipType: 'Past Board Association (3-Year Cooling Period in Progress)',
        source: 'MCA21 Directorship History & CPCL Conflict Register',
        confidence: 82,
        status: 'REQUIRES_VERIFICATION',
        evidenceDetails: 'Er. Sundaram served on ABC Tech Advisory Board until Nov 2023. Currently engaged as external peer reviewer for CPCL. Requires committee declaration confirmation.',
        timestamp: '25 Aug 2026 · 10:48 AM'
      }
    ],
    officerDecision: {
      status: 'NOT_DECIDED',
      officerName: 'Rajesh Kumar, IRSS',
      designation: 'Chief Procurement Officer & Tender Committee Chair'
    }
  },
  {
    id: 'bidder-bharat',
    name: 'Bharat Industrial Systems',
    cin: 'U29100MH2011PLC219800',
    gstin: '27AABCB9876Q1ZT',
    pan: 'AABCB9876Q',
    category: 'MSME',
    complianceScore: 74,
    riskLevel: 'MEDIUM',
    summary: {
      passed: 25,
      failed: 3,
      reviewRequired: 6,
      total: 34
    },
    categoryScores: {
      statutory: { score: 22, max: 25 },
      financial: { score: 14, max: 25 },
      technical: { score: 18, max: 20 },
      documentIntegrity: { score: 10, max: 15 },
      tenderSpecific: { score: 6, max: 15 },
      behaviouralRisk: { score: 4, max: 15 }
    },
    verificationItems: [
      {
        id: 'v-b-gst',
        requirement: 'GST Registration (Active & Compliant)',
        category: 'STATUTORY',
        status: 'VERIFIED',
        evidence: 'GSTIN 27AABCB9876Q1ZT active and filed up to date.',
        source: 'GSTN Gateway API',
        sourceType: 'API_DIRECT',
        confidence: 99,
        timestamp: '25 Aug 2026 · 10:30 AM',
        aiReasoning: 'Active regular taxpayer.',
        tenderClauseRef: 'Clause 2.4.1',
        ruleLogic: 'GSTIN.status == "ACTIVE"'
      },
      {
        id: 'v-b-turnover',
        requirement: 'Average Annual Turnover (≥ ₹10 Crore)',
        category: 'FINANCIAL',
        status: 'CRITICAL',
        evidence: 'Turnover in FY23: ₹8.4 Cr | FY24: ₹9.2 Cr | FY25: ₹9.1 Cr | Average: ₹8.90 Cr (Below ₹10.00 Cr mandatory threshold).',
        source: 'MCA21 Financial Records',
        sourceType: 'GOV_REGISTRY',
        confidence: 96,
        timestamp: '25 Aug 2026 · 10:31 AM',
        flagReason: 'Average turnover of ₹8.90 Cr falls short of mandatory ₹10 Cr eligibility requirement.',
        aiReasoning: 'Mandatory financial threshold not met based on audited ITR and MCA filings.',
        tenderClauseRef: 'Clause 3.1.2',
        ruleLogic: 'Turnover >= 100000000'
      }
    ],
    crossDocInconsistencies: [
      {
        id: 'incon-b1',
        field: 'Registered Office Address',
        risk: 'MEDIUM',
        sources: {
          gst: { value: 'Andheri East, Mumbai, MH', docName: 'GST Cert', verifiedAt: '25 Aug 2026', match: true },
          udyam: { value: 'MIDC Rabale, Navi Mumbai, MH', docName: 'Udyam Cert', verifiedAt: '25 Aug 2026', match: false },
          pan: { value: 'Andheri East, Mumbai, MH', docName: 'PAN Master', verifiedAt: '25 Aug 2026', match: true },
          bidForm: { value: 'Nariman Point, Mumbai, MH', docName: 'Bid Form', verifiedAt: '25 Aug 2026', match: false }
        },
        finding: 'Company address differs across GST (Andheri), Udyam (Rabale), and Bid Form (Nariman Point).',
        aiAnalysis: 'Discrepancy between plant location and registered head office.',
        recommendedAction: 'Investigate through standard document query.',
        status: 'OPEN_REVIEW'
      }
    ],
    duplicateDocs: [],
    behaviour: {
      bidderId: 'bidder-bharat',
      bidderName: 'Bharat Industrial Systems',
      totalBidsCount: 22,
      participationFrequencyScore: 65,
      withdrawalRate: 9.1,
      baselineWithdrawalRate: 4.2,
      tenderCategoryFocus: ['Switchgear Supply', 'Transformer Repair'],
      historicalWins: 4,
      bidPriceDispersion: 'Standard',
      anomalySignal: 'No major behavioural anomaly detected.',
      riskLevel: 'LOW',
      monthlyActivity: [
        { month: 'Mar 2026', bids: 3, withdrawals: 0 },
        { month: 'Apr 2026', bids: 4, withdrawals: 1 },
        { month: 'May 2026', bids: 3, withdrawals: 0 },
        { month: 'Jun 2026', bids: 5, withdrawals: 1 },
        { month: 'Jul 2026', bids: 3, withdrawals: 0 },
        { month: 'Aug 2026', bids: 4, withdrawals: 0 }
      ],
      cartelRiskIndicators: []
    },
    conflictChecks: []
  },
  {
    id: 'bidder-rajtech',
    name: 'RajTech Solutions Ltd.',
    cin: 'U72900KA2015PLC083112',
    gstin: '29AAACR5544P1Z3',
    pan: 'AAACR5544P',
    category: 'Large Enterprise',
    complianceScore: 98,
    riskLevel: 'LOW',
    summary: {
      passed: 34,
      failed: 0,
      reviewRequired: 0,
      total: 34
    },
    categoryScores: {
      statutory: { score: 25, max: 25 },
      financial: { score: 25, max: 25 },
      technical: { score: 20, max: 20 },
      documentIntegrity: { score: 15, max: 15 },
      tenderSpecific: { score: 15, max: 15 },
      behaviouralRisk: { score: 15, max: 15 }
    },
    verificationItems: [
      {
        id: 'v-r-all',
        requirement: 'All 34 Mandatory Statutory, Financial & Technical Requirements',
        category: 'STATUTORY',
        status: 'VERIFIED',
        evidence: 'Full 34/34 compliance rules verified with 100% data fidelity across GSTN, MCA21, EPFO, and CPPP registries.',
        source: 'Automated Multi-Registry Verification Gateway',
        sourceType: 'API_DIRECT',
        confidence: 99,
        timestamp: '25 Aug 2026 · 10:15 AM',
        aiReasoning: '34/34 mandatory requirements verified. Zero discrepancies, zero duplicate documents, zero debarment signals.',
        tenderClauseRef: 'All Tender Sections',
        ruleLogic: 'FullCompliant == true'
      }
    ],
    crossDocInconsistencies: [],
    duplicateDocs: [],
    behaviour: {
      bidderId: 'bidder-rajtech',
      bidderName: 'RajTech Solutions Ltd.',
      totalBidsCount: 56,
      participationFrequencyScore: 92,
      withdrawalRate: 3.5,
      baselineWithdrawalRate: 4.2,
      tenderCategoryFocus: ['Grid EPC', 'Digital Substation', 'SCADA'],
      historicalWins: 24,
      bidPriceDispersion: 'Competitive',
      anomalySignal: 'Standard competitive bidder profile. Low risk.',
      riskLevel: 'LOW',
      monthlyActivity: [
        { month: 'Mar 2026', bids: 8, withdrawals: 0 },
        { month: 'Apr 2026', bids: 10, withdrawals: 1 },
        { month: 'May 2026', bids: 9, withdrawals: 0 },
        { month: 'Jun 2026', bids: 11, withdrawals: 0 },
        { month: 'Jul 2026', bids: 8, withdrawals: 0 },
        { month: 'Aug 2026', bids: 10, withdrawals: 1 }
      ],
      cartelRiskIndicators: []
    },
    conflictChecks: []
  },
  {
    id: 'bidder-shakti',
    name: 'Shakti Engineering Pvt. Ltd.',
    cin: 'U45200TG2018PTC125430',
    gstin: '36AAACS7788R1Z1',
    pan: 'AAACS7788R',
    category: 'MSME',
    complianceScore: 42,
    riskLevel: 'HIGH',
    summary: {
      passed: 14,
      failed: 9,
      reviewRequired: 11,
      total: 34
    },
    categoryScores: {
      statutory: { score: 10, max: 25 },
      financial: { score: 8, max: 25 },
      technical: { score: 10, max: 20 },
      documentIntegrity: { score: 4, max: 15 },
      tenderSpecific: { score: 6, max: 15 },
      behaviouralRisk: { score: 4, max: 15 }
    },
    verificationItems: [
      {
        id: 'v-s-debar',
        requirement: 'Non-Debarment & CVC Integrity Record',
        category: 'STATUTORY',
        status: 'CRITICAL',
        evidence: 'Direct active debarment order #CVC/VIG/2025/1102 found in GeM Central Blacklisting Repository.',
        source: 'Central Vigilance Commission Registry',
        sourceType: 'GOV_REGISTRY',
        confidence: 99,
        timestamp: '25 Aug 2026 · 10:10 AM',
        flagReason: 'Active 2-year debarment order issued by Ministry of Power currently in force until Dec 2026.',
        aiReasoning: 'Entity is ineligible for public procurement per CVC & GFR Rule 151.',
        tenderClauseRef: 'Clause 1.8.3',
        ruleLogic: 'Debarment == 0'
      }
    ],
    crossDocInconsistencies: [],
    duplicateDocs: [],
    behaviour: {
      bidderId: 'bidder-shakti',
      bidderName: 'Shakti Engineering Pvt. Ltd.',
      totalBidsCount: 18,
      participationFrequencyScore: 40,
      withdrawalRate: 38.8,
      baselineWithdrawalRate: 4.2,
      tenderCategoryFocus: ['General Electricals'],
      historicalWins: 1,
      bidPriceDispersion: 'High Variance',
      anomalySignal: 'Active debarment record and high withdrawal rate.',
      riskLevel: 'HIGH',
      monthlyActivity: [
        { month: 'Mar 2026', bids: 3, withdrawals: 1 },
        { month: 'Apr 2026', bids: 2, withdrawals: 1 },
        { month: 'May 2026', bids: 4, withdrawals: 2 },
        { month: 'Jun 2026', bids: 3, withdrawals: 1 },
        { month: 'Jul 2026', bids: 2, withdrawals: 1 },
        { month: 'Aug 2026', bids: 4, withdrawals: 1 }
      ],
      cartelRiskIndicators: [
        { indicator: 'Active Debarment on File', detected: true, note: 'Ministry of Power order active' }
      ]
    },
    conflictChecks: []
  }
];

export const MOCK_ATTENTION_QUEUE: OfficerAttentionItem[] = [
  {
    id: 'att-1',
    bidderId: 'bidder-abc',
    bidderName: 'ABC Technologies Pvt. Ltd.',
    tenderNumber: 'CPCL/2026/PROC/1042',
    type: 'CRITICAL',
    title: 'Mandatory OEM Authorization Duplication Match',
    reason: 'Submitted OEM Authorization contains 96% similarity match and identical Ref # with another bidder in concurrent tender.',
    risk: 'HIGH',
    requirement: 'Clause 4.2.8 (OEM Authorization)',
    date: '25 Aug 2026 · 10:49 AM',
    actionLabel: 'Review Evidence →'
  },
  {
    id: 'att-2',
    bidderId: 'bidder-shakti',
    bidderName: 'Shakti Engineering Pvt. Ltd.',
    tenderNumber: 'CPCL/2026/PROC/1042',
    type: 'CRITICAL',
    title: 'Active CVC Debarment Record on File',
    reason: 'Central Vigilance Commission repository indicates active 2-year debarment order in force until Dec 2026.',
    risk: 'HIGH',
    requirement: 'Clause 1.8.3 (Non-Debarment)',
    date: '25 Aug 2026 · 10:10 AM',
    actionLabel: 'Review Debarment →'
  },
  {
    id: 'att-3',
    bidderId: 'bidder-bharat',
    bidderName: 'Bharat Industrial Systems',
    tenderNumber: 'CPCL/2026/PROC/1042',
    type: 'REVIEW',
    title: 'Company Address Discrepancy Across Statutory Sources',
    reason: 'Registered address differs between GST (Noida/Mumbai), Udyam (Ghaziabad/Rabale), and submitted Bid Form.',
    risk: 'MEDIUM',
    requirement: 'Clause 2.1.3 (Bidder Statutory Info)',
    date: '25 Aug 2026 · 10:35 AM',
    actionLabel: 'Investigate →'
  },
  {
    id: 'att-4',
    bidderId: 'bidder-abc',
    bidderName: 'ABC Technologies Pvt. Ltd.',
    tenderNumber: 'CPCL/2026/PROC/1042',
    type: 'REVIEW',
    title: 'Director Association with Debarred Sister Concern',
    reason: 'Director DIN 06894120 linked with historic 2024 suspension order at NHPC. Officer determination needed.',
    risk: 'MEDIUM',
    requirement: 'Clause 1.8.3 (Integrity Record)',
    date: '25 Aug 2026 · 10:45 AM',
    actionLabel: 'Evaluate Linkage →'
  },
  {
    id: 'att-5',
    bidderId: 'bidder-rajtech',
    bidderName: 'RajTech Solutions Ltd.',
    tenderNumber: 'CPCL/2026/PROC/1042',
    type: 'VERIFIED',
    title: 'Full Compliance Clearance (34/34 Rules)',
    reason: '34/34 mandatory requirements verified with 100% statutory match across GSTN, MCA21, EPFO, and CPPP.',
    risk: 'LOW',
    requirement: 'All Eligibility Criteria',
    date: '25 Aug 2026 · 10:15 AM',
    actionLabel: 'View Audit →'
  }
];

export const MOCK_AUDIT_TRAIL: AuditEvent[] = [
  {
    id: 'aud-1',
    timestamp: '25 Aug 2026 · 10:40 AM',
    actor: 'BharatBid AI',
    actorRole: 'Tender Clause Extraction Engine v2.4',
    action: 'Tender Ingestion & Rule Generation Completed',
    evidence: 'Tender NIT #CPCL/2026/PROC/1042 processed (142 pages)',
    result: '34 Compliance Rules Generated (9 Statutory, 7 Financial, 8 Technical, 6 Tender-Specific, 4 Document)',
    details: 'NLP semantic pipeline extracted deterministic thresholds, formula logic, and verification source mappings.',
    severity: 'info'
  },
  {
    id: 'aud-2',
    timestamp: '25 Aug 2026 · 10:41 AM',
    actor: 'GSTN Gateway',
    actorRole: 'National Direct API Connector',
    action: 'GSTIN Status Verification',
    evidence: 'GSTIN: 09AAACA1234F1Z8 (ABC Technologies Pvt. Ltd.)',
    result: 'Status: Active | Regular Taxpayer | Zero Default Flags',
    details: 'Cryptographic handshake verified with NIC GSTN production API. Payload hash: 8f4a1c9e88b2.',
    severity: 'success'
  },
  {
    id: 'aud-3',
    timestamp: '25 Aug 2026 · 10:42 AM',
    actor: 'MCA21 System',
    actorRole: 'Ministry of Corporate Affairs Connector',
    action: 'Financial Statements & Turnover Ingestion',
    evidence: 'Form MGT-7 & AOC-4 for FY23, FY24, FY25',
    result: 'Average Turnover: ₹12.23 Cr (Threshold: ≥ ₹10.00 Cr)',
    details: 'Statutory audited turnover exceeds tender requirement. Verified with CBDT PAN database.',
    severity: 'success'
  },
  {
    id: 'aud-4',
    timestamp: '25 Aug 2026 · 10:47 AM',
    actor: 'BharatBid AI',
    actorRole: 'Cross-Document Consistency Engine',
    action: 'Address Inconsistency Flagged',
    evidence: 'Comparison matrix across GSTN, Udyam, PAN and Bid Form',
    result: 'Address discrepancy detected across 3 sources (Noida vs Ghaziabad vs New Delhi)',
    details: 'Flagged with MEDIUM risk for officer clarification request. Not auto-disqualified.',
    severity: 'warn'
  },
  {
    id: 'aud-5',
    timestamp: '25 Aug 2026 · 10:49 AM',
    actor: 'BharatBid AI',
    actorRole: 'Document Integrity Fingerprinting Engine',
    action: 'Potential Duplicate Document Detected',
    evidence: 'OEM_Auth_Siemens_ABC.pdf vs IOCL Grid Tender Document',
    result: '96% Similarity Score | Ref #SGS/IND/2026/AUTH-8812 match',
    details: 'Deep layout fingerprinting detected near-identical document signature and watermarks with another bidder in related tender.',
    severity: 'critical'
  },
  {
    id: 'aud-6',
    timestamp: '25 Aug 2026 · 10:54 AM',
    actor: 'Procurement Officer',
    actorRole: 'Rajesh Kumar (Chief Procurement Officer)',
    action: 'Officer Evidence Review Opened',
    evidence: 'Evidence Drawer accessed for OEM Authorization & Address inconsistency',
    result: 'Case added to Smart Officer Attention Queue',
    details: 'Officer reviewed side-by-side visual diff and AI reasoning logs.',
    severity: 'info'
  },
  {
    id: 'aud-7',
    timestamp: '25 Aug 2026 · 10:57 AM',
    actor: 'Procurement Officer',
    actorRole: 'Rajesh Kumar (Chief Procurement Officer)',
    action: 'Formal Clarification Notice Drafted',
    evidence: 'Official Letter Ref: CPCL/PROC/2026/CLARIF-042',
    result: '48-Hour Technical Clarification Request Queued for Dispatch',
    details: 'Bidder requested to validate OEM letter authenticity and confirm legal communication address with supporting proof.',
    severity: 'warn'
  }
];

export const MOCK_TENDERS: Tender[] = INITIAL_TENDERS;
export const MOCK_AUDIT_EVENTS: AuditEvent[] = MOCK_AUDIT_TRAIL;
export const MOCK_ATTENTION_ITEMS: OfficerAttentionItem[] = MOCK_ATTENTION_QUEUE;
export const MOCK_COMPLIANCE_RULES: ComplianceRule[] = INITIAL_TENDERS[0].clauses.map(c => c.extractedRule);

export const MOCK_CLARIFICATIONS = [
  {
    id: 'clarif-101',
    tenderId: 'tender-1',
    tenderNumber: 'CPCL/2026/PROC/1042',
    subject: 'Discrepancy in Registered Office Address across Statutory Registrations',
    clauseRef: 'Clause 2.4.1 (Statutory Compliance)',
    officerQuery: 'During automated multi-registry verification, the communication address in your Bid Submission Form (B-12, Sector 62, Noida) differs from the MCA21 registered office (C-44, Okhla Phase II, New Delhi) and the GSTIN principal place of business (Ghaziabad, UP). Kindly submit a notarized clarification along with lease deed / utility bill explaining this variance within 48 hours.',
    raisedDate: '25 Aug 2026, 11:00 AM IST',
    deadline: '27 Aug 2026, 05:00 PM IST',
    status: 'PENDING_RESPONSE',
    bidderResponse: '',
    respondedAt: '',
    attachedDocName: ''
  },
  {
    id: 'clarif-102',
    tenderId: 'tender-1',
    tenderNumber: 'CPCL/2026/PROC/1042',
    subject: 'OEM Authorization Letter Verification (Manufacturer Serial Reference)',
    clauseRef: 'Clause 4.2.8 (Manufacturer Authorization)',
    officerQuery: 'Kindly furnish a direct email confirmation or notarized confirmation from Siemens Energy India confirming that authorization letter Ref: SGS/IND/2026/AUTH-8812 was exclusively issued for this CPCL tender.',
    raisedDate: '25 Aug 2026, 11:30 AM IST',
    deadline: '28 Aug 2026, 02:00 PM IST',
    status: 'PENDING_RESPONSE',
    bidderResponse: '',
    respondedAt: '',
    attachedDocName: ''
  }
];

export const DEMO_OFFICER_USER = {
  id: 'off-01',
  name: 'Rajesh Kumar, IRSS',
  role: 'OFFICER' as const,
  email: 'rajesh.kumar@cpcl.gov.in',
  designation: 'Chief Procurement Officer',
  organization: 'Chennai Petroleum Corporation Limited (CPCL)',
  department: 'Contracts & Materials Management Division',
  dscToken: 'NIC-CCA-2026-9912 (Token ID: e-Mudhra Class 3)'
};

export const DEMO_BIDDER_USER = {
  id: 'b1',
  name: 'ABC Technologies Pvt. Ltd.',
  role: 'BIDDER' as const,
  email: 'tenders@abctechnologies.com',
  bidderId: 'b1',
  gstin: '07AABCA1234F1Z5',
  pan: 'AABCA1234F',
  cin: 'U72200DL2018PTC334567',
  category: 'MSME (Class: Small Enterprise)',
  vendorCode: 'VEN-2026-9041'
};

