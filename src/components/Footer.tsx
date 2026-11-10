import React from 'react';
import { ShieldCheck, MessageCircle, Phone, MapPin } from 'lucide-react';
import { OperatorSettings } from '../types/pan';
import { Language } from '../utils/translations';

interface FooterProps {
  lang: Language;
  settings: OperatorSettings;
  onNavigate: (tab: 'apply' | 'track' | 'operator' | 'guidelines') => void;
}

export const Footer: React.FC<FooterProps> = ({
  lang,
  settings,
  onNavigate,
}) => {
  return (
    <footer className="no-print bg-white border-t border-slate-200 mt-16 text-xs text-slate-500">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-8 border-b border-slate-100">
          {/* Col 1: Wordmark & Center info */}
          <div className="md:col-span-2 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                F93
              </div>
              <span className="font-bold text-slate-900 text-sm">
                PAN Facilitation Desk · Form 93
              </span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed max-w-md">
              Citizen facilitation portal providing online application submission, document verification, and status tracking for Form 93 PAN applications. Secure encrypted local data storage.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-600 font-mono">
              <span>Center ID: {settings.centerCode}</span>
              <span>·</span>
              <span>Operator: {settings.operatorName}</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2">
            <p className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              Navigation
            </p>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button
                  onClick={() => onNavigate('apply')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Form 93 Application
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('guidelines')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Form 93 Guidelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('track')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Track Application Status
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('operator')}
                  className="hover:text-slate-900 transition-colors"
                >
                  Operator Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact & Support */}
          <div className="space-y-2">
            <p className="font-bold text-slate-900 uppercase text-[11px] tracking-wider">
              Help & Contact
            </p>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <a
                  href={`https://wa.me/91${settings.whatsappNumber.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-emerald-700 font-semibold hover:text-emerald-900"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WhatsApp: +91 {settings.whatsappNumber}</span>
                </a>
              </li>
              <li className="flex items-center gap-1.5 text-slate-600">
                <Phone className="w-3.5 h-3.5" />
                <span>Phone: {settings.contactPhone}</span>
              </li>
              <li className="flex items-start gap-1.5 text-slate-500">
                <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Disclaimer row */}
        <div className="pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-slate-400">
          <p>
            Statutory Notice: This is a private citizen facilitation desk (not an official government portal). PAN cards are issued by Income Tax Department authorized channels.
          </p>
          <div className="flex items-center gap-2 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Secure Local Encrypted Storage</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
