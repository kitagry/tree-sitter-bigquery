-- Complex JOIN condition with AND
SELECT *
FROM users u
JOIN orders o ON u.id = o.user_id AND o.status = active
