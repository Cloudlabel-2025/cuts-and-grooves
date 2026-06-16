import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request) {
  try {
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_KEY.includes('<') || process.env.CLOUDINARY_API_SECRET.includes('<')) {
      return NextResponse.json({ 
        error: 'Cloudinary credentials missing or invalid in .env', 
        resources: [] 
      }, { status: 400 });
    }

    const result = await cloudinary.search
      .expression('resource_type:image OR resource_type:video')
      .sort_by('created_at', 'desc')
      .max_results(200)
      .execute();

    // Deduplicate by public_id
    const seen = new Set();
    const unique = result.resources.filter(r => {
      if (seen.has(r.public_id)) return false;
      seen.add(r.public_id);
      return true;
    });

    return NextResponse.json({ resources: unique });
  } catch (error) {
    console.error('Cloudinary fetch error:', error);
    return NextResponse.json({ error: error.message, resources: [] }, { status: 500 });
  }
}

export async function DELETE(request) {
  try {
    if (!process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET || process.env.CLOUDINARY_API_KEY.includes('<')) {
      return NextResponse.json({ error: 'Cloudinary credentials missing' }, { status: 400 });
    }

    const { public_id } = await request.json();
    if (!public_id) {
      return NextResponse.json({ error: 'Missing public_id' }, { status: 400 });
    }

    const result = await cloudinary.uploader.destroy(public_id);
    return NextResponse.json({ result });
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
