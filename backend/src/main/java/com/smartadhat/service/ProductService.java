package com.smartadhat.service;

import com.smartadhat.model.Category;
import com.smartadhat.model.Product;
import com.smartadhat.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findByActiveTrue();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }

    public List<Product> getProductsByCategory(Category category) {
        return productRepository.findByCategoryAndActiveTrue(category);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
}

