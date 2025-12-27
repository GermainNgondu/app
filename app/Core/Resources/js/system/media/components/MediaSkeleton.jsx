// app/Core/Resources/js/system/media/components/MediaSkeleton.jsx
import React from 'react';

export const MediaSkeleton = () => (
    <div className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800 animate-pulse flex flex-col p-3 gap-2">
        <div className="flex-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg" />
        <div className="h-3 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mx-auto" />
    </div>
);