-- Subquery in WHERE clause with IN
SELECT *
FROM users
WHERE id IN (SELECT user_id FROM orders WHERE amount > 100)

-- Subquery in WHERE clause with EXISTS
SELECT *
FROM users
WHERE EXISTS (SELECT 1 FROM orders WHERE user_id = users.id)
