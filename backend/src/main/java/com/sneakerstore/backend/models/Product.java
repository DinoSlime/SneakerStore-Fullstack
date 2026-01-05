package com.sneakerstore.backend.models;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "products")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product extends BaseEntity {

    @Column(nullable = false, length = 350)
    private String name;

    private Float price;

    private String thumbnail;

    @Column(columnDefinition = "TEXT") // Để lưu mô tả dài
    private String description;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;
}