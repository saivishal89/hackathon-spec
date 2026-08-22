export interface ClientContract {
  id: string;
  organizationName: string;
  contactName: string;
  contactEmail: string;
  tier: 'PLATINUM' | 'GOLD' | 'SILVER';
  monthlyContractValueUsd: number;
  uptimeGuaranteePercent: number;
  penaltyPerMinuteUsd: number;
  maxMonthlyLiabilityCapUsd: number;
  activeRequestsCount: number;
  status: 'ACTIVE' | 'WARNING' | 'BREACH_REVIEW';
  accruedPenaltiesThisMonthUsd: number;
}

export interface SLACreditLedgerItem {
  id: string;
  ticketNumber: string;
  organizationName: string;
  breachDate: string;
  overdueMinutes: number;
  penaltyPerMinuteUsd: number;
  calculatedCreditUsd: number;
  status: 'PENDING_APPROVAL' | 'APPROVED_CREDITED' | 'WAIVED_DISPUTED';
  reason: string;
  reviewedBy?: string;
}

export const MOCK_CLIENT_CONTRACTS: ClientContract[] = [
  {
    id: 'cnt-01',
    organizationName: 'FinTech Global Systems',
    contactName: 'Alex Morgan',
    contactEmail: 'alex.morgan@fintechcorp.com',
    tier: 'PLATINUM',
    monthlyContractValueUsd: 35000,
    uptimeGuaranteePercent: 99.9,
    penaltyPerMinuteUsd: 150,
    maxMonthlyLiabilityCapUsd: 10000,
    activeRequestsCount: 3,
    status: 'ACTIVE',
    accruedPenaltiesThisMonthUsd: 1500, // 10 mins on breached Redis ticket
  },
  {
    id: 'cnt-02',
    organizationName: 'Acme International',
    contactName: 'Jordan Lee',
    contactEmail: 'jordan.lee@acmecorp.com',
    tier: 'PLATINUM',
    monthlyContractValueUsd: 28000,
    uptimeGuaranteePercent: 99.9,
    penaltyPerMinuteUsd: 150,
    maxMonthlyLiabilityCapUsd: 8500,
    activeRequestsCount: 2,
    status: 'WARNING',
    accruedPenaltiesThisMonthUsd: 750,
  },
  {
    id: 'cnt-03',
    organizationName: 'Starlight Media Streaming',
    contactName: 'Daniel Craig',
    contactEmail: 'daniel@starlight.io',
    tier: 'GOLD',
    monthlyContractValueUsd: 14500,
    uptimeGuaranteePercent: 99.5,
    penaltyPerMinuteUsd: 50,
    maxMonthlyLiabilityCapUsd: 4000,
    activeRequestsCount: 1,
    status: 'ACTIVE',
    accruedPenaltiesThisMonthUsd: 0,
  },
  {
    id: 'cnt-04',
    organizationName: 'Nova Retail Cloud',
    contactName: 'Samantha Wu',
    contactEmail: 'samantha@novaretail.com',
    tier: 'SILVER',
    monthlyContractValueUsd: 6500,
    uptimeGuaranteePercent: 98.0,
    penaltyPerMinuteUsd: 0, // No financial penalty
    maxMonthlyLiabilityCapUsd: 0,
    activeRequestsCount: 1,
    status: 'ACTIVE',
    accruedPenaltiesThisMonthUsd: 0,
  },
];

export const MOCK_CREDIT_LEDGER: SLACreditLedgerItem[] = [
  {
    id: 'crd-101',
    ticketNumber: 'SLA-8945',
    organizationName: 'FinTech Global Systems',
    breachDate: '2026-08-22 15:40',
    overdueMinutes: 10,
    penaltyPerMinuteUsd: 150,
    calculatedCreditUsd: 1500,
    status: 'PENDING_APPROVAL',
    reason: 'Redis Cluster Split-Brain Partition during Network Maintenance exceeded 2h SLA by 10m.',
  },
  {
    id: 'crd-102',
    ticketNumber: 'SLA-8812',
    organizationName: 'Acme International',
    breachDate: '2026-08-14 11:20',
    overdueMinutes: 5,
    penaltyPerMinuteUsd: 150,
    calculatedCreditUsd: 750,
    status: 'APPROVED_CREDITED',
    reason: 'Canary Gateway deployment latency spike exceeded 6h resolution window.',
    reviewedBy: 'Sarah Connor',
  },
  {
    id: 'crd-103',
    ticketNumber: 'SLA-8740',
    organizationName: 'FinTech Global Systems',
    breachDate: '2026-08-02 09:15',
    overdueMinutes: 12,
    penaltyPerMinuteUsd: 150,
    calculatedCreditUsd: 1800,
    status: 'WAIVED_DISPUTED',
    reason: 'Client scheduled maintenance extension confirmed outside business impact window.',
    reviewedBy: 'Sarah Connor',
  }
];

export const MOCK_MONTHLY_FINANCIALS = [
  { month: 'Mar', grossRevenue: 72000, slaCreditsIssued: 4200, netRevenue: 67800, aiSavings: 18500 },
  { month: 'Apr', grossRevenue: 76000, slaCreditsIssued: 3100, netRevenue: 72900, aiSavings: 24200 },
  { month: 'May', grossRevenue: 81000, slaCreditsIssued: 2200, netRevenue: 78800, aiSavings: 31000 },
  { month: 'Jun', grossRevenue: 84000, slaCreditsIssued: 1800, netRevenue: 82200, aiSavings: 38400 },
  { month: 'Jul', grossRevenue: 88000, slaCreditsIssued: 1200, netRevenue: 86800, aiSavings: 42100 },
  { month: 'Aug', grossRevenue: 92000, slaCreditsIssued: 2250, netRevenue: 89750, aiSavings: 48200 },
];
