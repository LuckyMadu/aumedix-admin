"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface DeleteDoctorButtonProps {
  doctorId: string;
  doctorName: string;
  /** "icon" renders a ghost icon button (for tables), "button" renders a full destructive button (for detail pages) */
  variant?: "icon" | "button";
  redirectOnSuccess?: boolean;
}

export function DeleteDoctorButton({
  doctorId,
  doctorName,
  variant = "icon",
  redirectOnSuccess = false,
}: DeleteDoctorButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/doctors/${doctorId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Failed to delete doctor");
      }

      toast({
        title: "Doctor Deleted",
        description: `${doctorName} has been permanently removed.`,
        variant: "success",
      });

      setShowDialog(false);

      if (redirectOnSuccess) {
        router.push("/doctors");
      } else {
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to delete this doctor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {variant === "icon" ? (
        <Button
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowDialog(true);
          }}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          aria-label={`Delete ${doctorName}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="destructive"
          size="sm"
          onClick={() => setShowDialog(true)}
          className="gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          Delete Doctor
        </Button>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">Delete Doctor</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to delete{" "}
              <span className="font-medium text-ink">{doctorName}</span>? This
              action is permanent and cannot be undone. All associated data
              including appointments and records will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              isLoading={isDeleting}
              className="gap-1.5"
            >
              <Trash2 className="h-4 w-4" />
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
