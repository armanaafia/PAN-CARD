import React, { useState } from 'react';
import { 
  FileText, 
  User, 
  MapPin, 
  UploadCloud, 
  Send, 
  Sparkles, 
  CreditCard, 
  Check, 
  AlertCircle
} from 'lucide-react';
import { PanApplication, PanCardFormat, Gender, OperatorSettings } from '../types/pan';
import { INDIAN_STATES } from '../data/indianStates';
import { DocumentUploadField } from './DocumentUploadField';
import { generateReferenceNumber, saveApplication } from '../utils/storage';
import { Language, TRANSLATIONS } from '../utils/translations';

interface PanApplicationFormProps {
  lang: Language;
  settings: OperatorSettings;
  onSubmitSuccess: (application: PanApplication) => void;
}

export const PanApplicationForm: React.FC<PanApplicationFormProps> = ({
  lang,
  settings,
  onSubmitSuccess,
}) => {
  const t = TRANSLATIONS[lang];

  // Form State
  const [cardFormat, setCardFormat] = useState<PanCardFormat>('physical_and_epan');
  
  const [title, setTitle] = useState<'Shri' | 'Smt' | 'Kumari'>('Shri');
  const [firstName, setFirstName] = useState('');
  const [middleName, setMiddleName] = useState('');
  const [lastName, setLastName] = useState('');
  const [nameOnCard, setNameOnCard] = useState('');
  const [nameAsPerAadhaar, setNameAsPerAadhaar] = useState('');

  const [fatherFirstName, setFatherFirstName] = useState('');
  const [fatherMiddleName, setFatherMiddleName] = useState('');
  const [fatherLastName, setFatherLastName] = useState('');
  const [parentNameOnCard, setParentNameOnCard] = useState<'father' | 'mother'>('father');

  const [gender, setGender] = useState<Gender>('male');
  const [dob, setDob] = useState('');
  const [aadhaarNumber, setAadhaarNumber] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');

  // Address
  const [flatOrDoorNo, setFlatOrDoorNo] = useState('');
  const [buildingOrVillage, setBuildingOrVillage] = useState('');
  const [roadOrStreet, setRoadOrStreet] = useState('');
  const [areaOrLocality, setAreaOrLocality] = useState('');
  const [townOrDistrict, setTownOrDistrict] = useState('');
  const [state, setState] = useState('Uttar Pradesh');
  const [pincode, setPincode] = useState('');

  // Documents
  const [photo, setPhoto] = useState<string | undefined>();
  const [signature, setSignature] = useState<string | undefined>();
  const [aadhaarFront, setAadhaarFront] = useState<string | undefined>();
  const [aadhaarBack, setAadhaarBack] = useState<string | undefined>();
  const [dobProof, setDobProof] = useState<string | undefined>();
  const [filledFormScan, setFilledFormScan] = useState<string | undefined>();

  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-fill Name on Card if empty
  const handleNameBlur = () => {
    if (!nameOnCard && (firstName || lastName)) {
      const full = [firstName, middleName, lastName].filter(Boolean).join(' ').toUpperCase();
      setNameOnCard(full);
    }
    if (!nameAsPerAadhaar && (firstName || lastName)) {
      const full = [firstName, middleName, lastName].filter(Boolean).join(' ').toUpperCase();
      setNameAsPerAadhaar(full);
    }
  };

  // Format Aadhaar with spaces (4-4-4)
  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 12);
    const parts = [];
    for (let i = 0; i < raw.length; i += 4) {
      parts.push(raw.substring(i, i + 4));
    }
    setAadhaarNumber(parts.join(' '));
  };

  // 1-Click Fill Demo Data
  const handleFillDemoData = () => {
    setTitle('Shri');
    setFirstName('Rajesh');
    setMiddleName('Kumar');
    setLastName('Patel');
    setNameOnCard('RAJESH KUMAR PATEL');
    setNameAsPerAadhaar('RAJESH KUMAR PATEL');
    
    setFatherFirstName('Dinesh');
    setFatherMiddleName('Bhai');
    setFatherLastName('Patel');
    setParentNameOnCard('father');

    setGender('male');
    setDob('1997-04-18');
    setAadhaarNumber('8927 1264 6902');
    setMobile('8927126469');
    setEmail('rajesh.patel97@gmail.com');

    setFlatOrDoorNo('B-402, Shanti Complex');
    setBuildingOrVillage('Station Road, Ward 7');
    setRoadOrStreet('Near Civil Hospital');
    setAreaOrLocality('Civil Lines');
    setTownOrDistrict('Varanasi');
    setState('Uttar Pradesh');
    setPincode('221002');

    // Sample SVGs for demo documents
    setPhoto('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="%23f1f5f9"/><circle cx="100" cy="85" r="45" fill="%23cbd5e1"/><path d="M40 210 c0 -40 30 -60 60 -60 s60 20 60 60" fill="%2394a3b8"/><text x="100" y="230" font-family="sans-serif" font-size="12" fill="%23475569" text-anchor="middle">Rajesh Patel Photo</text></svg>');
    setSignature('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120"><rect width="300" height="120" fill="%23ffffff"/><path d="M40 70 Q 75 25, 110 65 T 180 50 T 240 75" fill="none" stroke="%230f172a" stroke-width="4"/><text x="150" y="110" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">Sign: R. K. Patel</text></svg>');
    setAadhaarFront('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="10" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><rect width="400" height="30" fill="%23ea580c"/><text x="200" y="21" fill="white" font-size="12" font-family="sans-serif" text-anchor="middle" font-weight="bold">GOVERNMENT OF INDIA - UIDAI</text><circle cx="65" cy="115" r="35" fill="%23e2e8f0"/><text x="125" y="95" font-family="sans-serif" font-size="15" font-weight="bold" fill="%230f172a">Rajesh Kumar Patel</text><text x="125" y="120" font-family="sans-serif" font-size="12" fill="%23475569">DOB: 18/04/1997  MALE</text><text x="200" y="195" font-family="monospace" font-size="20" font-weight="bold" fill="%23dc2626" text-anchor="middle">XXXX XXXX 6902</text><rect y="224" width="400" height="26" fill="%2316a34a"/><text x="200" y="242" fill="white" font-size="11" font-family="sans-serif" text-anchor="middle">मेरा आधार, मेरी पहचान</text></svg>');
    setAadhaarBack('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="10" fill="%23f8fafc" stroke="%23cbd5e1" stroke-width="2"/><text x="20" y="40" font-family="sans-serif" font-size="13" font-weight="bold" fill="%231e293b">Address:</text><text x="20" y="65" font-family="sans-serif" font-size="12" fill="%23475569">S/O Dinesh Bhai Patel, B-402 Shanti Complex</text><text x="20" y="85" font-family="sans-serif" font-size="12" fill="%23475569">Station Road, Ward 7, Varanasi, UP - 221002</text><rect x="20" y="120" width="100" height="100" fill="%230f172a"/><rect x="25" y="125" width="90" height="90" fill="%23ffffff"/><text x="70" y="175" font-family="monospace" font-size="11" text-anchor="middle" fill="%230f172a">QR CODE</text></svg>');
    setDobProof('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" fill="%23fffbeb" stroke="%23fde68a" stroke-width="2"/><text x="200" y="40" font-family="serif" font-size="16" font-weight="bold" fill="%2392400e" text-anchor="middle">BIRTH CERTIFICATE</text><text x="40" y="80" font-family="sans-serif" font-size="12" fill="%2378350f">Name: Rajesh Kumar Patel</text><text x="40" y="105" font-family="sans-serif" font-size="12" fill="%2378350f">Date of Birth: 18th April 1997</text><text x="40" y="130" font-family="sans-serif" font-size="12" fill="%2378350f">Place of Birth: Varanasi, Uttar Pradesh</text><circle cx="340" cy="180" r="30" fill="none" stroke="%23b45309" stroke-width="2"/><text x="340" y="185" font-family="sans-serif" font-size="9" text-anchor="middle" fill="%23b45309">SEAL</text></svg>');
    
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!firstName.trim() || !lastName.trim()) {
      setErrorMessage('Please enter Applicant First and Last name.');
      return;
    }

    if (!fatherFirstName.trim() || !fatherLastName.trim()) {
      setErrorMessage('Please enter Father\'s First and Last name.');
      return;
    }

    if (!dob) {
      setErrorMessage('Please select Date of Birth.');
      return;
    }

    const cleanAadhaar = aadhaarNumber.replace(/\D/g, '');
    if (cleanAadhaar.length !== 12) {
      setErrorMessage('Please enter a valid 12-digit Aadhaar number.');
      return;
    }

    const cleanMobile = mobile.replace(/\D/g, '');
    if (cleanMobile.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit Mobile number.');
      return;
    }

    if (!buildingOrVillage.trim() || !townOrDistrict.trim() || !pincode.trim()) {
      setErrorMessage('Please enter complete residential address, district, and PIN code.');
      return;
    }

    if (!photo) {
      setErrorMessage('Passport size photograph is mandatory.');
      return;
    }

    if (!signature) {
      setErrorMessage('Signature or thumb impression is mandatory.');
      return;
    }

    try {
      setSubmitting(true);
      const newRefId = generateReferenceNumber();

      const application: PanApplication = {
        id: newRefId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        applicationType: 'form93_representative',
        cardFormat,
        title,
        firstName: firstName.trim(),
        middleName: middleName.trim(),
        lastName: lastName.trim(),
        nameOnCard: nameOnCard.trim() || [firstName, middleName, lastName].filter(Boolean).join(' ').toUpperCase(),
        nameAsPerAadhaar: nameAsPerAadhaar.trim() || [firstName, middleName, lastName].filter(Boolean).join(' ').toUpperCase(),
        fatherTitle: 'Shri',
        fatherFirstName: fatherFirstName.trim(),
        fatherMiddleName: fatherMiddleName.trim(),
        fatherLastName: fatherLastName.trim(),
        parentNameOnCard,
        gender,
        dob,
        aadhaarNumber: aadhaarNumber.trim(),
        mobile: cleanMobile,
        email: email.trim(),
        flatOrDoorNo: flatOrDoorNo.trim(),
        buildingOrVillage: buildingOrVillage.trim(),
        roadOrStreet: roadOrStreet.trim(),
        areaOrLocality: areaOrLocality.trim(),
        townOrDistrict: townOrDistrict.trim(),
        state,
        pincode: pincode.trim(),
        documents: {
          photo,
          signature,
          aadhaarFront,
          aadhaarBack,
          dobProof,
          filledFormScan,
        },
        status: 'submitted',
        operatorNotes: 'Online Form 93 application submitted. Awaiting operator document review.',
      };

      await saveApplication(application);
      onSubmitSuccess(application);
    } catch (err) {
      console.error('Error saving application:', err);
      setErrorMessage('Error saving application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Header and Hero Block */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-8 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              <CreditCard className="w-4 h-4 text-amber-600" />
              <span>Income Tax Department · Form 93</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Application for PAN Card (Form 93)
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Online single-form application for Permanent Account Number allotment under Form 93
            </p>
          </div>

          <button
            type="button"
            onClick={handleFillDemoData}
            className="flex items-center gap-1.5 px-3 py-2 bg-amber-50 text-amber-800 hover:bg-amber-100 rounded-lg text-xs font-semibold border border-amber-200 transition-colors shrink-0 self-start sm:self-auto"
            title="Auto-fill sample data for quick testing"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>1-Click Demo Fill</span>
          </button>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section: Card Format (NO PRICES SHOWN) */}
          <div className="bg-slate-50/70 rounded-xl p-4 sm:p-5 border border-slate-200">
            <label className="block text-xs font-semibold text-slate-800 mb-2">
              Select PAN Card Delivery Format
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                cardFormat === 'physical_and_epan'
                  ? 'bg-white border-amber-500 shadow-xs ring-1 ring-amber-500'
                  : 'bg-white/60 border-slate-200 hover:bg-white'
              }`}>
                <input
                  type="radio"
                  name="cardFormat"
                  checked={cardFormat === 'physical_and_epan'}
                  onChange={() => setCardFormat('physical_and_epan')}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <p className="font-bold text-slate-900">Physical Plastic Card + e-PAN</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Printed laminated plastic PAN card delivered to your residential doorstep by Speed Post, plus digital e-PAN on email.
                  </p>
                </div>
              </label>

              <label className={`flex items-start gap-3 p-3.5 rounded-xl border text-xs cursor-pointer transition-all ${
                cardFormat === 'only_epan'
                  ? 'bg-white border-amber-500 shadow-xs ring-1 ring-amber-500'
                  : 'bg-white/60 border-slate-200 hover:bg-white'
              }`}>
                <input
                  type="radio"
                  name="cardFormat"
                  checked={cardFormat === 'only_epan'}
                  onChange={() => setCardFormat('only_epan')}
                  className="mt-0.5 text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <p className="font-bold text-slate-900">Only Digital e-PAN</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Official digital electronic PAN card (PDF) sent directly to your registered email address.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Step 1: Personal Details */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">
              <User className="w-4 h-4 text-amber-600" />
              <span>1. Applicant Personal Details (Part A)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 sm:gap-4 mb-4">
              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <select
                  value={title}
                  onChange={(e) => setTitle(e.target.value as any)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                >
                  <option value="Shri">Shri (Mr.)</option>
                  <option value="Smt">Smt (Mrs.)</option>
                  <option value="Kumari">Kumari (Ms.)</option>
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  onBlur={handleNameBlur}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Middle Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kumar"
                  value={middleName}
                  onChange={(e) => setMiddleName(e.target.value)}
                  onBlur={handleNameBlur}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-1">
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Last Name / Surname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Patel"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onBlur={handleNameBlur}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Name to be Printed on PAN Card <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameOnCard}
                  onChange={(e) => setNameOnCard(e.target.value.toUpperCase())}
                  placeholder="RAJESH KUMAR PATEL"
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase tracking-wide"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Exact spelling as you want printed on the PAN card
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Full Name as per Aadhaar Card <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={nameAsPerAadhaar}
                  onChange={(e) => setNameAsPerAadhaar(e.target.value.toUpperCase())}
                  placeholder="RAJESH KUMAR PATEL"
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Must exactly match the name sequence on your Aadhaar card
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as Gender)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="transgender">Transgender</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Date of Birth (DOB) <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  12-Digit Aadhaar Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="XXXX XXXX XXXX"
                  value={aadhaarNumber}
                  onChange={handleAadhaarChange}
                  maxLength={14}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Parent & Contact Details */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">
              <User className="w-4 h-4 text-amber-600" />
              <span>2. Parent & Contact Details</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Father's First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dinesh"
                  value={fatherFirstName}
                  onChange={(e) => setFatherFirstName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Father's Middle Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bhai"
                  value={fatherMiddleName}
                  onChange={(e) => setFatherMiddleName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Father's Last Name / Surname <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Patel"
                  value={fatherLastName}
                  onChange={(e) => setFatherLastName(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Name of Parent Printed on PAN
                </label>
                <select
                  value={parentNameOnCard}
                  onChange={(e) => setParentNameOnCard(e.target.value as any)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  <option value="father">Father's Name</option>
                  <option value="mother">Mother's Name</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Mobile Number <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-medium">+91</span>
                  <input
                    type="tel"
                    required
                    placeholder="9876543210"
                    maxLength={10}
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    className="w-full h-10 pl-11 pr-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="applicant@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Residential Address */}
          <div>
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-200 pb-2 mb-4">
              <MapPin className="w-4 h-4 text-amber-600" />
              <span>3. Residential Delivery Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Flat / Door / Block No.
                </label>
                <input
                  type="text"
                  placeholder="H.No. / Flat 402"
                  value={flatOrDoorNo}
                  onChange={(e) => setFlatOrDoorNo(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Premises / Building / Village Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Shanti Complex / Village Name"
                  value={buildingOrVillage}
                  onChange={(e) => setBuildingOrVillage(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Road / Street / Lane
                </label>
                <input
                  type="text"
                  placeholder="Station Road / Civil Lines"
                  value={roadOrStreet}
                  onChange={(e) => setRoadOrStreet(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Area / Locality / Taluka
                </label>
                <input
                  type="text"
                  placeholder="Near Post Office / Taluka"
                  value={areaOrLocality}
                  onChange={(e) => setAreaOrLocality(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Town / City / District <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Varanasi"
                  value={townOrDistrict}
                  onChange={(e) => setTownOrDistrict(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  State / Union Territory <span className="text-red-500">*</span>
                </label>
                <select
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                >
                  {INDIAN_STATES.map((s) => (
                    <option key={s.code} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  6-Digit PIN Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="221002"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Step 4: Documents Upload */}
          <div>
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-4">
              <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                <UploadCloud className="w-4 h-4 text-amber-600" />
                <span>4. Required Document Uploads</span>
              </div>
              <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                ⚡ Camera photos auto-compressed for quick submission
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DocumentUploadField
                label="Passport Size Photograph"
                helperText="White background, front face (Auto-compressed)"
                required
                maxDimension={600}
                value={photo}
                onChange={setPhoto}
                lang="en"
              />

              <DocumentUploadField
                label="Signature / Thumb Impression"
                helperText="Upload photo OR draw signature directly on screen"
                required
                maxDimension={600}
                value={signature}
                onChange={setSignature}
                lang="en"
                isSignature={true}
              />

              <DocumentUploadField
                label="Aadhaar Card - Front Side"
                helperText="Clear photo showing applicant name and date of birth"
                required
                maxDimension={1200}
                value={aadhaarFront}
                onChange={setAadhaarFront}
                lang="en"
              />

              <DocumentUploadField
                label="Aadhaar Card - Back Side"
                helperText="Back side showing complete residential address"
                required
                maxDimension={1200}
                value={aadhaarBack}
                onChange={setAadhaarBack}
                lang="en"
              />

              <DocumentUploadField
                label="Proof of Date of Birth"
                helperText="Birth Certificate, 10th Marksheet, or Aadhaar Card"
                maxDimension={1200}
                value={dobProof}
                onChange={setDobProof}
                lang="en"
              />

              <DocumentUploadField
                label="Filled Form 93 Scan (Optional)"
                helperText="If you have physically filled and signed Form 93"
                maxDimension={1200}
                value={filledFormScan}
                onChange={setFilledFormScan}
                lang="en"
              />
            </div>
          </div>

          {/* Submission Action Block (NO PRICES SHOWN) */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              <p className="flex items-center gap-1.5 font-medium text-slate-700">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Instant Reference ID & Acknowledgment Slip generated upon submission.</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Application details can be forwarded directly to the operator via WhatsApp.
              </p>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Submitting Form 93 Application...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit Form 93 Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
