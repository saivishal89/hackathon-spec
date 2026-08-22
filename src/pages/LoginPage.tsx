import React, { useState } from 'react';
import { Sparkles, Crown, UserCheck, ArrowRight, ShieldCheck, Lock, Mail, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';

export interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('sarah.connor@enterprise.io');
  const [password, setPassword] = useState('password123');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      setIsLoading(false);

      if (result.success && result.user) {
        // Secure redirect based on server-verified DB role
        if (result.user.role === 'ADMIN' || result.user.role === 'AGENT') {
          onNavigate('/admin');
        } else {
          onNavigate('/client');
        }
      } else {
        setErrorMsg(result.error || 'Authentication failed');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'An unexpected error occurred during login');
    }
  };

  const handleSelectPreset = (presetEmail: string) => {
    setEmail(presetEmail);
    setPassword('password123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Ambient Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/20 blur-[130px] pointer-events-none rounded-full" />

      <div className="relative z-10 w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-[0_0_25px_rgba(99,102,241,0.5)] mb-2">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">SLA AI Enterprise Auth</h2>
          <p className="text-xs text-slate-400">Authenticated Identity & RBAC Gateway</p>
        </div>

        {/* Preset Identity Accounts */}
        <Card variant="glass" className="p-6 space-y-5">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300 block mb-2">
              Select Enterprise Identity
            </label>
            <div className="grid grid-cols-2 gap-3">
              
              {/* Admin Persona */}
              <button
                type="button"
                onClick={() => handleSelectPreset('sarah.connor@enterprise.io')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  email === 'sarah.connor@enterprise.io'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <Crown className={`h-4 w-4 ${email === 'sarah.connor@enterprise.io' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono font-bold uppercase bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded">
                    Admin
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Sarah Connor</h4>
                  <p className="text-[11px] text-slate-400 truncate">Lead SLA Ops</p>
                </div>
              </button>

              {/* Client Persona */}
              <button
                type="button"
                onClick={() => handleSelectPreset('alex.morgan@fintechcorp.com')}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between ${
                  email === 'alex.morgan@fintechcorp.com'
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <UserCheck className={`h-4 w-4 ${email === 'alex.morgan@fintechcorp.com' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  <span className="text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded">
                    Client
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">Alex Morgan</h4>
                  <p className="text-[11px] text-slate-400 truncate">FinTech Systems</p>
                </div>
              </button>

            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              label="Corporate Email Address"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              leftIcon={<Mail className="h-4 w-4" />}
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              leftIcon={<Lock className="h-4 w-4" />}
              required
            />

            <Button
              type="submit"
              variant="ai-glow"
              size="lg"
              isLoading={isLoading}
              className="w-full text-xs font-semibold"
              rightIcon={<ArrowRight className="h-4 w-4" />}
            >
              Sign In with Verified Identity
            </Button>
          </form>

          <div className="pt-2 text-center flex items-center justify-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
            <span>Encrypted Session with Server-Side RBAC Enforcement</span>
          </div>

          <div className="text-center pt-1">
            <button
              onClick={() => onNavigate('/')}
              className="text-xs text-slate-400 hover:text-white transition"
            >
              ← Back to Landing Overview
            </button>
          </div>
        </Card>

      </div>
    </div>
  );
}
