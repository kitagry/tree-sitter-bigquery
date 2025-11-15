-- Various aggregate functions
SELECT
  COUNT(*) AS total,
  SUM(amount) AS total_amount,
  AVG(amount) AS average_amount,
  MIN(amount) AS min_amount,
  MAX(amount) AS max_amount
FROM transactions
