import React, { useState } from 'react';
import { __ } from '@/common/lib/i18n';
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Button } from "@ui/button";
import { PasswordInput } from "@ui/password-input";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";


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
            <CardHeader><CardTitle>{__('new_password')}</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input type="hidden" value={data.token} />
                    <div className="space-y-2">
                        <Label>{__('Email')}</Label>
                        <Input type="email" value={data.email} disabled className="bg-zinc-50" />
                    </div>
                    <div className="space-y-2">
                        <Label>{__('new_password')}</Label>
                        <PasswordInput 
                            value={data.password} 
                            onChange={e => setData({...data, password: e.target.value})}
                            className={errors.password ? "border-red-500" : ""}
                        />
                        {errors.password && <p className="text-xs text-red-500">{errors.password[0]}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label>{__('confirm_password')}</Label>
                        <PasswordInput 
                            value={data.password_confirmation} 
                            onChange={e => setData({...data, password_confirmation: e.target.value})}
                        />
                    </div>
                    <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                        {loading ? __('updating') : __('reset_password')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}