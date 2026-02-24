import { UserMenu } from "@/components/layout/user-menu";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-white px-6">
      <div />
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {user.name ?? "Admin"}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {user.role ?? "admin"}
          </p>
        </div>
        <UserMenu user={user} />
      </div>
    </header>
  );
}
