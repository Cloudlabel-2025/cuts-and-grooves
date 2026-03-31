import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    // Add current pathname to headers for layout
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-pathname', pathname);

    // --- Admin auth protection ---
    if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
        if (!token) {
            const loginUrl = new URL('/admin/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // --- Skip restriction for these paths ---
    if (
        pathname.startsWith('/admin') ||
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname === '/coming-soon' ||
        pathname === '/favicon.ico' ||
        pathname.endsWith('.png') ||
        pathname.endsWith('.jpg') ||
        pathname.endsWith('.svg') ||
        pathname.endsWith('.ico')
    ) {
        return NextResponse.next({ request: { headers: requestHeaders } });
    }

    // --- Coming Soon restriction for ALL public routes ---
    const hasAccessCookie = request.cookies.get('studio_access')?.value === 'true';
    const hasSecretParam = request.nextUrl.searchParams.get('access') === 'cg-2026';

    // If secret param is present, set cookie and let user through
    if (hasSecretParam) {
        const response = NextResponse.next({ request: { headers: requestHeaders } });
        response.cookies.set('studio_access', 'true', {
            path: '/',
            maxAge: 60 * 60 * 24 * 365, // 1 year
            sameSite: 'lax',
        });
        return response;
    }

    // If NO cookie and NO secret param → redirect to /coming-soon
    if (!hasAccessCookie) {
        const comingSoonUrl = new URL('/coming-soon', request.url);
        return NextResponse.redirect(comingSoonUrl);
    }

    // User has access → proceed normally
    return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
    matcher: ['/((?!_next/static|_next/image).*)'],
};
