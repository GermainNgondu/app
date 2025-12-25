import React from 'react';
import { __ } from '@/common/lib/i18n';
import LoginForm from './LoginForm';
import { Card, CardContent, CardHeader } from "@ui/Card";

export default function LoginPage({ loginEndpoint, forgotPasswordUrl }) {
    const config = window.appConfig || { name: 'QuickApp', version: '1.0.0' };
    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
                <CardHeader className="space-y-1 text-center">
                </CardHeader>
                <CardContent>
                    <LoginForm 
                        endpoint={loginEndpoint} 
                        forgotPasswordUrl={forgotPasswordUrl} 
                    />
                </CardContent>
            </Card> 
            
            <p className="mt-8 text-center text-sm text-zinc-500">
                &copy; {new Date().getFullYear()} {config.name}. 
                <span className="ml-1 font-medium text-zinc-900">v{config.version}</span>
            </p>
        </div>
    );
}