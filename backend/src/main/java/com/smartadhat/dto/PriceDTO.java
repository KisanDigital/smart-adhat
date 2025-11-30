package com.smartadhat.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PriceDTO {
    private Long id;
    private Long productId;
    private String productName;
    private String productNameHindi;
    private String productUnit;
    private String categoryName;
    private String categoryNameHindi;
    private BigDecimal buyingPrice;
    private BigDecimal sellingPrice;
    private LocalDate effectiveDate;
    private String notes;
    private Boolean active;
}
