package com.smartadhat.service;

import com.smartadhat.dto.SaleRequest;
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
public class SaleService {

    private final SaleRepository saleRepository;
    private final InventoryRepository inventoryRepository;
    private final AdhatRepository adhatRepository;
    private final ProductRepository productRepository;

    @Transactional
    public Sale createSale(Long adhatId, SaleRequest request) {
        Adhat adhat = adhatRepository.findById(adhatId)
                .orElseThrow(() -> new RuntimeException("Adhat not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Check inventory
        Inventory inventory = inventoryRepository.findByAdhatIdAndProductId(adhatId, request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not in inventory"));

        if (inventory.getQuantity().compareTo(request.getQuantity()) < 0) {
            throw new RuntimeException("Insufficient stock. Available: " + inventory.getQuantity());
        }

        // Calculate total amount
        BigDecimal totalAmount = request.getQuantity().multiply(request.getPricePerUnit());

        // Create sale
        Sale sale = new Sale();
        sale.setAdhat(adhat);
        sale.setProduct(product);
        sale.setQuantity(request.getQuantity());
        sale.setPricePerUnit(request.getPricePerUnit());
        sale.setTotalAmount(totalAmount);
        sale.setBuyerName(request.getBuyerName());
        sale.setBuyerType(request.getBuyerType());
        sale.setBuyerPhone(request.getBuyerPhone());
        sale.setVehicleNumber(request.getVehicleNumber());
        sale.setDriverName(request.getDriverName());
        sale.setDriverPhone(request.getDriverPhone());
        sale.setSaleDate(request.getSaleDate());
        sale.setBillNumber(request.getBillNumber());
        sale.setNotes(request.getNotes());
        sale.setAdvanceReceived(request.getAdvanceReceived());

        // Calculate balance
        BigDecimal advanceReceived = request.getAdvanceReceived() != null ? request.getAdvanceReceived() : BigDecimal.ZERO;
        sale.setBalanceAmount(totalAmount.subtract(advanceReceived));

        // Set payment status
        if (request.getPaymentStatus() != null) {
            sale.setPaymentStatus(request.getPaymentStatus());
        } else if (advanceReceived.compareTo(BigDecimal.ZERO) == 0) {
            sale.setPaymentStatus(PaymentStatus.PENDING);
        } else if (advanceReceived.compareTo(totalAmount) >= 0) {
            sale.setPaymentStatus(PaymentStatus.COMPLETED);
        } else {
            sale.setPaymentStatus(PaymentStatus.PARTIAL);
        }

        sale = saleRepository.save(sale);

        // Update inventory
        updateInventoryAfterSale(inventory, request.getQuantity());

        return sale;
    }

    private void updateInventoryAfterSale(Inventory inventory, BigDecimal quantity) {
        BigDecimal newQuantity = inventory.getQuantity().subtract(quantity);
        inventory.setQuantity(newQuantity);

        if (inventory.getAverageBuyPrice() != null) {
            inventory.setTotalValue(newQuantity.multiply(inventory.getAverageBuyPrice()));
        }

        inventoryRepository.save(inventory);
    }

    public List<Sale> getAdhatSales(Long adhatId) {
        return saleRepository.findByAdhatIdOrderBySaleDateDesc(adhatId);
    }

    public List<Sale> getAdhatSalesByDateRange(Long adhatId, LocalDate startDate, LocalDate endDate) {
        return saleRepository.findByAdhatIdAndSaleDateBetween(adhatId, startDate, endDate);
    }

    public Sale getSaleById(Long id, Long adhatId) {
        Sale sale = saleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sale not found"));

        if (!sale.getAdhat().getId().equals(adhatId)) {
            throw new RuntimeException("Unauthorized access");
        }

        return sale;
    }
}

