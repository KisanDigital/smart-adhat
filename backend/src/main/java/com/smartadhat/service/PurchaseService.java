package com.smartadhat.service;

import com.smartadhat.dto.PurchaseRequest;
import com.smartadhat.model.*;
import com.smartadhat.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseService {

    private final PurchaseRepository purchaseRepository;
    private final InventoryRepository inventoryRepository;
    private final AdhatRepository adhatRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Purchase createPurchase(Long adhatId, PurchaseRequest request) {
        Adhat adhat = adhatRepository.findById(adhatId)
                .orElseThrow(() -> new RuntimeException("Adhat not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Calculate total amount
        BigDecimal totalAmount = request.getQuantity().multiply(request.getPricePerUnit());

        // Create purchase
        Purchase purchase = new Purchase();
        purchase.setAdhat(adhat);
        purchase.setProduct(product);
        purchase.setQuantity(request.getQuantity());
        purchase.setPricePerUnit(request.getPricePerUnit());
        purchase.setTotalAmount(totalAmount);
        purchase.setSellerName(request.getSellerName());
        purchase.setSellerType(request.getSellerType());
        purchase.setSellerPhone(request.getSellerPhone());
        purchase.setVehicleNumber(request.getVehicleNumber());
        purchase.setDriverName(request.getDriverName());
        purchase.setDriverPhone(request.getDriverPhone());
        purchase.setPurchaseDate(request.getPurchaseDate());
        purchase.setBillNumber(request.getBillNumber());
        purchase.setNotes(request.getNotes());
        purchase.setAdvancePaid(request.getAdvancePaid());

        // Calculate balance
        BigDecimal advancePaid = request.getAdvancePaid() != null ? request.getAdvancePaid() : BigDecimal.ZERO;
        purchase.setBalanceAmount(totalAmount.subtract(advancePaid));

        // Set payment status
        if (request.getPaymentStatus() != null) {
            purchase.setPaymentStatus(request.getPaymentStatus());
        } else if (advancePaid.compareTo(BigDecimal.ZERO) == 0) {
            purchase.setPaymentStatus(PaymentStatus.PENDING);
        } else if (advancePaid.compareTo(totalAmount) >= 0) {
            purchase.setPaymentStatus(PaymentStatus.COMPLETED);
        } else {
            purchase.setPaymentStatus(PaymentStatus.PARTIAL);
        }

        purchase = purchaseRepository.save(purchase);

        // Update inventory
        updateInventoryAfterPurchase(adhat, product, request.getQuantity(), request.getPricePerUnit());

        return purchase;
    }

    private void updateInventoryAfterPurchase(Adhat adhat, Product product, BigDecimal quantity, BigDecimal pricePerUnit) {
        Inventory inventory = inventoryRepository.findByAdhatIdAndProductId(adhat.getId(), product.getId())
                .orElseGet(() -> {
                    Inventory newInventory = new Inventory();
                    newInventory.setAdhat(adhat);
                    newInventory.setProduct(product);
                    newInventory.setQuantity(BigDecimal.ZERO);
                    return newInventory;
                });

        // Calculate new average price and quantity
        BigDecimal currentValue = inventory.getQuantity().multiply(
                inventory.getAverageBuyPrice() != null ? inventory.getAverageBuyPrice() : BigDecimal.ZERO);
        BigDecimal newValue = quantity.multiply(pricePerUnit);
        BigDecimal newQuantity = inventory.getQuantity().add(quantity);

        if (newQuantity.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal newAveragePrice = currentValue.add(newValue).divide(newQuantity, 2, BigDecimal.ROUND_HALF_UP);
            inventory.setAverageBuyPrice(newAveragePrice);
        }

        inventory.setQuantity(newQuantity);
        inventory.setTotalValue(currentValue.add(newValue));

        inventoryRepository.save(inventory);
    }

    public List<Purchase> getAdhatPurchases(Long adhatId) {
        return purchaseRepository.findByAdhatIdOrderByPurchaseDateDesc(adhatId);
    }

    public List<Purchase> getAdhatPurchasesByDateRange(Long adhatId, LocalDate startDate, LocalDate endDate) {
        return purchaseRepository.findByAdhatIdAndPurchaseDateBetween(adhatId, startDate, endDate);
    }

    public Purchase getPurchaseById(Long id, Long adhatId) {
        Purchase purchase = purchaseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Purchase not found"));

        if (!purchase.getAdhat().getId().equals(adhatId)) {
            throw new RuntimeException("Unauthorized access");
        }

        return purchase;
    }
}

