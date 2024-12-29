import { currentRole } from "@/lib/auth";
import { NextResponse } from "next/server";
import { UserRole } from "@/lib/auth";
export async function GET() {
  const role = await currentRole();
  console.log("/api/admin",role);
  if (role && role === UserRole.ADMIN) {
    console.log("Allowed API Route!");
    return new NextResponse(null, { status: 200 });
  }
  return new NextResponse(null, { status: 403 });
}
