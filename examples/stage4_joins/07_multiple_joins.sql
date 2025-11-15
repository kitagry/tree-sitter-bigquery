-- Multiple JOINs
SELECT u.name, o.amount, p.title
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN products p ON o.product_id = p.id
WHERE u.active = TRUE
