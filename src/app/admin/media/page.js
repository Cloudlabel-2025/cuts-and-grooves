'use client';

import { useState } from 'react';

export default function MediaLibrary() {
    const [uploading, setUploading] = useState(false);

    // In a real app, we'd use the Cloudinary Upload Widget or a signed upload
    // For now, I'll provide a placeholder UI for the Cloudinary integration

    return (
        <div className="space-y-16">
            <div className="flex justify-between items-end pb-8 border-b border-gray-100">
                <div>
                    <h1 className="text-4xl font-extralight tracking-[0.5em] uppercase mb-4">Media</h1>
                    <div className="flex items-center space-x-4">
                        <div className="w-12 h-[1px] bg-[#A67C52]"></div>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-bold">Asset Repository</p>
                    </div>
                </div>
                <button
                    className="px-10 py-5 bg-black text-white text-[11px] font-bold uppercase tracking-[0.5em] rounded-2xl hover:bg-[#A67C52] transition-all duration-500 shadow-xl shadow-black/10"
                >
                    Initialize Upload
                </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-[3rem] p-16 md:p-24 shadow-[0_40px_100px_rgba(0,0,0,0.03)] border-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gray-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-[#A67C52]/5 transition-colors duration-1000"></div>

                <div className="max-w-2xl mx-auto text-center space-y-10 relative z-10">
                    <div className="w-24 h-24 bg-gray-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-gray-100 shadow-inner group-hover:scale-110 transition-transform duration-700">
                        <span className="text-4xl text-[#A67C52] font-extralight">☁</span>
                    </div>
                    <div className="space-y-4">
                        <h3 className="text-xs uppercase tracking-[0.6em] font-bold text-black">Cloud Infrastructure Active</h3>
                        <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-[0.3em] font-medium max-w-lg mx-auto">
                            Your architectural assets are synchronized via Cloudinary. Optimized delivery for 4K renders and high-resolution site photography is enabled.
                        </p>
                    </div>
                    <button className="text-[10px] uppercase tracking-[0.4em] font-bold text-[#A67C52] hover:text-black transition-colors flex items-center justify-center mx-auto group/btn px-8 py-3 rounded-full hover:bg-gray-50">
                        <span>Configure Network Nodes</span>
                        <span className="ml-4 transform group-hover/btn:translate-x-2 transition-transform">→</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {/* Placeholder for uploaded images */}
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(i => (
                    <div key={i} className="aspect-square bg-white border border-gray-100 rounded-[2rem] overflow-hidden group relative cursor-pointer shadow-sm hover:shadow-xl hover:border-[#A67C52]/20 transition-all duration-700 hover:-translate-y-2">
                        <div className="w-full h-full bg-gray-50 flex items-center justify-center relative overflow-hidden">
                            <div className="text-[8px] uppercase tracking-[0.4em] text-gray-200 font-bold transform -rotate-45">Asset {i}</div>
                            <div className="absolute inset-0 bg-[#A67C52]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>

                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col items-center justify-center p-6 space-y-4">
                            <button className="w-full py-3 bg-white text-black rounded-xl text-[9px] uppercase tracking-widest font-bold hover:bg-[#A67C52] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-500">
                                View Data
                            </button>
                            <button className="w-full py-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl text-[9px] uppercase tracking-widest font-bold hover:bg-red-600 hover:border-red-600 transition-all transform translate-y-4 group-hover:translate-y-0 duration-500 delay-75">
                                Purge
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
