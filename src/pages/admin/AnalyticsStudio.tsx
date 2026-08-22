import React, { useState, useEffect } from 'react';
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
  Download,
  Star,
  MessageSquare,
  Smile,
  ThumbsUp,
  HeartHandshake
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
import { ApiClient, FeedbackStats } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

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
  const { session } = useAuth();
  const [timeRange, setTimeRange] = useState<'24H' | '7D' | '30D' | '90D'>('30D');
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats>({
    averageCsat: 4.8,
    totalFeedbacks: 14,
    responseQualityPercentage: 94.0,
    slaSatisfactionPercentage: 91.0,
    ratingDistribution: { 5: 11, 4: 2, 3: 1, 2: 0, 1: 0 },
    recentFeedbacks: [
      {
        id: 'fb-101',
        requestId: 'req-103',
        userName: 'Alex Morgan (FinTech Global Systems)',
        rating: 5,
        responseQualityRating: 5,
        slaSatisfactionRating: 5,
        comment: 'Outstanding response time! Elena renewed our SSO cert with zero downtime. SLA response exceeded expectations.',
        createdAt: '2 hours ago',
      },
      {
        id: 'fb-102',
        requestId: 'req-104',
        userName: 'Devin Thorne (FinTech Global Systems)',
        rating: 5,
        responseQualityRating: 5,
        slaSatisfactionRating: 4,
        comment: 'Proactive mitigation warning prevented our ingress bottleneck. Very impressed by the automated alert.',
        createdAt: '1 day ago',
      },
      {
        id: 'fb-103',
        requestId: 'req-105',
        userName: 'Rachel Chen (CloudScale Inc)',
        rating: 4,
        responseQualityRating: 4,
        slaSatisfactionRating: 5,
        comment: 'Great communication in the support audit thread. Resolution within 3 hours.',
        createdAt: '3 days ago',
      }
    ]
  });

  useEffect(() => {
    const fetchFeedback = async () => {
      const response = await ApiClient.getFeedbackStats(session);
      if (response.status === 200 && response.data) {
        setFeedbackStats(response.data);
      }
    };
    fetchFeedback();
  }, [session]);

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
            Visual Analytics & SLA Intelligence Studio
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Deep-dive operational metrics, resolution velocity benchmarks, SLA compliance forecasting, and customer feedback loops.
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

      {/* 3. Customer Satisfaction & Feedback Intelligence Hub */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <HeartHandshake className="h-5 w-5 text-indigo-400" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Customer Feedback & Post-Resolution CSAT Intelligence
          </h3>
          <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded-full">
            Product Feedback Loop
          </span>
        </div>

        {/* CSAT Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <Card variant="glass" className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
              <Star className="h-6 w-6 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                Average CSAT Score
              </span>
              <div className="text-2xl font-extrabold text-white font-mono mt-0.5">
                {feedbackStats.averageCsat} <span className="text-sm font-normal text-slate-400">/ 5.0</span>
              </div>
              <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                <TrendingUp className="h-3 w-3" /> Top decile benchmark
              </span>
            </div>
          </Card>

          <Card variant="glass" className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
              <ThumbsUp className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                Response Quality Rating
              </span>
              <div className="text-2xl font-extrabold text-indigo-300 font-mono mt-0.5">
                {feedbackStats.responseQualityPercentage}%
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Measured across all resolved tickets
              </span>
            </div>
          </Card>

          <Card variant="glass" className="p-5 flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
                SLA Timeliness Satisfaction
              </span>
              <div className="text-2xl font-extrabold text-purple-300 font-mono mt-0.5">
                {feedbackStats.slaSatisfactionPercentage}%
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">
                Contract commitment alignment
              </span>
            </div>
          </Card>

        </div>

        {/* Customer Quotes & Reviews List */}
        <Card variant="glass" className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h4 className="text-sm font-bold text-white tracking-tight">Recent Client Resolution Reviews</h4>
            <span className="text-xs text-slate-400 font-mono">{feedbackStats.totalFeedbacks} Total Recorded</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {feedbackStats.recentFeedbacks.map((fb, idx) => (
              <div key={fb.id || idx} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map(st => (
                        <Star
                          key={st}
                          className={`h-3.5 w-3.5 ${
                            fb.rating >= st ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/30">
                      {fb.requestId}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{fb.comment || 'Smooth resolution and fast response.'}"
                  </p>
                </div>
                <div className="border-t border-slate-800/80 pt-2 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-300 truncate max-w-[140px]">{fb.userName}</span>
                  <span>{fb.createdAt ? new Date(fb.createdAt).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

      </div>

    </div>
  );
}
