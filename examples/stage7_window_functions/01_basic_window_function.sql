-- Basic window function with ROW_NUMBER
SELECT
  name,
  salary,
  ROW_NUMBER() OVER (ORDER BY salary DESC) AS rank
FROM employees

-- RANK function
SELECT
  name,
  salary,
  RANK() OVER (ORDER BY salary DESC) AS rank
FROM employees
