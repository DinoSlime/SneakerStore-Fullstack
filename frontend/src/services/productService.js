import axiosClient from './axiosClient'; 

const productService = {
    getAll: (params) => {
        return axiosClient.get('/products', { params });
    },
    
    search: (keyword, minPrice, maxPrice) => {
        return axiosClient.get('/products/search', { 
            params: { keyword, minPrice, maxPrice, page: 0, limit: 100 } 
        });
    },

    getById: (id) => {
        return axiosClient.get(`/products/${id}`);
    }
};

export default productService;