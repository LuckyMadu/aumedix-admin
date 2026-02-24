"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldAlert, ShieldCheck } from "lucide-react";
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

interface VerifyDoctorBannerProps {
  doctorId: string;
  doctorName: string;
}

export function VerifyDoctorBanner({
  doctorId,
  doctorName,
}: VerifyDoctorBannerProps) {
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
      <div className="flex items-center justify-between rounded-xl border border-warning-light bg-warning-light/10 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-warning-light/30">
            <ShieldAlert className="h-5 w-5 text-warning" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">
              This doctor is not verified
            </p>
            <p className="text-xs text-muted-foreground">
              Review the details and verify this doctor to allow them to appear
              in the patient app.
            </p>
          </div>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowDialog(true)}
          className="shrink-0 gap-1.5"
        >
          <ShieldCheck className="h-4 w-4" />
          Verify Doctor
        </Button>
      </div>

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
