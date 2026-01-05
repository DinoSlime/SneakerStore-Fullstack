package com.sneakerstore.backend.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProductDTO {
    
    private String name;
    
    private Float price;
    
    private String thumbnail;
    
    private String description;

    @JsonProperty("category_id")
    private Long categoryId;
}