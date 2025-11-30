package com.smartadhat.service;

import com.smartadhat.model.Adhat;
import com.smartadhat.repository.AdhatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdhatService {

    private final AdhatRepository adhatRepository;

    public Adhat getAdhatByUsername(String username) {
        return adhatRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Adhat not found with username: " + username));
    }

    public Adhat getAdhatById(Long id) {
        return adhatRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Adhat not found"));
    }
}
