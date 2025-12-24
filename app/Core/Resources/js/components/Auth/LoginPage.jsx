import React from 'react';
import { __ } from '@/lib/i18n';
import LoginForm from './LoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/Card";

export default function LoginPage({ loginEndpoint, forgotPasswordUrl }) {
    return (
        <div className="w-full max-w-md mx-auto">
            <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md">
                <CardHeader className="space-y-1 text-center">
                    <CardTitle className="text-2xl font-bold tracking-tight">
                        {__('Connexion Admin')}
                    </CardTitle>
                    <CardDescription>
                        {__('Entrez vos identifiants pour accéder au panel')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm 
                        endpoint={loginEndpoint} 
                        forgotPasswordUrl={forgotPasswordUrl} 
                    />
                </CardContent>
            </Card>
            
            <p className="mt-8 text-center text-sm text-zinc-500">
                &copy; {new Date().getFullYear()} SystemCore. 
                <span className="ml-1 font-medium text-zinc-900">v1.0</span>
            </p>
        </div>
    );
}