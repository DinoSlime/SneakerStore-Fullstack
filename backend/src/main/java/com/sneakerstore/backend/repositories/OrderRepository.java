package com.sneakerstore.backend.repositories;

import com.sneakerstore.backend.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {
    // Sau này có thể thêm tìm kiếm theo user, status...
}
