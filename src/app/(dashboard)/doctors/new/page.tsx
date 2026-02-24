import { PageHeader } from "@/components/shared/page-header";
import { DoctorForm } from "@/features/doctors/components/doctor-form";

export const metadata = {
  title: "Create Doctor | Medix Admin",
};

export default function CreateDoctorPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <PageHeader
        title="Create Doctor"
        description="Register a new doctor in the system. Fill in the required details below."
        backHref="/doctors"
      />
      <DoctorForm />
    </div>
  );
}
