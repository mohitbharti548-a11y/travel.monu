import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info
} from 'lucide-react';

interface PreBookingAdvisoryProps {
  compact?: boolean;
  defaultLang?: 'en' | 'hi' | 'both';
  className?: string;
}

export const PreBookingAdvisory: React.FC<PreBookingAdvisoryProps> = ({
  compact = false,
  defaultLang = 'both',
  className = ''
}) => {
  const [lang, setLang] = useState<'both' | 'en' | 'hi'>(defaultLang);

  const inclusions = [
    {
      en: 'Delhi–Delhi transportation',
      hi: 'दिल्ली से दिल्ली पूरा ट्रांसपोर्ट (Delhi–Delhi Transportation)'
    },
    {
      en: 'Tempo Traveller',
      hi: 'आरामदायक टेम्पो ट्रैवलर (Tempo Traveller)'
    },
    {
      en: 'Driver charges, fuel & toll',
      hi: 'ड्राइवर चार्ज, फ्यूल (ईंधन) एवं सभी टोल टैक्स'
    },
    {
      en: 'Accommodation in hotels/camps',
      hi: 'होटल्स / होमस्टे / कैंप्स में रुकने की पूरी व्यवस्था'
    },
    {
      en: 'Breakfast & dinner',
      hi: 'रोजाना का नाश्ता और रात का स्वादिष्ट खाना (Breakfast & Dinner)'
    },
    {
      en: 'Chandratal camping',
      hi: 'चंद्रताल लेक में विशेष कैंपिंग अनुभव'
    },
    {
      en: 'Kinnaur–Spiti sightseeing as per itinerary',
      hi: 'किन्नौर–स्पीति के सभी प्रमुख दर्शनीय स्थल (शेड्यूल अनुसार)'
    },
    {
      en: 'Atal Tunnel, Koksar, Sissu route',
      hi: 'अटल टनल, कोकसर और सिस्सू का दर्शनीय मार्ग'
    },
    {
      en: 'Driver allowance & parking',
      hi: 'ड्राइवर का दैनिक भत्ता और पार्किंग शुल्क'
    }
  ];

  const exclusions = [
    {
      en: 'Lunch',
      hi: 'दोपहर का भोजन (Lunch)'
    },
    {
      en: 'Personal expenses',
      hi: 'व्यक्तिगत खर्चे (Personal Expenses - शॉपिंग, स्नैक्स आदि)'
    },
    {
      en: 'Adventure activities',
      hi: 'एडवेंचर गतिविधियां (Adventure Activities - राफ्टिंग, पैराग्लाइडिंग आदि)'
    },
    {
      en: 'Entry tickets, if applicable',
      hi: 'किसी भी स्थान का प्रवेश शुल्क या टिकट (Entry Tickets, if applicable)'
    },
    {
      en: 'Anything not specifically mentioned in inclusions',
      hi: 'कोई भी ऐसी सेवा जिसका उल्लेख समावेशन (Inclusions) में नहीं है'
    },
    {
      en: 'Weather/road closure ke कारण extra stay ya transportation',
      hi: 'मौसम या सड़क बंद (Weather/road closure) के कारण होने वाला अतिरिक्त स्टे या ट्रांसपोर्टेशन खर्च'
    }
  ];

  return (
    <div className={`rounded-3xl bg-slate-900 dark:bg-slatehimachal-900 border border-slate-700/80 text-white overflow-hidden shadow-xl ${className}`}>
      
      {/* Header with Bilingual Language Toggle */}
      <div className="p-4 sm:p-5 bg-gradient-to-r from-pine-950 via-slate-900 to-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <Info className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>Before Booking Advisory</span>
              <span className="text-xs text-amber-300 font-serif font-normal">(बुकिंग से पहले महत्वपूर्ण सलाह)</span>
            </h3>
            <p className="text-[11px] text-slate-300">
              Clear Inclusions, Exclusions & High-Altitude Route Guidelines
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center p-1 bg-slate-950/80 rounded-xl border border-slate-800 text-xs font-bold gap-1">
          <button
            type="button"
            onClick={() => setLang('both')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              lang === 'both' ? 'bg-pine-700 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All (English + हिन्दी)
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              lang === 'en' ? 'bg-pine-700 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang('hi')}
            className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer ${
              lang === 'hi' ? 'bg-pine-700 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            हिन्दी
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 space-y-5">
        
        {/* Inclusions & Exclusions 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* 1. PACKAGE INCLUDES */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider pb-2 border-b border-emerald-800/50">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {lang === 'en' && 'Package Includes'}
                {lang === 'hi' && 'पैकेज में शामिल है (Inclusions)'}
                {lang === 'both' && 'Package Includes • पैकेज में शामिल है'}
              </span>
            </div>

            <ul className="space-y-2 text-xs">
              {inclusions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-200">
                  <span className="text-emerald-400 font-bold mt-0.5 shrink-0">✓</span>
                  <div>
                    {(lang === 'en' || lang === 'both') && (
                      <p className="font-semibold text-white">{item.en}</p>
                    )}
                    {(lang === 'hi' || lang === 'both') && (
                      <p className={`text-[11px] text-emerald-200/90 font-serif ${lang === 'both' ? 'mt-0.5' : 'font-semibold text-white'}`}>
                        {item.hi}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* 2. PACKAGE DOES NOT INCLUDE */}
          <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-800/50 space-y-3">
            <div className="flex items-center gap-2 text-rose-400 font-extrabold text-xs uppercase tracking-wider pb-2 border-b border-rose-800/50">
              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                {lang === 'en' && 'Package Does Not Include'}
                {lang === 'hi' && 'पैकेज में शामिल नहीं है (Exclusions)'}
                {lang === 'both' && 'Package Does Not Include • शामिल नहीं है'}
              </span>
            </div>

            <ul className="space-y-2 text-xs">
              {exclusions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-slate-200">
                  <span className="text-rose-400 font-bold mt-0.5 shrink-0">✕</span>
                  <div>
                    {(lang === 'en' || lang === 'both') && (
                      <p className="font-semibold text-white">{item.en}</p>
                    )}
                    {(lang === 'hi' || lang === 'both') && (
                      <p className={`text-[11px] text-rose-200/90 font-serif ${lang === 'both' ? 'mt-0.5' : 'font-semibold text-white'}`}>
                        {item.hi}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* 3. CRITICAL ROUTE & WEATHER ADVISORY */}
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-600/60 space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-extrabold text-xs uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {lang === 'en' && 'Important Route & Weather Advisory'}
              {lang === 'hi' && 'महत्वपूर्ण सूचना: चंद्रताल व कुंजुम मार्ग'}
              {lang === 'both' && 'Important Route & Weather Advisory • महत्वपूर्ण सूचना'}
            </span>
          </div>

          <div className="space-y-2 text-xs text-slate-200 leading-relaxed">
            {(lang === 'en' || lang === 'both') && (
              <div className="p-3 rounded-xl bg-black/40 border border-amber-800/40 space-y-1">
                <span className="font-bold text-amber-300 block">English Notice:</span>
                <p className="text-slate-200">
                  <strong>Important:</strong> Chandratal/Kunzum section season aur road conditions par depend karta hai. Spiti ke Manali-side route ke liye suitable/off-road vehicle recommended hai, aur official tourism information bhi route accessibility ko season-dependent batati hai.
                </p>
              </div>
            )}

            {(lang === 'hi' || lang === 'both') && (
              <div className="p-3 rounded-xl bg-black/40 border border-amber-800/40 space-y-1">
                <span className="font-bold text-amber-300 block font-serif">हिन्दी / Hinglish सूचना:</span>
                <p className="text-slate-200 font-serif leading-relaxed">
                  <strong>महत्वपूर्ण सूचना:</strong> चंद्रताल और कुंजुम पास (Chandratal/Kunzum section) पूरी तरह से मौसम (season) और सड़क की स्थिति (road conditions) पर निर्भर करता है। स्पीति के मनाली वाले रास्ते के लिए उपयुक्त / ऑफ-रोड वाहन (suitable/off-road vehicle) जरूरी व अनुशंसित है, और आधिकारिक पर्यटन सूचना (Official Tourism Information) भी मार्ग की सुलभता को मौसमी परिस्थितियों पर निर्भर बताती है। खराब मौसम या लैंडस्लाइड के कारण होने वाले अतिरिक्त स्टे या वाहन खर्च पैकेज में शामिल नहीं होते हैं।
                </p>
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
