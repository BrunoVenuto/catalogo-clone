import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(req: Request) {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();

  // Redirect back to login
  const url = new URL("/admin/login", req.url);
  return NextResponse.redirect(url);
}