-- Multiple named windows
SELECT
  department,
  name,
  salary,
  AVG(salary) OVER dept_window AS dept_avg,
  AVG(salary) OVER company_window AS company_avg
FROM employees
WINDOW
  dept_window AS (PARTITION BY department),
  company_window AS (ORDER BY salary DESC)

-- Multiple named windows with different specifications
SELECT
  department,
  name,
  salary,
  hire_date,
  RANK() OVER dept_rank AS dept_rank,
  ROW_NUMBER() OVER hire_order AS hire_order
FROM employees
WINDOW
  dept_rank AS (PARTITION BY department ORDER BY salary DESC),
  hire_order AS (ORDER BY hire_date)
