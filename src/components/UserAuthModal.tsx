import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  RefreshCw,
  Lock,
  Phone,
  ArrowRight
} from 'lucide-react';
import { UserProfile } from '../types';
import { notificationEngine } from '../services/notificationEngine';
import { signInWithGoogle } from '../utils/firebaseAuth';

interface UserAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (profile: UserProfile) => void;
  promptMessage?: string;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  promptMessage
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [phonePromptUser, setPhonePromptUser] = useState<UserProfile | null>(null);
  const [phoneInput, setPhoneInput] = useState('');

  if (!isOpen) return null;

  const handleModalClose = () => {
    setErrorMsg('');
    setIsLoading(false);
    setPhonePromptUser(null);
    setPhoneInput('');
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMsg('');

    try {
      const res = await signInWithGoogle();

      if (res.success && res.user) {
        // If phone is missing, prompt optional phone or finalize directly
        if (!res.user.phone) {
          setPhonePromptUser(res.user);
          setIsLoading(false);
          return;
        }

        finalizeLogin(res.user);
        return;
      }

      setErrorMsg(res.error || 'Google Sign-In was cancelled or failed. Please try again.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Unable to connect to Google Auth. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePhoneAndProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phonePromptUser) return;

    const clean = phoneInput.replace(/\D/g, '');
    const finalProfile: UserProfile = {
      ...phonePromptUser,
      phone: clean ? (clean.startsWith('91') ? clean : `91${clean}`) : '919876543210'
    };

    try {
      localStorage.setItem('hn_user_session_v4', JSON.stringify(finalProfile));
    } catch {}

    finalizeLogin(finalProfile);
  };

  const finalizeLogin = (user: UserProfile) => {
    notificationEngine.addNotification({
      type: 'system_broadcast',
      title: `Welcome, ${user.name}! 🏔️`,
      message: `Signed in with Google (${user.email}). Your custom itineraries, mountain passes, and booking history are now linked.`,
      priority: 'urgent',
      data: { linkAction: 'open_bookings' }
    });

    onLoginSuccess(user);
    handleModalClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col text-slate-900 dark:text-white">
        
        {/* Header with Mountain Styling */}
        <div className="relative p-6 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-topo-pattern opacity-20 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pine-600 flex items-center justify-center text-white shadow">
                <Compass className="w-5 h-5 animate-float" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Nomad Traveler Access
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Lock className="w-3 h-3 text-emerald-400" />
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
                    Google Secure Verification
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={handleModalClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          
          {promptMessage && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
              <span>{promptMessage}</span>
            </div>
          )}

          {!phonePromptUser ? (
            <div className="space-y-4 text-center">
              <div className="space-y-1.5 py-2">
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Sign in to Continue
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto">
                  Access your curated mountain expeditions, custom trip quotes, and instant WhatsApp booking passes.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 dark:text-rose-400 text-xs font-semibold animate-fadeIn text-left">
                  {errorMsg}
                </div>
              )}

              {/* One-Click Google Sign-In Button */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800 dark:text-white font-extrabold text-sm rounded-2xl shadow-md hover:shadow-lg border border-slate-200 dark:border-slate-700 transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin text-pine-600 dark:text-amber-400" />
                    <span>Connecting to Google...</span>
                  </>
                ) : (
                  <>
                    {/* Official Multi-Color Google G Logo */}
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                      />
                    </svg>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
            </div>
          ) : (
            /* Optional Step: Add WhatsApp Mobile Number */
            <form onSubmit={handleSavePhoneAndProceed} className="space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Welcome, {phonePromptUser.name}!
                </h4>
                <p className="text-xs text-slate-500">
                  Enter your mobile number to receive your PDF booking passes and WhatsApp itinerary updates.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  WhatsApp Contact Number
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    maxLength={10}
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="98765 43210"
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-pine-600"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => finalizeLogin(phonePromptUser)}
                  className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Skip for Now
                </button>
                <button
                  type="submit"
                  className="btn-3d flex-1 py-2.5 bg-pine-700 hover:bg-pine-600 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Complete</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Security Guarantee */}
          <div className="pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5 border-t border-slate-100 dark:border-slate-800">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Google OAuth 2.0 • 256-Bit SSL Encrypted Session</span>
          </div>

        </div>

      </div>
    </div>
  );
};
