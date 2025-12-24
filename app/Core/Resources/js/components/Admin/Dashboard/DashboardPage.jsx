import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { DashboardSkeleton } from './DashboardSkeleton';
import { __ } from '@/lib/i18n';
import * as Icons from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { GripVertical } from "lucide-react";

// --- IMPORTS DND-KIT ---
import {
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy, // Stratégie pour les grilles
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function DashboardPage() {
    const queryClient = useQueryClient();
    
    // 1. État local pour le Drag & Drop (optimistic UI)
    const [items, setItems] = useState([]);

    // 2. Chargement des widgets
    const { data: initialWidgets, isLoading, isError } = useQuery({
        queryKey: ['dashboard-widgets'],
        queryFn: async () => {
            const res = await axios.get('/admin/api/dashboard/widgets');
            return res.data.data;
        },
    });

    // Synchronisation : Quand les données arrivent, on remplit l'état local
    useEffect(() => {
        if (initialWidgets) {
            setItems(initialWidgets);
        }
    }, [initialWidgets]);

    // 3. Mutation pour sauvegarder l'ordre
    const reorderMutation = useMutation({
        mutationFn: (newOrder) => axios.post('/admin/api/dashboard/reorder', { widgets: newOrder }),
        onError: () => {
            // En cas d'erreur, on invalide pour remettre l'ordre serveur
            queryClient.invalidateQueries(['dashboard-widgets']);
        }
    });

    // 4. Configuration des capteurs (Sensors)
    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), // Évite le drag accidentel au clic
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    // 5. Logique de fin de drag
    const handleDragEnd = (event) => {
        const { active, over } = event;

        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.key === active.id);
                const newIndex = items.findIndex((item) => item.key === over.id);
                
                // On réorganise le tableau localement
                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // On prépare les données pour le backend (clé + nouvel index)
                const orderPayload = newItems.map((w, index) => ({ key: w.key, order: index + 1 }));
                
                // On sauvegarde silencieusement
                reorderMutation.mutate(orderPayload);
                
                return newItems;
            });
        }
    };

    if (isLoading && items.length === 0) return <DashboardSkeleton />;
    if (isError) return <div className="p-10 text-red-500">{__('Erreur de chargement.')}</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight mb-6">{__('Tableau de bord')}</h2>
                {reorderMutation.isPending && <span className="text-xs text-zinc-400">{__('Sauvegarde...')}</span>}
            </div>

            {/* CONTEXTE DND */}
            <DndContext 
                sensors={sensors} 
                collisionDetection={closestCenter} 
                onDragEnd={handleDragEnd}
            >
                {/* STRATÉGIE DE TRI EN GRILLE (Rect) */}
                <SortableContext items={items.map(i => i.key)} strategy={rectSortingStrategy}>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {items.map((widget) => (
                            <SortableWidget key={widget.key} widget={widget} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

// --- COMPOSANT WIDGET SORTABLE ---
function SortableWidget({ widget }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id: widget.key });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto', // Met l'élément au premier plan si on le bouge
        opacity: isDragging ? 0.8 : 1,
    };

    const IconComponent = Icons[widget.icon] || Icons.Circle;
    const colSpanClass = widget.width > 1 ? `lg:col-span-${widget.width}` : '';

    return (
        <Card 
            ref={setNodeRef} 
            style={style} 
            className={`${colSpanClass} group relative hover:shadow-md transition-shadow`}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                    {/* Poignée de déplacement (visible au survol) */}
                    <button 
                        {...attributes} 
                        {...listeners} 
                        className="opacity-0 group-hover:opacity-100 cursor-grab active:cursor-grabbing text-zinc-400 hover:text-zinc-600 transition-opacity"
                    >
                        <GripVertical className="h-4 w-4" />
                    </button>
                    {__(widget.title)}
                </CardTitle>
                <IconComponent className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${widget.data?.color || ''}`}>
                    {widget.data?.value || '-'}
                </div>
                {widget.data?.trend && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {widget.data.trend}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}