import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { __ } from '@/common/lib/i18n'; //
import * as Icons from "lucide-react";
import { GripVertical,Settings2, EyeOff, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { Button } from '@/ui/button';
import { DashboardSkeleton } from './DashboardSkeleton';

import {
    DndContext, 
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    rectSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export default function DashboardPage() {
    
    const queryClient = useQueryClient();
    const [items, setItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    // Chargement des widgets
    const { data: initialWidgets, isLoading, isError } = useQuery({
        queryKey: ['dashboard-widgets'],
        queryFn: async () => {
            const res = await axios.get('/api/admin/dashboard/widgets');
            return res.data.data;
        },
    });

    useEffect(() => {
        if (initialWidgets) setItems(initialWidgets);
    }, [initialWidgets]);

    // Mutation pour sauvegarder l'ordre
    const reorderMutation = useMutation({
        mutationFn: (newOrder) => axios.post('/api/admin/dashboard/reorder', { widgets: newOrder }),
        onError: () => queryClient.invalidateQueries(['dashboard-widgets'])
    });

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (active.id !== over.id) {
            setItems((items) => {
                const oldIndex = items.findIndex((item) => item.key === active.id);
                const newIndex = items.findIndex((item) => item.key === over.id);
                const newItems = arrayMove(items, oldIndex, newIndex);
                
                // Sauvegarde silencieuse
                reorderMutation.mutate(newItems.map((w, index) => ({ key: w.key, order: index + 1 })));
                return newItems;
            });
        }
    };

    if (isLoading && items.length === 0) return <DashboardSkeleton />;
    if (isError) return <div className="p-10 text-red-500">{__('Erreur de chargement.')}</div>;

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight mb-6">{__('dashboard')}</h2>
                <div className="flex gap-2">
                    <Button 
                        className="cursor-pointer capitalize"
                        variant={isEditing ? "default" : "outline"} 
                        size="sm" 
                        onClick={() => setIsEditing(!isEditing)}
                    >
                        {isEditing ? <Check className="w-4 h-4 mr-2" /> : <Settings2 className="w-4 h-4 mr-2" />}
                        {isEditing ? __('Terminer') : __('Personnaliser')}
                    </Button>
                </div>
                {reorderMutation.isPending && <span className="text-xs text-zinc-400">{__('saving')}</span>}
            </div>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={items.map(i => i.key)} strategy={rectSortingStrategy}>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {items.map((widget) => (
                            <SortableWidget key={widget.key} widget={widget} isEditing={isEditing} 
                                onHide={() => handleHide(widget.key)}/>
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    );
}

function SortableWidget({ widget, isEditing, onHide }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: widget.key });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        opacity: isDragging ? 0.8 : 1,
    };

    const IconComponent = Icons[widget.icon] || Icons.Circle;
    const colSpanClass = widget.width > 1 ? `lg:col-span-${widget.width}` : '';

    return (
        <Card ref={setNodeRef} style={style} className={`${colSpanClass} group relative hover:shadow-md transition-shadow`}>
            <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                    {isEditing && <GripVertical {...attributes} {...listeners} className="cursor-grab" />}
                    {__(widget.title)}
                </CardTitle>
                {isEditing && (
                    <Button variant="ghost" size="icon" onClick={onHide}>
                        <EyeOff className="h-4 w-4 text-zinc-400" />
                    </Button>
                )}
            </CardHeader>
            <CardContent>
                <div className={`text-2xl font-bold ${widget.data?.color || ''}`}>
                    {widget.data?.value || '-'}
                </div>
                {widget.data?.trend && (
                    <p className="text-xs text-muted-foreground mt-1">{widget.data.trend}</p>
                )}
            </CardContent>
        </Card>
    );
}