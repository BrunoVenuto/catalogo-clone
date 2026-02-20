import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

// Protege rotas /admin (exceto /admin/login)
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Permite a página de login
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Só aplica proteção nas rotas /admin
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

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
          for (const { name, value, options } of cookiesToSet) {
            res.cookies.set(name, value, options);
          }
        },
      },
    }
  );

  // Se não tiver sessão, manda pro login
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return res;
}

// Só roda middleware no /admin (e subrotas)
export const config = {
  matcher: ["/admin/:path*"],
};