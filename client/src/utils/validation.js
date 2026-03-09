// Phone number validation utility

/**
 * Validates Indian mobile numbers
 * Accepts formats:
 * - 10 digits: 9876543210
 * - With +91: +919876543210
 * - With spaces: +91 98765 43210
 * - With country code: 919876543210
 */
export const validatePhone = (phone) => {
  if (!phone) return { valid: false, message: 'Phone number is required' };
  
  // Remove all spaces, hyphens, and parentheses
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Check for valid Indian mobile number patterns
  const patterns = [
    /^[6-9]\d{9}$/,           // 10 digits starting with 6-9
    /^\+91[6-9]\d{9}$/,       // +91 followed by 10 digits
    /^91[6-9]\d{9}$/,         // 91 followed by 10 digits
    /^0[6-9]\d{9}$/           // 0 followed by 10 digits (some formats)
  ];
  
  const isValid = patterns.some(pattern => pattern.test(cleaned));
  
  if (!isValid) {
    return {
      valid: false,
      message: 'Please enter a valid 10-digit Indian mobile number'
    };
  }
  
  return { valid: true, message: '' };
};

/**
 * Formats phone number to standard format
 * Returns: +91 XXXXX XXXXX
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Extract last 10 digits
  const last10 = digits.slice(-10);
  
  if (last10.length === 10) {
    return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
  }
  
  return phone;
};

/**
 * Extracts clean phone number for API submission
 * Returns: +91XXXXXXXXXX
 */
export const cleanPhone = (phone) => {
  if (!phone) return '';
  
  const digits = phone.replace(/\D/g, '');
  const last10 = digits.slice(-10);
  
  return last10.length === 10 ? `+91${last10}` : phone;
};
