import React from 'react';
import { Info, MessageCircle, Download } from 'lucide-react';
import { Language } from '../utils/translations';
import { OperatorSettings } from '../types/pan';

interface NoticeBannerProps {
  lang: Language;
  settings: OperatorSettings;
  onOpenGuidelines: () => void;
}

export const NoticeBanner: React.FC<NoticeBannerProps> = ({
  lang,
  settings,
  onOpenGuidelines,
}) => {
  return (
    <div className="bg-amber-50/80 border-b border-amber-200/80 px-4 py-2.5 text-xs text-amber-900">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex items-start sm:items-center gap-2">
          <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5 sm:mt-0" />
          <p className="leading-snug">
            <span className="font-bold">
              {lang === 'hi' ? 'महत्वपूर्ण सूचना:' : 'Important Notice:'}
            </span>{' '}
            {lang === 'hi'
              ? 'यह Form 93 नागरिक सुविधा डेस्क है (सरकारी पोर्टल नहीं)। फॉर्म सबमिशन के बाद विवरण WhatsApp पर साझा करें।'
              : 'This is a private citizen facilitation desk (not an official government portal) for Form 93 PAN applications.'}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 text-[11px] font-medium">
          <a
            href={`https://wa.me/91${settings.whatsappNumber.replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-emerald-800 hover:text-emerald-950 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp: {settings.whatsappNumber}</span>
          </a>

          <button
            type="button"
            onClick={onOpenGuidelines}
            className="flex items-center gap-1 text-amber-900 hover:text-amber-950 underline underline-offset-2"
          >
            <Download className="w-3 h-3 text-amber-700" />
            <span>Form 93 Official PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
