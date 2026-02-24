import { notFound } from "next/navigation";
import { doctorService } from "@/features/doctors/services/doctor-service";
import { DoctorDetailTabs } from "@/features/doctors/components/doctor-detail-tabs";
import { VerifyDoctorBanner } from "@/features/doctors/components/verify-doctor-banner";
import { PageHeader } from "@/components/shared/page-header";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck } from "lucide-react";

interface DoctorDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DoctorDetailPage({
  params,
}: DoctorDetailPageProps) {
  const { id } = await params;

  let doctor;
  try {
    doctor = await doctorService.getById(id);
  } catch {
    notFound();
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={doctor.fullName}
        description={doctor.email ?? doctor.contactNumber}
        backHref="/doctors"
      >
        <div className="flex items-center gap-2">
          {doctor.verify && (
            <Badge variant="success" className="gap-1">
              <ShieldCheck className="h-3 w-3" />
              Verified
            </Badge>
          )}
          <Badge variant={doctor.isActive ? "success" : "error"}>
            {doctor.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </PageHeader>

      {!doctor.verify && (
        <VerifyDoctorBanner
          doctorId={doctor.id}
          doctorName={doctor.fullName}
        />
      )}

      <DoctorDetailTabs doctor={doctor} />
    </div>
  );
}
