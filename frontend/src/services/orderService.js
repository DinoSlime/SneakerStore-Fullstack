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
    },
    getAllOrders: () => {
        return axios.get('/orders/admin/get-all');
    },
    updateOrderStatus: (orderId, status) => {
        // Gọi PUT /api/orders/admin/update-status/1?status=SHIPPING
        return axios.put(`/orders/admin/update-status/${orderId}`, null, {
            params: { status }
        });
    }
};

export default orderService;