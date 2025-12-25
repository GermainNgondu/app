export function MultiImagePicker({ label, values = [], onChange }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-4">
            <Label>{label}</Label>
            
            <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
                {/* Liste des images sélectionnées */}
                {values.map((url, index) => (
                    <div key={index} className="relative aspect-square rounded-lg border overflow-hidden group">
                        <img src={url} className="w-full h-full object-cover" />
                        <button 
                            onClick={() => onChange(values.filter((_, i) => i !== index))}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </div>
                ))}

                {/* Bouton pour ajouter */}
                <button 
                    type="button"
                    onClick={() => setOpen(true)}
                    className="flex cursor-pointer flex-col items-center justify-center border-2 border-dashed rounded-lg aspect-square hover:bg-zinc-50 transition"
                >
                    <Plus className="w-6 h-6 text-zinc-400" />
                    <span className="text-[10px] uppercase font-bold text-zinc-500 mt-2">{__('Ajouter')}</span>
                </button>
            </div>

            <MediaLibraryModal 
                open={open} 
                onOpenChange={setOpen} 
                multiple={true} 
                onSelect={(urls) => onChange([...values, ...urls])}
            />
        </div>
    );
}