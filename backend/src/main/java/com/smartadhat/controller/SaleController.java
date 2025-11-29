package com.smartadhat.controller;

import com.smartadhat.dto.SaleRequest;
import com.smartadhat.model.Sale;
import com.smartadhat.security.JwtUtil;
import com.smartadhat.service.SaleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<Sale> createSale(
            @RequestHeader("Authorization") String token,
            @Valid @RequestBody SaleRequest request) {
        Long adhatId = jwtUtil.extractAdhatId(token.substring(7));
        return ResponseEntity.ok(saleService.createSale(adhatId, request));
    }

    @GetMapping
    public ResponseEntity<List<Sale>> getSales(@RequestHeader("Authorization") String token) {
        Long adhatId = jwtUtil.extractAdhatId(token.substring(7));
        return ResponseEntity.ok(saleService.getAdhatSales(adhatId));
    }

    @GetMapping("/filter")
    public ResponseEntity<List<Sale>> getSalesByDateRange(
            @RequestHeader("Authorization") String token,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {
        Long adhatId = jwtUtil.extractAdhatId(token.substring(7));
        return ResponseEntity.ok(saleService.getAdhatSalesByDateRange(adhatId, startDate, endDate));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Sale> getSaleById(
            @RequestHeader("Authorization") String token,
            @PathVariable Long id) {
        Long adhatId = jwtUtil.extractAdhatId(token.substring(7));
        return ResponseEntity.ok(saleService.getSaleById(id, adhatId));
    }
}

