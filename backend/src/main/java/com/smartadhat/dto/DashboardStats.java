package com.smartadhat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private BigDecimal totalInventoryValue;
    private Integer totalProducts;
    private Integer lowStockProducts;
    private BigDecimal todayPurchases;
    private BigDecimal todaySales;
    private BigDecimal monthPurchases;
    private BigDecimal monthSales;
    private BigDecimal monthProfit;
    private Integer pendingPaymentsCount;
    private BigDecimal pendingPaymentsAmount;
}

