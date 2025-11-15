-- Multiple CTEs
WITH
  active_users AS (
    SELECT * FROM users WHERE active = TRUE
  ),
  high_value_orders AS (
    SELECT * FROM orders WHERE amount > 1000
  )
SELECT
  u.name,
  o.amount
FROM active_users u
JOIN high_value_orders o ON u.id = o.user_id
