import React, { useEffect, useRef, useState, memo } from 'react';
import AppSidebar from "./AppSidebar";
import AdminHeader from "./AdminHeader";
import { mountIslands } from '../../app.jsx';
import { ThemeProvider } from "@/providers/theme-provider";
import { ConfigProvider } from "@/providers/config-provider";
import { UpdateProvider } from "@/providers/update-provider";
import { Toaster } from "@/ui/sonner";
import { SidebarProvider, SidebarInset } from "@/ui/sidebar";


const BladeContent = memo(({ html }) => {
    const contentRef = useRef(null);

    useEffect(() => {
        
        if (contentRef.current) {
            mountIslands(contentRef.current);
        }
    }, [html]);

    return (
        <div 
            className="w-full"
            dangerouslySetInnerHTML={{ __html: html }}
            ref={contentRef}
        />
    );
});

export default function AdminLayout({ innerHtml, user, menu, currentRoute, title, settings }) {

    const version = window.appConfig.version || '1.0.0';

    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("sidebar:state");
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });

    useEffect(() => {
        localStorage.setItem("sidebar:state", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    return (
        <ThemeProvider>
            <ConfigProvider settings={settings}>
                <UpdateProvider>
                    <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
                        <div className="flex h-screen w-full overflow-hidden">
                            <AppSidebar user={user} menu={menu} currentRoute={currentRoute} settings={settings} />

                            <SidebarInset className="flex flex-col flex-1 min-w-0 overflow-hidden">
                                <AdminHeader user={user} title={title} />

                                <main className="flex-1 overflow-y-auto relative bg-zinc-50/50 dark:bg-zinc-950/50">
                                    <BladeContent html={innerHtml} />
                                </main>
                            </SidebarInset>
                        </div>
                        <Toaster />
                    </SidebarProvider>
                </UpdateProvider>
            </ConfigProvider>
        </ThemeProvider>
    );
}