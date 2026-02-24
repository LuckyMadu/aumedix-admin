import { Badge, type BadgeProps } from "@/components/ui/badge";

type StatusType = "active" | "inactive" | "pending" | "suspended" | "approved" | "rejected";

const statusVariantMap: Record<StatusType, BadgeProps["variant"]> = {
  active: "success",
  approved: "success",
  pending: "warning",
  inactive: "default",
  suspended: "error",
  rejected: "error",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const variant = statusVariantMap[status as StatusType] ?? "default";
  return (
    <Badge variant={variant} className={className}>
      {status}
    </Badge>
  );
}
