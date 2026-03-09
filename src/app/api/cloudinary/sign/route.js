import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const { params_to_sign } = await req.json();

        // Ensure params are sorted alphabetically as required by Cloudinary
        const sortedParams = Object.keys(params_to_sign)
            .sort()
            .map(key => `${key}=${params_to_sign[key]}`)
            .join('&');

        const apiSecret = process.env.CLOUDINARY_API_SECRET;
        const signature = crypto
            .createHash('sha256')
            .update(sortedParams + apiSecret)
            .digest('hex');

        return NextResponse.json({ signature });
    } catch (error) {
        console.error('Signing error:', error);
        return NextResponse.json({ error: 'Failed to sign request' }, { status: 500 });
    }
}
