export type ApplicationStatus = 
  | 'submitted'
  | 'under_review'
  | 'documents_verified'
  | 'nsdl_processing'
  | 'dispatched'
  | 'rejected';

export type ApplicationType = 'new_pan_form49a' | 'form93_representative' | 'pan_correction';

export type Gender = 'male' | 'female' | 'transgender';

export type PanCardFormat = 'physical_and_epan' | 'only_epan';

export interface ApplicantDocuments {
  photo?: string; // base64 data url
  signature?: string;
  aadhaarFront?: string;
  aadhaarBack?: string;
  dobProof?: string;
  filledFormScan?: string;
}

export interface PanApplication {
  id: string; // e.g. "ACP-261110-8U9A"
  createdAt: string; // ISO string
  applicationType: ApplicationType;
  cardFormat: PanCardFormat;
  
  // Personal Details
  title: 'Shri' | 'Smt' | 'Kumari';
  firstName: string;
  middleName: string;
  lastName: string;
  nameOnCard: string;
  nameAsPerAadhaar: string;
  
  fatherTitle?: 'Shri';
  fatherFirstName: string;
  fatherMiddleName: string;
  fatherLastName: string;
  
  motherFirstName?: string;
  motherLastName?: string;
  parentNameOnCard: 'father' | 'mother';
  
  gender: Gender;
  dob: string; // YYYY-MM-DD
  aadhaarNumber: string; // 12 digits
  
  // Contact
  mobile: string; // 10 digits
  email: string;
  
  // Address
  flatOrDoorNo: string;
  buildingOrVillage: string;
  roadOrStreet: string;
  areaOrLocality: string;
  townOrDistrict: string;
  state: string;
  pincode: string;
  
  // Documents
  documents: ApplicantDocuments;
  
  // Processing Info
  status: ApplicationStatus;
  operatorNotes?: string;
  serviceFee?: number;
  acknowledgmentNumber?: string;
  updatedAt: string;
}

export interface OperatorSettings {
  operatorName: string;
  centerName: string;
  centerCode: string;
  whatsappNumber: string;
  contactPhone: string;
  serviceFeePhysical: number;
  serviceFeeEpan: number;
  address: string;
}
