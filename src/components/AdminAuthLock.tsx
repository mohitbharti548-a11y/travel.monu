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

interface AdminAuthLockProps {
  onAuthenticated: (session: AdminSession) => void;
  onExit: () => void;
}

const AUTH_STORAGE_KEY = 'hn_admin_session_v4';
const LOCKOUT_STORAGE_KEY = 'hn_admin_lockout_v4';
const FAILED_ATTEMPTS_KEY = 'hn_admin_failed_attempts_v4';

// Hardened Master Passkey
const MASTER_PASSKEY = '963210';

export const AdminAuthLock: React.FC<AdminAuthLockProps> = ({ onAuthenticated, onExit }) => {
  const [passkey, setPasskey] = useState('');
  const [showPasskey, setShowPasskey] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(() => {
    try {
      return Number(localStorage.getItem(FAILED_ATTEMPTS_KEY)) || 0;
    } catch {
      return 0;
    }
  });
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Check existing session or active lockout on mount
  useEffect(() => {
    try {
      const savedSession = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (savedSession) {
        const parsed: AdminSession = JSON.parse(savedSession);
        const loginTime = new Date(parsed.loginTime).getTime();
        const now = Date.now();
        // Verify session not older than 8 hours
        if (now - loginTime < 8 * 60 * 60 * 1000 && parsed.token?.startsWith('HN-MASTER-')) {
          onAuthenticated(parsed);
          return;
        } else {
          sessionStorage.removeItem(AUTH_STORAGE_KEY);
        }
      }

      const lockoutExpiry = localStorage.getItem(LOCKOUT_STORAGE_KEY);
      if (lockoutExpiry) {
        const remaining = Math.ceil((Number(lockoutExpiry) - Date.now()) / 1000);
        if (remaining > 0) {
          setLockoutRemaining(remaining);
        } else {
          localStorage.removeItem(LOCKOUT_STORAGE_KEY);
          localStorage.removeItem(FAILED_ATTEMPTS_KEY);
          setFailedAttempts(0);
        }
      }
    } catch {
      // Ignored
    }
  }, [onAuthenticated]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          localStorage.removeItem(LOCKOUT_STORAGE_KEY);
          localStorage.removeItem(FAILED_ATTEMPTS_KEY);
          setFailedAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) {
      setErrorMsg(`Security lockout active. Try again in ${lockoutRemaining}s.`);
      return;
    }

    const cleanPasskey = passkey.trim();

    if (cleanPasskey === MASTER_PASSKEY) {
      // Reset lockout counter on success
      localStorage.removeItem(LOCKOUT_STORAGE_KEY);
      localStorage.removeItem(FAILED_ATTEMPTS_KEY);
      setFailedAttempts(0);

      const session: AdminSession = {
        role: 'super_admin',
        adminName: 'Monu (Master Creator)',
        loginTime: new Date().toISOString(),
        token: `HN-MASTER-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      onAuthenticated(session);
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      try {
        localStorage.setItem(FAILED_ATTEMPTS_KEY, newAttempts.toString());
      } catch {
        // Ignored
      }
      setPasskey('');

      if (newAttempts >= 5) {
        const lockoutUntil = Date.now() + 60 * 1000; // 60s lockout
        localStorage.setItem(LOCKOUT_STORAGE_KEY, lockoutUntil.toString());
        setLockoutRemaining(60);
        setErrorMsg('Security lockout triggered due to 5 failed attempts! Please wait 60 seconds.');
      } else {
        setErrorMsg(`Incorrect security passkey! ${5 - newAttempts} attempt(s) remaining.`);
      }
    }
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
              Enter Operations Passkey
            </label>
            <div className="relative">
              <input
                type={showPasskey ? 'text' : 'password'}
                value={passkey}
                onChange={(e) => {
                  setPasskey(e.target.value);
                  setErrorMsg('');
                }}
                disabled={lockoutRemaining > 0}
                placeholder="••••••"
                maxLength={12}
                autoFocus
                autoComplete="off"
                spellCheck={false}
                className="w-full px-4 py-3.5 bg-slate-950 border border-slate-700 rounded-2xl text-white text-center font-mono text-xl tracking-[0.3em] focus:outline-none focus:border-amber-400 disabled:opacity-50 transition-colors shadow-inner"
              />
              <button
                type="button"
                onClick={() => setShowPasskey(!showPasskey)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors p-1"
                title={showPasskey ? "Hide passkey" : "Show passkey"}
              >
                {showPasskey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {lockoutRemaining > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Security lockout active</span>
              </span>
              <span className="font-mono font-bold text-amber-400">{lockoutRemaining}s</span>
            </div>
          )}

          <button
            type="submit"
            disabled={lockoutRemaining > 0 || !passkey}
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
