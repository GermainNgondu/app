import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@ui/tabs";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Button } from "@ui/button";
import { ImagePicker } from "@ui/image-picker"; 
import { User, Lock, Loader2, Save } from "lucide-react";
import { __ } from '@/common/lib/i18n';
import { toast } from "sonner";
import axios from 'axios';

export default function ProfilePage({ user }) {
    
    const [formData, setFormData] = useState({
        name: user.name || '',
        email: user.email || '',
        avatar_url: user.avatar_url || '',
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });

    const mutation = useMutation({
        mutationFn: (data) => axios.post('/api/admin/profile', data),
        onSuccess: (res) => {
            toast.success(res.data.message);
            // Reset des champs mot de passe par sécurité
            setFormData(prev => ({ 
                ...prev, 
                current_password: '', 
                new_password: '', 
                new_password_confirmation: '' 
            }));
            // Optionnel : Forcer le rechargement pour mettre à jour l'avatar dans la sidebar immédiatement
            setTimeout(() => window.location.reload(), 1000);
        },
        onError: (err) => {
            toast.error(err.response?.data?.message || __('error_occurred'));
        }
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{__('my_profile')}</h2>
                    <p className="text-zinc-500">{__('manage_profile_security')}</p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Tabs defaultValue="general" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="general" className="flex gap-2">
                            <User className="h-4 w-4" /> {__('information')}
                        </TabsTrigger>
                        <TabsTrigger value="security" className="flex gap-2">
                            <Lock className="h-4 w-4" /> {__('security')}
                        </TabsTrigger>
                    </TabsList>

                    {/* --- ONGLET GÉNÉRAL --- */}
                    <TabsContent value="general" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{__('avatar_identity')}</CardTitle>
                                <CardDescription>{__('avatar_identity_desc')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Avatar Picker */}
                                <div className="flex flex-col gap-3">
                                    <Label>{__('profile_photo')}</Label>
                                    <ImagePicker 
                                        label={__('change_avatar')}
                                        value={formData.avatar_url}
                                        onChange={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
                                    />
                                </div>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">{__('full_name')}</Label>
                                        <Input id="name" value={formData.name} onChange={handleChange} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">{__('email_label')}</Label>
                                        <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* --- ONGLET SÉCURITÉ --- */}
                    <TabsContent value="security" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>{__('password')}</CardTitle>
                                <CardDescription>{__('Laissez vide si vous ne souhaitez pas le modifier.')}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="current_password">{__('current_password')}</Label>
                                    <Input 
                                        id="current_password" 
                                        type="password" 
                                        value={formData.current_password} 
                                        onChange={handleChange} 
                                    />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password">{__('new_password')}</Label>
                                        <Input 
                                            id="new_password" 
                                            type="password" 
                                            value={formData.new_password} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="new_password_confirmation">{__('confirm_new_password')}</Label>
                                        <Input 
                                            id="new_password_confirmation" 
                                            type="password" 
                                            value={formData.new_password_confirmation} 
                                            onChange={handleChange} 
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Footer global pour le bouton de sauvegarde */}
                <div className="mt-6 flex justify-end">
                    <Button className="cursor-pointer" type="submit" size="lg" disabled={mutation.isPending}>
                        {mutation.isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Save className="mr-2 h-4 w-4" />
                        )}
                        {mutation.isPending ? __('saving_ongoing') : __('update_profile')}
                    </Button>
                </div>
            </form>
        </div>
    );
}