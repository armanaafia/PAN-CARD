import express from 'express';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Increase body limit to handle compressed photo/aadhaar base64 uploads
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Data storage directory
const DATA_DIR = path.resolve(__dirname, 'data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial sample seed applications
const INITIAL_APPLICATIONS = [
  {
    id: 'ACP-261110-8U9A',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    applicationType: 'form93_representative',
    cardFormat: 'physical_and_epan',
    title: 'Shri',
    firstName: 'Amit',
    middleName: 'Kumar',
    lastName: 'Sharma',
    nameOnCard: 'AMIT KUMAR SHARMA',
    nameAsPerAadhaar: 'AMIT KUMAR SHARMA',
    fatherTitle: 'Shri',
    fatherFirstName: 'Rajesh',
    fatherMiddleName: '',
    fatherLastName: 'Sharma',
    parentNameOnCard: 'father',
    gender: 'male',
    dob: '1998-05-14',
    aadhaarNumber: '4892 7812 9014',
    mobile: '9876543210',
    email: 'amit.sharma98@gmail.com',
    flatOrDoorNo: 'H.No. 42',
    buildingOrVillage: 'Rampur Kalan',
    roadOrStreet: 'Near Shiva Mandir Road',
    areaOrLocality: 'Post Rampur',
    townOrDistrict: 'Varanasi',
    state: 'Uttar Pradesh',
    pincode: '221001',
    status: 'nsdl_processing',
    acknowledgmentNumber: 'NSDL-88291048123',
    operatorNotes: 'Aadhaar matched successfully. Biometric verification completed. Forwarded to dispatch queue.',
    documents: {
      photo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="%23e2e8f0"/><circle cx="100" cy="85" r="45" fill="%2394a3b8"/><path d="M40 210 c0 -40 30 -60 60 -60 s60 20 60 60" fill="%2364748b"/><text x="100" y="230" font-family="sans-serif" font-size="12" fill="%23475569" text-anchor="middle">Amit Sharma Photo</text></svg>',
      signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120"><rect width="300" height="120" fill="%23f8fafc"/><path d="M40 70 Q 70 20, 100 65 T 160 50 T 220 80 T 260 40" fill="none" stroke="%231e293b" stroke-width="4"/><text x="150" y="110" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">Sign: A. K. Sharma</text></svg>',
      aadhaarFront: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="250" viewBox="0 0 400 250"><rect width="400" height="250" rx="12" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><rect width="400" height="28" fill="%23ea580c"/><text x="200" y="20" fill="white" font-size="12" font-family="sans-serif" text-anchor="middle" font-weight="bold">GOVERNMENT OF INDIA - UNIQUE IDENTIFICATION AUTHORITY</text><circle cx="60" cy="110" r="35" fill="%23cbd5e1"/><text x="120" y="90" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">Amit Kumar Sharma</text><text x="120" y="115" font-family="sans-serif" font-size="12" fill="%23475569">DOB: 14/05/1998  Male</text><text x="200" y="190" font-family="monospace" font-size="20" font-weight="bold" fill="%23b91c1c" text-anchor="middle">XXXX XXXX 9014</text><rect y="226" width="400" height="24" fill="%2316a34a"/><text x="200" y="242" fill="white" font-size="11" font-family="sans-serif" text-anchor="middle">मेरा आधार, मेरी पहचान</text></svg>',
    },
  },
  {
    id: 'ACP-261109-9M2Q',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    applicationType: 'form93_representative',
    cardFormat: 'physical_and_epan',
    title: 'Shri',
    firstName: 'Mohd',
    middleName: 'Arman',
    lastName: 'Ansari',
    nameOnCard: 'MOHD ARMAN ANSARI',
    nameAsPerAadhaar: 'MOHD ARMAN ANSARI',
    fatherTitle: 'Shri',
    fatherFirstName: 'Noor',
    fatherMiddleName: 'Mohd',
    fatherLastName: 'Ansari',
    parentNameOnCard: 'father',
    gender: 'male',
    dob: '1995-12-05',
    aadhaarNumber: '8927 1264 6901',
    mobile: '8927126469',
    email: '8927126469arman@gmail.com',
    flatOrDoorNo: 'Shop No 5, Ansari Market',
    buildingOrVillage: 'Islampur Road',
    roadOrStreet: 'Near Post Office',
    areaOrLocality: 'Kolkata Ward 12',
    townOrDistrict: 'Kolkata',
    state: 'West Bengal',
    pincode: '700014',
    status: 'dispatched',
    acknowledgmentNumber: 'NSDL-8910293847',
    operatorNotes: 'PAN allocated. e-PAN dispatched to applicant email. Speed Post tracking: ED892712646IN.',
    documents: {
      photo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="%23e0f2fe"/><circle cx="100" cy="85" r="45" fill="%2338bdf8"/><path d="M40 210 c0 -40 30 -60 60 -60 s60 20 60 60" fill="%230284c7"/><text x="100" y="230" font-family="sans-serif" font-size="12" fill="%230369a1" text-anchor="middle">Arman Ansari Photo</text></svg>',
    },
  },
];

const DEFAULT_SETTINGS = {
  operatorName: 'Arman Ansari (Operator)',
  centerName: 'Citizen Facilitation Counter & Cyber Desk',
  centerCode: 'JSK-WB-26110',
  whatsappNumber: '8927126469',
  contactPhone: '+91 8927126469',
  serviceFeePhysical: 0,
  serviceFeeEpan: 0,
  address: 'Near Main Market, Station Road, Facilitation Center',
};

// Helper: Read applications
function readApplications(): any[] {
  try {
    if (!fs.existsSync(APPLICATIONS_FILE)) {
      fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(INITIAL_APPLICATIONS, null, 2));
      return INITIAL_APPLICATIONS;
    }
    const data = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading applications:', err);
    return INITIAL_APPLICATIONS;
  }
}

