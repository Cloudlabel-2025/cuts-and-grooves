'use client';

import { useSession } from 'next-auth/react';

export default function SettingsPage() {
    const { data: session } = useSession();

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-light tracking-widest uppercase">General Settings</h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#111] p-8 rounded-2xl border border-[#222] space-y-6">
                    <h2 className="text-sm uppercase tracking-widest font-medium text-[#FDEBD0]">Admin Profile</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Email Address</label>
                            <input
                                type="text"
                                disabled
                                className="w-full bg-black border border-[#222] rounded-lg p-3 text-sm text-gray-400 cursor-not-allowed"
                                value={session?.user?.email || ''}
                            />
                            <p className="text-[10px] text-gray-600 mt-2 italic">Contact support to change your primary admin email.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#111] p-8 rounded-2xl border border-[#222] space-y-6">
                    <h2 className="text-sm uppercase tracking-widest font-medium text-[#FDEBD0]">Site Metadata</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">Site Title</label>
                            <input
                                type="text"
                                placeholder="Cuts and Grooves"
                                className="w-full bg-black border border-[#222] rounded-lg p-3 text-sm focus:border-[#FDEBD0] outline-none transition-colors"
                                defaultValue="Cuts and Grooves"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] uppercase tracking-widest text-gray-500 mb-2">SEO Description</label>
                            <textarea
                                className="w-full bg-black border border-[#222] rounded-lg p-3 text-sm h-24 focus:border-[#FDEBD0] outline-none transition-colors"
                                placeholder="Architectural Excellence & Interior Innovation"
                                defaultValue="Architectural Excellence & Interior Innovation"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
