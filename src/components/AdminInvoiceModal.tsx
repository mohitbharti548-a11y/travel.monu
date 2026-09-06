import React, { useRef } from 'react';
import { BookingItem } from '../types';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Compass, 
  MapPin, 
  Calendar, 
  Users, 
  ShieldCheck, 
  QrCode,
  FileText
} from 'lucide-react';

interface AdminInvoiceModalProps {
  booking: BookingItem | null;
  onClose: () => void;
}

export const AdminInvoiceModal: React.FC<AdminInvoiceModalProps> = ({ booking, onClose }) => {
  const invoiceRef = useRef<HTMLDivElement>(null);

  if (!booking) return null;

  const invoiceNo = `INV-HN-${booking.bookingRef.replace('BK-HN-', '') || Date.now().toString().slice(-6)}`;
  const invoiceDate = booking.paymentDate || new Date().toISOString().split('T')[0];

  // GST Breakdown (5% GST for Tour Operators / Travel packages: 2.5% CGST + 2.5% SGST)
  const totalAmount = booking.totalAmount || 0;
  const baseAmount = Math.round(totalAmount / 1.05);
  const gstTotal = totalAmount - baseAmount;
  const cgst = Math.round(gstTotal / 2);
  const sgst = gstTotal - cgst;
  const paidAmount = booking.paidAmount || totalAmount;
  const balanceDue = Math.max(0, totalAmount - paidAmount);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Action Bar (Hidden on Print) */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-400" />
            <span className="font-extrabold text-sm tracking-tight">Official GST Tax Invoice & Permit Pass</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-800">
              {booking.status}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow transition-all cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div ref={invoiceRef} className="p-6 sm:p-10 overflow-y-auto print:p-0 print:m-0 space-y-6">
          
          {/* Company & Invoice Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b-2 border-slate-900/10 pb-6">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <div className="w-9 h-9 rounded-xl bg-pine-800 text-white flex items-center justify-center shadow">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-none font-heading">
                    The Himachal Nomad
                  </h2>
                  <span className="text-[10px] font-extrabold text-pine-800 uppercase tracking-wider">
                    Spiti • Manali • Kaza
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Monu Mountain Operations & Custom Expeditions<br />
                Model Town, Old Manali, Himachal Pradesh 175131<br />
                GSTIN: <strong>02AAHCH8745Q1Z3</strong> • HP Tourism Reg: <strong>HP-TO-2026-8812</strong><br />
                Phone: +91 96532 40540 • Email: monu@himachalnomad.com
              </p>
            </div>

            <div className="sm:text-right">
              <span className="inline-block px-3 py-1 rounded-lg bg-pine-100 text-pine-900 text-xs font-extrabold uppercase tracking-wider mb-2">
                Tax Invoice
              </span>
              <div className="text-xs space-y-0.5 text-slate-600">
                <p><strong>Invoice No:</strong> {invoiceNo}</p>
                <p><strong>Date of Issue:</strong> {invoiceDate}</p>
                <p><strong>Booking Ref:</strong> {booking.bookingRef}</p>
                <p><strong>Payment Mode:</strong> {booking.paymentMethod || 'Online UPI'}</p>
              </div>
            </div>
          </div>

          {/* Billed To & Trip Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                Billed To (Traveler)
              </p>
              <h4 className="text-sm font-extrabold text-slate-900">
                {booking.primaryTraveler || 'Valued Himachal Nomad'}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Phone: {booking.contactPhone || 'N/A'}<br />
                Email: {booking.contactEmail || 'N/A'}
              </p>
            </div>

            <div>
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 mb-1">
                Expedition & Transit Schedule
              </p>
              <h4 className="text-sm font-extrabold text-slate-900">
                {booking.title}
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Destination: <strong>{booking.destination}</strong><br />
                Departure Date: <strong>{booking.travelDate}</strong> • Party: <strong>{booking.passengers} Nomad(s)</strong>
              </p>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 font-extrabold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-2">#</th>
                  <th className="py-2.5 px-2">Service Description</th>
                  <th className="py-2.5 px-2">SAC Code</th>
                  <th className="py-2.5 px-2 text-center">Party Size</th>
                  <th className="py-2.5 px-2 text-right">Base Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                <tr>
                  <td className="py-3 px-2 font-bold">1</td>
                  <td className="py-3 px-2">
                    <p className="font-bold text-slate-900">{booking.title}</p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Ground coordination, certified high-pass transport, stay permits, and Monu local curation.
                    </p>
                  </td>
                  <td className="py-3 px-2 font-mono text-slate-600">998553</td>
                  <td className="py-3 px-2 text-center font-bold">{booking.passengers}</td>
                  <td className="py-3 px-2 text-right font-bold">₹{baseAmount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Total & Tax Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-4 border-t-2 border-slate-200">
            <div className="max-w-xs text-[11px] text-slate-500 space-y-1">
              <div className="flex items-center gap-1.5 text-pine-800 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Authorized Tourist Transport & Permitted Operator</span>
              </div>
              <p>
                All mountain passes and permits are issued under Himachal Pradesh tourism transport regulations.
              </p>
            </div>

            <div className="w-full sm:w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Base Amount:</span>
                <span className="font-semibold">₹{baseAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (2.5%):</span>
                <span className="font-semibold">₹{cgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (2.5%):</span>
                <span className="font-semibold">₹{sgst.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-300">
                <span>Total Invoice Value:</span>
                <span className="text-pine-800">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                <span>Amount Paid:</span>
                <span>₹{paidAmount.toLocaleString('en-IN')}</span>
              </div>
              {balanceDue > 0 && (
                <div className="flex justify-between text-xs text-amber-800 font-bold bg-amber-50 px-2 py-1 rounded-lg">
                  <span>Balance on Arrival:</span>
                  <span>₹{balanceDue.toLocaleString('en-IN')}</span>
                </div>
              )}
            </div>
          </div>

          {/* Stamp, Signature & Checkpost QR Code */}
          <div className="flex flex-wrap items-end justify-between gap-4 pt-6 border-t border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-xl border border-slate-300 shadow-sm flex items-center justify-center">
                <QrCode className="w-12 h-12 text-slate-800" />
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                <p>HP Police Checkpost Permit</p>
                <p>Hash: {booking.bookingRef}-AUTH-OK</p>
                <p className="text-emerald-700 font-bold font-sans">✓ Verified by Monu Ops</p>
              </div>
            </div>

            <div className="text-right">
              <div className="inline-block border-b border-slate-400 pb-1 mb-1">
                <span className="font-kalam text-lg font-bold text-pine-800 tracking-wide">
                  Monu Thakur
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Authorized Signatory • The Himachal Nomad
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
