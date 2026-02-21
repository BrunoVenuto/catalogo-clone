import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // deixa o login passar
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // só protege /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // resposta inicial
  let res = NextResponse.next({ request: { headers: req.headers } });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          // ✅ atualizar a resposta quando o supabase precisar setar cookies (refresh token etc.)
          res = NextResponse.next({ request: { headers: req.headers } });

          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  // pega o usuário (e refresca a sessão se necessário)
  const { data } = await supabase.auth.getUser();

  let isAdmin = false;
  if (data?.user) {
    const { data: adminData } = await supabase
      .from("admin_users")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();
      
    isAdmin = !!adminData;
  }

  if (!isAdmin) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return res;
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};