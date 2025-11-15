-- HAVING clause
SELECT status, COUNT(*) AS count
FROM users
GROUP BY status
HAVING COUNT(*) > 10
