-- Arithmetic operators
SELECT
  price + tax AS total,
  quantity * price AS subtotal,
  discount - fee AS net_discount,
  total / count AS average,
  amount % 10 AS remainder
FROM orders

-- BETWEEN operator
SELECT * FROM products WHERE price BETWEEN 100 AND 500

-- LIKE operator
SELECT * FROM users WHERE name LIKE 'John%'
SELECT * FROM users WHERE email LIKE '%@gmail.com'

-- IN operator with values
SELECT * FROM users WHERE status IN ('active', 'pending')

-- IS NULL / IS NOT NULL
SELECT * FROM users WHERE email IS NULL
SELECT * FROM users WHERE phone IS NOT NULL
