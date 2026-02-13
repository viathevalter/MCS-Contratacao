
export const normalizePhone = (input: string): string => {
  if (!input) return '';
  // Remove spaces, dashes, parentheses
  return input.replace(/[\s\-()]/g, '');
};

export const withDDI = (phone: string, ddi: string = '+34'): string => {
  const cleanPhone = normalizePhone(phone);
  if (!cleanPhone) return '';

  // If already has +, assume full international format
  if (cleanPhone.startsWith('+') || cleanPhone.startsWith('00')) {
    return cleanPhone;
  }

  // Ensure DDI has +
  const cleanDDI = ddi.startsWith('+') ? ddi : `+${ddi.replace('00', '')}`;
  
  return `${cleanDDI}${cleanPhone}`;
};

export const getWhatsAppLink = (phone: string, text: string, type: 'web' | 'app' = 'app'): string => {
  const encodedText = encodeURIComponent(text);
  // Remove + for whatsapp api usually, but wa.me handles it. 
  // Standard format for wa.me is country code without + or 00, just digits
  const cleanNumber = phone.replace(/[^0-9]/g, ''); 
  
  if (type === 'web') {
    return `https://web.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`;
  }
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
};
