import React, { useState } from 'react';
import { __ } from '@/lib/i18n';
import { Input } from "@/Components/ui/Input";
import { Label } from "@/Components/ui/Label";
import { Button } from "@/Components/ui/Button";
import { PasswordInput } from "@/Components/ui/password-input";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/Card";


export default function ResetPasswordPage({ token, email, submitUrl }) {
    const [data, setData] = useState({ token, email, password: '', password_confirmation: '' });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(submitUrl, data);
            window.location.href = '/admin/login?reset=success';
        } catch (err) {
            if (err.response?.status === 422) setErrors(err.response.data.errors);
        } finally { setLoading(false); }
    };

    return (
        <Card className="border-none shadow-xl">
            <CardHeader><CardTitle>{__('Nouveau mot de passe')}</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input type="hidden" value={data.token} />
                    <div className="space-y-2">
                        <Label>{__('Email')}</Label>
                        <Input type="email" value={data.email} disabled className="bg-zinc-50" />
                    </div>
                    <div className="space-y-2">
                        <Label>{__('Nouveau mot de passe')}</Label>
                        <PasswordInput 
                            value={data.password} 
                            onChange={e => setData({...data, password: e.target.value})}
                            className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && <p className="text-xs text-red-500">{errors.password[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>{__('Confirmer le mot de passe')}</Label>
                        <PasswordInput 
                            value={data.password_confirmation} 
                            onChange={e => setData({...data, password_confirmation: e.target.value})}
                        />
                    </div>
                    <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                        {loading ? __('Mise à jour...') : __('Réinitialiser le mot de passe')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}