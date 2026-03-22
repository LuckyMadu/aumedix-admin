import { z } from "zod";

const SRI_LANKAN_PHONE_REGEX = /^(\+94|0)?[7][0-9]{8}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$/;
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

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
export const EXPERIENCE_RANGES = ["any", "0-5 yrs", "5-10 yrs", "10-15 yrs", "15+ yrs"] as const;
export const PAUSE_REASONS = ["Vacation", "Sick Leave", "Training", "Personal", "Other"] as const;

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

const scheduleEntrySchema = z
  .object({
    id: z.string().min(1),
    date: z.string().regex(DATE_REGEX, "Invalid date format (YYYY-MM-DD)"),
    start: z.string().regex(TIME_REGEX, "Invalid time format (HH:MM)"),
    end: z.string().regex(TIME_REGEX, "Invalid time format (HH:MM)"),
    label: z.string().min(1, "Label is required").max(100),
    maxPatients: z.coerce.number().int().min(1, "At least 1 patient").max(200, "Maximum 200 patients"),
  })
  .refine((entry) => entry.start < entry.end, {
    message: "End time must be after start time",
    path: ["end"],
  });

const holidaySchema = z.object({
  date: z.string().regex(DATE_REGEX, "Invalid date format (YYYY-MM-DD)"),
  title: z.string().min(1, "Title is required").max(100),
});

const pausePeriodSchema = z
  .object({
    id: z.string().min(1),
    startDate: z.string().regex(DATE_REGEX, "Invalid date format (YYYY-MM-DD)"),
    endDate: z.string().regex(DATE_REGEX, "Invalid date format (YYYY-MM-DD)"),
    reason: z.string().min(1, "Reason is required"),
    customReason: z.string().max(200).optional().or(z.literal("")),
  })
  .refine((p) => p.startDate <= p.endDate, {
    message: "End date must be on or after start date",
    path: ["endDate"],
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

  experienceSchema: z
    .enum(EXPERIENCE_RANGES)
    .optional(),

  consultationFeeSchema: z
    .union([
      z.literal("").transform(() => undefined),
      z.coerce.number().min(0, "Must be 0 or more").max(100000, "Please enter a valid amount"),
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

  scheduleEntriesSchema: z.array(scheduleEntrySchema).optional().default([]),

  holidaysSchema: z.array(holidaySchema).optional().default([]),

  pausePeriodsSchema: z.array(pausePeriodSchema).optional().default([]),
};
