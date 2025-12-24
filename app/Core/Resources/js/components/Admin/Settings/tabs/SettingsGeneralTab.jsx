import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImagePicker } from "@/components/ui/image-picker";
import { __ } from '@/lib/i18n';

export function SettingsGeneralTab({ data, setData, locales, timezones }) {
    // Helper pour mettre à jour une clé rapidement
    const update = (key, value) => setData({ ...data, [key]: value });

    return (
        <div className="space-y-6">
            {/* SECTION 1 : IDENTITÉ & SEO */}
            <Card>
                <CardHeader>
                    <CardTitle>{__('Identité de l\'application')}</CardTitle>
                    <CardDescription>{__('Informations visibles sur les moteurs de recherche et les onglets.')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid gap-2">
                        <Label htmlFor="app_name">{__('Nom du site')}</Label>
                        <Input 
                            id="app_name" 
                            value={data.app_name} 
                            onChange={e => update('app_name', e.target.value)} 
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="app_description">{__('Description (Meta)')}</Label>
                        <Textarea 
                            id="app_description" 
                            rows={2}
                            value={data.app_description} 
                            onChange={e => update('app_description', e.target.value)} 
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="app_url">{__('URL Principale')}</Label>
                        <Input 
                            id="app_url" 
                            value={data.app_url} 
                            onChange={e => update('app_url', e.target.value)} 
                        />
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 2 : APPARENCE (Fusionnée ici) */}
            <Card>
                <CardHeader>
                    <CardTitle>{__('Marque & Visuels')}</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-6">
                    <ImagePicker 
                        label={__('Logo Principal')}
                        value={data.app_logo}
                        onChange={url => update('app_logo', url)}
                    />
                    <ImagePicker 
                        label={__('Favicon (32x32)')}
                        value={data.app_favicon}
                        onChange={url => update('app_favicon', url)}
                    />
                </CardContent>
            </Card>

            {/* SECTION 3 : RÉGIONALISATION (Dynamique) */}
            <Card>
                <CardHeader>
                    <CardTitle>{__('Langue & Date')}</CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label>{__('Langue par défaut')}</Label>
                        <Select value={data.app_locale} onValueChange={val => update('app_locale', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder={__('Choisir une langue')} />
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

                    <div className="grid gap-2">
                        <Label>{__('Fuseau Horaire')}</Label>
                        <Select value={data.app_timezone} onValueChange={val => update('app_timezone', val)}>
                            <SelectTrigger>
                                <SelectValue placeholder={__('Choisir un fuseau')} />
                            </SelectTrigger>
                            <SelectContent>
                                {/* On limite l'affichage ou on utilise une liste virtualisée si trop long */}
                                {timezones.slice(0, 200).map((tz) => (
                                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* SECTION 4 : MAINTENANCE */}
            <Card className="border-red-100 dark:border-red-900/50">
                <CardHeader>
                    <CardTitle className="text-red-600 dark:text-red-400">{__('Zone de Danger')}</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label>{__('Mode Maintenance')}</Label>
                        <p className="text-sm text-zinc-500">{__('Couper l\'accès public au site.')}</p>
                    </div>
                    <Switch 
                        checked={data.maintenance_mode} 
                        onCheckedChange={val => update('maintenance_mode', val)} 
                    />
                </CardContent>
            </Card>
        </div>
    );
}