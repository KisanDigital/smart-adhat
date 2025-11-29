-- Sample Data for Smart Adhat H2 Database
-- Password: All users have password "admin123" (BCrypt encoded)

-- Insert sample Adhat (Shop) - Let Hibernate generate IDs
-- BCrypt hash for "admin123": $2a$10$vJy.i0LNXteM4vRN5W5k1ug6sDxYToqHEfT8kPE6fd6mKNVehBnAK
INSERT INTO adhats (shop_name, owner_name, username, password, phone, email, address, city, state, gst_number, license_number, active, public_price_visible, created_at)
VALUES
('Ram Traders', 'Ram Kumar Singh', 'ram', '$2a$10$vJy.i0LNXteM4vRN5W5k1ug6sDxYToqHEfT8kPE6fd6mKNVehBnAK', '9876543210', 'ram@traders.com', 'Main Market Road', 'Ludhiana', 'Punjab', '03AAACR1234A1Z5', 'ML2024001', true, false, CURRENT_TIMESTAMP),
('Sharma Grain Shop', 'Vijay Sharma', 'vijay', '$2a$10$vJy.i0LNXteM4vRN5W5k1ug6sDxYToqHEfT8kPE6fd6mKNVehBnAK', '9876543211', 'vijay@grains.com', 'Grain Market Street', 'Jalandhar', 'Punjab', '03AAACS5678B2Z6', 'ML2024002', true, false, CURRENT_TIMESTAMP),
('Patel Commodity', 'Suresh Patel', 'suresh', '$2a$10$vJy.i0LNXteM4vRN5W5k1ug6sDxYToqHEfT8kPE6fd6mKNVehBnAK', '9876543212', 'suresh@commodity.com', 'Mandi Complex', 'Amritsar', 'Punjab', '03AAACT9012C3Z7', 'ML2024003', true, false, CURRENT_TIMESTAMP);

-- Insert sample Products - Let Hibernate generate IDs
INSERT INTO products (name, name_hindi, category, unit, description, active, created_at)
VALUES
('Wheat', 'गेहूं', 'WHEAT', 'QUINTAL', 'Common wheat variety', true, CURRENT_TIMESTAMP),
('Basmati Rice', 'बासमती चावल', 'RICE', 'QUINTAL', 'Premium basmati rice', true, CURRENT_TIMESTAMP),
('Chana Dal', 'चना दाल', 'GRAM', 'QUINTAL', 'Bengal gram split', true, CURRENT_TIMESTAMP),
('Moong Dal', 'मूंग दाल', 'MOONG', 'QUINTAL', 'Green gram split', true, CURRENT_TIMESTAMP),
('Mustard Seeds', 'सरसों', 'SARSO', 'QUINTAL', 'Black mustard seeds', true, CURRENT_TIMESTAMP),
('Potato', 'आलू', 'OTHER', 'QUINTAL', 'Fresh potatoes', true, CURRENT_TIMESTAMP),
('Onion', 'प्याज', 'OTHER', 'QUINTAL', 'Red onions', true, CURRENT_TIMESTAMP),
('Turmeric', 'हल्दी', 'OTHER', 'QUINTAL', 'Ground turmeric', true, CURRENT_TIMESTAMP),
('Cumin', 'जीरा', 'OTHER', 'KG', 'Cumin seeds', true, CURRENT_TIMESTAMP),
('Apple', 'सेब', 'OTHER', 'QUINTAL', 'Fresh red apples', true, CURRENT_TIMESTAMP);

