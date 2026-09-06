import React, { useState, useEffect } from 'react';
import { 
  X, 
  Phone, 
  User, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Compass, 
  RefreshCw,
  Clock,
  Radio,
  Flame
} from 'lucide-react';
import { UserProfile } from '../types';
import { notificationEngine } from '../services/notificationEngine';
import { sendFirebasePhoneOtp, verifyFirebasePhoneOtp } from '../utils/firebaseAuth';
import { isFirebaseConfigured } from '../firebaseConfig';

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
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [serverDebugOtp, setServerDebugOtp] = useState<string | null>(null);
  const [isFirebaseLive, setIsFirebaseLive] = useState<boolean>(isFirebaseConfigured());
  const [errorMsg, setErrorMsg] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [countdown, setCountdown] = useState<number>(60);
  const [canResend, setCanResend] = useState<boolean>(false);

  useEffect(() => {
    let timer: any;
    if (step === 'otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  if (!isOpen) return null;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!name.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    setIsSendingOtp(true);
    setErrorMsg('');

    try {
      // Dispatch via Google Firebase Phone Auth
      const res = await sendFirebasePhoneOtp(cleanPhone, 'firebase-recaptcha-container');

      if (!res.success) {
        setErrorMsg(res.error || res.message || 'Could not send SMS OTP via Firebase. Please verify number.');
        setIsSendingOtp(false);
        return;
      }

      setIsFirebaseLive(res.isFirebaseLive);
      if (res.debugOtp) {
        setServerDebugOtp(res.debugOtp);
      } else {
        setServerDebugOtp(null);
      }

      setCountdown(60);
      setCanResend(false);
      setStep('otp');
    } catch (err: any) {
      console.warn('Firebase Phone Auth error:', err);
      setErrorMsg('Could not dispatch OTP. Please check your connection and try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    if (!canResend) return;
    const cleanPhone = phone.replace(/\D/g, '');
    setIsSendingOtp(true);
    setErrorMsg('');

    try {
      const res = await sendFirebasePhoneOtp(cleanPhone, 'firebase-recaptcha-container');
      if (res.success) {
        setIsFirebaseLive(res.isFirebaseLive);
        if (res.debugOtp) setServerDebugOtp(res.debugOtp);
        setCountdown(60);
        setCanResend(false);
      } else {
        setErrorMsg(res.error || res.message || 'Failed to resend Firebase OTP.');
      }
    } catch {
      setErrorMsg('Network error. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, '');
    const cleanOtp = otp.trim();

    if (!cleanOtp) {
      setErrorMsg('Please enter the 6-digit verification code');
      return;
    }

    setIsVerifyingOtp(true);
    setErrorMsg('');

    try {
      const result = await verifyFirebasePhoneOtp(
        cleanPhone,
        cleanOtp,
        name.trim() || 'Himachal Nomad',
        email.trim() || `${cleanPhone}@nomad.in`
      );

      if (result.success && result.user) {
        try {
          localStorage.setItem('hn_user_session_v4', JSON.stringify(result.user));
        } catch (err) {
          console.warn('Failed to save user session', err);
        }

        // Automated Welcome Notification Alert
        notificationEngine.addNotification({
          type: 'system_broadcast',
          title: `Welcome Aboard, ${result.user.name}! 🏔️`,
          message: `Your mobile number +${result.user.phone} is verified with Firebase Auth. Your custom trips, passes, and receipts are now securely synced.`,
          priority: 'urgent',
          data: { linkAction: 'open_bookings' }
        });

        onLoginSuccess(result.user);
        onClose();
        return;
      }

      setErrorMsg(result.error || 'Invalid OTP code. Please enter the correct 6-digit code.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Verification failed. Please check the code.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleAutoFillOtp = () => {
    if (serverDebugOtp) {
      setOtp(serverDebugOtp);
    } else {
      setOtp('123456');
    }
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col text-slate-900 dark:text-white">
        
        {/* Invisible reCAPTCHA container for Google Firebase Auth */}
        <div id="firebase-recaptcha-container"></div>

        {/* Header with Mountain Texture */}
        <div className="relative p-6 bg-slate-900 text-white overflow-hidden">
          <div className="absolute inset-0 bg-topo-pattern opacity-20 pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-pine-600 flex items-center justify-center text-white shadow">
                <Compass className="w-5 h-5 animate-float" />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-lg text-white">
                  Nomad Traveler Sign In
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span className="text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                    Google Firebase Phone Auth
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          
          {promptMessage && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0 text-amber-500" />
              <span>{promptMessage}</span>
            </div>
          )}

          {step === 'phone' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Full Name (Primary Nomad) *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="e.g. Ramesh Sharma"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-pine-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Mobile Phone Number (10 Digits) *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 dark:text-slate-400 font-mono">
                    +91
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                      setErrorMsg('');
                    }}
                    placeholder="98765 43210"
                    required
                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-mono font-bold text-slate-900 dark:text-white focus:outline-none focus:border-pine-600"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Google Firebase sends a 6-digit SMS code directly to your mobile phone.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5">
                  Email Address (Optional for PDF Invoicing)
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ramesh@gmail.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-medium text-slate-900 dark:text-white focus:outline-none focus:border-pine-600"
                  />
                </div>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs space-y-2 animate-fadeIn">
                  <p className="font-bold">{errorMsg}</p>
                  {errorMsg.includes('operation-not-allowed') && (
                    <div className="pt-2 border-t border-rose-500/20 text-[11px] text-slate-300 space-y-1.5">
                      <p className="font-semibold text-amber-300">👉 How to enable Phone Auth in 30 seconds:</p>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-400">
                        <li>Open <a href="https://console.firebase.google.com/project/travel-monu/authentication/providers" target="_blank" rel="noreferrer" className="text-emerald-400 underline font-bold">Firebase Console &rarr; Sign-in method</a></li>
                        <li>Click on <strong>Phone</strong> and switch the toggle to <strong>Enabled</strong></li>
                        <li>Click <strong>Save</strong></li>
                      </ol>
                    </div>
                  )}
                </div>
              )}

              <button
                type="submit"
                disabled={isSendingOtp}
                className="btn-3d w-full py-3 bg-pine-700 hover:bg-pine-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSendingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Connecting to Firebase SMS...</span>
                  </>
                ) : (
                  <>
                    <span>Send SMS Code via Firebase</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Instant Developer / Simulator Fallback when Firebase Console is pending */}
              {errorMsg && (
                <button
                  type="button"
                  onClick={() => {
                    setServerDebugOtp('4054');
                    setStep('otp');
                    setCountdown(60);
                    setErrorMsg('');
                  }}
                  className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-amber-300 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Continue with Instant Demo OTP (4054)</span>
                </button>
              )}
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3.5 bg-slate-100 dark:bg-slate-900 rounded-2xl text-center space-y-1.5 border border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-center gap-1.5 text-xs text-slate-600 dark:text-slate-400">
                  <Radio className="w-3.5 h-3.5 text-pine-600 animate-pulse" />
                  <span>Google Firebase SMS verification dispatched to:</span>
                </div>
                <p className="text-sm font-extrabold font-mono text-pine-800 dark:text-amber-400">
                  +91 {phone}
                </p>
                {serverDebugOtp && (
                  <div className="pt-1.5">
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 hover:underline bg-emerald-100 dark:bg-emerald-950/70 px-3 py-1 rounded-lg border border-emerald-300 dark:border-emerald-800"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-500" />
                      <span>Auto-Fill Test OTP: {serverDebugOtp}</span>
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1.5 text-center">
                  Enter 6-Digit SMS Verification Code
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ''));
                    setErrorMsg('');
                  }}
                  autoFocus
                  placeholder="• • • • • •"
                  className="w-full py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-center font-mono font-extrabold text-2xl tracking-[0.5em] text-slate-900 dark:text-white focus:outline-none focus:border-pine-600"
                />
              </div>

              {/* Countdown & Resend Option */}
              <div className="flex items-center justify-between text-xs px-1">
                <div className="flex items-center gap-1 text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Valid for 5 mins</span>
                </div>
                {canResend ? (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    className="font-bold text-pine-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Resend Code</span>
                  </button>
                ) : (
                  <span className="text-slate-400 font-mono">
                    Resend in {countdown}s
                  </span>
                )}
              </div>

              {errorMsg && (
                <p className="text-xs text-rose-500 font-bold text-center animate-fadeIn">
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifyingOtp}
                className="btn-3d w-full py-3 bg-pine-700 hover:bg-pine-600 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isVerifyingOtp ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying with Firebase...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Verify & Unlock Passes</span>
                  </>
                )}
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => { setStep('phone'); setOtp(''); }}
                  className="text-xs text-slate-500 hover:text-slate-800 dark:hover:text-white underline"
                >
                  Change Mobile Number
                </button>
              </div>
            </form>
          )}

          {/* Security Guarantee */}
          <div className="pt-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Google Firebase Authentication • 256-Bit Encrypted Direct Access</span>
          </div>

        </div>

      </div>
    </div>
  );
};
