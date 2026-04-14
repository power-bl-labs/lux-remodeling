export function normalizeUsPhoneDigits(value: string) {
  const digits = value.replace(/\D/g, "");

  if (digits.length <= 10) {
    return digits;
  }

  if (digits.length === 11 && digits.startsWith("1")) {
    return digits.slice(1);
  }

  return digits.slice(0, 10);
}

export function formatUsPhoneInput(value: string) {
  const digits = normalizeUsPhoneDigits(value);

  if (digits.length === 0) {
    return "";
  }

  if (digits.length < 4) {
    return `(${digits}`;
  }

  if (digits.length < 7) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  }

  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
}

export function isValidUsPhone(value: string) {
  const digits = normalizeUsPhoneDigits(value);
  return /^[2-9]\d{2}[2-9]\d{6}$/.test(digits);
}

export function toDialableUsPhone(value: string) {
  const digits = normalizeUsPhoneDigits(value);

  if (!digits) {
    return "";
  }

  return digits.length === 10 ? `+1${digits}` : digits;
}
