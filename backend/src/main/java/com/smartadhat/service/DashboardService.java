package com.smartadhat.service;

import com.smartadhat.dto.DashboardStats;
import com.smartadhat.model.PaymentStatus;
import com.smartadhat.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

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

        // Low stock products
        List<DashboardStats.LowStockItem> lowStockItems = inventories.stream()
                .filter(inv -> inv.getMinimumStockLevel() != null &&
                        inv.getQuantity().compareTo(inv.getMinimumStockLevel()) <= 0)
                .map(inv -> new DashboardStats.LowStockItem(
                        inv.getProduct().getName(),
                        inv.getQuantity(),
                        inv.getProduct().getUnit().name()
                ))
                .collect(Collectors.toList());
        stats.setLowStockProducts(lowStockItems);

        // Today's transactions
        LocalDate today = LocalDate.now();
        var todayPurchases = purchaseRepository.findByAdhatIdAndPurchaseDateBetween(adhatId, today, today);
        BigDecimal todayPurchaseAmount = todayPurchases.stream()
                .map(p -> p.getTotalAmount() != null ? p.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTodayPurchases(todayPurchaseAmount);

        var todaySales = saleRepository.findByAdhatIdAndSaleDateBetween(adhatId, today, today);
        BigDecimal todaySaleAmount = todaySales.stream()
                .map(s -> s.getTotalAmount() != null ? s.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setTodaySales(todaySaleAmount);

        // Month's transactions
        LocalDate monthStart = LocalDate.now().withDayOfMonth(1);
        LocalDate monthEnd = LocalDate.now();

        var monthPurchases = purchaseRepository.findByAdhatIdAndPurchaseDateBetween(adhatId, monthStart, monthEnd);
        BigDecimal monthPurchaseAmount = monthPurchases.stream()
                .map(p -> p.getTotalAmount() != null ? p.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setMonthPurchases(monthPurchaseAmount);

        var monthSales = saleRepository.findByAdhatIdAndSaleDateBetween(adhatId, monthStart, monthEnd);
        BigDecimal monthSaleAmount = monthSales.stream()
                .map(s -> s.getTotalAmount() != null ? s.getTotalAmount() : BigDecimal.ZERO)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.setMonthSales(monthSaleAmount);
        stats.setMonthProfit(monthSaleAmount.subtract(monthPurchaseAmount));

        // Pending payments - Purchases
        var allPurchases = purchaseRepository.findByAdhatId(adhatId);
        long pendingPurchaseCount = allPurchases.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.PENDING ||
                        p.getPaymentStatus() == PaymentStatus.PARTIAL)
                .count();

        BigDecimal pendingPurchaseAmount = allPurchases.stream()
                .filter(p -> p.getPaymentStatus() == PaymentStatus.PENDING ||
                        p.getPaymentStatus() == PaymentStatus.PARTIAL)
                .map(p -> {
                    if (p.getBalanceAmount() != null) {
                        return p.getBalanceAmount();
                    } else if (p.getTotalAmount() != null && p.getAdvancePaid() != null) {
                        return p.getTotalAmount().subtract(p.getAdvancePaid());
                    } else if (p.getTotalAmount() != null) {
                        return p.getTotalAmount();
                    }
                    return BigDecimal.ZERO;
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.setPendingPurchasePayments(pendingPurchaseAmount);

        // Pending payments - Sales
        var allSales = saleRepository.findByAdhatId(adhatId);
        long pendingSaleCount = allSales.stream()
                .filter(s -> s.getPaymentStatus() == PaymentStatus.PENDING ||
                        s.getPaymentStatus() == PaymentStatus.PARTIAL)
                .count();

        BigDecimal pendingSaleAmount = allSales.stream()
                .filter(s -> s.getPaymentStatus() == PaymentStatus.PENDING ||
                        s.getPaymentStatus() == PaymentStatus.PARTIAL)
                .map(s -> {
                    if (s.getBalanceAmount() != null) {
                        return s.getBalanceAmount();
                    } else if (s.getTotalAmount() != null && s.getAdvanceReceived() != null) {
                        return s.getTotalAmount().subtract(s.getAdvanceReceived());
                    } else if (s.getTotalAmount() != null) {
                        return s.getTotalAmount();
                    }
                    return BigDecimal.ZERO;
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        stats.setPendingSalePayments(pendingSaleAmount);

        stats.setPendingPaymentsCount((int) (pendingPurchaseCount + pendingSaleCount));
        stats.setPendingPaymentsAmount(pendingPurchaseAmount.add(pendingSaleAmount));

        // Recent transactions (last 10)
        List<DashboardStats.RecentTransaction> recentTransactions = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        // Add recent purchases
        allPurchases.stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .limit(5)
                .forEach(p -> recentTransactions.add(new DashboardStats.RecentTransaction(
                        "PURCHASE",
                        p.getProduct().getName(),
                        p.getPurchaseDate().format(formatter),
                        p.getSellerName(),
                        p.getTotalAmount(),
                        p.getQuantity(),
                        p.getProduct().getUnit().name()
                )));

        // Add recent sales
        allSales.stream()
                .sorted((s1, s2) -> s2.getCreatedAt().compareTo(s1.getCreatedAt()))
                .limit(5)
                .forEach(s -> recentTransactions.add(new DashboardStats.RecentTransaction(
                        "SALE",
                        s.getProduct().getName(),
                        s.getSaleDate().format(formatter),
                        s.getBuyerName(),
                        s.getTotalAmount(),
                        s.getQuantity(),
                        s.getProduct().getUnit().name()
                )));

        // Sort by date and limit to 10
        recentTransactions.sort((t1, t2) -> t2.getDate().compareTo(t1.getDate()));
        stats.setRecentTransactions(recentTransactions.stream().limit(10).collect(Collectors.toList()));

        return stats;
    }
}

