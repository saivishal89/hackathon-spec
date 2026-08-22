import React from 'react';
import { ShieldCheck, BarChart3, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { Card } from '../ui/Card';
import { MOCK_DEPARTMENT_PERFORMANCE } from '../../data/mockSLA';
import { DepartmentPerformance } from '../../types/sla';

export interface SLAOverviewProps {
  departmentStats?: DepartmentPerformance[];
}

const RISK_DONUT_DATA = [
  { name: 'Low Risk (<35%)', value: 54, color: '#10B981' },
  { name: 'Medium Risk (35-59%)', value: 26, color: '#F59E0B' },
  { name: 'High Risk (60-79%)', value: 14, color: '#F97316' },
  { name: 'Critical (>80%)', value: 6, color: '#EF4444' },
];

export function SLAOverview({ departmentStats = MOCK_DEPARTMENT_PERFORMANCE }: SLAOverviewProps) {
  const chartData = departmentStats.map(d => ({
    name: d.department.split(' ')[0],
    fullName: d.department,
    compliance: d.complianceRate,
    avgHours: d.avgResolutionHours,
    isCritical: d.complianceRate < 90,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Department Compliance Graph & Bars (7 cols) */}
      <Card variant="glass" className="lg:col-span-7 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Department SLA Performance</h4>
              <p className="text-xs text-slate-400">Interactive resolution compliance</p>
            </div>
          </div>

          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
            Target: 99.0%
          </span>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-44 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="name" stroke="#64748B" fontSize={10} />
              <YAxis domain={[80, 100]} stroke="#64748B" fontSize={10} tickFormatter={val => `${val}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                formatter={(val: any) => [`${val}% Compliance`, '']}
              />
              <Bar dataKey="compliance" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.isCritical ? '#EF4444' : entry.compliance < 96 ? '#F59E0B' : '#6366F1'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Detailed Health Bars */}
        <div className="space-y-2.5 pt-1 border-t border-slate-800/80">
          {departmentStats.slice(0, 3).map(dept => {
            const isCritical = dept.complianceRate < 90;
            return (
              <div key={dept.department} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">{dept.department}</span>
                  <span className={`font-mono font-bold text-xs ${isCritical ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {dept.complianceRate}%
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${isCritical ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${dept.complianceRate}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Risk Distribution Donut (5 cols) */}
      <Card variant="glass" className="lg:col-span-5 p-5 space-y-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h4 className="text-sm font-semibold text-white">Live Risk Distribution</h4>
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Queue Load</span>
          </div>

          <div className="h-44 w-full flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_DONUT_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {RISK_DONUT_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B0F19" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                  formatter={(val: any) => [`${val}%`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-800 font-medium">
            {RISK_DONUT_DATA.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/20 mt-2">
          <p className="text-[11px] text-indigo-300 font-medium leading-relaxed">
            ✨ AI Recommendation: IT Infra workload redistributed reduces overall risk by 28%.
          </p>
        </div>
      </Card>

    </div>
  );
}
