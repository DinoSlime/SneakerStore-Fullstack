package com.sneakerstore.backend.services.impl;

import com.sneakerstore.backend.dtos.ProductDTO;
import com.sneakerstore.backend.models.Category;
import com.sneakerstore.backend.models.Product;
import com.sneakerstore.backend.repositories.CategoryRepository;
import com.sneakerstore.backend.repositories.ProductRepository;
import com.sneakerstore.backend.services.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Product createProduct(ProductDTO productDTO) throws Exception {
        Category existingCategory = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new Exception("Không tìm thấy Category với ID: " + productDTO.getCategoryId()));
        Product newProduct = Product.builder()
                .name(productDTO.getName())
                .price(productDTO.getPrice())
                .thumbnail(productDTO.getThumbnail())
                .description(productDTO.getDescription())
                .category(existingCategory)
                .build();

        return productRepository.save(newProduct);
    }

    @Override
    public Product getProductById(long id) throws Exception {
        return productRepository.findById(id)
                .orElseThrow(() -> new Exception("Không tìm thấy sản phẩm id: " + id));
    }

    @Override
    public Page<Product> getAllProducts(PageRequest pageRequest) {
        return productRepository.findAll(pageRequest);
    }

    @Override
    public Page<Product> searchProducts(String keyword, Float minPrice, Float maxPrice, PageRequest pageRequest) {

        return productRepository.searchProducts(keyword, minPrice, maxPrice, pageRequest);
    }
    @Override
    public void deleteProduct(long id) {
    if(productRepository.existsById(id)) {
        productRepository.deleteById(id);
    }
}
@Override
public Product updateProduct(Long id, ProductDTO productDTO) {
    Product existingProduct = productRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm có ID: " + id));

    existingProduct.setName(productDTO.getName());
    existingProduct.setPrice(productDTO.getPrice());
    existingProduct.setThumbnail(productDTO.getThumbnail());
    existingProduct.setDescription(productDTO.getDescription());


    if (productDTO.getCategoryId() != null) {
        Category category = categoryRepository.findById(productDTO.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Danh mục không tồn tại"));
        existingProduct.setCategory(category);
    }

    
    return productRepository.save(existingProduct);
}
}