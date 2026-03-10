import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: {
        signIn: '/admin/login',
    },
});

export const config = {
    matcher: [
        '/admin/dashboard/:path*',
        '/admin/pages/:path*',
        '/admin/media/:path*',
        '/admin/content/:path*',
        '/admin/settings/:path*',
    ],
};
