import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Search, 
  Eye, 
  CheckCircle, 
  Printer, 
  Download, 
  Settings, 
  MessageCircle, 
  Trash2, 
  Shield, 
  FileSpreadsheet, 
  X,
  Cloud,
  Copy,
  Check,
  Database,
  RefreshCw,
  AlertCircle,
  Key
} from 'lucide-react';
import { PanApplication, OperatorSettings, ApplicationStatus } from '../types/pan';
import { getAllApplications, saveApplication, deleteApplication, saveOperatorSettings } from '../utils/storage';
import { 
  getSupabaseConfig, 
  setSupabaseConfig, 
  testSupabaseConnection, 
  saveToSupabase, 
  SupabaseTestResult 
} from '../utils/supabase';
import { Language } from '../utils/translations';
import { createWhatsAppUrl } from '../utils/whatsapp';

interface OperatorPortalProps {
  lang: Language;
  settings: OperatorSettings;
  onUpdateSettings: (settings: OperatorSettings) => void;
  onPrintReceipt: (app: PanApplication) => void;
}

export const OperatorPortal: React.FC<OperatorPortalProps> = ({
  lang,
  settings,
  onUpdateSettings,
  onPrintReceipt,
}) => {
  const [applications, setApplications] = useState<PanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  
  // Selected Application for Inspection / Edit Modal
  const [selectedApp, setSelectedApp] = useState<PanApplication | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'details' | 'documents' | 'status'>('details');
  const [inspectDocUrl, setInspectDocUrl] = useState<string | null>(null);

  const [deployGuideOpen, setDeployGuideOpen] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [tempSettings, setTempSettings] = useState<OperatorSettings>(settings);

  const supabaseSql = `-- RUN THIS IN SUPABASE SQL EDITOR (https://supabase.com/dashboard/project/vnxmqxulwhdxwowslrte/sql)
CREATE TABLE IF NOT EXISTS applications (
  id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  application_type TEXT,
  card_format TEXT,
  title TEXT,
  first_name TEXT,
  middle_name TEXT,
  last_name TEXT,
  name_on_card TEXT,
  name_as_per_aadhaar TEXT,
  father_first_name TEXT,
  father_middle_name TEXT,
  father_last_name TEXT,
  parent_name_on_card TEXT,
  gender TEXT,
  dob TEXT,
  aadhaar_number TEXT,
  mobile TEXT,
  email TEXT,
  flat_or_door_no TEXT,
  building_or_village TEXT,
  road_or_street TEXT,
  area_or_locality TEXT,
  town_or_district TEXT,
  state TEXT,
  pincode TEXT,
  documents JSONB,
  status TEXT DEFAULT 'submitted',
  operator_notes TEXT,
  acknowledgment_number TEXT
);

-- Enable public access for mobile customers
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON applications FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON applications FOR SELECT USING (true);
CREATE POLICY "Allow public update" ON applications FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON applications FOR DELETE USING (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(supabaseSql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  // Supabase Cloud states
  const [supabaseConfig, setSupabaseConfigState] = useState(getSupabaseConfig());
  const [tempSupabaseUrl, setTempSupabaseUrl] = useState(supabaseConfig.url);
  const [tempSupabaseKey, setTempSupabaseKey] = useState(supabaseConfig.key);
  const [testResult, setTestResult] = useState<SupabaseTestResult | null>(null);
  const [testingSupabase, setTestingSupabase] = useState(false);
  const [syncingToSupabase, setSyncingToSupabase] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const handleTestSupabase = async () => {
    setTestingSupabase(true);
    setTestResult(null);
    try {
      const result = await testSupabaseConnection();
      setTestResult(result);
    } catch (err: any) {
      setTestResult({
        success: false,
        tableExists: false,
        message: err.message || 'Connection test failed',
      });
    } finally {
      setTestingSupabase(false);
    }
  };

  const handleSaveSupabaseConfig = (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseConfig(tempSupabaseUrl, tempSupabaseKey);
    const updated = getSupabaseConfig();
    setSupabaseConfigState(updated);
    handleTestSupabase();
  };

  const handleSyncAllToSupabase = async () => {
    if (applications.length === 0) return;
    setSyncingToSupabase(true);
    setSyncMessage(null);
    let successCount = 0;
    let failCount = 0;

    for (const app of applications) {
      const ok = await saveToSupabase(app);
      if (ok) successCount++;
      else failCount++;
    }

    setSyncingToSupabase(false);
    setSyncMessage(`Sync complete: ${successCount} saved to Supabase cloud${failCount > 0 ? `, ${failCount} pending/offline` : ''}`);
    await loadData(true);
  };

  // Status edit temp state
  const [editStatus, setEditStatus] = useState<ApplicationStatus>('submitted');
  const [editNotes, setEditNotes] = useState('');
  const [editAckNo, setEditAckNo] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);

  const loadData = async (silent = false) => {
    if (!silent) setLoading(true);
    const apps = await getAllApplications();
    setApplications(apps);
    if (!silent) setLoading(false);
  };

  useEffect(() => {
    loadData();
    // Auto-poll server every 5 seconds so new mobile submissions immediately show up on operator screen
    const interval = setInterval(() => {
      loadData(true);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleOpenApp = (app: PanApplication) => {
    setSelectedApp(app);
    setEditStatus(app.status);
    setEditNotes(app.operatorNotes || '');
    setEditAckNo(app.acknowledgmentNumber || '');
    setActiveModalTab('details');
  };

  const handleSaveStatus = async () => {
    if (!selectedApp) return;
    setSavingStatus(true);
    const updated: PanApplication = {
      ...selectedApp,
      status: editStatus,
      operatorNotes: editNotes,
      acknowledgmentNumber: editAckNo,
      updatedAt: new Date().toISOString(),
    };
    await saveApplication(updated);
    setSelectedApp(updated);
    await loadData();
    setSavingStatus(false);
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this application record?')) {
      await deleteApplication(id);
      if (selectedApp?.id === id) setSelectedApp(null);
      await loadData();
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveOperatorSettings(tempSettings);
    onUpdateSettings(tempSettings);
    setSettingsOpen(false);
  };

  // Export submissions to JSON
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(applications, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `form93_applications_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Export submissions to CSV (no price columns)
  const handleExportCSV = () => {
    const headers = ['Ref_ID', 'Date', 'Name', 'Father_Name', 'DOB', 'Gender', 'Aadhaar', 'Mobile', 'Email', 'City', 'State', 'Pincode', 'Card_Format', 'Status'];
    const rows = applications.map((a) => [
      a.id,
      a.createdAt.slice(0, 10),
      `"${a.title} ${a.firstName} ${a.lastName}"`,
      `"${a.fatherFirstName} ${a.fatherLastName}"`,
      a.dob,
      a.gender,
      `'${a.aadhaarNumber}`,
      `'${a.mobile}`,
      a.email,
      `"${a.townOrDistrict}"`,
      `"${a.state}"`,
      a.pincode,
      a.cardFormat,
      a.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', encodeURI(csvContent));
    downloadAnchor.setAttribute('download', `form93_applications_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Filtering
  const filteredApps = applications.filter((app) => {
    const matchesSearch = 
      app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `${app.firstName} ${app.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.mobile.includes(searchQuery) ||
      app.townOrDistrict.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    return matchesSearch && app.status === filterStatus;
  });

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'submitted':
        return <span className="text-amber-700 font-semibold text-xs">Submitted</span>;
      case 'under_review':
        return <span className="text-blue-700 font-semibold text-xs">Under Review</span>;
      case 'documents_verified':
        return <span className="text-indigo-700 font-semibold text-xs">Docs Verified</span>;
      case 'nsdl_processing':
        return <span className="text-purple-700 font-semibold text-xs">Processing</span>;
      case 'dispatched':
        return <span className="text-emerald-700 font-semibold text-xs">Dispatched</span>;
      case 'rejected':
        return <span className="text-red-700 font-semibold text-xs">Needs Correction</span>;
      default:
        return <span className="text-slate-600 text-xs">{status}</span>;
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6">
      {/* Top Banner / Stats */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-slate-100 gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <Shield className="w-4 h-4 text-amber-600" />
              <span>Form 93 Facilitation & Operator Desk</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {settings.centerName}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Operator: <span className="font-semibold text-slate-800">{settings.operatorName}</span> · Center ID: <span className="font-mono font-semibold text-slate-800">{settings.centerCode}</span> · WhatsApp: <span className="font-mono text-emerald-700 font-bold">{settings.whatsappNumber}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => {
                setDeployGuideOpen(true);
                handleTestSupabase();
              }}
              className="px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors border border-emerald-300 shadow-2xs"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>Supabase Cloud ({supabaseConfig.projectId})</span>
            </button>

            <button
              onClick={() => {
                setTempSettings(settings);
                setSettingsOpen(true);
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
            >
              <Settings className="w-3.5 h-3.5 text-slate-600" />
              <span>Center Settings</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
              title="CSV Spreadsheet Download"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleExportJSON}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
              title="Full Data Backup with Photos"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>JSON Backup</span>
            </button>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
            <span className="text-[11px] font-medium text-slate-500 block">Total Applications</span>
            <span className="text-xl sm:text-2xl font-black text-slate-950 font-mono">{applications.length}</span>
          </div>

          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200">
            <span className="text-[11px] font-medium text-amber-800 block">New / Review</span>
            <span className="text-xl sm:text-2xl font-black text-amber-950 font-mono">
              {applications.filter((a) => a.status === 'submitted' || a.status === 'under_review').length}
            </span>
          </div>

          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200">
            <span className="text-[11px] font-medium text-blue-800 block">In Processing</span>
            <span className="text-xl sm:text-2xl font-black text-blue-950 font-mono">
              {applications.filter((a) => a.status === 'nsdl_processing').length}
            </span>
          </div>

          <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-200">
            <span className="text-[11px] font-medium text-emerald-800 block">Dispatched / e-PAN</span>
            <span className="text-xl sm:text-2xl font-black text-emerald-950 font-mono">
              {applications.filter((a) => a.status === 'dispatched').length}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, ref, mobile, city..."
            className="w-full h-10 pl-9 pr-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Status Filter Segmented Control */}
        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 rounded-xl">
          {[
            { id: 'all', label: 'All' },
            { id: 'submitted', label: 'Submitted' },
            { id: 'documents_verified', label: 'Verified' },
            { id: 'nsdl_processing', label: 'Processing' },
            { id: 'dispatched', label: 'Dispatched' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                filterStatus === tab.id
                  ? 'bg-white text-slate-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-950'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Loading Form 93 applications...
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">
              No Form 93 applications found
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Submit a new Form 93 application or clear the search filter.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4">Photo</th>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Applicant Name</th>
                  <th className="py-3 px-4">Father Name</th>
                  <th className="py-3 px-4">Mobile & City</th>
                  <th className="py-3 px-4">Format</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => handleOpenApp(app)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="w-9 h-11 bg-slate-100 rounded-md overflow-hidden border border-slate-200 flex items-center justify-center">
                        {app.documents.photo ? (
                          <img
                            src={app.documents.photo}
                            alt=""
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        ) : (
                          <span className="text-[9px] text-slate-400">N/A</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-slate-900 block">
                        {app.id}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(app.createdAt).toLocaleDateString('en-IN', {
                          day: '2-digit',
                          month: 'short',
                        })}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-900 block">
                        {app.title} {app.firstName} {app.lastName}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {app.aadhaarNumber}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-700">
                      {app.fatherFirstName} {app.fatherLastName}
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-slate-900 font-medium block">
                        +91 {app.mobile}
                      </span>
                      <span className="text-[11px] text-slate-400 truncate block max-w-xs">
                        {app.townOrDistrict}, {app.state}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-[11px]">
                      {app.cardFormat === 'physical_and_epan' ? (
                        <span className="font-semibold text-amber-900">Physical + e-PAN</span>
                      ) : (
                        <span className="text-blue-800">Only e-PAN</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      {getStatusBadge(app.status)}
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onPrintReceipt(app)}
                          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                          title="Print Receipt"
                        >
                          <Printer className="w-4 h-4" />
                        </button>

                        <a
                          href={createWhatsAppUrl(app.mobile, `Hello ${app.firstName}, your Form 93 PAN application (${app.id}) is being processed at ${settings.centerName}.`)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Chat with Applicant on WhatsApp"
                        >
                          <MessageCircle className="w-4 h-4" />
                        </a>

                        <button
                          onClick={(e) => handleDelete(app.id, e)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Application Detail & Document Inspector Modal */}
      {selectedApp && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setSelectedApp(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div>
                <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
                  Form 93 Application Details
                </span>
                <h3 className="font-mono text-xl font-black text-slate-900">
                  {selectedApp.id}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPrintReceipt(selectedApp)}
                  className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-800"
                >
                  <Printer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Print Slip</span>
                </button>

                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 mb-5">
              <button
                onClick={() => setActiveModalTab('details')}
                className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeModalTab === 'details'
                    ? 'border-amber-600 text-amber-800'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                1. Personal Details
              </button>
              <button
                onClick={() => setActiveModalTab('documents')}
                className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeModalTab === 'documents'
                    ? 'border-amber-600 text-amber-800'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                2. Attached Documents
              </button>
              <button
                onClick={() => setActiveModalTab('status')}
                className={`py-2 px-3 text-xs font-bold border-b-2 transition-colors ${
                  activeModalTab === 'status'
                    ? 'border-amber-600 text-amber-800'
                    : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                3. Update Status & Notes
              </button>
            </div>

            {/* Tab 1: Personal Details */}
            {activeModalTab === 'details' && (
              <div className="space-y-4 text-xs">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Full Name:</span>
                    <span className="font-bold text-slate-900 text-sm">
                      {selectedApp.title} {selectedApp.firstName} {selectedApp.middleName} {selectedApp.lastName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Name on Card:</span>
                    <span className="font-semibold text-slate-900">{selectedApp.nameOnCard}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Name as per Aadhaar:</span>
                    <span className="font-semibold text-slate-900">{selectedApp.nameAsPerAadhaar}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Father's Name:</span>
                    <span className="font-semibold text-slate-900">{selectedApp.fatherFirstName} {selectedApp.fatherLastName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Date of Birth:</span>
                    <span className="font-semibold text-slate-900">{selectedApp.dob} ({selectedApp.gender.toUpperCase()})</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Aadhaar Number:</span>
                    <span className="font-mono font-bold text-slate-900">{selectedApp.aadhaarNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Mobile Number:</span>
                    <span className="font-mono font-bold text-slate-900">+91 {selectedApp.mobile}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Email:</span>
                    <span className="text-slate-900">{selectedApp.email || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Format:</span>
                    <span className="font-semibold text-slate-900">
                      {selectedApp.cardFormat === 'physical_and_epan' ? 'Physical Card + e-PAN' : 'Only Digital e-PAN'}
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[11px] mb-1">Residential Delivery Address:</span>
                  <p className="font-medium text-slate-800">
                    {selectedApp.flatOrDoorNo ? selectedApp.flatOrDoorNo + ', ' : ''}
                    {selectedApp.buildingOrVillage}, {selectedApp.roadOrStreet ? selectedApp.roadOrStreet + ', ' : ''}
                    {selectedApp.townOrDistrict}, {selectedApp.state} - <span className="font-bold">{selectedApp.pincode}</span>
                  </p>
                </div>
              </div>
            )}

            {/* Tab 2: Uploaded Documents */}
            {activeModalTab === 'documents' && (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">
                  Click on any document preview to inspect in full resolution.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Passport Photo', src: selectedApp.documents.photo },
                    { label: 'Signature', src: selectedApp.documents.signature },
                    { label: 'Aadhaar (Front)', src: selectedApp.documents.aadhaarFront },
                    { label: 'Aadhaar (Back)', src: selectedApp.documents.aadhaarBack },
                    { label: 'Proof of DOB', src: selectedApp.documents.dobProof },
                    { label: 'Filled Form 93 Scan', src: selectedApp.documents.filledFormScan },
                  ].map((doc, idx) => (
                    <div
                      key={idx}
                      className="border border-slate-200 rounded-xl p-3 bg-slate-50 flex flex-col justify-between gap-2"
                    >
                      <span className="text-xs font-bold text-slate-800 block truncate">{doc.label}</span>
                      {doc.src ? (
                        <div
                          onClick={() => setInspectDocUrl(doc.src || null)}
                          className="h-28 bg-white rounded-lg border border-slate-200 overflow-hidden cursor-pointer hover:opacity-90 relative group flex items-center justify-center"
                        >
                          <img
                            src={doc.src}
                            alt={doc.label}
                            className="max-h-full max-w-full object-contain"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity text-xs font-semibold gap-1">
                            <Eye className="w-4 h-4" /> View Full
                          </div>
                        </div>
                      ) : (
                        <div className="h-28 bg-white/60 rounded-lg border border-dashed border-slate-300 flex items-center justify-center text-[11px] text-slate-400">
                          Not attached
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Update Status & Operator Notes */}
            {activeModalTab === 'status' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Application Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value as ApplicationStatus)}
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="submitted">1. Submitted</option>
                    <option value="under_review">2. Under Review</option>
                    <option value="documents_verified">3. Documents Verified</option>
                    <option value="nsdl_processing">4. Processing with Department</option>
                    <option value="dispatched">5. Allotted & Dispatched / Completed</option>
                    <option value="rejected">6. Needs Correction</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Department Acknowledgment Number
                  </label>
                  <input
                    type="text"
                    value={editAckNo}
                    onChange={(e) => setEditAckNo(e.target.value)}
                    placeholder="e.g. NSDL-88291048123"
                    className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 mb-1">
                    Operator Remarks (Visible to applicant on Status Check)
                  </label>
                  <textarea
                    rows={3}
                    value={editNotes}
                    onChange={(e) => setEditNotes(e.target.value)}
                    placeholder="e.g. Documents verified. Submitted to processing queue."
                    className="w-full p-3 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleSaveStatus}
                    disabled={savingStatus}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle className="w-4 h-4" />
                    <span>{savingStatus ? 'Updating...' : 'Save & Update Status'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Full Document Lightbox */}
      {inspectDocUrl && (
        <div
          className="fixed inset-0 z-60 bg-black/85 flex items-center justify-center p-4 backdrop-blur-xs"
          onClick={() => setInspectDocUrl(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3.5 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900">Document Inspection Viewer</span>
              <button
                onClick={() => setInspectDocUrl(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 bg-slate-900 flex items-center justify-center max-h-[75vh] overflow-auto">
              <img
                src={inspectDocUrl}
                alt="Enlarged"
                className="max-h-[70vh] max-w-full object-contain rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Operator Settings Modal (NO PRICE INPUTS) */}
      {settingsOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setSettingsOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="text-sm font-bold text-slate-900">
                Operator & Center Settings
              </h3>
              <button
                onClick={() => setSettingsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Facilitation Center Name
                </label>
                <input
                  type="text"
                  required
                  value={tempSettings.centerName}
                  onChange={(e) => setTempSettings({ ...tempSettings, centerName: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Operator Name
                </label>
                <input
                  type="text"
                  required
                  value={tempSettings.operatorName}
                  onChange={(e) => setTempSettings({ ...tempSettings, operatorName: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    WhatsApp Number (10 digits)
                  </label>
                  <input
                    type="tel"
                    required
                    value={tempSettings.whatsappNumber}
                    onChange={(e) => setTempSettings({ ...tempSettings, whatsappNumber: e.target.value.replace(/\D/g, '') })}
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Center ID / Code
                  </label>
                  <input
                    type="text"
                    required
                    value={tempSettings.centerCode}
                    onChange={(e) => setTempSettings({ ...tempSettings, centerCode: e.target.value })}
                    className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg font-mono uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Center Address
                </label>
                <input
                  type="text"
                  required
                  value={tempSettings.address}
                  onChange={(e) => setTempSettings({ ...tempSettings, address: e.target.value })}
                  className="w-full h-9 px-3 bg-white border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSettingsOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Supabase Cloud & Deployment Manager Modal */}
      {deployGuideOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setDeployGuideOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-100 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Supabase Cloud Database & Deployment Hub
                </h3>
              </div>
              <button
                onClick={() => setDeployGuideOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Live Connection Card */}
              <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-bold text-slate-900 text-sm">
                      Connected to Supabase Project: {supabaseConfig.projectId}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleTestSupabase}
                    disabled={testingSupabase}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-[11px] transition-colors shadow-2xs disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${testingSupabase ? 'animate-spin' : ''}`} />
                    <span>{testingSupabase ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
                  <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-slate-500 font-sans block">Database URL</span>
                    <span className="text-slate-800 break-all">{supabaseConfig.url}</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-emerald-100">
                    <span className="text-[10px] text-slate-500 font-sans block">Publishable API Key</span>
                    <span className="text-slate-800">{supabaseConfig.key.slice(0, 16)}...</span>
                  </div>
                </div>

                {/* Test Result Message */}
                {testResult && (
                  <div className={`mt-3 p-2.5 rounded-xl border flex items-start gap-2 ${
                    testResult.success
                      ? testResult.tableExists
                        ? 'bg-emerald-100/80 border-emerald-300 text-emerald-900'
                        : 'bg-amber-100/90 border-amber-300 text-amber-950'
                      : 'bg-red-50 border-red-200 text-red-900'
                  }`}>
                    {testResult.success ? (
                      <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    )}
                    <div className="text-[11px] leading-relaxed">
                      <p className="font-semibold">{testResult.message}</p>
                      {testResult.errorDetails && (
                        <p className="font-mono text-[10px] text-slate-600 mt-0.5">{testResult.errorDetails}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sync Records to Supabase */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-900 block">
                    Sync Local Submissions to Supabase Cloud
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    Push all {applications.length} applications stored in this browser into your cloud database.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleSyncAllToSupabase}
                  disabled={syncingToSupabase || applications.length === 0}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 shrink-0"
                >
                  <Cloud className={`w-3.5 h-3.5 text-amber-400 ${syncingToSupabase ? 'animate-bounce' : ''}`} />
                  <span>{syncingToSupabase ? 'Syncing...' : 'Sync to Supabase'}</span>
                </button>
              </div>

              {syncMessage && (
                <div className="p-2.5 bg-blue-50 border border-blue-200 text-blue-900 rounded-xl text-[11px] font-semibold">
                  {syncMessage}
                </div>
              )}

              {/* Step 1: SQL Table */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">
                    Step 1: Execute Table Schema in Supabase
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="flex items-center gap-1 px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-800 rounded-md border border-slate-300 font-semibold text-[11px] transition-colors shadow-2xs"
                  >
                    {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                    <span>{copiedSql ? 'Copied SQL!' : 'Copy SQL'}</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500 mb-2">
                  Open your <a href="https://supabase.com/dashboard/project/vnxmqxulwhdxwowslrte/sql" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-semibold">Supabase SQL Editor</a>, paste the SQL query below, and click <b>Run</b>:
                </p>
                <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg text-[10px] font-mono overflow-x-auto max-h-32">
                  {supabaseSql}
                </pre>
              </div>

              {/* Step 2: Edit / Update Credentials if needed */}
              <details className="p-3 bg-slate-50 rounded-xl border border-slate-200 group">
                <summary className="font-bold text-slate-800 cursor-pointer flex items-center justify-between text-[11px]">
                  <span className="flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-slate-600" />
                    Update Supabase Project URL or API Key
                  </span>
                  <span className="text-slate-400 group-open:rotate-180 transition-transform">▼</span>
                </summary>
                <form onSubmit={handleSaveSupabaseConfig} className="mt-3 space-y-2 pt-2 border-t border-slate-200">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Project URL</label>
                    <input
                      type="url"
                      required
                      value={tempSupabaseUrl}
                      onChange={(e) => setTempSupabaseUrl(e.target.value)}
                      className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                      placeholder="https://vnxmqxulwhdxwowslrte.supabase.co"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-600 mb-0.5">Publishable / Anon API Key</label>
                    <input
                      type="text"
                      required
                      value={tempSupabaseKey}
                      onChange={(e) => setTempSupabaseKey(e.target.value)}
                      className="w-full h-8 px-2.5 text-xs bg-white border border-slate-300 rounded-lg font-mono"
                      placeholder="sb_publishable_..."
                    />
                  </div>
                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg font-semibold text-[11px]"
                    >
                      Save & Test New Keys
                    </button>
                  </div>
                </form>
              </details>

              {/* Step 3: Push to GitHub & Publish to Netlify */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">
                  Step 3: Connect GitHub & Publish to Netlify
                </span>
                <p className="text-[11px] text-slate-600 leading-relaxed mb-2">
                  Run these commands in your repository terminal to push changes to GitHub:
                </p>
                <pre className="p-2.5 bg-slate-900 text-slate-100 rounded-lg text-[11px] font-mono mb-2">
                  git add .<br />
                  git commit -m "Connected Supabase database vnxmqxulwhdxwowslrte"<br />
                  git push origin main
                </pre>
                <p className="text-[11px] text-slate-600">
                  On <a href="https://app.netlify.com" target="_blank" rel="noopener noreferrer" className="text-amber-700 underline font-semibold">Netlify.com</a>, import this repository. It automatically reads <code>netlify.toml</code> and serves your portal with full Supabase cloud sync!
                </p>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setDeployGuideOpen(false)}
                  className="px-5 py-2 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800"
                >
                  Close Manager
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
