import axios from "axios";

const key = '39910559-6f4db783475ee10502c3de09e';

export const perPage = 40;

export function search(q, page = 1) {
    const config = {
        params: {
            key,
            q,
            page,
            per_page: perPage,
            image_type: 'photo',
            orientation: 'horizontal',
            safesearch: true,
        },
    };

    return axios.get('https://pixabay.com/api/', config);
} 