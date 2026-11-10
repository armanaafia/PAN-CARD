import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PanApplication } from '../types/pan';

const DEFAULT_PROJECT_ID = 'vnxmqxulwhdxwowslrte';
const DEFAULT_URL = 'https://vnxmqxulwhdxwowslrte.supabase.co';
const DEFAULT_KEY = 'sb_publishable_YQB7Eo817hCsBWnKmD12pQ_bvD0g74X';

export interface SupabaseConfig {
  url: string;
  key: string;
  projectId: string;
}

export function getSupabaseConfig(): SupabaseConfig {
  if (typeof window !== 'undefined') {
    const customUrl = localStorage.getItem('janseva_supabase_url');
    const customKey = localStorage.getItem('janseva_supabase_key');
    if (customUrl && customKey) {
      const match = customUrl.match(/https:\/\/([a-zA-Z0-9]+)\.supabase\.co/);
      return {
        url: customUrl.trim(),
        key: customKey.trim(),
        projectId: match ? match[1] : DEFAULT_PROJECT_ID,
      };
    }
  }

  const envUrl = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || DEFAULT_URL;
  const envKey = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || DEFAULT_KEY;
  const match = envUrl.match(/https:\/\/([a-zA-Z0-9]+)\.supabase\.co/);

  return {
    url: envUrl,
    key: envKey,
    projectId: match ? match[1] : DEFAULT_PROJECT_ID,
  };
}

export function setSupabaseConfig(url: string, key: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('janseva_supabase_url', url.trim());
    localStorage.setItem('janseva_supabase_key', key.trim());
    cachedClient = null; // Reset cached client
  }
}

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient {
  if (cachedClient) return cachedClient;
  const config = getSupabaseConfig();
  cachedClient = createClient(config.url, config.key, {
    auth: {
      persistSession: false,
    },
  });
  return cachedClient;
}

export const supabase = getSupabaseClient();

const TABLE_NAME = 'applications';

export interface SupabaseTestResult {
  success: boolean;
  message: string;
  tableExists: boolean;
  errorDetails?: string;
  count?: number;
}

/**
 * Test live connection to the configured Supabase database
 */
export async function testSupabaseConnection(): Promise<SupabaseTestResult> {
  const client = getSupabaseClient();
  const config = getSupabaseConfig();

  try {
    const { data, error, count } = await client
      .from(TABLE_NAME)
      .select('id', { count: 'exact', head: false })
      .limit(1);

    if (error) {
      if (error.code === '42P01' || error.message.includes('relation "applications" does not exist')) {
        return {
          success: true,
          tableExists: false,
          message: "Connected to Supabase, but the 'applications' table does not exist yet. Please execute the SQL schema in your Supabase SQL Editor.",
          errorDetails: error.message,
        };
      }
      return {
        success: false,
        tableExists: false,
        message: `Supabase error (${error.code || 'API'}): ${error.message}`,
        errorDetails: error.details || error.hint || error.message,
      };
    }

    return {
      success: true,
      tableExists: true,
      message: `Successfully connected to Supabase (${config.projectId})! Table 'applications' is ready.`,
      count: count ?? (data?.length || 0),
    };
  } catch (err: any) {
    return {
      success: false,
      tableExists: false,
      message: err.message || 'Network error connecting to Supabase',
      errorDetails: String(err),
    };
  }
}

/**
 * Save application directly to Supabase cloud database
 */
export async function saveToSupabase(app: PanApplication): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    const payload = {
      id: app.id,
      created_at: app.createdAt,
      updated_at: app.updatedAt,
      application_type: app.applicationType,
      card_format: app.cardFormat,
      title: app.title,
      first_name: app.firstName,
      middle_name: app.middleName,
      last_name: app.lastName,
      name_on_card: app.nameOnCard,
      name_as_per_aadhaar: app.nameAsPerAadhaar,
      father_first_name: app.fatherFirstName,
      father_middle_name: app.fatherMiddleName,
      father_last_name: app.fatherLastName,
      parent_name_on_card: app.parentNameOnCard,
      gender: app.gender,
      dob: app.dob,
      aadhaar_number: app.aadhaarNumber,
      mobile: app.mobile,
      email: app.email,
      flat_or_door_no: app.flatOrDoorNo,
      building_or_village: app.buildingOrVillage,
      road_or_street: app.roadOrStreet,
      area_or_locality: app.areaOrLocality,
      town_or_district: app.townOrDistrict,
      state: app.state,
      pincode: app.pincode,
      documents: app.documents,
      status: app.status,
      operator_notes: app.operatorNotes,
      acknowledgment_number: app.acknowledgmentNumber,
    };

    const { error } = await client
      .from(TABLE_NAME)
      .upsert(payload, { onConflict: 'id' });

    if (error) {
      console.warn('Supabase save error (will use server/local fallback):', error.message);
      return false;
    }
    console.log('[SUPABASE SYNC] Application saved to cloud:', app.id);
    return true;
  } catch (err) {
    console.warn('Supabase network error:', err);
    return false;
  }
}

/**
 * Fetch all applications from Supabase
 */
export async function fetchFromSupabase(): Promise<PanApplication[] | null> {
  try {
    const client = getSupabaseClient();
    const { data, error } = await client
      .from(TABLE_NAME)
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      console.warn('Supabase fetch error:', error?.message);
      return null;
    }

    return data.map((item: any): PanApplication => ({
      id: item.id,
      createdAt: item.created_at,
      updatedAt: item.updated_at,
      applicationType: item.application_type || 'form93_representative',
      cardFormat: item.card_format || 'physical_and_epan',
      title: item.title || 'Shri',
      firstName: item.first_name || '',
      middleName: item.middle_name || '',
      lastName: item.last_name || '',
      nameOnCard: item.name_on_card || '',
      nameAsPerAadhaar: item.name_as_per_aadhaar || '',
      fatherTitle: 'Shri',
      fatherFirstName: item.father_first_name || '',
      fatherMiddleName: item.father_middle_name || '',
      fatherLastName: item.father_last_name || '',
      parentNameOnCard: item.parent_name_on_card || 'father',
      gender: item.gender || 'male',
      dob: item.dob || '',
      aadhaarNumber: item.aadhaar_number || '',
      mobile: item.mobile || '',
      email: item.email || '',
      flatOrDoorNo: item.flat_or_door_no || '',
      buildingOrVillage: item.building_or_village || '',
      roadOrStreet: item.road_or_street || '',
      areaOrLocality: item.area_or_locality || '',
      townOrDistrict: item.town_or_district || '',
      state: item.state || '',
      pincode: item.pincode || '',
      documents: item.documents || {},
      status: item.status || 'submitted',
      operatorNotes: item.operator_notes || '',
      acknowledgmentNumber: item.acknowledgment_number || '',
    }));
  } catch (err) {
    console.warn('Supabase fetch error:', err);
    return null;
  }
}

/**
 * Delete application from Supabase
 */
export async function deleteFromSupabase(id: string): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    const { error } = await client
      .from(TABLE_NAME)
      .delete()
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}

/**
 * Update application status in Supabase
 */
export async function updateSupabaseStatus(
  id: string,
  status: string,
  notes?: string,
  ackNo?: string
): Promise<boolean> {
  try {
    const client = getSupabaseClient();
    const { error } = await client
      .from(TABLE_NAME)
      .update({
        status,
        operator_notes: notes,
        acknowledgment_number: ackNo,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);
    return !error;
  } catch {
    return false;
  }
}
