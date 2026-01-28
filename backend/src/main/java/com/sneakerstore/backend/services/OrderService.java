package com.sneakerstore.backend.services;

import com.sneakerstore.backend.dtos.OrderDTO;
import com.sneakerstore.backend.models.Order;

public interface OrderService {
    Order createOrder(OrderDTO orderDTO) throws Exception;
}