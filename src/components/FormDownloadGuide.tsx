import React from 'react';
import { Download, FileText, CheckCircle2, ExternalLink, HelpCircle } from 'lucide-react';
import { Language } from '../utils/translations';

interface FormDownloadGuideProps {
  lang: Language;
  onStartApplication: () => void;
}

export const FormDownloadGuide: React.FC<FormDownloadGuideProps> = ({
  lang,
  onStartApplication,
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Title & Download CTA */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <FileText className="w-4 h-4 text-amber-600" />
              <span>Income Tax Department · Form 93</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Form 93 Official PDF & Application Guidelines
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Download the official Income Tax Department Form 93 or complete the online single-form application directly.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onStartApplication}
              className="px-5 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Apply Online Now (Form 93)
            </button>
          </div>
        </div>

        {/* Official Download Link */}
        <div className="mt-6 p-5 rounded-2xl border border-slate-200 bg-slate-50/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900">Form 93 Official Document (PDF)</span>
              <span className="text-[10px] bg-amber-100 text-amber-900 font-semibold px-2 py-0.5 rounded-sm">
                Income Tax Department
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Official application form under the Income Tax Rules for permanent account number allotment under Form 93. You can download, print, fill, and upload the signed copy if desired.
            </p>
          </div>

          <a
            href="https://www.incometaxindia.gov.in/documents/d/guest/form-93"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl transition-colors shrink-0 shadow-xs"
          >
            <Download className="w-4 h-4 text-amber-400" />
            <span>Download Official Form 93</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>
      </div>

      {/* Checklist & Instructions */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
          Form 93 Document & Photograph Guidelines:
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">1. Passport Photo</span>
            <ul className="space-y-1 text-slate-600 list-disc pl-4 text-[11px]">
              <li>White background preferred.</li>
              <li>Dimensions: 3.5 cm x 2.5 cm.</li>
              <li>Clear front face without dark glasses or headgear.</li>
              <li>Mobile camera photos are auto-compressed automatically.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">2. Signature / Thumb</span>
            <ul className="space-y-1 text-slate-600 list-disc pl-4 text-[11px]">
              <li>Use clean white paper with black or dark blue ink.</li>
              <li>If thumb impression is used, attestation is required.</li>
              <li>Must be clear and legible.</li>
            </ul>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
            <span className="font-bold text-slate-900 block mb-1">3. Identity & Address Proof</span>
            <ul className="space-y-1 text-slate-600 list-disc pl-4 text-[11px]">
              <li>Aadhaar card (front & back) is the primary proof.</li>
              <li>Name and date of birth must match Aadhaar card.</li>
              <li>Birth certificate or school marksheet for proof of DOB.</li>
            </ul>
          </div>
        </div>

        {/* Form 93 Information Box */}
        <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-amber-900">
            <HelpCircle className="w-4 h-4 text-amber-700" />
            <span>About Form 93 Application:</span>
          </p>
          <p className="text-[11px] leading-relaxed">
            Form 93 is used for Permanent Account Number (PAN) allotment applications. Through this portal, you can submit your details and documents online, receive an instant reference number, and forward your application directly to the operator desk via WhatsApp for verification and processing.
          </p>
        </div>
      </div>
    </div>
  );
};
