import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Paperclip, 
  Clock, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Zap,
  Info
} from 'lucide-react';
import { Department, Priority, ServiceRequest } from '../../types/request';
import { SLATier } from '../../types/sla';
import { analyzeRequestText, PreTriageEstimate } from '../../utils/riskCalculator';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { RiskBadge } from './RiskBadge';

export interface RequestFormProps {
  onSubmit: (formData: Partial<ServiceRequest>) => void;
  isLoading?: boolean;
}

export function RequestForm({ onSubmit, isLoading = false }: RequestFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState<Department>('IT Infrastructure');
  const [priority, setPriority] = useState<Priority>('P3_MEDIUM');
  const [slaTier, setSlaTier] = useState<SLATier>('PLATINUM');
  const [category, setCategory] = useState('Database & Storage');
  const [files, setFiles] = useState<Array<{ name: string; size: string }>>([]);

  // AI Live Pre-Triage State
  const [aiEstimate, setAiEstimate] = useState<PreTriageEstimate>({
    suggestedPriority: 'P3_MEDIUM',
    estimatedResolutionHours: 24,
    complexityScore: 4,
    sentimentUrgency: 'moderate',
    predictedBreachRisk: 20,
    detectedKeywords: [],
    suggestedDepartment: 'IT Infrastructure',
  });

  // Debounced AI calculation as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      if (title.trim() || description.trim()) {
        const estimate = analyzeRequestText(title, description, category);
        setAiEstimate(estimate);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [title, description, category]);

  const handleApplyAiSuggestion = () => {
    setPriority(aiEstimate.suggestedPriority);
    setDepartment(aiEstimate.suggestedDepartment);
  };

  const handleAddSampleFile = () => {
    setFiles(prev => [
      ...prev,
      { name: `diagnostic_logs_${Date.now().toString().slice(-4)}.json`, size: '2.4 MB' }
    ]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSubmit({
      title,
      description,
      department,
      priority,
      slaTier,
      category,
      complexityScore: aiEstimate.complexityScore,
      sentimentUrgency: aiEstimate.sentimentUrgency,
      riskScore: aiEstimate.predictedBreachRisk,
      attachments: files,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left 2 Columns: Main Input Fields */}
      <div className="lg:col-span-2 space-y-5">
        <Card className="p-6 bg-slate-900/90 border-slate-800 space-y-5">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-base font-bold text-white tracking-tight">Request Details</h3>
            <p className="text-xs text-slate-400 mt-1">
              Provide comprehensive details so the SLA AI Engine can accurately calculate target resolution timings.
            </p>
          </div>

          {/* Title */}
          <Input
            label="Request Title / Summary *"
            placeholder="e.g. Production PostgreSQL DB connection pool exhausted in US-East"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />

          {/* Department & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Target Department"
              value={department}
              onChange={e => setDepartment(e.target.value as Department)}
            >
              <option value="IT Infrastructure">IT Infrastructure</option>
              <option value="DevOps & Cloud">DevOps & Cloud</option>
              <option value="Core Engineering">Core Engineering</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Billing & Finance">Billing & Finance</option>
              <option value="Customer Operations">Customer Operations</option>
            </Select>

            <Select
              label="Service Category"
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option value="Database & Storage">Database & Storage</option>
              <option value="Cloud Deployment">Cloud Deployment</option>
              <option value="API & Backend">API & Backend</option>
              <option value="Security & Access">Security & Access</option>
              <option value="Billing & Invoicing">Billing & Invoicing</option>
              <option value="Data Migration">Data Migration</option>
              <option value="General Support">General Support</option>
            </Select>
          </div>

          {/* Priority & SLA Tier */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Requested Priority"
              value={priority}
              onChange={e => setPriority(e.target.value as Priority)}
            >
              <option value="P1_CRITICAL">P1 Critical (2h Resolution SLA)</option>
              <option value="P2_HIGH">P2 High (6h Resolution SLA)</option>
              <option value="P3_MEDIUM">P3 Medium (24h Resolution SLA)</option>
              <option value="P4_LOW">P4 Low (72h Resolution SLA)</option>
            </Select>

            <Select
              label="Contract SLA Tier"
              value={slaTier}
              onChange={e => setSlaTier(e.target.value as SLATier)}
            >
              <option value="PLATINUM">Enterprise Platinum (24x7 / Dedicated SRE)</option>
              <option value="GOLD">Gold Tier (24x7 Standard)</option>
              <option value="SILVER">Silver Tier (9-to-5 Standard)</option>
              <option value="STANDARD">Standard Tier</option>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300">
              Detailed Description & Steps to Reproduce *
            </label>
            <textarea
              rows={5}
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe the symptoms, impacted users, relevant error logs, and any initial troubleshooting steps undertaken..."
              className="block w-full rounded-xl border border-slate-700/80 bg-slate-900/80 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            />
          </div>

          {/* Attachments Section */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Attachments & Diagnostic Logs
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                leftIcon={<Paperclip className="h-3.5 w-3.5" />}
                onClick={handleAddSampleFile}
              >
                Attach File
              </Button>
            </div>

            {files.length > 0 ? (
              <div className="space-y-2">
                {files.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700 text-xs">
                    <span className="font-mono text-slate-200">{file.name}</span>
                    <span className="text-slate-400">{file.size}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No attachments added yet.</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button
              type="submit"
              variant="ai-glow"
              size="lg"
              isLoading={isLoading}
              rightIcon={<Send className="h-4 w-4" />}
            >
              Submit Request to SLA Engine
            </Button>
          </div>
        </Card>
      </div>

      {/* Right Column: Real-time AI Pre-Assessment Engine */}
      <div className="space-y-5">
        <Card className="p-5 bg-gradient-to-b from-[#131B2E] to-slate-900 border-indigo-500/30 space-y-4 sticky top-24">
          
          <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Live AI Triage Copilot
              </h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Active
            </span>
          </div>

          {/* Predicted SLA Targets */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Predicted SLA Resolution Target
            </span>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-400" />
                <span className="text-lg font-bold text-white font-mono">
                  ~{aiEstimate.estimatedResolutionHours} Hours
                </span>
              </div>
              <Badge variant={aiEstimate.sentimentUrgency === 'critical' ? 'danger' : 'primary'}>
                {aiEstimate.sentimentUrgency.toUpperCase()} URGENCY
              </Badge>
            </div>
          </div>

          {/* Suggested Priority Card */}
          <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">AI Suggested Priority:</span>
              <span className="font-bold text-indigo-300">{aiEstimate.suggestedPriority.replace('_', ' ')}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-medium">Suggested Dept:</span>
              <span className="font-bold text-indigo-300">{aiEstimate.suggestedDepartment}</span>
            </div>

            {(priority !== aiEstimate.suggestedPriority || department !== aiEstimate.suggestedDepartment) && (
              <button
                type="button"
                onClick={handleApplyAiSuggestion}
                className="w-full mt-2 py-1.5 px-3 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/40 text-xs font-semibold transition"
              >
                Apply AI Suggestions
              </button>
            )}
          </div>

          {/* Detected Severity Keywords */}
          {aiEstimate.detectedKeywords.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Detected Urgency Signals
              </span>
              <div className="flex flex-wrap gap-1.5">
                {aiEstimate.detectedKeywords.map((kw, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-300 border border-indigo-500/30"
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Initial Risk Projection */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">Initial Breach Risk:</span>
            <span className="font-mono font-bold text-slate-200">
              {aiEstimate.predictedBreachRisk}%
            </span>
          </div>

        </Card>
      </div>

    </form>
  );
}
