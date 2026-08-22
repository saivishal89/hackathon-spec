import React, { useState } from 'react';
import { 
  Sliders, 
  Crown, 
  ShieldCheck, 
  Clock, 
  DollarSign, 
  Check, 
  Sparkles, 
  AlertTriangle,
  Plus,
  Save
} from 'lucide-react';
import { useRequests } from '../../hooks/useRequests';
import { SLAPolicy, PriorityTarget } from '../../types/sla';
import { Priority } from '../../types/request';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Input } from '../../components/ui/Input';

export interface SLAPoliciesProps {
  onNavigate: (path: string) => void;
}

export function SLAPolicies({ onNavigate }: SLAPoliciesProps) {
  const { policies, updatePolicy } = useRequests();
  const [selectedPolicyId, setSelectedPolicyId] = useState(policies[0]?.id || 'sla-plat-01');
  const [activePolicy, setActivePolicy] = useState<SLAPolicy>(
    policies.find(p => p.id === selectedPolicyId) || policies[0]
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSelectPolicy = (policy: SLAPolicy) => {
    setSelectedPolicyId(policy.id);
    setActivePolicy(policy);
    setSaveSuccess(false);
  };

  const handleTargetChange = (
    priority: Priority,
    field: 'responseTimeMinutes' | 'resolutionTimeHours' | 'escalationWarningMinutes',
    value: number
  ) => {
    const updatedTargets = activePolicy.targets.map(target => {
      if (target.priority === priority) {
        return { ...target, [field]: value };
      }
      return target;
    });

    setActivePolicy(prev => ({ ...prev, targets: updatedTargets }));
  };

  const handleSave = () => {
    updatePolicy(activePolicy);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-indigo-400">
              SLA Policy Studio
            </span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.2 rounded-full font-semibold">
              Multi-Tier Enforcement Active
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            SLA Policy & Target Governance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Configure response and resolution thresholds, escalation alert rules, and contractual penalty parameters.
          </p>
        </div>

        <Button
          variant="ai-glow"
          size="md"
          leftIcon={saveSuccess ? <Check className="h-4 w-4 text-emerald-300" /> : <Save className="h-4 w-4" />}
          onClick={handleSave}
          className="text-xs font-semibold"
        >
          {saveSuccess ? 'Policy Saved Successfully!' : 'Save Policy Changes'}
        </Button>
      </div>

      {/* Main Grid: Policy Tier Selector & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Tiers Selection (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Contract Policy Tiers
          </span>

          <div className="space-y-3">
            {policies.map(policy => {
              const isSelected = selectedPolicyId === policy.id;

              return (
                <div
                  key={policy.id}
                  onClick={() => handleSelectPolicy(policy)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {policy.tier === 'PLATINUM' && <Crown className="h-4 w-4 text-purple-400" />}
                      {policy.tier === 'GOLD' && <ShieldCheck className="h-4 w-4 text-amber-400" />}
                      {policy.tier === 'SILVER' && <ShieldCheck className="h-4 w-4 text-slate-400" />}
                      <h4 className="text-sm font-bold text-white">{policy.name}</h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {policy.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-800/80 text-[11px]">
                    <span className="text-slate-400 font-mono">Hours: {policy.businessHours}</span>
                    {policy.breachPenaltyEnabled && (
                      <span className="font-mono text-rose-400 font-semibold">
                        ${policy.breachPenaltyPerMinuteUsd}/min Penalty
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Policy Target Threshold Editor (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card variant="glass" className="p-6 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  Editing: {activePolicy.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Adjust response and resolution commitments for each severity tier.
                </p>
              </div>

              <Badge variant={activePolicy.tier === 'PLATINUM' ? 'purple' : 'primary'}>
                {activePolicy.tier} TIER
              </Badge>
            </div>

            {/* Target Thresholds Matrix Table */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                SLA Target Commitments Matrix
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-[11px] font-semibold text-slate-400 uppercase">
                      <th className="py-2.5 px-3">Severity</th>
                      <th className="py-2.5 px-3">Max Response Time</th>
                      <th className="py-2.5 px-3">Max Resolution Time</th>
                      <th className="py-2.5 px-3">Escalation Warning</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {activePolicy.targets.map(target => (
                      <tr key={target.priority} className="hover:bg-slate-800/30">
                        <td className="py-3 px-3 font-semibold text-slate-200">
                          {target.priority.replace('_', ' ')}
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={target.responseTimeMinutes}
                              onChange={e =>
                                handleTargetChange(target.priority, 'responseTimeMinutes', Number(e.target.value))
                              }
                              className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <span className="text-slate-400">mins</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={target.resolutionTimeHours}
                              onChange={e =>
                                handleTargetChange(target.priority, 'resolutionTimeHours', Number(e.target.value))
                              }
                              className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <span className="text-slate-400">hours</span>
                          </div>
                        </td>
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              value={target.escalationWarningMinutes}
                              onChange={e =>
                                handleTargetChange(target.priority, 'escalationWarningMinutes', Number(e.target.value))
                              }
                              className="w-20 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
                            />
                            <span className="text-slate-400">mins before</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Financial Penalty & Business Hours Configuration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="h-4 w-4 text-emerald-400" />
                  <span>Financial Breach Penalty</span>
                </span>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="penalty-toggle"
                    checked={activePolicy.breachPenaltyEnabled}
                    onChange={e => setActivePolicy(prev => ({ ...prev, breachPenaltyEnabled: e.target.checked }))}
                    className="h-4 w-4 rounded bg-slate-800 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                  <label htmlFor="penalty-toggle" className="text-xs text-slate-200 font-medium cursor-pointer">
                    Enable Breach Penalty Calculation
                  </label>
                </div>

                {activePolicy.breachPenaltyEnabled && (
                  <div className="flex items-center gap-2 pt-1">
                    <span className="text-xs text-slate-400">Penalty rate:</span>
                    <input
                      type="number"
                      value={activePolicy.breachPenaltyPerMinuteUsd || 150}
                      onChange={e =>
                        setActivePolicy(prev => ({
                          ...prev,
                          breachPenaltyPerMinuteUsd: Number(e.target.value),
                        }))
                      }
                      className="w-24 rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-100 font-mono"
                    />
                    <span className="text-xs text-slate-400">USD / min</span>
                  </div>
                )}
              </div>

              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-indigo-400" />
                  <span>Operating Business Hours</span>
                </span>

                <select
                  value={activePolicy.businessHours}
                  onChange={e => setActivePolicy(prev => ({ ...prev, businessHours: e.target.value as any }))}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-100 cursor-pointer"
                >
                  <option value="24x7">24x7 Continuous Support (Mission Critical)</option>
                  <option value="9-to-5">9-to-5 Standard Business Hours (Mon-Fri)</option>
                </select>

                <p className="text-[11px] text-slate-400">
                  {activePolicy.businessHours === '24x7'
                    ? 'SLA clock ticks continuously through weekends and holidays.'
                    : 'SLA countdown pauses outside 09:00 - 17:00 local business hours.'}
                </p>
              </div>
            </div>

          </Card>
        </div>

      </div>

    </div>
  );
}
