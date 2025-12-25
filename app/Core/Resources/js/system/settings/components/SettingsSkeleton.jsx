import React from 'react';
import { Skeleton } from "@ui/skeleton";
import { Card, CardContent, CardHeader } from "@ui/card";

export function SettingsSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header : Titre + Description à gauche, Bouton à droite */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-64" /> {/* "Paramètres du système" */}
                    <Skeleton className="h-4 w-96" /> {/* "Gérez la configuration globale..." */}
                </div>
                <Skeleton className="h-10 w-32" /> {/* Bouton "Sauvegarder tout" */}
            </div>

            {/* Barre d'onglets (TabsList) : 3 éléments comme dans votre code */}
            <div className="flex gap-2 p-1 bg-zinc-100 dark:bg-zinc-900 rounded-lg w-full max-w-2xl">
                {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-9 flex-1" />
                ))}
            </div>

            {/* Contenu de l'onglet Général (max-w-3xl comme dans votre TabsContent) */}
            <div className="space-y-4 mt-4 max-w-3xl">
                
                {/* Carte 1 : Identité de l'application */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-48" /> {/* Titre de la carte */}
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* 3 Groupes : Label + Input */}
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-4 w-32" /> {/* Label */}
                                <Skeleton className="h-10 w-full" /> {/* Input */}
                            </div>
                        ))}
                    </CardContent>
                </Card>

                {/* Carte 2 : Maintenance */}
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-32" /> {/* "Maintenance" */}
                    </CardHeader>
                    <CardContent className="flex items-center justify-between">
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-40" /> {/* "Mode Maintenance" */}
                            <Skeleton className="h-3 w-64" /> {/* "Si activé, seul l'admin..." */}
                        </div>
                        <Skeleton className="h-6 w-11 rounded-full" /> {/* Switch Toggle */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}