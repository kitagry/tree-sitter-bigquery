-- GROUP BY with single column
SELECT status, COUNT(*) FROM users GROUP BY status

-- GROUP BY with multiple columns
SELECT category, year, SUM(revenue) FROM sales GROUP BY category, year
