import { Button } from "@ui/button";
import { Check, Eye, FileText, Trash2 } from "lucide-react";

export const MediaItem = ({ file, isSelected, onToggle, onPreview, onDelete }) => (
    <div 
        onClick={() => onToggle(file)}
        className={`group relative aspect-square border-2 rounded-lg overflow-hidden cursor-pointer transition-all ${
            isSelected ? 'border-primary ring-2 ring-primary/20' : 'border-zinc-200'
        }`}
    >
        {file.mime_type.startsWith('image/') ? (
            <img src={file.thumbnail || file.url} className="w-full h-full object-cover" alt="" />
        ) : (
            <div className="flex flex-col items-center justify-center h-full bg-zinc-50 dark:bg-zinc-900">
                <FileText className="w-10 h-10 text-zinc-300" />
            </div>
        )}

        {/* Overlay Actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full" onClick={(e) => { e.stopPropagation(); onPreview(file); }}>
                <Eye className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full" onClick={(e) => onDelete(e, file.id)}>
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
        
        {isSelected && (
            <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1 shadow-lg">
                <Check className="w-3 h-3" />
            </div>
        )}
    </div>
);