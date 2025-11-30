package com.smartadhat.repository;

import com.smartadhat.model.Category;
import com.smartadhat.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByActiveTrue();
    List<Product> findByCategory(Category category);
    List<Product> findByCategoryAndActiveTrue(Category category);
}
