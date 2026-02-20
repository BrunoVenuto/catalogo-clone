import { NextResponse } from "next/server";
import { getAdminStats } from "@/lib/orders";

export async function GET() {
  const stats = await getAdminStats(10, 10);
  return NextResponse.json(stats, { headers: { "Cache-Control": "no-store" } });
}
