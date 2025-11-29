package com.smartadhat.repository;

import com.smartadhat.model.Sale;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByAdhatId(Long adhatId);
    List<Sale> findByAdhatIdOrderBySaleDateDesc(Long adhatId);
    List<Sale> findByAdhatIdAndSaleDateBetween(Long adhatId, LocalDate startDate, LocalDate endDate);

    @Query("SELECT s FROM Sale s WHERE s.adhat.id = :adhatId AND s.product.id = :productId ORDER BY s.saleDate DESC")
    List<Sale> findByAdhatIdAndProductId(Long adhatId, Long productId);
}

