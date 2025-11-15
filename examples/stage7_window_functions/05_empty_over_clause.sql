-- Empty OVER clause (all rows in result set)
SELECT
  name,
  salary,
  AVG(salary) OVER () AS overall_avg
FROM employees

-- COUNT with empty OVER
SELECT
  name,
  COUNT(*) OVER () AS total_count
FROM employees
