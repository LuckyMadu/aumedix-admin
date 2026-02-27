"use client";

import { useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  DAYS_OF_WEEK,
  DAY_LABELS,
  type DayOfWeek,
} from "../validation/rules";

interface WorkingHour {
  day: DayOfWeek;
  start: string;
  end: string;
}

interface WorkingHoursFieldProps {
  value: WorkingHour[];
  onChange: (value: WorkingHour[]) => void;
  errors?: Array<{ day?: string; start?: string; end?: string }>;
}

function getNextAvailableDay(existing: WorkingHour[]): DayOfWeek {
  const used = new Set(existing.map((wh) => wh.day));
  return DAYS_OF_WEEK.find((d) => !used.has(d)) ?? "MON";
}

export function WorkingHoursField({
  value,
  onChange,
  errors,
}: WorkingHoursFieldProps) {
  const addRow = useCallback(() => {
    if (value.length >= 7) return;
    onChange([
      ...value,
      { day: getNextAvailableDay(value), start: "09:00", end: "17:00" },
    ]);
  }, [value, onChange]);

  const removeRow = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const updateRow = useCallback(
    (index: number, patch: Partial<WorkingHour>) => {
      onChange(value.map((row, i) => (i === index ? { ...row, ...patch } : row)));
    },
    [value, onChange]
  );

  const usedDays = new Set(value.map((wh) => wh.day));

  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-ink">
        Working Hours
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          (Optional)
        </span>
      </label>

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No working hours set. Add days to define the schedule.
        </p>
      )}

      <div className="space-y-2">
        {value.map((row, index) => {
          const rowErrors = errors?.[index];
          return (
            <div key={index} className="flex items-start gap-2">
              <select
                value={row.day}
                onChange={(e) =>
                  updateRow(index, { day: e.target.value as DayOfWeek })
                }
                className={cn(
                  "h-11 w-[130px] shrink-0 rounded-lg border bg-white px-3 text-sm text-foreground",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                  rowErrors?.day
                    ? "border-error"
                    : "border-border-input hover:border-neutral-75"
                )}
              >
                {DAYS_OF_WEEK.map((d) => (
                  <option key={d} value={d} disabled={usedDays.has(d) && d !== row.day}>
                    {DAY_LABELS[d]}
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5">
                <input
                  type="time"
                  value={row.start}
                  onChange={(e) => updateRow(index, { start: e.target.value })}
                  className={cn(
                    "h-11 rounded-lg border bg-white px-3 text-sm text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                    rowErrors?.start
                      ? "border-error"
                      : "border-border-input hover:border-neutral-75"
                  )}
                />
                <span className="text-xs text-muted-foreground">to</span>
                <input
                  type="time"
                  value={row.end}
                  onChange={(e) => updateRow(index, { end: e.target.value })}
                  className={cn(
                    "h-11 rounded-lg border bg-white px-3 text-sm text-foreground",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent",
                    rowErrors?.end
                      ? "border-error"
                      : "border-border-input hover:border-neutral-75"
                  )}
                />
              </div>

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeRow(index)}
                className="mt-0.5 h-10 w-10 shrink-0 text-muted-foreground hover:text-error"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {rowErrors?.end && (
                <p className="self-center text-xs text-error">{rowErrors.end}</p>
              )}
            </div>
          );
        })}
      </div>

      {value.length < 7 && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="mt-1 gap-1.5"
        >
          <Plus className="h-3.5 w-3.5" />
          Add Day
        </Button>
      )}
    </div>
  );
}
