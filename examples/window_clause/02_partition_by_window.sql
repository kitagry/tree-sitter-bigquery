-- Named window with PARTITION BY
SELECT
  department,
  name,
  salary,
  AVG(salary) OVER w AS dept_avg
FROM employees
WINDOW w AS (PARTITION BY department)

-- Named window with PARTITION BY and ORDER BY
SELECT
  department,
  name,
  salary,
  AVG(salary) OVER w AS dept_avg,
  ROW_NUMBER() OVER w AS dept_rank
FROM employees
WINDOW w AS (PARTITION BY department ORDER BY salary DESC)
