import React from 'react';
import { Language } from '../utils/translations';
import { Search, Languages } from 'lucide-react';

interface HeaderProps {
  currentTab: 'apply' | 'track' | 'operator' | 'guidelines';
  setCurrentTab: (tab: 'apply' | 'track' | 'operator' | 'guidelines') => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  setCurrentTab,
  lang,
  setLang,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <button
          onClick={() => setCurrentTab('apply')}
          className="text-left flex items-center gap-2.5 text-base sm:text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0 hover:text-amber-600 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-orange-500 text-white flex items-center justify-center font-extrabold text-xs shadow-xs uppercase">
            F-93
          </div>
          <span>PAN Portal · Form 93</span>
        </button>

        {/* Zone 2: 4 clean single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            onClick={() => setCurrentTab('apply')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'apply'
                ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            Form 93 Application
          </button>
          <button
            onClick={() => setCurrentTab('guidelines')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'guidelines'
                ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            Form 93 Guidelines
          </button>
          <button
            onClick={() => setCurrentTab('track')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'track'
                ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            Track Status
          </button>
          <button
            onClick={() => setCurrentTab('operator')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'operator'
                ? 'text-amber-600 font-semibold border-b-2 border-amber-600'
                : 'hover:text-slate-900'
            }`}
          >
            Operator Desk
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Language Toggle */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors whitespace-nowrap"
            title="Toggle Language"
          >
            <Languages className="w-3.5 h-3.5 text-slate-500" />
            <span>{lang === 'en' ? 'हिंदी' : 'English'}</span>
          </button>

          <button
            onClick={() => setCurrentTab('track')}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors whitespace-nowrap shadow-xs"
          >
            <Search className="w-3.5 h-3.5 text-amber-400" />
            <span>Track Status</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden border-t border-slate-100 px-4 py-2 flex items-center justify-around text-xs font-medium text-slate-600 bg-slate-50/80 overflow-x-auto">
        <button
          onClick={() => setCurrentTab('apply')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            currentTab === 'apply' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
          }`}
        >
          Form 93
        </button>
        <button
          onClick={() => setCurrentTab('guidelines')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            currentTab === 'guidelines' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
          }`}
        >
          Guidelines
        </button>
        <button
          onClick={() => setCurrentTab('track')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            currentTab === 'track' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
          }`}
        >
          Track
        </button>
        <button
          onClick={() => setCurrentTab('operator')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${
            currentTab === 'operator' ? 'bg-amber-100 text-amber-900 font-semibold' : ''
          }`}
        >
          Operator
        </button>
      </div>
    </header>
  );
};
