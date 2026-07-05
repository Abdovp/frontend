const ERROR_MESSAGES: Record<string, string> = {
  invalid_phone: 'دخّل رقم هاتف مغربي صحيح (06 أو 07)',
  'Invalid Moroccan phone number': 'دخّل رقم هاتف مغربي صحيح (06 أو 07)',
  'Could not create order': 'وقع خطأ ف السيرفر. جرّب مرة أخرى.',
  'Order already submitted': 'هاد الطلب تسجّل من قبل. راجع صفحة الشكر.',
  'Database unavailable': 'قاعدة البيانات غير متاحة حالياً. تواصل مع الدعم.',
  'Database not configured': 'الخدمة غير متاحة حالياً. جرّب بعد قليل.',
};

export class OrderSubmitError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'OrderSubmitError';
    this.status = status;
  }
}

function parseDetail(detail: unknown): string | undefined {
  if (typeof detail === 'string') return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) => {
        if (typeof item === 'string') return item;
        if (item && typeof item === 'object' && 'msg' in item) {
          return String((item as { msg: unknown }).msg);
        }
        return undefined;
      })
      .filter(Boolean)
      .join(' — ');
  }
  return undefined;
}

export async function readOrderSubmitError(response: Response): Promise<OrderSubmitError> {
  const text = await response.text();
  let raw = text;

  try {
    const data = JSON.parse(text) as { detail?: unknown; message?: unknown };
    raw = parseDetail(data.detail) || parseDetail(data.message) || text;
  } catch {
    // Keep plain-text body.
  }

  const mapped = ERROR_MESSAGES[raw.trim()];
  const message =
    mapped ||
    (raw.trim() && raw.trim().length < 120 ? raw.trim() : '') ||
    (response.status >= 500
      ? 'الخدمة غير متاحة حالياً. جرّب بعد قليل.'
      : 'ما قدرناش نسجّلو الطلب. تأكّد من المعلومات وجرب مرة أخرى.');

  return new OrderSubmitError(message, response.status);
}

export function getCheckoutErrorMessage(error: unknown): string {
  if (error instanceof OrderSubmitError) return error.message;
  if (
    error &&
    typeof error === 'object' &&
    'name' in error &&
    (error as Error).name === 'OrderSubmitError' &&
    'message' in error
  ) {
    return String((error as Error).message);
  }
  if (error instanceof SyntaxError) {
    return 'الخدمة ردّت بشكل غير متوقع. جرّب مرة أخرى.';
  }
  if (error instanceof TypeError && /fetch|network|failed/i.test(error.message)) {
    return 'ما قدرناش نوصلو للسيرفر. تأكّد من الاتصال بالإنترنت وجرب مرة أخرى.';
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return 'ما قدرناش نسجّلو الطلب. جرّب مرة أخرى.';
}
