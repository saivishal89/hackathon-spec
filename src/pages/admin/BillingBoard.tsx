import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Building, 
  FileText, 
  ArrowUpRight,
  Crown,
  Check,
  XCircle,
  Download,
  Filter
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid 
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';
import { 
  MOCK_CLIENT_CONTRACTS, 
  MOCK_CREDIT_LEDGER, 
  MOCK_MONTHLY_FINANCIALS, 
  SLACreditLedgerItem 
} from '../../data/mockBilling';

export function BillingBoard() {
  const { showToast } = useToast();
  const [ledger, setLedger] = useState<SLACreditLedgerItem[]>(MOCK_CREDIT_LEDGER);
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('ALL');

  const totalMonthlyGross = MOCK_CLIENT_CONTRACTS.reduce((sum, c) => sum + c.monthlyContractValueUsd, 0);
  const totalAccruedPenalties = ledger
    .filter(l => l.status === 'APPROVED_CREDITED' || l.status === 'PENDING_APPROVAL')
    .reduce((sum, l) => sum + l.calculatedCreditUsd, 0);
  const netRealizedRevenue = totalMonthlyGross - totalAccruedPenalties;

  const handleApproveCredit = (id: string) => {
    setLedger(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: 'APPROVED_CREDITED', reviewedBy: 'Sarah Connor (Admin)' }
          : item
      )
    );
    showToast('SLA Credit Approved', 'Credit deduction synced to next month client invoice.', 'success');
  };

  const handleWaiveCredit = (id: string) => {
    setLedger(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: 'WAIVED_DISPUTED', reviewedBy: 'Sarah Connor (Admin)' }
          : item
      )
    );
    showToast('SLA Credit Waived', 'Credit waived under maintenance grace protocol.', 'info');
  };

  const filteredContracts = MOCK_CLIENT_CONTRACTS.filter(c =>
    selectedTierFilter === 'ALL' ? true : c.tier === selectedTierFilter
  );

  return (
    <div className="space-y-6">
      
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Financial Operations & Billing
            </span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 px-2 py-0.2 rounded-full font-semibold">
              Live Contract SLA Accounting
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Enterprise Billing & SLA Liability Board
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time penalty liability tracking, contract SLA credit disbursements, and AI ROI telemetry.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="glass"
            size="sm"
            leftIcon={<Download className="h-4 w-4" />}
            onClick={() => showToast('Export Generated', 'Monthly SLA Financial Report downloaded as CSV.', 'info')}
            className="text-xs"
          >
            Export Ledger
          </Button>
        </div>
      </div>

      {/* 1. Top Executive Financial Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Gross Contract MRR */}
        <Card variant="glass" className="p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Gross Monthly MRR
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-white font-mono">
            ${totalMonthlyGross.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-emerald-400 font-medium flex items-center gap-1">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+14.2% YoY growth</span>
          </div>
        </Card>

        {/* Live Penalty Exposure */}
        <Card variant="glow" className="p-5 relative overflow-hidden border-rose-500/30 bg-rose-950/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-300">
              Accrued Penalty Liability
            </span>
            <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30 animate-pulse">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-rose-400 font-mono">
            ${totalAccruedPenalties.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-rose-300 font-medium">
            Rate: <span className="font-bold font-mono">$150/min</span> on breached Platinum
          </div>
        </Card>

        {/* Net Realized Revenue */}
        <Card variant="glass" className="p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Net Realized Revenue
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-emerald-400 font-mono">
            ${netRealizedRevenue.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-slate-400 font-medium">
            97.6% revenue realization rate
          </div>
        </Card>

        {/* AI Prevention Savings */}
        <Card variant="glass" className="p-5 relative overflow-hidden bg-gradient-to-br from-indigo-950/30 to-purple-950/30 border-purple-500/30">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
              AI SLA Cost Savings
            </span>
            <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-md">
              <Sparkles className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-purple-300 font-mono">
            +$48,200
          </div>
          <div className="mt-2 text-xs text-purple-300 font-medium">
            38 breaches prevented in Q3
          </div>
        </Card>

      </div>

      {/* 2. Interactive Revenue & Penalty Trends (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Revenue & AI Savings Area Graph (7 cols) */}
        <Card variant="glass" className="lg:col-span-7 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Net Contract Revenue vs AI Penalty Savings
              </h4>
              <p className="text-xs text-slate-400">Monthly gross volume and prevented liability</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
              6-Month Trend
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_MONTHLY_FINANCIALS}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="savingsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={val => `$${val / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`$${val.toLocaleString()}`, '']}
                />
                <Area type="monotone" dataKey="netRevenue" name="Net Revenue" stroke="#6366F1" strokeWidth={2.5} fillOpacity={1} fill="url(#revenueGrad)" />
                <Area type="monotone" dataKey="aiSavings" name="AI Penalty Savings" stroke="#10B981" strokeWidth={2} strokeDasharray="4 4" fillOpacity={1} fill="url(#savingsGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Contract Tier Revenue Breakdown (5 cols) */}
        <Card variant="glass" className="lg:col-span-5 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">Contract Tier Revenue Matrix</h4>
              <p className="text-xs text-slate-400">Distribution by contract commitments</p>
            </div>
          </div>

          <div className="space-y-3 pt-1">
            <div className="p-3.5 rounded-xl bg-purple-950/20 border border-purple-500/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Crown className="h-4 w-4 text-purple-400" />
                  <span className="text-xs font-bold text-white">Platinum Tier (99.9%)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">2 Enterprise Accounts • $150/min Penalty</p>
              </div>
              <span className="font-mono font-bold text-purple-300 text-sm">$63,000 / mo</span>
            </div>

            <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span className="text-xs font-bold text-white">Gold Tier (99.5%)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">1 Commercial Account • $50/min Penalty</p>
              </div>
              <span className="font-mono font-bold text-amber-300 text-sm">$14,500 / mo</span>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-slate-400" />
                  <span className="text-xs font-bold text-white">Silver Tier (98.0%)</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">1 Growth Account • No Breach Penalty</p>
              </div>
              <span className="font-mono font-bold text-slate-300 text-sm">$6,500 / mo</span>
            </div>
          </div>
        </Card>

      </div>

      {/* 3. SLA Penalty Credit Ledger & Approval Manager */}
      <Card variant="glass" className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              SLA Breach Credit Disbursement Ledger
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Review and approve penalty refunds triggered by SLA deadline breaches.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/30">
            {ledger.filter(l => l.status === 'PENDING_APPROVAL').length} Pending Approvals
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-3">Ticket</th>
                <th className="py-3 px-3">Organization</th>
                <th className="py-3 px-3">Breach Duration</th>
                <th className="py-3 px-3">Penalty Rate</th>
                <th className="py-3 px-3">Total Credit</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {ledger.map(item => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition">
                  <td className="py-3.5 px-3 whitespace-nowrap">
                    <span className="font-mono font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                      {item.ticketNumber}
                    </span>
                  </td>

                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-slate-200">{item.organizationName}</div>
                    <div className="text-[11px] text-slate-400">{item.breachDate}</div>
                  </td>

                  <td className="py-3.5 px-3 font-mono text-rose-400 font-bold">
                    +{item.overdueMinutes}m overdue
                  </td>

                  <td className="py-3.5 px-3 font-mono text-slate-300">
                    ${item.penaltyPerMinuteUsd} / min
                  </td>

                  <td className="py-3.5 px-3 font-mono text-rose-400 font-extrabold text-sm">
                    ${item.calculatedCreditUsd.toLocaleString()}
                  </td>

                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        item.status === 'APPROVED_CREDITED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : item.status === 'WAIVED_DISPUTED'
                          ? 'bg-slate-800 text-slate-400 border border-slate-700'
                          : 'bg-amber-500/10 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {item.status.replace('_', ' ')}
                    </span>
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    {item.status === 'PENDING_APPROVAL' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          size="sm"
                          variant="primary"
                          onClick={() => handleApproveCredit(item.id)}
                          className="text-xs px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 border-emerald-500/40"
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleWaiveCredit(item.id)}
                          className="text-xs px-2.5 py-1 text-slate-400 hover:text-white"
                        >
                          Waive
                        </Button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-500 italic">
                        Reviewed by {item.reviewedBy || 'Admin'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. Enterprise Client Contracts Roster */}
      <Card variant="glass" className="p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-indigo-400" />
            <h4 className="text-sm font-bold text-white tracking-tight">Active Client SLA Contracts</h4>
          </div>
          <div className="flex items-center gap-1 text-xs">
            <span className="text-slate-400">Filter Tier:</span>
            <select
              value={selectedTierFilter}
              onChange={e => setSelectedTierFilter(e.target.value)}
              className="rounded-lg bg-slate-900 border border-slate-700 px-2 py-1 text-xs text-slate-200"
            >
              <option value="ALL">All Tiers</option>
              <option value="PLATINUM">Platinum</option>
              <option value="GOLD">Gold</option>
              <option value="SILVER">Silver</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredContracts.map(contract => (
            <div
              key={contract.id}
              className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white">{contract.organizationName}</h5>
                  <p className="text-[11px] text-slate-400">{contract.contactName} ({contract.contactEmail})</p>
                </div>
                <span
                  className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    contract.tier === 'PLATINUM'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : contract.tier === 'GOLD'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  {contract.tier}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] pt-2 border-t border-slate-800/80 font-mono">
                <div>
                  <span className="text-slate-500 block text-[10px]">MRR Value:</span>
                  <span className="font-bold text-slate-200">${contract.monthlyContractValueUsd.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SLA Target:</span>
                  <span className="font-bold text-emerald-400">{contract.uptimeGuaranteePercent}%</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">Penalty / Min:</span>
                  <span className="font-bold text-rose-400">${contract.penaltyPerMinuteUsd}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

    </div>
  );
}
