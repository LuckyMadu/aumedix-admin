"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import { ArrowUpDown, Eye, ShieldCheck, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/shared/search-input";
import { VerifyDoctorButton } from "./verify-doctor-button";
import type { Doctor } from "../types";

type FilterMode = "verified" | "all";

interface DoctorTableProps {
  doctors: Doctor[];
}

export function DoctorTable({ doctors }: DoctorTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterMode, setFilterMode] = useState<FilterMode>("verified");

  const columns: ColumnDef<Doctor>[] = useMemo(
    () => [
      {
        accessorKey: "fullName",
        header: ({ column }) => (
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              column.toggleSorting(column.getIsSorted() === "asc")
            }
            className="-ml-3"
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-ink">
              {row.getValue("fullName")}
            </p>
            <p className="text-xs text-muted-foreground">
              {row.original.email ?? "—"}
            </p>
          </div>
        ),
      },
      {
        accessorKey: "specialty",
        header: "Specialty",
        cell: ({ row }) => {
          const specialty = row.getValue("specialty") as string | undefined;
          return specialty ? (
            <span className="capitalize">{specialty}</span>
          ) : (
            "—"
          );
        },
      },
      {
        accessorKey: "clinicName",
        header: "Clinic",
        cell: ({ row }) => (row.getValue("clinicName") as string) || "—",
      },
      {
        accessorKey: "contactNumber",
        header: "Contact",
      },
      {
        accessorKey: "verify",
        header: "Verified",
        cell: ({ row }) => {
          const verified = row.getValue("verify") as boolean;
          return verified ? (
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </Badge>
          ) : (
            <Badge variant="default" className="gap-1">
              <ShieldX className="h-3 w-3" />
              Unverified
            </Badge>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Status",
        cell: ({ row }) => {
          const active = row.getValue("isActive") as boolean;
          return (
            <Badge variant={active ? "success" : "error"}>
              {active ? "Active" : "Inactive"}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            {!row.original.verify && (
              <VerifyDoctorButton
                doctorId={row.original.id}
                doctorName={row.original.fullName}
              />
            )}
            <Link href={`/doctors/${row.original.id}`}>
              <Button variant="ghost" size="icon" aria-label="View doctor">
                <Eye className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ),
      },
    ],
    []
  );

  const filteredDoctors = useMemo(() => {
    if (filterMode === "verified") {
      return doctors.filter((d) => d.verify);
    }
    return doctors;
  }, [doctors, filterMode]);

  const table = useReactTable({
    data: filteredDoctors,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    state: { sorting, globalFilter },
  });

  const verifiedCount = doctors.filter((d) => d.verify).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          placeholder="Search doctors by name, email, or specialty..."
          value={globalFilter}
          onChange={setGlobalFilter}
          className="sm:max-w-sm"
        />

        <div className="inline-flex rounded-lg border border-border-input bg-white p-1">
          <button
            onClick={() => setFilterMode("verified")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filterMode === "verified"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-ink"
            }`}
          >
            Verified ({verifiedCount})
          </button>
          <button
            onClick={() => setFilterMode("all")}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              filterMode === "all"
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-ink"
            }`}
          >
            All ({doctors.length})
          </button>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-white overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-border bg-neutral-25">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-neutral-25"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-muted-foreground"
                >
                  {filterMode === "verified"
                    ? "No verified doctors found."
                    : "No doctors found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {table.getRowModel().rows.length} of{" "}
          {filteredDoctors.length} doctors
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
