import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Maximize2, 
  Minimize2, 
  Moon, 
  Sun, 
  RotateCw, 
  Crown, 
  UserCheck, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Check
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';

export interface LoginPageProps {
  onNavigate: (path: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { login } = useAuth();
  const { showToast } = useToast();

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('sarah.connor@enterprise.io');
  const [password, setPassword] = useState('password123');
  const [fullName, setFullName] = useState('Sarah Connor');
  const [companyName, setCompanyName] = useState('Enterprise Global');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      setIsLoading(false);

      if (result.success && result.user) {
        showToast('Login Successful', `Welcome back, ${result.user.name}!`, 'success');
        if (result.user.role === 'ADMIN' || result.user.role === 'AGENT') {
          onNavigate('/admin');
        } else {
          onNavigate('/client');
        }
      } else {
        setErrorMsg(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'An unexpected error occurred during login');
    }
  };

  const handleSelectPreset = (presetEmail: string, presetName: string, presetCompany: string) => {
    setEmail(presetEmail);
    setPassword('password123');
    setFullName(presetName);
    setCompanyName(presetCompany);
    setErrorMsg('');
    showToast('Identity Selected', `Loaded credentials for ${presetName}`, 'info');
  };

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    setErrorMsg('');
    setTimeout(async () => {
      // Fast demo authentication for Google/GitHub
      const demoEmail = provider === 'google' ? 'sarah.connor@enterprise.io' : 'alex.morgan@fintechcorp.com';
      const result = await login(demoEmail, 'password123');
      setIsLoading(false);
      if (result.success && result.user) {
        showToast('OAuth Verified', `Connected with ${provider === 'google' ? 'Google' : 'GitHub'}`, 'success');
        if (result.user.role === 'ADMIN' || result.user.role === 'AGENT') {
          onNavigate('/admin');
        } else {
          onNavigate('/client');
        }
      }
    }, 600);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkTheme ? 'bg-[#060911] text-slate-100' : 'bg-slate-100 text-slate-800'} flex items-center justify-center p-3 sm:p-6 transition-colors duration-300 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white`}>
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] bg-indigo-600/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Main Split Authentication Card */}
      <div className={`relative z-10 w-full max-w-4xl rounded-3xl ${isDarkTheme ? 'bg-[#0B0F19]/90 border-slate-800 shadow-[0_20px_70px_rgba(0,0,0,0.8)]' : 'bg-white border-slate-200 shadow-2xl'} border overflow-hidden grid grid-cols-1 md:grid-cols-2 backdrop-blur-xl transition-all duration-300`}>
        
        {/* ========================================================= */}
        {/* LEFT COLUMN: Cyberpunk VR Hero Image with Floating Controls */}
        {/* ========================================================= */}
        <div className="relative min-h-[340px] md:min-h-[620px] w-full overflow-hidden flex flex-col justify-between p-5 sm:p-6 bg-slate-950">
          
          {/* Background VR Artwork */}
          <img
            src="/assets/login-hero.jpg"
            alt="SLA AI Cyberpunk VR Hero"
            className="absolute inset-0 h-full w-full object-cover object-center transform scale-105 hover:scale-100 transition-transform duration-1000"
          />

          {/* Vignette & Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/50 pointer-events-none" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10 rounded-3xl pointer-events-none" />

          {/* Top Left: Quick Action Controls Pill */}
          <div className="relative z-20 self-start inline-flex items-center gap-1 p-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15 text-white shadow-lg">
            <button
              type="button"
              onClick={toggleFullscreen}
              title="Toggle Fullscreen"
              className="p-1.5 rounded-full hover:bg-white/20 transition text-slate-200 hover:text-white"
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={() => setIsDarkTheme(prev => !prev)}
              title="Toggle Theme"
              className="p-1.5 rounded-full hover:bg-white/20 transition text-slate-200 hover:text-white"
            >
              {isDarkTheme ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4 text-amber-300" />}
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('');
                setPassword('');
                setErrorMsg('');
                showToast('Reset', 'Form cleared', 'info');
              }}
              title="Reset Form"
              className="p-1.5 rounded-full hover:bg-white/20 transition text-slate-200 hover:text-white"
            >
              <RotateCw className="h-4 w-4" />
            </button>
          </div>

          {/* Bottom Left: Brand Pill & Telemetry Badge */}
          <div className="relative z-20 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/30 backdrop-blur-md border border-indigo-400/40 text-white text-xs font-semibold shadow-lg">
              <Sparkles className="h-3.5 w-3.5 text-indigo-300 animate-pulse" />
              <span>SLA AI Platform • Autonomous Engine</span>
            </div>
            <p className="text-xs text-slate-300/90 drop-shadow-md hidden sm:block">
              Predictive incident triage and breach risk intelligence for enterprise engineering teams.
            </p>
          </div>

        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: Modern Clean Sign In / Sign Up Form */}
        {/* ========================================================= */}
        <div className={`p-6 sm:p-10 flex flex-col justify-between ${isDarkTheme ? 'bg-[#0B0F19]' : 'bg-white'}`}>
          
          <div className="space-y-6">
            
            {/* Header: Title & Mode Toggle */}
            <div className="space-y-1">
              <h2 className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                {isSignUp ? 'Create an Account' : 'Welcome Back'}
              </h2>
              <p className={`text-xs sm:text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-500'}`}>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(prev => !prev);
                    setErrorMsg('');
                  }}
                  className="font-bold text-indigo-500 hover:text-indigo-400 hover:underline transition"
                >
                  {isSignUp ? 'Sign in' : 'Sign up'}
                </button>
              </p>
            </div>

            {/* Quick Demo Persona Chips */}
            <div className={`p-2.5 rounded-2xl ${isDarkTheme ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200'} border space-y-1.5`}>
              <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Quick Demo Personas
                </span>
                <span className="text-[10px] text-indigo-400 font-semibold">1-Click Fill</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPreset('sarah.connor@enterprise.io', 'Sarah Connor', 'Enterprise Global')}
                  className={`px-2.5 py-1.5 rounded-xl text-left transition text-xs font-semibold flex items-center gap-2 border ${
                    email === 'sarah.connor@enterprise.io'
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : isDarkTheme
                      ? 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Crown className="h-3.5 w-3.5 text-purple-400 flex-shrink-0" />
                  <span className="truncate">Admin (Sarah)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPreset('alex.morgan@fintechcorp.com', 'Alex Morgan', 'FinTech Global Systems')}
                  className={`px-2.5 py-1.5 rounded-xl text-left transition text-xs font-semibold flex items-center gap-2 border ${
                    email === 'alex.morgan@fintechcorp.com'
                      ? 'bg-cyan-600/20 border-cyan-500 text-cyan-300'
                      : isDarkTheme
                      ? 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <UserCheck className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                  <span className="truncate">Client (Alex)</span>
                </button>
              </div>
            </div>

            {/* Error Message Banner */}
            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Optional Sign Up Name & Company Fields */}
              {isSignUp && (
                <>
                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold block ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={e => setFullName(e.target.value)}
                      placeholder="e.g. Sarah Connor"
                      required
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDarkTheme
                          ? 'bg-slate-900/90 border-slate-800 text-white placeholder-slate-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-semibold block ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                      Organization / Company
                    </label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={e => setCompanyName(e.target.value)}
                      placeholder="e.g. Enterprise Global Systems"
                      required
                      className={`w-full px-4 py-2.5 rounded-xl text-sm border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        isDarkTheme
                          ? 'bg-slate-900/90 border-slate-800 text-white placeholder-slate-500'
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400'
                      }`}
                    />
                  </div>
                </>
              )}

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold block ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="Email Address"
                  required
                  className={`w-full px-4 py-2.5 rounded-xl text-sm border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    isDarkTheme
                      ? 'bg-slate-900/90 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
                      : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                  }`}
                />
              </div>

              {/* Password with Eye Toggle */}
              <div className="space-y-1.5">
                <label className={`text-xs font-semibold block ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className={`w-full px-4 py-2.5 pr-11 rounded-xl text-sm border transition focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      isDarkTheme
                        ? 'bg-slate-900/90 border-slate-800 text-white placeholder-slate-500 focus:border-indigo-500'
                        : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-200 transition"
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Extra Row: Remember Me & Forgot Password */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0 transition cursor-pointer"
                  />
                  <span className={isDarkTheme ? 'text-slate-300' : 'text-slate-600'}>Remember me</span>
                </label>

                <button
                  type="button"
                  onClick={() => showToast('Password Reset', 'Password reset instructions dispatched to your registered email.', 'info')}
                  className="font-semibold text-indigo-500 hover:text-indigo-400 hover:underline transition"
                >
                  Forgot password?
                </button>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 rounded-xl font-bold text-sm bg-black hover:bg-slate-950 text-white dark:bg-black dark:text-white dark:hover:bg-slate-900 border border-white/20 shadow-xl shadow-black/40 transform active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                )}
              </button>

            </form>

            {/* "or" Divider */}
            <div className="relative flex items-center justify-center pt-1">
              <div className={`w-full border-t ${isDarkTheme ? 'border-slate-800' : 'border-slate-200'}`} />
              <span className={`absolute px-3 text-xs uppercase font-mono ${isDarkTheme ? 'bg-[#0B0F19] text-slate-500' : 'bg-white text-slate-400'}`}>
                or
              </span>
            </div>

            {/* Social Logins Side-by-Side Grid */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              
              {/* Google Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition ${
                  isDarkTheme
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {/* Official Multi-colored Google G Icon */}
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              {/* GitHub Button */}
              <button
                type="button"
                onClick={() => handleSocialLogin('github')}
                className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-semibold transition ${
                  isDarkTheme
                    ? 'bg-slate-900/80 border-slate-800 text-slate-200 hover:bg-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {/* Official GitHub Octocat Icon */}
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
                <span>Continue with GitHub</span>
              </button>

            </div>

          </div>

          {/* Bottom Security / Back Link */}
          <div className="pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="text-slate-400 hover:text-white transition flex items-center gap-1"
            >
              <span>← Back to overview</span>
            </button>
            <div className="flex items-center gap-1 text-[11px] text-slate-500">
              <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
              <span>RBAC Protected</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