// Helper: Write applications
function writeApplications(apps: any[]) {
  try {
    fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(apps, null, 2));
  } catch (err) {
    console.error('Error writing applications:', err);
  }
}

// Helper: Read settings
function readSettings(): any {
  try {
    if (!fs.existsSync(SETTINGS_FILE)) {
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2));
      return DEFAULT_SETTINGS;
    }
    const data = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Helper: Write settings
function writeSettings(s: any) {
  try {
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(s, null, 2));
  } catch (err) {
    console.error('Error writing settings:', err);
  }
}

// ================= API ROUTES =================

// 1. GET ALL APPLICATIONS (for Operator Desk)
app.get('/api/applications', (req, res) => {
  const apps = readApplications();
  // Sort newest first
  apps.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ success: true, count: apps.length, applications: apps });
});

// 2. SUBMIT APPLICATION (called when customer submits from mobile phone)
app.post('/api/applications', (req, res) => {
  try {
    const newApp = req.body;
    if (!newApp || !newApp.id) {
      return res.status(400).json({ success: false, error: 'Invalid application data' });
    }

    const apps = readApplications();
    const existingIndex = apps.findIndex((a) => a.id === newApp.id);
    if (existingIndex >= 0) {
      apps[existingIndex] = newApp;
    } else {
      apps.unshift(newApp);
    }

    writeApplications(apps);
    console.log(`[SUBMISSION RECEIVED] Customer submitted Form 93: ${newApp.id} - ${newApp.firstName} ${newApp.lastName} (${newApp.mobile})`);

    res.status(201).json({
      success: true,
      message: 'Application received and stored securely on server',
      application: newApp,
    });
  } catch (err: any) {
    console.error('Submission error:', err);
    res.status(500).json({ success: false, error: err.message || 'Server error' });
  }
});

// 3. GET APPLICATION BY ID OR MOBILE (for Track Status)
app.get('/api/applications/:id', (req, res) => {
  const query = req.params.id.trim().toUpperCase();
  const apps = readApplications();
  const match = apps.find(
    (a) =>
      a.id.toUpperCase() === query ||
      a.mobile.replace(/\D/g, '') === query.replace(/\D/g, '') ||
      a.aadhaarNumber.replace(/\D/g, '') === query.replace(/\D/g, '')
  );

  if (!match) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }
  res.json({ success: true, application: match });
});

// 4. UPDATE APPLICATION STATUS & REMARKS
app.patch('/api/applications/:id', (req, res) => {
  const id = req.params.id;
  const updates = req.body;
  const apps = readApplications();
  const index = apps.findIndex((a) => a.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Application not found' });
  }

  apps[index] = {
    ...apps[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  writeApplications(apps);
  res.json({ success: true, application: apps[index] });
});

// 5. DELETE APPLICATION
app.delete('/api/applications/:id', (req, res) => {
  const id = req.params.id;
  const apps = readApplications();
  const filtered = apps.filter((a) => a.id !== id);
  writeApplications(filtered);
  res.json({ success: true, message: 'Application deleted' });
});

// 6. OPERATOR SETTINGS
app.get('/api/settings', (req, res) => {
  res.json({ success: true, settings: readSettings() });
});

app.post('/api/settings', (req, res) => {
  const s = req.body;
  writeSettings(s);
  res.json({ success: true, settings: s });
});

// ================= VITE DEV / PRODUCTION MIDDLEWARE =================
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`PAN Portal Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
