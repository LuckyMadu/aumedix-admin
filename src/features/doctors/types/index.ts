export interface Doctor {
  id: string;
  fullName: string;
  licenseId: string;
  contactNumber: string;
  email?: string;
  specialty?: string;
  clinicName?: string;
  yearsOfExperience?: number;
  workingHours?: WorkingHour[];
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

export type DayOfWeek =
  | "MON"
  | "TUE"
  | "WED"
  | "THU"
  | "FRI"
  | "SAT"
  | "SUN";
export type ConsultationType = "In-Person" | "Telemedicine" | "Both";

export interface CreateDoctorPayload {
  fullName: string;
  licenseId: string;
  contactNumber: string;
  email: string;
  specialty?: string;
  clinicName?: string;
  yearsOfExperience?: number;
  workingHours?: WorkingHour[];
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
