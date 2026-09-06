import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Key, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  EyeOff, 
  Compass, 
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { AdminRole, AdminSession } from '../types';

interface AdminAuthLockProps {
  onAuthenticated: (session: AdminSession) => void;
  onExit: () => void;
}

const AUTH_STORAGE_KEY = 'hn_admin_session_v4';
const LOCKOUT_STORAGE_KEY = 'hn_admin_lockout_v4';

// Hardened PIN Keys for Local Monu Ops
const CREDENTIALS = {
  SUPER_ADMIN: {
    pin: '7799',
    role: 'super_admin' as AdminRole,
    name: 'Monu (Super Admin)'
  },
  ADMIN: {
    pin: '4054',
    role: 'admin' as AdminRole,
    name: 'Operations Admin'
  }
};

export const AdminAuthLock: React.FC<AdminAuthLockProps> = ({ onAuthenticated, onExit }) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);

  // Check existing session or lockout on mount
  useEffect(() => {
    try {
      const savedSession = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (savedSession) {
        const parsed: AdminSession = JSON.parse(savedSession);
        // Verify session not older than 8 hours
        const loginTime = new Date(parsed.loginTime).getTime();
        const now = Date.now();
        if (now - loginTime < 8 * 60 * 60 * 1000) {
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
      setErrorMsg(`Too many failed attempts. Security lockout active for ${lockoutRemaining}s.`);
      return;
    }

    const cleanPin = pin.trim();

    if (cleanPin === CREDENTIALS.SUPER_ADMIN.pin) {
      const session: AdminSession = {
        role: 'super_admin',
        adminName: CREDENTIALS.SUPER_ADMIN.name,
        loginTime: new Date().toISOString(),
        token: `AUTH-SUPER-${Date.now()}`
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      onAuthenticated(session);
    } else if (cleanPin === CREDENTIALS.ADMIN.pin) {
      const session: AdminSession = {
        role: 'admin',
        adminName: CREDENTIALS.ADMIN.name,
        loginTime: new Date().toISOString(),
        token: `AUTH-OPS-${Date.now()}`
      };
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      onAuthenticated(session);
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      setPin('');

      if (newAttempts >= 5) {
        const lockoutUntil = Date.now() + 60 * 1000; // 60s lockout
        localStorage.setItem(LOCKOUT_STORAGE_KEY, lockoutUntil.toString());
        setLockoutRemaining(60);
        setErrorMsg('Security lockout triggered due to 5 failed attempts! Please wait 60 seconds.');
      } else {
        setErrorMsg(`Incorrect security PIN! ${5 - newAttempts} attempt(s) remaining.`);
      }
    }
  };

  const handleQuickKey = (keyPin: string) => {
    if (lockoutRemaining > 0) return;
    setPin(keyPin);
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans">
      
      {/* Mountain Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-pine-950/40 via-slate-950 to-slate-950 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-pine-500/10 blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10">
        
        {/* Brand Icon */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-pine-600/20 border border-pine-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-inner">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Himachal Nomad Creator Ops</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Protected Admin & Super Admin Gateway
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Enter Operations Passcode / PIN
            </label>
            <div className="relative">
              <input
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  setErrorMsg('');
                }}
                disabled={lockoutRemaining > 0}
                placeholder="Enter 4-digit PIN"
                maxLength={8}
                autoFocus
                className="w-full px-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white text-center font-mono text-lg tracking-widest focus:outline-none focus:border-amber-400 disabled:opacity-50 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {lockoutRemaining > 0 && (
            <div className="p-3 rounded-xl bg-amber-950/80 border border-amber-800 text-amber-300 text-xs flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4" />
                <span>Lockout in effect</span>
              </span>
              <span className="font-mono font-bold">{lockoutRemaining}s</span>
            </div>
          )}

          <button
            type="submit"
            disabled={lockoutRemaining > 0 || !pin}
            className="btn-3d w-full py-3 bg-pine-600 hover:bg-pine-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>Authenticate Secure Session</span>
          </button>
        </form>

        {/* Quick Role Keys (Local Development & Ops Access) */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-2.5">
          <p className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
            Quick Local Role Keys
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickKey(CREDENTIALS.SUPER_ADMIN.pin)}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700/80 transition-all hover:border-amber-400/50 group"
            >
              <div className="text-[11px] font-extrabold text-amber-400 flex items-center justify-between">
                <span>Super Admin</span>
                <Key className="w-3 h-3 text-amber-400 opacity-60 group-hover:opacity-100" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">PIN: 7799 (Master)</p>
            </button>

            <button
              type="button"
              onClick={() => handleQuickKey(CREDENTIALS.ADMIN.pin)}
              className="px-3 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-left border border-slate-700/80 transition-all hover:border-pine-400/50 group"
            >
              <div className="text-[11px] font-extrabold text-emerald-400 flex items-center justify-between">
                <span>Admin</span>
                <Key className="w-3 h-3 text-emerald-400 opacity-60 group-hover:opacity-100" />
              </div>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">PIN: 4054 (Ops)</p>
            </button>
          </div>
        </div>

        {/* Exit link */}
        <div className="mt-5 text-center">
          <button
            onClick={onExit}
            className="text-xs text-slate-400 hover:text-white transition-colors"
          >
            ← Return to Himachal Nomad Traveler Site
          </button>
        </div>

      </div>
    </div>
  );
};
