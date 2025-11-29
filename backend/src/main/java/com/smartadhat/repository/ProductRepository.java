package com.smartadhat.repository;

import com.smartadhat.model.Product;
import com.smartadhat.model.ProductCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    List<Product> findByCategory(ProductCategory category);
    List<Product> findByCategoryAndActiveTrue(ProductCategory category);
}
