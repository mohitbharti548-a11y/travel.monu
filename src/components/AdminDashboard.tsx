import React, { useState } from 'react';
import { TourPackage, Stay, ReelPost, BookingItem } from '../types';
import { 
  X, 
  Settings, 
  DollarSign, 
  Users, 
  Film, 
  MapPin, 
  Check, 
  Trash2, 
  Plus, 
  Radio, 
  TrendingUp, 
  Sparkles,
  ShieldAlert,
  Edit2
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  packages: TourPackage[];
  onUpdatePackagePrice: (pkgId: string, newPrice: number) => void;
  stays: Stay[];
  onToggleStay: (stayId: string) => void;
  reels: ReelPost[];
  onDeleteReel: (reelId: string) => void;
  bookings: BookingItem[];
  roadAlert: string;
  onUpdateRoadAlert: (alert: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  packages,
  onUpdatePackagePrice,
  stays,
  onToggleStay,
  reels,
  onDeleteReel,
  bookings,
  roadAlert,
  onUpdateRoadAlert
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'packages' | 'stays' | 'reels' | 'broadcast'>('analytics');
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);
  const [newRoadAlertText, setNewRoadAlertText] = useState(roadAlert);

  if (!isOpen) return null;

  const totalRevenue = bookings.reduce((acc, b) => b.status === 'Confirmed' ? acc + b.paidAmount : acc, 0);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-slatehimachal-950 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Admin Header */}
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-goldenhour-500 text-slate-950">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold flex items-center gap-2">
                <span>Creator Admin Dashboard</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-goldenhour-950 text-goldenhour-400 font-extrabold uppercase tracking-wider">
                  Operations
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Monu's Mountain Operations Hub • Live pricing, stays, feed moderation & alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slatehimachal-900 px-6 gap-2 overflow-x-auto text-xs font-bold">
          {[
            { id: 'analytics', label: 'Overview & Revenue', icon: TrendingUp },
            { id: 'packages', label: 'Package Pricing', icon: DollarSign },
            { id: 'stays', label: 'Handpicked Stays', icon: MapPin },
            { id: 'reels', label: 'Moderate Reels', icon: Film },
            { id: 'broadcast', label: 'Broadcast Advisory', icon: Radio }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-3 border-b-2 flex items-center gap-2 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'border-pine-700 dark:border-goldenhour-500 text-pine-800 dark:text-goldenhour-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-bold uppercase">Total Revenue</span>
                  <h4 className="text-2xl font-extrabold text-pine-800 dark:text-goldenhour-400 mt-1">
                    ₹{totalRevenue.toLocaleString('en-IN')}
                  </h4>
                  <span className="text-[10px] text-emerald-600 font-semibold">100% Direct Gateway</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-bold uppercase">Active Bookings</span>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {bookings.length}
                  </h4>
                  <span className="text-[10px] text-slate-400">All passes issued</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-bold uppercase">Community Reels</span>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {reels.length}
                  </h4>
                  <span className="text-[10px] text-emerald-600">Active on Peak Feed</span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800">
                  <span className="text-xs text-slate-400 font-bold uppercase">Partner Stays</span>
                  <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
                    {stays.length}
                  </h4>
                  <span className="text-[10px] text-slate-400">Zero commission model</span>
                </div>
              </div>

              {/* Recent Bookings Feed */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Recent Traveler Reservations</h4>
                <div className="space-y-2">
                  {bookings.map(b => (
                    <div key={b.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-slate-900 dark:text-white">{b.primaryTraveler}</strong>
                        <span className="text-slate-500 block">{b.title} • {b.travelDate} ({b.passengers} people)</span>
                      </div>
                      <div className="text-right">
                        <strong className="text-pine-700 dark:text-goldenhour-400 block">₹{b.paidAmount.toLocaleString('en-IN')}</strong>
                        <span className="text-[10px] text-emerald-600 font-bold">{b.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Modify Package Pricing */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">Modify base package prices on the fly for seasonal discounts or demand.</p>
              </div>

              <div className="space-y-3">
                {packages.map(pkg => (
                  <div key={pkg.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                    <div>
                      <h5 className="font-bold text-sm text-slate-900 dark:text-white">{pkg.title}</h5>
                      <span className="text-xs text-slate-500">{pkg.destination} • {pkg.duration}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {editingPriceId === pkg.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={tempPrice}
                            onChange={(e) => setTempPrice(Number(e.target.value))}
                            className="w-24 p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                          />
                          <button
                            onClick={() => {
                              onUpdatePackagePrice(pkg.id, tempPrice);
                              setEditingPriceId(null);
                            }}
                            className="p-1.5 rounded-lg bg-emerald-600 text-white"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="text-base font-extrabold text-pine-800 dark:text-goldenhour-400">
                            ₹{pkg.basePrice.toLocaleString('en-IN')}
                          </span>
                          <button
                            onClick={() => {
                              setEditingPriceId(pkg.id);
                              setTempPrice(pkg.basePrice);
                            }}
                            className="p-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300"
                            title="Edit Price"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Handpicked Stays */}
          {activeTab === 'stays' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Toggle curated stays visible to travelers booking via Himachal Nomad.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {stays.map(stay => (
                  <div key={stay.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={stay.image} alt={stay.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h5 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{stay.name}</h5>
                        <span className="text-[10px] text-slate-500">{stay.location} • ₹{stay.pricePerNight}/night</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleStay(stay.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                        stay.isHandpicked
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {stay.isHandpicked ? 'Active' : 'Paused'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Moderate Reels */}
          {activeTab === 'reels' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Review community uploads and remove inappropriate content from The Peak Feed.</p>
              <div className="space-y-2">
                {reels.map(reel => (
                  <div key={reel.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slatehimachal-900 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img src={reel.posterImage} alt={reel.authorName} className="w-12 h-14 rounded-xl object-cover" />
                      <div>
                        <strong className="text-xs text-slate-900 dark:text-white">{reel.authorName} ({reel.authorHandle})</strong>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{reel.caption}</p>
                        <span className="text-[10px] text-slate-400">{reel.location} • {reel.likes} Likes</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onDeleteReel(reel.id)}
                      className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Delete Reel"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Broadcast Live Advisory */}
          {activeTab === 'broadcast' && (
            <div className="space-y-4 max-w-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-600 dark:text-goldenhour-400">
                <ShieldAlert className="w-4 h-4" />
                <span>Live Road & Weather Broadcast Ticker</span>
              </div>
              <p className="text-xs text-slate-500">
                This message appears at the very top of every traveler's screen in real time.
              </p>

              <textarea
                rows={3}
                value={newRoadAlertText}
                onChange={(e) => setNewRoadAlertText(e.target.value)}
                className="w-full p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slatehimachal-900 text-xs font-bold focus:outline-none"
              />

              <button
                onClick={() => {
                  onUpdateRoadAlert(newRoadAlertText);
                  alert("Live road status updated for all users!");
                }}
                className="px-6 py-2.5 rounded-xl font-extrabold text-xs bg-pine-700 hover:bg-pine-800 dark:bg-goldenhour-500 dark:hover:bg-goldenhour-600 text-white dark:text-slate-950 transition-all"
              >
                Broadcast Update Now
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-100 dark:bg-slatehimachal-900 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-800 text-white hover:bg-slate-700"
          >
            Close Dashboard
          </button>
        </div>

      </div>
    </div>
  );
};
