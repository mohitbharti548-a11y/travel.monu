import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sun, 
  Moon, 
  MapPin, 
  Sparkles, 
  MessageCircle, 
  Ticket, 
  Menu, 
  X, 
  Film,
  User,
  Phone,
  LogOut,
  Radio
} from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onOpenBookingEngine: () => void;
  onOpenMyBookings: () => void;
  onOpenWeatherSecurity?: () => void;
  onOpenTerms?: () => void;
  onOpenAdmin?: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
  navbarVideoUrl?: string;
  userProfile?: UserProfile | null;
  onOpenAuth?: () => void;
  onLogoutUser?: () => void;
  roadAlert?: string;
}

export const Header: React.FC<HeaderProps> = ({
  darkMode,
  setDarkMode,
  onOpenBookingEngine,
  onOpenMyBookings,
  onOpenWeatherSecurity,
  activeSection,
  setActiveSection,
  navbarVideoUrl = "/videos/navbar-loop.mp4",
  userProfile,
  onOpenAuth,
  onLogoutUser,
  roadAlert
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const lastScrollY = React.useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY.current;

      setScrolled(currentScrollY > 20);

      // Keep visible at top or if mobile menu is expanded
      if (mobileMenuOpen || currentScrollY < 60) {
        setVisible(true);
      } else if (delta > 6) {
        // Scrolling down -> fade & slide up out of view
        setVisible(false);
      } else if (delta < -6) {
        // Scrolling up -> slide down and reappear
        setVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [mobileMenuOpen]);

  const navItems = [
    { id: 'destinations', label: 'Destinations', icon: MapPin },
    { id: 'custom-packages', label: 'Custom Itineraries', icon: Sparkles },
    { id: 'transit', label: 'Volvo & Flights', icon: Compass },
    { id: 'peak-feed', label: 'The Peak Feed', icon: Film },
    { id: 'guides', label: 'Local Guides', icon: Compass }
  ];

  return (
    <>
      {/* Main Glassmorphic Sticky Header with Video Background & Smart Hide/Reveal */}
      <header 
        className={`sticky top-0 z-40 w-full transition-all duration-300 ease-in-out relative overflow-hidden ${
          visible 
            ? 'translate-y-0 opacity-100' 
            : '-translate-y-full opacity-0 pointer-events-none'
        } ${
          scrolled 
            ? 'shadow-xl py-2.5 border-b border-slate-200/80 dark:border-slate-800' 
            : 'py-3.5 border-b border-slate-200/70 dark:border-slate-800/80'
        }`}
      >
        {/* Ambient Video Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            poster="https://images.unsplash.com/photo-1581793745862-99fde7fa73d2?auto=format&fit=crop&w=1600&q=80"
            className="w-full h-full object-cover object-center scale-110 filter brightness-[0.75] dark:brightness-[0.4] transition-opacity duration-700"
          >
            <source 
              src={navbarVideoUrl} 
              type="video/mp4" 
            />
          </video>
          {/* High Contrast Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-white/80 dark:bg-slate-950/82 backdrop-blur-md transition-colors duration-300"></div>
          <div className="absolute inset-0 bg-topo-pattern opacity-25"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Logo with Takri Script */}
          <a 
            href="#hero"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={() => setActiveSection('hero')}
          >
            <div className="w-10 h-10 rounded-xl bg-pine-700 flex items-center justify-center text-white shadow group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6 animate-float" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  The Himachal Nomad
                </span>
              </div>
              <p className="text-[11px] font-bold text-pine-700 dark:text-amber-400 tracking-wide font-kalam">
                By Monu • Manali Creator Experience
              </p>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 bg-slate-100/90 dark:bg-slatehimachal-900/90 p-1 rounded-full border border-slate-200 dark:border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-pine-700 text-white shadow-sm'
                      : 'text-slate-700 dark:text-slate-300 hover:text-pine-800 dark:hover:text-white hover:bg-white dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Profile Pill or Phone Sign In Button */}
            {userProfile && userProfile.isLoggedIn ? (
              <div className="flex items-center gap-1.5 bg-pine-50 dark:bg-pine-950/80 border border-pine-200 dark:border-pine-800 px-2.5 py-1 rounded-xl">
                <button
                  onClick={onOpenMyBookings}
                  className="flex items-center gap-1 text-xs font-extrabold text-pine-900 dark:text-pine-200 hover:text-pine-700"
                  title="My Nomad Passes & Custom Trips"
                >
                  <User className="w-3.5 h-3.5 text-pine-700 dark:text-amber-400" />
                  <span className="max-w-[80px] sm:max-w-[110px] truncate">
                    {userProfile.name.split(' ')[0]}
                  </span>
                </button>
                {onLogoutUser && (
                  <button
                    onClick={onLogoutUser}
                    className="p-1 text-slate-400 hover:text-rose-500 rounded"
                    title="Sign Out"
                  >
                    <LogOut className="w-3 h-3" />
                  </button>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-amber-500/15 text-amber-900 dark:text-amber-300 border border-amber-400/40 hover:bg-amber-500/25 transition-all cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Sign In</span>
              </button>
            )}

            {/* My Passes */}
            <button
              onClick={onOpenMyBookings}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-100 dark:bg-slatehimachal-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 text-pine-700 dark:text-amber-400" />
              <span className="hidden sm:inline">My Passes</span>
            </button>

            {/* Quick Book Direct */}
            <button
              onClick={onOpenBookingEngine}
              className="px-4 py-1.5 rounded-xl text-xs font-extrabold bg-pine-700 hover:bg-pine-800 text-white shadow-md hover:shadow transition-all cursor-pointer"
            >
              Book Direct
            </button>

            {/* Dark/Light Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slatehimachal-800 text-slate-700 dark:text-amber-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
              title="Toggle Theme"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 px-4 pt-3 pb-5 space-y-2 bg-white dark:bg-slatehimachal-950 shadow-xl">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => {
                    setActiveSection(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-bold text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <Icon className="w-4 h-4 text-pine-700 dark:text-amber-400" />
                  {item.label}
                </a>
              );
            })}
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  onOpenBookingEngine();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-pine-700 text-white font-extrabold text-sm text-center"
              >
                Book Volvo Sleeper / Flight
              </button>
              <button
                onClick={() => {
                  onOpenMyBookings();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slatehimachal-800 text-slate-800 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Ticket className="w-4 h-4 text-pine-700 dark:text-amber-400" />
                <span>My Nomad Passes Hub</span>
              </button>
              {onOpenWeatherSecurity && (
                <button
                  onClick={() => {
                    onOpenWeatherSecurity();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Radio className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Live Road Advisories & Security Policy</span>
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
