import { PanApplication, OperatorSettings } from '../types/pan';

export function generateWhatsAppMessage(
  application: PanApplication,
  settings: OperatorSettings
): string {
  const docList: string[] = [];
  if (application.documents.photo) docList.push('✓ Passport Size Photo');
  if (application.documents.signature) docList.push('✓ Signature / Thumb Impression');
  if (application.documents.aadhaarFront) docList.push('✓ Aadhaar Card (Front)');
  if (application.documents.aadhaarBack) docList.push('✓ Aadhaar Card (Back)');
  if (application.documents.dobProof) docList.push('✓ Proof of Date of Birth');
  if (application.documents.filledFormScan) docList.push('✓ Filled Form 93 Scan');

  const formatText = application.cardFormat === 'physical_and_epan' 
    ? 'Physical PAN Card + e-PAN (Delivery to door)'
    : 'Only e-PAN (Digital PAN via email)';

  const message = `*PAN Card Application (Form 93)*
------------------------------------
📌 *Reference ID:* ${application.id}
👤 *Applicant Name:* ${application.title} ${application.firstName} ${application.middleName ? application.middleName + ' ' : ''}${application.lastName}
🆔 *Name on Card:* ${application.nameOnCard}
👨 *Father's Name:* ${application.fatherFirstName} ${application.fatherLastName}
📅 *Date of Birth:* ${application.dob}
⚧ *Gender:* ${application.gender.toUpperCase()}
🔢 *Aadhaar Number:* ${application.aadhaarNumber}
📱 *Mobile Number:* ${application.mobile}
📧 *Email:* ${application.email || 'N/A'}
📦 *PAN Format:* ${formatText}

🏠 *Address:*
${application.flatOrDoorNo ? application.flatOrDoorNo + ', ' : ''}${application.buildingOrVillage}, ${application.roadOrStreet ? application.roadOrStreet + ', ' : ''}${application.townOrDistrict}, ${application.state} - ${application.pincode}

📑 *Attached Documents:*
${docList.length > 0 ? docList.join('\n') : 'All required documents attached on portal.'}

------------------------------------
Hello, I have submitted my Form 93 application on the online portal. Please review my Reference ID *${application.id}* and proceed with processing. Thank you!`;

  return message;
}

export function createWhatsAppUrl(phone: string, text: string): string {
  const cleanPhone = phone.replace(/\D/g, '');
  const finalPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  const encodedText = encodeURIComponent(text);
  return `https://api.whatsapp.com/send?phone=${finalPhone}&text=${encodedText}`;
}
