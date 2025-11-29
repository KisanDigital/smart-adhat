package com.smartadhat.dto;

import com.smartadhat.model.PaymentStatus;
import com.smartadhat.model.SellerType;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PurchaseRequest {
    @NotNull
    private Long productId;

    @NotNull
    private BigDecimal quantity;

    @NotNull
    private BigDecimal pricePerUnit;

    @NotNull
    private String sellerName;

    @NotNull
    private SellerType sellerType;

    private String sellerPhone;
    private String vehicleNumber;
    private String driverName;
    private String driverPhone;

    @NotNull
    private LocalDate purchaseDate;

    private String billNumber;
    private String notes;
    private BigDecimal advancePaid;
    private PaymentStatus paymentStatus;
}

