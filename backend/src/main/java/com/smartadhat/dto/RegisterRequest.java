package com.smartadhat.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {
    @NotBlank
    private String username;

    @NotBlank
    private String password;

    @NotBlank
    private String registrationSecret;

    @NotBlank
    private String shopName;

    @NotBlank
    private String ownerName;

    @NotBlank
    private String phone;

    @Email
    private String email;

    private String address;
    private String city;
    private String state;
    private String pincode;
    private String gstNumber;
    private String licenseNumber;
}

