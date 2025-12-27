import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { keepPreviousData } from '@tanstack/react-query';

export function useMediaLibrary(filters) {
    const params = {
        'filter[search]': filters.search,
        'filter[collection]': filters.collection !== 'all' ? filters.collection : null,
        'filter[type]': filters.type,
        'trashed': filters.trashed,
        'page': filters.page
    };

    return useQuery({
        queryKey: ['media-library', filters],
        queryFn: async () => {
            const response = await axios.get('/admin/media', { params });
            return response.data;
        }
    });
}