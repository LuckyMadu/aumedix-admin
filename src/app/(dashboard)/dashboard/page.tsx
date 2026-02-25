import Link from "next/link";
import {
  Stethoscope,
  ShieldCheck,
  ShieldAlert,
  Activity,
  Clock,
  ArrowRight,
  Globe,
  Plane,
  Users,
  Star,
  TrendingUp,
  Award,
  Video,
  MapPin,
  Heart,
  Eye,
  Brain,
  Bone,
  SmilePlus,
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

const TOURISM_SPECIALTIES = [
  { name: "cardiology", label: "Cardiology", icon: Heart, demand: "High", growth: "+32%" },
  { name: "dermatology", label: "Dermatology", icon: SmilePlus, demand: "High", growth: "+28%" },
  { name: "orthopedics", label: "Orthopedics", icon: Bone, demand: "Medium", growth: "+18%" },
  { name: "ophthalmology", label: "Ophthalmology", icon: Eye, demand: "Medium", growth: "+15%" },
  { name: "neurology", label: "Neurology", icon: Brain, demand: "Growing", growth: "+22%" },
  { name: "general practitioner", label: "General Practice", icon: Stethoscope, demand: "Steady", growth: "+10%" },
  { name: "general physician", label: "General Physician", icon: Stethoscope, demand: "Steady", growth: "+10%" },
];

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

  const teleReady = doctors.filter(
    (d) =>
      d.consultationType === "Telemedicine" ||
      d.consultationType === "Both"
  ).length;
  const intlReady = doctors.filter(
    (d) =>
      d.verify &&
      d.isActive &&
      (d.consultationType === "Telemedicine" ||
        d.consultationType === "Both")
  ).length;

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

  const matchedTourismSpecialties = TOURISM_SPECIALTIES.filter((ts) =>
    specialtyMap.has(ts.name)
  ).map((ts) => ({
    ...ts,
    doctorCount: specialtyMap.get(ts.name) ?? 0,
  }));

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

      {/* Medical Tourism Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary-dark via-primary-accent to-primary p-6 text-white sm:p-8">
        <div className="absolute top-0 right-0 opacity-10">
          <Globe className="h-48 w-48 -translate-y-8 translate-x-8" />
        </div>
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-xl space-y-3">
            <div className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider text-primary-100">
                Medical Tourism Initiative
              </span>
            </div>
            <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
              Connect Sri Lankan Doctors with International Patients
            </h2>
            <p className="text-sm leading-relaxed text-white/80">
              Sri Lanka is emerging as a top medical tourism destination. 
              With world-class specialists at competitive prices, Aumedix 
              can connect verified doctors with patients worldwide — 
              starting with telemedicine consultations.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <TrendingUp className="h-5 w-5 text-success-light" />
              <div>
                <p className="text-xl font-bold">{verified}</p>
                <p className="text-xs text-white/70">Verified & Trusted</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <Video className="h-5 w-5 text-primary-100" />
              <div>
                <p className="text-xl font-bold">{teleReady}</p>
                <p className="text-xs text-white/70">Telemedicine Ready</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 backdrop-blur-sm">
              <Globe className="h-5 w-5 text-warning-light" />
              <div>
                <p className="text-xl font-bold">{specialties.length}</p>
                <p className="text-xs text-white/70">Specialties Available</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
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

      {/* Medical Tourism Readiness + Market Insights */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* International Patient Readiness */}
        <Card className="border-primary-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>International Patient Readiness</CardTitle>
              </div>
              <Badge variant="info">Medical Tourism</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-5">
            <p className="text-xs text-muted-foreground">
              Doctors who are verified, active, and offer telemedicine
              consultations are ready to serve international patients.
            </p>

            <div className="grid grid-cols-3 gap-3">
              <ReadinessMetric
                value={verified}
                total={total}
                label="Verified"
                color="bg-success"
              />
              <ReadinessMetric
                value={teleReady}
                total={total}
                label="Telemedicine"
                color="bg-primary"
              />
              <ReadinessMetric
                value={intlReady}
                total={total}
                label="Intl. Ready"
                color="bg-info"
              />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Checklist for International Readiness
              </p>
              <ChecklistItem
                checked={verified > 0}
                label="Verified doctors available"
              />
              <ChecklistItem
                checked={teleReady > 0}
                label="Telemedicine consultations enabled"
              />
              <ChecklistItem
                checked={specialties.length >= 3}
                label="3+ specialties covered"
              />
              <ChecklistItem
                checked={intlReady > 0}
                label="Doctors ready for international patients"
              />
            </div>
          </CardContent>
        </Card>

        {/* Tourism Specialty Demand */}
        <Card className="border-primary-100">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                <CardTitle>Tourism Specialty Demand</CardTitle>
              </div>
              <Badge variant="info">Market Insights</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">
              Global medical tourism demand mapped against your registered
              specialties. Based on industry data from the Medical Tourism
              Association.
            </p>

            {matchedTourismSpecialties.length > 0 ? (
              <div className="space-y-3">
                {matchedTourismSpecialties.map((spec) => (
                  <div
                    key={spec.name}
                    className="flex items-center justify-between rounded-lg border border-border p-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-50">
                        <spec.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">
                          {spec.label}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {spec.doctorCount}{" "}
                          {spec.doctorCount === 1 ? "doctor" : "doctors"}{" "}
                          registered
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          spec.demand === "High"
                            ? "success"
                            : spec.demand === "Medium"
                              ? "info"
                              : "default"
                        }
                      >
                        {spec.demand}
                      </Badge>
                      <span className="text-xs font-semibold text-success">
                        {spec.growth}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Register doctors with in-demand specialties to unlock
                  medical tourism potential.
                </p>
              </div>
            )}

            {TOURISM_SPECIALTIES.filter(
              (ts) => !specialtyMap.has(ts.name)
            ).length > 0 && (
              <div className="rounded-lg bg-neutral-25 p-3">
                <p className="text-xs font-medium text-muted-foreground">
                  Opportunity: High-demand specialties not yet covered
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {TOURISM_SPECIALTIES.filter(
                    (ts) => !specialtyMap.has(ts.name)
                  ).map((ts) => (
                    <Badge key={ts.name} variant="outline" className="text-xs">
                      {ts.label}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Why Medical Tourism — Key Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <InsightCard
          icon={<Award className="h-6 w-6 text-primary" />}
          stat="97.2%"
          label="of medical tourists view trust as a significant factor"
          source="Medical Tourism Association"
        />
        <InsightCard
          icon={<ShieldCheck className="h-6 w-6 text-success" />}
          stat="63.3%"
          label="say accreditation influenced their provider choice"
          source="MTA Patient Survey"
        />
        <InsightCard
          icon={<Users className="h-6 w-6 text-info" />}
          stat="$100B+"
          label="global medical tourism market by 2025"
          source="Industry Reports"
        />
      </div>

      {/* Existing sections */}
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
                        {doctor.specialty ? `${doctor.specialty} · ` : ""}
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
                  <div
                    key={name}
                    className="flex items-center justify-between"
                  >
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

function ReadinessMetric({
  value,
  total,
  label,
  color,
}: {
  value: number;
  total: number;
  label: string;
  color: string;
}) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-lg border border-border p-3 text-center">
      <div className="mx-auto mb-2 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
        <div
          className={`h-full rounded-full ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-lg font-bold text-ink">{value}</p>
      <p className="text-xxs text-muted-foreground">{label}</p>
    </div>
  );
}

function ChecklistItem({
  checked,
  label,
}: {
  checked: boolean;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full ${
          checked
            ? "bg-success text-white"
            : "border-2 border-neutral-300 bg-white"
        }`}
      >
        {checked && (
          <svg
            className="h-3 w-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </div>
      <span
        className={`text-sm ${checked ? "text-ink" : "text-muted-foreground"}`}
      >
        {label}
      </span>
    </div>
  );
}

function InsightCard({
  icon,
  stat,
  label,
  source,
}: {
  icon: React.ReactNode;
  stat: string;
  label: string;
  source: string;
}) {
  return (
    <Card className="border-primary-100/50">
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="rounded-full bg-primary-50 p-3">{icon}</div>
        <p className="mt-3 text-2xl font-bold text-ink">{stat}</p>
        <p className="mt-1 text-xs text-muted-foreground">{label}</p>
        <p className="mt-2 text-xxs text-neutral-75">Source: {source}</p>
      </CardContent>
    </Card>
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
