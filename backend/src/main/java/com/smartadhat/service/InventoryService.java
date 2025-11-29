package com.smartadhat.service;

import com.smartadhat.model.Inventory;
import com.smartadhat.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryService {

    private final InventoryRepository inventoryRepository;

    public List<Inventory> getAdhatInventory(Long adhatId) {
        return inventoryRepository.findByAdhatId(adhatId);
    }

    public Inventory getInventoryByProduct(Long adhatId, Long productId) {
        return inventoryRepository.findByAdhatIdAndProductId(adhatId, productId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
    }
}

