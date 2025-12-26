import React from 'react';
import { RefreshCw} from "lucide-react";
import { SidebarTrigger } from "@/ui/sidebar";
import { useUpdateStatus } from "@/providers/update-provider";
import { __ } from '@/common/lib/i18n'

export default function AdminHeader({ title }) {
    const { hasUpdate } = useUpdateStatus();
    return (
        <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-4 sticky top-0 z-10 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-zinc-100 dark:text-zinc-200" />
                <div className="h-4 w-px bg-zinc-200 mx-2 hidden md:block" />
                <h1 className="text-sm font-medium text-zinc-500 hidden md:block dark:text-zinc-200">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-4">
                {hasUpdate && (
                    <a 
                        href="/admin/system/update" 
                        title={__('Une nouvelle mise à jour est disponible')}
                        className="relative p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-primary animate-in zoom-in"
                    >
                        <RefreshCw className="h-5 w-5 animate-spin-slow" />
                        <span className="absolute top-1.5 right-1.5 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                    </a>
                )}
            </div>
        </header>
    );
}