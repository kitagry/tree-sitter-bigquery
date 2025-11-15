-- PARTITION BY with ORDER BY
SELECT
  department,
  name,
  salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank
FROM employees

-- LAG function
SELECT
  date,
  revenue,
  LAG(revenue, 1) OVER (ORDER BY date) AS previous_day_revenue
FROM sales

-- LEAD function
SELECT
  date,
  revenue,
  LEAD(revenue, 1) OVER (ORDER BY date) AS next_day_revenue
FROM sales

-- Multiple window functions
SELECT
  department,
  name,
  salary,
  ROW_NUMBER() OVER (PARTITION BY department ORDER BY salary DESC) AS dept_rank,
  AVG(salary) OVER (PARTITION BY department) AS dept_avg_salary
FROM employees
