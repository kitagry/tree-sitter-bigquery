-- Scalar subquery in SELECT clause
SELECT
  id,
  name,
  (SELECT COUNT(*) FROM orders WHERE user_id = users.id) AS order_count
FROM users
