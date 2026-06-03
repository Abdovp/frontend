import { validateMoroccanPhone } from './phone';

export type CheckoutField = 'name' | 'phone';

export interface CheckoutFormData {
  name: string;
  phone: string;
}

const FIELD_MESSAGES: Record<CheckoutField, { empty: string; invalid?: string }> = {
  name: {
    empty: 'دخل الاسم الكامل ديالك',
    invalid: 'الاسم خاصو يكون على الأقل حرفين',
  },
  phone: {
    empty: 'دخل رقم الهاتف',
    invalid: 'دخّل رقم هاتف مغربي صحيح (06 أو 07)',
  },
};

export function validateCheckoutField(
  field: CheckoutField,
  value: string
): string | undefined {
  const trimmed = value.trim();

  if (field === 'name') {
    if (!trimmed) return FIELD_MESSAGES.name.empty;
    if (trimmed.length < 2) return FIELD_MESSAGES.name.invalid;
    return undefined;
  }

  if (!trimmed) return FIELD_MESSAGES.phone.empty;
  if (!validateMoroccanPhone(trimmed)) return FIELD_MESSAGES.phone.invalid;
  return undefined;
}

export function validateCheckoutForm(data: CheckoutFormData): Partial<Record<CheckoutField, string>> {
  const errors: Partial<Record<CheckoutField, string>> = {};
  (['name', 'phone'] as CheckoutField[]).forEach((field) => {
    const error = validateCheckoutField(field, data[field]);
    if (error) errors[field] = error;
  });
  return errors;
}
