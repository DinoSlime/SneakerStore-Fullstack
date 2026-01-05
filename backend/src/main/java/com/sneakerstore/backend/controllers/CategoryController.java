package com.sneakerstore.backend.controllers;

import com.sneakerstore.backend.models.Category;
import com.sneakerstore.backend.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("") // Khi ai đó gọi GET /api/categories
    public ResponseEntity<List<Category>> index() {
        List<Category> categories = categoryService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
}