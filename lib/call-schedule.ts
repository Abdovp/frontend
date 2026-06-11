import { STORE } from './products';

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

export interface CallScheduleInfo {
  /** Small status line above main message */
  statusLine: string;
  /** Main call timing message */
  message: string;
  inWorkHours: boolean;
}

/** Call card copy for thank-you page (Morocco time) */
export function getCallScheduleInfo(date: Date = new Date()): CallScheduleInfo {
  if (isWithinCallHours(date)) {
    return {
      statusLine: 'الفريق متاح دابا',
      message: 'غادي نتصلو بيك بعد 10 دقائق',
      inWorkHours: true,
    };
  }
  return {
    statusLine: `استراحة فريق ${STORE.nameAr} دابا`,
    message: 'غادي نتصلو بيك غداً مع 11 صباحاً (بتوقيت المغرب)',
    inWorkHours: false,
  };
}
