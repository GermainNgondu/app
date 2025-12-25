import React, { useState } from 'react';
import { __ } from '@/common/lib/i18n';
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Button } from "@ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@ui/card";
import { AlertCircle, ArrowLeft, Send, CheckCircle2 } from "lucide-react";

export default function ForgotPasswordPage({ submitUrl, loginUrl }) {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState(null);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await axios.post(submitUrl, { email });
            setStatus('success');
        } catch (err) {
            if (err.response?.status === 422) {
                setErrors(err.response.data.errors);
            }
            if (err.response?.status === 500) {
                setErrors(err.response.data);
            }
        } finally {
            setLoading(false);
        }
    };

    if (status === 'success') {
        return (
            <Card className="border-none shadow-xl text-center">
                <CardContent className="pt-6">
                    <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold">{__('link_sent')}</h3>
                    <p className="text-zinc-500 text-sm mt-2">
                        {__('check_email_reset')}
                    </p>
                    <Button variant="outline" className="mt-6 w-full cursor-pointer" onClick={() => window.location.href = loginUrl}>
                        {__('back_to_login')}
                    </Button>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-none shadow-xl">
            <CardHeader>
                <CardTitle>{__('forgot_password')}</CardTitle>
                <CardDescription>{__('enter_email_recovery')}</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors?.message && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            <p>{errors.message}</p>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">{__('email_label')}</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            value={email} 
                            onChange={e => setEmail(e.target.value)}
                            className={errors?.email ? "border-red-500" : ""}
                        />
                        {errors?.email && <p className="text-xs text-red-500">{errors.email[0]}</p>}
                    </div>
                    <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                        {loading ? <span className="animate-pulse">{__('sending')}</span> : <><Send className="w-4 h-4 mr-2"/> {__('send_link')}</>}
                    </Button>
                    <Button variant="link" className="w-full text-zinc-500 text-xs cursor-pointer" onClick={() => window.location.href = loginUrl}>
                        <ArrowLeft className="w-3 h-3 mr-1"/> {__('back_to_login')}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}