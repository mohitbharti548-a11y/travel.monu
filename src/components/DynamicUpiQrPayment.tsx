import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { 
  QrCode, Copy, Check, ExternalLink, Smartphone, 
  ShieldCheck, Clock, AlertCircle, ArrowRight, CheckCircle2, 
  UploadCloud, Sparkles, RefreshCw, Lock
} from 'lucide-react';
import { compressImageToWebp } from '../utils/imageCompressor';

interface DynamicUpiQrPaymentProps {
  amount: number;
  bookingRef: string;
  travelerName: string;
  travelerPhone: string;
  destination: string;
  defaultUpiVpa?: string;
  businessName?: string;
  onPaymentVerified: (paymentData: {
    utrNumber: string;
    upiVpa: string;
    screenshotUrl?: string;
    paidAmount: number;
  }) => void;
  onCancel?: () => void;
}

export const DynamicUpiQrPayment: React.FC<DynamicUpiQrPaymentProps> = ({
  amount,
  bookingRef,
  travelerName,
  travelerPhone,
  destination,
  defaultUpiVpa = 'rajeshnov1988@okhdfcbank',
  businessName = 'The Himachal Nomad',
  onPaymentVerified,
  onCancel
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [utrInput, setUtrInput] = useState<string>('');
  const [screenshotUrl, setScreenshotUrl] = useState<string>('');
  const [isProcessingScreenshot, setIsProcessingScreenshot] = useState<boolean>(false);
  const [copiedVpa, setCopiedVpa] = useState<boolean>(false);
  const [copiedAmount, setCopiedAmount] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(600);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const upiUri = 'upi://pay?pa=' + defaultUpiVpa + '&pn=' + encodeURIComponent(businessName) + '&am=' + amount + '&tr=' + bookingRef + '&tn=' + encodeURIComponent('Nomad Pass ' + bookingRef) + '&cu=INR';

  useEffect(() => {
    QRCode.toDataURL(upiUri, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'H'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error rendering dynamic UPI QR:', err));
  }, [upiUri]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins.toString().padStart(2, '0') + ':' + secs.toString().padStart(2, '0');
  };

  const copyToClipboard = (text: string, type: 'vpa' | 'amount') => {
    navigator.clipboard.writeText(text);
    if (type === 'vpa') {
      setCopiedVpa(true);
      setTimeout(() => setCopiedVpa(false), 2000);
    } else {
      setCopiedAmount(true);
      setTimeout(() => setCopiedAmount(false), 2000);
    }
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setIsProcessingScreenshot(true);
    setErrorMsg(null);
    try {
      const res = await compressImageToWebp(file, 1200, 0.85);
      setScreenshotUrl(res.dataUrl);
    } catch (err: any) {
      setErrorMsg('Failed to process screenshot: ' + (err.message || 'unknown error'));
    } finally {
      setIsProcessingScreenshot(false);
    }
  };

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUtr = utrInput.trim().replace(/\s+/g, '');
    if (cleanUtr.length < 8) {
      setErrorMsg('Please enter a valid 12-digit UPI Transaction / UTR reference number from your payment app.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      onPaymentVerified({
        utrNumber: cleanUtr,
        upiVpa: defaultUpiVpa,
        screenshotUrl: screenshotUrl || undefined,
        paidAmount: amount
      });
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="space-y-5 animate-fadeIn">
      {/* Dynamic Amount Banner & Session Timer */}
      <div className="bg-gradient-to-br from-emerald-950/80 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 block tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>0% Fee Direct Smart UPI Pay</span>
          </span>
          <div className="text-2xl sm:text-3xl font-black text-white flex items-baseline gap-1 mt-0.5">
            <span>₹{amount.toLocaleString('en-IN')}</span>
            <span className="text-xs text-stone-400 font-normal">INR (All-Inclusive)</span>
          </div>
        </div>

        <div className="text-right">
          <div className="inline-flex items-center gap-1.5 bg-black/50 px-2.5 py-1 rounded-full border border-emerald-500/30 text-xs font-mono font-bold text-emerald-400">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span>{formatTime(timeLeft)}</span>
          </div>
          <span className="text-[10px] text-stone-400 block mt-1 font-mono">Ref: {bookingRef}</span>
        </div>
      </div>

      {errorMsg && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs rounded-xl animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Dynamic QR Code & Direct Apps Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
        {/* Left: Dynamic QR Container with Central Nomad Emblem */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-xl border border-stone-200 text-center relative group">
          <div className="relative p-2 bg-white rounded-xl">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Dynamic UPI QR Code"
                className="w-48 h-48 sm:w-52 sm:h-52 object-contain mx-auto"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 bg-slate-950 border-2 border-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-[10px] font-black text-amber-300 tracking-tighter">HN</span>
              </div>
            </div>
          </div>

          <div className="mt-2 text-slate-800">
            <p className="text-[11px] font-extrabold flex items-center justify-center gap-1 text-slate-900">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Scan with Any UPI App to Pay ₹{amount.toLocaleString('en-IN')}</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">
              Google Pay • PhonePe • Paytm • CRED • BHIM
            </p>
          </div>
        </div>

        {/* Right: 1-Click Direct UPI App Triggers (Mobile) & VPA Copy */}
        <div className="space-y-3">
          <div className="bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800 space-y-2">
            <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wider">
              On Mobile? Tap to Open Your UPI App
            </span>

            <div className="grid grid-cols-2 gap-2">
              <a
                href={upiUri}
                className="p-2.5 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-emerald-500 rounded-xl flex items-center gap-2 text-xs font-bold text-white transition"
              >
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-black">
                  G
                </div>
                <span>Google Pay</span>
              </a>

              <a
                href={upiUri}
                className="p-2.5 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-emerald-500 rounded-xl flex items-center gap-2 text-xs font-bold text-white transition"
              >
                <div className="w-6 h-6 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center text-[10px] font-black">
                  P
                </div>
                <span>PhonePe</span>
              </a>

              <a
                href={upiUri}
                className="p-2.5 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-emerald-500 rounded-xl flex items-center gap-2 text-xs font-bold text-white transition"
              >
                <div className="w-6 h-6 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center text-[10px] font-black">
                  ₹
                </div>
                <span>Paytm UPI</span>
              </a>

              <a
                href={upiUri}
                className="p-2.5 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-emerald-500 rounded-xl flex items-center gap-2 text-xs font-bold text-white transition"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px] font-black">
                  C
                </div>
                <span>CRED / BHIM</span>
              </a>
            </div>
          </div>

          <div className="bg-stone-900/90 p-3.5 rounded-2xl border border-stone-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-stone-400">Official Nomad UPI VPA</span>
              <button
                type="button"
                onClick={() => copyToClipboard(defaultUpiVpa, 'vpa')}
                className="text-emerald-400 hover:text-emerald-300 font-bold text-[11px] flex items-center gap-1"
              >
                {copiedVpa ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedVpa ? 'Copied!' : 'Copy UPI ID'}</span>
              </button>
            </div>
            <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 font-mono text-stone-200 font-bold select-all flex items-center justify-between">
              <span>{defaultUpiVpa}</span>
              <span className="text-[10px] text-stone-500 font-sans">{businessName}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Step 2: Instant UTR & Reference Confirmation Form */}
      <form onSubmit={handleSubmitVerification} className="bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-800 space-y-3.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Step 2: Enter 12-Digit UTR / Transaction Reference</span>
          </h4>
          <span className="text-[10px] text-stone-400">Found in payment receipt</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <input
              type="text"
              required
              value={utrInput}
              onChange={(e) => setUtrInput(e.target.value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase())}
              placeholder="e.g. 425619284729 or UPI Ref No"
              maxLength={22}
              className="w-full bg-stone-950 border border-stone-700 focus:border-emerald-400 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-white placeholder-stone-600 outline-none"
            />
            <p className="text-[10px] text-stone-400 mt-1">
              Check your GPay / PhonePe / Paytm transaction details for the 12-digit UPI Ref ID.
            </p>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleScreenshotUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2.5 px-3 bg-stone-950 hover:bg-stone-800 border border-stone-700 hover:border-stone-600 rounded-xl text-xs font-bold text-stone-300 flex items-center justify-center gap-1.5 transition h-[42px]"
            >
              {isProcessingScreenshot ? (
                <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
              ) : screenshotUrl ? (
                <div className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3.5 h-3.5" />
                  <span>Receipt Added</span>
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <UploadCloud className="w-3.5 h-3.5 text-stone-400" />
                  <span>Upload Receipt</span>
                </div>
              )}
            </button>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between gap-3 border-t border-stone-800">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2.5 text-xs text-stone-400 hover:text-white bg-stone-800/80 rounded-xl transition"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !utrInput.trim()}
            className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-extrabold text-xs sm:text-sm py-3 px-6 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? (
              <div className="w-5 h-5 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>I Have Paid • Confirm Booking</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};