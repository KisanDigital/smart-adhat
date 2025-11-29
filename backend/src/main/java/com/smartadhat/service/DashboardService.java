package com.smartadhat.service;

import com.smartadhat.dto.DashboardStats;
import com.smartadhat.model.PaymentStatus;
import com.smartadhat.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final InventoryRepository inventoryRepository;
    private final PurchaseRepository purchaseRepository;
    private final SaleRepository saleRepository;

    public DashboardStats getDashboardStats(Long adhatId) {
        DashboardStats stats = new DashboardStats();

        // Inventory stats
        var inventories = inventoryRepository.findByAdhatId(adhatId);
        BigDecimal totalValue = inventories.stream()
                .map(inv -> inv.getTotalValue() != null ? inv.getTotalValue() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.setTotalInventoryValue(totalValue);
        stats.setTotalProducts(inventories.size());

        long lowStock = inventories.stream()
                .filter(inv -> inv.getMinimumStockLevel() != null &&
                        inv.getQuantity().compareTo(inv.getMinimumStockLevel()) <= 0)
                .count();
        stats.setLowStockProducts((int) lowStock);

        // Today's transactions
        LocalDate today = LocalDate.now();
        var todayPurchases = purchaseRepository.findByAdhatIdAndPurchaseDateBetween(adhatId, today, today);
        BigDecimal todayPurchaseAmount = todayPurchases.stream()
                .map(p -> p.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTodayPurchases(todayPurchaseAmount);

        var todaySales = saleRepository.findByAdhatIdAndSaleDateBetween(adhatId, today, today);
        BigDecimal todaySaleAmount = todaySales.stream()
                .map(s -> s.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTodaySales(todaySaleAmount);

        // Month's transactions
        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
        LocalDate monthEnd = LocalDate.now();

        var monthPurchases = purchaseRepository.findByAdhatIdAndPurchaseDateBetween(adhatId, monthStart, monthEnd);
        BigDecimal monthPurchaseAmount = monthPurchases.stream()
                .map(p -> p.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setMonthPurchases(monthPurchaseAmount);

        var monthSales = saleRepository.findByAdhatIdAndSaleDateBetween(adhatId, monthStart, monthEnd);
        BigDecimal monthSaleAmount = monthSales.stream()
                .map(s -> s.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setMonthSales(monthSaleAmount);
        stats.setMonthProfit(monthSaleAmount.subtract(monthPurchaseAmount));

        // Pending payments
        var allPurchases = purchaseRepository.findByAdhatId(adhatId);
        long pendingCount = allPurchases.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.PENDING ||
                        p.getPaymentStatus() == PaymentStatus.PARTIAL)
                .count();

        BigDecimal pendingAmount = allPurchases.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.PENDING ||
                        p.getPaymentStatus() == PaymentStatus.PARTIAL)
                .map(p -> p.getBalanceAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.setPendingPaymentsCount((int) pendingCount);
        stats.setPendingPaymentsAmount(pendingAmount);

        return stats;
    }
}

