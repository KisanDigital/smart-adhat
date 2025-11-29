package com.smartadhat.model;

public enum BuyerType {
    MILL("Mill", "मिल"),
    TRADER("Trader", "व्यापारी"),
    OTHER_ADHAT("Other Adhat", "अन्य आढ़त"),
    WHOLESALER("Wholesaler", "थोक व्यापारी"),
    EXPORTER("Exporter", "निर्यातक");

    private final String englishName;
    private final String hindiName;

    BuyerType(String englishName, String hindiName) {
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

