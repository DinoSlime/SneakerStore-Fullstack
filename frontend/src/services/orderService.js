import axios from './axiosClient'; // Import file axios config của bạn

const orderService = {
    createOrder: (orderData) => {
        return axios.post('/orders', orderData);
    }
};

export default orderService;