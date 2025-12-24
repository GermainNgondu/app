import React, { useState } from 'react';
import { __ } from '@/lib/i18n';
import { Input } from "@/Components/ui/Input";
import { Label } from "@/Components/ui/Label";
import { Button } from "@/Components/ui/Button";
import { PasswordInput } from "@/Components/ui/password-input";
import { AlertCircle, Loader2, UserPlus } from "lucide-react";

export default function AdminStep({ redirectPath }) {
    const [form, setForm] = useState({ 
        name: '', 
        email: '', 
        password: '', 
        password_confirmation: '' 
    });
    
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // Stockage des erreurs par champ

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); // Réinitialiser les erreurs au début de la tentative

        try {
            // 1. Création de l'admin
            await axios.post('/install/admin', form);
            
            // 2. Finalisation (Clé APP_KEY, fichier 'installed', etc.)
            await axios.post('/install/finalize');
            
            // 3. Redirection vers le dashboard
            window.location.href = redirectPath;
        } catch (err) {
            setLoading(false);
            if (err.response && err.response.status === 422) {
                // On récupère les erreurs de validation de Laravel
                setErrors(err.response.data.errors);
            } else {
                // Erreur système générique
                setErrors({message: err.response.data.message});
            }
        }
    };

    // Helper pour afficher le message d'erreur d'un champ spécifique
    const ErrorMessage = ({ field }) => (
        errors[field] ? (
            <span className="text-xs text-red-500 mt-1 animate-in fade-in slide-in-from-top-1">
                {errors[field][0]}
            </span>
        ) : null
    );

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {errors.message && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{errors.message}</p>
                </div>
            )}
            <div className="grid gap-4">
            
                {/* Nom Complet */}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="name" className={errors.name ? "text-red-500" : ""}>
                        {__('Nom complet')}
                    </Label>
                    <Input 
                        id="name"
                        className={errors.name ? "border-red-500 focus:ring-red-200" : ""}
                        value={form.name} 
                        onChange={e => setForm({...form, name: e.target.value})} 
                    />
                    <ErrorMessage field="name" />
                </div>

                {/* Email */}
                <div className="flex flex-col gap-1.5">
                    <Label htmlFor="email" className={errors.email ? "text-red-500" : ""}>
                        {__('Email')}
                    </Label>
                    <Input 
                        id="email"
                        type="email"
                        className={errors.email ? "border-red-500 focus:ring-red-200" : ""}
                        value={form.email} 
                        onChange={e => setForm({...form, email: e.target.value})} 
                    />
                    <ErrorMessage field="email" />
                </div>

                {/* Mot de passe & Confirmation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="password" className={errors.password ? "text-red-500" : ""}>
                            {__('Mot de passe')}
                        </Label>
                        <PasswordInput 
                            id="password"
                            className={errors.password ? "border-red-500 focus:ring-red-200" : ""}
                            value={form.password} 
                            onChange={e => setForm({...form, password: e.target.value})} 
                        />
                        <ErrorMessage field="password" />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <Label htmlFor="password_confirmation">
                            {__('Confirmer le mot de passe')}
                        </Label>
                        <PasswordInput 
                            id="password_confirmation"
                            value={form.password_confirmation} 
                            onChange={e => setForm({...form, password_confirmation: e.target.value})} 
                        />
                    </div>
                </div>
            </div>

            <Button type="submit" className="w-full mt-4 cursor-pointer" disabled={loading}>
                {loading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {__('Configuration finale...')}
                    </>
                ) : (
                    <>
                        <UserPlus className="mr-2 h-4 w-4" />
                        {__('Terminer l\'installation')}
                    </>
                )}
            </Button>
        </form>
    );
}