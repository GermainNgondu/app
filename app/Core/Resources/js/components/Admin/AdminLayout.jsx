import React, { useEffect, useRef, useState } from 'react';
import AppSidebar from "./AppSidebar";
import AdminHeader from "./AdminHeader";
import { mountIslands } from '../../app.jsx';
import { ThemeProvider } from "@/contexts/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function AdminLayout({ innerHtml, user, menu, currentRoute, title }) {
    // On crée une référence vers la div qui contiendra le HTML Blade
    const contentRef = useRef(null);

    // --- LOGIQUE DE PERSISTANCE SIDEBAR ---
    // On initialise l'état en lisant le localStorage (ou true par défaut)
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem("sidebar:state");
            return saved !== null ? JSON.parse(saved) : true;
        }
        return true;
    });

    // À chaque changement d'état, on sauvegarde dans le localStorage
    useEffect(() => {
        localStorage.setItem("sidebar:state", JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);
    // À chaque fois que le HTML change (changement de page Blade), on scanne
    useEffect(() => {
        if (contentRef.current) {
            mountIslands(contentRef.current);
        }
    }, [innerHtml]);
    return (
        <ThemeProvider>
            <SidebarProvider open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <div className="flex min-h-screen w-full">
                    <AppSidebar user={user} menu={menu} currentRoute={currentRoute} />

                    <SidebarInset className="flex flex-col flex-1">
                        <AdminHeader user={user} title={title} />

                        <main className="flex-1 overflow-y-auto">
                            <div 
                                className="h-full w-full"
                                dangerouslySetInnerHTML={{ __html: innerHtml }}
                                ref={contentRef}
                            />
                        </main>
                    </SidebarInset>
                </div>
                <Toaster />
            </SidebarProvider>
        </ThemeProvider>
    );
}