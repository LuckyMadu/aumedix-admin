import { z } from "zod";

const SRI_LANKAN_PHONE_REGEX = /^(\+94|0)?[7][0-9]{8}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;

export const DAYS_OF_WEEK = [
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
  "SUN",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export const DAY_LABELS: Record<DayOfWeek, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

export const CONSULTATION_TYPES = ["In-Person", "Telemedicine", "Both"] as const;

const workingHourSchema = z
  .object({
    day: z.enum(DAYS_OF_WEEK),
    start: z.string().regex(TIME_REGEX, "Invalid time format (HH:MM)"),
    end: z.string().regex(TIME_REGEX, "Invalid time format (HH:MM)"),
  })
  .refine((wh) => wh.start < wh.end, {
    message: "End time must be after start time",
    path: ["end"],
  });

export const doctorValidationRules = {
  fullNameSchema: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must not exceed 100 characters")
    .trim(),

  licenseIdSchema: z
    .string()
    .min(1, "License ID is required")
    .regex(
      /^[A-Za-z0-9-]+$/,
      "License ID can only contain letters, numbers, and hyphens"
    )
    .trim(),

  contactNumberSchema: z
    .string()
    .min(1, "Contact number is required")
    .regex(
      SRI_LANKAN_PHONE_REGEX,
      "Please enter a valid Sri Lankan phone number"
    )
    .transform((val) => {
      if (val.startsWith("0")) return `+94${val.slice(1)}`;
      if (!val.startsWith("+94")) return `+94${val}`;
      return val;
    }),

  emailSchema: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .trim()
    .toLowerCase(),

  specialtySchema: z.string().trim().optional().or(z.literal("")),

  clinicNameSchema: z.string().trim().optional().or(z.literal("")),

  yearsOfExperienceSchema: z
    .union([
      z.literal("").transform(() => undefined),
      z.coerce.number().int().min(0, "Must be 0 or more").max(70, "Please enter a valid number"),
    ])
    .optional(),

  appointmentDurationSchema: z
    .union([
      z.literal("").transform(() => undefined),
      z.coerce.number().int().min(5, "Minimum 5 minutes").max(180, "Maximum 180 minutes"),
    ])
    .optional(),

  consultationTypeSchema: z
    .enum(CONSULTATION_TYPES)
    .optional(),

  workingHoursSchema: z.array(workingHourSchema).optional().default([]),
};
