import { LoginForm } from "@/features/auth/components/login-form";

export const metadata = {
  title: "Sign In | Medix Admin",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-25">
      <div className="w-full max-w-md space-y-8 rounded-xl bg-white p-8 shadow-md">
        <div className="text-center">
          <div className="mb-4 flex items-center justify-center gap-2">
            <span className="text-3xl font-bold text-primary-dark">Aumedix</span>
            <span className="rounded-sm bg-primary px-2 py-0.5 text-xs font-semibold text-white">
              ADMIN
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Sign in to your admin account
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
}
