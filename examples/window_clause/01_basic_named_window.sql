-- Basic named window definition
SELECT
  name,
  salary,
  AVG(salary) OVER w AS avg_salary
FROM employees
WINDOW w AS (ORDER BY salary DESC)

-- Using named window with multiple functions
SELECT
  name,
  salary,
  AVG(salary) OVER w AS avg_salary,
  RANK() OVER w AS rank
FROM employees
WINDOW w AS (ORDER BY salary DESC)
