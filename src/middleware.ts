import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';

  if (host.includes('dev.themaplepitch.ca')) {
    const basicAuth = req.headers.get('authorization');

    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      const expectedUser = process.env.DEV_USER || 'admin';
      const expectedPass = process.env.DEV_PASS || 'maplepitch2026!';

      if (user === expectedUser && pwd === expectedPass) {
        return NextResponse.next();
      }
    }

    return new NextResponse('Access Restricted — The Maple Pitch Dev Terminal', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Dev Security Clearance Required"',
      },
    });
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
};
