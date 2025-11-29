package com.smartadhat.controller;

import com.smartadhat.dto.DashboardStats;
import com.smartadhat.security.JwtUtil;
import com.smartadhat.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final JwtUtil jwtUtil;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getDashboardStats(@RequestHeader("Authorization") String token) {
        Long adhatId = jwtUtil.extractAdhatId(token.substring(7));
        return ResponseEntity.ok(dashboardService.getDashboardStats(adhatId));
    }
}

