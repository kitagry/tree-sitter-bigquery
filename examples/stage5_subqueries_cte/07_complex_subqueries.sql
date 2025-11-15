-- Complex query with both CTEs and subqueries
WITH top_users AS (
  SELECT id, name
  FROM users
  WHERE id IN (
    SELECT user_id
    FROM orders
    GROUP BY user_id
    HAVING SUM(amount) > 10000
  )
)
SELECT
  t.name,
  (SELECT COUNT(*) FROM orders WHERE user_id = t.id) AS order_count
FROM top_users t
