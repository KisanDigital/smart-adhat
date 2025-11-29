package com.smartadhat.model;

public enum PaymentStatus {
    PENDING("Pending", "बकाया"),
    PARTIAL("Partial", "आंशिक"),
    COMPLETED("Completed", "पूर्ण"),
    CANCELLED("Cancelled", "रद्द");

    private final String englishName;
    private final String hindiName;

    PaymentStatus(String englishName, String hindiName) {
        this.englishName = englishName;
        this.hindiName = hindiName;
    }

    public String getEnglishName() {
        return englishName;
    }

    public String getHindiName() {
        return hindiName;
    }
}

