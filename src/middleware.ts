import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authHeader = request.headers.get('authorization');

  if (authHeader) {
    const authValue = authHeader.split(' ')[1];
    if (authValue) {
      const decoded = atob(authValue);
      const [user, pwd] = decoded.split(':');
      
      if (user === 'nuno' && pwd === 'Alvercadoribatejo12!') {
        return NextResponse.next();
      }
    }
  }

  return new NextResponse('Dev Security Clearance Required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Dev Security Clearance Required"',
    },
  });
}

export const config = {
  matcher: ['/:path*'],
};
