import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Content from '@/models/Content';
import Project from '@/models/Project';
import Testimonial from '@/models/Testimonial';

export async function GET() {
    await dbConnect();

    try {
        // Fetch all data that could contain Cloudinary URLs
        const [allContent, allProjects, allTestimonials] = await Promise.all([
            Content.find({}).lean(),
            Project.find({}).lean(),
            Testimonial.find({}).lean(),
        ]);

        // Build a map: cloudinary_url -> [{ location, label }]
        const usageMap = {};

        const trackUrl = (url, location) => {
            if (!url || typeof url !== 'string') return;
            if (!url.includes('cloudinary.com') && !url.includes('res.cloudinary')) return;
            if (!usageMap[url]) usageMap[url] = [];
            usageMap[url].push(location);
        };

        const deepScanForUrls = (obj, location) => {
            if (!obj) return;
            if (typeof obj === 'string') {
                trackUrl(obj, location);
                // Also check for cloudinary URLs embedded in HTML (e.g. <img src="...">)
                const urlRegex = /https?:\/\/res\.cloudinary\.com\/[^\s"'<>]+/g;
                const matches = obj.match(urlRegex);
                if (matches) matches.forEach(u => trackUrl(u, location));
                return;
            }
            if (Array.isArray(obj)) {
                obj.forEach((item, i) => deepScanForUrls(item, location));
                return;
            }
            if (typeof obj === 'object') {
                Object.values(obj).forEach(v => deepScanForUrls(v, location));
            }
        };

        // Scan Content collection
        for (const doc of allContent) {
            const label = `${doc.page}/${doc.section} → ${doc.key}`;
            deepScanForUrls(doc.value, label);
        }

        // Scan Projects collection
        for (const proj of allProjects) {
            trackUrl(proj.mainImage, `Project: ${proj.title} → Main Image`);
            if (proj.gallery && Array.isArray(proj.gallery)) {
                proj.gallery.forEach((item, i) => {
                    trackUrl(item.url, `Project: ${proj.title} → Gallery #${i + 1}`);
                });
            }
        }

        // Scan Testimonials collection
        for (const t of allTestimonials) {
            trackUrl(t.image, `Testimonial: ${t.author}`);
        }

        return NextResponse.json({ usageMap });
    } catch (error) {
        console.error('Asset usage scan error:', error);
        return NextResponse.json({ error: error.message, usageMap: {} }, { status: 500 });
    }
}
