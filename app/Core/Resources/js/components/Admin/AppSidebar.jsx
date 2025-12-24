import React from 'react';
import * as Icons from "lucide-react";
import { Sun, Moon, Settings,ChevronsUpDown, LogOut, Command, } from "lucide-react";
import { __ } from '@/lib/i18n';
import { 
    Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, 
    SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, 
    SidebarFooter, SidebarRail
} from "@/components/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal
} from "@/Components/ui/dropdown-menu"

import { useTheme } from "@/contexts/theme-provider";

export default function AppSidebar({ menu, user }) {
    const { setTheme, theme } = useTheme();
    // Fonction de déconnexion
    const handleLogout = () => {
        axios.post('/admin/logout').then(() => window.location.href = '/admin/login');
    };

    return (
        <Sidebar collapsible="icon" className="border-r border-zinc-200 dark:border-zinc-800">
            {/* Header de la Sidebar */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/admin/dashboard" className="flex items-center gap-3">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Command className="size-4" /> {/* Ton icône de Logo */}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold text-lg">SystemCore</span>
                                    <span className="truncate text-xs text-zinc-500">v1.0.4</span>
                                </div>
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                {/* Menu Dynamique (Généré par le Registry) */}
                {Object.entries(menu).map(([groupName, items]) => (
                    <SidebarGroup key={groupName}>
                        <SidebarGroupLabel>{__(groupName)}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {items.map((item) => {
                                    const Icon = Icons[item.icon] || Icons.Circle;
                                    return (
                                        <SidebarMenuItem key={item.label}>
                                            <SidebarMenuButton asChild isActive={item.active} tooltip={item.label}>
                                                <a href={item.url} className="flex items-center gap-3">
                                                    <Icon className="w-4 h-4" />
                                                    <span>{item.label}</span>
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    );
                                })}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                ))}
            </SidebarContent>

            {/* LE NOUVEAU FOOTER (Comme sur votre image) */}
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    {/* Avatar */}
                                    <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden">
                                         {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                                         ) : (
                                            <span className="font-bold text-xs">{user.name.charAt(0)}</span>
                                         )}
                                    </div>
                                    
                                    {/* Infos Utilisateur (Nom + Email) */}
                                    <div className="grid flex-1 text-left text-sm leading-tight">
                                        <span className="truncate font-semibold">{user.name}</span>
                                        <span className="truncate text-xs text-zinc-500">{user.email}</span>
                                    </div>
                                    
                                    {/* Icône Chevrons */}
                                    <ChevronsUpDown className="ml-auto size-4" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            
                            {/* Contenu du Menu Déroulant */}
                            <DropdownMenuContent
                                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                                side="bottom"
                                align="end"
                                sideOffset={4}
                            >
                                <DropdownMenuLabel className="p-0 font-normal">
                                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                                        <div className="h-8 w-8 rounded-lg bg-zinc-100 flex items-center justify-center border border-zinc-200 overflow-hidden">
                                            {user.avatar_url ? (
                                                <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="font-bold text-xs">{user.name.charAt(0)}</span>
                                            )}
                                        </div>
                                        <div className="grid flex-1 text-left text-sm leading-tight">
                                            <span className="truncate font-semibold">{user.name}</span>
                                            <span className="truncate text-xs text-zinc-500">{user.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>
                                
                                <DropdownMenuSeparator />
                                {/* --- NOUVEAU : SÉLECTEUR DE THÈME --- */}
                                <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                            <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                            <span className="ml-2">{__('Thème')}</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                                    <Icons.Sun className="mr-2 h-4 w-4" />
                                                    <span>{__('Clair')}</span>
                                                    {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                                    <Icons.Moon className="mr-2 h-4 w-4" />
                                                    <span>{__('Sombre')}</span>
                                                    {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                                    <Icons.Monitor className="mr-2 h-4 w-4" />
                                                    <span>{__('Système')}</span>
                                                    {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                </DropdownMenuSub>
                                {/* ------------------------------------ */}
                                <DropdownMenuItem>
                                   <a href='/admin/settings' className="flex items-center gap-3">
                                        <Settings className="w-4 h-4" />
                                        <span>{__('Paramètres')}</span>
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {__('Se déconnecter')}
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}