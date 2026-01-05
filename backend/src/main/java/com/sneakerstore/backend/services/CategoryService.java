package com.sneakerstore.backend.services;

import com.sneakerstore.backend.models.Category;
import com.sneakerstore.backend.repositories.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor // Tự động tạo Constructor để nhúng Repository vào (Dependency Injection)
public class CategoryService {
    
    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}