"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { doctorService } from "../services/doctor-service";
import { createDoctorSchema } from "../validation/schemas";
import type { CreateDoctorPayload } from "../types";

export type ActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createDoctorAction(
  _prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const rawData = Object.fromEntries(formData.entries());

  const validated = createDoctorSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      errors: validated.error.flatten().fieldErrors as Record<string, string[]>,
    };
  }

  try {
    await doctorService.create(validated.data as CreateDoctorPayload);
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to create doctor. Please try again.",
    };
  }

  revalidatePath("/doctors");
  redirect("/doctors?created=true");
}
