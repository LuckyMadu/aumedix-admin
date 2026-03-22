"use client";

import { useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PAUSE_REASONS } from "../validation/rules";

interface PausePeriod {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
  customReason?: string;
}

interface PausePeriodsFieldProps {
  value: PausePeriod[];
  onChange: (value: PausePeriod[]) => void;
  errors?: Array<{
    startDate?: string;
    endDate?: string;
    reason?: string;
    customReason?: string;
  }>;
}

function generateId() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  return `pause-${dateStr}`;
}

export function PausePeriodsField({
  value,
  onChange,
  errors,
}: PausePeriodsFieldProps) {
  const addRow = useCallback(() => {
    onChange([
      ...value,
      {
        id: generateId(),
        startDate: "",
        endDate: "",
        reason: "",
        customReason: "",
      },
    ]);
  }, [value, onChange]);

  const removeRow = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const updateRow = useCallback(
    (index: number, patch: Partial<PausePeriod>) => {
      onChange(
        value.map((row, i) => (i === index ? { ...row, ...patch } : row))
      );
    },
    [value, onChange]
  );

  const inputClass = (hasError?: string) =>
    cn(
      "h-11 rounded-lg border bg-white px-3 text-sm text-foreground",
      "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
      hasError
        ? "border-error"
        : "border-border-input hover:border-neutral-75"
    );

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink">
        Pause Periods
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          (Optional)
        </span>
      </label>

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No pause periods. Add periods when the doctor will be unavailable.
        </p>
      )}

      <div className="space-y-3">
        {value.map((row, index) => {
          const rowErrors = errors?.[index];
          return (
            <div
              key={row.id}
              className="rounded-lg border border-border bg-neutral-25 p-3 space-y-2"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <select
                    value={row.reason}
                    onChange={(e) =>
                      updateRow(index, { reason: e.target.value })
                    }
                    className={cn(inputClass(rowErrors?.reason), "w-full")}
                  >
                    <option value="">Select reason</option>
                    {PAUSE_REASONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                  {rowErrors?.reason && (
                    <p className="text-xs text-error mt-1">
                      {rowErrors.reason}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                  className="h-10 w-10 shrink-0 text-muted-foreground hover:text-error"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex flex-wrap items-start gap-2">
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={row.startDate}
                    onChange={(e) =>
                      updateRow(index, { startDate: e.target.value })
                    }
                    className={inputClass(rowErrors?.startDate)}
                  />
                  {rowErrors?.startDate && (
                    <p className="text-xs text-error">
                      {rowErrors.startDate}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-muted-foreground">
                    End Date
                  </label>
                  <input
                    type="date"
                    value={row.endDate}
                    onChange={(e) =>
                      updateRow(index, { endDate: e.target.value })
                    }
                    className={inputClass(rowErrors?.endDate)}
                  />
                  {rowErrors?.endDate && (
                    <p className="text-xs text-error">{rowErrors.endDate}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <input
                  type="text"
                  value={row.customReason ?? ""}
                  onChange={(e) =>
                    updateRow(index, { customReason: e.target.value })
                  }
                  placeholder="Additional details (optional)"
                  className={cn(
                    inputClass(rowErrors?.customReason),
                    "w-full"
                  )}
                />
                {rowErrors?.customReason && (
                  <p className="text-xs text-error">
                    {rowErrors.customReason}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={addRow}
        className="mt-1 gap-1.5"
      >
        <Plus className="h-3.5 w-3.5" />
        Add Pause Period
      </Button>
    </div>
  );
}
