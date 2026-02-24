export const ERROR_MESSAGES: Record<string, string> = {
  UNAUTHORIZED: "Your session has expired. Please sign in again.",
  FORBIDDEN: "You don't have permission to perform this action.",
  NOT_FOUND: "The requested resource was not found.",
  CONFLICT: "This record already exists.",
  VALIDATION_ERROR: "Please check the form and fix the errors.",
  RATE_LIMITED: "Too many requests. Please wait and try again.",
  SERVER_ERROR: "Something went wrong on our end. Please try again later.",
};

export function getErrorMessage(code: string): string {
  return (
    ERROR_MESSAGES[code] ?? "An unexpected error occurred. Please try again."
  );
}
