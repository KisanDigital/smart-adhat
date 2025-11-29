package com.smartadhat.repository;

import com.smartadhat.model.Price;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PriceRepository extends JpaRepository<Price, Long> {
    List<Price> findByAdhatIdAndActiveTrue(Long adhatId);
    Optional<Price> findByAdhatIdAndProductIdAndActiveTrue(Long adhatId, Long productId);
    List<Price> findByProductIdAndActiveTrue(Long productId);
}

