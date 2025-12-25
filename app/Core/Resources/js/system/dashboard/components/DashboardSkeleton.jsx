import React from 'react';
import { Skeleton } from "@ui/skeleton";
import { Card, CardContent, CardHeader } from "@ui/card";

export function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Header : Titre */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                </div>
                {/* Boutons d'action simulés */}
                <div className="flex gap-2">
                    <Skeleton className="h-10 w-24" />
                    <Skeleton className="h-10 w-10" />
                </div>
            </div>

            {/* Zone 1 : Les Widgets KPI (Grille de 4) */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-24" /> {/* Titre Widget */}
                            <Skeleton className="h-4 w-4 rounded-full" /> {/* Icône */}
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" /> {/* Valeur (ex: 1,234) */}
                            <Skeleton className="h-3 w-32" /> {/* Sous-titre (+12% this month) */}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Zone 2 : Graphique + Liste (Grille 2 colonnes inégales) */}
            <div className="grid gap-4 md:grid-cols-7">
                
                {/* Grand Graphique (prend 4 colonnes) */}
                <Card className="col-span-4">
                    <CardHeader>
                        <Skeleton className="h-6 w-32" />
                    </CardHeader>
                    <CardContent className="pl-2">
                        <Skeleton className="h-[300px] w-full" />
                    </CardContent>
                </Card>

                {/* Liste Activités (prend 3 colonnes) */}
                <Card className="col-span-3">
                    <CardHeader>
                        <Skeleton className="h-6 w-40" />
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="flex items-center">
                                    <Skeleton className="h-9 w-9 rounded-full" />
                                    <div className="ml-4 space-y-1">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-3 w-24" />
                                    </div>
                                    <Skeleton className="ml-auto h-4 w-12" />
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}