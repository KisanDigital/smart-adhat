package com.smartadhat.controller;

import com.smartadhat.dto.PriceDTO;
import com.smartadhat.model.Adhat;
import com.smartadhat.model.Price;
import com.smartadhat.model.Product;
import com.smartadhat.service.AdhatService;
import com.smartadhat.service.PriceService;
import com.smartadhat.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/prices")
@RequiredArgsConstructor
public class PriceController {

    private final PriceService priceService;
    private final AdhatService adhatService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<List<PriceDTO>> getMyPrices(Authentication authentication) {
        String username = authentication.getName();
        Adhat adhat = adhatService.getAdhatByUsername(username);
        
        List<Price> prices = priceService.getPricesByAdhat(adhat.getId());
        List<PriceDTO> priceDTOs = prices.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(priceDTOs);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<PriceDTO> getPriceByProduct(
            @PathVariable Long productId,
            Authentication authentication) {
        String username = authentication.getName();
        Adhat adhat = adhatService.getAdhatByUsername(username);
        
        Price price = priceService.getPriceByAdhatAndProduct(adhat.getId(), productId);
        if (price == null) {
            return ResponseEntity.notFound().build();
        }
        
        return ResponseEntity.ok(convertToDTO(price));
    }

    @PostMapping
    public ResponseEntity<PriceDTO> createOrUpdatePrice(
            @RequestBody PriceDTO priceDTO,
            Authentication authentication) {
        String username = authentication.getName();
        Adhat adhat = adhatService.getAdhatByUsername(username);
        Product product = productService.getProductById(priceDTO.getProductId());

        Price price = new Price();
        price.setAdhat(adhat);
        price.setProduct(product);
        price.setBuyingPrice(priceDTO.getBuyingPrice());
        price.setSellingPrice(priceDTO.getSellingPrice());
        price.setEffectiveDate(priceDTO.getEffectiveDate());
        price.setNotes(priceDTO.getNotes());
        price.setActive(true);

        Price savedPrice = priceService.createOrUpdatePrice(price);
        return ResponseEntity.ok(convertToDTO(savedPrice));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrice(@PathVariable Long id) {
        priceService.deletePrice(id);
        return ResponseEntity.noContent().build();
    }

    private PriceDTO convertToDTO(Price price) {
        PriceDTO dto = new PriceDTO();
        dto.setId(price.getId());
        dto.setProductId(price.getProduct().getId());
        dto.setProductName(price.getProduct().getName());
        dto.setProductNameHindi(price.getProduct().getNameHindi());
        dto.setProductUnit(price.getProduct().getUnit().name());
        dto.setCategoryName(price.getProduct().getCategory().getName());
        dto.setCategoryNameHindi(price.getProduct().getCategory().getNameHindi());
        dto.setBuyingPrice(price.getBuyingPrice());
        dto.setSellingPrice(price.getSellingPrice());
        dto.setEffectiveDate(price.getEffectiveDate());
        dto.setNotes(price.getNotes());
        dto.setActive(price.getActive());
        return dto;
    }
}
