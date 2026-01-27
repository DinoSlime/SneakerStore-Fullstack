import axiosClient from './axiosClient';

const categoryService = {
    getAll: () => {
        return axiosClient.get('/categories'); 
    }
};

export default categoryService;