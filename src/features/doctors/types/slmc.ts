export interface SlmcPractitioner {
  regNo: string;
  regDate: string;
  lastName: string;
  otherNames: string;
  fullName: string;
  qualifications: string;
}

export type SlmcVerificationResult =
  | { valid: true; practitioner: SlmcPractitioner }
  | { valid: false; error: string };

export type SlmcVerificationStatus = "idle" | "loading" | "valid" | "invalid";
