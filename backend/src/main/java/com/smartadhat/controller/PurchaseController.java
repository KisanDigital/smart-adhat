package com.smartadhat.controller;

import com.smartadhat.dto.PurchaseRequest;
import com.smartadhat.model.Purchase;
import com.smartadhat.security.JwtUtil;
import com.smartadhat.service.PurchaseService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/purchases")
@RequiredArgsConstructor
public class PurchaseController {

    private final PurchaseService purchaseService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<Purchase> createPurchase(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody PurchaseRequest request) {
        Long adhatId = jwtUtil.extractAdhatId(token.substring(7));
        return ResponseEntity.ok(purchaseService.createPurchase(adhatId, request));
    }

    @GetMapping
    public ResponseEntity<List<Purchase>> getPurchases(@RequestHeader("Authorization") String token) {
        Long adhatId = jwtUtil.extractAdhatId(token.substring(7));
        return ResponseEntity.ok(purchaseService.getAdhatPurchases(adhatId));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Purchase>> getPurchasesByDateRange(
            @RequestHeader("Authorization") String token,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long adhatId = jwtUtil.extractAdhatId(token.substring(7));
        return ResponseEntity.ok(purchaseService.getAdhatPurchasesByDateRange(adhatId, startDate, endDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Purchase> getPurchaseById(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        Long adhatId = jwtUtil.extractAdhatId(token.substring(7));
        return ResponseEntity.ok(purchaseService.getPurchaseById(id, adhatId));
    }
}

