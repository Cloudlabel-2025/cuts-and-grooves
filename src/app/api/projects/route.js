import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');
    await dbConnect();
    try {
        if (slug) {
            const project = await Project.findOne({ slug });
            if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
            return NextResponse.json(project);
        }
        const projects = await Project.find({}).sort({ createdAt: -1 });
        return NextResponse.json(projects);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
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
        const project = await Project.create(body);
        return NextResponse.json(project, { status: 201 });
    } catch (error) {
        console.error('Project creation error:', error);
        return NextResponse.json({ error: error.message || 'Failed' }, { status: 400 });
    }
}
