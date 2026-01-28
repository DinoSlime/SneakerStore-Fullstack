import axios from './axiosClient'; // Import file axios config của bạn

const orderService = {
    createOrder: (orderData) => {
        return axios.post('/orders', orderData);
    },
    getOrdersByUser: (userId) => {
        return axios.get(`/orders/user/${userId}`);
    },
    getOrderById: (orderId) => {
        return axios.get(`/orders/${orderId}`);
    }
};

export default orderService;