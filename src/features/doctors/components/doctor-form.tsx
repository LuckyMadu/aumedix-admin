"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/ui/form-field";
import { useToast } from "@/hooks/use-toast";
import {
  createDoctorSchema,
  type CreateDoctorFormValues,
} from "../validation/schemas";

export function DoctorForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateDoctorFormValues>({
    resolver: zodResolver(createDoctorSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: "",
      licenseId: "",
      contactNumber: "",
      email: "",
    },
  });

  const onSubmit = async (data: CreateDoctorFormValues) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/doctors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      <div className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h3 className="mb-6 text-lg font-semibold text-ink">
          Required Information
        </h3>
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            label="Full Name"
            placeholder="e.g. Kamal Amaratunga"
            error={errors.fullName?.message}
            {...register("fullName")}
          />
          <FormField
            label="License ID"
            placeholder="e.g. SLMC-123456"
            error={errors.licenseId?.message}
            helperText="SLMC registration number"
            {...register("licenseId")}
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
