import React, { useState } from 'react';
import { Button } from "@ui/button";
import { Check } from "lucide-react";
import { cn } from "@/common/lib/utils";

const languages = [
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'en', label: 'English', flag: '🇺🇸' },
];

export default function LanguageStep({ onNext }) {
    const [selected, setSelected] = useState(window.locale || 'en');
    const [loading, setLoading] = useState(false);

    const handleLanguageChange = async (code) => {
        setSelected(code);
        setLoading(true);
        try {
            const response = await axios.post('/install/locale', { locale: code });
            // On met à jour les traductions globales sans recharger la page
            window.translations = response.data.translations;
            window.locale = code;
        } catch (error) {
            console.error("Erreur lors du changement de langue", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid gap-6">
            <div className="grid grid-cols-1 gap-3">
                {languages.map((lang) => (
                    <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={cn(
                            "flex items-center justify-between p-4 rounded-xl border-2 transition-all cursor-pointer",
                            selected === lang.code 
                                ? "border-primary bg-primary/5" 
                                : "border-zinc-100 hover:border-zinc-200"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl">{lang.flag}</span>
                            <span className="font-medium text-zinc-900">{lang.label}</span>
                        </div>
                        {selected === lang.code && (
                            <Check className="h-5 w-5 text-primary" />
                        )}
                    </button>
                ))}
            </div>

            <Button 
                onClick={onNext} 
                className="w-full h-12 text-base cursor-pointer" 
                disabled={loading}
            >
                {selected === 'fr' ? __('continue') : 'Continue'}
            </Button>
        </div>
    );
}