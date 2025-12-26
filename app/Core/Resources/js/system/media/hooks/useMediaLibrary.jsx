import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { keepPreviousData } from '@tanstack/react-query';

export function useMediaLibrary({ page, search, type, collection } = {}) {
    const fetchMedia = async () => {
        const params = {
            page: page,
            filter: {},
            sort: 'created_at'
        };

        if (search) params.filter.search = search;
        if (type && type !== 'all') params.filter.type = type;
        if (collection && collection !== 'all') params.filter.collection = collection;

        const { data } = await axios.get('/admin/media', { params });
        return data;
    };

    return useQuery({
        queryKey: ['media-library', page, search, type, collection],
        queryFn: fetchMedia,
        placeholderData: keepPreviousData,
        staleTime: 5000,
    });
}