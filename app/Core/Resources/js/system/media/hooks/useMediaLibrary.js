import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { keepPreviousData } from '@tanstack/react-query'; // Important pour une pagination fluide

export function useMediaLibrary({ page, search, type, collection } = {}) {
    
    // Fonction qui appelle ton API Backend
    const fetchMedia = async () => {
        // Construction des paramètres QueryBuilder
        const params = {
            page: page,
            filter: {},
            sort: 'created_at' // Tri par défaut
        };

        if (search) params.filter.search = search;
        if (type && type !== 'all') params.filter.type = type;
        if (collection && collection !== 'all') params.filter.collection = collection;

        const { data } = await axios.get('/admin/media', { params });
        return data; // Retourne l'objet paginé complet (data, links, meta)
    };

    return useQuery({
        // La clé unique dépend des filtres : si un filtre change, la requête se relance
        queryKey: ['media-library', page, search, type, collection],
        queryFn: fetchMedia,
        placeholderData: keepPreviousData, // Garde les anciennes données pendant le chargement de la page suivante
        staleTime: 5000, // Les données sont fraîches pendant 5 secondes
    });
}