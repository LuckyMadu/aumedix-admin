"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserMenuProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export function UserMenu({ user }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "AD";

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center rounded-full focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Avatar>
          <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
      </button>

      {open && (
        <div className="absolute top-full right-0 z-50 mt-2 w-48 rounded-lg border border-border bg-white py-1 shadow-lg animate-fade-in">
          <div className="border-b border-border px-4 py-2">
            <p className="text-sm font-medium text-ink">{user.name}</p>
            <p className="truncate text-xs text-muted-foreground">
              {user.email}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:bg-neutral-25 hover:text-ink transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
