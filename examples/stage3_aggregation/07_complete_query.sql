-- Complete query with all clauses
SELECT
  category,
  COUNT(*) AS product_count,
  AVG(price) AS avg_price
FROM products
WHERE active = TRUE
GROUP BY category
HAVING COUNT(*) > 5
ORDER BY avg_price DESC
LIMIT 10
