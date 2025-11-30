package com.smartadhat.service;

import com.smartadhat.model.Adhat;
import com.smartadhat.model.Price;
import com.smartadhat.model.Product;
import com.smartadhat.repository.PriceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PriceService {

    private final PriceRepository priceRepository;

    public List<Price> getPricesByAdhat(Long adhatId) {
        return priceRepository.findByAdhatIdAndActiveTrue(adhatId);
    }

    public Price getPriceByAdhatAndProduct(Long adhatId, Long productId) {
        return priceRepository.findByAdhatIdAndProductIdAndActiveTrue(adhatId, productId)
                .orElse(null);
    }

    @Transactional
    public Price createOrUpdatePrice(Price price) {
        // Deactivate existing price for this adhat and product if exists
        priceRepository.findByAdhatIdAndProductIdAndActiveTrue(
                price.getAdhat().getId(),
                price.getProduct().getId()
        ).ifPresent(existingPrice -> {
            existingPrice.setActive(false);
            priceRepository.save(existingPrice);
        });

        // Save new price
        return priceRepository.save(price);
    }

    @Transactional
    public void deletePrice(Long id) {
        Price price = priceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Price not found"));
        price.setActive(false);
        priceRepository.save(price);
    }
}
