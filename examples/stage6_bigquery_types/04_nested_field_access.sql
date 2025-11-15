-- Nested field access (dot notation)
SELECT user.name.first FROM customers

-- Multiple levels
SELECT order.shipping.address.city FROM orders

-- Array element access is not covered in this stage
