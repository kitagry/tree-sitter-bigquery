-- Simple UPDATE
UPDATE users
SET name = 'Jane Doe'
WHERE id = 1

-- UPDATE with multiple columns
UPDATE users
SET
  name = 'John Smith',
  email = 'john.smith@example.com',
  updated_at = CURRENT_TIMESTAMP()
WHERE id = 1

-- UPDATE with expression
UPDATE products
SET price = price * 1.1
WHERE category = 'electronics'
