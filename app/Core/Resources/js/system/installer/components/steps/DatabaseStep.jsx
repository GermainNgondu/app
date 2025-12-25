import React, { useState } from 'react';
import { __ } from '@/common/lib/i18n';
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Button } from "@ui/button";
import { AlertCircle, Loader2, Database } from "lucide-react";

export default function DatabaseStep({ onNext }) {
    // 1. État du formulaire
    const [form, setForm] = useState({
        db_connection: 'mysql',
        db_host: '127.0.0.1',
        db_port: '3306',
        db_database: 'database',
        db_username: 'root',
        db_password: ''
    });

    // 2. États de l'interface
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isSqlite = form.db_connection === 'sqlite';

    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {

            const response = await axios.post('/install/database', form);

            // Vérification stricte du statut renvoyé par le contrôleur PHP
            if (response.data.status === 'success') {
               
                // Déclenche le passage à l'étape suivante dans le composant parent
                onNext(form); 
            } else {
                setError(response.data.message || __('Une erreur inconnue est survenue.'));
            }
        } catch (err) {

            setError(
                err.response?.data?.message || 
                __('Impossible de se connecter à la base de données. Vérifiez vos accès.')
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Affichage des erreurs si présentes */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p>{error}</p>
                </div>
            )}

            {/* Sélecteur de Driver */}
            <div className="space-y-2">
                <Label htmlFor="db_connection">{__('Type de base de données')}</Label>
                <select 
                    id="db_connection"
                    className="w-full h-10 px-3 py-2 rounded-md border border-zinc-200 bg-white text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    value={form.db_connection}
                    onChange={(e) => setForm({...form, db_connection: e.target.value})}
                >
                    <option value="mysql">MySQL / MariaDB</option>
                    <option value="pgsql">PostgreSQL</option>
                    <option value="sqlite">SQLite</option>
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Champ Nom de la base / Fichier */}
                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="db_database">
                        {isSqlite ? __('Nom du fichier .sqlite') : __('Nom de la base de données')}
                    </Label>
                    <Input 
                        id="db_database"
                        placeholder={isSqlite ? "database.sqlite" : ""}
                        value={form.db_database} 
                        onChange={e => setForm({...form, db_database: e.target.value})}
                        required
                    />
                </div>
                
                {/* Champs masqués si SQLite est sélectionné */}
                {!isSqlite && (
                    <>
                        <div className="space-y-2">
                            <Label htmlFor="db_host">{__('Hôte')}</Label>
                            <Input 
                                id="db_host"
                                value={form.db_host} 
                                onChange={e => setForm({...form, db_host: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="db_port">{__('Port')}</Label>
                            <Input 
                                id="db_port"
                                value={form.db_port} 
                                onChange={e => setForm({...form, db_port: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="db_username">{__('Utilisateur')}</Label>
                            <Input 
                                id="db_username"
                                value={form.db_username} 
                                onChange={e => setForm({...form, db_username: e.target.value})}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="db_password">{__('password')}</Label>
                            <Input 
                                id="db_password"
                                type="password" 
                                value={form.db_password} 
                                onChange={e => setForm({...form, db_password: e.target.value})}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Bouton de validation avec état de chargement */}
            <Button 
                type="submit" 
                className="w-full cursor-pointer flex items-center justify-center gap-2" 
                disabled={loading}
            >
                {loading ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {__('Vérification en cours...')}
                    </>
                ) : (
                    <>
                        <Database className="w-4 h-4" />
                        {__('test_save_config')}
                    </>
                )}
            </Button>
        </form>
    );
}