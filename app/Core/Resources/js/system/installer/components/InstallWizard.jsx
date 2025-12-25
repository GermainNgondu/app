import React, { useState } from 'react';
import { __ } from '@/common/lib/i18n';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@ui/card";

// Import des sous-composants d'étapes
import LanguageStep from './steps/LanguageStep';
import RequirementsStep from './steps/RequirementsStep';
import DatabaseStep from './steps/DatabaseStep';
import MigrationStep from './steps/MigrationStep';
import AdminStep from './steps/AdminStep';

export default function InstallWizard({ redirectPath }) {

    const [currentStep, setCurrentStep] = useState('language');
    
    // Données partagées entre les étapes
    const [installData, setInstallData] = useState({
        db: null,
        admin: null
    });

    // Calcul du titre et de la progression
    const stepsInfo = {
        language: { title: __('choose_language'), progress: 20 },
        requirements: { title: __('system_check'), progress: 40 },
        database: { title: __('db_configuration'), progress: 60 },
        migrate: { title: __('table_installation'), progress: 80 },
        admin: { title: __('admin_account'), progress: 100 },
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
                    {__('step_counter', { step: Object.keys(stepsInfo).indexOf(currentStep) + 1 })}
                </CardDescription>
            </CardHeader>

            <CardContent>
                {/* Rendu conditionnel des étapes */}
                {currentStep === 'language' && (
                    <LanguageStep 
                        onNext={() => setCurrentStep('requirements')} 
                    />
                )}
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