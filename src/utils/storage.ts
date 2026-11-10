import { PanApplication, OperatorSettings } from '../types/pan';

const DB_NAME = 'JanSevaPanDB';
const DB_VERSION = 1;
const STORE_APPLICATIONS = 'applications';
const STORAGE_KEY_FALLBACK = 'janseva_pan_applications_backup';
const STORAGE_KEY_SETTINGS = 'janseva_pan_operator_settings';

export const DEFAULT_SETTINGS: OperatorSettings = {
  operatorName: 'Arman Ansari (Operator)',
  centerName: 'Citizen Facilitation Counter & Cyber Desk',
  centerCode: 'JSK-WB-26110',
  whatsappNumber: '8927126469',
  contactPhone: '+91 8927126469',
  serviceFeePhysical: 0,
  serviceFeeEpan: 0,
  address: 'Near Main Market, Station Road, Facilitation Center',
};

// Seed sample applications for Form 93
const SAMPLE_APPLICATIONS: PanApplication[] = [
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
    id: 'ACP-261110-3K7X',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    applicationType: 'form93_representative',
    cardFormat: 'physical_and_epan',
    title: 'Kumari',
    firstName: 'Pooja',
    middleName: '',
    lastName: 'Verma',
    nameOnCard: 'POOJA VERMA',
    nameAsPerAadhaar: 'POOJA VERMA',
    fatherTitle: 'Shri',
    fatherFirstName: 'Mahesh',
    fatherMiddleName: 'Chand',
    fatherLastName: 'Verma',
    parentNameOnCard: 'father',
    gender: 'female',
    dob: '2001-08-22',
    aadhaarNumber: '7621 9845 2311',
    mobile: '9123456780',
    email: 'pooja.verma2001@outlook.com',
    flatOrDoorNo: 'Flat 304, Royal Heights',
    buildingOrVillage: 'Sector 12',
    roadOrStreet: 'Ring Road',
    areaOrLocality: 'Indira Nagar',
    townOrDistrict: 'Lucknow',
    state: 'Uttar Pradesh',
    pincode: '226016',
    status: 'documents_verified',
    acknowledgmentNumber: 'NSDL-7738291044',
    operatorNotes: 'Photo and signature verified. Ready for upload to processing portal.',
    documents: {
      photo: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="240" viewBox="0 0 200 240"><rect width="200" height="240" fill="%23fce7f3"/><circle cx="100" cy="85" r="45" fill="%23f472b6"/><path d="M40 210 c0 -40 30 -60 60 -60 s60 20 60 60" fill="%23db2777"/><text x="100" y="230" font-family="sans-serif" font-size="12" fill="%23831843" text-anchor="middle">Pooja Verma Photo</text></svg>',
      signature: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="120" viewBox="0 0 300 120"><rect width="300" height="120" fill="%23f8fafc"/><path d="M50 60 Q 80 30, 110 60 T 170 55 T 230 75" fill="none" stroke="%230f172a" stroke-width="4"/><text x="150" y="110" font-family="sans-serif" font-size="12" fill="%2364748b" text-anchor="middle">Sign: Pooja V.</text></svg>',
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

function openIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (e) => {
      const db = (e.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_APPLICATIONS)) {
        const store = db.createObjectStore(STORE_APPLICATIONS, { keyPath: 'id' });
        store.createIndex('mobile', 'mobile', { unique: false });
        store.createIndex('status', 'status', { unique: false });
        store.createIndex('createdAt', 'createdAt', { unique: false });
      }
    };
  });
}

import { saveToSupabase, fetchFromSupabase, deleteFromSupabase } from './supabase';

