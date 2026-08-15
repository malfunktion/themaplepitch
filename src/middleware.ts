import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const devUser = process.env.DEV_USER;
  const devPass = process.env.DEV_PASS;

  // Skip Basic Auth entirely if secrets aren't set (e.g. production)
  if (!devUser || !devPass) {
    return NextResponse.next();
  }

  // Basic Auth logic for dev/staging
  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    if (user === devUser && pwd === devPass) {
      return NextResponse.next();
    }
  }

  return new NextResponse("Auth required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public assets (.png, .svg, .jpg, etc.)
     *
     * `/api/*` is intentionally included: this deployment (dev.themaplepitch.ca,
     * see wrangler.toml) is a password-gated staging environment when
     * DEV_USER/DEV_PASS are set, and the API routes serve the same data the
     * pages render. Excluding them would let anyone read that data directly
     * (e.g. /api/players) without ever seeing the Basic Auth prompt, which
     * defeats the point of gating the pages. Same-origin fetches from the
     * client (e.g. src/app/search/page.tsx) are unaffected — once the
     * browser has authenticated once, it attaches the cached credentials to
     * later same-origin requests automatically. Production is unaffected
     * either way, since the function above passes every request through
     * unchecked when DEV_USER/DEV_PASS aren't set.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
