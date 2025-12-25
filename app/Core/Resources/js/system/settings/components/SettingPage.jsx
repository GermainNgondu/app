import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { __ } from '@/common/lib/i18n';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { Label } from "@ui/label";
import { Button } from "@ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { Switch } from "@ui/switch";
import { ImagePicker } from "@ui/image-picker";
import { SettingsSkeleton } from './SettingsSkeleton';

export default function SettingsPage() {
    const queryClient = useQueryClient();
    
    const [data, setData] = useState({
        app_name: '',
        app_description: '',
        app_url: '',
        app_logo: '',
        app_favicon: '',
        app_locale: 'en',
        app_timezone: 'UTC',
        maintenance_mode: false,
    });

    const { data: apiResponse, isLoading, isError } = useQuery({
        queryKey: ['settings'],
        queryFn: async () => {
            const res = await axios.get('/api/admin/settings');
            return res.data.data;
        },
        staleTime: 1000 * 60 * 5,
    });

    useEffect(() => {
        if (apiResponse?.values) {
            const values = apiResponse.values;
            setData({
                app_name: values.app_name || 'QuickApp',
                app_description: values.app_description || '',
                app_url: values.app_url || '',
                app_logo: values.app_logo || '',
                app_favicon: values.app_favicon || '',
                app_locale: values.app_locale || 'en',
                app_timezone: values.app_timezone || 'UTC',
                maintenance_mode: !!values.maintenance_mode,
            });
        }
    }, [apiResponse]);

    const mutation = useMutation({
        mutationFn: (newData) => axios.post('/api/admin/settings', newData),
        onSuccess: () => {
            toast.success(__('settings_saved'));
            queryClient.invalidateQueries(['settings']);
        },
        onError: () => toast.error(__('save_error'))
    });

    const locales = apiResponse?.meta?.locales || [];
    const timezones = apiResponse?.meta?.timezones || [];

    if (isLoading) return <SettingsSkeleton />;
    if (isError) return <div className="p-10 text-red-500">{__('unable_load_settings')}</div>;

    return (
        <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(data); }} className="space-y-6">
            <div className="flex items-center justify-between sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-10 py-4 border-b border-zinc-200 dark:border-zinc-800 mb-6">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">{__('system_settings')}</h2>
                    <p className="text-zinc-500 text-sm">{__('global_config_desc')}</p>
                </div>
                <Button className="cursor-pointer" type="submit" disabled={mutation.isPending}>
                    {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {mutation.isPending ? __('Enregistrement...') : __('Sauvegarder tout')}
                </Button>
            </div>
            <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full max-w-2xl grid-cols-3">
                    <TabsTrigger value="general">{__('Général')}</TabsTrigger>
                    <TabsTrigger value="appearance">{__('Apparence')}</TabsTrigger>
                    <TabsTrigger value="localization">{__('Langue & Date')}</TabsTrigger>
                </TabsList>

                {/* --- ONGLET GÉNÉRAL --- */}
                <TabsContent value="general" className="space-y-4 mt-4 max-w-3xl animate-in fade-in slide-in-from-bottom-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{__('Identité de l\'application')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="app_name">{__('Nom de l\'application')}</Label>
                                <Input 
                                    id="app_name" 
                                    value={data.app_name} 
                                    onChange={e => setData({...data, app_name: e.target.value})} 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="app_description">{__('Description (SEO)')}</Label>
                                <Textarea 
                                    id="app_description" 
                                    value={data.app_description} 
                                    rows={3}
                                    onChange={e => setData({...data, app_description: e.target.value})} 
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="app_url">{__('URL Publique')}</Label>
                                <Input 
                                    id="app_url" 
                                    value={data.app_url} 
                                    onChange={e => setData({...data, app_url: e.target.value})} 
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{__('Maintenance')}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>{__('Mode Maintenance')}</Label>
                                <p className="text-sm text-zinc-500">{__('Si activé, seul l\'admin sera accessible.')}</p>
                            </div>
                            <Switch 
                                checked={data.maintenance_mode} 
                                onCheckedChange={val => setData({...data, maintenance_mode: val})} 
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- ONGLET APPARENCE --- */}
                <TabsContent value="appearance" className="space-y-4 mt-4 max-w-3xl animate-in fade-in slide-in-from-bottom-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{__('Visuels & Marque')}</CardTitle>
                            <CardDescription>{__('Ces images apparaîtront dans le header et les onglets du navigateur.')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <ImagePicker 
                                label={__('Logo de l\'application')}
                                value={data.app_logo}
                                onChange={url => setData({...data, app_logo: url})}
                            />
                            <ImagePicker 
                                label={__('Favicon (32x32)')}
                                value={data.app_favicon}
                                onChange={url => setData({...data, app_favicon: url})}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* --- ONGLET LOCALISATION (DYNAMIQUE) --- */}
                <TabsContent value="localization" className="space-y-4 mt-4 max-w-3xl animate-in fade-in slide-in-from-bottom-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>{__('Régionalisation')}</CardTitle>
                            <CardDescription>{__('Définissez la langue par défaut et le fuseau horaire du système.')}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            
                            {/* Sélecteur de Langue Dynamique */}
                            <div className="grid gap-2">
                                <Label>{__('Langue par défaut')}</Label>
                                <Select value={data.app_locale} onValueChange={val => setData({...data, app_locale: val})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={__('Sélectionner une langue')} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locales.map((locale) => (
                                            <SelectItem key={locale.code} value={locale.code}>
                                                {locale.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {/* Sélecteur de Timezone Dynamique */}
                            <div className="grid gap-2">
                                <Label>{__('Fuseau horaire')}</Label>
                                <Select value={data.app_timezone} onValueChange={val => setData({...data, app_timezone: val})}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={__('Sélectionner un fuseau')} />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {timezones.slice(0, 300).map((tz) => (
                                            <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </form>
    );
}