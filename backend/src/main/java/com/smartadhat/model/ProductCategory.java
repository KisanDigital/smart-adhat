package com.smartadhat.model;

public enum ProductCategory {
    WHEAT("Wheat", "गेहूं"),
    RICE("Rice", "चावल"),
    PULSES("Pulses", "दालें"),
    SARSO("Mustard", "सरसों"),
    BARLEY("Barley", "जौ"),
    CORN("Corn", "मक्का"),
    BAJRA("Pearl Millet", "बाजरा"),
    JOWAR("Sorghum", "ज्वार"),
    GRAM("Gram", "चना"),
    MOONG("Moong", "मूंग"),
    MASOOR("Lentil", "मसूर"),
    ARHAR("Pigeon Pea", "अरहर"),
    URAD("Black Gram", "उड़द"),
    SOYBEAN("Soybean", "सोयाबीन"),
    GROUNDNUT("Groundnut", "मूंगफली"),
    COTTON("Cotton", "कपास"),
    SUGARCANE("Sugarcane", "गन्ना"),
    OTHER("Other", "अन्य");

    private final String englishName;
    private final String hindiName;

    ProductCategory(String englishName, String hindiName) {
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

