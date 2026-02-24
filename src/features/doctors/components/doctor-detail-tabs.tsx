"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Phone,
  CreditCard,
  Building,
  Clock,
  Calendar,
  ShieldCheck,
  ShieldX,
  Activity,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Doctor } from "../types";
import { format } from "date-fns";

interface DoctorDetailTabsProps {
  doctor: Doctor;
}

export function DoctorDetailTabs({ doctor }: DoctorDetailTabsProps) {
  return (
    <Tabs defaultValue="overview" className="space-y-4">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="schedule">Schedule</TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow
                icon={<User className="h-4 w-4" />}
                label="Full Name"
                value={doctor.fullName}
              />
              <DetailRow
                icon={<Mail className="h-4 w-4" />}
                label="Email"
                value={doctor.email ?? "Not provided"}
              />
              <DetailRow
                icon={<Phone className="h-4 w-4" />}
                label="Contact"
                value={doctor.contactNumber}
              />
              <DetailRow
                icon={<CreditCard className="h-4 w-4" />}
                label="License ID"
                value={doctor.licenseId}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <DetailRow
                icon={<Building className="h-4 w-4" />}
                label="Specialty"
                value={doctor.specialty ?? "Not specified"}
              />
              <DetailRow
                icon={<Building className="h-4 w-4" />}
                label="Clinic"
                value={doctor.clinicName ?? "Not specified"}
              />
              <DetailRow
                icon={<Clock className="h-4 w-4" />}
                label="Experience"
                value={
                  doctor.yearsOfExperience != null
                    ? `${doctor.yearsOfExperience} years`
                    : "Not specified"
                }
              />
              <DetailRow
                icon={<Calendar className="h-4 w-4" />}
                label="Created"
                value={format(new Date(doctor.createdAt), "MMM dd, yyyy")}
              />
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-3">
                  {doctor.verify ? (
                    <ShieldCheck className="h-5 w-5 text-success" />
                  ) : (
                    <ShieldX className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Verification
                    </p>
                    <Badge variant={doctor.verify ? "success" : "default"}>
                      {doctor.verify ? "Verified" : "Unverified"}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Account</p>
                    <Badge variant={doctor.isActive ? "success" : "error"}>
                      {doctor.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
                {doctor.consultationType && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-info" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Consultation
                      </p>
                      <Badge variant="info">{doctor.consultationType}</Badge>
                    </div>
                  </div>
                )}
                {doctor.appointmentDuration && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-warning" />
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Appointment Duration
                      </p>
                      <p className="text-sm font-medium text-ink">
                        {doctor.appointmentDuration} mins
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="schedule">
        <Card>
          <CardHeader>
            <CardTitle>Working Hours</CardTitle>
          </CardHeader>
          <CardContent>
            {doctor.workingHours?.length ? (
              <div className="space-y-2">
                {doctor.workingHours.map((wh) => (
                  <div
                    key={wh.day}
                    className="flex items-center justify-between rounded-lg bg-neutral-25 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-ink">
                      {wh.day}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {wh.start} - {wh.end}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No working hours configured yet.
              </p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary-50 text-primary">
        {icon}
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-ink">{value}</p>
      </div>
    </div>
  );
}
