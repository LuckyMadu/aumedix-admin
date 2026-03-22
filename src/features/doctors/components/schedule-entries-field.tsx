"use client";

import { useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScheduleEntry {
  id: string;
  date: string;
  start: string;
  end: string;
  label: string;
  maxPatients: number;
}

interface ScheduleEntriesFieldProps {
  value: ScheduleEntry[];
  onChange: (value: ScheduleEntry[]) => void;
  errors?: Array<{
    date?: string;
    start?: string;
    end?: string;
    label?: string;
    maxPatients?: string;
  }>;
}

function generateId() {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
  const timeStr = now.toISOString().slice(11, 13) + "00";
  return `entry-${dateStr}-${timeStr}`;
}

export function ScheduleEntriesField({
  value,
  onChange,
  errors,
}: ScheduleEntriesFieldProps) {
  const addRow = useCallback(() => {
    onChange([
      ...value,
      {
        id: generateId(),
        date: "",
        start: "08:00",
        end: "12:00",
        label: "",
        maxPatients: 10,
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
    (index: number, patch: Partial<ScheduleEntry>) => {
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
        Schedule Entries
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          (Optional)
        </span>
      </label>

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No schedule entries. Add entries to define specific sessions.
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
                <div className="flex-1 space-y-1">
                  <input
                    type="text"
                    value={row.label}
                    onChange={(e) =>
                      updateRow(index, { label: e.target.value })
                    }
                    placeholder="Session label (e.g. Morning Session)"
                    className={cn(inputClass(rowErrors?.label), "w-full")}
                  />
                  {rowErrors?.label && (
                    <p className="text-xs text-error">{rowErrors.label}</p>
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
                  <input
                    type="date"
                    value={row.date}
                    onChange={(e) =>
                      updateRow(index, { date: e.target.value })
                    }
                    className={inputClass(rowErrors?.date)}
                  />
                  {rowErrors?.date && (
                    <p className="text-xs text-error">{rowErrors.date}</p>
                  )}
                </div>

                <div className="flex items-center gap-1.5">
                  <input
                    type="time"
                    value={row.start}
                    onChange={(e) =>
                      updateRow(index, { start: e.target.value })
                    }
                    className={inputClass(rowErrors?.start)}
                  />
                  <span className="text-xs text-muted-foreground">to</span>
                  <input
                    type="time"
                    value={row.end}
                    onChange={(e) =>
                      updateRow(index, { end: e.target.value })
                    }
                    className={inputClass(rowErrors?.end)}
                  />
                </div>

                <div className="space-y-1">
                  <input
                    type="number"
                    value={row.maxPatients}
                    onChange={(e) =>
                      updateRow(index, {
                        maxPatients: parseInt(e.target.value) || 0,
                      })
                    }
                    placeholder="Max patients"
                    min={1}
                    max={200}
                    className={cn(inputClass(rowErrors?.maxPatients), "w-32")}
                  />
                  {rowErrors?.maxPatients && (
                    <p className="text-xs text-error">
                      {rowErrors.maxPatients}
                    </p>
                  )}
                </div>
              </div>
              {rowErrors?.end && !rowErrors?.start && (
                <p className="text-xs text-error">{rowErrors.end}</p>
              )}
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
        Add Schedule Entry
      </Button>
    </div>
  );
}
