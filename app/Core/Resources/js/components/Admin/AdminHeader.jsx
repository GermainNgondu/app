import React from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function AdminHeader({ title }) {
    return (
        <header className="h-16 border-b border-zinc-200 bg-white flex items-center justify-between px-4 sticky top-0 z-10 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center gap-4">
                <SidebarTrigger className="hover:bg-zinc-100 dark:text-zinc-200" />
                <div className="h-4 w-px bg-zinc-200 mx-2 hidden md:block" />
                <h1 className="text-sm font-medium text-zinc-500 hidden md:block dark:text-zinc-200">
                    {title}
                </h1>
            </div>

            <div className="flex items-center gap-2">

            </div>
        </header>
    );
}