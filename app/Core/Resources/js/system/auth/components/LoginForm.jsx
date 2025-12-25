import React, { useState } from 'react';
import { __ } from '@/common/lib/i18n';
import { Input } from "@ui/input";
import { PasswordInput } from "@ui/password-input";
import { Label } from "@ui/label";
import { Button } from "@ui/button";
import { Checkbox } from "@ui/checkbox";
import { Loader2, LogIn } from "lucide-react";

export default function LoginForm({ endpoint, forgotPasswordUrl }) {
    const [data, setData] = useState({ email: '', password: '', remember: false });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            const response = await axios.post(endpoint, data);
            
            if (response.data.redirect || response.status === 200) {
                window.location.href = response.data.redirect || '/admin/dashboard';
            }
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.status === 422) {
                // Erreurs de validation Laravel (Login incorrect, champs requis...)
                setErrors(err.response.data.errors);
            }
        }
    };

    return (
        <form onSubmit={handleSubmit} className="grid gap-5">
            {/* Email */}
            <div className="grid gap-2">
                <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
                    {__('email_label')}
                </Label>
                <Input 
                    id="email"
                    type="email"
                    placeholder=""
                    value={data.email}
                    onChange={e => setData({...data, email: e.target.value})}
                    className={errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.email && (
                    <p className="text-xs text-red-500 font-medium">{errors.email[0]}</p>
                )}
            </div>

            {/* Password */}
            <div className="grid gap-2">
                <div className="flex items-center justify-between">
                    <Label htmlFor="password" className={errors.password ? "text-red-500" : ""}>
                        {__('password')}
                    </Label>
                    <a href={forgotPasswordUrl} className="text-xs text-primary hover:underline font-medium">
                        {__('forgot_password_question')}
                    </a>
                </div>
                <PasswordInput 
                    id="password"
                    value={data.password}
                    onChange={e => setData({...data, password: e.target.value})}
                    className={errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}
                />
                {errors.password && (
                    <p className="text-xs text-red-500 font-medium">{errors.password[0]}</p>
                )}
            </div>

            {/* Remember Me */}
            <div className="flex items-center space-x-2">
                <Checkbox 
                    id="remember" 
                    checked={data.remember}
                    onCheckedChange={(checked) => setData({...data, remember: checked})}
                />
                <label htmlFor="remember" className="text-sm font-medium leading-none cursor-pointer">
                    {__('remember_me')}
                </label>
            </div>

            <Button type="submit" className="w-full cursor-pointer" disabled={loading}>
                {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                    <>
                        <LogIn className="mr-2 h-4 w-4" />
                        {__('log_in')}
                    </>
                )}
            </Button>
        </form>
    );
}