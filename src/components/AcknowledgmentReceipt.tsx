import React from 'react';
import { Printer, ArrowLeft } from 'lucide-react';
import { PanApplication, OperatorSettings } from '../types/pan';
import { Language } from '../utils/translations';

interface AcknowledgmentReceiptProps {
  application: PanApplication;
  settings: OperatorSettings;
  lang: Language;
  onBack: () => void;
}

export const AcknowledgmentReceipt: React.FC<AcknowledgmentReceiptProps> = ({
  application,
  settings,
  lang,
  onBack,
}) => {
  const handlePrint = () => {
    window.print();
  };

  const formattedDate = new Date(application.createdAt).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const formattedTime = new Date(application.createdAt).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  const maskedAadhaar = application.aadhaarNumber.length >= 8
    ? `XXXX XXXX ${application.aadhaarNumber.slice(-4)}`
    : 'XXXX XXXX XXXX';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:px-6">
      {/* Top action bar (hidden on print) */}
      <div className="no-print flex items-center justify-between gap-4 mb-6 bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Portal</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print Acknowledgment Slip / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Receipt Paper */}
      <div className="printable-area bg-white border-2 border-slate-800 rounded-lg p-6 sm:p-8 text-slate-900 font-sans shadow-md">
        {/* Receipt Header */}
        <div className="border-b-2 border-slate-800 pb-4 mb-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-widest mb-1">
            <span>CITIZEN FACILITATION COUNTER</span>
            <span>·</span>
            <span>PAN SERVICE DESK</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-950 uppercase tracking-tight">
            {settings.centerName}
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Center ID: <span className="font-mono font-bold text-slate-900">{settings.centerCode}</span> · Operator: <span className="font-semibold text-slate-900">{settings.operatorName}</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Address: {settings.address} · Helpline / WhatsApp: +91 {settings.whatsappNumber}
          </p>

          <div className="mt-3 inline-block bg-slate-100 border border-slate-300 px-4 py-1 rounded-sm text-xs font-bold uppercase tracking-wider text-slate-900">
            ACKNOWLEDGMENT RECEIPT (FORM 93 ONLINE FACILITATION)
          </div>
        </div>

        {/* Ref Number & Barcode Area */}
        <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-300 pb-4 mb-4 gap-4">
          <div>
            <p className="text-[11px] text-slate-500 uppercase font-semibold">Application Reference Number:</p>
            <p className="text-xl sm:text-2xl font-mono font-black text-slate-950 tracking-wider">
              {application.id}
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Date & Time: <span className="font-semibold">{formattedDate} at {formattedTime}</span>
            </p>
          </div>

          {/* Barcode Simulator */}
          <div className="text-center shrink-0">
            <div className="font-mono text-xl tracking-tighter select-none font-bold text-slate-800 border-x-4 border-slate-800 px-2">
              ||||| | |||| ||| || ||||| |||| | |||||
            </div>
            <p className="text-[10px] font-mono text-slate-500 mt-1 uppercase tracking-widest">
              *{application.id}*
            </p>
          </div>
        </div>

        {/* Applicant Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-b border-slate-300 pb-5 mb-5 text-xs">
          {/* Photos and Signatures */}
          <div className="sm:col-span-1 flex flex-col items-center justify-start gap-2 border-r border-slate-200 pr-2">
            <div className="w-24 h-30 border border-slate-400 bg-slate-50 overflow-hidden flex items-center justify-center">
              {application.documents.photo ? (
                <img
                  src={application.documents.photo}
                  alt="Applicant"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-[10px] text-slate-400 text-center p-1">Photo Uploaded</span>
              )}
            </div>

            <div className="w-24 h-12 border border-slate-400 bg-white overflow-hidden flex items-center justify-center">
              {application.documents.signature ? (
                <img
                  src={application.documents.signature}
                  alt="Signature"
                  className="w-full h-full object-contain p-1"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="text-[9px] text-slate-400">Signature</span>
              )}
            </div>
            <span className="text-[9px] text-slate-500 uppercase font-semibold">Photo & Specimen Sign</span>
          </div>

          {/* Details Column */}
          <div className="sm:col-span-3 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 text-[11px] block">Applicant Full Name:</span>
                <span className="font-bold text-slate-950 uppercase">{application.title} {application.firstName} {application.middleName} {application.lastName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Name on PAN Card:</span>
                <span className="font-bold text-slate-950">{application.nameOnCard}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 text-[11px] block">Father's Name:</span>
                <span className="font-semibold text-slate-900">{application.fatherFirstName} {application.fatherLastName}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Date of Birth & Gender:</span>
                <span className="font-semibold text-slate-900">{application.dob} · {application.gender.toUpperCase()}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-slate-500 text-[11px] block">Aadhaar Number:</span>
                <span className="font-mono font-semibold text-slate-900">{maskedAadhaar}</span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">Mobile & Email:</span>
                <span className="font-semibold text-slate-900">+91 {application.mobile} {application.email ? `· ${application.email}` : ''}</span>
              </div>
            </div>

            <div>
              <span className="text-slate-500 text-[11px] block">Residential Delivery Address:</span>
              <span className="font-medium text-slate-800">
                {application.flatOrDoorNo ? application.flatOrDoorNo + ', ' : ''}
                {application.buildingOrVillage}, {application.roadOrStreet ? application.roadOrStreet + ', ' : ''}
                {application.townOrDistrict}, {application.state} - <span className="font-bold">{application.pincode}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Processing Details (NO PRICES SHOWN) */}
        <div className="bg-slate-50 p-3 rounded-md border border-slate-200 mb-5 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="font-bold text-slate-900">
              PAN Card Delivery Format: {application.cardFormat === 'physical_and_epan' ? 'Physical Card + Digital e-PAN' : 'Only Digital e-PAN'}
            </p>
            <p className="text-[11px] text-slate-500">
              Category: Form 93 Application · Verification: Aadhaar & Identity Proofs Attached
            </p>
          </div>

          <div className="sm:text-right">
            <span className="text-[11px] text-slate-500 block uppercase font-semibold">Processing Status:</span>
            <span className="font-mono text-xs font-bold text-emerald-800 uppercase">Application Received</span>
          </div>
        </div>

        {/* Operator Stamp & Cut-off Section */}
        <div className="border-t-2 border-dashed border-slate-400 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-600">
          <div className="text-[11px] space-y-1">
            <p className="font-bold text-slate-800">Customer Copy - Instructions:</p>
            <p>1. Please retain your Reference ID <span className="font-mono font-bold text-slate-900">{application.id}</span> for all future communications.</p>
            <p>2. Send this acknowledgment slip to operator via WhatsApp <span className="font-bold text-slate-900">(+91 {settings.whatsappNumber})</span> for fast processing.</p>
            <p>3. e-PAN will be delivered to your email in 48-72 hours and physical card via India Post Speed Post.</p>
          </div>

          <div className="w-36 h-20 border-2 border-slate-800 rounded-sm flex flex-col items-center justify-center p-2 text-center shrink-0">
            <span className="text-[9px] uppercase font-bold text-slate-500">FACILITATION DESK</span>
            <span className="text-[10px] font-black text-slate-900 uppercase">FORM 93 VERIFIED</span>
            <span className="text-[8px] font-mono text-slate-600">AUTHORIZED SEAL</span>
          </div>
        </div>
      </div>
    </div>
  );
};
