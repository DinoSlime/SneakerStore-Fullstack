package com.sneakerstore.backend.controllers;

import com.sneakerstore.backend.dtos.ProductDTO;
import com.sneakerstore.backend.models.Product;
import com.sneakerstore.backend.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.hateoas.EntityModel;
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    // 1. Tạo sản phẩm mới
    @PostMapping("")
    public ResponseEntity<?> createProduct(@RequestBody ProductDTO productDTO) {
        try {
            Product newProduct = productService.createProduct(productDTO);
            return ResponseEntity.ok(newProduct);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // 2. Lấy danh sách (có phân trang)
    @GetMapping("")
    public ResponseEntity<?> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        PageRequest pageRequest = PageRequest.of(page, limit, Sort.by("createdAt").descending());
        Page<Product> productPage = productService.getAllProducts(pageRequest);
        return ResponseEntity.ok(productPage.getContent());
    }

    @GetMapping("/{id}")
    public EntityModel<Product> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            
            return EntityModel.of(product,
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProductController.class).getProductById(id)).withSelfRel(),
                WebMvcLinkBuilder.linkTo(WebMvcLinkBuilder.methodOn(ProductController.class).getAllProducts(0, 10)).withRel("list-products")
            );
        } catch (Exception e) {
            return null; 
        }
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> searchProducts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") Float minPrice,
            @RequestParam(defaultValue = "100000000") Float maxPrice,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int limit
    ) {
        PageRequest pageRequest = PageRequest.of(page, limit);
        Page<Product> result = productService.searchProducts(keyword, minPrice, maxPrice, pageRequest);
        return ResponseEntity.ok(result.getContent());
    }
}