package com.smartadhat.service;

import com.smartadhat.model.Category;
import com.smartadhat.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public List<Category> getActiveCategories() {
        return categoryRepository.findByActiveTrue();
    }

    public Category getCategoryById(Long id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
    }

    public Category getCategoryByName(String name) {
        return categoryRepository.findByName(name)
                .orElseThrow(() -> new RuntimeException("Category not found with name: " + name));
    }

    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category already exists with name: " + category.getName());
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = getCategoryById(id);

        // Check if name is being changed and if it already exists
        if (!category.getName().equals(categoryDetails.getName()) &&
            categoryRepository.existsByName(categoryDetails.getName())) {
            throw new RuntimeException("Category already exists with name: " + categoryDetails.getName());
        }

        category.setName(categoryDetails.getName());
        category.setNameHindi(categoryDetails.getNameHindi());
        category.setDescription(categoryDetails.getDescription());
        category.setActive(categoryDetails.getActive());

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        Category category = getCategoryById(id);
        category.setActive(false);
        categoryRepository.save(category);
    }
}

