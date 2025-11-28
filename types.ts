export interface DayInfo {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
}

export interface AuspiciousData {
  thaiDate: string;        // e.g., วันขึ้น 15 ค่ำ เดือน 3
  chineseDate: string;     // e.g., วันที่ 15 เดือน 1
  zodiac: string;          // e.g., ปีมะโรง (Dragon)
  auspiciousColor: string; // e.g., สีแดง, สีทอง
  forbiddenColor: string;  // e.g., สีดำ
  auspiciousTime: string;  // e.g., 09:09 - 10:29
  advice: string;          // General advice/quote
  isWanPhra: boolean;      // Buddhist Holy Day
  element: string;         // Feng Shui Element (e.g., Gold, Wood)
}

export enum CalendarView {
  MONTH = 'MONTH',
  DAY = 'DAY'
}