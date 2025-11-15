-- Table aliases
SELECT u.id, u.name, o.amount
FROM users AS u
JOIN orders AS o ON u.id = o.user_id

-- Table aliases without AS keyword
SELECT u.id, u.name, o.amount
FROM users u
JOIN orders o ON u.id = o.user_id
