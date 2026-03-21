import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { config, API_ROUTES } from "@/config";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const response = await fetch(
      `${config.api.baseUrl}${API_ROUTES.DOCTORS.BY_ID(id)}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.accessToken}`,
        },
      }
    );

    if (response.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { message: data?.message ?? "Failed to delete doctor" },
        { status: response.status }
      );
    }

    return NextResponse.json(data ?? { success: true });
  } catch {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
