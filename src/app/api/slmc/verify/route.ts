import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

const SLMC_GET_DATA_URL = "https://renewal.slmc.gov.lk/practitioner/getData";

const SLMC_CATEGORIES = [
  "SEC39BMP",
  "SEC39BDP",
  "SEC29",
  "ACT15",
  "SEC41",
  "SEC43",
] as const;

interface SlmcPractitioner {
  reg_no: string;
  reg_date: string;
  last_name: string;
  other_names: string;
  qualifications: string;
}

async function fetchByCategory(
  category: string,
  regNo: string
): Promise<SlmcPractitioner[]> {
  const params = new URLSearchParams({ category, reg_no: regNo });
  try {
    const response = await fetch(`${SLMC_GET_DATA_URL}?${params.toString()}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) return [];
    const data: unknown = await response.json();
    return Array.isArray(data) ? (data as SlmcPractitioner[]) : [];
  } catch {
    return [];
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const regNo = request.nextUrl.searchParams.get("regNo");
  if (!regNo?.trim()) {
    return NextResponse.json(
      { valid: false, error: "Registration number is required" },
      { status: 400 }
    );
  }

  const trimmed = regNo.trim();

  try {
    const results = await Promise.all(
      SLMC_CATEGORIES.map((category) => fetchByCategory(category, trimmed))
    );

    const all = results.flat();
    const exactMatch = all.find((p) => String(p.reg_no).trim() === trimmed);

    if (exactMatch) {
      return NextResponse.json({
        valid: true,
        practitioner: {
          regNo: exactMatch.reg_no,
          regDate: exactMatch.reg_date,
          lastName: exactMatch.last_name,
          otherNames: exactMatch.other_names,
          fullName: [exactMatch.other_names, exactMatch.last_name]
            .filter(Boolean)
            .join(" "),
          qualifications: exactMatch.qualifications
            ?.replace(/<[^>]*>/g, ", ")
            .replace(/,\s*,/g, ",")
            .replace(/^[,\s]+|[,\s]+$/g, ""),
        },
      });
    }

    if (all.length === 0) {
      return NextResponse.json({
        valid: false,
        error: "No SLMC registration found for this number.",
      });
    }

    return NextResponse.json({
      valid: false,
      error:
        "Multiple registrations match. Enter your full SLMC registration number.",
    });
  } catch {
    return NextResponse.json(
      {
        valid: false,
        error: "Unable to verify SLMC registration. Please try again.",
      },
      { status: 502 }
    );
  }
}
