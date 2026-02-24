"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
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

interface VerifyDoctorButtonProps {
  doctorId: string;
  doctorName: string;
}

export function VerifyDoctorButton({
  doctorId,
  doctorName,
}: VerifyDoctorButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [showDialog, setShowDialog] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const res = await fetch(`/api/doctors/${doctorId}/verify`, {
        method: "PUT",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message ?? "Failed to verify doctor");
      }

      toast({
        title: "Doctor Verified",
        description: `${doctorName} has been successfully verified.`,
        variant: "success",
      });

      setShowDialog(false);
      router.refresh();
    } catch (error) {
      toast({
        title: "Verification Failed",
        description:
          error instanceof Error
            ? error.message
            : "Unable to verify this doctor. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={(e) => {
          e.stopPropagation();
          setShowDialog(true);
        }}
        className="h-8 gap-1 border-primary/30 text-primary hover:bg-primary-50 hover:text-primary-accent"
        aria-label={`Verify ${doctorName}`}
      >
        <ShieldCheck className="h-3.5 w-3.5" />
        Verify
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <ShieldCheck className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center">Verify Doctor</DialogTitle>
            <DialogDescription className="text-center">
              Are you sure you want to verify{" "}
              <span className="font-medium text-ink">{doctorName}</span>? This
              will allow them to appear in the patient app and accept
              appointments.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleVerify}
              isLoading={isVerifying}
              className="gap-1.5"
            >
              <ShieldCheck className="h-4 w-4" />
              Confirm Verification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
