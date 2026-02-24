import { z } from "zod";
import { doctorValidationRules } from "./rules";

export const createDoctorSchema = z.object({
  fullName: doctorValidationRules.fullNameSchema,
  licenseId: doctorValidationRules.licenseIdSchema,
  contactNumber: doctorValidationRules.contactNumberSchema,
  email: doctorValidationRules.emailSchema,
});

export type CreateDoctorFormValues = z.infer<typeof createDoctorSchema>;