-- Insert sample Purchases (for user ram - adhat_id = 1)
INSERT INTO purchases (adhat_id, product_id, quantity, price_per_unit, total_amount, seller_name, seller_type, seller_phone, purchase_date, vehicle_number, advance_paid, payment_status, notes, created_at)
VALUES
(1, 1, 50.00, 2000.00, 100000.00, 'Farmer Harjeet Singh', 'FARMER', '9123456789', DATEADD('DAY', -5, CURRENT_DATE), 'PB03-1234', 20000.00, 'PENDING', 'Good quality wheat', CURRENT_TIMESTAMP),
(1, 2, 30.00, 4500.00, 135000.00, 'Farmer Kuldeep Singh', 'FARMER', '9123456790', DATEADD('DAY', -3, CURRENT_DATE), 'PB03-5678', 50000.00, 'PENDING', 'Premium basmati', CURRENT_TIMESTAMP),
(1, 3, 20.00, 5000.00, 100000.00, 'Middleman Rajesh', 'MIDDLEMAN', '9123456791', DATEADD('DAY', -2, CURRENT_DATE), 'PB03-9012', 100000.00, 'COMPLETED', 'Chana dal bulk order', CURRENT_TIMESTAMP),
(1, 6, 100.00, 800.00, 80000.00, 'Farmer Gurmeet Singh', 'FARMER', '9123456792', DATEADD('DAY', -1, CURRENT_DATE), 'PB03-3456', 30000.00, 'PENDING', 'Fresh potatoes', CURRENT_TIMESTAMP);

-- Insert sample Sales (for user ram - adhat_id = 1)
INSERT INTO sales (adhat_id, product_id, quantity, price_per_unit, total_amount, buyer_name, buyer_type, buyer_phone, sale_date, vehicle_number, advance_received, payment_status, notes, created_at)
VALUES
(1, 1, 30.00, 2300.00, 69000.00, 'Sharma Flour Mill', 'MILL', '9234567890', DATEADD('DAY', -4, CURRENT_DATE), 'PB05-1111', 20000.00, 'PENDING', 'Regular client', CURRENT_TIMESTAMP),
(1, 2, 15.00, 5000.00, 75000.00, 'Verma Rice Trader', 'TRADER', '9234567891', DATEADD('DAY', -2, CURRENT_DATE), 'PB05-2222', 75000.00, 'COMPLETED', 'Cash payment', CURRENT_TIMESTAMP),
(1, 3, 10.00, 5500.00, 55000.00, 'Gupta Traders', 'TRADER', '9234567892', DATEADD('DAY', -1, CURRENT_DATE), 'PB05-3333', 30000.00, 'PENDING', 'Dal export order', CURRENT_TIMESTAMP);

-- Insert Inventory (calculated from purchases and sales for adhat_id = 1)
INSERT INTO inventory (adhat_id, product_id, quantity, created_at, updated_at)
VALUES
(1, 1, 20.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Wheat: 50 purchased - 30 sold = 20
(1, 2, 15.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Rice: 30 purchased - 15 sold = 15
(1, 3, 10.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),  -- Chana: 20 purchased - 10 sold = 10
(1, 6, 100.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP); -- Potato: 100 purchased - 0 sold = 100

-- Insert sample Prices (for adhat_id = 1)
INSERT INTO prices (adhat_id, product_id, buying_price, selling_price, effective_date, active, created_at)
VALUES
(1, 1, 2000.00, 2300.00, CURRENT_DATE, true, CURRENT_TIMESTAMP),
(1, 2, 4500.00, 5000.00, CURRENT_DATE, true, CURRENT_TIMESTAMP),
(1, 3, 5000.00, 5500.00, CURRENT_DATE, true, CURRENT_TIMESTAMP),
(1, 4, 6000.00, 6600.00, CURRENT_DATE, true, CURRENT_TIMESTAMP),
(1, 5, 7000.00, 7700.00, CURRENT_DATE, true, CURRENT_TIMESTAMP),
(1, 6, 800.00, 1000.00, CURRENT_DATE, true, CURRENT_TIMESTAMP),
(1, 7, 1500.00, 1800.00, CURRENT_DATE, true, CURRENT_TIMESTAMP),
(1, 8, 15000.00, 17000.00, CURRENT_DATE, true, CURRENT_TIMESTAMP);

-- Note: The password for all test users is "admin123"
-- Use username: ram, vijay, or suresh with password: admin123

