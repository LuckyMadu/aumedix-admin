import { z } from "zod";
import { doctorValidationRules, CONSULTATION_TYPES, DAYS_OF_WEEK, EXPERIENCE_RANGES } from "./rules";

export const createDoctorSchema = z.object({
  fullName: doctorValidationRules.fullNameSchema,
  licenseId: doctorValidationRules.licenseIdSchema,
  contactNumber: doctorValidationRules.contactNumberSchema,
  email: doctorValidationRules.emailSchema,
  specialty: doctorValidationRules.specialtySchema,
  clinicName: doctorValidationRules.clinicNameSchema,
  experience: doctorValidationRules.experienceSchema,
  consultationFee: doctorValidationRules.consultationFeeSchema,
  appointmentDuration: doctorValidationRules.appointmentDurationSchema,
  consultationType: doctorValidationRules.consultationTypeSchema,
  workingHours: doctorValidationRules.workingHoursSchema,
  scheduleEntries: doctorValidationRules.scheduleEntriesSchema,
  holidays: doctorValidationRules.holidaysSchema,
  pausePeriods: doctorValidationRules.pausePeriodsSchema,
});

export type CreateDoctorFormValues = {
  fullName: string;
  licenseId: string;
  contactNumber: string;
  email: string;
  specialty?: string;
  clinicName?: string;
  experience?: (typeof EXPERIENCE_RANGES)[number];
  consultationFee?: number;
  appointmentDuration?: number;
  consultationType?: (typeof CONSULTATION_TYPES)[number];
  workingHours: Array<{
    day: (typeof DAYS_OF_WEEK)[number];
    start: string;
    end: string;
  }>;
  scheduleEntries: Array<{
    id: string;
    date: string;
    start: string;
    end: string;
    label: string;
    maxPatients: number;
  }>;
  holidays: Array<{
    date: string;
    title: string;
  }>;
  pausePeriods: Array<{
    id: string;
    startDate: string;
    endDate: string;
    reason: string;
    customReason?: string;
  }>;
};
