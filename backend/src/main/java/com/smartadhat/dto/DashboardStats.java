package com.smartadhat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private BigDecimal totalInventoryValue;
    private Integer totalProducts;
    private List<LowStockItem> lowStockProducts;
    private BigDecimal todayPurchases;
    private BigDecimal todaySales;
    private BigDecimal monthPurchases;
    private BigDecimal monthSales;
    private BigDecimal monthProfit;
    private Integer pendingPaymentsCount;
    private BigDecimal pendingPaymentsAmount;
    private BigDecimal pendingPurchasePayments;
    private BigDecimal pendingSalePayments;
    private List<RecentTransaction> recentTransactions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class LowStockItem {
        private String productName;
        private BigDecimal quantity;
        private String unit;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class RecentTransaction {
        private String type; // PURCHASE or SALE
        private String productName;
        private String date;
        private String partyName;
        private BigDecimal amount;
        private BigDecimal quantity;
        private String unit;
    }
}

