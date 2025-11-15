-- Nested CTE (referencing previous CTE)
WITH
  active_users AS (
    SELECT * FROM users WHERE active = TRUE
  ),
  active_users_with_orders AS (
    SELECT u.*, COUNT(o.id) AS order_count
    FROM active_users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id, u.name, u.email, u.active
  )
SELECT * FROM active_users_with_orders WHERE order_count > 0
