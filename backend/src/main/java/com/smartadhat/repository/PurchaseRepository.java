package com.smartadhat.repository;

import com.smartadhat.model.Purchase;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface PurchaseRepository extends JpaRepository<Purchase, Long> {
    List<Purchase> findByAdhatId(Long adhatId);
    List<Purchase> findByAdhatIdOrderByPurchaseDateDesc(Long adhatId);
    List<Purchase> findByAdhatIdAndPurchaseDateBetween(Long adhatId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT p FROM Purchase p WHERE p.adhat.id = :adhatId AND p.product.id = :productId ORDER BY p.purchaseDate DESC")
    List<Purchase> findByAdhatIdAndProductId(Long adhatId, Long productId);
}

