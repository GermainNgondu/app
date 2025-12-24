import React, { useState } from 'react';
import { __ } from '@/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/Components/ui/Card";

// Import des sous-composants d'étapes
import RequirementsStep from './steps/RequirementsStep';
import DatabaseStep from './steps/DatabaseStep';
import MigrationStep from './steps/MigrationStep';
import AdminStep from './steps/AdminStep';

export default function InstallWizard({ redirectPath }) {
    // Étapes : requirements -> database -> migrate -> admin
    const [currentStep, setCurrentStep] = useState('requirements');
    
    // Données partagées entre les étapes
    const [installData, setInstallData] = useState({
        db: null,
        admin: null
    });

    // Calcul du titre et de la progression
    const stepsInfo = {
        requirements: { title: __('Vérification du système'), progress: 25 },
        database: { title: __('Configuration de la base de données'), progress: 50 },
        migrate: { title: __('Installation des tables'), progress: 75 },
        admin: { title: __('Compte Administrateur'), progress: 100 },
    };

    return (
        <Card className="border-none shadow-none bg-transparent">
            <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                    <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden max-w-[200px]">
                        <div 
                            className="bg-primary h-full transition-all duration-500 ease-in-out" 
                            style={{ width: `${stepsInfo[currentStep].progress}%` }}
                        ></div>
                    </div>
                </div>
                <CardTitle className="text-2xl font-bold">
                    {stepsInfo[currentStep].title}
                </CardTitle>
                <CardDescription>
                    {__('Étape :step sur 4', { step: Object.keys(stepsInfo).indexOf(currentStep) + 1 })}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Rendu conditionnel des étapes */}
                {currentStep === 'requirements' && (
                    <RequirementsStep 
                        onNext={() => setCurrentStep('database')} 
                    />
                )}

                {currentStep === 'database' && (
                    <DatabaseStep 
                        onNext={(dbConfig) => {
                            setInstallData({ ...installData, db: dbConfig });
                            setCurrentStep('migrate');
                        }} 
                    />
                )}

                {currentStep === 'migrate' && (
                    <MigrationStep 
                        onNext={() => setCurrentStep('admin')} 
                    />
                )}

                {currentStep === 'admin' && (
                    <AdminStep 
                        redirectPath={redirectPath}
                        onComplete={() => {
                            // La redirection finale est gérée dans l'étape Admin
                        }}
                    />
                )}
            </CardContent>
        </Card>
    );
}