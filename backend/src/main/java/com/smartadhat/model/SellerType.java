package com.smartadhat.model;

public enum SellerType {
    FARMER("Farmer", "किसान"),
    MIDDLEMAN("Middleman", "बिचौलिया"),
    OTHER_ADHAT("Other Adhat", "अन्य आढ़त"),
    TRADER("Trader", "व्यापारी");

    private final String englishName;
    private final String hindiName;

    SellerType(String englishName, String hindiName) {
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

