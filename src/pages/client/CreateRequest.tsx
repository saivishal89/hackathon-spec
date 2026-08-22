import React, { useState } from 'react';
import { ArrowLeft, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useRequests } from '../../hooks/useRequests';
import { RequestForm } from '../../components/requests/RequestForm';
import { ServiceRequest } from '../../types/request';
import { Button } from '../../components/ui/Button';

export interface CreateRequestProps {
  onNavigate: (path: string) => void;
  onSelectRequest: (req: ServiceRequest) => void;
}

export function CreateRequest({ onNavigate, onSelectRequest }: CreateRequestProps) {
  const { createRequest } = useRequests();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: Partial<ServiceRequest>) => {
    setIsSubmitting(true);
    try {
      const created = await createRequest(formData);
      setIsSubmitting(false);
      onSelectRequest(created);
    } catch (e) {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      
      {/* Top Navigation & Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigate('/client')}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Create Service Request</h2>
            <p className="text-xs text-slate-400">
              Submit incident or change request with AI-calculated SLA resolution targets.
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/30">
          <Sparkles className="h-3.5 w-3.5" />
          <span>AI Pre-Triage Active</span>
        </div>
      </div>

      {/* Main Request Form */}
      <RequestForm onSubmit={handleSubmit} isLoading={isSubmitting} />

    </div>
  );
}
