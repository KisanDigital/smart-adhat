package com.smartadhat.controller;

import com.smartadhat.model.Inventory;
import com.smartadhat.security.JwtUtil;
import com.smartadhat.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<Inventory>> getInventory(@RequestHeader("Authorization") String token) {
        Long adhatId = jwtUtil.extractAdhatId(token.substring(7));
        return ResponseEntity.ok(inventoryService.getAdhatInventory(adhatId));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Inventory> getInventoryByProduct(
            @RequestHeader("Authorization") String token,
            @PathVariable Long productId) {
        Long adhatId = jwtUtil.extractAdhatId(token.substring(7));
        return ResponseEntity.ok(inventoryService.getInventoryByProduct(adhatId, productId));
    }
}

