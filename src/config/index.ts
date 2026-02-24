export const config = {
  api: {
    baseUrl:
      process.env.NEXT_PUBLIC_API_BASE_URL ??
      "https://dabozga2c0.execute-api.ap-southeast-1.amazonaws.com",
    version: process.env.API_VERSION ?? "/prod/v1",
    timeout: Number(process.env.API_TIMEOUT_MS ?? 30000),
  },
  auth: {
    secret: process.env.NEXTAUTH_SECRET!,
    adminDomain: process.env.ADMIN_EMAIL_DOMAIN ?? "aumedix.com",
  },
} as const;

export const API_ROUTES = {
  DOCTORS: {
    CREATE: `${config.api.version}/doctor`,
    BY_ID: (id: string) => `${config.api.version}/doctor/${id}`,
    LIST: `${config.api.version}/doctor`,
  },
  JOIN_REQUESTS: {
    LIST: `${config.api.version}/admin/doctor/join-requests`,
    BY_ID: (id: string) =>
      `${config.api.version}/admin/doctor/join-requests/${id}`,
    REVIEW: (id: string) =>
      `${config.api.version}/admin/doctor/join-requests/${id}/review`,
  },
} as const;
