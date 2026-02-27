import { z } from "zod";
import { doctorValidationRules, CONSULTATION_TYPES, DAYS_OF_WEEK } from "./rules";

export const createDoctorSchema = z.object({
  fullName: doctorValidationRules.fullNameSchema,
  licenseId: doctorValidationRules.licenseIdSchema,
  contactNumber: doctorValidationRules.contactNumberSchema,
  email: doctorValidationRules.emailSchema,
  specialty: doctorValidationRules.specialtySchema,
  clinicName: doctorValidationRules.clinicNameSchema,
  yearsOfExperience: doctorValidationRules.yearsOfExperienceSchema,
  appointmentDuration: doctorValidationRules.appointmentDurationSchema,
  consultationType: doctorValidationRules.consultationTypeSchema,
  workingHours: doctorValidationRules.workingHoursSchema,
});

export type CreateDoctorFormValues = {
  fullName: string;
  licenseId: string;
  contactNumber: string;
  email: string;
  specialty?: string;
  clinicName?: string;
  yearsOfExperience?: number;
  appointmentDuration?: number;
  consultationType?: (typeof CONSULTATION_TYPES)[number];
  workingHours: Array<{
    day: (typeof DAYS_OF_WEEK)[number];
    start: string;
    end: string;
  }>;
};