export async function getAllApplications(): Promise<PanApplication[]> {
  // 1. First attempt to fetch live from Supabase cloud database (works on Netlify & mobile!)
  try {
    const supabaseData = await fetchFromSupabase();
    if (supabaseData && supabaseData.length > 0) {
      return supabaseData;
    }
  } catch (err) {
    console.warn('Supabase fetch failed:', err);
  }

  // 2. Second attempt: fetch from local Node server API
  try {
    const res = await fetch('/api/applications');
    if (res.ok) {
      const data = await res.json();
      if (data.success && Array.isArray(data.applications) && data.applications.length > 0) {
        return data.applications;
      }
    }
  } catch (err) {
    console.warn('Live API fetch failed, using local storage fallback:', err);
  }

  // 3. Fallback to IndexedDB
  try {
    const db = await openIndexedDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_APPLICATIONS, 'readonly');
      const store = tx.objectStore(STORE_APPLICATIONS);
      const req = store.getAll();
      req.onsuccess = () => {
        let results = req.result as PanApplication[];
        if (!results || results.length === 0) {
          const local = getLocalStorageApplications();
          results = local.length > 0 ? local : SAMPLE_APPLICATIONS;
        }
        results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        resolve(results);
      };
      req.onerror = () => {
        const fallback = getLocalStorageApplications();
        resolve(fallback.length > 0 ? fallback : SAMPLE_APPLICATIONS);
      };
    });
  } catch {
    const local = getLocalStorageApplications();
    return local.length > 0 ? local : SAMPLE_APPLICATIONS;
  }
}

export async function saveApplication(app: PanApplication): Promise<void> {
  // 1. Sync directly to Supabase cloud database (persists across Netlify, mobile, & GitHub)
  saveToSupabase(app).catch((err) => console.warn('Supabase background sync:', err));

  // 2. Also send to local Node Express Server API if running
  try {
    await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(app),
    });
  } catch {
    // Expected on static Netlify deploy
  }

  // 3. Always update LocalStorage backup
  const current = getLocalStorageApplications();
  const index = current.findIndex((item) => item.id === app.id);
  if (index >= 0) {
    current[index] = app;
  } else {
    current.unshift(app);
  }
  try {
    localStorage.setItem(STORAGE_KEY_FALLBACK, JSON.stringify(current));
  } catch {
    // If quota exceeded, ignore
  }

  // 4. Save to IndexedDB
  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_APPLICATIONS, 'readwrite');
      const store = tx.objectStore(STORE_APPLICATIONS);
      const req = store.put(app);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.warn('IndexedDB save fallback used:', err);
  }
}

export async function getApplicationById(id: string): Promise<PanApplication | null> {
  // 1. Try server endpoint
  try {
    const res = await fetch(`/api/applications/${encodeURIComponent(id.trim())}`);
    if (res.ok) {
      const data = await res.json();
      if (data.success && data.application) {
        return data.application;
      }
    }
  } catch {
    // Fall back to local
  }

  const all = await getAllApplications();
  const cleanQuery = id.trim().toUpperCase();
  const match = all.find(
    (app) => app.id.toUpperCase() === cleanQuery || 
             app.mobile.replace(/\D/g, '') === cleanQuery.replace(/\D/g, '') ||
             app.aadhaarNumber.replace(/\D/g, '') === cleanQuery.replace(/\D/g, '')
  );
  return match || null;
}

export async function deleteApplication(id: string): Promise<void> {
  deleteFromSupabase(id).catch(() => {});
  try {
    await fetch(`/api/applications/${encodeURIComponent(id)}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Delete via API error:', err);
  }

  const current = getLocalStorageApplications().filter((a) => a.id !== id);
  localStorage.setItem(STORAGE_KEY_FALLBACK, JSON.stringify(current));

  try {
    const db = await openIndexedDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_APPLICATIONS, 'readwrite');
      const store = tx.objectStore(STORE_APPLICATIONS);
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  } catch {
    // Ignore
  }
}

function getLocalStorageApplications(): PanApplication[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY_FALLBACK);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function saveInitialSeeds(seeds: PanApplication[]) {
  try {
    localStorage.setItem(STORAGE_KEY_FALLBACK, JSON.stringify(seeds));
    const db = await openIndexedDB();
    const tx = db.transaction(STORE_APPLICATIONS, 'readwrite');
    const store = tx.objectStore(STORE_APPLICATIONS);
    seeds.forEach((item) => store.put(item));
  } catch {
    // Ignore
  }
}

export function getOperatorSettings(): OperatorSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveOperatorSettings(settings: OperatorSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch {
    // Ignore
  }
}

export function generateReferenceNumber(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let rand = '';
  for (let i = 0; i < 4; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `ACP-${yy}${mm}${dd}-${rand}`;
}
