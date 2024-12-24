import { currentRole } from "@/lib/auth";
import { NextResponse } from "next/server";
import { UserRole } from "@/lib/auth";
export async function GET() {
  const role = await currentRole();

  if (role && role === UserRole.ADMIN.toString()) {
    return new NextResponse(null, { status: 200 });
  }
  return new NextResponse(null, { status: 403 });
}
