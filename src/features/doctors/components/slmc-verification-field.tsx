"use client";

import { useCallback } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SlmcVerificationStatus, SlmcPractitioner } from "../types/slmc";

interface SlmcVerificationFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  status: SlmcVerificationStatus;
  practitioner: SlmcPractitioner | null;
  verificationError: string | null;
  formError?: string;
  onReset: () => void;
  optional?: boolean;
}

export function SlmcVerificationField({
  value,
  onChange,
  onBlur,
  status,
  practitioner,
  verificationError,
  formError,
  onReset,
  optional = true,
}: SlmcVerificationFieldProps) {
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
      if (status !== "idle") {
        onReset();
      }
    },
    [onChange, status, onReset]
  );

  const displayError =
    formError ?? (status === "invalid" ? verificationError : null);

  const statusIcon = (() => {
    if (status === "loading")
      return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
    if (status === "valid")
      return <CheckCircle className="h-4 w-4 text-success" />;
    if (status === "invalid")
      return <XCircle className="h-4 w-4 text-error" />;
    return null;
  })();

  return (
    <div className="space-y-1.5">
      <label
        htmlFor="slmc-reg-no"
        className="block text-sm font-medium text-ink"
      >
        SLMC Registration Number
        {optional && (
          <span className="ml-1 text-xs font-normal text-muted-foreground">
            (Optional)
          </span>
        )}
        <span className="ml-1.5 inline-flex translate-y-[-1px] rounded-full bg-primary-50 px-1.5 py-0.5 text-xxs font-medium text-primary">
          Live Lookup
        </span>
      </label>

      <div className="relative">
        <input
          id="slmc-reg-no"
          type="text"
          inputMode="numeric"
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          placeholder="e.g. 8457 or 28457"
          disabled={status === "loading"}
          aria-invalid={!!displayError}
          aria-describedby={
            displayError
              ? "slmc-error"
              : status === "valid"
                ? "slmc-verified"
                : "slmc-helper"
          }
          className={cn(
            "flex h-control-md w-full rounded-lg border bg-white px-4 pr-10 text-sm text-foreground",
            "placeholder:text-neutral-75",
            "focus:outline-none focus:ring-2 focus:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors duration-150",
            status === "valid"
              ? "border-success focus:ring-success"
              : displayError
                ? "border-error focus:ring-error"
                : "border-border-input hover:border-neutral-75 focus:ring-ring"
          )}
        />

        {statusIcon && (
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            {statusIcon}
          </div>
        )}
      </div>

      {status === "loading" && (
        <p className="flex items-center gap-1.5 text-xs text-primary">
          <Loader2 className="h-3 w-3 animate-spin" />
          Verifying across 6 SLMC categories...
        </p>
      )}

      {displayError && (
        <p id="slmc-error" className="text-xs text-error" role="alert">
          {displayError}
        </p>
      )}

      {status === "valid" && practitioner && (
        <div
          id="slmc-verified"
          className="flex items-center gap-2 rounded-lg bg-success/10 px-3 py-2"
          role="status"
        >
          <CheckCircle className="h-4 w-4 shrink-0 text-success" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-success">
              Verified: {practitioner.fullName}
            </p>
            <p className="text-xs text-success/80">
              Reg #{practitioner.regNo}
              {practitioner.regDate && ` · Registered ${practitioner.regDate}`}
            </p>
            {practitioner.qualifications && (
              <p className="mt-0.5 truncate text-xs text-success/70">
                {practitioner.qualifications}
              </p>
            )}
          </div>
        </div>
      )}

      {status === "idle" && !displayError && (
        <p id="slmc-helper" className="text-xs text-muted-foreground">
          Enter the SLMC number — verification happens automatically
        </p>
      )}
    </div>
  );
}
