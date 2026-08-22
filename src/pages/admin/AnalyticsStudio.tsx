import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Layers, 
  Calendar,
  Activity,
  Zap,
  Filter,
  Download
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
  CartesianGrid, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { useToast } from '../../components/ui/Toast';

const COMPLIANCE_30D_DATA = [
  { day: 'Day 1', compliance: 98.4, target: 99.0, incidents: 14, breaches: 0 },
  { day: 'Day 5', compliance: 99.1, target: 99.0, incidents: 18, breaches: 0 },
  { day: 'Day 10', compliance: 97.2, target: 99.0, incidents: 24, breaches: 1 },
  { day: 'Day 15', compliance: 98.8, target: 99.0, incidents: 19, breaches: 0 },
  { day: 'Day 20', compliance: 96.5, target: 99.0, incidents: 31, breaches: 2 },
  { day: 'Day 25', compliance: 98.9, target: 99.0, incidents: 22, breaches: 0 },
  { day: 'Day 30', compliance: 99.4, target: 99.0, incidents: 16, breaches: 0 },
];

const DEPARTMENT_MTTR_DATA = [
  { department: 'DevOps', actualHours: 1.8, targetHours: 2.0, throughput: 84 },
  { department: 'IT Infra', actualHours: 4.6, targetHours: 3.0, throughput: 112 },
  { department: 'Core Eng', actualHours: 5.2, targetHours: 6.0, throughput: 145 },
  { department: 'Security', actualHours: 1.1, targetHours: 2.0, throughput: 42 },
  { department: 'Billing', actualHours: 2.8, targetHours: 4.0, throughput: 56 },
];

const RISK_PIE_DATA = [
  { name: 'Low Risk (<35%)', value: 54, color: '#10B981' },
  { name: 'Medium Risk (35-59%)', value: 26, color: '#F59E0B' },
  { name: 'High Risk (60-79%)', value: 14, color: '#F97316' },
  { name: 'Critical Risk (>80%)', value: 6, color: '#EF4444' },
];

export function AnalyticsStudio() {
  const { showToast } = useToast();
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D' | '90D'>('30D');

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
              Intelligence & Telemetry
            </span>
            <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.2 rounded-full font-semibold">
              Recharts Data Studio
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Visual Analytics & MTTR Performance Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Deep-dive operational metrics, resolution velocity benchmarks, and SLA compliance forecasting.
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 p-1 rounded-xl">
          {(['24H', '7D', '30D', '90D'] as const).map(range => (
            <button
              key={range}
              onClick={() => {
                setTimeRange(range);
                showToast(`Time Range Updated`, `Loaded telemetry for past ${range}`, 'info');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                timeRange === range ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* 1. Main 30-Day SLA Compliance Interactive Area Graph */}
      <Card variant="glass" className="p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h4 className="text-sm font-bold text-white tracking-tight">
              SLA Compliance Rate vs Target Benchmark ({timeRange})
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Continuous multi-point tracking of contract resolution compliance percentage.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
              <span className="text-slate-300">Actual Compliance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-0.5 w-3 bg-emerald-400 border border-dashed" />
              <span className="text-emerald-400">99.0% Commitment Target</span>
            </div>
          </div>
        </div>

        <div className="h-72 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={COMPLIANCE_30D_DATA}>
              <defs>
                <linearGradient id="complianceGlow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.5} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
              <YAxis domain={[94, 100]} stroke="#64748B" fontSize={11} tickFormatter={val => `${val}%`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                formatter={(val: any) => [`${val}%`, '']}
              />
              <Area type="monotone" dataKey="compliance" name="SLA Compliance" stroke="#6366F1" strokeWidth={3} fillOpacity={1} fill="url(#complianceGlow)" />
              <Area type="monotone" dataKey="target" name="Contract Target" stroke="#10B981" strokeWidth={1.5} strokeDasharray="5 5" fill="none" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 2. Department MTTR Comparison & Risk Donut Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Department MTTR (7 cols) */}
        <Card variant="glass" className="lg:col-span-7 p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white tracking-tight">
                Mean Time To Resolution (MTTR) by Department
              </h4>
              <p className="text-xs text-slate-400">Actual resolution duration vs target commitment in hours</p>
            </div>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DEPARTMENT_MTTR_DATA} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="department" stroke="#64748B" fontSize={11} />
                <YAxis stroke="#64748B" fontSize={11} tickFormatter={val => `${val}h`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`${val} Hours`, '']}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="actualHours" name="Actual MTTR (Hours)" fill="#818CF8" radius={[6, 6, 0, 0]} />
                <Bar dataKey="targetHours" name="Target Target (Hours)" fill="#334155" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Breach Risk Distribution Donut (5 cols) */}
        <Card variant="glass" className="lg:col-span-5 p-6 space-y-4 flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white tracking-tight">Active Queue Risk Breakdown</h4>
            <p className="text-xs text-slate-400">ML predicted breach probability brackets</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={RISK_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {RISK_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0B0F19" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0B0F19', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  formatter={(val: any) => [`${val}% of queue`, '']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-medium border-t border-slate-800">
            {RISK_PIE_DATA.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}
