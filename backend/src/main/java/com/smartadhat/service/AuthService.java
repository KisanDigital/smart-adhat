package com.smartadhat.service;

import com.smartadhat.dto.LoginRequest;
import com.smartadhat.dto.LoginResponse;
import com.smartadhat.dto.RegisterRequest;
import com.smartadhat.model.Adhat;
import com.smartadhat.repository.AdhatRepository;
import com.smartadhat.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AdhatRepository adhatRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public LoginResponse register(RegisterRequest request) {
        // Validate registration secret
        String requiredSecret = System.getenv("REGISTRATION_SECRET");
        if (requiredSecret == null || requiredSecret.isEmpty()) {
            requiredSecret = "smartadhat2025"; // Default secret
        }
        
        if (!requiredSecret.equals(request.getRegistrationSecret())) {
            throw new RuntimeException("Invalid registration secret");
        }
        
        if (adhatRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (request.getEmail() != null && adhatRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Adhat adhat = new Adhat();
        adhat.setUsername(request.getUsername());
        adhat.setPassword(passwordEncoder.encode(request.getPassword()));
        adhat.setShopName(request.getShopName());
        adhat.setOwnerName(request.getOwnerName());
        adhat.setPhone(request.getPhone());
        adhat.setEmail(request.getEmail());
        adhat.setAddress(request.getAddress());
        adhat.setCity(request.getCity());
        adhat.setState(request.getState());
        adhat.setPincode(request.getPincode());
        adhat.setGstNumber(request.getGstNumber());
        adhat.setLicenseNumber(request.getLicenseNumber());
        adhat.setActive(true);
        adhat.setPublicPriceVisible(false);

        adhat = adhatRepository.save(adhat);

        String token = jwtUtil.generateToken(adhat.getUsername(), adhat.getId());

        return new LoginResponse(token, adhat.getUsername(), adhat.getShopName(), adhat.getId());
    }

    public LoginResponse login(LoginRequest request) {
        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        Adhat adhat = adhatRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(adhat.getUsername(), adhat.getId());

        return new LoginResponse(token, adhat.getUsername(), adhat.getShopName(), adhat.getId());
    }
}

