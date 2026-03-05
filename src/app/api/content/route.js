import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get('page');
    const section = searchParams.get('section');

    await dbConnect();
    try {
        const query = {};
        if (page) query.page = page;
        if (section) query.section = section;

        const content = await Content.find(query);
        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    try {
        const body = await req.json();
        const { page, section, key, value } = body;

        const content = await Content.findOneAndUpdate(
            { page, section, key },
            { value },
            { upsert: true, returnDocument: 'after' }
        );

        return NextResponse.json(content);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update content' }, { status: 400 });
    }
}
