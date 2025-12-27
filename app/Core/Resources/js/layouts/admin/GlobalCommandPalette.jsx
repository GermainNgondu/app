import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as Icons from "lucide-react";
import { __ } from '@/common/lib/i18n';
import axios from 'axios';
import { toast } from "sonner";
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/ui/command";

export default function GlobalCommandPalette() {
    const [open, setOpen] = useState(false);
    const { data: commands, isLoading } = useQuery({
        queryKey: ['commands'],
        queryFn: () => axios.get('/api/admin/commands').then(res => res.data.data)
    });

    const groups = commands ? [...new Set(commands.map(c => c.group))] : [];

    // Écoute du raccourci clavier
    useEffect(() => {
        const down = (e) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };
        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    // Fonction pour exécuter un Intent via l'API
    const runIntent = async (intentName) => {
        setOpen(false);
        try {
            const response = await axios.post('/api/admin/intents/execute', { intent: intentName });
            toast.success(response.data.message || __('Action exécutée'));
        } catch (error) {
            toast.error(__('Erreur lors de l\'exécution de l\'action'));
        }
    };

    const navigate = (url) => {
        setOpen(false);
        window.location.href = url;
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen} className="max-w-lg">
            <CommandInput placeholder={__('Chercher une page ou une action...')} />
            <CommandList>
                {isLoading && <CommandItem>{__('Chargement...')}</CommandItem>}
                
                {groups.map(group => (
                    <CommandGroup key={group} heading={__(group)}>
                        {commands.filter(c => c.group === group).map((cmd, idx) => {
                            const Icon = Icons[cmd.icon] || Icons.Circle;
                            return (
                                <CommandItem 
                                    key={idx} 
                                    onSelect={() => cmd.type === 'nav' ? navigate(cmd.value) : runIntent(cmd.value)}
                                >
                                    <Icon className="mr-2 h-4 w-4" />
                                    <span>{__(cmd.label)}</span>
                                </CommandItem>
                            );
                        })}
                    </CommandGroup>
                ))}
            </CommandList>
        </CommandDialog>
    );
}