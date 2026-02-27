"use client";

import { useForm, Controller } from "react-hook-form";
import type { Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlmcVerificationField } from "./slmc-verification-field";
import { WorkingHoursField } from "./working-hours-field";
import { useSlmcVerification } from "../hooks/use-slmc-verification";
import { useToast } from "@/hooks/use-toast";
import { CONSULTATION_TYPES } from "../validation/rules";
import {
  createDoctorSchema,
  type CreateDoctorFormValues,
} from "../validation/schemas";

export function DoctorForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const slmc = useSlmcVerification();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDoctorFormValues>({
    resolver: zodResolver(createDoctorSchema) as Resolver<CreateDoctorFormValues>,
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      licenseId: "",
      contactNumber: "",
      email: "",
      specialty: "",
      clinicName: "",
      yearsOfExperience: undefined,
      appointmentDuration: undefined,
      consultationType: undefined,
      workingHours: [],
    },
  });

  const onSubmit = async (data: CreateDoctorFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          workingHours: data.workingHours?.length ? data.workingHours : undefined,
          slmcVerified: slmc.status === "valid",
          slmcPractitionerName: slmc.practitioner?.fullName,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message ?? "Failed to create doctor");
      }

      toast({
        title: "Doctor Created",
        description: `${data.fullName} has been successfully registered.`,
        variant: "success",
      });

      router.push("/doctors");
      router.refresh();
    } catch (error) {
      toast({
        title: "Creation Failed",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Required Fields */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h3 className="mb-1 text-lg font-semibold text-ink">
          Doctor Information
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          Fill in the doctor&apos;s details. The SLMC number is verified
          automatically against the Sri Lanka Medical Council registry.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            label="Full Name"
            placeholder="e.g. Kamal Amaratunga"
            error={errors.fullName?.message}
            {...register("fullName")}
          />

          <Controller
            control={control}
            name="licenseId"
            render={({ field }) => (
              <SlmcVerificationField
                value={field.value}
                onChange={(val) => {
                  field.onChange(val);
                  slmc.setInputValue(val);
                }}
                onBlur={field.onBlur}
                status={slmc.status}
                practitioner={slmc.practitioner}
                verificationError={slmc.error}
                formError={errors.licenseId?.message}
                onReset={slmc.reset}
                optional={false}
              />
            )}
          />

          <FormField
            label="Contact Number"
            type="tel"
            placeholder="+94712345678"
            error={errors.contactNumber?.message}
            helperText="Sri Lankan mobile number"
            {...register("contactNumber")}
          />
          <FormField
            label="Email"
            type="email"
            placeholder="doctor@example.com"
            error={errors.email?.message}
            {...register("email")}
          />
        </div>
      </div>

      {/* Optional Fields */}
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h3 className="mb-1 text-lg font-semibold text-ink">
          Additional Details
        </h3>
        <p className="mb-6 text-sm text-muted-foreground">
          These fields are optional and can be updated later.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            label="Specialty"
            placeholder="e.g. Cardiology"
            error={errors.specialty?.message}
            optional
            {...register("specialty")}
          />
          <FormField
            label="Clinic Name"
            placeholder="e.g. Medix General Hospital"
            error={errors.clinicName?.message}
            optional
            {...register("clinicName")}
          />
          <FormField
            label="Years of Experience"
            type="number"
            placeholder="e.g. 12"
            min={0}
            max={70}
            error={errors.yearsOfExperience?.message}
            optional
            {...register("yearsOfExperience")}
          />
          <FormField
            label="Appointment Duration"
            type="number"
            placeholder="e.g. 30"
            min={5}
            max={180}
            error={errors.appointmentDuration?.message}
            helperText="Duration in minutes"
            optional
            {...register("appointmentDuration")}
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">
              Consultation Type
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (Optional)
              </span>
            </label>
            <Controller
              control={control}
              name="consultationType"
              render={({ field }) => (
                <Select
                  value={field.value ?? ""}
                  onValueChange={(val) =>
                    field.onChange(val === "" ? undefined : val)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONSULTATION_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.consultationType?.message && (
              <p className="text-xs text-error" role="alert">
                {errors.consultationType.message}
              </p>
            )}
          </div>
        </div>

        <div className="mt-6 border-t border-border pt-6">
          <Controller
            control={control}
            name="workingHours"
            render={({ field }) => (
              <WorkingHoursField
                value={field.value ?? []}
                onChange={field.onChange}
                errors={
                  errors.workingHours as Array<{
                    day?: string;
                    start?: string;
                    end?: string;
                  }> | undefined
                }
              />
            )}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Create Doctor
        </Button>
      </div>
    </form>
  );
}
