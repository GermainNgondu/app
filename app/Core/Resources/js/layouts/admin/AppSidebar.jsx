import React from 'react';
import * as Icons from "lucide-react";
import { Sun, Moon, Settings,ChevronsUpDown, LogOut, Command,User,RefreshCw } from "lucide-react";
import { __ } from '@/common/lib/i18n';
import { 
    Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, 
    SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, 
    SidebarFooter, SidebarRail
} from "@/ui/sidebar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuPortal
} from "@/ui/dropdown-menu"

import { useTheme } from "@/providers/theme-provider";
import { useConfig } from "@/providers/config-provider";
import { useUpdateStatus } from "@/providers/update-provider";

export default function AppSidebar({ menu, user, settings }) {
    const { hasUpdate } = useUpdateStatus();
    const { setTheme, theme } = useTheme();
    // Fonction de déconnexion
    const handleLogout = () => {
        axios.post('/admin/logout').then(() => window.location.href = '/admin/login');
    };

    const { name, version} = useConfig();
    const appFavicon = settings?.app_favicon;

    return (
        <Sidebar collapsible="icon" className="border-r border-zinc-200 dark:border-zinc-800">
            {/* Header de la Sidebar */}
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <a href="/admin/dashboard" className="flex items-center gap-3">
                                <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                                    {appFavicon ? (
                                        <img src={appFavicon} alt={name} className="h-full w-full object-contain" />
                                    ) : (
                                        <div className="bg-primary text-primary-foreground">
                                            <Command className="size-4" />
                                        </div>
                                    )}
                                </div>
                                <div className="grid flex-1 text-left text-sm leading-tight">
                                    <span className="truncate font-bold text-lg">{name}</span>
                                    <span className="truncate text-xs text-zinc-500">{version}</span>
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
                        <SidebarMenuButton 
                            asChild 
                            tooltip={__('Mises à jour')}
                        >
                            <a href="/admin/system/update" className="flex items-center gap-3">
                                <RefreshCw className={hasUpdate ? "animate-spin-slow h-4 w-4" : "h-4 w-4"} />
                                <span className="font-medium">{__('Mise à jour')}</span>
                                {hasUpdate && (
                                    <span className="ml-auto bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {__('Nouvelle')}
                                    </span>
                                )}
                            </a>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    size="lg"
                                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                                >
                                    {/* Avatar - Toujours visible et rendu circulaire */}
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-full bg-zinc-100 border border-zinc-200 overflow-hidden shrink-0">
                                         {user.avatar_url ? (
                                            <img src={user.avatar_url} alt={user.name} className="h-full w-full object-cover" />
                                         ) : (
                                            <span className="font-bold text-xs">{user.name.charAt(0)}</span>
                                         )}
                                    </div>
                                    
                                    {/* Infos Utilisateur - Cachées automatiquement quand réduit */}
                                    <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                                        <span className="truncate font-semibold">{user.name}</span>
                                        <span className="truncate text-xs text-zinc-500">{user.email}</span>
                                    </div>
                        
                                    {/* Icône Chevrons - Cachée automatiquement quand réduit */}
                                    <ChevronsUpDown className="ml-auto size-4 shrink-0 group-data-[collapsible=icon]:hidden" />
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
                                            <span className="truncate font-semibold capitalize">{user.name}</span>
                                            <span className="truncate text-xs text-zinc-500">{user.email}</span>
                                        </div>
                                    </div>
                                </DropdownMenuLabel>

                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <a href="/admin/profile" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        <span>{__('Mon Profil')}</span>
                                    </a>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                   <a href='/admin/settings' className="flex cursor-pointer items-center gap-3">
                                        <Settings className="mr-2 h-4 w-4" />
                                        <span>{__('settings')}</span>
                                    </a>
                                </DropdownMenuItem>
                                {/* --- NOUVEAU : SÉLECTEUR DE THÈME --- */}
                                <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Sun className="mr-2 h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                            <Moon className="absolute mr-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                            <span className="ml-2">{__('theme')}</span>
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuPortal>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => setTheme("light")}>
                                                    <Icons.Sun className="mr-2 h-4 w-4" />
                                                    <span>{__('light')}</span>
                                                    {theme === 'light' && <span className="ml-auto text-xs">✓</span>}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme("dark")}>
                                                    <Icons.Moon className="mr-2 h-4 w-4" />
                                                    <span>{__('dark')}</span>
                                                    {theme === 'dark' && <span className="ml-auto text-xs">✓</span>}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => setTheme("system")}>
                                                    <Icons.Monitor className="mr-2 h-4 w-4" />
                                                    <span>{__('system')}</span>
                                                    {theme === 'system' && <span className="ml-auto text-xs">✓</span>}
                                                </DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuPortal>
                                </DropdownMenuSub>
                                {/* ------------------------------------ */}
                                <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    {__('logout_action')}
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