/** Morocco (Africa/Casablanca) — work hours 11:00–19:00 */
const WORK_START_HOUR = 11;
const WORK_END_HOUR = 19; // 7pm — orders at 19:00+ are outside hours

function getMoroccoParts(date: Date): { hour: number; minute: number } {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Africa/Casablanca',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(date);

  const hour = Number(parts.find((p) => p.type === 'hour')?.value ?? 0);
  const minute = Number(parts.find((p) => p.type === 'minute')?.value ?? 0);
  return { hour, minute };
}

export function isWithinCallHours(date: Date = new Date()): boolean {
  const { hour } = getMoroccoParts(date);
  return hour >= WORK_START_HOUR && hour < WORK_END_HOUR;
}

/** Message shown in the call card on thank-you page */
export function getCallScheduleMessage(date: Date = new Date()): string {
  if (isWithinCallHours(date)) {
    return 'غادي نتصلو بيك ف 10 دقائق (بتوقيت المغرب)';
  }
  return 'غادي نتصلو بيك غداً من 11 صباحاً (بتوقيت المغرب)';
}
