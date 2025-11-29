package com.smartadhat.model;

public enum Unit {
    KG("Kilogram", "किलोग्राम", "kg"),
    QUINTAL("Quintal", "क्विंटल", "qtl"),
    TON("Ton", "टन", "ton"),
    BAG("Bag", "बोरी", "bag"),
    PIECE("Piece", "पीस", "pc");

    private final String englishName;
    private final String hindiName;
    private final String symbol;

    Unit(String englishName, String hindiName, String symbol) {
        this.englishName = englishName;
        this.hindiName = hindiName;
        this.symbol = symbol;
    }

    public String getEnglishName() {
        return englishName;
    }

    public String getHindiName() {
        return hindiName;
    }

    public String getSymbol() {
        return symbol;
    }
}

