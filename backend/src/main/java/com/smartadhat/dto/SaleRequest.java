package com.smartadhat.dto;

import com.smartadhat.model.BuyerType;
import com.smartadhat.model.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SaleRequest {
    @NotNull
    private Long productId;

    @NotNull
    private BigDecimal quantity;

    @NotNull
    private BigDecimal pricePerUnit;

    @NotNull
    private String buyerName;

    @NotNull
    private BuyerType buyerType;

    private String buyerPhone;
    private String vehicleNumber;
    private String driverName;
    private String driverPhone;

    @NotNull
    private LocalDate saleDate;

    private String billNumber;
    private String notes;
    private BigDecimal advanceReceived;
    private PaymentStatus paymentStatus;
}

