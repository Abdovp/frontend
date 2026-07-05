/** Matches backend `normalize_moroccan_phone` / `validate_moroccan_phone`. */
export function validateMoroccanPhone(phone: string): boolean {
  const cleaned = phone.trim().replace(/[\s\-()]/g, '');
  if (!cleaned) return false;

  let digits: string;
  if (cleaned.startsWith('+212')) {
    digits = cleaned.slice(4);
  } else if (cleaned.startsWith('00212')) {
    digits = cleaned.slice(5);
  } else if (cleaned.startsWith('0')) {
    digits = cleaned.slice(1);
  } else {
    digits = cleaned;
  }

  return /^[67]\d{8}$/.test(digits);
}
