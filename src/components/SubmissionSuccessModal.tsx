import React, { useState } from 'react';
import { 
  CheckCircle, 
  Copy, 
  Check, 
  MessageCircle, 
  Printer, 
  ArrowRight,
  ShieldCheck,
  X
} from 'lucide-react';
import { PanApplication, OperatorSettings } from '../types/pan';
import { generateWhatsAppMessage, createWhatsAppUrl } from '../utils/whatsapp';
import { Language } from '../utils/translations';

interface SubmissionSuccessModalProps {
  application: PanApplication;
  settings: OperatorSettings;
  lang: Language;
  onClose: () => void;
  onPrintReceipt: () => void;
  onTrackApplication: () => void;
}

export const SubmissionSuccessModal: React.FC<SubmissionSuccessModalProps> = ({
  application,
  settings,
  lang,
  onClose,
  onPrintReceipt,
  onTrackApplication,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(application.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = generateWhatsAppMessage(application, settings);
  const whatsappUrl = createWhatsAppUrl(settings.whatsappNumber, whatsappMessage);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Icon & Header */}
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xs">
            <CheckCircle className="w-9 h-9" />
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Application Received by Operator!
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
            Your Form 93 details & documents have arrived directly in <span className="font-semibold text-slate-900">{settings.operatorName}'s</span> desk. Send a quick WhatsApp confirmation below to expedite processing.
          </p>
        </div>

        {/* Reference ID Showcase Card */}
        <div className="my-6 p-4 sm:p-5 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 rounded-2xl text-center relative overflow-hidden">
          <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1">
            Application Reference ID
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="font-mono text-xl sm:text-2xl font-black text-amber-950 tracking-wider">
              {application.id}
            </span>
            <button
              onClick={handleCopy}
              className="p-1.5 bg-white/80 hover:bg-white text-amber-900 rounded-lg border border-amber-300 text-xs font-medium transition-colors"
              title="Copy Reference ID"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-[11px] text-amber-900 mt-2">
            Applicant: <span className="font-semibold">{application.title} {application.firstName} {application.lastName}</span> · Mobile: <span className="font-semibold">{application.mobile}</span>
          </p>
        </div>

        {/* Primary Action 1: WhatsApp Button */}
        <div className="space-y-3">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl text-sm sm:text-base flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <MessageCircle className="w-6 h-6 fill-white text-emerald-600 shrink-0" />
            <div className="text-left">
              <span className="block text-xs uppercase font-extrabold text-emerald-100 tracking-wider">Tap to Chat</span>
              <span className="block font-bold">Send to Arman on WhatsApp (+91 {settings.whatsappNumber})</span>
            </div>
          </a>

          {/* Secondary Actions: Print Receipt & Track */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <button
              onClick={onPrintReceipt}
              className="py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-amber-400" />
              <span>Print Acknowledgment Slip</span>
            </button>

            <button
              onClick={onTrackApplication}
              className="py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-2 transition-colors border border-slate-200"
            >
              <ArrowRight className="w-4 h-4 text-slate-600" />
              <span>Track Live Status</span>
            </button>
          </div>
        </div>

        {/* Next Steps Checklist */}
        <div className="mt-6 pt-5 border-t border-slate-100 text-xs text-slate-600 space-y-2">
          <p className="font-bold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Next Processing Steps:</span>
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px]">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-bold text-slate-900 block mb-0.5">1. Document Review</span>
              <span>Operator reviews your Aadhaar & photo for compliance.</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-bold text-slate-900 block mb-0.5">2. Digital e-PAN</span>
              <span>Electronic PAN issued to your email in 48 to 72 hours.</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
              <span className="font-bold text-slate-900 block mb-0.5">3. Speed Post</span>
              <span>Physical laminated card dispatched to residence address.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
