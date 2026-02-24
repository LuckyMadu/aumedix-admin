import Link from "next/link";
import {
  Stethoscope,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Clock,
  ArrowRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { doctorService } from "@/features/doctors/services/doctor-service";
import type { Doctor } from "@/features/doctors/types";
import { format } from "date-fns";

export const metadata = {
  title: "Dashboard | Aumedix Admin",
};

export default async function DashboardPage() {
  let doctors: Doctor[] = [];
  try {
    const data = await doctorService.list();
    doctors = data.data;
  } catch {
    doctors = [];
  }

  const total = doctors.length;
  const verified = doctors.filter((d) => d.verify).length;
  const unverified = total - verified;
  const active = doctors.filter((d) => d.isActive).length;

  const specialtyMap = new Map<string, number>();
  doctors.forEach((d) => {
    if (d.specialty) {
      const key = d.specialty.toLowerCase();
      specialtyMap.set(key, (specialtyMap.get(key) ?? 0) + 1);
    }
  });
  const specialties = Array.from(specialtyMap.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const recentDoctors = [...doctors]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 5);

  const unverifiedDoctors = doctors
    .filter((d) => !d.verify)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  const stats = [
    {
      title: "Total Doctors",
      value: total,
      icon: Stethoscope,
      color: "text-primary",
      bg: "bg-primary-50",
    },
    {
      title: "Verified",
      value: verified,
      icon: ShieldCheck,
      color: "text-success",
      bg: "bg-success-light",
    },
    {
      title: "Pending Verification",
      value: unverified,
      icon: ShieldAlert,
      color: "text-warning",
      bg: "bg-warning-light/20",
    },
    {
      title: "Active",
      value: active,
      icon: Activity,
      color: "text-info",
      bg: "bg-primary-50",
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Welcome to the Aumedix Admin Portal. Here's an overview of your system."
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-ink">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pending Verification */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Pending Verification</CardTitle>
            {unverifiedDoctors.length > 0 && (
              <Badge variant="warning">{unverifiedDoctors.length}</Badge>
            )}
          </CardHeader>
          <CardContent>
            {unverifiedDoctors.length > 0 ? (
              <div className="space-y-3">
                {unverifiedDoctors.slice(0, 4).map((doctor) => (
                  <Link
                    key={doctor.id}
                    href={`/doctors/${doctor.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-neutral-25"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-ink">
                        {doctor.fullName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {doctor.specialty
                          ? `${doctor.specialty} · `
                          : ""}
                        {doctor.licenseId}
                      </p>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
                {unverifiedDoctors.length > 4 && (
                  <Link href="/doctors" className="block">
                    <Button variant="ghost" size="sm" className="w-full">
                      View all {unverifiedDoctors.length} unverified doctors
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-success-light p-3">
                  <ShieldCheck className="h-6 w-6 text-success" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  All doctors are verified.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recently Added */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recently Added</CardTitle>
            <Link href="/doctors">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {recentDoctors.length > 0 ? (
              <div className="space-y-3">
                {recentDoctors.map((doctor) => (
                  <Link
                    key={doctor.id}
                    href={`/doctors/${doctor.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-3 transition-colors hover:bg-neutral-25"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="truncate text-sm font-medium text-ink">
                          {doctor.fullName}
                        </p>
                        {doctor.verify && (
                          <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-success" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {doctor.specialty ?? "No specialty"} ·{" "}
                        {doctor.clinicName ?? "No clinic"}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {format(new Date(doctor.createdAt), "MMM dd")}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="rounded-full bg-neutral-50 p-3">
                  <Clock className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="mt-3 text-sm text-muted-foreground">
                  No doctors added yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Specialties Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Specialties</CardTitle>
          </CardHeader>
          <CardContent>
            {specialties.length > 0 ? (
              <div className="space-y-3">
                {specialties.map(({ name, count }) => (
                  <div key={name} className="flex items-center justify-between">
                    <span className="text-sm capitalize text-ink">{name}</span>
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-primary"
                          style={{
                            width: `${(count / total) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="w-6 text-right text-sm font-medium text-ink">
                        {count}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="py-4 text-center text-sm text-muted-foreground">
                No specialty data available.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <QuickAction
              href="/doctors/new"
              icon={<Stethoscope className="h-5 w-5 text-primary" />}
              title="Add New Doctor"
              description="Register a new doctor in the system"
            />
            <QuickAction
              href="/doctors"
              icon={<ShieldCheck className="h-5 w-5 text-success" />}
              title="Manage Doctors"
              description="View, verify, and manage all registered doctors"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-4 rounded-lg border border-border p-4 transition-colors hover:bg-neutral-25"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-50">
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </Link>
  );
}
