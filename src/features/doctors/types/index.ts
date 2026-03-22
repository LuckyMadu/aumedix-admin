export interface Doctor {
  id: string;
  fullName: string;
  licenseId: string;
  contactNumber: string;
  email?: string;
  specialty?: string;
  clinicName?: string;
  experience?: ExperienceRange;
  consultationFee?: number;
  workingHours?: WorkingHour[];
  scheduleEntries?: ScheduleEntry[];
  holidays?: Holiday[];
  pausePeriods?: PausePeriod[];
  appointmentDuration?: number;
  consultationType?: ConsultationType;
  profileImageUrl?: string;
  verify: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface WorkingHour {
  day: DayOfWeek;
  start: string;
  end: string;
}

export interface ScheduleEntry {
  id: string;
  date: string;
  start: string;
  end: string;
  label: string;
  maxPatients: number;
}

export interface Holiday {
  date: string;
  title: string;
}

export interface PausePeriod {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  customReason?: string;
}

export type DayOfWeek =
  | "MON"
  | "TUE"
  | "WED"
  | "THU"
  | "FRI"
  | "SAT"
  | "SUN";
export type ConsultationType = "In-Person" | "Telemedicine" | "Both";
export type ExperienceRange = "any" | "0-5 yrs" | "5-10 yrs" | "10-15 yrs" | "15+ yrs";

export interface CreateDoctorPayload {
  fullName: string;
  licenseId: string;
  contactNumber: string;
  email: string;
  specialty?: string;
  clinicName?: string;
  experience?: ExperienceRange;
  consultationFee?: number;
  workingHours?: WorkingHour[];
  scheduleEntries?: ScheduleEntry[];
  holidays?: Holiday[];
  pausePeriods?: PausePeriod[];
  appointmentDuration?: number;
  consultationType?: ConsultationType;
}

export interface DoctorListResponse {
  data: Doctor[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}
