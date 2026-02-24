import { Suspense } from "react";
import Link from "next/link";
import { Plus, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { DoctorTable } from "@/features/doctors/components/doctor-table";
import { DoctorTableSkeleton } from "@/features/doctors/components/doctor-table-skeleton";
import { doctorService } from "@/features/doctors/services/doctor-service";

export const metadata = {
  title: "Doctors | Medix Admin",
};

export default function DoctorsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Doctors"
        description="Manage registered doctors in the system."
      >
        <Link href="/doctors/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Doctor
          </Button>
        </Link>
      </PageHeader>

      <Suspense fallback={<DoctorTableSkeleton />}>
        <DoctorList />
      </Suspense>
    </div>
  );
}

async function DoctorList() {
  let doctors: import("@/features/doctors/types").Doctor[] = [];
  try {
    const data = await doctorService.list();
    doctors = data.data;
  } catch {
    doctors = [];
  }

  if (!doctors.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-border bg-white py-16 text-center">
        <div className="rounded-full bg-primary-50 p-4">
          <Stethoscope className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-ink">No Doctors Yet</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Get started by adding your first doctor.
        </p>
        <Link href="/doctors/new" className="mt-4">
          <Button variant="primary" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Doctor
          </Button>
        </Link>
      </div>
    );
  }

  return <DoctorTable doctors={doctors} />;
}
