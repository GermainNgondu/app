import React, { useState } from 'react';
import { Input } from "./input";
import { Button } from "./button";
import { Eye, EyeOff } from "lucide-react";

export function PasswordInput({ className, ...props }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <Input
                type={showPassword ? "text" : "password"}
                className={`pr-10 ${className}`} // Padding à droite pour laisser de la place à l'icône
                {...props}
            />
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-zinc-500 hover:text-zinc-700"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1" // Évite que le bouton ne gêne la navigation au clavier (Tab)
            >
                {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                )}
                <span className="sr-only">
                    {showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                </span>
            </Button>
        </div>
    );
}