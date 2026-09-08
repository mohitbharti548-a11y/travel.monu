import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  ShieldAlert
} from 'lucide-react';
import { AdminSession } from '../types';
import { signInAdminWithEmail } from '../utils/firebaseAuth';

interface AdminAuthLockProps {
  onAuthenticated: (session: AdminSession) => void;
  onExit: () => void;
}

const AUTH_STORAGE_KEY = 'hn_admin_session_v4';
const LOCKOUT_STORAGE_KEY = 'hn_admin_lockout_v4';
const FAILED_ATTEMPTS_KEY = 'hn_admin_failed_attempts_v4';

export const AdminAuthLock: React.FC<AdminAuthLockProps> = ({ onAuthenticated, onExit }) => {
  const [email, setEmail] = useState(import.meta.env.VITE_ADMIN_EMAIL || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  // Restore only a Firebase-authenticated admin session.
  useEffect(() => {
    try {
      const savedSession = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        if (parsed?.role === 'super_admin' && parsed?.token && parsed?.email) {
          onAuthenticated(parsed);
          return;
        }
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch {
      // Ignored
    }
  }, [onAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const result = await signInAdminWithEmail(email, password);
    if (!result.success || !result.session) {
      setErrorMsg(result.error || 'Admin sign-in failed.');
      return;
    }
    sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(result.session));
    onAuthenticated(result.session as AdminSession);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans select-none">
      
      {/* High-Altitude Ambient Atmosphere */}
      <div className="absolute inset-0 bg-gradient-to-b from-pine-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-pine-500/10 blur-3xl pointer-events-none" />
      <div className="absolute inset-0 bg-topo-pattern opacity-20 pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
        
        {/* Brand Shield Emblem */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-pine-900/50 border border-pine-500/40 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Himachal Nomad Creator Ops
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Restricted Admin & Operations Gateway
          </p>
        </div>

        {/* Secure Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 text-center">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMsg('');
                }}
                placeholder="admin@example.com"
                autoFocus
                autoComplete="username"
                className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-white text-center focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 text-center">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                placeholder="Firebase Auth password"
                autoComplete="current-password"
                className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-white text-center focus:outline-none focus:border-amber-400 transition-colors shadow-inner"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1" title={showPassword ? 'Hide password' : 'Show password'}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={!email || !password}
            className="btn-3d w-full py-3.5 bg-pine-700 hover:bg-pine-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
          >
            <Lock className="w-4 h-4 text-amber-400" />
            <span>Unlock Creator Dashboard</span>
          </button>
        </form>

        {/* Return Link */}
        <div className="mt-6 pt-5 border-t border-slate-800/80 text-center">
          <button
            type="button"
            onClick={onExit}
            className="text-xs text-slate-400 hover:text-amber-400 transition-colors cursor-pointer inline-flex items-center gap-1"
          >
            ← Return to Himachal Nomad Traveler Site
          </button>
        </div>

      </div>
    </div>
  );
};
