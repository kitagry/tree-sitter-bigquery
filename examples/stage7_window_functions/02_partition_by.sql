-- PARTITION BY with aggregate function
SELECT
  department,
  name,
  salary,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg
FROM employees

-- Multiple PARTITION BY columns
SELECT
  department,
  location,
  name,
  salary,
  COUNT(*) OVER (PARTITION BY department, location) AS dept_location_count
FROM employees
