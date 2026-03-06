import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  // Empty matcher so it doesn't run unnecessarily
  matcher: [],
};