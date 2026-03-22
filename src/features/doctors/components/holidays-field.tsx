"use client";

import { useCallback } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Holiday {
  date: string;
  title: string;
}

interface HolidaysFieldProps {
  value: Holiday[];
  onChange: (value: Holiday[]) => void;
  errors?: Array<{ date?: string; title?: string }>;
}

export function HolidaysField({
  value,
  onChange,
  errors,
}: HolidaysFieldProps) {
  const addRow = useCallback(() => {
    onChange([...value, { date: "", title: "" }]);
  }, [value, onChange]);

  const removeRow = useCallback(
    (index: number) => {
      onChange(value.filter((_, i) => i !== index));
    },
    [value, onChange]
  );

  const updateRow = useCallback(
    (index: number, patch: Partial<Holiday>) => {
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
        Holidays
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          (Optional)
        </span>
      </label>

      {value.length === 0 && (
        <p className="text-xs text-muted-foreground">
          No holidays defined. Add holidays when the doctor is unavailable.
        </p>
      )}

      <div className="space-y-2">
        {value.map((row, index) => {
          const rowErrors = errors?.[index];
          return (
            <div key={index} className="flex items-start gap-2">
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

              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  value={row.title}
                  onChange={(e) =>
                    updateRow(index, { title: e.target.value })
                  }
                  placeholder="e.g. Poya Day"
                  className={cn(inputClass(rowErrors?.title), "w-full")}
                />
                {rowErrors?.title && (
                  <p className="text-xs text-error">{rowErrors.title}</p>
                )}
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
        Add Holiday
      </Button>
    </div>
  );
}
