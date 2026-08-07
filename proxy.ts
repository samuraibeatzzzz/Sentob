import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

const ADMIN_ROLES = ["admin", "manager"];

/**
 * Guards every /admin route. The role check happens here, not just on
 * individual pages, so an authenticated-but-unauthorized session is
 * always resolved in ONE hop (sign out + redirect) instead of bouncing
 * between /admin and /admin/login:
 *
 *   - No session + protected route  -> redirect to /admin/login
 *   - Session + /admin/login        -> authorized: redirect to /admin
 *                                      unauthorized: sign out, stay put
 *   - Session + protected route     -> authorized: continue
 *                                      unauthorized: sign out, redirect
 *                                      to /admin/login (now session-less,
 *                                      so the next request just renders
 *                                      the login page — no loop possible)
 */
export async function proxy(request: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase isn't configured yet — let the request through rather than
  // crashing on every /admin request (which is what produces a blank
  // white screen with no explanation). The page itself will render a
  // clear "not configured" state.
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.next();
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  let user;
  try {
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();
    user = sessionUser;
  } catch {
    // Supabase unreachable — don't trap the visitor behind a redirect
    // loop; let them see the page (which will surface its own error).
    return response;
  }

  const { pathname } = request.nextUrl;
  const isLoginRoute = pathname === "/admin/login";

  if (!user) {
    if (isLoginRoute) return response;
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // We have a session — resolve its role right here, once.
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .maybeSingle();

  const isAuthorized = !!profile && ADMIN_ROLES.includes(profile.role);

  if (isLoginRoute) {
    if (isAuthorized) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    // A stale or non-admin session sitting on the login page: clear it
    // so the login form is actually usable instead of perpetually
    // bouncing the visitor away.
    await supabase.auth.signOut();
    return response;
  }

  if (!isAuthorized) {
    await supabase.auth.signOut();
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("error", "forbidden");
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"],
};
