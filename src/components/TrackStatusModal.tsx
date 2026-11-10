import React, { useState } from 'react';
import { 
  Search, 
  Printer, 
  MessageCircle, 
  AlertCircle
} from 'lucide-react';
import { PanApplication, OperatorSettings, ApplicationStatus } from '../types/pan';
import { getApplicationById } from '../utils/storage';
import { Language } from '../utils/translations';
import { createWhatsAppUrl } from '../utils/whatsapp';

interface TrackStatusModalProps {
  lang: Language;
  settings: OperatorSettings;
  onViewReceipt: (app: PanApplication) => void;
  onApplyNew: () => void;
}

export const TrackStatusModal: React.FC<TrackStatusModalProps> = ({
  lang,
  settings,
  onViewReceipt,
  onApplyNew,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [application, setApplication] = useState<PanApplication | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setSearched(true);
    try {
      const match = await getApplicationById(searchQuery);
      setApplication(match);
    } catch (err) {
      console.error(err);
      setApplication(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStepIndex = (status: ApplicationStatus): number => {
    switch (status) {
      case 'submitted': return 1;
      case 'under_review': return 2;
      case 'documents_verified': return 3;
      case 'nsdl_processing': return 4;
      case 'dispatched': return 5;
      case 'rejected': return -1;
      default: return 1;
    }
  };

  const currentStep = application ? getStatusStepIndex(application.status) : 1;

  const steps = [
    { title: 'Submitted', desc: 'Application logged' },
    { title: 'Under Review', desc: 'Document check' },
    { title: 'Verified', desc: 'Aadhaar e-KYC' },
    { title: 'Processing', desc: 'PAN allocation' },
    { title: 'Dispatched', desc: 'Speed Post & e-PAN' },
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Search Header */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-6">
        <div className="text-center max-w-md mx-auto mb-6">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto mb-3 border border-amber-200">
            <Search className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Track Form 93 Application Status
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Enter your Application Reference ID (e.g. ACP-261110-8U9A) or 10-digit mobile number.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2 max-w-lg mx-auto">
          <div className="relative flex-1">
            <input
              type="text"
              required
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. ACP-261110-8U9A or 9876543210"
              className="w-full h-11 pl-4 pr-10 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase tracking-wide"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-5 h-11 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-xs"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Search className="w-4 h-4 text-amber-400" />
                <span>Search</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Reference Numbers */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400 flex-wrap">
          <span>Test Reference IDs:</span>
          <button
            type="button"
            onClick={() => setSearchQuery('ACP-261110-8U9A')}
            className="text-amber-700 hover:text-amber-900 font-mono font-medium hover:underline"
          >
            ACP-261110-8U9A
          </button>
          <span>·</span>
          <button
            type="button"
            onClick={() => setSearchQuery('ACP-261109-9M2Q')}
            className="text-amber-700 hover:text-amber-900 font-mono font-medium hover:underline"
          >
            ACP-261109-9M2Q
          </button>
        </div>
      </div>

      {/* Result Container */}
      {searched && (
        <>
          {application ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 space-y-6">
              {/* Header Details */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-3">
                <div>
                  <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                    Form 93 Reference Number
                  </span>
                  <h3 className="font-mono text-xl font-black text-slate-900">
                    {application.id}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Applicant: <span className="font-semibold text-slate-800">{application.title} {application.firstName} {application.lastName}</span> · Father: {application.fatherFirstName} {application.fatherLastName}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewReceipt(application)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Receipt</span>
                  </button>

                  <a
                    href={createWhatsAppUrl(settings.whatsappNumber, `Hello, I would like to check status for my Form 93 application with Ref ID ${application.id}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Visual Progress Stepper */}
              <div>
                <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                  Application Lifecycle Progress:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {steps.map((step, idx) => {
                    const stepNum = idx + 1;
                    const isDone = currentStep >= stepNum;
                    const isCurrent = currentStep === stepNum;

                    return (
                      <div
                        key={idx}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          isCurrent
                            ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200'
                            : isDone
                            ? 'bg-emerald-50/70 border-emerald-200'
                            : 'bg-slate-50/60 border-slate-200 opacity-60'
                        }`}
                      >
                        <div className="flex items-center justify-center mb-1.5">
                          {isDone ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold">
                              ✓
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                              {stepNum}
                            </div>
                          )}
                        </div>
                        <p className={`text-xs font-bold ${isCurrent ? 'text-amber-900' : isDone ? 'text-emerald-900' : 'text-slate-600'}`}>
                          {step.title}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {step.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Note & Remarks */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">
                    Operator Remarks:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Updated: {new Date(application.updatedAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
                <p className="text-slate-700 bg-white p-3 rounded-lg border border-slate-200 font-mono text-[11px] leading-relaxed">
                  {application.operatorNotes || 'Application is being reviewed and verified.'}
                </p>
                {application.acknowledgmentNumber && (
                  <p className="text-[11px] text-emerald-700 font-medium">
                    Department Ack No: <span className="font-mono font-bold">{application.acknowledgmentNumber}</span>
                  </p>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-8 text-center">
              <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-900">
                No Application Found
              </h4>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Please check the Reference ID or mobile number you entered.
              </p>
              <div className="mt-4">
                <button
                  onClick={onApplyNew}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
                >
                  Submit Form 93 Application
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
