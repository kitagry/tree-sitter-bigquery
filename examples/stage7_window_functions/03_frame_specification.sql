-- ROWS BETWEEN with PRECEDING
SELECT
  date,
  revenue,
  SUM(revenue) OVER (
    ORDER BY date
    ROWS BETWEEN 6 PRECEDING AND CURRENT ROW
  ) AS rolling_7day_sum
FROM sales

-- ROWS BETWEEN with FOLLOWING
SELECT
  date,
  revenue,
  SUM(revenue) OVER (
    ORDER BY date
    ROWS BETWEEN CURRENT ROW AND 3 FOLLOWING
  ) AS next_3days_sum
FROM sales

-- ROWS BETWEEN UNBOUNDED
SELECT
  date,
  revenue,
  SUM(revenue) OVER (
    ORDER BY date
    ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
  ) AS cumulative_sum
FROM sales

-- RANGE BETWEEN
SELECT
  date,
  revenue,
  SUM(revenue) OVER (
    ORDER BY date
    RANGE BETWEEN INTERVAL 7 DAY PRECEDING AND CURRENT ROW
  ) AS rolling_week_sum
FROM sales
