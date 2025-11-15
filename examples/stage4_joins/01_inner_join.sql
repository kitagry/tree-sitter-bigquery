-- Simple INNER JOIN
SELECT * FROM users INNER JOIN orders ON users.id = orders.user_id

-- INNER JOIN without INNER keyword (implicit)
SELECT * FROM users JOIN orders ON users.id = orders.user_id
