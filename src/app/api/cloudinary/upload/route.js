import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const folder = formData.get('folder') || 'projects';

        if (!file || !(file instanceof File)) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        return new Promise((resolve) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder,
                    resource_type: 'auto',
                },
                (error, result) => {
                    if (error) {
                        console.error('Cloudinary upload error:', error);
                        resolve(NextResponse.json({ error: error.message }, { status: 500 }));
                    } else {
                        resolve(NextResponse.json({
                            secure_url: result.secure_url,
                            public_id: result.public_id,
                            asset_id: result.asset_id || result.public_id,
                            format: result.format,
                            resource_type: result.resource_type,
                            created_at: result.created_at,
                        }));
                    }
                }
            );

            uploadStream.end(buffer);
        });
    } catch (error) {
        console.error('Upload route error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
